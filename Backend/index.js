import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import pkg from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use(cors({
  origin: 'https://hackathon-agri-loop.vercel.app',
  credentials: true,
}));

app.use(bodyParser.json());
app.use(express.json())

// Email transporter
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Signup with email verification
app.post('/api/signup', async (req, res) => {
  const { 
    username, 
    full_name, 
    email, 
    gender, 
    date_of_birth, 
    city, 
    role, 
    password 
  } = req.body;

  // Validate required fields
  if (!username || !full_name || !email || !role || !password) {
    return res.status(400).json({ 
      error: 'Missing required fields: username, full_name, email, role, and password are required' 
    });
  }

  // Validate role
  if (!['Seller', 'Buyer'].includes(role)) {
    return res.status(400).json({ 
      error: 'Role must be either "Seller" or "Buyer"' 
    });
  }

  // Validate gender if provided
  if (gender && !['Male', 'Female', 'Other'].includes(gender)) {
    return res.status(400).json({ 
      error: 'Gender must be "Male", "Female", or "Other"' 
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Insert user with all fields
    await pool.query(
      `INSERT INTO users (username, full_name, email, gender, date_of_birth, city, role, password_hash, verified) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        username, 
        full_name, 
        email, 
        gender || null, 
        date_of_birth || null, 
        city || null, 
        role, 
        hashedPassword, 
        false
      ]
    );

    const verificationLink = `https://hackathon-agriloop.onrender.com/api/verify-email?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email - AgriLoop',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to AgriLoop, ${full_name}!</h2>
          <p>Thank you for signing up. Please verify your email address to complete your registration.</p>
          <p>
            <a href="${verificationLink}" 
               style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Verify Email Address
            </a>
          </p>
          <p>If the button doesn't work, you can also click this link:</p>
          <p><a href="${verificationLink}">${verificationLink}</a></p>
          <p>If you didn't create this account, please ignore this email.</p>
        </div>
      `
    });

    res.status(200).json({ 
      message: 'Signup successful. Check your email to verify your account.',
      user: {
        username,
        full_name,
        email,
        role
      }
    });

  } catch (err) {
    console.error('Signup error:', err);
    
    // Handle specific database errors
    if (err.code === '23505') { // PostgreSQL unique violation
      if (err.constraint === 'users_email_key') {
        return res.status(409).json({ error: 'Email already exists' });
      }
      if (err.constraint === 'users_username_key') {
        return res.status(409).json({ error: 'Username already exists' });
      }
    }
    
    res.status(500).json({ error: 'Error during signup. Please try again.' });
  }
});

// Verify email
app.get('/api/verify-email', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 400px;
            width: 100%;
          }
          .error-icon {
            color: #ef4444;
            font-size: 48px;
            margin-bottom: 20px;
          }
          h1 {
            color: #1f2937;
            margin-bottom: 16px;
            font-size: 24px;
          }
          p {
            color: #6b7280;
            line-height: 1.6;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="error-icon">⚠️</div>
          <h1>Verification Failed</h1>
          <p>Verification token is missing. Please check your email for the correct verification link.</p>
        </div>
      </body>
      </html>
    `);
  }

  try {
    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.email;

    // Check if user exists
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [userEmail]);

    if (userResult.rows.length === 0) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 12px;
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
              text-align: center;
              max-width: 400px;
              width: 100%;
            }
            .error-icon {
              color: #ef4444;
              font-size: 48px;
              margin-bottom: 20px;
            }
            h1 {
              color: #1f2937;
              margin-bottom: 16px;
              font-size: 24px;
            }
            p {
              color: #6b7280;
              line-height: 1.6;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="error-icon">❌</div>
            <h1>User Not Found</h1>
            <p>The user associated with this verification token could not be found.</p>
          </div>
        </body>
        </html>
      `);
    }

    // Update verified status
    await pool.query('UPDATE users SET verified = true WHERE email = $1', [userEmail]);

    // Return success HTML page
    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification Successful</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 400px;
            width: 100%;
            animation: slideIn 0.5s ease-out;
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .success-icon {
            color: #10b981;
            font-size: 48px;
            margin-bottom: 20px;
            animation: bounce 0.6s ease-in-out;
          }
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }
          h1 {
            color: #1f2937;
            margin-bottom: 16px;
            font-size: 24px;
            font-weight: 600;
          }
          p {
            color: #6b7280;
            line-height: 1.6;
            margin-bottom: 30px;
          }
          .login-btn {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 500;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
          }
          .login-btn:hover {
            background: #059669;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
          }
          .login-btn:active {
            transform: translateY(0);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="success-icon">✅</div>
          <h1>Your mail has been successfully verified</h1>
          <p>Great! Your email address has been verified. You can now access all features of your account.</p>
          <a href="https://hackathon-agri-loop.vercel.app/login" class="login-btn">
            Continue to Login
          </a>
        </div>
      </body>
      </html>
    `);

  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(400).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 400px;
            width: 100%;
          }
          .error-icon {
            color: #ef4444;
            font-size: 48px;
            margin-bottom: 20px;
          }
          h1 {
            color: #1f2937;
            margin-bottom: 16px;
            font-size: 24px;
          }
          p {
            color: #6b7280;
            line-height: 1.6;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="error-icon">⚠️</div>
          <h1>Verification Failed</h1>
          <p>Invalid or expired token. Please request a new verification email.</p>
        </div>
      </body>
      </html>
    `);
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = result.rows[0];

    // 2. Check if email is verified
    if (!user.verified) {
      return res.status(403).json({ message: 'Email not verified. Please verify your email to log in.' });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }

    // 4. Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // 5. Respond with token and user info (optional)
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// Get user profile
app.get('/api/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Missing token' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { rows } = await pool.query('SELECT username, full_name, email, gender, date_of_birth, city, role FROM users WHERE id = $1', [decoded.userId]);

    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

    res.json(rows[0]);
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(403).json({ message: 'Invalid token' });
  }
});

// SELLER DASHBOARD ENDPOINTS

// Get seller dashboard data
app.get('/api/seller/dashboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get today's revenue and pickups
    const todayQuery = `
      SELECT 
        COALESCE(SUM(wl.expected_price), 0) as today_revenue,
        COUNT(*) as today_pickups
      FROM waste_listings wl 
      WHERE wl.seller_id = $1 
      AND wl.status = 'picked_up' 
      AND DATE(wl.updated_at) = CURRENT_DATE
    `;
    const todayResult = await pool.query(todayQuery, [userId]);

    // Get weekly revenue
    const weeklyQuery = `
      SELECT COALESCE(SUM(wl.expected_price), 0) as weekly_revenue
      FROM waste_listings wl 
      WHERE wl.seller_id = $1 
      AND wl.status = 'picked_up' 
      AND wl.updated_at >= CURRENT_DATE - INTERVAL '7 days'
    `;
    const weeklyResult = await pool.query(weeklyQuery, [userId]);

    // Get monthly revenue
    const monthlyQuery = `
      SELECT COALESCE(SUM(wl.expected_price), 0) as monthly_revenue
      FROM waste_listings wl 
      WHERE wl.seller_id = $1 
      AND wl.status = 'picked_up' 
      AND EXTRACT(MONTH FROM wl.updated_at) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM wl.updated_at) = EXTRACT(YEAR FROM CURRENT_DATE)
    `;
    const monthlyResult = await pool.query(monthlyQuery, [userId]);

    // Get total pickups this month
    const pickupsQuery = `
      SELECT COUNT(*) as total_pickups
      FROM waste_listings wl 
      WHERE wl.seller_id = $1 
      AND wl.status = 'picked_up' 
      AND EXTRACT(MONTH FROM wl.updated_at) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM wl.updated_at) = EXTRACT(YEAR FROM CURRENT_DATE)
    `;
    const pickupsResult = await pool.query(pickupsQuery, [userId]);

    // Calculate environmental impact
    const impactQuery = `
      SELECT 
        COALESCE(SUM(wl.quantity), 0) as waste_processed,
        COALESCE(SUM(wl.quantity * 0.95), 0) as co2_saved,
        COALESCE(SUM(wl.quantity * 0.95 / 22), 0) as trees_equivalent
      FROM waste_listings wl 
      WHERE wl.seller_id = $1 
      AND wl.status = 'picked_up'
      AND EXTRACT(MONTH FROM wl.updated_at) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM wl.updated_at) = EXTRACT(YEAR FROM CURRENT_DATE)
    `;
    const impactResult = await pool.query(impactQuery, [userId]);

    const dashboardData = {
      todayRevenue: todayResult.rows[0].today_revenue,
      todayPickups: todayResult.rows[0].today_pickups,
      weeklyRevenue: weeklyResult.rows[0].weekly_revenue,
      monthlyRevenue: monthlyResult.rows[0].monthly_revenue,
      totalPickups: pickupsResult.rows[0].total_pickups,
      todayChange: "+12.5%", // Mock data for now
      weeklyChange: "+8.2%", // Mock data for now
      monthlyChange: "+15.3%", // Mock data for now
      newPickups: 5, // Mock data for now
      co2Saved: Math.round(impactResult.rows[0].co2_saved * 100) / 100,
      wasteProcessed: impactResult.rows[0].waste_processed,
      treesEquivalent: Math.round(impactResult.rows[0].trees_equivalent)
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get seller's waste listings
app.get('/api/seller/listings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const query = `
      SELECT 
        wl.*,
        u.username as buyer_username
      FROM waste_listings wl
      LEFT JOIN matches m ON wl.id = m.listing_id AND m.status = 'pending'
      LEFT JOIN users u ON m.buyer_id = u.id
      WHERE wl.seller_id = $1
      ORDER BY wl.created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    
    res.json({ listings: result.rows });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new waste listing
app.post('/api/seller/listings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { waste_type, quantity, location, expected_price, description } = req.body;

    // Validate required fields
    if (!waste_type || !quantity || !location || !expected_price) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const query = `
      INSERT INTO waste_listings (seller_id, waste_type, quantity, location, expected_price, description, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'listed')
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      userId, 
      waste_type, 
      parseInt(quantity), 
      location, 
      parseFloat(expected_price), 
      description || null
    ]);
    
    res.status(201).json({ 
      message: 'Listing created successfully',
      listing: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept a match for a listing
app.put('/api/seller/listings/:id/accept', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const listingId = req.params.id;

    // Start transaction
    await pool.query('BEGIN');

    // Update listing status to picked_up
    const updateListingQuery = `
      UPDATE waste_listings 
      SET status = 'picked_up', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND seller_id = $2
      RETURNING *
    `;
    const listingResult = await pool.query(updateListingQuery, [listingId, userId]);

    if (listingResult.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Update match status to accepted
    const updateMatchQuery = `
      UPDATE matches 
      SET status = 'accepted', updated_at = CURRENT_TIMESTAMP
      WHERE listing_id = $1 AND status = 'pending'
    `;
    await pool.query(updateMatchQuery, [listingId]);

    await pool.query('COMMIT');

    res.json({ message: 'Match accepted successfully' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error accepting match:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Decline a match for a listing
app.put('/api/seller/listings/:id/decline', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const listingId = req.params.id;

    // Start transaction
    await pool.query('BEGIN');

    // Update listing status back to listed
    const updateListingQuery = `
      UPDATE waste_listings 
      SET status = 'listed', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND seller_id = $2
      RETURNING *
    `;
    const listingResult = await pool.query(updateListingQuery, [listingId, userId]);

    if (listingResult.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Update match status to declined
    const updateMatchQuery = `
      UPDATE matches 
      SET status = 'declined', updated_at = CURRENT_TIMESTAMP
      WHERE listing_id = $1 AND status = 'pending'
    `;
    await pool.query(updateMatchQuery, [listingId]);

    await pool.query('COMMIT');

    res.json({ message: 'Match declined successfully' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error declining match:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Test Route
app.get('/', (req, res) => {
  res.send('AgriLoop Backend is running');
});

// Start server
app.listen(port, () => {
  console.log(`AgriLoop backend running on port ${port}`);
});