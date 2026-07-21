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

  const totalActions = requests.length;

  const actionTypeColors: Record<string, string> = {
    'ADD_SITE': 'bg-emerald-100 text-emerald-700',
    'UPDATE_SITE': 'bg-blue-100 text-blue-700',
    'UPDATE_STATUS': 'bg-indigo-100 text-indigo-700',
    'DELETE_SITE': 'bg-rose-100 text-rose-700',
    'UPDATE_ENQUIRY_STATUS': 'bg-amber-100 text-amber-700',
    'ENQUIRY_NOTE': 'bg-purple-100 text-purple-700',
    'ENQUIRY_REPLY': 'bg-cyan-100 text-cyan-700',
    'FLEX_TRANSACTION': 'bg-orange-100 text-orange-700',
  };

  const actionTypeLabel: Record<string, string> = {
    'ADD_SITE': 'Add Site',
    'UPDATE_SITE': 'Edit Site',
    'UPDATE_STATUS': 'Update Status',
    'DELETE_SITE': 'Delete Site',
    'UPDATE_ENQUIRY_STATUS': 'Enquiry Status',
    'ENQUIRY_NOTE': 'Enquiry Note',
    'ENQUIRY_REPLY': 'Enquiry Reply',
    'FLEX_TRANSACTION': 'Flex Inventory',
  };

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Action History</h1>
        <p className="text-sm text-gray-500 mt-1">History of actions and pending requests by administrators</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-3xl font-bold text-gray-900">{totalActions}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <p className="text-sm text-gray-500">Total Actions Logged</p>
          </div>
        </div>
      </div>

      {/* Request Cards */}
      <div className="space-y-3">
        {requests.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No requests found.</p>
          </div>
        ) : (
          requests.map((req: any) => (
            <div key={req.id} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 hover:border-gray-300 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className="mt-0.5">
                    {req.status === 'PENDING' ? <Clock className="h-5 w-5 text-amber-500" /> : 
                     req.status === 'APPROVED' ? <CheckCircle className="h-5 w-5 text-emerald-500" /> :
                     <XCircle className="h-5 w-5 text-rose-500" />}
                  </div>
                  
                  <div>
                    {/* Action Type Badge */}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${actionTypeColors[req.action_type] || 'bg-gray-100 text-gray-700'}`}>
                      {actionTypeLabel[req.action_type] || req.action_type}
                    </span>
                    
                    {/* Description */}
                    <div className="mt-2 text-sm text-gray-700">
                      {req.action_type === 'UPDATE_STATUS' && req.payload?.status && (
                        <span>Update site status to <strong>{req.payload.status}</strong></span>
                      )}
                      {req.action_type === 'ADD_SITE' && req.payload?.name && (
                        <span>Add new site: <strong>{req.payload.name}</strong> ({req.payload.city})</span>
                      )}
                      {req.action_type === 'DELETE_SITE' && (
                        <span>Delete site request</span>
                      )}
                      {req.action_type === 'UPDATE_SITE' && req.payload?.name && (
                        <span>Edit site: <strong>{req.payload.name}</strong></span>
                      )}
                      {req.action_type === 'UPDATE_ENQUIRY_STATUS' && (
                        <span>Enquiry #{req.payload?.enquiry_id} status changed to <strong>{req.payload?.status}</strong></span>
                      )}
                      {req.action_type === 'ENQUIRY_NOTE' && (
                        <span>Added internal note to Enquiry #{req.payload?.enquiry_id}</span>
                      )}
                      {req.action_type === 'ENQUIRY_REPLY' && (
                        <span>Sent reply to Enquiry #{req.payload?.enquiry_id}</span>
                      )}
                      {req.action_type === 'FLEX_TRANSACTION' && (
                        <span>Flex inventory: <strong>{req.payload?.quantity}x {req.payload?.size}</strong> ({req.payload?.type})</span>
                      )}
                    </div>

                    {/* Requester info */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="h-7 w-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                        {(req.profiles?.name?.[0] || 'U').toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{req.profiles?.name || 'Unknown User'}</p>
                        <p className="text-xs text-gray-500">{req.profiles?.email}</p>
                      </div>
                      <span className="text-xs text-gray-400 ml-2">
                        {new Date(req.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-9 sm:ml-0">
                  {req.status === 'PENDING' ? (
                    <ApprovalActions requestId={req.id} />
                  ) : (
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${
                      req.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>{req.status === 'APPROVED' ? 'AUTO-APPROVED' : req.status}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
