"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
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
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
      {/* Main Tabs */}
      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => { setActiveTab("normal"); setActiveSubTab("All"); }} 
          className={`px-6 py-3.5 text-sm font-semibold transition-all relative ${
            activeTab === 'normal' 
              ? 'text-indigo-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Normal Hoardings
          {activeTab === 'normal' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t" />}
        </button>
        <button 
          onClick={() => { setActiveTab("metro"); setActiveSubTab("All"); }} 
          className={`px-6 py-3.5 text-sm font-semibold transition-all relative ${
            activeTab === 'metro' 
              ? 'text-indigo-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Metro Stations &amp; Pillars
          {activeTab === 'metro' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t" />}
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="bg-gray-50/60 border-b border-gray-200 px-4 py-3 overflow-x-auto whitespace-nowrap flex gap-2 no-scrollbar">
        {subTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeSubTab === tab 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-200 hover:text-indigo-600'
            }`}
          >
            {tab === "Metro Pillar Signages CURRENT" ? "Metro Pillar Signages Current" : tab}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="px-5 py-4 border-b border-gray-200 flex flex-col sm:flex-row gap-3 justify-between items-center bg-white">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or ID" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 appearance-none pr-8 cursor-pointer"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}
          >
            <option value="All">Status: All</option>
            <option value="Available">Available</option>
            <option value="Booked">Booked</option>
            <option value="Blocked">Blocked</option>
          </select>
          <span className="text-xs text-gray-500 hidden sm:block">
            {filteredSites.length} site{filteredSites.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto min-h-[400px]">
        {activeTab === "normal" ? (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/80 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Sr.</th>
                <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">City</th>
                <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[200px]">Hoarding Location</th>
                <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">LIT/ N.LIT</th>
                <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Media</th>
                <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Size (WxH)</th>
                <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Qty.</th>
                <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Total Sq. ft.</th>
                <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Region</th>
                <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Rational</th>
                <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Net Rate</th>
                <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">DCPM</th>
                <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Agency Rate</th>
                <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider text-right whitespace-nowrap sticky right-0 bg-gray-50/80"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSites.length === 0 ? (
                <tr><td colSpan={16} className="px-6 py-12 text-center text-gray-500">No sites found.</td></tr>
              ) : (
                filteredSites.map((item, index) => (
                  <tr key={item.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-500">{index + 1}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-700">{item.city}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-medium text-gray-900 min-w-[200px]">{item.name}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-600">{item.lit_type}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-600">{item.type}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-600">{item.size}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-600">{item.qty}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-600">{item.total_sq_ft}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-600">{item.area}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap max-w-[150px] truncate text-gray-600" title={item.rationale}>{item.rationale || '-'}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-600">{item.net_rate ? `₹${item.net_rate}` : '-'}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-600">{item.dcpm_rate ? `₹${item.dcpm_rate}` : '-'}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-600">{item.agency_rate ? `₹${item.agency_rate}` : '-'}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap sticky right-0 bg-white border-l border-gray-100">
                      <SiteActions siteId={String(item.id)} currentStatus={item.status} uuid={item.uuid} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-indigo-50/40 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Sr.</th>
                <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Line</th>
                <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[200px]">Locations</th>
                <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">TYPE</th>
                <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Media</th>
                <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">DESIGN SIZE WXH</th>
                <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">From Pillars To Pillars</th>
                <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">No&apos;s of Pillars</th>
                <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">No&apos;s of Display Back To Back</th>
                <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Total sq ft</th>
                <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Rate per Pillars (NET)</th>
                <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Rate per Pillars (DCPM)</th>
                <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Agency Rate</th>
                <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider text-right whitespace-nowrap sticky right-0 bg-indigo-50/40"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSites.length === 0 ? (
                <tr><td colSpan={15} className="px-6 py-12 text-center text-gray-500">No sites found.</td></tr>
              ) : (
                filteredSites.map((item, index) => (
                  <tr key={item.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-500">{index + 1}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-700">{item.metro_line || '-'}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-medium text-gray-900 min-w-[200px]">{item.name}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-600">{item.lit_type}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-600">{item.type}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-600">{item.size}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-600">{item.metro_pillars || '-'}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-600">{item.no_of_pillars || '-'}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-600">{item.no_of_displays || '-'}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-600">{item.total_sq_ft}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-600">{item.net_rate ? `₹${item.net_rate}` : '-'}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-600">{item.dcpm_rate ? `₹${item.dcpm_rate}` : '-'}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-600">{item.agency_rate ? `₹${item.agency_rate}` : '-'}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap sticky right-0 bg-white border-l border-gray-100">
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
