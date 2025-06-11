// backend/db.js
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,  // <- This is IMPORTANT for Render PostgreSQL
  },
});

export const query = (text, params) => pool.query(text, params);
export default pool;
