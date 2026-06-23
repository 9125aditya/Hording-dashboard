"use client";

import { useState, useEffect } from "react";
import { Search, CheckCircle2, XCircle, Mail, Clock, ArrowLeft, Phone, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Enquiry = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  site: string; // we'll just mock this or join it if we want, but for now we'll say "Multiple Sites" if we don't have the join
  siteId: string;
  status: string;
  date: string;
  message: string;
};

const statusStyle = (status: string) => {
  switch (status) {
    case "New": return "bg-primary text-primary-foreground";
    case "Contacted": return "bg-secondary text-secondary-foreground";
    case "Converted": return "bg-available text-primary-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

export default function EnquiriesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchEnquiries() {
      const { data } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
      if (data) {
        setEnquiries(data.map((e: any) => ({
          id: e.id,
          name: e.name,
          company: e.company || 'N/A',
          email: e.email,
          phone: e.phone || 'N/A',
          site: 'Various',
          siteId: 'Multiple',
          status: e.status,
          date: new Date(e.created_at).toLocaleDateString(),
          message: e.message
        })));
      }
      setLoading(false);
    }
    fetchEnquiries();
  }, [supabase]);

  const selected = enquiries.find((e) => e.id === selectedId) ?? null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-heading">Enquiries</h1>
          <p className="text-sm text-muted-foreground">Manage leads from the public catalog.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm flex flex-1 overflow-hidden">

        {/* Inbox List (Left Panel) — full width on mobile, hidden once a lead is opened */}
        <div className={`w-full md:w-1/3 lg:w-2/5 border-r border-border flex-col bg-muted/10 ${selected ? "hidden md:flex" : "flex"}`}>
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search leads..."
                className="w-full h-9 pl-9 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar">
              <button className="whitespace-nowrap px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">All (42)</button>
              <button className="whitespace-nowrap px-3 py-1 rounded-full hover:bg-muted text-muted-foreground text-xs font-medium">New (12)</button>
              <button className="whitespace-nowrap px-3 py-1 rounded-full hover:bg-muted text-muted-foreground text-xs font-medium">Contacted</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-primary" /></div>
            ) : enquiries.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No enquiries found.</div>
            ) : (
              enquiries.map((eq) => (
                <button
                  key={eq.id}
                  onClick={() => setSelectedId(eq.id)}
                className={`w-full text-left p-4 border-b border-border cursor-pointer transition-colors ${eq.id === selectedId ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-muted/50"}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-sm">{eq.name}</h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{eq.date}</span>
                </div>
                <div className="text-xs text-muted-foreground mb-2">{eq.company}</div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-xs font-medium text-foreground truncate">{eq.site}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider whitespace-nowrap ${statusStyle(eq.status)}`}>
                    {eq.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Lead Detail (Right Panel) — full width on mobile, only shown once a lead is opened */}
        <div className={`flex-1 flex-col bg-background relative ${selected ? "flex" : "hidden md:flex"}`}>
          {selected ? (
            <>
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => setSelectedId(null)}
                    className="md:hidden mt-1 -ml-1 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
                    aria-label="Back to list"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{selected.name}</h2>
                    <p className="text-muted-foreground text-sm mt-1 flex items-center"><Mail className="h-3 w-3 mr-1 flex-shrink-0" /> {selected.email}</p>
                    <p className="text-muted-foreground text-sm mt-1 flex items-center"><Phone className="h-3 w-3 mr-1 flex-shrink-0" /> {selected.phone}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button className="inline-flex h-9 items-center justify-center rounded-md bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground shadow-sm hover:bg-secondary/80 transition-colors">
                    <Clock className="mr-2 h-4 w-4" /> <span className="hidden sm:inline">Mark</span> Contacted
                  </button>
                  <button className="inline-flex h-9 items-center justify-center rounded-md bg-available px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-available/90 transition-colors">
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Convert
                  </button>
                  <button className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-muted-foreground hover:text-destructive hover:border-destructive hover:bg-destructive/10 transition-colors">
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-8">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Company Details</h3>
                    <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                      <p className="text-sm"><span className="text-muted-foreground mr-2">Company:</span> <span className="font-medium">{selected.company}</span></p>
                      <p className="text-sm"><span className="text-muted-foreground mr-2">Contact:</span> <span className="font-medium">{selected.phone}</span></p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Interest</h3>
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
                      <p className="text-sm"><span className="text-primary/70 mr-2">Site:</span> <span className="font-medium text-primary">{selected.site}</span></p>
                      <p className="text-sm"><span className="text-primary/70 mr-2">ID:</span> <span className="font-mono text-xs">{selected.siteId}</span></p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Message</h3>
                  <div className="bg-card border border-border rounded-lg p-4 sm:p-5 shadow-sm">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                  </div>
                </div>
              </div>

              {/* Reply Box placeholder */}
              <div className="p-4 border-t border-border bg-muted/10">
                <div className="relative">
                  <textarea placeholder="Write a reply or internal note..." className="w-full p-3 pr-3 sm:pr-24 pb-12 sm:pb-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px] resize-none" />
                  <div className="absolute right-3 bottom-3 flex gap-2">
                    <button className="px-3 py-1.5 rounded-md text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80">Add Note</button>
                    <button className="px-3 py-1.5 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">Reply</button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
              <Mail className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p>Select an enquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
