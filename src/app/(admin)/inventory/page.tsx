import { createClient } from "@/backend/db/server";
import Link from "next/link";
import InventoryClient from "./InventoryClient";

export default async function InventoryPage() {
  const supabase = await createClient();
  const { data: dbSites } = await supabase.from('sites').select('*').order('created_at', { ascending: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inventory = dbSites?.map((s: any) => ({
    id: s.id, // Keep the real numeric ID for actions
    uuid: s.site_id, // Keep the UUID for public links
    displayId: s.site_id?.substring(0, 8) || String(s.id),
    name: s.name,
    city: s.city,
    size: s.size,
    type: s.type,
    price: s.internal_rate ? `₹${s.internal_rate.toLocaleString('en-IN')}/mo` : 'Contact for price',
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
