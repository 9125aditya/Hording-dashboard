const supabaseUrl = 'https://rrxcmfmfzejvuntzlhah.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyeGNtZm1memVqdnVudHpsaGFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjYzNTg2NCwiZXhwIjoyMTAyMjExODY0fQ.AgmioygrCl9wTUx8YXC6DYdCKkvsp4YnMp7_ViH_300';

async function main() {
  // Fetch all sites
  const res = await fetch(`${supabaseUrl}/rest/v1/sites?select=*`, {
    headers: {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`
    }
  });
  const sites = await res.json();
  console.log(`Fetched ${sites.length} sites.`);

  let updatedCount = 0;
  for (let i = 0; i < sites.length; i++) {
    const site = sites[i];
    let newLit = site.lit_type;
    
    // Normalize or assign
    if (!newLit || newLit === 'Front-lit' || newLit === 'Front Lit') {
      // If it's a metro pillar or every 3rd site, make it Non-Lit or Front Lit
      if (site.type === 'Metro Pillar' || i % 4 === 1) {
        newLit = 'Non-Lit';
      } else {
        newLit = 'Front Lit';
      }
    } else if (newLit.toLowerCase().includes('back')) {
      newLit = 'Back-lit';
    } else if (newLit.toLowerCase().includes('digital')) {
      newLit = 'Digital';
    }

    if (newLit !== site.lit_type) {
      const updateRes = await fetch(`${supabaseUrl}/rest/v1/sites?site_id=eq.${site.site_id}`, {
        method: 'PATCH',
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ lit_type: newLit })
      });
      if (updateRes.ok) {
        updatedCount++;
      } else {
        console.error(`Failed to update site ${site.site_id}:`, await updateRes.text());
      }
    }
  }

  console.log(`Successfully updated ${updatedCount} sites.`);

  // Verify breakdown
  const verifyRes = await fetch(`${supabaseUrl}/rest/v1/sites?select=lit_type`, {
    headers: {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`
    }
  });
  const verifySites = await verifyRes.json();
  const summary = {};
  verifySites.forEach(s => {
    summary[s.lit_type] = (summary[s.lit_type] || 0) + 1;
  });
  console.log('New lit_type summary in database:', summary);
}

main();
