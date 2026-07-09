import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';
import WebSocket from 'ws';

global.WebSocket = WebSocket;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.log("No .env.local found, hoping env vars are set");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function clearSites() {
  console.log("Clearing all sites from the database...");
  
  // Need to use a trick to delete all rows in Supabase without a specific ID filter
  // We can delete where id > 0 or where site_id is not null
  const { data, error } = await supabase
    .from('sites')
    .delete()
    .neq('site_id', '00000000-0000-0000-0000-000000000000'); // Dummy UUID to match all valid UUIDs

  if (error) {
    console.error("Error clearing sites:", error);
  } else {
    console.log("Successfully cleared all sites from the database!");
  }
}

clearSites();
