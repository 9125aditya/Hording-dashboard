"use client";

import { useState, useEffect, useTransition, useMemo, useDeferredValue } from "react";
import { Search, CheckCircle2, XCircle, Mail, Clock, ArrowLeft, Phone, Loader2, Building } from "lucide-react";
import { createClient } from "@/backend/db/client";
import { updateEnquiryStatus, addEnquiryNote } from "@/backend/actions/actions";

type Enquiry = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  site: string;
  siteId: string;
  status: string;
  date: string;
  message: string;
};

const statusStyle = (status: string) => {
  switch (status) {
    case "New": return "bg-indigo-100 text-indigo-700";
    case "Contacted": return "bg-amber-100 text-amber-700";
    case "Converted": return "bg-emerald-100 text-emerald-700";
    case "Lost": return "bg-gray-100 text-gray-500";
    default: return "bg-gray-100 text-gray-500";
  }
};

export default function EnquiriesClient() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [activeTab, setActiveTab] = useState<"All" | "New" | "Contacted">("All");
  const [replyText, setReplyText] = useState("");
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  const handleStatusChange = (id: string, status: string) => {
    // Optimistic update for instant feedback
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    startTransition(async () => {
      await updateEnquiryStatus(id, status);
    });
  };

  const handleAddNote = () => {
    if (!replyText.trim() || !selectedId) return;
    const eq = enquiries.find(e => e.id === selectedId);
    if (!eq) return;

    const timestamp = new Date().toLocaleString('en-IN');
    const updatedMsg = `${eq.message || ''}\n\n[INTERNAL NOTE - ${timestamp}]\n${replyText}`;
    const textToSave = replyText;

    // Optimistic update
    setEnquiries(prev => prev.map(e => e.id === selectedId ? { ...e, message: updatedMsg } : e));
    setReplyText("");

    startTransition(async () => {
      await addEnquiryNote(selectedId, eq.message || '', textToSave, false);
    });
  };



  useEffect(() => {
    async function fetchEnquiries() {
      const { data } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
      if (data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setEnquiries(data.map((e: any) => ({
          id: e.id,
          name: e.name || 'Unknown',
          company: e.company || '',
          email: e.email || '',
          phone: e.phone || '',
          site: 'Various',
          siteId: 'Multiple',
          status: e.status,
          date: new Date(e.created_at).toLocaleDateString(),
          message: e.message || ''
        })));
      }
      setLoading(false);
    }
    fetchEnquiries();
  }, [supabase]);

  const filteredEnquiries = useMemo(() => {
    const lowerQuery = deferredSearchQuery.toLowerCase();
    return enquiries.filter(eq => {
      const matchesSearch = (eq.name || '').toLowerCase().includes(lowerQuery) || 
                            (eq.email || '').toLowerCase().includes(lowerQuery) || 
                            (eq.company || '').toLowerCase().includes(lowerQuery);
      const matchesTab = activeTab === "All" || eq.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [enquiries, deferredSearchQuery, activeTab]);

  const selected = enquiries.find((e) => e.id === selectedId) ?? null;

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Enquiries</h1>
          <p className="text-sm text-gray-500 mt-1">Manage leads from the public catalog</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl flex flex-1 overflow-hidden">

        {/* Inbox List (Left Panel) */}
        <div className={`w-full md:w-[360px] lg:w-[400px] border-r border-gray-200 flex-col ${selected ? "hidden md:flex" : "flex"}`}>
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
              />
            </div>
            <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar">
              {(["All", "New", "Contacted"] as const).map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)} 
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeTab === tab 
                      ? "bg-indigo-600 text-white" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab} {tab === "All" ? enquiries.length : enquiries.filter(e => e.status === tab).length}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-indigo-500" /></div>
            ) : filteredEnquiries.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">No enquiries found.</div>
            ) : (
              filteredEnquiries.map((eq) => (
                <button
                  key={eq.id}
                  onClick={() => setSelectedId(eq.id)}
                  className={`w-full text-left p-4 border-b border-gray-100 cursor-pointer transition-all ${
                    eq.id === selectedId 
                      ? "bg-indigo-50 border-l-[3px] border-l-indigo-600" 
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {eq.name[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900">{eq.name}</h4>
                        <p className="text-xs text-gray-500">{eq.company}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-gray-400 whitespace-nowrap ml-2">{eq.date}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2 ml-[42px]">
                    <span className="text-xs text-gray-500 truncate">{eq.message?.substring(0, 60) || 'No message'}...</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider whitespace-nowrap ${statusStyle(eq.status)}`}>
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
              {/* Header */}
              <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedId(null)}
                    className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
                    aria-label="Back to list"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div className="h-11 w-11 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold flex-shrink-0">
                    {selected.name[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{selected.name}</h2>
                    <p className="text-sm text-gray-500">{selected.company}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button 
                    onClick={() => handleStatusChange(selected.id, "Contacted")}
                    disabled={isPending}
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-all disabled:opacity-50">
                    <Clock className="mr-2 h-4 w-4 text-amber-500" /> Contacted
                  </button>
                  <button 
                    onClick={() => handleStatusChange(selected.id, "Converted")}
                    disabled={isPending}
                    className="inline-flex h-9 items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 transition-all disabled:opacity-50">
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Convert
                  </button>
                  <button 
                    onClick={() => handleStatusChange(selected.id, "Lost")}
                    disabled={isPending}
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all disabled:opacity-50">
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 overflow-y-auto">
                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Contact Information</h3>
                    <div className="space-y-2.5">
                      <p className="text-sm flex items-center gap-2 text-gray-700">
                        <Mail className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" /> {selected.email}
                      </p>
                      <p className="text-sm flex items-center gap-2 text-gray-700">
                        <Phone className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" /> {selected.phone}
                      </p>
                      <p className="text-sm flex items-center gap-2 text-gray-700">
                        <Building className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" /> {selected.company}
                      </p>
                    </div>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-4">
                    <h3 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-3">Interest</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-indigo-700"><span className="text-indigo-500">Site:</span> <strong>{selected.site}</strong></p>
                      <p className="text-sm text-indigo-700"><span className="text-indigo-500">ID:</span> <span className="font-mono text-xs">{selected.siteId}</span></p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Message</h3>
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{selected.message}</p>
                  </div>
                </div>
              </div>

              {/* Reply Box */}
              <div className="p-4 border-t border-gray-200">
                <div className="relative">
                  <textarea 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write an internal note for your team..." 
                    className="w-full p-3 pr-3 sm:pr-24 pb-12 sm:pb-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 min-h-[80px] resize-none transition-all" 
                  />
                  <div className="absolute right-3 bottom-3 flex gap-2">
                    <button 
                      onClick={handleAddNote}
                      disabled={!replyText.trim()}
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-all">
                      Add Note
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
              <Mail className="h-14 w-14 text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium">Select an enquiry to view details</p>
              <p className="text-xs text-gray-400 mt-1">Choose from the list on the left</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
