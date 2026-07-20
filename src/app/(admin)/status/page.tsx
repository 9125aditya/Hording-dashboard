import { createClient } from "@/backend/db/server";
import StatusClient from "./StatusClient";

export const dynamic = 'force-dynamic';

export default async function StatusPage() {
  const supabase = await createClient();
  const { data: dbSites } = await supabase.from('sites').select('id, site_id, name, city, area, type, lit_type, status').order('created_at', { ascending: false });

  const inventory = dbSites?.map((s: any) => ({
    id: s.id,
    uuid: s.site_id,
    name: s.name,
    city: s.city,
    area: s.area || '',
    type: s.type,
    lit_type: s.lit_type || '',
    status: s.status,
    statusColor: s.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : s.status === 'Booked' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700',
  })) || [];

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
