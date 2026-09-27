import { readFile } from 'node:fs/promises';
import pg from 'pg';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL é obrigatória');
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
try {
  const sql = await readFile(new URL('../database/seed.sql', import.meta.url), 'utf8');
  await pool.query(sql);
  console.log('Catálogo inicial aplicado');
} finally { await pool.end(); }
