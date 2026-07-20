import { createClient } from "@/backend/db/server";
import Link from "next/link";
import InventoryClient from "./InventoryClient";
import { Plus } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
  const supabase = await createClient();
  const { data: dbSites } = await supabase.from('sites').select('*').order('created_at', { ascending: false });

  const inventory = dbSites?.map((s: any) => ({
    id: s.id,
    uuid: s.site_id || String(s.id),
    displayId: s.site_id?.substring(0, 8) || String(s.id),
    is_metro: !!s.is_metro,
    name: s.name,
    sheet_name: s.sheet_name || '',
    city: s.city,
    area: s.area || '',
    size: s.size,
    type: s.type,
    lit_type: s.lit_type || '',
    landlord: s.landlord || '',
    qty: s.qty || 1,
    total_sq_ft: s.total_sq_ft || 0,
    printable_size: s.printable_size || '',
    metro_line: s.metro_line || '',
    metro_pillars: s.metro_pillars || '',
    no_of_pillars: s.no_of_pillars || null,
    no_of_displays: s.no_of_displays || null,
    rationale: s.rationale || '',
    net_rate: s.net_rate || 0,
    dcpm_rate: s.dcpm_rate || 0,
    agency_rate: s.agency_rate || 0,
    status: s.status,
    statusColor: s.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : s.status === 'Booked' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700',
  })) || [];

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all your advertising sites</p>
        </div>
        <Link 
          href="/inventory/add"
          className="h-10 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Site
        </Link>
      </div>
      <InventoryClient initialInventory={inventory} />
    </div>
  );
}
