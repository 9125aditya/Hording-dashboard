"use client";

import dynamic from "next/dynamic";
import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon, MapPinIcon, XMarkIcon, ArrowsPointingOutIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import AnimateOnScroll from "./AnimateOnScroll";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <ArrowPathIcon className="h-8 w-8 text-primary animate-spin" />
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

interface MapPageClientProps {
  initialSites: SiteData[];
}

export default function MapPageClient({ initialSites }: MapPageClientProps) {
  const [selectedSite, setSelectedSite] = useState<SiteData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const siteIdParam = searchParams.get("siteId");
    if (siteIdParam) {
      const id = siteIdParam;
      const found = initialSites.find((s) => String(s.id) === id);
      // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
      if (found) setSelectedSite(found);
    }
  }, [searchParams, initialSites]);

  const filteredSites = initialSites.filter((site) => 
    site.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    site.city.toLowerCase().includes(searchQuery.toLowerCase())
  );
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
      <div className="w-full md:w-[380px] lg:w-[420px] h-[55%] md:h-full bg-white border-t md:border-t-0 md:border-r border-slate-200 flex flex-col flex-shrink-0 order-2 md:order-1">

        {/* Panel Header */}
        <AnimateOnScroll animation="fade-down" duration={500}>
          <div className="p-5 border-b border-slate-100 relative overflow-hidden">
            <h2 className="text-slate-900 font-bold text-lg tracking-tight mb-3 relative z-10">Find Sites</h2>

            {/* Search Input */}
            <div className="relative z-10 group">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, landmark, pincode…"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all hover:border-slate-300"
              />
            </div>

            {/* Filter chips */}
            <div className="flex gap-2 mt-3 flex-wrap relative z-10">
              {["All", "Available", "Booked", "Digital"].map((filter) => (
                <button
                  key={filter}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 active:scale-95 ${
                    filter === "All"
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </AnimateOnScroll>

        {/* Site List / Selected Site */}
        <div className="flex-1 overflow-y-auto">
          {selectedSite ? (
            /* Selected Site Detail */
            <AnimateOnScroll animation="fade-left" duration={400}>
              <div className="p-5">
                <button
                  onClick={() => setSelectedSite(null)}
                  className="flex items-center text-xs text-slate-500 hover:text-primary mb-4 transition-colors font-medium"
                >
                  ← Back to list
                </button>

                {/* Site Image */}
                <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 relative mb-4 group cursor-pointer hover-lift">
                  <div className={`absolute top-3 left-3 z-10 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border shadow-sm ${statusBadge(selectedSite.status)}`}>
                    {selectedSite.status}
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1533069027836-fa937181a8ce?w=600&q=80"
                    alt={selectedSite.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer pointer-events-none" />
                </div>

                {/* Site Info */}
                <h3 className="text-slate-900 font-bold text-xl mb-1">{selectedSite.name}</h3>
                <p className="text-slate-500 text-sm flex items-center mb-5">
                  <MapPinIcon className="mr-1 h-3.5 w-3.5 text-primary/70" /> {selectedSite.city}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-slate-50 hover:bg-white hover:shadow-sm transition-all rounded-xl p-3.5 border border-slate-100 cursor-default">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Size</p>
                    <p className="text-slate-900 text-sm font-semibold flex items-center">
                      <ArrowsPointingOutIcon className="mr-1.5 h-3.5 w-3.5 text-primary" />
                      {selectedSite.size}
                    </p>
                  </div>
                  <div className="bg-slate-50 hover:bg-white hover:shadow-sm transition-all rounded-xl p-3.5 border border-slate-100 cursor-default">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Type</p>
                    <p className="text-slate-900 text-sm font-semibold">{selectedSite.type}</p>
                  </div>
                  <div className="bg-slate-50 hover:bg-white hover:shadow-sm transition-all rounded-xl p-3.5 border border-slate-100 cursor-default">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Status</p>
                    <p className={`text-sm font-semibold ${
                      selectedSite.status === "Available" ? "text-emerald-600" :
                      selectedSite.status === "Booked" ? "text-red-600" : "text-amber-600"
                    }`}>{selectedSite.status}</p>
                  </div>
                  <div className="bg-slate-50 hover:bg-white hover:shadow-sm transition-all rounded-xl p-3.5 border border-slate-100 cursor-default">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Coordinates</p>
                    <p className="text-slate-700 text-xs font-mono">{selectedSite.lat.toFixed(2)}, {selectedSite.lng.toFixed(2)}</p>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href={`/catalog/${selectedSite.id}`}
                  className="flex w-full h-12 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] group overflow-hidden relative"
                >
                  <span className="relative z-10 flex items-center">
                    View Full Details
                    <ChevronRightIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] skew-x-12" />
                </Link>
              </div>
            </AnimateOnScroll>
          ) : (
            /* Site List */
            <div className="p-3 stagger-children">
              <AnimateOnScroll animation="fade-right" duration={300}>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold px-2 py-2">
                  {filteredSites.length} sites found
                </p>
              </AnimateOnScroll>
              {filteredSites.map((site, i) => (
                <AnimateOnScroll key={site.id} animation="fade-up" delay={i * 50} duration={300}>
                  <button
                    onClick={() => setSelectedSite(site)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 hover:shadow-sm hover:border hover:border-slate-100 border border-transparent transition-all text-left group hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusDot(site.status)} group-hover:scale-125 transition-transform`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-900 text-sm font-medium truncate group-hover:text-primary transition-colors">
                        {site.name}
                      </p>
                      <p className="text-slate-400 text-xs">{site.city} · {site.type} · {site.size}</p>
                    </div>
                    <ChevronRightIcon className="h-4 w-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </button>
                </AnimateOnScroll>
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
      <div className="w-full relative order-1 md:order-2 h-[45%] md:h-full flex-shrink-0 md:flex-1">
        <LeafletMap sites={filteredSites} onMarkerClick={handleMarkerClick} />
      </div>

    </div>
  );
}
