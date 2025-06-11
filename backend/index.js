// backend/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query } from './db.js';
import logger from './logger.js'; // ✅ import winston logger

dotenv.config();

const app = express();
app.use(cors({
  origin: '*'
}));
app.use(express.json());

const PORT = process.env.PORT || 4000;

// ✅ Create tables: users + logs
const createTables = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS logs (
        id SERIAL PRIMARY KEY,
        action VARCHAR(50),
        email VARCHAR(100),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Tables checked/created.");
  } catch (error) {
    logger.error(`❌ Table creation failed: ${error.message}`);
  }
};

createTables();

// ✅ Signup route
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    logger.warn("Signup failed: Missing fields");
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const existing = await query('SELECT * FROM users WHERE email = $1', [email]);

    if (existing.rows.length > 0) {
      logger.warn(`Signup failed: Email already exists - ${email}`);
      return res.status(400).json({ message: 'Email already exists' });
    }

    await query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [
      name, email, password,
    ]);

    await query('INSERT INTO logs (action, email) VALUES ($1, $2)', ['signup', email]);
    logger.info(`✅ User registered: ${email}`);
    return res.status(200).json({ message: 'Signup successful' });
  } catch (err) {
    logger.error(`❌ Error in /signup: ${err.message}`);
    return res.status(500).json({ message: 'Server error during signup' });
  }
});

// ✅ Signin route
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.warn('Signin failed: Missing fields');
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const userRes = await query(
      'SELECT id, name, email FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (userRes.rows.length === 0) {
      logger.warn(`⚠️ Invalid login for email: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    await query('INSERT INTO logs (action, email) VALUES ($1, $2)', ['signin', email]);
    logger.info(`✅ User logged in: ${email}`);
    res.json(userRes.rows[0]);
  } catch (err) {
    logger.error(`❌ Error in /signin: ${err.message}`);
    res.status(500).json({ message: 'Server error during signin' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  logger.info(`Server started on port ${PORT}`);
});
