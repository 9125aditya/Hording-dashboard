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

const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
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

  const { data: existingSites } = await supabase.from('sites').select('name');
  const existingNames = new Set(existingSites?.map(s => s.name) || []);

  const ALLOWED_SHEETS = [
    "Nagpur",
    "Amravati Hoarding",
    "Akola Hoarding",
    "Chandrapur Hoarding",
    "Gondia",
    "Wardha",
    "Bhandara Hoarding ",
    "Metro Median Signages New",
    "Metro Pillar Signages CURRENT",
    "NGP KIOSK"
  ].map(s => s.toLowerCase().trim());

  for (const sheetName of wb.SheetNames) {
    if (!ALLOWED_SHEETS.includes(sheetName.toLowerCase().trim())) {
      console.log(`Skipping: ${sheetName}`);
      continue;
    }
    
    console.log(`Processing sheet: ${sheetName}`);
    const isMetroSheet = sheetName.toLowerCase().includes('metro');
    const ws = wb.Sheets[sheetName];
    const rawData = xlsx.utils.sheet_to_json(ws, { header: 1 });

    let headerRowIndex = -1;
    let headers = [];

    for (let i = 0; i < Math.min(20, rawData.length); i++) {
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

    const findCol = (...possibilities) => {
      for (const p of possibilities) {
        const lowerP = p.toLowerCase();
        // First try exact match
        let idx = headers.findIndex(h => h && h === lowerP);
        if (idx !== -1) return idx;
        
        // Then try loose match for longer strings (avoid matching 'h' inside 'hoarding')
        if (lowerP.length > 2) {
          idx = headers.findIndex(h => h && h.includes(lowerP));
          if (idx !== -1) return idx;
        }
      }
      return -1;
    };

    // Shared
    const locIdx = findCol('hoarding location', 'locations', 'location', 'hoardng locations', 'site');
    const cityIdx = findCol('city');
    const areaIdx = findCol('region', 'area');
    const typeIdx = findCol('media', 'type');
    const litIdx = findCol('lit', 'lit/ n.lit');
    const ratIdx = findCol('rational', 'rationale');
    const netIdx = findCol('net rate', 'net', 'rate per pillars (net)');
    const dcpmIdx = findCol('dcpm', 'rate per pillars (dcpm)');
    const agencyIdx = findCol('agency');
    const latIdx = findCol('lattitude', 'lat', 'latitude');
    const lngIdx = findCol('longitude', 'lng', 'long');

    // Normal Specific
    const wIdx = findCol('w', 'width');
    const hIdx = findCol('h', 'height');
    const printSizeIdx = findCol('printable size');
    const qtyIdx = findCol('qty.', 'qty');
    const totalSqFtIdx = findCol('total sq. ft.', 'total sq ft');
    
    // Metro Specific
    const lineIdx = findCol('line');
    const designSizeIdx = findCol('design size wxh', 'design size');
    const fromPillarsIdx = findCol('from pillars to pillars', 'pillars');
    const noPillarsIdx = findCol('no\'s of pillars', 'no of pillars');
    const noDisplaysIdx = findCol('no\'s of display', 'no of display');

    for (let i = headerRowIndex + 1; i < rawData.length; i++) {
      const row = rawData[i];
      if (!row || row.length === 0) continue;

      const getVal = (idx) => idx !== -1 ? row[idx] : null;

      const name = getVal(locIdx);
      const width = getVal(wIdx);
      const designSize = getVal(designSizeIdx);
      
      if (!name) continue; 

      let siteName = String(name).trim();

      // Handle duplicate names
      let originalName = siteName;
      let counter = 1;
      while (existingNames.has(siteName)) {
        siteName = `${originalName} (${counter})`;
        counter++;
      }

      const getNumeric = (val) => {
        if (!val) return 0;
        return parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0;
      };
      
      const getInt = (val) => {
        return Math.round(getNumeric(val));
      };

      const h = getVal(hIdx);
      let sizeStr = designSize ? String(designSize) : (width && h ? `${width}x${h}` : (width ? String(width) : 'Unknown'));

      const site = {
        name: siteName,
        is_metro: isMetroSheet,
        city: getVal(cityIdx) ? String(getVal(cityIdx)).trim() : (isMetroSheet || sheetName.toLowerCase().includes('ngp') ? 'Nagpur' : sheetName),
        area: getVal(areaIdx) ? String(getVal(areaIdx)).trim() : sheetName,
        size: sizeStr,
        type: getVal(typeIdx) ? String(getVal(typeIdx)).trim() : (isMetroSheet ? 'Metro Pillar' : 'Billboard'),
        lit_type: getVal(litIdx) ? String(getVal(litIdx)).trim() : 'Non-Lit',
        rationale: getVal(ratIdx) ? String(getVal(ratIdx)).trim() : null,
        
        lat: parseFloat(getVal(latIdx)) || null,
        lng: parseFloat(getVal(lngIdx)) || null,
        
        // Exact metrics
        qty: getInt(getVal(qtyIdx)) || 1,
        total_sq_ft: getNumeric(getVal(totalSqFtIdx)),
        printable_size: getVal(printSizeIdx) ? String(getVal(printSizeIdx)).trim() : null,
        
        // Metro metrics
        metro_line: getVal(lineIdx) ? String(getVal(lineIdx)).trim() : null,
        metro_pillars: getVal(fromPillarsIdx) ? String(getVal(fromPillarsIdx)).trim() : null,
        no_of_pillars: getInt(getVal(noPillarsIdx)) || null,
        no_of_displays: getInt(getVal(noDisplaysIdx)) || null,

        // Rates
        net_rate: getInt(getVal(netIdx)),
        dcpm_rate: getInt(getVal(dcpmIdx)),
        agency_rate: getInt(getVal(agencyIdx)),
        
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
