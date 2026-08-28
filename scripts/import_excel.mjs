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

// TEST_MODE: set to true for a dry-run test that processes data without performing any inserts
const TEST_MODE = true;
const REPORT_PATH = './excel-import-report.json';

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

  // Stats
  const stats = {
    totalCandidates: 0,
    processed: 0,
    validated: 0,
    failed: 0,
    failedSites: [] // each: {name, city, error}
  };

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
    "NGP KIOSK",
    "Jhansi Rani Metro Station ",
    "sitabuldi ichange metro Station"
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

    // ---- Validation Functions ----
    function validateRequiredFields(site) {
        const requiredFields = ['name'];
        for (const field of requiredFields) {
            if (!site[field] || site[field].trim() === '') {
                return { valid: false, field, message: `Missing required field: ${field}` };
            }
        }
        return { valid: true };
    }

    function validateLatLng(lat, lng) {
        if (lat !== null && lat !== undefined) {
            if (typeof lat !== 'number' || lat < -90 || lat > 90) {
                return { valid: false, message: `Invalid latitude: ${lat}. Must be between -90 and 90` };
            }
        }
        if (lng !== null && lng !== undefined) {
            if (typeof lng !== 'number' || lng < -180 || lng > 180) {
                return { valid: false, message: `Invalid longitude: ${lng}. Must be between -180 and 180` };
            }
        }
        return { valid: true };
    }

    function validateSize(size) {
        if (!size || typeof size !== 'string') return { valid: false, message: 'Size must be a non-empty string' };
        // Basic format check for size (e.g., "40 × 20 ft" or "10x20")
        const sizePattern = /^[\d\.]+\s*[x×]\s*[\d\.]+/;
        if (!sizePattern.test(size)) {
            return { valid: false, message: `Size format invalid: ${size}. Expected format like "40x20" or "40 × 20 ft"` };
        }
        return { valid: true };
    }

    function validateType(type) {
        // Allow null/undefined for type (will be handled later)
        if (type === null || type === undefined) return { valid: true };
        if (typeof type !== 'string') return { valid: false, message: 'Type must be a string' };
        const validTypes = ['Billboard', 'Metro Pillar', 'Kiosk', 'Gantry', 'Rooftop'];
        if (!validTypes.includes(type)) {
            return { valid: false, message: `Invalid type: ${type}. Must be one of: ${validTypes.join(', ')}` };
        }
        return { valid: true };
    }

    function validateLitType(litType) {
        const validLitTypes = ['Front-lit', 'Back-lit', 'Non-Lit'];
        if (!litType || typeof litType !== 'string') return { valid: false, message: 'Lit type must be a non-empty string' };
        if (!validLitTypes.includes(litType)) {
            return { valid: false, message: `Invalid lit_type: ${litType}. Must be one of: ${validLitTypes.join(', ')}` };
        }
        return { valid: true };
    }

    function validateStatus(status) {
        const validStatuses = ['Available', 'Rented', 'Maintenance', 'Inactive'];
        if (!status || typeof status !== 'string') return { valid: false, message: 'Status must be a non-empty string' };
        if (!validStatuses.includes(status)) {
            return { valid: false, message: `Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}` };
        }
        return { valid: true };
    }

    function validateSite(site, index) {
        // Validate required fields
        const requiredValidation = validateRequiredFields(site);
        if (!requiredValidation.valid) {
            return { valid: false, index, field: requiredValidation.field, message: requiredValidation.message };
        }

        // Validate lat/lng
        const latLngValidation = validateLatLng(site.lat, site.lng);
        if (!latLngValidation.valid) {
            return { valid: false, index, field: 'lat/lng', message: latLngValidation.message };
        }

        // Validate size
        const sizeValidation = validateSize(site.size);
        if (!sizeValidation.valid) {
            return { valid: false, index, field: 'size', message: sizeValidation.message };
        }

        // Validate type
        const typeValidation = validateType(site.type);
        if (!typeValidation.valid) {
            return { valid: false, index, field: 'type', message: typeValidation.message };
        }

        // Validate lit_type
        const litTypeValidation = validateLitType(site.lit_type);
        if (!litTypeValidation.valid) {
            return { valid: false, index, field: 'lit_type', message: litTypeValidation.message };
        }

        // Validate status
        const statusValidation = validateStatus(site.status);
        if (!statusValidation.valid) {
            return { valid: false, index, field: 'status', message: statusValidation.message };
        }

        return { valid: true };
    }

    function checkForDuplicateInBatch(sites, index) {
        const site = sites[index];
        for (let i = 0; i < sites.length; i++) {
            if (i === index) continue; // Skip self
            const other = sites[i];
            if (
                ((other.city || '') === (site.city || '')) &&
                ((other.name || '') === (site.name || ''))
            ) {
                return { duplicate: true, withIndex: i };
            }
        }
        return { duplicate: false };
    }

    const batchSites = []; // Sites in current batch for duplicate checking

    for (let i = headerRowIndex + 1; i < rawData.length; i++) {
      const row = rawData[i];
      if (!row || row.length === 0) continue;

      const getVal = (idx) => idx !== -1 ? row[idx] : null;

      const name = getVal(locIdx);
      const width = getVal(wIdx);
      const designSize = getVal(designSizeIdx);

      if (!name) continue;

      let siteName = String(name).trim();

      // Handle duplicate names (within this sheet)
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

      // Calculate type with mapping for Excel data
      let typeStr = null;
      if (getVal(typeIdx)) {
        const rawType = String(getVal(typeIdx)).trim();
        const typeMapping = {
          'Hoarding': 'Billboard', // Default mapping - adjust based on context
        };
        typeStr = typeMapping[rawType] || rawType;
      }

      // Calculate lit_type with mapping for Excel data
      let litTypeStr = getVal(litIdx) ? String(getVal(litIdx)).trim() : 'Non-Lit';
      // Map abbreviated lit_type values from Excel
      const litTypeMapping = {
        'F/L': 'Front-lit',
        'B/L': 'Back-lit',
        'N/L': 'Non-Lit'
      };
      litTypeStr = litTypeMapping[litTypeStr] || litTypeStr;

      // Build site object
      const site = {
        name: siteName,
        is_metro: isMetroSheet,
        city: getVal(cityIdx) ? String(getVal(cityIdx)).trim() : (sheetName.toLowerCase().trim() === 'ngp kiosk' ? 'Nagpur' : null),
        area: getVal(areaIdx) ? String(getVal(areaIdx)).trim() : null,
        size: sizeStr,
        type: typeStr,
        lit_type: litTypeStr,
        rationale: getVal(ratIdx) ? String(getVal(ratIdx)).trim() : null,
        sheet_name: sheetName.trim(),

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

      // Validate site
      const validation = validateSite(site, i);
      if (!validation.valid) {
        if (TEST_MODE) {
          console.log(`  ❌ Skipping invalid record at row ${i + 1}: ${validation.message}`);
        } else {
          stats.failed++;
          stats.failedSites.push({
            name: site.name || 'UNKNOWN',
            city: site.city || 'UNKNOWN',
            error: `Validation failed: ${validation.message}`
          });
        }
        continue;
      }

      // Check for duplicates within the batch
      let duplicateInBatch = false;
      let duplicateIndex = -1;
      for (let i = 0; i < batchSites.length; i++) {
        const existing = batchSites[i];
        if (
          ((existing.city || '') === (site.city || '')) &&
          ((existing.name || '') === (site.name || ''))
        ) {
          duplicateInBatch = true;
          duplicateIndex = i;
          break;
        }
      }
      if (duplicateInBatch) {
        if (TEST_MODE) {
          console.log(`  ⚠️  Skipping duplicate within batch: ${site.name} in ${site.city}`);
        } else {
          stats.skippedExisting++; // Reusing this stat for duplicates within batch
        }
        continue;
      }

      // Add to batch for duplicate checking
      batchSites.push(site);

      if (TEST_MODE) {
        // In TEST MODE, just validate and report, don't add to rowsToInsert
        console.log(`  ✅ Valid record: ${site.name} (${site.city || '(no city)'})`);
        continue;
      }

      // In REAL MODE, add to rowsToInsert for actual insertion
      rowsToInsert.push(site);
      existingNames.add(siteName);
    }
  }

  console.log(`Prepared ${rowsToInsert.length} NEW records for insertion across all sheets.`);

  if (rowsToInsert.length === 0) {
    console.log("No new records to insert.");
    return;
  }

  if (TEST_MODE) {
    console.log('\n=== TEST MODE COMPLETED ===');
    console.log(`Processed ${stats.processed} records`);
    console.log(`Validated ${stats.validated} records`);
    console.log(`Failed ${stats.failed} records`);
    if (stats.failed > 0) {
      console.log('Failed records:');
      stats.failedSites.forEach((site, index) => {
        console.log(`  ${index + 1}. ${site.name} (${site.city}): ${site.error}`);
      });
    }
    console.log('\n✅ TEST MODE completed successfully – no writes performed.');
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