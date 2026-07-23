const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing user creation...");
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'test_admin_delete@example.com',
    password: 'password123',
    email_confirm: true,
    user_metadata: { full_name: 'Test Delete', role: 'admin' }
  });

  if (error) {
    console.error("Create User Error:", error);
    return;
  }
  
  const userId = data.user.id;
  console.log("User created successfully:", userId);

  console.log("Testing upsert profile...");
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: userId,
    email: 'test_admin_delete@example.com',
    name: 'Test Delete',
    role: 'admin'
  });

  if (profileError) {
    console.error("Profile Upsert Error:", profileError);
  } else {
    console.log("Profile upserted successfully.");
  }

  console.log("Testing delete profile...");
  const { error: dbError } = await supabase.from('profiles').delete().eq('id', userId);
  if (dbError) {
    console.error("Profile Delete Error:", dbError);
  } else {
    console.log("Profile deleted successfully.");
  }

  console.log("Testing delete user...");
  const { error: delError } = await supabase.auth.admin.deleteUser(userId);
  if (delError) {
    console.error("Delete User Error:", delError);
  } else {
    console.log("User deleted successfully.");
  }
}

test();
