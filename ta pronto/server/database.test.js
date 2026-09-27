import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

test('migrações e catálogo inicial executam em PostgreSQL', async () => {
  const db = new PGlite();
  try {
    for (const file of ['001_initial_schema.sql','002_application.sql','003_future_subscriptions.sql']) {
      const sql = await readFile(new URL(`../database/migrations/${file}`, import.meta.url), 'utf8');
      await db.exec(sql);
    }
    await db.exec(await readFile(new URL('../database/seed.sql', import.meta.url), 'utf8'));
    const categories = await db.query('select count(*)::int as total from service_categories');
    assert.ok(categories.rows[0].total >= 12);
    const free = await db.query('select count(*)::int as total from subscription_plans where is_active');
    assert.equal(free.rows[0].total, 0);
  } finally { await db.close(); }
});
