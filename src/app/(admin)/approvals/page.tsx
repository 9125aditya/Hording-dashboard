import { createClient } from "@/backend/db/server";
import { redirect } from "next/navigation";
import { ShieldAlert, Clock, CheckCircle, XCircle } from "lucide-react";
import ApprovalActions from "./ApprovalActions";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function ApprovalsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'super_admin') {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4 opacity-80" />
        <h2 className="text-2xl font-bold tracking-tight mb-2">Access Restricted</h2>
        <p className="text-muted-foreground max-w-md mb-6">
          You do not have permission to view or manage approvals. This section is restricted to Super Administrators.
        </p>
        <Link href="/dashboard" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { data: dbRequests } = await supabase
    .from('admin_requests')
    .select('*')
    .order('created_at', { ascending: false });

  let requests = dbRequests || [];

  if (requests.length > 0) {
    const userIds = Array.from(new Set(requests.map(r => r.requested_by)));
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

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-heading text-slate-900">Pending Approvals</h1>
        <p className="text-sm text-slate-500">Review and approve changes requested by Administrators.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Request</th>
                <th className="px-5 py-3.5 font-semibold">Details</th>
                <th className="px-5 py-3.5 font-semibold">Requested By</th>
                <th className="px-5 py-3.5 font-semibold">Date</th>
                <th className="px-5 py-3.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                    No pending requests found.
                  </td>
                </tr>
              ) : (
                requests.map((req: any) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900 flex items-center gap-2">
                        {req.status === 'PENDING' ? <Clock className="h-4 w-4 text-amber-500" /> : 
                         req.status === 'APPROVED' ? <CheckCircle className="h-4 w-4 text-emerald-500" /> :
                         <XCircle className="h-4 w-4 text-red-500" />}
                        {req.action_type}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Status: <span className="font-semibold">{req.status}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {req.action_type === 'UPDATE_STATUS' && req.payload?.status && (
                        <div className="text-slate-600">
                          Update Site <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">#{req.entity_id}</span> to <strong>{req.payload.status}</strong>
                        </div>
                      )}
                      {req.action_type === 'ADD_SITE' && req.payload?.name && (
                        <div className="text-slate-600">
                          Add new site: <strong>{req.payload.name}</strong> ({req.payload.city})
                        </div>
                      )}
                      {req.action_type === 'DELETE_SITE' && (
                        <div className="text-slate-600">
                          Delete Site <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">#{req.entity_id}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-slate-900 font-medium">{req.profiles?.name || 'Unknown User'}</div>
                      <div className="text-slate-500 text-xs">{req.profiles?.email}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs">
                      {new Date(req.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {req.status === 'PENDING' ? (
                        <ApprovalActions requestId={req.id} />
                      ) : (
                        <span className="text-xs text-slate-400 italic">Resolved</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
