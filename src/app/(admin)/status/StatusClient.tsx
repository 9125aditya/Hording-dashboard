"use client";

import { useState, useTransition, useMemo } from "react";
import { Search, CheckCircle, Ban, AlertCircle, Loader2 } from "lucide-react";
import { updateSiteStatus } from "@/backend/actions/actions";

type SiteItem = {
  id: number;
  uuid: string;
  name: string;
  city: string;
  area: string;
  type: string;
  lit_type: string;
  status: string;
  statusColor: string;
};

export default function StatusClient({ initialInventory }: { initialInventory: SiteItem[] }) {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredSites = useMemo(() => {
    return initialInventory.filter(item => {
      const searchLower = search.toLowerCase();
      return item.name?.toLowerCase().includes(searchLower) || 
             item.city?.toLowerCase().includes(searchLower) ||
             item.area?.toLowerCase().includes(searchLower);
    });
  }, [initialInventory, search]);

  const handleStatusChange = (uuid: string, status: string) => {
    startTransition(async () => {
      await updateSiteStatus(uuid, status);
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search site by name, city, or area..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
          />
        </div>
        {isPending && (
          <div className="flex items-center text-sm text-indigo-600 font-medium bg-indigo-50 px-3 py-1.5 rounded-full">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-sm text-left">
          <thead className="bg-white border-b border-gray-200">
            <tr>
              <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider">Site Name</th>
              <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider">Media</th>
              <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider">Current Status</th>
              <th className="px-5 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wider text-right">Update Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredSites.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No sites found.</td></tr>
            ) : (
              filteredSites.map((item) => (
                <tr key={item.uuid} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-medium text-gray-900">{item.name}</td>
                  <td className="px-5 py-4 text-gray-600">
                    {item.city}{item.area ? `, ${item.area}` : ''}
                  </td>
                  <td className="px-5 py-4 text-gray-600">{item.type} {item.lit_type ? `(${item.lit_type})` : ''}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {item.status !== 'Available' && (
                        <button
                          disabled={isPending}
                          onClick={() => handleStatusChange(item.uuid, 'Available')}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Mark Available"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      {item.status !== 'Booked' && (
                        <button
                          disabled={isPending}
                          onClick={() => handleStatusChange(item.uuid, 'Booked')}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Mark Booked"
                        >
                          <AlertCircle className="w-5 h-5" />
                        </button>
                      )}
                      {item.status !== 'Blocked' && (
                        <button
                          disabled={isPending}
                          onClick={() => handleStatusChange(item.uuid, 'Blocked')}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Mark Blocked"
                        >
                          <Ban className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
