import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

async function runMigration() {
  const sql = neon(process.env.DATABASE_URL!);
  
  console.log('🚀 Starting database migration...');
  
  try {
    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'migrations', 'add_indexes.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
    
    console.log('📄 Running migration: add_indexes.sql');
    
    // Split SQL into individual statements and execute them
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.length > 0) {
        console.log(`   Executing: ${statement.substring(0, 60)}...`);
        // Use tagged template literal syntax
        await sql([statement] as any);
      }
    }
    
    console.log('✅ Migration completed successfully!');
    console.log('📊 Indexes created:');
    console.log('   - session_created_by_idx on createdBy');
    console.log('   - session_created_on_idx on createdOn');
    console.log('\n🎉 Your API should now be much faster!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('💡 Try running: npx drizzle-kit push');
    process.exit(1);
  }
}

runMigration();
