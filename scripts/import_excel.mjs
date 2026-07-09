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
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(ws);

  console.log(`Found ${data.length} rows.`);

  const rowsToInsert = [];

  for (const row of data) {
    // Skip empty rows
    if (!row['Hoarding Location'] && !row['City']) continue;

    // Map Excel to DB Schema
    const site = {
      name: row['Hoarding Location'] || 'Unknown Site',
      city: row['City'] || 'Unknown',
      area: row['Re+L:Ogion'] || 'Unknown',
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
  }

  console.log(`Prepared ${rowsToInsert.length} records for insertion. Sample:`);
  console.dir(rowsToInsert[0]);

  const { data: result, error } = await supabase.from('sites').insert(rowsToInsert).select();

  if (error) {
    console.error("Error inserting data into Supabase:", error);
  } else {
    console.log(`Successfully inserted ${result?.length} sites!`);
  }
}

run();
