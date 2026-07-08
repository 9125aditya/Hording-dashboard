require('dotenv').config({ path: '.env.local' });
global.WebSocket = require('ws');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function seedEmployees() {
  const employees = [
    { email: 'shailen.mehta@outreachooh.in', password: 'password123', role: 'super_admin', name: 'Shailen Mehta' },
    { email: 'manan.mehta@outreachooh.in', password: 'password123', role: 'super_admin', name: 'Manan Mehta' },
    { email: 'abhishek.adole@outreachooh.in', password: 'password123', role: 'backoffice', name: 'Abhishek Adole' },
    { email: 'madhuri@outreachooh.in', password: 'password123', role: 'backoffice', name: 'Madhuri' },
    { email: 'shradha@outreachooh.in', password: 'password123', role: 'backoffice', name: 'Shradha' },
    { email: 'kamlesh.chinchghare@outreachooh.in', password: 'password123', role: 'marketing', name: 'Kamlesh Chinchghare' },
    { email: 'jatin.dakre@outreachooh.in', password: 'password123', role: 'marketing', name: 'Jatin Dakre' },
    { email: 'suresh.nagpure@outreachooh.in', password: 'password123', role: 'execution_head', name: 'Suresh Nagpure' }
  ];

  for (const emp of employees) {
    console.log(`Creating ${emp.name} (${emp.email})...`);
    const { data, error } = await supabase.auth.admin.createUser({
      email: emp.email,
      password: emp.password,
      email_confirm: true,
      user_metadata: { full_name: emp.name }
    });

    if (error) {
      console.log(`Error creating ${emp.email}:`, error.message);
    } else {
      console.log(`Successfully created ${emp.email} with ID: ${data.user.id}`);
      
      // Update profile with specific role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: emp.role, name: emp.name })
        .eq('id', data.user.id);
        
      if (profileError) {
        console.log(`Error updating profile for ${emp.email}:`, profileError.message);
      } else {
        console.log(`Profile updated with role: ${emp.role}`);
      }
    }
  }
}

seedEmployees();
