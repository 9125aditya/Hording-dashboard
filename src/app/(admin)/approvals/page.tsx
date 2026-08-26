import { createClient } from "@/backend/db/server";
import { redirect } from "next/navigation";
import ActionHistoryClient from "./ActionHistoryClient";

export const dynamic = 'force-dynamic';

export default async function ApprovalsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');
  
  const { data: dbRequests } = await supabase
    .from('admin_requests')
    .select('*')
    .order('created_at', { ascending: false });

  let requests = dbRequests || [];

  if (requests.length > 0) {
    const userIds = Array.from(new Set(requests.map(r => r.requested_by).filter(Boolean)));
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, email')
        .in('id', userIds);
        
      if (profiles) {
        const profileMap = new Map(profiles.map(p => [p.id, p]));
        requests = requests.map(req => ({
          ...req,
          profiles: profileMap.get(req.requested_by) || null
        }));
      }
    }
  }

  return (
    <div className="pb-16">
      <ActionHistoryClient initialRequests={requests} />
    </div>
  );
}
