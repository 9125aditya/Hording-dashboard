"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { createPortal } from "react-dom";

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
  const [dropdownStyle, setDropdownStyle] = useState<{ top: number; left: number; width: number }>({
    top: 0, left: 0, width: 0,
  });

  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const isSelectedRef = useRef(false);

  // Hidden field states to submit with the form
  const [lat, setLat] = useState(defaultLat);
  const [lng, setLng] = useState(defaultLng);
  const [city, setCity] = useState(defaultCity);
  const [address, setAddress] = useState(defaultAddress);

  const updateDropdownPosition = useCallback(() => {
    if (inputWrapperRef.current) {
      const rect = inputWrapperRef.current.getBoundingClientRect();
      setDropdownStyle({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const dropdownEl = document.getElementById("location-search-dropdown");
      if (
        inputWrapperRef.current &&
        !inputWrapperRef.current.contains(target) &&
        (!dropdownEl || !dropdownEl.contains(target))
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!query || query.length < 3) {
      setResults([]);
      setShowDropdown(false);
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
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&addressdetails=1&limit=6`,
          { headers: { "Accept-Language": "en-US,en;q=0.9" } }
        );
        const data = await response.json();
        setResults(data);
        if (data.length > 0) {
          updateDropdownPosition();
          setShowDropdown(true);
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, updateDropdownPosition]);

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
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Search Location (Auto-fills Address, City, Lat &amp; Lng)</label>
          <div className="relative" ref={inputWrapperRef}>
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
                setAddress(e.target.value);
              }}
              onFocus={() => {
                if (results.length > 0) {
                  updateDropdownPosition();
                  setShowDropdown(true);
                }
              }}
              className="w-full min-h-[40px] pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              placeholder="Start typing an address, area, or city..."
              autoComplete="off"
            />
          </div>

          {/* Portal dropdown — renders at document.body to escape any overflow container */}
          {showDropdown && results.length > 0 && typeof window !== "undefined" &&
            createPortal(
              <div
                id="location-search-dropdown"
                style={{
                  position: "absolute",
                  top: dropdownStyle.top,
                  left: dropdownStyle.left,
                  width: dropdownStyle.width,
                  zIndex: 9999,
                }}
                className="bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden"
              >
                <ul className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                  {results.map((item) => (
                    <li
                      key={item.place_id}
                      onMouseDown={(e) => {
                        e.preventDefault(); // prevent blur from firing before click
                        handleSelect(item);
                      }}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors flex items-start gap-3"
                    >
                      <MapPin className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{item.display_name.split(",")[0]}</p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{item.display_name}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>,
              document.body
            )
          }
        </div>

        {/* Editable extracted fields */}
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
