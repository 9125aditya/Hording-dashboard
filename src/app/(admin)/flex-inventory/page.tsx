import { createClient } from "@/backend/db/server";
import { redirect } from "next/navigation";
import FlexInventoryClient from "./FlexInventoryClient";

export const dynamic = 'force-dynamic';

export default async function FlexInventoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  const role = profile?.role || 'public';
  
  if (role === 'public') {
     return redirect('/dashboard');
  }

  // Fetch transactions for calculation
  const { data: transactions } = await supabase
    .from('flex_transactions')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-[1100px] mx-auto">
      <FlexInventoryClient transactions={transactions || []} />
    </div>
  );
}
