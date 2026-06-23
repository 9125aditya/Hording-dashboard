"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Loader2, ExternalLink } from "lucide-react";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900/50 backdrop-blur-md flex items-center justify-center rounded-3xl border border-cloud/10">
      <div className="flex flex-col items-center gap-3 text-cloud">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="text-sm text-cloud/60 animate-pulse">Loading Interactive Map…</span>
      </div>
    </div>
  ),
});

import { SiteData } from "./LeafletMap";

interface HomeMapProps {
  initialSites: SiteData[];
}

export default function HomeMap({ initialSites }: HomeMapProps) {
  const router = useRouter();

  const handleMarkerClick = (site: any) => {
    router.push(`/map?siteId=${site.id}`);
  };

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden border-4 border-cloud/10 shadow-2xl bg-slate-950 group">
      {/* Map Container */}
      <div className="w-full h-full absolute inset-0 z-0">
        <LeafletMap sites={initialSites} onMarkerClick={handleMarkerClick} />
      </div>

      {/* Floating Info Overlay (top right) */}
      <div className="absolute top-4 right-4 z-[400] bg-slate-950/80 backdrop-blur-md border border-cloud/10 rounded-xl px-4 py-2 flex items-center gap-2 text-cloud text-xs pointer-events-none shadow-lg">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Live Interactive Preview</span>
      </div>

      {/* Floating CTA Overlay (bottom center) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[400] transition-all duration-300">
        <button
          onClick={() => router.push("/map")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary/95 text-white font-semibold text-xs shadow-xl transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          <span>Open Fullscreen Map</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
