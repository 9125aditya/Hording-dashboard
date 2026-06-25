import { Search, Plus, Filter, MoreHorizontal, ArrowUpDown } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import AddSiteModal from "./AddSiteModal";
import SiteActions from "./SiteActions";

export default async function InventoryPage() {
  const supabase = await createClient();
  const { data: dbSites } = await supabase.from('sites').select('*').order('created_at', { ascending: false });

  const inventory = dbSites?.map((s: any) => ({
    id: s.id, // Keep the real numeric ID for actions
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
        <AddSiteModal />
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by ID, name or city..." 
              className="w-full h-9 pl-9 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button className="w-full sm:w-auto inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </button>
        </div>

        {/* Data Table (md and up) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium cursor-pointer hover:text-foreground">
                  <div className="flex items-center">Site ID <ArrowUpDown className="ml-1 h-3 w-3" /></div>
                </th>
                <th className="px-6 py-3 font-medium cursor-pointer hover:text-foreground">
                  <div className="flex items-center">Name <ArrowUpDown className="ml-1 h-3 w-3" /></div>
                </th>
                <th className="px-6 py-3 font-medium">Location</th>
                <th className="px-6 py-3 font-medium">Details</th>
                <th className="px-6 py-3 font-medium">Internal Rate</th>
                <th className="px-6 py-3 font-medium cursor-pointer hover:text-foreground">
                  <div className="flex items-center">Status <ArrowUpDown className="ml-1 h-3 w-3" /></div>
                </th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-medium text-muted-foreground">{item.displayId}</td>
                  <td className="px-6 py-4 font-medium text-foreground">{item.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.city}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="flex flex-col">
                      <span>{item.size}</span>
                      <span className="text-xs">{item.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground font-medium">{item.price}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <SiteActions siteId={item.id} currentStatus={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card List (below md) */}
        <div className="md:hidden divide-y divide-border">
          {inventory.map((item) => (
            <div key={item.id} className="p-4 flex flex-col gap-2">
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <h4 className="font-semibold text-foreground">{item.name}</h4>
                  <span className="font-mono text-xs text-muted-foreground">{item.displayId}</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${item.statusColor}`}>
                    {item.status}
                  </span>
                  <SiteActions siteId={item.id} currentStatus={item.status} />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span>{item.city}</span>
                <span>{item.size}</span>
                <span>{item.type}</span>
              </div>
              <p className="text-sm font-medium text-foreground">{item.price}</p>
            </div>
          ))}
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-border bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div>Showing 1 to 7 of 248 entries</div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-input rounded-md bg-background hover:bg-muted disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 border border-input rounded-md bg-background hover:bg-muted">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
