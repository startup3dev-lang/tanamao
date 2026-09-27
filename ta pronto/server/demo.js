import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { PGlite } from '@electric-sql/pglite';
import bcrypt from 'bcryptjs';
import { createApp } from './app.js';

if (process.env.NODE_ENV === 'production') throw new Error('A demonstração não pode rodar em produção');

const origin = 'http://localhost:5173';
const db = new PGlite('./.demo-db');
const initialized = await db.query("select to_regclass('public.app_users') as table_name");
if (!initialized.rows[0].table_name) {
  for (const filename of ['001_initial_schema.sql', '002_application.sql', '003_future_subscriptions.sql']) {
    await db.exec(await readFile(new URL(`../database/migrations/${filename}`, import.meta.url), 'utf8'));
  }
}
await db.exec(await readFile(new URL('../database/seed.sql', import.meta.url), 'utf8'));

const demoAccounts = [
  { name: 'Prestador Demonstração', email: 'prestador.demo@tapronto.local', role: 'provider' },
  { name: 'Administrador Demonstração', email: 'admin.demo@tapronto.local', role: 'admin' },
];
const passwordHash = await bcrypt.hash('TesteLocal123!', 12);
for (const account of demoAccounts) {
  const found = await db.query('select id from app_users where email=$1', [account.email]);
  if (found.rows.length) continue;
  await db.transaction(async transaction => {
    const created = await transaction.query('insert into app_users(full_name,email,password_hash) values($1,$2,$3) returning id', [account.name, account.email, passwordHash]);
    await transaction.query('insert into user_roles(user_id,role) values($1,$2)', [created.rows[0].id, account.role]);
    if (account.role === 'provider') {
      await transaction.query(`insert into provider_profiles(user_id,public_name,bio,years_experience,verification_status,available_now)
        values($1,'João Reparos','Instalações e pequenos reparos em Teresina.',5,'verified',true)`, [created.rows[0].id]);
      await transaction.query(`insert into provider_services(provider_id,service_id,starting_price)
        select $1,id,100 from services where slug='eletricista'`, [created.rows[0].id]);
      await transaction.query(`insert into provider_availability(provider_id,weekday,starts_at,ends_at)
        select $1,weekday,'08:00','18:00' from generate_series(1,5) as weekday`, [created.rows[0].id]);
    }
  });
}

const app = createApp({ query: (sql, values) => db.query(sql, values), transaction: fn => db.transaction(fn) }, { webOrigin: origin });
const distDir = fileURLToPath(new URL('../dist/', import.meta.url));
app.use('/tanamao', express.static(distDir));
app.get(/^\/tanamao(?:\/.*)?$/, (_req, res) => res.sendFile(fileURLToPath(new URL('../dist/index.html', import.meta.url))));
app.get('/', (_req, res) => res.redirect('/tanamao/'));
const server = app.listen(5173, '127.0.0.1', () => console.log('Demonstração em http://localhost:5173/tanamao/'));
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => db.close().finally(() => process.exit(0))));
}
