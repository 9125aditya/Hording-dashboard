"use client";

import { useEffect, useRef } from "react";

const LOCATIONS = [
  { id: 1, name: "Sitabuldi Main Road", city: "Nagpur", lat: 21.1458, lng: 79.0882, status: "Available", size: "40 × 20 ft", type: "Front-lit" },
  { id: 2, name: "Dharampeth", city: "Nagpur", lat: 21.1384, lng: 79.0621, status: "Booked", size: "60 × 30 ft", type: "Digital" },
  { id: 3, name: "Sadar", city: "Nagpur", lat: 21.1610, lng: 79.0833, status: "Available", size: "100 × 40 ft", type: "Back-lit" },
  { id: 4, name: "Shankar Nagar", city: "Nagpur", lat: 21.1332, lng: 79.0560, status: "Blocked", size: "30 × 15 ft", type: "Digital" },
  { id: 5, name: "Bajaj Nagar", city: "Nagpur", lat: 21.1275, lng: 79.0612, status: "Available", size: "40 × 20 ft", type: "Front-lit" },
  { id: 6, name: "Kamptee Road", city: "Nagpur", lat: 21.2167, lng: 79.1667, status: "Booked", size: "80 × 40 ft", type: "Front-lit" },
  { id: 7, name: "Wardha Road", city: "Nagpur", lat: 21.0963, lng: 79.0634, status: "Available", size: "60 × 30 ft", type: "Digital" },
  { id: 8, name: "Hingna", city: "Nagpur", lat: 21.0945, lng: 78.9882, status: "Booked", size: "40 × 20 ft", type: "Front-lit" },
  { id: 9, name: "Manewada", city: "Nagpur", lat: 21.1075, lng: 79.1022, status: "Available", size: "100 × 40 ft", type: "Back-lit" },
  { id: 10, name: "Pardi", city: "Nagpur", lat: 21.1541, lng: 79.1351, status: "Blocked", size: "30 × 15 ft", type: "Digital" },
  { id: 11, name: "Lakadganj", city: "Nagpur", lat: 21.1557, lng: 79.1158, status: "Available", size: "40 × 20 ft", type: "Front-lit" },
  { id: 12, name: "Itwari", city: "Nagpur", lat: 21.1524, lng: 79.1124, status: "Booked", size: "80 × 40 ft", type: "Front-lit" },
  { id: 13, name: "Rajapeth Market", city: "Amravati", lat: 20.9258, lng: 77.7640, status: "Available", size: "100 × 40 ft", type: "Back-lit" },
  { id: 14, name: "Camp Area", city: "Amravati", lat: 20.9320, lng: 77.7523, status: "Blocked", size: "30 × 15 ft", type: "Digital" },
  { id: 15, name: "Super Market Complex", city: "Chandrapur", lat: 19.9501, lng: 79.2961, status: "Available", size: "40 × 20 ft", type: "Front-lit" },
  { id: 16, name: "Hinjewadi Phase 1", city: "Pune", lat: 18.5913, lng: 73.7389, status: "Booked", size: "80 × 40 ft", type: "Digital" },
];

interface LeafletMapProps {
  onMarkerClick?: (site: typeof LOCATIONS[0]) => void;
}

export default function LeafletMap({ onMarkerClick }: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const onMarkerClickRef = useRef(onMarkerClick);

  // Keep callback ref current without triggering re-render
  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick;
  }, [onMarkerClick]);

  useEffect(() => {
    if (!containerRef.current || mapInstanceRef.current) return;

    let cancelled = false;

    // Dynamic imports — everything leaflet-related loads only here
    Promise.all([
      import("leaflet"),
      import("leaflet/dist/leaflet.css"),
    ]).then(([L]) => {
      if (cancelled || !containerRef.current) return;

      // Fix default icon paths (webpack breaks them)
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      // Create custom colored icons per status
      const createIcon = (color: string) => L.divIcon({
        html: `<div style="
          width: 32px; height: 32px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          display: flex; align-items: center; justify-content: center;
        "><div style="
          width: 10px; height: 10px;
          background: white;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div></div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const icons: Record<string, any> = {
        Available: createIcon("#10B981"),
        Booked: createIcon("#EF4444"),
        Blocked: createIcon("#F59E0B"),
      };

      // Init map
      const map = L.map(containerRef.current, {
        center: [20.5, 77.5], // Centered around Maharashtra (Nagpur/Amravati region)
        zoom: 7,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Add zoom control to bottom-left (away from panel)
      L.control.zoom({ position: "bottomleft" }).addTo(map);

      // Use light elegant tiles
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
        maxZoom: 20,
      }).addTo(map);

      // Add markers
      LOCATIONS.forEach((loc) => {
        const marker = L.marker([loc.lat, loc.lng], {
          icon: icons[loc.status] || icons.Available,
        }).addTo(map);

        marker.on("click", () => {
          if (onMarkerClickRef.current) onMarkerClickRef.current(loc);
        });

        // Tooltip on hover
        marker.bindTooltip(
          `<strong>${loc.name}</strong><br/><span style="opacity:0.7">${loc.city}</span>`,
          { direction: "top", offset: [0, -28], className: "leaflet-tooltip-custom" }
        );
      });

      // Fix sizing after layout settles
      requestAnimationFrame(() => {
        setTimeout(() => map.invalidateSize(), 50);
        setTimeout(() => map.invalidateSize(), 300);
      });
    });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <style dangerouslySetInnerHTML={{ __html: `
        .leaflet-container {
          background: #f8fafc !important;
          font-family: inherit;
        }
        .leaflet-tooltip-custom {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 8px 14px;
          color: #1e293b;
          font-size: 13px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }
        .leaflet-tooltip-custom::before {
          border-top-color: white !important;
        }
        .leaflet-control-zoom a {
          background: white !important;
          color: #334155 !important;
          border-color: #e2e8f0 !important;
        }
        .leaflet-control-zoom a:hover {
          background: #f1f5f9 !important;
        }
      `}} />
    </>
  );
}

export { LOCATIONS };
