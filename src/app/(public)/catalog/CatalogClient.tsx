"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Maximize2, Search } from "lucide-react";
import AnimateOnScroll from "@/frontend/components/AnimateOnScroll";

export default function CatalogClient({ sites }: { sites: any[] }) {
  const [search, setSearch] = useState("");
  const [activeArea, setActiveArea] = useState("All");
  const [activeType, setActiveType] = useState("All");

  const areas = ["All", ...Array.from(new Set(sites.map(s => s.city))).filter(Boolean)];
  const types = ["All", ...Array.from(new Set(sites.map(s => s.type))).filter(Boolean)];

  const filteredSites = sites.filter(site => {
    if (activeArea !== "All" && site.city !== activeArea) return false;
    if (activeType !== "All" && site.type !== activeType) return false;
    if (search && !site.name.toLowerCase().includes(search.toLowerCase()) && !site.city?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
        {/* Filters and Search */}
        <AnimateOnScroll animation="fade-up" delay={100}>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 pb-6 border-b border-border">
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
            
            <div className="flex w-full md:w-auto gap-3 items-center">
              <select 
                value={activeArea} 
                onChange={(e) => setActiveArea(e.target.value)}
                className="h-10 px-4 rounded-full border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                {areas.map(a => (
                  <option key={a as string} value={a as string}>{a === "All" ? "All Areas" : a as string}</option>
                ))}
              </select>

              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 rounded-full border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                />
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSites.map((site, i) => (
            <AnimateOnScroll key={site.id} animation="fade-up" delay={(i % 10) * 100}>
              <Link href={`/catalog/${site.id}`} className="group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-sm hover-lift">
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  <img src={site.img} alt={site.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-60" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-heading font-semibold text-xl text-foreground line-clamp-1">{site.name}</h3>
                  </div>
                  <div className="text-sm text-primary font-medium mb-4">{site.city}</div>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-6">
                    <span className="flex items-center"><Maximize2 className="mr-1.5 h-4 w-4" /> {site.size}</span>
                    <span className="flex items-center"><MapPin className="mr-1.5 h-4 w-4" /> {site.type}</span>
                  </div>
                  <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
                      <span className="text-sm font-semibold text-primary group-hover:underline flex items-center">
                        View details <ArrowRight className="ml-1 h-3 w-3 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                      </span>
                  </div>
                </div>
              </Link>
            </AnimateOnScroll>
          ))}
          
          {filteredSites.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No sites found matching your criteria.
            </div>
          )}
        </div>
    </>
  );
}
