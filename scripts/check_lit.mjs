const supabaseUrl = 'https://rrxcmfmfzejvuntzlhah.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyeGNtZm1memVqdnVudHpsaGFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjYzNTg2NCwiZXhwIjoyMTAyMjExODY0fQ.AgmioygrCl9wTUx8YXC6DYdCKkvsp4YnMp7_ViH_300';

async function main() {
  const res = await fetch(`${supabaseUrl}/rest/v1/sites?select=site_id,name,city,type,lit_type`, {
    headers: {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`
    }
  });
  const data = await res.json();
  const summary = {};
  data.forEach(s => {
    const k = `${s.lit_type}`;
    summary[k] = (summary[k] || 0) + 1;
  });
  console.log('Lit type counts:', summary);
  console.log('Sites list:');
  data.forEach(s => console.log(`- [${s.site_id}] ${s.name} (${s.type}) -> lit_type: "${s.lit_type}"`));
}

main();
