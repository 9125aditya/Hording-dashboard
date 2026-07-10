"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
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
    <div className="relative w-full max-w-[480px]" ref={dropdownRef}>
      <div className="w-full bg-white rounded-xl p-1.5 flex items-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200">
        <div className="pl-4 pr-2 text-[#dd3333]">
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <MapPin className="h-5 w-5" />}
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
          placeholder="Search by area or city..." 
          className="flex-1 h-12 bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none px-2 text-[15px] font-semibold"
        />
        <button onClick={handleSearch} className="h-12 px-8 bg-[#dd3333] hover:bg-[#c42c2c] text-white font-bold rounded-lg flex items-center transition-colors shadow-sm text-sm">
          Search
        </button>
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden text-left">
          <ul className="max-h-60 overflow-y-auto divide-y divide-slate-100">
            {results.map((item) => (
              <li
                key={item.place_id}
                onClick={() => handleSelect(item)}
                className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3"
              >
                <MapPin className="h-4 w-4 text-[#dd3333] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-slate-900 line-clamp-1">{item.display_name.split(',')[0]}</p>
                  <p className="text-[13px] text-slate-500 line-clamp-1 mt-0.5">{item.display_name}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
