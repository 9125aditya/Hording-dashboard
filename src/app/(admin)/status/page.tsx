import { createClient } from "@/backend/db/server";
import StatusClient from "./StatusClient";

export const dynamic = 'force-dynamic';

export default async function StatusPage() {
  const supabase = await createClient();
  const { data: dbSites, error } = await supabase
    .from('sites')
    .select('id, site_id, name, city, area, type, lit_type, status')
    .order('name', { ascending: true });

  if (error) {
    console.error("StatusPage fetch error:", error.message);
  }

  const inventory = (dbSites ?? [])
    .filter((s: any) => s.site_id) // only include sites that have a valid site_id
    .map((s: any) => ({
      id: s.id,
      uuid: s.site_id,
      name: s.name || 'Unnamed Site',
      city: s.city || '',
      area: s.area || '',
      type: s.type || '',
      lit_type: s.lit_type || '',
      status: s.status || 'Unknown',
      statusColor:
        s.status === 'Available' ? 'bg-emerald-100 text-emerald-700'
        : s.status === 'Booked'  ? 'bg-rose-100 text-rose-700'
        : s.status === 'Blocked' ? 'bg-amber-100 text-amber-700'
        : 'bg-gray-100 text-gray-700',
    }));

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Site Status</h1>
        <p className="text-sm text-gray-500 mt-1">Quickly update the availability status of your inventory</p>
      </div>
      <StatusClient initialInventory={inventory} />
    </div>
  );
}
