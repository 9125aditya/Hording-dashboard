"use client";

import { useState, Suspense, useDeferredValue } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, MapPinIcon, ArrowsPointingOutIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import AnimateOnScroll from "@/frontend/components/AnimateOnScroll";
import { useSearchParams } from "next/navigation";

function CatalogFilters({ sites }: { sites: any[] }) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const deferredSearch = useDeferredValue(search);
  const [activeArea, setActiveArea] = useState("All");
  const [activeType, setActiveType] = useState("All");
  const [activeLit, setActiveLit] = useState("All");

  const areas = ["All", ...Array.from(new Set(sites.map(s => s.city))).filter(Boolean)];
  const types = ["All", ...Array.from(new Set(sites.map(s => s.type))).filter(Boolean)];
  const litTypes = ["All", ...Array.from(new Set(sites.map(s => s.lit_type))).filter(Boolean)];

  const filteredSites = sites.filter(site => {
    if (activeArea !== "All" && site.city !== activeArea) return false;
    if (activeType !== "All" && site.type !== activeType) return false;
    if (activeLit !== "All" && site.lit_type !== activeLit) return false;
    if (deferredSearch && !site.name.toLowerCase().includes(deferredSearch.toLowerCase()) && !site.city?.toLowerCase().includes(deferredSearch.toLowerCase())) return false;
    return true;
  });

  return (
    <>
        {/* Filters and Search */}
        <AnimateOnScroll animation="fade-up" delay={100}>
          <div className="flex flex-col gap-4 mb-8 pb-6 border-b border-border">
            {/* Top Row: Type Pills & Search */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="flex w-full md:w-auto items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                {types.map(t => (
                  <button 
                    key={t}
                    onClick={() => setActiveType(t as string)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95 ${activeType === t ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-muted-foreground hover:bg-secondary hover:text-secondary-foreground'}`}
                  >
                    {t === "All" ? "All Types" : t as string}
                  </button>
                ))}
              </div>
              
              <div className="flex w-full md:w-auto gap-3 items-center flex-wrap sm:flex-nowrap">
                {/* City / Area Dropdown */}
                <select 
                  value={activeArea} 
                  onChange={(e) => setActiveArea(e.target.value)}
                  className="h-10 px-4 rounded-full border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent flex-1 sm:flex-none"
                >
                  {areas.map(a => (
                    <option key={a as string} value={a as string}>{a === "All" ? "All Cities" : a as string}</option>
                  ))}
                </select>

                {/* Lit Type Dropdown */}
                <select 
                  value={activeLit} 
                  onChange={(e) => setActiveLit(e.target.value)}
                  className="h-10 px-4 rounded-full border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent flex-1 sm:flex-none"
                >
                  {litTypes.map(l => (
                    <option key={l as string} value={l as string}>{l === "All" ? "All Lighting" : l as string}</option>
                  ))}
                </select>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search name or city..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-10 pl-9 pr-4 rounded-full border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Filter Summary */}
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>Showing {filteredSites.length} of {sites.length} sites</span>
              {(activeArea !== "All" || activeType !== "All" || activeLit !== "All" || search) && (
                <button
                  onClick={() => {
                    setActiveArea("All");
                    setActiveType("All");
                    setActiveLit("All");
                    setSearch("");
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </AnimateOnScroll>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSites.map((site, i) => (
            <AnimateOnScroll key={site.id} animation="fade-up" delay={(i % 10) * 100}>
              <Link href={`/catalog/${site.id}`} className="group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-sm hover-lift">
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  <Image src={site.img} alt={site.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-60" />
                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-slate-800 shadow-sm border border-white/50">
                      {site.lit_type || 'Front Lit'}
                    </span>
                  </div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-heading font-semibold text-xl text-foreground line-clamp-1">{site.name}</h3>
                  </div>
                  <div className="text-sm text-primary font-medium mb-4">{site.city}</div>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-6">
                    <span className="flex items-center"><ArrowsPointingOutIcon className="mr-1.5 h-4 w-4" /> {site.size}</span>
                    <span className="flex items-center"><MapPinIcon className="mr-1.5 h-4 w-4" /> {site.type}</span>
                  </div>
                  <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
                      <span className="text-sm font-semibold text-primary group-hover:underline flex items-center">
                        View details <ArrowRightIcon className="ml-1 h-3 w-3 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                      </span>
                  </div>
                </div>
              </Link>
            </AnimateOnScroll>
          ))}
          
          {filteredSites.length === 0 && (
            <div className="col-span-full py-16 px-4 text-center flex flex-col items-center justify-center bg-card rounded-3xl border border-border">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-4 shadow-sm">
                <MapPinIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Not Available in Your Area
              </h3>
              <p className="text-sm text-muted-foreground max-w-md leading-relaxed mb-6">
                {search
                  ? `We currently don't have active billboard inventory in "${search}". You can request coverage or explore our active sites in other cities.`
                  : "No billboards match your selected filter criteria. Try adjusting the city or media type filters."}
              </p>
              <div className="flex flex-wrap gap-3 items-center justify-center">
                <Link
                  href={`/contact?city=${encodeURIComponent(search)}`}
                  className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
                >
                  Request Space in this City
                </Link>
                {(activeArea !== "All" || activeType !== "All" || activeLit !== "All" || search) && (
                  <button
                    onClick={() => {
                      setActiveArea("All");
                      setActiveType("All");
                      setActiveLit("All");
                      setSearch("");
                    }}
                    className="px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-secondary/80 transition-all"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
    </>
  );
}

export default function CatalogClient({ sites }: { sites: any[] }) {
  return (
    <Suspense fallback={<div className="flex justify-center p-12"><ArrowPathIcon className="h-8 w-8 animate-spin text-primary" /></div>}>
      <CatalogFilters sites={sites} />
    </Suspense>
  );
}
