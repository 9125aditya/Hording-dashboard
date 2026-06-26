/* eslint-disable @typescript-eslint/no-explicit-any */
import MapPageClient from "@/frontend/components/MapPageClient";
import { Suspense } from "react";
import { createClient } from "@/backend/db/server";

export default async function MapPage() {
  const supabase = await createClient();
  const { data: dbSites } = await supabase.from('sites').select('*');

  const sites = dbSites?.map((s: any) => ({
    id: s.site_id,
    name: s.name,
    city: s.city,
    lat: Number(s.lat),
    lng: Number(s.lng),
    status: s.status,
    size: s.size,
    type: s.type,
    photos: s.photos
  })) || [];

  return (
    <Suspense fallback={
      <div className="w-full h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 font-medium">Loading Map Platform...</p>
        </div>
      </div>
    }>
      <MapPageClient initialSites={sites} />
    </Suspense>
  );
}

