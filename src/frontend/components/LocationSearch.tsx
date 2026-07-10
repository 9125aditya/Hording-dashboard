"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";

type SearchResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    city?: string;
    state_district?: string;
    state?: string;
    suburb?: string;
    neighbourhood?: string;
  };
};

export default function LocationSearch({
  defaultAddress = "",
  defaultLat = "",
  defaultLng = "",
  defaultCity = "",
}: {
  defaultAddress?: string;
  defaultLat?: string | number;
  defaultLng?: string | number;
  defaultCity?: string;
}) {
  const [query, setQuery] = useState(defaultAddress);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hidden field states to submit with the form
  const [lat, setLat] = useState(defaultLat);
  const [lng, setLng] = useState(defaultLng);
  const [city, setCity] = useState(defaultCity);
  const [address, setAddress] = useState(defaultAddress);

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
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`,
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
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (item: SearchResult) => {
    isSelectedRef.current = true;
    const extractedCity = item.address?.city || item.address?.state_district || "";
    
    setQuery(item.display_name);
    setAddress(item.display_name);
    setLat(item.lat);
    setLng(item.lon);
    if (extractedCity) setCity(extractedCity);
    
    setResults([]);
    setShowDropdown(false);
  };

  return (
    <div className="space-y-6">
      {/* Hidden inputs to pass data to the parent form */}
      <input type="hidden" name="lat" value={lat} />
      <input type="hidden" name="lng" value={lng} />
      <input type="hidden" name="city" value={city} />
      <input type="hidden" name="address" value={address} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2 relative" ref={dropdownRef}>
          <label className="text-sm font-medium">Search Location (Auto-fills Address, City, Lat & Lng)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {isLoading ? (
                <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
              ) : (
                <Search className="h-4 w-4 text-gray-400" />
              )}
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setAddress(e.target.value); // Keep manual typing synced to address just in case
              }}
              onFocus={() => {
                if (results.length > 0) setShowDropdown(true);
              }}
              className="w-full min-h-[40px] pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              placeholder="Start typing an address, area, or city..."
              autoComplete="off"
            />
          </div>

          {showDropdown && results.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              <ul className="max-h-60 overflow-y-auto divide-y divide-gray-100">
                {results.map((item) => (
                  <li
                    key={item.place_id}
                    onClick={() => handleSelect(item)}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors flex items-start gap-3"
                  >
                    <MapPin className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.display_name.split(',')[0]}</p>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{item.display_name}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Display Read-Only / Editable state of the extracted fields */}
        <div className="space-y-2">
          <label className="text-sm font-medium">City *</label>
          <input 
            required 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50" 
            placeholder="City" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Latitude</label>
          <input 
            type="number" 
            step="any" 
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50" 
            placeholder="21.1458" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Longitude</label>
          <input 
            type="number" 
            step="any" 
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/50" 
            placeholder="79.0882" 
          />
        </div>
      </div>
    </div>
  );
}
