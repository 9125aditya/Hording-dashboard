/* eslint-disable @typescript-eslint/no-explicit-any */
import MapPageClient from "@/frontend/components/MapPageClient";
import { Suspense } from "react";
import { createClient } from "@/backend/db/server";

export const dynamic = 'force-dynamic';

export default async function AdminMapPage() {
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
    <div className="h-[calc(100vh-64px)] md:h-screen w-full relative">
      <Suspense fallback={
        <div className="w-full h-full bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-500 font-medium">Loading Admin Map Platform...</p>
          </div>
        </div>
      }>
        <MapPageClient initialSites={sites} />
      </Suspense>
    </div>
  );
}
