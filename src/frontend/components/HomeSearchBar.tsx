"use client";

import { useState, useEffect, useRef } from "react";
import { MagnifyingGlassIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function HomeSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isSelectedRef = useRef(false);

  useEffect(() => {
    if (!query || query.length < 3) {
      setResults([]);
      return;
    }

    if (isSelectedRef.current) {
      isSelectedRef.current = false;
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&addressdetails=1&limit=5`,
          {
            headers: {
              "Accept-Language": "en-US,en;q=0.9",
            },
          }
        );
        const data = await response.json();
        setResults(data);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error fetching location data:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (item: any) => {
    isSelectedRef.current = true;
    const extractedCity = item.address?.city || item.address?.state_district || item.display_name.split(',')[0];
    
    setQuery(extractedCity);
    setResults([]);
    setShowDropdown(false);
  };

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(query)}`);
    } else {
      router.push(`/catalog`);
    }
  };

  return (
    <div className="relative w-full max-w-xl" ref={dropdownRef}>
      <div className="w-full bg-white rounded-2xl p-1.5 sm:p-2 flex items-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
        <div className="pl-3 sm:pl-4 pr-2 text-[#dd3333] shrink-0">
          {isLoading ? <ArrowPathIcon className="h-5 w-5 animate-spin" /> : <MapPinIcon className="h-5 w-5" />}
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setShowDropdown(true);
          }}
          onKeyDown={(e) => {
             if (e.key === 'Enter') {
                handleSearch();
             }
          }}
          placeholder="Search city, area or landmark..." 
          className="flex-1 h-11 sm:h-12 bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none px-2 text-sm sm:text-[15px] font-semibold min-w-0"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setResults([]); }}
            className="p-2 text-slate-400 hover:text-slate-600 mr-1"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
        <button
          onClick={handleSearch}
          className="h-11 sm:h-12 px-5 sm:px-8 bg-[#dd3333] hover:bg-[#c42c2c] text-white font-bold rounded-xl flex items-center transition-all active:scale-95 shadow-md shadow-red-500/20 text-xs sm:text-sm shrink-0"
        >
          <MagnifyingGlassIcon className="h-4 w-4 sm:mr-1.5" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>

      {/* Quick City Suggestion Chips */}
      <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-slate-400 font-medium whitespace-nowrap">Popular:</span>
        {["Nagpur", "Amravati", "Chandrapur", "Wardha"].map((city) => (
          <button
            key={city}
            onClick={() => {
              setQuery(city);
              router.push(`/catalog?search=${encodeURIComponent(city)}`);
            }}
            className="px-3 py-1 rounded-full bg-white/80 border border-slate-200 text-slate-600 font-semibold hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all active:scale-95 whitespace-nowrap shadow-xs"
          >
            {city}
          </button>
        ))}
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-left animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="max-h-60 overflow-y-auto divide-y divide-slate-100">
            {results.map((item) => (
              <li
                key={item.place_id}
                onClick={() => handleSelect(item)}
                className="px-4 py-3 hover:bg-blue-50/50 cursor-pointer transition-colors flex items-start gap-3"
              >
                <MapPinIcon className="h-4 w-4 text-[#dd3333] mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{item.display_name.split(',')[0]}</p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{item.display_name}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
