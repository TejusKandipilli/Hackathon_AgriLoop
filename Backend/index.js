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
  credentials: true, // if you're using cookies or authorization headers
}));

app.use(bodyParser.json());

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
    return res.status(400).json({ success: false, message: 'Verification token is missing.' });
  }

  try {
    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.email;

    // Check if user exists
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [userEmail]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Update verified status
    await pool.query('UPDATE users SET verified = true WHERE email = $1', [userEmail]);

    return res.status(200).json({ success: true, message: 'Email verified successfully. You can now log in.' });

  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(400).json({ success: false, message: 'Invalid or expired token.' });
  }
});


// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(400).send('User not found.');

    const user = result.rows[0];
    if (!user.verified) return res.status(403).send('Email not verified.');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send('Incorrect password.');

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error logging in.');
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
