import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

// ---- Configuration ----
const PREVIEW_PATH = join(process.cwd(), 'raw-inventory-import-preview.json');
// TEST_MODE: set to true for a dry‑run test that checks the first photo‑bearing record
// without performing any uploads or inserts.
const TEST_MODE = true;
const REPORT_PATH = join(process.cwd(), 'raw-inventory-import-report.json');
const STORAGE_BUCKET = 'site-images';
const STORAGE_PREFIX = 'sites/imported'; // within bucket

// ---- Helper: Get original disk folder name from converted city and type ----
function getOriginalCity(convertedCity, type) {
  if (convertedCity === 'Chandrapur') return 'Hoarding Chandrapur';
  if (convertedCity === 'Nagpur' && type === 'Metro Pillar') return 'Nagpur metro pillar nagpur';
  if (convertedCity === 'Nagpur' && type !== 'Metro Pillar') return 'Nagpur';
  // For Amravati, Bhandara, Gondia, Wardha: same as converted
  return convertedCity;
}

// ---- Helper: Normalize for duplicate check (city,name) ----
function normalize(str) {
  if (typeof str !== 'string') return '';
  return str.trim().toLowerCase().replace(/\s+/g, ' ');
}

// ---- Validation Functions ----
function validateRequiredFields(record) {
  const requiredFields = ['city', 'area', 'name', 'size', 'type'];
  for (const field of requiredFields) {
    if (!record[field] || record[field].trim() === '') {
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
  const validTypes = ['Billboard', 'Metro Pillar', 'Kiosk', 'Gantry', 'Rooftop'];
  if (!type || typeof type !== 'string') return { valid: false, message: 'Type must be a non-empty string' };
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

function validateRecord(record, index) {
  // Validate required fields
  const requiredValidation = validateRequiredFields(record);
  if (!requiredValidation.valid) {
    return { valid: false, index, field: requiredValidation.field, message: requiredValidation.message };
  }

  // Validate lat/lng
  const latLngValidation = validateLatLng(record.lat, record.lng);
  if (!latLngValidation.valid) {
    return { valid: false, index, field: 'lat/lng', message: latLngValidation.message };
  }

  // Validate size
  const sizeValidation = validateSize(record.size);
  if (!sizeValidation.valid) {
    return { valid: false, index, field: 'size', message: sizeValidation.message };
  }

  // Validate type
  const typeValidation = validateType(record.type);
  if (!typeValidation.valid) {
    return { valid: false, index, field: 'type', message: typeValidation.message };
  }

  // Validate lit_type
  const litTypeValidation = validateLitType(record.lit_type);
  if (!litTypeValidation.valid) {
    return { valid: false, index, field: 'lit_type', message: litTypeValidation.message };
  }

  // Validate status
  const statusValidation = validateStatus(record.status);
  if (!statusValidation.valid) {
    return { valid: false, index, field: 'status', message: statusValidation.message };
  }

  return { valid: true };
}

function checkForDuplicateInBatch(records, index) {
  const record = records[index];
  for (let i = 0; i < records.length; i++) {
    if (i === index) continue; // Skip self
    const other = records[i];
    if (
      normalize(other.city) === normalize(record.city) &&
      normalize(other.name) === normalize(record.name)
    ) {
      return { duplicate: true, withIndex: i };
    }
  }
  return { duplicate: false };
}

// ---- Supabase REST API helpers ----
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase credentials in environment variables');
}

// Build query string safely using URLSearchParams
function buildQuery(params) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) {
      searchParams.append(key, value);
    }
  }
  return searchParams.toString();
}

// Generic REST request
async function restFetch(path, { method = 'GET', body = null, params = {}, extraHeaders = {} } = {}) {
  const query = buildQuery(params);
  const url = `${SUPABASE_URL}/rest/v1/${path}${query ? '?' + query : ''}`;
  const headers = {
    apikey: SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
    ...extraHeaders
  };
  const options = { method, headers };
  if (body !== null) {
    options.body = JSON.stringify(body);
  }
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`REST ${method} ${path} failed: ${response.status} ${response.statusText} - ${errorText}`);
  }
  // If no content (e.g., 204), return empty object
  if (response.status === 204) return {};
  return response.json();
}

// Insert site with Prefer: return=representation
async function insertSite(payload) {
  const url = `${SUPABASE_URL}/rest/v1/sites`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Insert site failed: ${response.status} ${response.statusText} - ${errorText}`);
  }
  return response.json();
}

// Storage API helpers
async function storageUpload(filePath, fileBuffer, mimeType) {
  const encodedPath = encodeURIComponent(filePath); // encode whole path as single segment
  const url = `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${encodedPath}?upsert=false`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': mimeType
    },
    body: fileBuffer
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Storage upload failed: ${response.status} ${response.statusText} - ${errorText}`);
  }
  // No JSON body expected on success
  return true;
}

async function storageDelete(filePath) {
  const encodedPath = encodeURIComponent(filePath);
  const url = `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${encodedPath}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`
    }
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Storage delete failed: ${response.status} ${response.statusText} - ${errorText}`);
  }
  return true;
}

// Get public URL for a stored file
function getPublicUrl(filePath) {
  const encodedPath = encodeURIComponent(filePath);
  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${encodedPath}`;
}

// ---- Main ----
async function main() {
  const startedAt = new Date().toISOString();
  console.log(`Import started at ${startedAt}`);

  // Load preview
  let preview;
  try {
    const previewBuffer = await readFile(PREVIEW_PATH, 'utf8');
    preview = JSON.parse(previewBuffer);
  } catch (err) {
    console.error(`Failed to read preview file ${PREVIEW_PATH}:`, err);
    process.exit(1);
  }

  const proposed = preview.proposedRecords || [];
  console.log(`Loaded ${proposed.length} total candidate records from preview`);

  if (TEST_MODE) {
    console.log('\n=== TEST MODE (DRY RUN) ===');

    // Validate all records first
    console.log('\n🔍 Validating all records...');
    const validationResults = [];
    let validCount = 0;
    for (let i = 0; i < proposed.length; i++) {
      const record = proposed[i];
      const validation = validateRecord(record, i);
      validationResults.push(validation);
      if (validation.valid) validCount++;

      // Log first 10 invalid records for brevity
      if (!validation.valid && validationResults.filter(v => !v.valid).length <= 10) {
        console.log(`  ❌ Record ${i} (${record.name || 'UNKNOWN'}/${record.city || 'UNKNOWN'}): ${validation.message}`);
      }
    }

    if (validationResults.filter(v => !v.valid).length > 10) {
      const invalidCount = validationResults.filter(v => !v.valid).length;
      console.log(`  ... and ${invalidCount - 10} more invalid records`);
    }

    console.log(`\n📊 Validation Summary: ${validCount}/${proposed.length} records passed validation`);

    // Check for duplicates within the batch
    console.log('\n🔍 Checking for duplicates within the import batch...');
    const duplicates = [];
    for (let i = 0; i < proposed.length; i++) {
      const duplicateCheck = checkForDuplicateInBatch(proposed, i);
      if (duplicateCheck.duplicate) {
        duplicates.push({
          index: i,
          record: proposed[i],
          duplicateWithIndex: duplicateCheck.withIndex
        });
      }
    }

    if (duplicates.length > 0) {
      console.log(`  ⚠️  Found ${duplicates.length} duplicate(s) within the batch:`);
      // Show first 5 duplicates
      for (let i = 0; i < Math.min(5, duplicates.length); i++) {
        const dup = duplicates[i];
        console.log(`    - Index ${dup.index} ("${dup.record.name}" in "${dup.record.city}") duplicates index ${dup.duplicateWithIndex}`);
      }
      if (duplicates.length > 5) {
        console.log(`    ... and ${duplicates.length - 5} more duplicates`);
      }
    } else {
      console.log(`  ✅ No duplicates found within the batch`);
    }

    // Process each record for detailed testing (first few valid ones)
    console.log('\n🧪 Testing first 3 valid records with photos...');
    const testRecords = proposed
      .filter((r, i) => validationResults[i].valid && r._dryRun && r._dryRun.photoCount > 0)
      .slice(0, 3);

    if (testRecords.length === 0) {
      console.log('  ❌ No valid photo-bearing records found to test');
      process.exit(0);
    }

    for (let testIdx = 0; testIdx < testRecords.length; testIdx++) {
      const testRecord = testRecords[testIdx];
      const originalIndex = proposed.indexOf(testRecord);

      console.log(`\n--- Test Record ${testIdx + 1} (original index ${originalIndex}) ---`);
      console.log(`  City: ${testRecord.city}`);
      console.log(`  Name: ${testRecord.name}`);
      console.log(`  Area: ${testRecord.area || '(empty)'}`);
      console.log(`  Size: ${testRecord.size}`);
      console.log(`  Type: ${testRecord.type}`);
      console.log(`  Lit Type: ${testRecord.lit_type || '(empty)'}`);
      console.log(`  Coordinates: lat=${testRecord.lat}, lng=${testRecord.lng}`);
      console.log(`  Photos: ${testRecord.photos.length}`);

      // Duplicate‑check via REST
      let duplicateCheckResult = { exists: false, error: null };
      try {
        const { data: existing } = await restFetch('sites', {
          params: {
            select: 'site_id',
            city: `eq.${testRecord.city}`,
            name: `eq.${testRecord.name}`,
            limit: '1'
          }
        });
        duplicateCheckResult.exists = Array.isArray(existing) && existing.length > 0;
      } catch (err) {
        duplicateCheckResult.error = err.message;
      }
      console.log(`  Duplicate check in DB: ${duplicateCheckResult.exists ? 'EXISTS (would be skipped)' : 'DOES NOT EXIST (would be new)'}`);
      if (duplicateCheckResult.error) {
        console.log(`  Duplicate check error: ${duplicateCheckResult.error}`);
      }

      // Verify local photo files exist and can be read
      const photoInfos = [];
      let allPhotosReadable = true;
      for (const filePath of testRecord.photos) {
        let readable = false;
        let errorMsg = null;
        try {
          await readFile(filePath); // just test readability
          readable = true;
        } catch (e) {
          allPhotosReadable = false;
          errorMsg = e.message;
        }
        // extract fileName from absolute path for display
        const fileName = filePath.split(/[\\/]/).pop();
        photoInfos.push({ fileName, filePath, readable, error: errorMsg });
      }
      console.log('  Photo file paths:');
      photoInfos.forEach(info => {
        console.log(`    ${info.fileName}: ${info.filePath} ${info.readable ? 'OK' : `ERROR: ${info.error}`}`);
      });
      if (!allPhotosReadable) {
        console.log('  ⚠️  Some photo files could not be read');
      }

      // Build the payload that would be inserted (photos will be filled after upload)
      const payload = {
        city: testRecord.city,
        area: testRecord.area,
        name: testRecord.name,
        lat: testRecord.lat !== null && testRecord.lat !== undefined ? testRecord.lat : null,
        lng: testRecord.lng !== null && testRecord.lng !== undefined ? testRecord.lng : null,
        size: testRecord.size,
        type: testRecord.type,
        lit_type: testRecord.lit_type || 'Non-Lit',
        status: 'Available',
        photos: [], // will be filled with uploaded URLs in real run
        landlord: null,
        rent: null,
        insurance: null,
        internal_rate: null,
        is_metro: testRecord.is_metro,
        qty: 1,
        total_sq_ft: testRecord.total_sq_ft,
        printable_size: null,
        metro_line: null,
        metro_pillars: null,
        no_of_pillars: null,
        no_of_displays: null
      };
      console.log('  Payload that WOULD be inserted:');
      console.log(JSON.stringify(payload, null, 4));
    }

    console.log('\n✅ TEST MODE completed successfully – no writes performed.');
    process.exit(0);
  }

  // ----- REAL IMPORT LOGIC (skipped when TEST_MODE === true) -----
  // Stats
  const stats = {
    totalCandidates: proposed.length,
    attempted: 0,
    inserted: 0,
    skippedExisting: 0,
    skippedNoPhotos: 0,
    failed: 0,
    totalPhotosUploaded: 0,
    failedSites: [] // each: {name, city, error}
  };

  // Process each candidate
  for (let i = 0; i < proposed.length; i++) {
    const record = proposed[i];

    // Skip zero-photo records
    if (!record._dryRun || record._dryRun.photoCount === 0) {
      stats.skippedNoPhotos++;
      console.log(`Skipping (no photos): ${record.city} / ${record.name}`);
      continue;
    }

    // Validate record
    const validation = validateRecord(record, i);
    if (!validation.valid) {
      stats.failed++;
      stats.failedSites.push({
        city: record.city || 'UNKNOWN',
        name: record.name || 'UNKNOWN',
        error: `Validation failed: ${validation.message}`
      });
      console.log(`Skipping (validation failed): ${record.city} / ${record.name} - ${validation.message}`);
      continue;
    }

    // Check for duplicates within the batch
    const duplicateInBatch = checkForDuplicateInBatch(proposed, i);
    if (duplicateInBatch.duplicate) {
      stats.skippedExisting++; // Reusing this stat for duplicates within batch
      console.log(`Skipping (duplicate within batch): ${record.city} / ${record.name} (duplicates index ${duplicateInBatch.withIndex})`);
      continue;
    }

    stats.attempted++;

    // Final existence check (city + exact name)
    try {
      const { data: existing } = await restFetch('sites', {
        params: {
          select: 'site_id',
          city: `eq.${record.city}`,
          name: `eq.${record.name}`,
          limit: '1'
        }
      });
      if (Array.isArray(existing) && existing.length > 0) {
        stats.skippedExisting++;
        console.log(`Skipping (already exists in DB): ${record.city} / ${record.name}`);
        continue;
      }
    } catch (err) {
      console.error(`Error checking existence for ${record.city}/${record.name}:`, err.message);
      stats.failed++;
      stats.failedSites.push({
        city: record.city,
        name: record.name,
        error: err.message
      });
      continue;
    }

    // Prepare uploads
    const uploadedUrls = [];
    const uploadedPaths = []; // for cleanup on failure
    let uploadFailed = false;

    try {
      for (const filePath of record.photos) {
        // Read file buffer
        const buffer = await readFile(filePath);
        // Determine content type (fallback to octet-stream)
        const ext = filePath.split('.').pop().toLowerCase();
        const mimeType = {
          jpg: 'image/jpeg',
          jpeg: 'image/jpeg',
          png: 'image/png',
          gif: 'image/gif',
          bmp: 'image/bmp',
          tiff: 'image/tiff',
          webp: 'image/webp'
        }[ext] || 'application/octet-stream';

        // Unique storage path: keep original filename
        const fileName = filePath.split(/[\\/]/).pop();
        const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const storagePath = `${STORAGE_PREFIX}/${uniqueId}-${fileName}`;

        await storageUpload(storagePath, buffer, mimeType);
        const publicUrl = getPublicUrl(storagePath);
        uploadedUrls.push(publicUrl);
        uploadedPaths.push(storagePath);
        stats.totalPhotosUploaded++;
      }
    } catch (err) {
      console.error(`Unexpected error during upload preparation for ${record.city}/${record.name}:`, err.message);
      uploadFailed = true;
    }

    if (uploadFailed) {
      stats.failed++;
      stats.failedSites.push({
        city: record.city,
        name: record.name,
        error: 'Photo upload failed'
      });
      // Attempt cleanup of any uploaded files
      if (uploadedPaths.length > 0) {
        for (const path of uploadedPaths) {
          try {
            await storageDelete(path);
          } catch (cleanupErr) {
            console.error(`Cleanup failed for uploaded file ${path}:`, cleanupErr.message);
          }
        }
      }
      continue;
    }

    // Build insert payload (only actual columns)
    const payload = {
      city: record.city,
      area: record.area,
      name: record.name,
      lat: record.lat !== null && record.lat !== undefined ? record.lat : null,
      lng: record.lng !== null && record.lng !== undefined ? record.lng : null,
      size: record.size,
      type: record.type,
      lit_type: record.lit_type || 'Non-Lit',
      status: 'Available',
      photos: uploadedUrls,
      landlord: null,
      rent: null,
      insurance: null,
      internal_rate: null,
      is_metro: record.is_metro,
      qty: 1,
      total_sq_ft: record.total_sq_ft,
      printable_size: null,
      metro_line: null,
      metro_pillars: null,
      no_of_pillars: null,
      no_of_displays: null
    };

    // Insert site
    try {
      await insertSite(payload);
    } catch (err) {
      console.error(`Insert failed for ${record.city}/${record.name}:`, err.message);
      stats.failed++;
      stats.failedSites.push({
        city: record.city,
        name: record.name,
        error: err.message
      });
      // Cleanup uploaded files
      if (uploadedPaths.length > 0) {
        for (const path of uploadedPaths) {
          try {
            await storageDelete(path);
          } catch (cleanupErr) {
            console.error(`Cleanup failed after insert error for ${path}:`, cleanupErr.message);
          }
        }
      }
      continue;
    }

    // If we reach here, insertion succeeded
    stats.inserted++;
    console.log(`Inserted site: ${record.city} / ${record.name} (${uploadedUrls.length} photos)`);
  }

  const completedAt = new Date().toISOString();
  const report = {
    startedAt,
    completedAt,
    ...stats
  };

  await writeFile(REPORT_PATH, JSON.stringify(report, null, 2), 'utf8');
  console.log(`\nImport finished at ${completedAt}`);
  console.log('Report written to:', REPORT_PATH);
  console.log('Summary:', JSON.stringify(stats, null, 2));
}

// Run if invoked directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}