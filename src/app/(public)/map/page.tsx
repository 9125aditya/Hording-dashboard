import MapPageClient from "@/components/MapPageClient";
import { Suspense } from "react";

export default function MapPage() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 font-medium">Loading Map Platform...</p>
        </div>
      </div>
    }>
      <MapPageClient />
    </Suspense>
  );
}

