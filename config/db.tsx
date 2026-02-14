import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Enable connection caching for faster queries
const sql = neon(process.env.DATABASE_URL!, {
  fetchConnectionCache: true,
});

export const db = drizzle({ client: sql });
