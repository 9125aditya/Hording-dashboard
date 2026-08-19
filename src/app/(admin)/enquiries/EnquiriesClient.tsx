"use client";

import { useState, useEffect, useTransition, useMemo, useDeferredValue } from "react";
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  Mail, 
  Clock, 
  ArrowLeft, 
  Phone, 
  Loader2, 
  Building, 
  FileSpreadsheet, 
  Sparkles, 
  RotateCcw,
  RefreshCw,
  Check
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/backend/db/client";
import { updateEnquiryStatus, addEnquiryNote, getEnquiriesList } from "@/backend/actions/actions";

type Enquiry = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  site: string;
  siteId: string;
  status: "New" | "Contacted" | "Converted" | "Lost" | string;
  date: string;
  message: string;
};

const statusStyle = (status: string) => {
  switch (status) {
    case "New": return "bg-indigo-100 text-indigo-700 border border-indigo-200";
    case "Contacted": return "bg-amber-100 text-amber-800 border border-amber-200";
    case "Converted": return "bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold";
    case "Lost": return "bg-rose-50 text-rose-600 border border-rose-200";
    default: return "bg-gray-100 text-gray-600 border border-gray-200";
  }
};

export default function EnquiriesClient() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [activeTab, setActiveTab] = useState<"All" | "New" | "Contacted" | "Converted" | "Lost">("All");
  const [replyText, setReplyText] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  const fetchEnquiries = async (isManualRefresh = false) => {
    setLoading(true);
    try {
      // 1. Try server action first for complete RBAC privileges
      const res = await getEnquiriesList();
      let records = res?.data;

      // 2. Fallback to client Supabase if needed
      if (!records || records.length === 0) {
        const { data } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
        if (data && data.length > 0) records = data;
      }

      if (records) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setEnquiries(records.map((e: any) => ({
          id: e.id,
          name: e.name || 'Unknown Lead',
          company: e.company || 'Private Client',
          email: e.email || '',
          phone: e.phone || '',
          site: e.message?.includes('[Preferred Site:') ? e.message.split('[Preferred Site:')[1]?.split(']')[0]?.trim() : 'General Inquiry',
          siteId: e.id.substring(0, 8),
          status: e.status || 'New',
          date: new Date(e.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
          message: e.message || ''
        })));
        if (isManualRefresh) {
          showToast("Leads refreshed from database 🔄");
        }
      }
    } catch (err) {
      console.error("fetchEnquiries error:", err);
      if (isManualRefresh) {
        showToast("Could not refresh leads.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = (id: string, newStatus: "New" | "Contacted" | "Converted" | "Lost") => {
    // 1. Optimistically update local state for immediate UI feedback
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e)));
    
    if (newStatus === "Contacted") {
      showToast("Lead marked as Contacted 📞");
    } else if (newStatus === "Converted") {
      showToast("Lead successfully Converted to Client! 🎉");
    } else if (newStatus === "New") {
      showToast("Lead status reset to New 🔄");
    } else {
      showToast("Lead status updated to Lost");
    }

    // 2. Perform server action update
    startTransition(async () => {
      const res = await updateEnquiryStatus(id, newStatus);
      if (res?.error) {
        showToast(`Failed to update status: ${res.error}`);
        // Revert on failure
        fetchEnquiries();
      }
    });
  };

  const handleAddNote = () => {
    if (!replyText.trim() || !selectedId) return;
    const eq = enquiries.find(e => e.id === selectedId);
    if (!eq) return;

    const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
    const updatedMsg = `${eq.message || ''}\n\n[INTERNAL NOTE - ${timestamp}]\n${replyText.trim()}`;
    const textToSave = replyText.trim();

    // Optimistic update
    setEnquiries(prev => prev.map(e => e.id === selectedId ? { ...e, message: updatedMsg } : e));
    setReplyText("");
    showToast("Internal note added to lead thread 📝");

    startTransition(async () => {
      const res = await addEnquiryNote(selectedId, eq.message || '', textToSave, false);
      if (res?.error) {
        showToast(`Failed to save note: ${res.error}`);
        fetchEnquiries();
      }
    });
  };

  const filteredEnquiries = useMemo(() => {
    const lowerQuery = deferredSearchQuery.toLowerCase();
    return enquiries.filter(eq => {
      const matchesSearch = (eq.name || '').toLowerCase().includes(lowerQuery) || 
                            (eq.email || '').toLowerCase().includes(lowerQuery) || 
                            (eq.company || '').toLowerCase().includes(lowerQuery) ||
                            (eq.phone || '').toLowerCase().includes(lowerQuery);
      const matchesTab = activeTab === "All" || eq.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [enquiries, deferredSearchQuery, activeTab]);

  const selected = enquiries.find((e) => e.id === selectedId) ?? null;

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto h-[calc(100vh-8rem)] flex flex-col relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="h-4 w-4 text-[#fab935]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Enquiries & Leads</h1>
          <p className="text-sm text-gray-500 mt-1">Manage, follow up, and convert campaign inquiries from clients</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchEnquiries(true)}
            disabled={loading}
            title="Reload latest leads from database"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 hover:text-indigo-600 hover:border-gray-300 transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-indigo-600" : "text-gray-500"}`} />
            <span>Refresh</span>
          </button>
          <Link 
            href="/quotations" 
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors shadow-xs"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Open Quotations Tool</span>
          </Link>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="bg-white border border-gray-200 rounded-xl flex flex-1 overflow-hidden shadow-xs">

        {/* Inbox List (Left Panel) */}
        <div className={`w-full md:w-[360px] lg:w-[420px] border-r border-gray-200 flex-col ${selected ? "hidden md:flex" : "flex"}`}>
          <div className="p-4 border-b border-gray-200 bg-slate-50/50">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, company, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-4 rounded-lg border border-gray-200 bg-white text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all shadow-xs"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1.5 mt-3 overflow-x-auto hide-scrollbar pb-0.5">
              {(["All", "New", "Contacted", "Converted", "Lost"] as const).map(tab => {
                const count = tab === "All" ? enquiries.length : enquiries.filter(e => e.status === tab).length;
                return (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)} 
                    className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === tab 
                        ? tab === "Converted" 
                          ? "bg-emerald-600 text-white shadow-xs" 
                          : tab === "Contacted"
                          ? "bg-amber-600 text-white shadow-xs"
                          : tab === "Lost"
                          ? "bg-rose-600 text-white shadow-xs"
                          : "bg-indigo-600 text-white shadow-xs"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span>{tab}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      activeTab === tab 
                        ? "bg-white/20 text-white" 
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Leads List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {loading ? (
              <div className="p-10 flex flex-col items-center justify-center gap-2 text-gray-400">
                <Loader2 className="animate-spin h-6 w-6 text-indigo-600" />
                <span className="text-xs">Loading leads...</span>
              </div>
            ) : filteredEnquiries.length === 0 ? (
              <div className="p-10 text-center text-gray-400 text-xs flex flex-col items-center gap-2">
                <Mail className="h-8 w-8 text-gray-300" />
                <span>No enquiries found in &quot;{activeTab}&quot; tab.</span>
              </div>
            ) : (
              filteredEnquiries.map((eq) => (
                <button
                  key={eq.id}
                  onClick={() => setSelectedId(eq.id)}
                  className={`w-full text-left p-4 cursor-pointer transition-all ${
                    eq.id === selectedId 
                      ? "bg-indigo-50/70 border-l-4 border-l-indigo-600" 
                      : "hover:bg-gray-50/80"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        eq.status === "Converted" 
                          ? "bg-emerald-100 text-emerald-700" 
                          : eq.status === "Contacted"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-indigo-100 text-indigo-700"
                      }`}>
                        {eq.name[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-gray-900 truncate">{eq.name}</h4>
                        <p className="text-[11px] text-gray-500 truncate">{eq.company}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2 font-medium">{eq.date}</span>
                  </div>

                  <div className="flex justify-between items-center gap-2 ml-[34px]">
                    <span className="text-[11.5px] text-gray-500 truncate">{eq.message?.substring(0, 50) || 'No message provided'}...</span>
                    <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap ${statusStyle(eq.status)}`}>
                      {eq.status}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Lead Detail (Right Panel) */}
        <div className={`flex-1 flex-col bg-white relative ${selected ? "flex" : "hidden md:flex"}`}>
          {selected ? (
            <>
              {/* Header with Interactive Action Buttons */}
              <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-slate-50/40">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => setSelectedId(null)}
                    className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
                    aria-label="Back to list"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-xs flex-shrink-0 ${
                    selected.status === "Converted"
                      ? "bg-emerald-600"
                      : selected.status === "Contacted"
                      ? "bg-amber-600"
                      : "bg-indigo-600"
                  }`}>
                    {selected.name[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-gray-900 truncate">{selected.name}</h2>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${statusStyle(selected.status)}`}>
                        {selected.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium truncate">{selected.company}</p>
                  </div>
                </div>

                {/* Status Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  {/* CONTACTED BUTTON */}
                  <button 
                    onClick={() => handleStatusChange(selected.id, "Contacted")}
                    disabled={isPending}
                    title="Mark lead as Contacted"
                    className={`inline-flex h-9 items-center justify-center rounded-lg px-3.5 text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50 ${
                      selected.status === "Contacted"
                        ? "bg-amber-600 text-white ring-2 ring-amber-400/40"
                        : "bg-white border border-amber-200 text-amber-800 hover:bg-amber-50 hover:border-amber-300"
                    }`}
                  >
                    {selected.status === "Contacted" ? (
                      <Check className="mr-1.5 h-3.5 w-3.5" />
                    ) : (
                      <Clock className="mr-1.5 h-3.5 w-3.5 text-amber-600" />
                    )}
                    <span>{selected.status === "Contacted" ? "Contacted ✓" : "Mark Contacted"}</span>
                  </button>

                  {/* CONVERT BUTTON */}
                  <button 
                    onClick={() => handleStatusChange(selected.id, "Converted")}
                    disabled={isPending}
                    title="Convert lead to customer"
                    className={`inline-flex h-9 items-center justify-center rounded-lg px-4 text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50 ${
                      selected.status === "Converted"
                        ? "bg-emerald-700 text-white ring-2 ring-emerald-400/40"
                        : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20"
                    }`}
                  >
                    <CheckCircle2 className="mr-1.5 h-4 w-4" />
                    <span>{selected.status === "Converted" ? "Converted Deal ✓" : "Convert Lead"}</span>
                  </button>

                  {/* REOPEN AS NEW BUTTON */}
                  {selected.status !== "New" && (
                    <button 
                      onClick={() => handleStatusChange(selected.id, "New")}
                      disabled={isPending}
                      title="Reopen lead and reset status to New"
                      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
                    >
                      <RotateCcw className="h-3.5 w-3.5 text-gray-400" />
                      <span>Reopen (New)</span>
                    </button>
                  )}

                  {/* MARK LOST BUTTON */}
                  <button 
                    onClick={() => handleStatusChange(selected.id, "Lost")}
                    disabled={isPending}
                    title="Mark lead as Lost"
                    className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-all cursor-pointer disabled:opacity-50 shadow-xs ${
                      selected.status === "Lost"
                        ? "bg-rose-600 text-white border-rose-600 font-bold"
                        : "border-gray-200 bg-white text-gray-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50"
                    }`}
                  >
                    <XCircle className="h-3.5 w-3.5 text-rose-500" />
                    <span>{selected.status === "Lost" ? "Lost ✕" : "Mark Lost"}</span>
                  </button>
                </div>
              </div>

              {/* Converted Callout Banner */}
              {selected.status === "Converted" && (
                <div className="mx-5 mt-4 p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-900">Lead Successfully Converted!</p>
                      <p className="text-[11px] text-emerald-700">Generate a custom billboard quotation or campaign proposal for {selected.company || selected.name}.</p>
                    </div>
                  </div>
                  <Link
                    href="/quotations"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs shrink-0"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5" />
                    <span>Create Proposal</span>
                  </Link>
                </div>
              )}

              {/* Body Content */}
              <div className="p-5 flex-1 overflow-y-auto space-y-6">
                {/* Contact Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">Client Contact</h3>
                    <div className="space-y-2.5 text-xs text-gray-700">
                      <p className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-indigo-500 flex-shrink-0" />
                        <a href={`mailto:${selected.email}`} className="text-indigo-600 hover:underline font-medium truncate">{selected.email || 'No email'}</a>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                        <a href={`tel:${selected.phone}`} className="font-medium hover:underline">{selected.phone || 'No phone number'}</a>
                      </p>
                      <p className="flex items-center gap-2">
                        <Building className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                        <span className="font-medium">{selected.company || 'Not provided'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-indigo-50/70 rounded-xl p-4 border border-indigo-100">
                    <h3 className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider mb-3">Campaign Scope</h3>
                    <div className="space-y-2 text-xs text-indigo-900">
                      <p><span className="text-indigo-600 font-semibold">Preferred Location:</span> <strong className="text-indigo-950">{selected.site}</strong></p>
                      <p><span className="text-indigo-600 font-semibold">Received On:</span> <span className="font-medium">{selected.date}</span></p>
                      <p><span className="text-indigo-600 font-semibold">Lead ID:</span> <span className="font-mono text-[10.5px] bg-indigo-100 px-1.5 py-0.5 rounded">{selected.siteId}</span></p>
                    </div>
                  </div>
                </div>

                {/* Message & Activity Thread */}
                <div>
                  <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">Inquiry & Activity Thread</h3>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
                    <p className="text-xs leading-relaxed text-gray-800 whitespace-pre-wrap font-sans">
                      {selected.message || 'No initial message included with this enquiry.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Internal Note Box */}
              <div className="p-4 border-t border-gray-200 bg-slate-50/50">
                <div className="relative">
                  <textarea 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Add an internal note or follow-up summary for the team..." 
                    className="w-full p-3 pr-24 pb-3 rounded-xl border border-gray-200 bg-white text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 min-h-[75px] resize-none transition-all shadow-xs" 
                  />
                  <div className="absolute right-3 bottom-3 flex gap-2">
                    <button 
                      onClick={handleAddNote}
                      disabled={!replyText.trim() || isPending}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                      <span>Save Note</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
              <Mail className="h-12 w-12 text-gray-200 mb-3" />
              <p className="text-sm font-bold text-gray-700">Select an enquiry to view details</p>
              <p className="text-xs text-gray-400 mt-1">Choose a lead from the left inbox list to change status, add notes, or convert.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
