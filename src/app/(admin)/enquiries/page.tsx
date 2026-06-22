"use client";

import { useState } from "react";
import { Search, CheckCircle2, XCircle, Mail, Clock, ArrowLeft, Phone } from "lucide-react";

const ENQUIRIES = [
  { id: 1, name: "Priya Sharma", company: "Reliance Retail", email: "priya@reliance.com", phone: "+91 98765 43210", site: "Cyber Hub", siteId: "S-1043", status: "New", date: "10 mins ago", message: "Hi team,\n\nWe are looking to launch a new festive campaign next quarter and the Cyber Hub digital hoarding fits our demographic perfectly.\n\nCould you please send over the rate card for Q3 and confirm if this site is available for a 4-week buy starting in July?\n\nThanks,\nPriya" },
  { id: 2, name: "Rahul Desai", company: "Tata Motors", email: "rahul@tata.com", phone: "+91 98123 45678", site: "Bandra Kurla Complex", siteId: "S-1047", status: "New", date: "2 hours ago", message: "Hello,\n\nInterested in the BKC front-lit hoarding for an upcoming launch event. Please share availability and pricing for a 2-month booking.\n\nRegards,\nRahul" },
  { id: 3, name: "Amit Singh", company: "HDFC Bank", email: "amit@hdfc.com", phone: "+91 99887 76655", site: "Sector 17", siteId: "S-1044", status: "Contacted", date: "Yesterday", message: "Following up on our call - can you send the updated quote for Sector 17 with the back-lit upgrade included?" },
  { id: 4, name: "Neha Gupta", company: "FabIndia", email: "neha@fabindia.com", phone: "+91 97654 32109", site: "Sector 18", siteId: "S-1046", status: "Converted", date: "3 days ago", message: "Confirming our booking for Sector 18 starting next month. Please send the contract for signature." },
  { id: 5, name: "Vikram Malhotra", company: "Zomato", email: "vikram@zomato.com", phone: "+91 96543 21098", site: "MI Road", siteId: "S-1045", status: "Lost", date: "Last week", message: "We've decided to go with another vendor for this quarter's campaign. Thanks for the detailed proposal." },
];

const statusStyle = (status: string) => {
  switch (status) {
    case "New": return "bg-primary text-primary-foreground";
    case "Contacted": return "bg-secondary text-secondary-foreground";
    case "Converted": return "bg-available text-primary-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

export default function EnquiriesPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = ENQUIRIES.find((e) => e.id === selectedId) ?? null;

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
            {ENQUIRIES.map((eq) => (
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
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
              Select an enquiry to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
