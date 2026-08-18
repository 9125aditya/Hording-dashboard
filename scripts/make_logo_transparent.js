const fs = require('fs');
const zlib = require('zlib');

// Read the logo PNG file
const buffer = fs.readFileSync('public/logo.png');

// Verify PNG signature
if (buffer.readUInt32BE(0) !== 0x89504E47 || buffer.readUInt32BE(4) !== 0x0D0A1A0A) {
  console.error('Not a valid PNG file');
  process.exit(1);
}

let offset = 8;
let width, height, bitDepth, colorType;
const idatChunks = [];

while (offset < buffer.length) {
  const length = buffer.readUInt32BE(offset);
  const type = buffer.toString('ascii', offset + 4, offset + 8);
  const data = buffer.slice(offset + 8, offset + 8 + length);
  
  if (type === 'IHDR') {
    width = data.readUInt32BE(0);
    height = data.readUInt32BE(4);
    bitDepth = data.readUInt8(8);
    colorType = data.readUInt8(9);
    console.log(`IHDR: ${width}x${height}, bitDepth=${bitDepth}, colorType=${colorType}`);
  } else if (type === 'IDAT') {
    idatChunks.push(data);
  }
  
  offset += 12 + length;
}

const compressedData = Buffer.concat(idatChunks);
const rawData = zlib.inflateSync(compressedData);

// Bytes per pixel in input
let bpp;
if (colorType === 6) bpp = 4; // RGBA
else if (colorType === 2) bpp = 3; // RGB
else if (colorType === 0) bpp = 1; // Grayscale
else if (colorType === 4) bpp = 2; // Grayscale + Alpha
else {
  console.error('Unsupported color type:', colorType);
  process.exit(1);
}

const rowBytes = width * bpp;
const uncompressedRows = [];

// Unfilter scanlines
let srcPos = 0;
const prevRow = Buffer.alloc(rowBytes, 0);

for (let y = 0; y < height; y++) {
  const filterType = rawData.readUInt8(srcPos++);
  const currentRow = Buffer.alloc(rowBytes);
  
  for (let x = 0; x < rowBytes; x++) {
    const rawByte = rawData.readUInt8(srcPos++);
    const a = x >= bpp ? currentRow.readUInt8(x - bpp) : 0;
    const b = prevRow.readUInt8(x);
    const c = x >= bpp ? prevRow.readUInt8(x - bpp) : 0;
    
    let reconByte = rawByte;
    if (filterType === 1) { // Sub
      reconByte = (rawByte + a) & 0xFF;
    } else if (filterType === 2) { // Up
      reconByte = (rawByte + b) & 0xFF;
    } else if (filterType === 3) { // Average
      reconByte = (rawByte + Math.floor((a + b) / 2)) & 0xFF;
    } else if (filterType === 4) { // Paeth
      const p = a + b - c;
      const pa = Math.abs(p - a);
      const pb = Math.abs(p - b);
      const pc = Math.abs(p - c);
      let pr;
      if (pa <= pb && pa <= pc) pr = a;
      else if (pb <= pc) pr = b;
      else pr = c;
      reconByte = (rawByte + pr) & 0xFF;
    }
    
    currentRow.writeUInt8(reconByte, x);
  }
  
  currentRow.copy(prevRow);
  uncompressedRows.push(currentRow);
}

// Convert all pixels to RGBA and make white/near-white transparent
const outRowBytes = width * 4;
const outRawData = Buffer.alloc(height * (1 + outRowBytes));
let outPos = 0;

for (let y = 0; y < height; y++) {
  outRawData.writeUInt8(0, outPos++); // Filter 0 (None)
  const inRow = uncompressedRows[y];
  
  for (let x = 0; x < width; x++) {
    let r, g, b, a;
    if (bpp === 4) {
      r = inRow.readUInt8(x * 4);
      g = inRow.readUInt8(x * 4 + 1);
      b = inRow.readUInt8(x * 4 + 2);
      a = inRow.readUInt8(x * 4 + 3);
    } else if (bpp === 3) {
      r = inRow.readUInt8(x * 3);
      g = inRow.readUInt8(x * 3 + 1);
      b = inRow.readUInt8(x * 3 + 2);
      a = 255;
    } else {
      const v = inRow.readUInt8(x);
      r = v; g = v; b = v; a = 255;
    }
    
    // Check if pixel is white or near-white (background)
    // Tolerance: R > 240, G > 240, B > 240
    if (r > 240 && g > 240 && b > 240) {
      // Smooth alpha transition at borders
      const minVal = Math.min(r, g, b);
      if (minVal > 250) {
        a = 0; // Pure transparent
      } else {
        a = Math.round((255 - minVal) * 25.5); // Smooth edge blending
      }
    }
    
    outRawData.writeUInt8(r, outPos++);
    outRawData.writeUInt8(g, outPos++);
    outRawData.writeUInt8(b, outPos++);
    outRawData.writeUInt8(a, outPos++);
  }
}

// Compress new IDAT
const newIdatData = zlib.deflateSync(outRawData, { level: 9 });

// CRC32 implementation
function makeCrcTable() {
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xEDB88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  return table;
}

const crcTable = makeCrcTable();
function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type, data) {
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(body);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);
  return Buffer.concat([lenBuf, body, crcBuf]);
}

// Create IHDR chunk (colorType = 6 for RGBA)
const ihdrData = Buffer.alloc(13);
ihdrData.writeUInt32BE(width, 0);
ihdrData.writeUInt32BE(height, 4);
ihdrData.writeUInt8(8, 8);  // bit depth
ihdrData.writeUInt8(6, 9);  // RGBA
ihdrData.writeUInt8(0, 10); // compression
ihdrData.writeUInt8(0, 11); // filter
ihdrData.writeUInt8(0, 12); // interlace

const pngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
const ihdrChunk = makeChunk('IHDR', ihdrData);
const idatChunk = makeChunk('IDAT', newIdatData);
const iendChunk = makeChunk('IEND', Buffer.alloc(0));

const finalPng = Buffer.concat([pngSignature, ihdrChunk, idatChunk, iendChunk]);
fs.writeFileSync('public/logo.png', finalPng);
console.log('Successfully wrote transparent logo.png:', finalPng.length, 'bytes');
