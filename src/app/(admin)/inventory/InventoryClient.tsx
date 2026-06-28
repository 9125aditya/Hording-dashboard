"use client";

import { useState, useMemo } from "react";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import SiteActions from "./SiteActions";

type InventoryItem = {
  id: number;
  uuid: string;
  displayId: string;
  name: string;
  city: string;
  size: string;
  type: string;
  price: string;
  status: string;
  statusColor: string;
};

export default function InventoryClient({ initialInventory }: { initialInventory: InventoryItem[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortConfig, setSortConfig] = useState<{ key: keyof InventoryItem; direction: 'asc' | 'desc' } | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSort = (key: keyof InventoryItem) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSorted = useMemo(() => {
    // 1. Filter
    let result = initialInventory.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(search.toLowerCase()) || 
        item.displayId.toLowerCase().includes(search.toLowerCase()) || 
        item.city.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // 2. Sort
    if (sortConfig !== null) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [initialInventory, search, statusFilter, sortConfig]);

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by ID, name or city..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="relative w-full sm:w-auto">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full sm:w-auto inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            <Filter className="mr-2 h-4 w-4" /> 
            {statusFilter === 'All' ? 'Filter' : statusFilter}
          </button>
          
          {isFilterOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border shadow-lg rounded-md z-50 overflow-hidden py-1 animate-in fade-in zoom-in-95">
                {['All', 'Available', 'Booked', 'Blocked'].map((status) => (
                  <button
                    key={status}
                    onClick={() => { setStatusFilter(status); setIsFilterOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted ${statusFilter === status ? 'font-bold text-primary' : ''}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Data Table (md and up) */}
      <div className="hidden md:block overflow-x-auto min-h-[400px]">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 border-b border-border text-muted-foreground">
            <tr>
              <th className="px-6 py-3 font-medium cursor-pointer hover:text-foreground" onClick={() => handleSort('displayId')}>
                <div className="flex items-center">Site ID <ArrowUpDown className="ml-1 h-3 w-3" /></div>
              </th>
              <th className="px-6 py-3 font-medium cursor-pointer hover:text-foreground" onClick={() => handleSort('name')}>
                <div className="flex items-center">Name <ArrowUpDown className="ml-1 h-3 w-3" /></div>
              </th>
              <th className="px-6 py-3 font-medium cursor-pointer hover:text-foreground" onClick={() => handleSort('city')}>
                <div className="flex items-center">Location <ArrowUpDown className="ml-1 h-3 w-3" /></div>
              </th>
              <th className="px-6 py-3 font-medium">Details</th>
              <th className="px-6 py-3 font-medium">Internal Rate</th>
              <th className="px-6 py-3 font-medium cursor-pointer hover:text-foreground" onClick={() => handleSort('status')}>
                <div className="flex items-center">Status <ArrowUpDown className="ml-1 h-3 w-3" /></div>
              </th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                  No sites found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((item) => (
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
                    <SiteActions siteId={String(item.id)} currentStatus={item.status} uuid={item.uuid} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Card List (below md) */}
      <div className="md:hidden divide-y divide-border min-h-[400px]">
        {filteredAndSorted.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No sites found matching your criteria.
          </div>
        ) : (
          filteredAndSorted.map((item) => (
            <div key={item.id} className="p-4 flex flex-col gap-2">
              <div className="flex justify-between items-start gap-3">
                <div className="flex flex-col">
                  <span className="font-medium text-foreground text-sm">{item.name}</span>
                  <span className="font-mono text-xs text-muted-foreground mt-0.5">{item.displayId}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${item.statusColor}`}>
                    {item.status}
                  </span>
                  <SiteActions siteId={String(item.id)} currentStatus={item.status} uuid={item.uuid} />
                </div>
              </div>
              <div className="flex justify-between items-end mt-2">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">{item.city}</span>
                  <span className="text-xs font-medium text-foreground mt-0.5">{item.price}</span>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">{item.type}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
