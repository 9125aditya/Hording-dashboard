import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import ws from 'ws';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: { persistSession: false },
    realtime: { transport: ws }
  }
);

async function createAdmin() {
  const { data, error } = await supabase.auth.signUp({
    email: 'test@test.com',
    password: 'password123',
    options: {
      data: {
        role: 'admin',
        full_name: 'Super Admin'
      }
    }
  });

  if (error) {
    console.error('Error creating admin:', error.message);
  } else {
    console.log('Admin user created successfully:', data.user?.email);
    
    // Check if profile is created automatically, if not, we can create it
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        role: 'admin',
        full_name: 'Super Admin'
      });
      if (profileError) console.error('Profile error:', profileError.message);
      else console.log('Profile ensured.');
    }
  }
}

createAdmin();
