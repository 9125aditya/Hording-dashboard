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
    if (sheetName !== 'Nagpur') continue;
    
    console.log(`Processing sheet: ${sheetName}`);
    const ws = wb.Sheets[sheetName];
    // Read as array of arrays to find the actual header row
    const rawData = xlsx.utils.sheet_to_json(ws, { header: 1 });

    let headerRowIndex = -1;
    let headers = [];

    // Find the header row (look for typical columns)
    for (let i = 0; i < Math.min(15, rawData.length); i++) {
      const row = rawData[i];
      if (!Array.isArray(row)) continue;
      
      const rowStr = row.map(c => String(c || '').toLowerCase().trim());
      if (
        rowStr.includes('location') || 
        rowStr.includes('hoarding location') || 
        rowStr.includes('locations') || 
        rowStr.includes('hoardng locations') ||
        rowStr.includes('w') ||
        rowStr.includes('city')
      ) {
        headerRowIndex = i;
        headers = rowStr;
        break;
      }
    }

    if (headerRowIndex === -1) {
      console.log(`  -> Skipping ${sheetName}: Could not identify a header row.`);
      continue;
    }

    // Helper to find column index
    const findCol = (...possibilities) => {
      for (const p of possibilities) {
        const idx = headers.findIndex(h => h && h.includes(p.toLowerCase()));
        if (idx !== -1) return idx;
      }
      return -1;
    };

    const locIdx = findCol('hoarding location', 'locations', 'location', 'hoardng locations', 'site');
    const cityIdx = findCol('city');
    const areaIdx = findCol('region', 'area');
    const wIdx = findCol('w', 'width');
    const hIdx = findCol('h', 'height');
    const typeIdx = findCol('media', 'type');
    const litIdx = findCol('lit', 'lit/ n.lit');
    const latIdx = findCol('lattitude', 'lat');
    const lngIdx = findCol('longitude', 'lng');
    const ratIdx = findCol('rational', 'rationale');
    const netIdx = findCol('net rate', 'net');
    const dcpmIdx = findCol('dcpm');
    const agencyIdx = findCol('agency');

    for (let i = headerRowIndex + 1; i < rawData.length; i++) {
      const row = rawData[i];
      if (!row || row.length === 0) continue;

      const getVal = (idx) => idx !== -1 ? row[idx] : null;

      const name = getVal(locIdx);
      const city = getVal(cityIdx);
      const width = getVal(wIdx);
      const height = getVal(hIdx);
      
      if (!name && !city && !width) continue; // Empty or irrelevant row

      let siteName = (name ? String(name).trim() : `Unknown Site - ${sheetName} - Row ${i}`);

      // Handle duplicate names on the same sheet by appending a number
      let originalName = siteName;
      let counter = 1;
      while (existingNames.has(siteName)) {
        siteName = `${originalName} (${counter})`;
        counter++;
      }

      const site = {
        name: siteName,
        city: city ? String(city).trim() : (sheetName.toLowerCase().includes('metro') || sheetName.toLowerCase().includes('ngp') ? 'Nagpur' : sheetName),
        area: getVal(areaIdx) ? String(getVal(areaIdx)).trim() : sheetName,
        size: width && height ? `${width}x${height}` : (width ? String(width) : 'Unknown'),
        type: getVal(typeIdx) ? String(getVal(typeIdx)).trim() : 'Billboard',
        lit_type: getVal(litIdx) ? String(getVal(litIdx)).trim() : 'Non-Lit',
        lat: parseFloat(getVal(latIdx)) || null,
        lng: parseFloat(getVal(lngIdx)) || null,
        rationale: getVal(ratIdx) ? String(getVal(ratIdx)).trim() : null,
        net_rate: parseInt(String(getVal(netIdx)).replace(/[^0-9]/g, '')) || 0,
        dcpm_rate: parseInt(String(getVal(dcpmIdx)).replace(/[^0-9]/g, '')) || 0,
        agency_rate: parseInt(String(getVal(agencyIdx)).replace(/[^0-9]/g, '')) || 0,
        status: 'Available'
      };

      rowsToInsert.push(site);
      existingNames.add(siteName);
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
