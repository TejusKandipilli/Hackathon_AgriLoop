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
const port = process.env.PORT || 5000;

// PostgreSQL connection
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'agriloop_db',
  password: 'your_password',
  port: 5432,
});

app.use(cors());
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
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

  try {
    await pool.query(
      'INSERT INTO users (email, password, verified) VALUES ($1, $2, $3)',
      [email, hashedPassword, false]
    );

    const verificationLink = `http://localhost:${port}/api/verify-email?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email - AgriLoop',
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`
    });

    res.status(200).send('Signup successful. Check your email to verify your account.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error during signup.');
  }
});

// Verify email
app.get('/api/verify-email', async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await pool.query('UPDATE users SET verified = true WHERE email = $1', [decoded.email]);
    res.send('Email verified successfully. You can now log in.');
  } catch (err) {
    console.error(err);
    res.status(400).send('Invalid or expired token.');
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

// Create Waste Listing
app.post('/api/waste', async (req, res) => {
  const { farmer_id, waste_type, quantity, frequency, location, image_url } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO waste_listings (farmer_id, waste_type, quantity, frequency, location, image_url, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *',
      [farmer_id, waste_type, quantity, frequency, location, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating waste listing');
  }
});

// Get All Waste Listings
app.get('/api/waste', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM waste_listings ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching listings');
  }
});

// Impact Calculator Endpoint (Mock for now)
app.post('/api/impact', (req, res) => {
  const { waste_type, quantity } = req.body;

  // Example impact factors
  const impact_factors = {
    manure: 1.8,
    crop_residue: 2.5,
    fruit_waste: 1.2,
  };

  const co2_saved = (impact_factors[waste_type] || 1.0) * quantity;
  const income_estimate = 3.5 * quantity; // ₹ per kg

  res.status(200).json({ co2_saved, income_estimate });
});

// Start server
app.listen(port, () => {
  console.log(`AgriLoop backend running on port ${port}`);
});
