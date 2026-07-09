import { createClient } from '@supabase/supabase-js';
import xlsx from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';
import WebSocket from 'ws';

global.WebSocket = WebSocket;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
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

async function run() {
  const filePath = path.resolve(__dirname, '../Sellads_Inventory.xlsx');
  console.log(`Reading Excel file: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.error("File not found!");
    process.exit(1);
  }

  const wb = xlsx.readFile(filePath);
  const rowsToInsert = [];

  // Fetch existing sites to prevent duplicates
  const { data: existingSites } = await supabase.from('sites').select('name');
  const existingNames = new Set(existingSites?.map(s => s.name) || []);

  for (const sheetName of wb.SheetNames) {
    console.log(`Processing sheet: ${sheetName}`);
    const ws = wb.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(ws);

    for (const row of data) {
      if (!row['Hoarding Location'] && !row['City']) continue;

      const name = row['Hoarding Location'] || 'Unknown Site';
      
      // Skip if already exists
      if (existingNames.has(name)) {
        continue;
      }

      const site = {
        name: name,
        city: row['City'] || 'Unknown',
        area: row['Re+L:Ogion'] || sheetName, // Use sheet name as fallback area if missing
        size: `${row['W'] || 0}x${row['H'] || 0}`,
        type: row['Media'] || 'Billboard',
        lit_type: row[' LIT/ N.LIT'] || 'Non-Lit',
        lat: parseFloat(row['Lattitude']) || null,
        lng: parseFloat(row['Longitude']) || null,
        rationale: row['Rational'] || null,
        net_rate: parseInt(row['Net Rate']) || 0,
        dcpm_rate: parseInt(row['DCPM']) || 0,
        agency_rate: parseInt(row['Agency Rate']) || 0,
        status: 'Available'
      };

      rowsToInsert.push(site);
      existingNames.add(name); // Mark as added to prevent duplicates within the file itself
    }
  }

  console.log(`Prepared ${rowsToInsert.length} NEW records for insertion across all sheets.`);
  
  if (rowsToInsert.length === 0) {
    console.log("No new records to insert.");
    return;
  }

  // Insert in batches of 100 to avoid request limits
  const batchSize = 100;
  let totalInserted = 0;
  
  for (let i = 0; i < rowsToInsert.length; i += batchSize) {
    const batch = rowsToInsert.slice(i, i + batchSize);
    const { data: result, error } = await supabase.from('sites').insert(batch).select();
    
    if (error) {
      console.error("Error inserting batch:", error);
    } else {
      totalInserted += result?.length || 0;
    }
  }

  console.log(`Successfully inserted ${totalInserted} new sites across ${wb.SheetNames.length} sheets!`);
}

run();
