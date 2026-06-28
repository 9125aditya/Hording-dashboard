require('dotenv').config({ path: '.env.local' });
global.WebSocket = require('ws');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function createUsers() {
  const usersToCreate = [
    { email: 'superadmin@example.com', password: 'password123', role: 'super_admin', name: 'Super Admin User' },
    { email: 'admin@example.com', password: 'password123', role: 'admin', name: 'Admin User' },
    { email: 'public@example.com', password: 'password123', role: 'public', name: 'Public User' }
  ];

  for (const u of usersToCreate) {
    console.log(`Creating ${u.email}...`);
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { full_name: u.name }
    });

    if (error) {
      console.log(`Error creating ${u.email}:`, error.message);
    } else {
      console.log(`Successfully created ${u.email} with ID: ${data.user.id}`);
      
      // Update profile with specific role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: u.role, name: u.name })
        .eq('id', data.user.id);
        
      if (profileError) {
        console.log(`Error updating profile for ${u.email}:`, profileError.message);
      } else {
        console.log(`Profile updated with role ${u.role}`);
      }
    }
  }
}

createUsers();
