"use client";

import { useState, Suspense, useDeferredValue } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRightIcon, 
  MapPinIcon, 
  ArrowsPointingOutIcon, 
  MagnifyingGlassIcon,
  CheckIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
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
  
  // Multi-select state for selecting multiple sites
  const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>([]);

  const toggleSelectSite = (e: React.MouseEvent, siteId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSiteIds(prev => 
      prev.includes(siteId) ? prev.filter(id => id !== siteId) : [...prev, siteId]
    );
  };

  const clearSelection = () => {
    setSelectedSiteIds([]);
  };

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

  const selectedSitesData = sites.filter(s => selectedSiteIds.includes(s.id));

  return (
    <>
        {/* Filters and Search */}
        <AnimateOnScroll animation="fade-up" delay={100}>
          <div className="flex flex-col gap-4 mb-8 pb-6 border-b border-border">
            {/* Top Row: Type Pills & Search */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="flex w-full md:w-auto items-center gap-2.5 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                {types.map(t => (
                  <button 
                    key={t}
                    onClick={() => setActiveType(t as string)}
                    className={`whitespace-nowrap px-5 py-2.5 rounded-full text-[14px] font-bold transition-all active:scale-95 cursor-pointer ${activeType === t ? 'bg-[#dd3333] text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'}`}
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
                  className="h-12 px-4 rounded-full border border-slate-200 bg-white text-slate-800 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 flex-1 sm:flex-none shadow-xs cursor-pointer"
                >
                  {areas.map(a => (
                    <option key={a as string} value={a as string} className="text-sm py-1.5">{a === "All" ? "All Cities" : a as string}</option>
                  ))}
                </select>

                {/* Lit Type Dropdown */}
                <select 
                  value={activeLit} 
                  onChange={(e) => setActiveLit(e.target.value)}
                  className="h-12 px-4 rounded-full border border-slate-200 bg-white text-slate-800 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 flex-1 sm:flex-none shadow-xs cursor-pointer"
                >
                  {litTypes.map(l => (
                    <option key={l as string} value={l as string} className="text-sm py-1.5">{l === "All" ? "All Lighting" : l as string}</option>
                  ))}
                </select>

                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                  <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search name or city..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-shadow shadow-xs"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Filter Summary & Multi-select instructions */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground px-1">
              <div className="flex items-center gap-3">
                <span>Showing {filteredSites.length} of {sites.length} sites</span>
                <span className="hidden sm:inline-block text-slate-300">•</span>
                <span className="text-slate-500">
                  Tip: Check the box on any card to select multiple sites for inquiry
                </span>
              </div>
              <div className="flex items-center gap-3">
                {selectedSiteIds.length > 0 && (
                  <button
                    onClick={clearSelection}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
                  >
                    Deselect all ({selectedSiteIds.length})
                  </button>
                )}
                {(activeArea !== "All" || activeType !== "All" || activeLit !== "All" || search) && (
                  <button
                    onClick={() => {
                      setActiveArea("All");
                      setActiveType("All");
                      setActiveLit("All");
                      setSearch("");
                    }}
                    className="text-primary hover:underline font-medium cursor-pointer"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative pb-16">
          {filteredSites.map((site, i) => {
            const isSelected = selectedSiteIds.includes(site.id);
            return (
              <AnimateOnScroll key={site.id} animation="fade-up" delay={(i % 10) * 100}>
                <div 
                  className={`group relative flex flex-col overflow-hidden rounded-2xl bg-card border transition-all duration-300 ${
                    isSelected 
                      ? 'border-[#dd3333] ring-2 ring-[#dd3333]/20 shadow-md' 
                      : 'border-border shadow-sm hover:border-slate-300 hover-lift'
                  }`}
                >
                  <Link href={`/catalog/${site.id}`} className="aspect-[4/3] bg-muted relative overflow-hidden block">
                    <Image src={site.img} alt={site.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-60" />
                    
                    {/* Top Left Lit Type Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-slate-800 shadow-sm border border-white/50">
                        {site.lit_type || 'Front Lit'}
                      </span>
                    </div>

                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />
                  </Link>

                  {/* Top Right Multi-Select Checkbox Pill */}
                  <button
                    type="button"
                    onClick={(e) => toggleSelectSite(e, site.id)}
                    className={`absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer ${
                      isSelected
                        ? 'bg-[#dd3333] text-white ring-2 ring-white'
                        : 'bg-white/95 backdrop-blur-md text-slate-700 hover:bg-white hover:text-slate-900 border border-slate-200/80 hover:scale-105'
                    }`}
                    title={isSelected ? "Remove from enquiry list" : "Select site for enquiry"}
                  >
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                      isSelected ? 'bg-white border-white text-[#dd3333]' : 'border-slate-400 bg-white/80'
                    }`}>
                      {isSelected && <CheckIcon className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span>{isSelected ? "Selected" : "Select"}</span>
                  </button>

                  <div className="p-6 flex flex-col flex-1">
                    <Link href={`/catalog/${site.id}`} className="flex justify-between items-start mb-2 group/title">
                      <h3 className="font-heading font-semibold text-xl text-foreground line-clamp-1 group-hover/title:text-primary transition-colors">
                        {site.name}
                      </h3>
                    </Link>
                    <div className="text-sm text-primary font-medium mb-4">{site.city}</div>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-6">
                      <span className="flex items-center"><ArrowsPointingOutIcon className="mr-1.5 h-4 w-4" /> {site.size}</span>
                      <span className="flex items-center"><MapPinIcon className="mr-1.5 h-4 w-4" /> {site.type}</span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
                      <Link 
                        href={`/catalog/${site.id}`} 
                        className="text-sm font-semibold text-primary hover:underline flex items-center"
                      >
                        View details <ArrowRightIcon className="ml-1 h-3 w-3 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                      </Link>

                      <button
                        type="button"
                        onClick={(e) => toggleSelectSite(e, site.id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-red-50 text-[#dd3333] hover:bg-red-100'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? "✓ Added" : "+ Add to Enquiry"}
                      </button>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            );
          })}
          
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

        {/* FLOATING STICKY ACTION BAR WHEN MULTIPLE SITES ARE SELECTED */}
        {selectedSiteIds.length > 0 && (
          <div className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 max-w-2xl w-full animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="bg-slate-900/95 backdrop-blur-md text-white px-5 sm:px-6 py-4 rounded-2xl shadow-2xl border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-xl bg-[#dd3333] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                  {selectedSiteIds.length}
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-white tracking-tight">
                    {selectedSiteIds.length} {selectedSiteIds.length === 1 ? "Site" : "Sites"} Selected
                  </h4>
                  <p className="text-xs text-slate-300 font-medium line-clamp-1">
                    {selectedSitesData.map(s => s.name).join(", ")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={clearSelection}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>

                <Link
                  href={`/contact?sites=${encodeURIComponent(selectedSiteIds.join(","))}`}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#dd3333] hover:bg-[#c22b2b] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Proceed to Enquiry ({selectedSiteIds.length})</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
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
