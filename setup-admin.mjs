import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
} else if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const email = process.env.ADMIN_EMAIL || 'anjalisri2708@gmail.com';
const password = process.env.ADMIN_PASSWORD || 'password123';

async function createAdmin() {
  if (!supabaseUrl) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL in .env.local');
    return;
  }

  let supabase;
  let userId = null;

  if (serviceKey) {
    // Service role admin client
    supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false }
    });

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: 'super_admin',
        name: 'Super Admin'
      }
    });

    if (error) {
      if (error.message.includes('already exists') || error.message.includes('already registered')) {
        console.log('User already exists, finding user ID...');
        const { data: usersData } = await supabase.auth.admin.listUsers();
        const existing = usersData?.users?.find(u => u.email === email);
        if (existing) userId = existing.id;
      } else {
        console.error('Error creating admin:', error.message);
      }
    } else if (data?.user) {
      console.log('Admin user created successfully:', data.user.email);
      userId = data.user.id;
    }
  } else {
    // Anon client
    supabase = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false }
    });

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInData?.user) {
      console.log('User authenticated:', signInData.user.email);
      userId = signInData.user.id;
    } else {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role: 'super_admin', name: 'Super Admin' }
        }
      });
      if (signUpError) console.error('Sign up error:', signUpError.message);
      else userId = signUpData.user?.id;
    }
  }

  if (userId) {
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: userId,
      email: email,
      role: 'super_admin',
      name: 'Super Admin'
    });

    if (profileError) {
      console.error('Profile error:', profileError.message);
    } else {
      console.log(`✅ Admin Profile ensured for ${email} with role 'super_admin'.`);
    }
  }
}

createAdmin();

