"use client";

import { useState, useMemo } from "react";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import SiteActions from "./SiteActions";

type SiteItem = {
  id: number;
  uuid: string;
  sheet_name: string;
  is_metro: boolean;
  name: string;
  city: string;
  area: string;
  size: string;
  type: string;
  lit_type: string;
  status: string;
  statusColor: string;
  qty: number;
  total_sq_ft: number;
  printable_size: string;
  metro_line: string;
  metro_pillars: string;
  no_of_pillars: number;
  no_of_displays: number;
  rationale: string;
  net_rate: number;
  dcpm_rate: number;
  agency_rate: number;
};

export default function InventoryClient({ initialInventory }: { initialInventory: SiteItem[] }) {
  const [activeTab, setActiveTab] = useState<"normal" | "metro">("normal");
  const [activeSubTab, setActiveSubTab] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  
  const subTabs = useMemo(() => {
    const sheets = Array.from(new Set(
      initialInventory
        .filter(item => (activeTab === 'metro' ? item.is_metro : !item.is_metro))
        .map(item => item.sheet_name)
        .filter(Boolean)
    ));
    // Sort alphabetically
    sheets.sort((a, b) => a.localeCompare(b));
    return ['All', ...sheets];
  }, [initialInventory, activeTab]);
  
  const filteredSites = useMemo(() => {
    return initialInventory.filter(item => {
      const matchesSearch = 
        item.name?.toLowerCase().includes(search.toLowerCase()) || 
        item.city?.toLowerCase().includes(search.toLowerCase()) ||
        item.area?.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      const matchesTab = activeTab === "metro" ? item.is_metro : !item.is_metro;
      const matchesSubTab = activeSubTab === "All" || item.sheet_name === activeSubTab;
      
      return matchesSearch && matchesStatus && matchesTab && matchesSubTab;
    });
  }, [initialInventory, search, statusFilter, activeTab, activeSubTab]);

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-border">
        <button 
          onClick={() => { setActiveTab("normal"); setActiveSubTab("All"); }} 
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'normal' ? 'bg-background border-b-2 border-primary text-primary' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
        >
          Normal Hoardings
        </button>
        <button 
          onClick={() => { setActiveTab("metro"); setActiveSubTab("All"); }} 
          className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'metro' ? 'bg-background border-b-2 border-primary text-primary' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
        >
          Metro Stations / Pillars
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="bg-muted/30 border-b border-border p-3 overflow-x-auto whitespace-nowrap flex gap-2 no-scrollbar">
        {subTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              activeSubTab === tab 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'bg-background text-muted-foreground border border-border hover:bg-muted/80'
            }`}
          >
            {tab === "Metro Pillar Signages CURRENT" ? "Metro Pillar Signages Current" : tab}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-background">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by name, city, area..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Booked">Booked</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto min-h-[400px]">
        {activeTab === "normal" ? (
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Sr. No</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">City</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[200px]">Hoarding Location</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">LIT/ N.LIT</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Media</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Size (WxH)</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Qty.</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Total Sq. ft.</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Region</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Rational</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Net Rate</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">DCPM</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Agency Rate</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Status</th>
                <th className="px-4 py-3 font-medium text-right whitespace-nowrap sticky right-0 bg-muted/50">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSites.length === 0 ? (
                <tr><td colSpan={16} className="px-6 py-8 text-center text-muted-foreground">No sites found.</td></tr>
              ) : (
                filteredSites.map((item, index) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">{index + 1}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.city}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-foreground min-w-[200px]">{item.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.lit_type}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.type}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.size}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.qty}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.total_sq_ft}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.area}</td>
                    <td className="px-4 py-3 whitespace-nowrap max-w-[150px] truncate" title={item.rationale}>{item.rationale || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.net_rate ? `₹${item.net_rate}` : '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.dcpm_rate ? `₹${item.dcpm_rate}` : '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.agency_rate ? `₹${item.agency_rate}` : '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap sticky right-0 bg-background border-l border-border/50 shadow-sm">
                      <SiteActions siteId={String(item.id)} currentStatus={item.status} uuid={item.uuid} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-indigo-50/50 border-b border-border text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Sr. No</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Line</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap min-w-[200px]">Locations</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">TYPE</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Media</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">DESIGN SIZE WXH</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">From Pillars To Pillars</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">No's of Pillars</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">No's of Display Back To Back</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Total sq ft</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Rate per Pillars (NET)</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Rate per Pillars (DCPM)</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Agency Rate</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Status</th>
                <th className="px-4 py-3 font-medium text-right whitespace-nowrap sticky right-0 bg-indigo-50/50">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSites.length === 0 ? (
                <tr><td colSpan={15} className="px-6 py-8 text-center text-muted-foreground">No sites found.</td></tr>
              ) : (
                filteredSites.map((item, index) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">{index + 1}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.metro_line || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-foreground min-w-[200px]">{item.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.lit_type}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.type}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.size}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.metro_pillars || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.no_of_pillars || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.no_of_displays || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.total_sq_ft}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.net_rate ? `₹${item.net_rate}` : '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.dcpm_rate ? `₹${item.dcpm_rate}` : '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.agency_rate ? `₹${item.agency_rate}` : '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap sticky right-0 bg-background border-l border-border/50 shadow-sm">
                      <SiteActions siteId={String(item.id)} currentStatus={item.status} uuid={item.uuid} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
