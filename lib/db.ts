import { neon } from '@neondatabase/serverless';

// Get database connection
export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return neon(process.env.DATABASE_URL);
}

// Initialize database schema
export async function initDb() {
  const sql = getDb();

  // Create posts table
  await sql`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      content TEXT NOT NULL,
      date TIMESTAMP NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('draft', 'published')),
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;

  // Create index on slug for faster lookups
  await sql`
    CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug)
  `;

  // Create index on status for filtering published posts
  await sql`
    CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status)
  `;
}
