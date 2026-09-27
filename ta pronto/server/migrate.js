import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import pg from 'pg';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL é obrigatória');
const migrationsDir = fileURLToPath(new URL('../database/migrations/', import.meta.url));
const pool = new pg.Pool({ connectionString: databaseUrl, max: 1 });
const client = await pool.connect();

try {
  await client.query('select pg_advisory_lock(71920420)');
  await client.query(`create table if not exists schema_migrations (
    filename text primary key, checksum text not null, applied_at timestamptz not null default now()
  )`);
  const files = (await readdir(migrationsDir)).filter(name => /^\d+_[\w-]+\.sql$/.test(name)).sort();
  for (const filename of files) {
    const sql = await readFile(path.join(migrationsDir, filename), 'utf8');
    const checksum = createHash('sha256').update(sql).digest('hex');
    const previous = await client.query('select checksum from schema_migrations where filename=$1', [filename]);
    if (previous.rows[0]) {
      if (previous.rows[0].checksum !== checksum) throw new Error(`Migration alterada após aplicação: ${filename}`);
      continue;
    }
    await client.query(sql);
    await client.query('insert into schema_migrations(filename,checksum) values($1,$2)', [filename,checksum]);
    console.log(`Aplicada: ${filename}`);
  }
} finally {
  await client.query('select pg_advisory_unlock(71920420)').catch(() => {});
  client.release();
  await pool.end();
}
