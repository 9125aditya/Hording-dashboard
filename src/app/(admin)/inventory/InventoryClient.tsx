"use client";

import { useState, useMemo, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
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

const PAGE_SIZE = 25;

export default function InventoryClient({ initialInventory }: { initialInventory: SiteItem[] }) {
  const [activeTab, setActiveTab] = useState<"normal" | "metro">("normal");
  const [activeSubTab, setActiveSubTab] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [page, setPage] = useState(1);
  
  const subTabs = useMemo(() => {
    const sheets = Array.from(new Set(
      initialInventory
        .filter(item => (activeTab === 'metro' ? item.is_metro : !item.is_metro))
        .map(item => item.sheet_name)
        .filter(Boolean)
    ));
    sheets.sort((a, b) => a.localeCompare(b));
    return ['All', ...sheets];
  }, [initialInventory, activeTab]);
  
  const filteredSites = useMemo(() => {
    return initialInventory.filter(item => {
      const searchLower = search.toLowerCase();
      const matchesSearch = 
        item.name?.toLowerCase().includes(searchLower) || 
        item.city?.toLowerCase().includes(searchLower) ||
        item.area?.toLowerCase().includes(searchLower);
      
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      const matchesTab = activeTab === "metro" ? item.is_metro : !item.is_metro;
      const matchesSubTab = activeSubTab === "All" || item.sheet_name === activeSubTab;
      
      return matchesSearch && matchesStatus && matchesTab && matchesSubTab;
    });
  }, [initialInventory, search, statusFilter, activeTab, activeSubTab]);

  const totalPages = Math.ceil(filteredSites.length / PAGE_SIZE);
  const paginatedSites = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredSites.slice(start, start + PAGE_SIZE);
  }, [filteredSites, page]);

  // Reset page when filters change
  const handleTabChange = useCallback((tab: "normal" | "metro") => {
    setActiveTab(tab);
    setActiveSubTab("All");
    setPage(1);
  }, []);

  const handleSubTabChange = useCallback((tab: string) => {
    setActiveSubTab(tab);
    setPage(1);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setStatusFilter(value);
    setPage(1);
  }, []);

  const startIndex = (page - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(page * PAGE_SIZE, filteredSites.length);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
      {/* Main Tabs */}
      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => handleTabChange("normal")} 
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
          onClick={() => handleTabChange("metro")} 
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
            onClick={() => handleSubTabChange(tab)}
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
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full h-9 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 appearance-none pr-8 cursor-pointer"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}
          >
            <option value="All">Status: All</option>
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
              {paginatedSites.length === 0 ? (
                <tr><td colSpan={16} className="px-6 py-12 text-center text-gray-500">No sites found.</td></tr>
              ) : (
                paginatedSites.map((item, index) => (
                  <tr key={item.uuid} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-500">{startIndex + index}</td>
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
                    <td className="px-5 py-3.5 text-right whitespace-nowrap sticky right-0 bg-white group-hover:bg-indigo-50/30 border-l border-gray-100 transition-colors">
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
              {paginatedSites.length === 0 ? (
                <tr><td colSpan={15} className="px-6 py-12 text-center text-gray-500">No sites found.</td></tr>
              ) : (
                paginatedSites.map((item, index) => (
                  <tr key={item.uuid} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-5 py-3.5 whitespace-nowrap text-gray-500">{startIndex + index}</td>
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
                    <td className="px-5 py-3.5 text-right whitespace-nowrap sticky right-0 bg-white group-hover:bg-indigo-50/30 border-l border-gray-100 transition-colors">
                      <SiteActions siteId={String(item.id)} currentStatus={item.status} uuid={item.uuid} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {filteredSites.length > PAGE_SIZE && (
        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between bg-white">
          <span className="text-sm text-gray-500">
            {startIndex}-{endIndex} of {filteredSites.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              className="h-8 px-3 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-4 w-4 inline -mt-0.5" /> Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="h-8 px-3 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next <ChevronRight className="h-4 w-4 inline -mt-0.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
