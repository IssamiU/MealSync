import { pool } from "./database";

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      vegetarian BOOLEAN DEFAULT FALSE,
      gluten_free BOOLEAN DEFAULT FALSE,
      lactose_free BOOLEAN DEFAULT FALSE,
      refresh_token TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}