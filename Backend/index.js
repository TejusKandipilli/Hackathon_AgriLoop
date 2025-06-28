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
  origin: 'http://localhost:5173',
  credentials: true, // if you're using cookies or authorization headers
}));

app.use(bodyParser.json());
app.use(express.json())

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

    const verificationLink = `http://localhost:3000/api/verify-email?token=${token}`;


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

// Test Route
app.get('/', (req, res) => {
  res.send('AgriLoop Backend is running');
});

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

app.post('/api/items',  async (req, res) => {
  const { name, waste_type, weight_kg, price } = req.body;
  const seller_id = req.user.id;

  const result = await pool.query(`
    INSERT INTO items (seller_id, name, waste_type, weight_kg, price)
    VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [seller_id, name, waste_type, weight_kg, price]
  );

  res.status(201).json(result.rows[0]);
});

app.get('/api/items',  async (req, res) => {
  const seller_id = req.user.id;

  const items = await pool.query(`
    SELECT * FROM items WHERE seller_id = $1 ORDER BY created_at DESC`,
    [seller_id]
  );

  res.json(items.rows);
});

const EMISSION_FACTOR = 1.5; // kg CO₂ saved per kg waste processed

app.post('/api/orders',  async (req, res) => {
  const { item_id, weight_kg } = req.body;
  const buyer_id = req.user.id;

  const itemRes = await pool.query(`SELECT * FROM items WHERE id = $1`, [item_id]);
  if (itemRes.rowCount === 0) return res.status(404).json({ error: 'Item not found' });

  const item = itemRes.rows[0];
  const amount_paid = (item.price / item.weight_kg) * weight_kg;
  const emissions_prevented_kg = weight_kg * EMISSION_FACTOR;

  const result = await pool.query(`
    INSERT INTO orders (
      item_id, buyer_id, seller_id,
      weight_kg, amount_paid, emissions_prevented_kg, status
    ) VALUES ($1, $2, $3, $4, $5, $6, 'pending') RETURNING *`,
    [item_id, buyer_id, item.seller_id, weight_kg, amount_paid, emissions_prevented_kg]
  );

  res.status(201).json(result.rows[0]);
});

app.put('/api/orders/:id/complete',  async (req, res) => {
  const { id } = req.params;
  const seller_id = req.user.id;

  const result = await pool.query(`
    UPDATE orders SET status = 'completed', completed_at = NOW()
    WHERE id = $1 AND seller_id = $2 RETURNING *`,
    [id, seller_id]
  );

  if (result.rowCount === 0) return res.status(404).json({ error: "Order not found or not yours" });

  res.json(result.rows[0]);
});

app.get('/api/orders/seller',  async (req, res) => {
  const seller_id = req.user.id;

  const result = await pool.query(`
    SELECT o.*, i.name, i.waste_type
    FROM orders o JOIN items i ON o.item_id = i.id
    WHERE o.seller_id = $1 ORDER BY created_at DESC`,
    [seller_id]
  );

  res.json(result.rows);
});

app.get('/api/orders/buyer',  async (req, res) => {
  const buyer_id = req.user.id;

  const result = await pool.query(`
    SELECT o.*, i.name, i.waste_type
    FROM orders o JOIN items i ON o.item_id = i.id
    WHERE o.buyer_id = $1 ORDER BY created_at DESC`,
    [buyer_id]
  );

  res.json(result.rows);
});

app.get('/api/dashboard/seller',  async (req, res) => {
  const seller_id = req.user.id;

  const totals = await pool.query(`
    SELECT
      COALESCE(SUM(amount_paid), 0) AS total_amount,
      COALESCE(SUM(weight_kg), 0) AS total_weight,
      COALESCE(SUM(emissions_prevented_kg), 0) AS total_emissions,
      COUNT(*) AS total_transactions
    FROM orders WHERE seller_id = $1 AND status = 'completed'`,
    [seller_id]
  );

  const history = await pool.query(`
    SELECT o.*, i.name, i.waste_type
    FROM orders o JOIN items i ON i.id = o.item_id
    WHERE o.seller_id = $1 ORDER BY o.created_at DESC`,
    [seller_id]
  );

  res.json({ totals: totals.rows[0], history: history.rows });
});

app.get('/api/dashboard/buyer',  async (req, res) => {
  const buyer_id = req.user.id;

  const totals = await pool.query(`
    SELECT
      COALESCE(SUM(amount_paid), 0) AS total_amount,
      COALESCE(SUM(weight_kg), 0) AS total_weight,
      COALESCE(SUM(emissions_prevented_kg), 0) AS total_emissions,
      COUNT(*) AS total_transactions
    FROM orders WHERE buyer_id = $1 AND status = 'completed'`,
    [buyer_id]
  );

  const history = await pool.query(`
    SELECT o.*, i.name, i.waste_type
    FROM orders o JOIN items i ON i.id = o.item_id
    WHERE o.buyer_id = $1 ORDER BY o.created_at DESC`,
    [buyer_id]
  );

  res.json({ totals: totals.rows[0], history: history.rows });
});

app.delete('/api/orders/:id',  async (req, res) => {
  const { id } = req.params;
  const buyer_id = req.user.id;

  const result = await pool.query(`
    DELETE FROM orders WHERE id = $1 AND buyer_id = $2 AND status = 'pending' RETURNING *`,
    [id, buyer_id]
  );

  if (result.rowCount === 0) return res.status(404).json({ error: 'Order not found or already completed' });

  res.json({ message: 'Order cancelled successfully' });
});

app.post('/api/logout', (req, res) => {
  return res.status(200).json({ message: 'Logged out successfully' });
});

// Start server
app.listen(port, () => {
  console.log(`AgriLoop backend running on port ${port}`);
});
