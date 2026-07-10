const xlsx = require('xlsx'); 
const wb = xlsx.readFile('../Flex Inventory.xlsx', {cellFormula: true}); 
const sheet = wb.Sheets[wb.SheetNames[0]]; 
console.log(JSON.stringify(xlsx.utils.sheet_to_json(sheet, {header: 1}), null, 2)); 
console.log('\n--- FORMULAS ---'); 
Object.keys(sheet).filter(k => sheet[k].f).forEach(k => console.log(k + ': ' + sheet[k].f));
