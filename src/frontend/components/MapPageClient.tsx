"use client";

import dynamic from "next/dynamic";
import { useState, useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  XMarkIcon, 
  ArrowsPointingOutIcon, 
  ChevronRightIcon
} from "@heroicons/react/24/outline";
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

export interface SiteData {
  id: any;
  name: string;
  city: string;
  area?: string;
  lat: number;
  lng: number;
  status: string;
  size: string;
  type: string;
  lit_type?: string;
  photos?: string[];
  distanceKm?: number;
  isProbableMatch?: boolean;
  isNearbyAlternative?: boolean;
}

interface MapPageClientProps {
  initialSites: SiteData[];
}

// ==========================================
// 1. HAVERSINE DISTANCE HELPER (IN KM)
// ==========================================
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 999;
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 10) / 10; // Round to 1 decimal place
}

// ==========================================
// 2. FUZZY STRING SIMILARITY & TYPO TOLERANCE
// ==========================================
function getFuzzyScore(query: string, target: string): number {
  if (!query || !target) return 0;
  const q = query.toLowerCase().trim();
  const t = target.toLowerCase().trim();

  // Exact match or contains
  if (t === q) return 1.0;
  if (t.includes(q)) return 0.9;
  if (q.includes(t)) return 0.85;

  // Word token overlap
  const qWords = q.split(/\s+/).filter(Boolean);
  const tWords = t.split(/\s+/).filter(Boolean);
  let wordMatches = 0;

  for (const qw of qWords) {
    for (const tw of tWords) {
      if (tw.includes(qw) || qw.includes(tw)) {
        wordMatches += 1;
        break;
      }
      // Check Levenshtein distance for single words
      const dist = levenshteinDistance(qw, tw);
      const maxL = Math.max(qw.length, tw.length);
      if (maxL > 3 && dist <= 2) {
        wordMatches += (1 - dist / maxL);
        break;
      }
    }
  }

  const tokenScore = qWords.length > 0 ? (wordMatches / qWords.length) * 0.8 : 0;
  const overallLevScore = 1 - (levenshteinDistance(q, t) / Math.max(q.length, t.length));

  return Math.max(tokenScore, overallLevScore > 0 ? overallLevScore * 0.75 : 0);
}

function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

export default function MapPageClient({ initialSites }: MapPageClientProps) {
  const [selectedSite, setSelectedSite] = useState<SiteData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState<"All" | "Available" | "Booked" | "Blocked" | "Digital">("All");
  const searchParams = useSearchParams();

  useEffect(() => {
    const siteIdParam = searchParams.get("siteId");
    if (siteIdParam) {
      const id = siteIdParam;
      const found = initialSites.find((s) => String(s.id) === id);
      if (found) setSelectedSite(found);
    }
  }, [searchParams, initialSites]);

  // =========================================================================
  // SMART SEARCH ENGINE: EXACT MATCH + FUZZY TYPO TOLERANCE + 2KM PROXIMITY
  // =========================================================================
  const { results: filteredSites, searchMode, matchedAnchorName } = useMemo(() => {
    let baseSites = initialSites.map(s => ({ ...s }));

    // Status filter
    if (activeStatus !== "All") {
      if (activeStatus === "Digital") {
        baseSites = baseSites.filter(s => s.type?.toLowerCase().includes("digital") || s.lit_type?.toLowerCase().includes("digital"));
      } else {
        baseSites = baseSites.filter(s => s.status === activeStatus);
      }
    }

    if (!searchQuery.trim()) {
      return { results: baseSites, searchMode: "normal", matchedAnchorName: "" };
    }

    const query = searchQuery.trim().toLowerCase();

    // 1. Direct / Substring matches
    const exactMatches: SiteData[] = [];
    initialSites.forEach(site => {
      const matchName = site.name?.toLowerCase().includes(query);
      const matchCity = site.city?.toLowerCase().includes(query);
      const matchArea = site.area?.toLowerCase().includes(query);
      if (matchName || matchCity || matchArea) {
        exactMatches.push({ ...site });
      }
    });

    // If exact matches exist
    if (exactMatches.length > 0) {
      const availableExact = exactMatches.filter(s => s.status === "Available");
      
      // If there are exact matches but NONE are available:
      // Find nearby available hoardings around the first exact match within ~2 km!
      if (availableExact.length === 0 && exactMatches[0]?.lat && exactMatches[0]?.lng) {
        const anchor = exactMatches[0];
        const nearbySites: SiteData[] = [];

        initialSites.forEach(s => {
          if (String(s.id) === String(anchor.id)) return;
          const dist = calculateDistanceKm(anchor.lat, anchor.lng, s.lat, s.lng);
          if (dist <= 2.5) { // within ~2.5 km
            nearbySites.push({
              ...s,
              distanceKm: dist,
              isNearbyAlternative: true,
            });
          }
        });

        // Sort: Available first, then by nearest distance
        nearbySites.sort((a, b) => {
          if (a.status === "Available" && b.status !== "Available") return -1;
          if (b.status === "Available" && a.status !== "Available") return 1;
          return (a.distanceKm || 0) - (b.distanceKm || 0);
        });

        // Combined results: Exact matched (booked/blocked) + nearby ~2km available alternatives
        const combined = [
          ...exactMatches.map(s => ({ ...s, distanceKm: 0 })),
          ...nearbySites
        ];

        // Apply status filter if user selected a specific filter
        let finalResults = combined;
        if (activeStatus !== "All") {
          if (activeStatus === "Digital") {
            finalResults = combined.filter(s => s.type?.toLowerCase().includes("digital"));
          } else {
            finalResults = combined.filter(s => s.status === activeStatus);
          }
        }

        return {
          results: finalResults,
          searchMode: "exact_with_nearby",
          matchedAnchorName: anchor.name,
        };
      }

      // Exact matches with available sites
      let finalExact = exactMatches;
      if (activeStatus !== "All") {
        if (activeStatus === "Digital") {
          finalExact = exactMatches.filter(s => s.type?.toLowerCase().includes("digital"));
        } else {
          finalExact = exactMatches.filter(s => s.status === activeStatus);
        }
      }

      return {
        results: finalExact,
        searchMode: "exact",
        matchedAnchorName: exactMatches[0]?.name || "",
      };
    }

    // 2. Fuzzy / Misspelled Search (Typo Tolerance)
    // Find the highest scoring site
    const scoredSites: { site: SiteData; score: number }[] = [];
    initialSites.forEach(site => {
      const nameScore = getFuzzyScore(query, site.name || "");
      const areaScore = getFuzzyScore(query, site.area || "");
      const cityScore = getFuzzyScore(query, site.city || "");
      const bestScore = Math.max(nameScore, areaScore, cityScore);

      if (bestScore >= 0.38) { // threshold for probable typo match
        scoredSites.push({ site, score: bestScore });
      }
    });

    scoredSites.sort((a, b) => b.score - a.score);

    if (scoredSites.length > 0) {
      const bestProbable = scoredSites[0].site;
      const probableMatches: SiteData[] = [];
      const nearbySites: SiteData[] = [];

      // Top scored sites (up to 3 probable matches)
      scoredSites.slice(0, 3).forEach(({ site }) => {
        probableMatches.push({
          ...site,
          isProbableMatch: true,
          distanceKm: 0,
        });
      });

      // Find all hoardings within ~2 km of the best probable match
      if (bestProbable.lat && bestProbable.lng) {
        initialSites.forEach(s => {
          if (probableMatches.some(pm => String(pm.id) === String(s.id))) return;
          const dist = calculateDistanceKm(bestProbable.lat, bestProbable.lng, s.lat, s.lng);
          if (dist <= 2.5) {
            nearbySites.push({
              ...s,
              distanceKm: dist,
              isNearbyAlternative: true,
            });
          }
        });

        nearbySites.sort((a, b) => {
          if (a.status === "Available" && b.status !== "Available") return -1;
          if (b.status === "Available" && a.status !== "Available") return 1;
          return (a.distanceKm || 0) - (b.distanceKm || 0);
        });
      }

      const combined = [...probableMatches, ...nearbySites];
      let finalResults = combined;
      if (activeStatus !== "All") {
        if (activeStatus === "Digital") {
          finalResults = combined.filter(s => s.type?.toLowerCase().includes("digital"));
        } else {
          finalResults = combined.filter(s => s.status === activeStatus);
        }
      }

      return {
        results: finalResults,
        searchMode: "fuzzy_probable",
        matchedAnchorName: bestProbable.name,
      };
    }

    // 3. No match found
    return { results: [], searchMode: "none", matchedAnchorName: "" };
  }, [initialSites, searchQuery, activeStatus]);

  const handleMarkerClick = useCallback((site: SiteData) => {
    setSelectedSite(site);
  }, []);

  const statusDot = (status: string) => {
    switch (status) {
      case "Available": return "bg-emerald-500";
      case "Booked": return "bg-rose-500";
      case "Blocked": return "bg-amber-500";
      default: return "bg-slate-400";
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "Available": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Booked": return "bg-rose-50 text-rose-700 border-rose-200";
      case "Blocked": return "bg-amber-50 text-amber-700 border-amber-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="flex flex-col md:flex-row" style={{ height: "calc(100vh - 64px)" }}>

      {/* Left Panel — Search & List */}
      <div className="w-full md:w-[380px] lg:w-[430px] h-[55%] md:h-full bg-white border-t md:border-t-0 md:border-r border-slate-200 flex flex-col flex-shrink-0 order-2 md:order-1 shadow-sm">

        {/* Panel Header */}
        <AnimateOnScroll animation="fade-down" duration={500}>
          <div className="p-4 sm:p-5 border-b border-slate-100 relative overflow-hidden bg-white">
            <h2 className="text-slate-900 font-bold text-lg tracking-tight mb-3 relative z-10">Find Sites</h2>

            {/* Search Input */}
            <div className="relative z-10 group">
              <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedSite(null);
                }}
                placeholder="Search city, area, landmark…"
                className="w-full h-11 pl-10 pr-9 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all hover:border-slate-300 shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSite(null);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                  aria-label="Clear search"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter chips */}
            <div className="flex gap-2 mt-3 flex-wrap relative z-10">
              {(["All", "Available", "Blocked", "Booked", "Digital"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setActiveStatus(filter);
                    setSelectedSite(null);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeStatus === filter
                      ? "bg-indigo-600 text-white shadow-xs shadow-indigo-500/25 scale-105"
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
        <div className="flex-1 overflow-y-auto flex flex-col">
          {selectedSite ? (
            /* Selected Site Detail */
            <AnimateOnScroll animation="fade-left" duration={400}>
              <div className="p-5">
                <button
                  onClick={() => setSelectedSite(null)}
                  className="flex items-center text-xs text-slate-500 hover:text-primary mb-4 transition-colors font-semibold cursor-pointer"
                >
                  ← Back to list
                </button>

                {/* Site Image */}
                <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 relative mb-4 group cursor-pointer shadow-xs">
                  <div className={`absolute top-3 left-3 z-10 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border shadow-sm ${statusBadge(selectedSite.status)}`}>
                    {selectedSite.status}
                  </div>
                  <img
                    src={selectedSite.photos?.[0] ?? "https://images.unsplash.com/photo-1533069027836-fa937181a8ce?w=600&q=80"}
                    alt={selectedSite.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Site Info */}
                <h3 className="text-slate-900 font-bold text-xl mb-1">{selectedSite.name}</h3>
                <p className="text-slate-500 text-sm flex items-center mb-5 font-medium">
                  <MapPinIcon className="mr-1 h-4 w-4 text-indigo-500" /> {selectedSite.city}{selectedSite.area ? `, ${selectedSite.area}` : ""}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-slate-50 hover:bg-white hover:shadow-xs transition-all rounded-xl p-3.5 border border-slate-100">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">Dimensions</p>
                    <p className="text-slate-900 text-sm font-bold flex items-center">
                      <ArrowsPointingOutIcon className="mr-1.5 h-3.5 w-3.5 text-primary" />
                      {selectedSite.size}
                    </p>
                  </div>
                  <div className="bg-slate-50 hover:bg-white hover:shadow-xs transition-all rounded-xl p-3.5 border border-slate-100">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">Media Type</p>
                    <p className="text-slate-900 text-sm font-bold">{selectedSite.type}</p>
                  </div>
                  <div className="bg-slate-50 hover:bg-white hover:shadow-xs transition-all rounded-xl p-3.5 border border-slate-100">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">Status</p>
                    <p className={`text-sm font-bold ${
                      selectedSite.status === "Available" ? "text-emerald-600" :
                      selectedSite.status === "Booked" ? "text-rose-600" : "text-amber-600"
                    }`}>{selectedSite.status}</p>
                  </div>
                  <div className="bg-slate-50 hover:bg-white hover:shadow-xs transition-all rounded-xl p-3.5 border border-slate-100">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">Coordinates</p>
                    <p className="text-slate-700 text-xs font-mono font-bold">{selectedSite.lat.toFixed(4)}, {selectedSite.lng.toFixed(4)}</p>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href={`/catalog/${selectedSite.id}`}
                  className="flex w-full h-12 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-700 active:scale-[0.98]"
                >
                  <span className="flex items-center">
                    View Full Details
                    <ChevronRightIcon className="ml-1 h-4 w-4" />
                  </span>
                </Link>
              </div>
            </AnimateOnScroll>
          ) : filteredSites.length === 0 ? (
            /* Empty State: Not Available in Your Area */
            <div className="p-6 my-auto text-center flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-3.5 shadow-sm">
                <MapPinIcon className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Not Available in This Exact Area
              </h3>
              <p className="text-xs text-slate-500 max-w-[260px] leading-relaxed mb-5">
                {searchQuery
                  ? `We currently don't have active hoardings within 2 km of "${searchQuery}".`
                  : "No hoardings match the selected filter criteria."}
              </p>
              <div className="flex flex-col gap-2 w-full max-w-[240px]">
                <Link
                  href={`/contact?city=${encodeURIComponent(searchQuery)}`}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-500/20 text-center"
                >
                  Request Space in this City
                </Link>
                {(searchQuery || activeStatus !== "All") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveStatus("All");
                    }}
                    className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Clear Search &amp; Filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Site List */
            <div className="p-3 space-y-1.5">
              <div className="flex items-center justify-between px-2 py-1 text-slate-400">
                <p className="text-[10px] uppercase tracking-wider font-bold">
                  {filteredSites.length} sites found
                </p>
              </div>

              {filteredSites.map((site, i) => (
                <div key={site.id}>
                  <button
                    onClick={() => setSelectedSite(site)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group cursor-pointer hover:bg-slate-50 hover:shadow-xs border border-transparent hover:border-slate-100"
                  >
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusDot(site.status)} group-hover:scale-125 transition-transform`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-slate-900 text-sm font-bold truncate group-hover:text-indigo-600 transition-colors">
                          {site.name}
                        </p>
                        {site.distanceKm !== undefined && site.distanceKm > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                            📍 {site.distanceKm} km away
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-xs mt-0.5">
                        {site.city}{site.area ? ` (${site.area})` : ""} · {site.type} · {site.size}
                      </p>
                    </div>
                    <ChevronRightIcon className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Legend Footer */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <div className="flex items-center gap-3.5">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Available</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Blocked</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> Booked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Map Area */}
      <div className="w-full relative order-1 md:order-2 h-[45%] md:h-full flex-shrink-0 md:flex-1">
        <LeafletMap
          sites={filteredSites}
          selectedSite={selectedSite}
          onMarkerClick={handleMarkerClick}
        />
      </div>

    </div>
  );
}
