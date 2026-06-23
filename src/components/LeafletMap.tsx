"use client";

import { useEffect, useRef } from "react";

export interface SiteData {
  id: any;
  name: string;
  city: string;
  lat: number;
  lng: number;
  status: string;
  size: string;
  type: string;
}

interface LeafletMapProps {
  sites: SiteData[];
  onMarkerClick?: (site: SiteData) => void;
}

export default function LeafletMap({ sites, onMarkerClick }: LeafletMapProps) {
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
      const markers = sites.map(site => {
        const marker = L.marker([site.lat, site.lng], {
          icon: icons[site.status] || icons.Available,
        });

        marker.on("click", () => {
          if (onMarkerClickRef.current) onMarkerClickRef.current(site);
        });

        // Tooltip on hover
        marker.bindTooltip(
          `<strong>${site.name}</strong><br/><span style="opacity:0.7">${site.city}</span>`,
          { direction: "top", offset: [0, -28], className: "leaflet-tooltip-custom" }
        );
        return marker;
      });

      // Add markers to layer group instead of directly to map
      const markersLayer = L.layerGroup(markers);
      markersLayer.addTo(map);

      // Save markers and map instance
      (map as any)._markers = markers;
      mapInstanceRef.current = map;

      // Ensure the markers are loaded fully
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
      
    }).catch(err => {
      console.error("Error loading Leaflet:", err);
    });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [sites]);

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
