import { supabase } from '../config/supabase.js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

async function createTables() {
  try {
    console.log('🔧 Creating Supabase tables...');

    // Read the SQL file
    const sqlPath = join(__dirname, '../../../supabase/migrations/20251218000000_create_tables.sql');
    const sql = readFileSync(sqlPath, 'utf-8');

    // Split by semicolons and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
      if (error) {
        console.error('❌ Error executing statement:', error);
      }
    }

    console.log('✅ Tables created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createTables();
