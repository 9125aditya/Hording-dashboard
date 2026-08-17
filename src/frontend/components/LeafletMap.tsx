/* eslint-disable @typescript-eslint/no-explicit-any */
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
  lit_type?: string;
}

interface LeafletMapProps {
  sites: SiteData[];
  selectedSite?: SiteData | null;
  singleSiteZoom?: number;
  defaultZoom?: number;
  onMarkerClick?: (site: SiteData) => void;
}

export default function LeafletMap({
  sites,
  selectedSite = null,
  singleSiteZoom = 15,
  defaultZoom = 7,
  onMarkerClick,
}: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const LRef = useRef<any>(null);
  const markersMapRef = useRef<Map<string, { site: SiteData; marker: any }>>(new Map());
  const onMarkerClickRef = useRef(onMarkerClick);
  const isInitializedRef = useRef(false);

  // Keep callback ref current without triggering re-render
  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick;
  }, [onMarkerClick]);

  // 1. Initialize Map Instance (Only ONCE on mount)
  useEffect(() => {
    if (!containerRef.current || mapInstanceRef.current) return;
    let cancelled = false;

    Promise.all([
      import("leaflet"),
      import("leaflet/dist/leaflet.css"),
    ]).then(([L]) => {
      if (cancelled || !containerRef.current || mapInstanceRef.current) return;

      LRef.current = L;

      // Fix default icon paths (webpack breaks them)
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      const initialCenter: [number, number] = sites.length === 1 && sites[0].lat && sites[0].lng
        ? [sites[0].lat, sites[0].lng]
        : [20.5, 77.5];

      const initialZoom = sites.length === 1 ? singleSiteZoom : defaultZoom;

      const map = L.map(containerRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Add zoom control to bottom-left
      L.control.zoom({ position: "bottomleft" }).addTo(map);

      // Use light elegant tiles
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
        maxZoom: 20,
      }).addTo(map);

      // LayerGroup for markers to update without destroying the map
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;

      isInitializedRef.current = true;

      // Render initial markers
      renderMarkers();

      // Trigger map invalidateSize to prevent partial tile render
      setTimeout(() => {
        if (mapInstanceRef.current && (mapInstanceRef.current as any)._panes) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 150);

    }).catch((err) => {
      console.error("Error loading Leaflet:", err);
    });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.stop();
          mapInstanceRef.current.off();
          mapInstanceRef.current.remove();
        } catch {}
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
        isInitializedRef.current = false;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper: Create status-colored pin icon
  const getIcon = (status: string) => {
    const L = LRef.current;
    if (!L) return undefined;

    const colors: Record<string, string> = {
      Available: "#10B981",
      Booked: "#EF4444",
      Blocked: "#F59E0B",
    };
    const color = colors[status] || "#10B981";

    return L.divIcon({
      html: `<div style="
        width: 32px; height: 32px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.25);
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
  };

  // 2. Render / Update Markers when `sites` change
  const renderMarkers = () => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    const L = LRef.current;
    if (!map || !markersLayer || !L || !(map as any)._panes) return;

    markersLayer.clearLayers();
    markersMapRef.current.clear();

    const validSites = sites.filter(
      (s) => s.lat && s.lng && !isNaN(Number(s.lat)) && !isNaN(Number(s.lng))
    );

    const createdMarkers: any[] = [];

    validSites.forEach((site) => {
      const marker = L.marker([Number(site.lat), Number(site.lng)], {
        icon: getIcon(site.status),
      });

      marker.on("click", () => {
        if (onMarkerClickRef.current) onMarkerClickRef.current(site);
      });

      marker.bindTooltip(
        `<div class="text-xs">
          <strong class="text-slate-900 block font-bold">${site.name}</strong>
          <span class="text-slate-500">${site.city} ${site.size ? `· ${site.size}` : ''}</span>
        </div>`,
        {
          direction: "top",
          offset: [0, -28],
          className: "leaflet-tooltip-custom",
          permanent: sites.length === 1,
        }
      );

      markersLayer.addLayer(marker);
      markersMapRef.current.set(String(site.id), { site, marker });
      createdMarkers.push(marker);
    });

    // Auto center / bounds
    if (validSites.length === 1) {
      map.setView([Number(validSites[0].lat), Number(validSites[0].lng)], singleSiteZoom);
      const pair = markersMapRef.current.get(String(validSites[0].id));
      if (pair?.marker) {
        pair.marker.openTooltip();
      }
    } else if (createdMarkers.length > 1 && !selectedSite) {
      const bounds = L.latLngBounds([]);
      createdMarkers.forEach((m) => bounds.extend(m.getLatLng()));
      try {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      } catch {}
    }
  };

  // Trigger marker refresh when sites array or zoom config changes
  useEffect(() => {
    if (isInitializedRef.current) {
      renderMarkers();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sites, singleSiteZoom]);

  // 3. Handle `selectedSite` Changes smoothly without crashing
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = LRef.current;
    if (!map || !L || !(map as any)._panes) return;

    if (selectedSite && selectedSite.lat && selectedSite.lng) {
      try {
        map.stop();
        map.flyTo([Number(selectedSite.lat), Number(selectedSite.lng)], Math.max(map.getZoom(), 15), {
          duration: 1.0,
        });

        const pair = markersMapRef.current.get(String(selectedSite.id));
        if (pair?.marker) {
          pair.marker.openTooltip();
        }
      } catch (e) {
        console.warn("Leaflet flyTo skipped:", e);
      }
    } else if (!selectedSite && markersMapRef.current.size > 1) {
      try {
        map.stop();
        const bounds = L.latLngBounds([]);
        markersMapRef.current.forEach((m) => bounds.extend(m.marker.getLatLng()));
        map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 15, duration: 1.0 });
      } catch (e) {
        console.warn("Leaflet flyToBounds skipped:", e);
      }
    }
  }, [selectedSite]);

  return (
    <div className="w-full h-full relative">
      <div
        ref={containerRef}
        className="w-full h-full absolute inset-0 z-0"
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
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        }
        .leaflet-tooltip-custom::before {
          border-top-color: white !important;
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
          border-radius: 8px !important;
          overflow: hidden;
        }
        .leaflet-control-zoom a {
          background: white !important;
          color: #334155 !important;
          border-color: #e2e8f0 !important;
          width: 34px !important;
          height: 34px !important;
          line-height: 34px !important;
          font-size: 16px !important;
        }
        .leaflet-control-zoom a:hover {
          background: #f1f5f9 !important;
          color: #0284c7 !important;
        }
      `}} />
    </div>
  );
}

