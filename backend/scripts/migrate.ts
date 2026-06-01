import fs from 'fs';
import path from 'path';
import pool from '../src/db/pool';

async function main() {
  const sql = fs.readFileSync(
    path.join(__dirname, '../src/db/migrate.sql'),
    'utf8'
  );
  await pool.query(sql);
  console.log('Migration completed successfully');
  await pool.end();
}

main().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
