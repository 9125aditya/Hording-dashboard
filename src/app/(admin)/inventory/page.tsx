import { createClient } from "@/backend/db/server";
import Link from "next/link";
import InventoryClient from "./InventoryClient";

export default async function InventoryPage() {
  const supabase = await createClient();
  const { data: dbSites } = await supabase.from('sites').select('*').order('created_at', { ascending: false });

  const inventory = dbSites?.map((s: any) => ({
    id: s.id,
    uuid: s.site_id,
    displayId: s.site_id?.substring(0, 8) || String(s.id),
    is_metro: !!s.is_metro,
    name: s.name,
    city: s.city,
    area: s.area || '',
    size: s.size,
    type: s.type,
    lit_type: s.lit_type || '',
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
    statusColor: s.status === 'Available' ? 'bg-available text-primary-foreground' : s.status === 'Booked' ? 'bg-booked text-primary-foreground' : 'bg-blocked text-white',
  })) || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-heading">Inventory</h1>
          <p className="text-sm text-muted-foreground">Manage all your advertising sites and view their current statuses.</p>
        </div>
        <Link 
          href="/admin/inventory/add"
          className="h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold flex items-center justify-center transition-colors"
        >
          Add New Site
        </Link>
      </div>
      <InventoryClient initialInventory={inventory} />
    </div>
  );
}
