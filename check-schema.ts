import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function check() {
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  console.log("Error:", error);
  console.log("Data keys:", data ? Object.keys(data[0] || {}) : null);
}
check();
