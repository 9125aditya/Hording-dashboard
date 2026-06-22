"use client";

import dynamic from "next/dynamic";
import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, MapPin, X, Maximize2, ChevronRight, Loader2 } from "lucide-react";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="text-sm text-slate-400">Loading map…</span>
      </div>
    </div>
  ),
});

interface SiteData {
  id: number;
  name: string;
  city: string;
  lat: number;
  lng: number;
  status: string;
  size: string;
  type: string;
}

const SITES: SiteData[] = [
  { id: 1, name: "Connaught Place", city: "Delhi", lat: 28.6315, lng: 77.2167, status: "Available", size: "40 × 20 ft", type: "Front-lit" },
  { id: 2, name: "Cyber Hub", city: "Gurgaon", lat: 28.4950, lng: 77.0895, status: "Booked", size: "60 × 30 ft", type: "Digital" },
  { id: 3, name: "Sector 17", city: "Chandigarh", lat: 30.7398, lng: 76.7827, status: "Available", size: "100 × 40 ft", type: "Back-lit" },
  { id: 4, name: "MI Road", city: "Jaipur", lat: 26.9155, lng: 75.8010, status: "Blocked", size: "50 × 25 ft", type: "Unipole" },
  { id: 5, name: "Sector 18", city: "Noida", lat: 28.5708, lng: 77.3225, status: "Available", size: "30 × 15 ft", type: "Gantry" },
  { id: 6, name: "Nehru Place", city: "Delhi", lat: 28.5494, lng: 77.2530, status: "Available", size: "45 × 20 ft", type: "Front-lit" },
  { id: 7, name: "MG Road", city: "Gurugram", lat: 28.4799, lng: 77.0268, status: "Available", size: "80 × 40 ft", type: "Digital" },
];

export default function MapPageClient() {
  const [selectedSite, setSelectedSite] = useState<SiteData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const siteIdParam = searchParams.get("siteId");
    if (siteIdParam) {
      const id = parseInt(siteIdParam, 10);
      const site = SITES.find((s) => s.id === id);
      if (site) {
        setSelectedSite(site);
      }
    }
  }, [searchParams]);

  const handleMarkerClick = useCallback((site: SiteData) => {
    setSelectedSite(site);
  }, []);

  const statusDot = (status: string) => {
    switch (status) {
      case "Available": return "bg-emerald-500";
      case "Booked": return "bg-red-500";
      case "Blocked": return "bg-amber-500";
      default: return "bg-slate-400";
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "Available": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Booked": return "bg-red-50 text-red-700 border-red-200";
      case "Blocked": return "bg-amber-50 text-amber-700 border-amber-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="flex flex-col md:flex-row" style={{ height: "calc(100vh - 64px)" }}>

      {/* Left Panel — Search & List */}
      <div className="w-full md:w-[380px] lg:w-[420px] h-[45vh] md:h-full bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col flex-shrink-0 order-1 md:order-1">

        {/* Panel Header */}
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-slate-900 font-bold text-lg tracking-tight mb-3">Find Sites</h2>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city, landmark, pincode…"
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {["All", "Available", "Booked", "Digital"].map((filter) => (
              <button
                key={filter}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filter === "All"
                    ? "bg-primary text-white"
                    : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Site List / Selected Site */}
        <div className="flex-1 overflow-y-auto">
          {selectedSite ? (
            /* Selected Site Detail */
            <div className="p-5">
              <button
                onClick={() => setSelectedSite(null)}
                className="flex items-center text-xs text-slate-500 hover:text-slate-900 mb-4 transition-colors"
              >
                ← Back to list
              </button>

              {/* Site Image */}
              <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 relative mb-4">
                <div className={`absolute top-3 left-3 z-10 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${statusBadge(selectedSite.status)}`}>
                  {selectedSite.status}
                </div>
                <img
                  src="https://images.unsplash.com/photo-1533069027836-fa937181a8ce?w=600&q=80"
                  alt={selectedSite.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Site Info */}
              <h3 className="text-slate-900 font-bold text-xl mb-1">{selectedSite.name}</h3>
              <p className="text-slate-500 text-sm flex items-center mb-5">
                <MapPin className="mr-1 h-3.5 w-3.5" /> {selectedSite.city}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Size</p>
                  <p className="text-slate-900 text-sm font-semibold flex items-center">
                    <Maximize2 className="mr-1.5 h-3.5 w-3.5 text-primary" />
                    {selectedSite.size}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Type</p>
                  <p className="text-slate-900 text-sm font-semibold">{selectedSite.type}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Status</p>
                  <p className={`text-sm font-semibold ${
                    selectedSite.status === "Available" ? "text-emerald-600" :
                    selectedSite.status === "Booked" ? "text-red-600" : "text-amber-600"
                  }`}>{selectedSite.status}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Coordinates</p>
                  <p className="text-slate-700 text-xs font-mono">{selectedSite.lat.toFixed(2)}, {selectedSite.lng.toFixed(2)}</p>
                </div>
              </div>

              {/* CTA */}
              <Link
                href={`/catalog/${selectedSite.id}`}
                className="flex w-full h-12 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.98]"
              >
                View Full Details
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          ) : (
            /* Site List */
            <div className="p-3">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold px-2 py-2">
                {SITES.length} sites found
              </p>
              {SITES.map((site) => (
                <button
                  key={site.id}
                  onClick={() => setSelectedSite(site)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all text-left group"
                >
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusDot(site.status)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 text-sm font-medium truncate group-hover:text-primary transition-colors">
                      {site.name}
                    </p>
                    <p className="text-slate-400 text-xs">{site.city} · {site.type} · {site.size}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Legend Footer */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Available</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Booked</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Blocked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Map Area */}
      <div className="flex-1 relative order-2 md:order-2 h-[55vh] md:h-full">
        <LeafletMap onMarkerClick={handleMarkerClick} />
      </div>

    </div>
  );
}
