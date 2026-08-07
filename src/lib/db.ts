import { neon } from '@neondatabase/serverless';

// در محیط CI که DATABASE_URL ست نشده، build نباید کرش کنه.
// در Vercel/لوکال که DATABASE_URL واقعی هست، همون استفاده میشه.
const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://placeholder:placeholder@localhost:5432/placeholder';

const sql = neon(connectionString);
export default sql;
