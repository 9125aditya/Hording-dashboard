"use client";

import { useState, useTransition, useMemo } from "react";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trash2, 
  Search, 
  Filter, 
  CheckSquare, 
  Square, 
  Loader2, 
  AlertTriangle,
  RefreshCw,
  Layers,
  ArrowUpDown
} from "lucide-react";
import { 
  deleteActionRequest, 
  deleteBulkActionRequests, 
  clearAllActionRequests,
  approveRequest,
  rejectRequest 
} from "@/backend/actions/approvals";
import ApprovalActions from "./ApprovalActions";

export type AdminRequestItem = {
  id: string;
  action_type: string;
  status: string;
  payload: any;
  requested_by: string;
  created_at: string;
  resolved_at?: string;
  resolved_by?: string;
  profiles?: {
    id: string;
    name: string;
    email: string;
  } | null;
};

const ACTION_TYPE_COLORS: Record<string, string> = {
  ADD_SITE: "bg-emerald-100 text-emerald-700 border-emerald-200",
  UPDATE_SITE: "bg-blue-100 text-blue-700 border-blue-200",
  UPDATE_STATUS: "bg-indigo-100 text-indigo-700 border-indigo-200",
  DELETE_SITE: "bg-rose-100 text-rose-700 border-rose-200",
  UPDATE_ENQUIRY_STATUS: "bg-amber-100 text-amber-700 border-amber-200",
  ENQUIRY_NOTE: "bg-purple-100 text-purple-700 border-purple-200",
  ENQUIRY_REPLY: "bg-cyan-100 text-cyan-700 border-cyan-200",
  FLEX_TRANSACTION: "bg-orange-100 text-orange-700 border-orange-200",
  SITE_BOOKING: "bg-blue-100 text-blue-700 border-blue-200",
  EMAIL_SENT: "bg-purple-100 text-purple-700 border-purple-200",
};

const ACTION_TYPE_LABELS: Record<string, string> = {
  ADD_SITE: "Add Site",
  UPDATE_SITE: "Edit Site",
  UPDATE_STATUS: "Update Status",
  DELETE_SITE: "Delete Site",
  UPDATE_ENQUIRY_STATUS: "Enquiry Status",
  ENQUIRY_NOTE: "Enquiry Note",
  ENQUIRY_REPLY: "Enquiry Reply",
  FLEX_TRANSACTION: "Flex Inventory",
  SITE_BOOKING: "Booking Confirmation",
  EMAIL_SENT: "Email Sent",
};

export default function ActionHistoryClient({ initialRequests }: { initialRequests: AdminRequestItem[] }) {
  const [requests, setRequests] = useState<AdminRequestItem[]>(initialRequests);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Sync state if initialRequests changes from server
  useMemo(() => {
    setRequests(initialRequests);
  }, [initialRequests]);

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      if (typeFilter !== "ALL" && req.action_type !== typeFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const typeMatch = (ACTION_TYPE_LABELS[req.action_type] || req.action_type).toLowerCase().includes(q);
        const nameMatch = req.profiles?.name?.toLowerCase().includes(q);
        const emailMatch = req.profiles?.email?.toLowerCase().includes(q);
        const statusMatch = req.status?.toLowerCase().includes(q);
        const payloadMatch = JSON.stringify(req.payload || {}).toLowerCase().includes(q);
        if (!typeMatch && !nameMatch && !emailMatch && !statusMatch && !payloadMatch) return false;
      }
      return true;
    });
  }, [requests, search, typeFilter]);

  // Checkbox Selection
  const isAllSelected = filteredRequests.length > 0 && filteredRequests.every(r => selectedIds.has(r.id));
  const isSomeSelected = selectedIds.size > 0;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      // Unselect all currently filtered
      setSelectedIds(prev => {
        const next = new Set(prev);
        filteredRequests.forEach(r => next.delete(r.id));
        return next;
      });
    } else {
      // Select all currently filtered
      setSelectedIds(prev => {
        const next = new Set(prev);
        filteredRequests.forEach(r => next.add(r.id));
        return next;
      });
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Delete Single Request
  const handleDeleteOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this action history entry?")) return;

    setDeletingId(id);
    startTransition(async () => {
      const res = await deleteActionRequest(id);
      if (res?.error) {
        alert("Failed to delete: " + res.error);
      } else {
        setRequests(prev => prev.filter(r => r.id !== id));
        setSelectedIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
      setDeletingId(null);
    });
  };

  // Delete Bulk Selected
  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    const count = selectedIds.size;
    if (!window.confirm(`Are you sure you want to delete ${count} selected action history ${count === 1 ? "entry" : "entries"}?`)) {
      return;
    }

    const idsToDelete = Array.from(selectedIds);
    startTransition(async () => {
      const res = await deleteBulkActionRequests(idsToDelete);
      if (res?.error) {
        alert("Failed to delete: " + res.error);
      } else {
        setRequests(prev => prev.filter(r => !selectedIds.has(r.id)));
        setSelectedIds(new Set());
      }
    });
  };

  // Clear All
  const handleClearAll = () => {
    if (requests.length === 0) return;
    if (!window.confirm(`Are you sure you want to clear ALL ${requests.length} action history logs? This action cannot be undone.`)) {
      return;
    }

    startTransition(async () => {
      const res = await clearAllActionRequests();
      if (res?.error) {
        alert("Failed to clear history: " + res.error);
      } else {
        setRequests([]);
        setSelectedIds(new Set());
      }
    });
  };

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Action History</h1>
          <p className="text-sm text-gray-500 mt-1">History of actions and pending requests by administrators</p>
        </div>

        {requests.length > 0 && (
          <button
            onClick={handleClearAll}
            disabled={isPending}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-xs self-start sm:self-auto"
          >
            <Trash2 className="h-4 w-4 text-rose-600" />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {/* Stats Counter Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <p className="text-3xl font-bold text-gray-900">{requests.length}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <p className="text-xs font-semibold text-gray-500">Total Actions Logged</p>
          </div>
        </div>

        {isSomeSelected && (
          <div className="bg-indigo-50/80 rounded-2xl border border-indigo-200 p-5 shadow-xs flex items-center justify-between sm:col-span-2">
            <div>
              <p className="text-2xl font-black text-indigo-900">{selectedIds.size} Selected</p>
              <p className="text-xs text-indigo-600 font-semibold mt-0.5">Ready for batch deletion</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedIds(new Set())}
                className="px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-xl shadow-xs cursor-pointer"
              >
                Deselect
              </button>
              <button
                onClick={handleDeleteSelected}
                disabled={isPending}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                <span>Delete Selected ({selectedIds.size})</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toolbar: Search, Filters & Select All */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Select All Checkbox & Count */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-xl border border-gray-200 transition-colors">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={toggleSelectAll}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <span>Select All ({filteredRequests.length})</span>
          </label>

          {isSomeSelected && (
            <button
              onClick={handleDeleteSelected}
              disabled={isPending}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5 text-rose-600" />
              <span>Delete ({selectedIds.size})</span>
            </button>
          )}
        </div>

        {/* Right: Search & Type Filter */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search actions, user, email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs font-medium rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="h-9 px-3 text-xs font-bold text-gray-700 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
          >
            <option value="ALL">All Action Types</option>
            {Object.keys(ACTION_TYPE_LABELS).map(key => (
              <option key={key} value={key}>{ACTION_TYPE_LABELS[key]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Request Cards List */}
      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-xs">
            <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-600">No action logs match your filter.</p>
            {(search || typeFilter !== "ALL") && (
              <button
                onClick={() => { setSearch(""); setTypeFilter("ALL"); }}
                className="mt-3 px-3.5 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          filteredRequests.map((req) => {
            const isSelected = selectedIds.has(req.id);
            const isDeleting = deletingId === req.id;

            return (
              <div 
                key={req.id} 
                className={`bg-white rounded-2xl border p-4 sm:p-5 transition-all shadow-xs ${
                  isSelected 
                    ? "border-indigo-300 bg-indigo-50/20 ring-1 ring-indigo-200" 
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Select Checkbox */}
                    <div className="mt-1 shrink-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(req.id)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </div>

                    {/* Status Icon */}
                    <div className="mt-0.5 shrink-0">
                      {req.status === 'PENDING' ? (
                        <Clock className="h-5 w-5 text-amber-500" />
                      ) : req.status === 'APPROVED' ? (
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-rose-500" />
                      )}
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      {/* Action Type Badge */}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${ACTION_TYPE_COLORS[req.action_type] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                        {ACTION_TYPE_LABELS[req.action_type] || req.action_type}
                      </span>
                      
                      {/* Description */}
                      <div className="mt-2 text-sm text-gray-800 font-medium">
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
                        {req.action_type === 'SITE_BOOKING' && (
                          <span>Booking: <strong>{req.payload?.client_name}</strong> for <strong>{req.payload?.site_name}</strong> ({req.payload?.booking_type || 'Blocked Hold'})</span>
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
                        {req.action_type === 'EMAIL_SENT' && (
                          <span>Email sent to <strong>{req.payload?.client_email}</strong> regarding <strong>{req.payload?.booking_id || 'booking'}</strong> (<strong>{req.payload?.email_status || 'status unknown'}</strong>)</span>
                        )}
                      </div>

                      {/* Requester info */}
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                            {(req.profiles?.name?.[0] || 'U').toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-900">{req.profiles?.name || 'Unknown User'}</span>
                          <span className="text-gray-400 font-normal">({req.profiles?.email || 'no-email'})</span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-500 font-medium">
                          {new Date(req.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Action Buttons */}
                  <div className="flex items-center gap-2.5 ml-8 sm:ml-0 shrink-0">
                    {req.status === 'PENDING' ? (
                      <ApprovalActions requestId={req.id} />
                    ) : (
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${
                        req.status === 'APPROVED' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {req.status === 'APPROVED' ? 'AUTO-APPROVED' : req.status}
                      </span>
                    )}

                    {/* Single Delete Button */}
                    <button
                      onClick={(e) => handleDeleteOne(req.id, e)}
                      disabled={isPending || isDeleting}
                      className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-rose-200"
                      title="Delete this action history entry"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin text-rose-500" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
