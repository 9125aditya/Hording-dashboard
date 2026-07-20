"use client";

import { useState, useTransition, useMemo, useRef, useEffect } from "react";
import { Search, CheckCircle, X, Loader2, MapPin, Tag } from "lucide-react";
import { updateSiteStatus } from "@/backend/actions/actions";

type SiteItem = {
  id: number;
  uuid: string;
  useSiteId: boolean;
  name: string;
  city: string;
  area: string;
  type: string;
  lit_type: string;
  status: string;
  statusColor: string;
};

const STATUS_OPTIONS = [
  { label: "Available", color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200", dot: "bg-emerald-500" },
  { label: "Booked",    color: "bg-rose-100 text-rose-700 hover:bg-rose-200",          dot: "bg-rose-500" },
  { label: "Blocked",  color: "bg-amber-100 text-amber-700 hover:bg-amber-200",        dot: "bg-amber-500" },
];

function StatusBadge({ status }: { status: string }) {
  const opt = STATUS_OPTIONS.find(o => o.label === status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${opt?.color || "bg-gray-100 text-gray-700"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${opt?.dot || "bg-gray-400"}`} />
      {status}
    </span>
  );
}

function StatusDropdown({
  uuid,
  currentStatus,
  isPending,
  onUpdate,
}: {
  uuid: string;
  currentStatus: string;
  isPending: boolean;
  onUpdate: (uuid: string, status: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        disabled={isPending}
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-indigo-300 transition-all disabled:opacity-50"
      >
        Change Status
        <span className="text-gray-400">▾</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-1.5 z-50 w-40 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {STATUS_OPTIONS.filter(o => o.label !== currentStatus).map(opt => (
            <button
              key={opt.label}
              onClick={() => { onUpdate(uuid, opt.label); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors"
            >
              <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StatusClient({ initialInventory }: { initialInventory: SiteItem[] }) {
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [localInventory, setLocalInventory] = useState<SiteItem[]>(initialInventory);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const searchRef = useRef<HTMLDivElement>(null);

  // Suggestions: top 8 matches for autocomplete dropdown
  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    const lower = search.toLowerCase();
    return localInventory
      .filter(item =>
        item.name?.toLowerCase().includes(lower) ||
        item.city?.toLowerCase().includes(lower) ||
        item.area?.toLowerCase().includes(lower)
      )
      .slice(0, 8);
  }, [localInventory, search]);

  // Filtered sites for the table
  const filteredSites = useMemo(() => {
    if (!search.trim()) return localInventory;
    const lower = search.toLowerCase();
    return localInventory.filter(item =>
      item.name?.toLowerCase().includes(lower) ||
      item.city?.toLowerCase().includes(lower) ||
      item.area?.toLowerCase().includes(lower)
    );
  }, [localInventory, search]);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleStatusChange = (uuid: string, status: string) => {
    setUpdatingId(uuid);
    startTransition(async () => {
      await updateSiteStatus(uuid, status);
      // Optimistic update — reflect immediately in UI
      setLocalInventory(prev =>
        prev.map(item => {
          if (item.uuid !== uuid) return item;
          return {
            ...item,
            status,
            statusColor:
              status === "Available" ? "bg-emerald-100 text-emerald-700"
              : status === "Booked"  ? "bg-rose-100 text-rose-700"
              : "bg-amber-100 text-amber-700",
          };
        })
      );
      setUpdatingId(null);
    });
  };

  const selectSuggestion = (item: SiteItem) => {
    setSearch(item.name);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-4">
      {/* Search with Autocomplete */}
      <div ref={searchRef} className="relative">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Type a site name to search..."
            value={search}
            onChange={e => { setSearch(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            className="w-full h-11 pl-10 pr-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 transition-all shadow-sm"
          />
          {search && (
            <button
              onClick={() => { setSearch(""); setShowSuggestions(false); }}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
            {suggestions.map(item => (
              <button
                key={item.uuid}
                onClick={() => selectSuggestion(item)}
                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-indigo-50 text-left transition-colors border-b border-gray-50 last:border-0"
              >
                <MapPin className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500 truncate">{item.city}{item.area ? `, ${item.area}` : ""} · {item.type}</p>
                </div>
                <StatusBadge status={item.status} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {STATUS_OPTIONS.map(opt => {
          const count = localInventory.filter(i => i.status === opt.label).length;
          return (
            <div key={opt.label} className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${opt.dot} shrink-0`} />
              <div>
                <p className="text-xl font-bold text-gray-900">{count}</p>
                <p className="text-xs text-gray-500 font-medium">{opt.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Showing {filteredSites.length} of {localInventory.length} sites
          </span>
          {isPending && (
            <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-gray-100">
              <tr>
                <th className="px-5 py-3.5 font-semibold text-xs text-gray-500 uppercase tracking-wider">Site Name</th>
                <th className="px-5 py-3.5 font-semibold text-xs text-gray-500 uppercase tracking-wider">City / Area</th>
                <th className="px-5 py-3.5 font-semibold text-xs text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-5 py-3.5 font-semibold text-xs text-gray-500 uppercase tracking-wider">Current Status</th>
                <th className="px-5 py-3.5 font-semibold text-xs text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredSites.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-gray-500">
                    <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    No sites found.
                  </td>
                </tr>
              ) : (
                filteredSites.map(item => (
                  <tr
                    key={item.uuid}
                    className={`hover:bg-gray-50 transition-colors ${updatingId === item.uuid ? "opacity-60" : ""}`}
                  >
                    <td className="px-5 py-4 font-semibold text-gray-900">{item.name}</td>
                    <td className="px-5 py-4 text-gray-500 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        {item.city}{item.area ? `, ${item.area}` : ""}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Tag className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        {item.type}{item.lit_type ? ` · ${item.lit_type}` : ""}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <StatusDropdown
                        uuid={item.uuid}
                        currentStatus={item.status}
                        isPending={isPending}
                        onUpdate={handleStatusChange}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
