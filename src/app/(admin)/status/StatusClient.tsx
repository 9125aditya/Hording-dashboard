"use client";

import { useState, useTransition, useMemo, useRef, useEffect } from "react";
import {
  Search,
  X,
  Loader2,
  MapPin,
  Tag,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Plus,
  Clock,
  User,
  Mail,
  Calendar,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Send,
} from "lucide-react";
import { updateSiteStatus } from "@/backend/actions/actions";
import {
  SiteBooking,
  StaffOption,
  extendSiteBooking,
  releaseSiteBooking,
} from "@/backend/actions/booking-actions";
import SiteBookingModal from "./SiteBookingModal";
import { useRouter } from "next/navigation";

export type SiteItem = {
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
  activeBookingsCount: number;
  bookings: SiteBooking[];
};

const STATUS_OPTIONS = [
  { label: "Available", color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200", dot: "bg-emerald-500" },
  { label: "Booked",    color: "bg-rose-100 text-rose-700 hover:bg-rose-200",          dot: "bg-rose-500" },
  { label: "Blocked",   color: "bg-amber-100 text-amber-700 hover:bg-amber-200",        dot: "bg-amber-500" },
];

function BookingSlotsBadge({ activeCount, status }: { activeCount: number; status: string }) {
  if (status === "Blocked" || (activeCount > 0 && activeCount < 3 && status !== "Booked")) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        {activeCount > 0 ? `Blocked (${activeCount}/3 Hold)` : "Blocked"}
      </span>
    );
  }

  if (activeCount >= 3 || status === "Booked") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
        Booked (3/3 Full)
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      Available
    </span>
  );
}

function ExpiryBadge({ expiresAt, status }: { expiresAt: string; status: string }) {
  if (status === "CONFIRMED") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Confirmed
      </span>
    );
  }

  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffMs = expiry.getTime() - now.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs <= 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
        <AlertCircle className="w-3 h-3 text-rose-600" /> Hold Expired
      </span>
    );
  }

  if (diffDays <= 1) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
        <Clock className="w-3 h-3 text-amber-600 animate-pulse" /> Expires in {Math.max(1, diffHours)}h
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
      <Clock className="w-3 h-3 text-indigo-600" /> Expires in {diffDays}d
    </span>
  );
}

export default function StatusClient({
  initialInventory,
  staffList,
  currentUserId,
  currentUserName,
}: {
  initialInventory: SiteItem[];
  staffList: StaffOption[];
  currentUserId?: string;
  currentUserName?: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedSlotFilter, setSelectedSlotFilter] = useState<"All" | "Available" | "Partial" | "Full" | "Blocked">("All");
  const [sortBy, setSortBy] = useState<"city_asc" | "city_desc" | "name_asc" | "slots_desc" | "status">("slots_desc");
  const [expandedSiteId, setExpandedSiteId] = useState<string | null>(null);
  const [localInventory, setLocalInventory] = useState<SiteItem[]>(initialInventory);
  
  // Modal State
  const [bookingModalSite, setBookingModalSite] = useState<SiteItem | null>(null);
  
  // Action Pending States
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setLocalInventory(initialInventory);
  }, [initialInventory]);

  // Extract unique cities
  const citiesList = useMemo(() => {
    const cities = Array.from(new Set(localInventory.map(i => i.city).filter(Boolean)));
    return ["All", ...cities.sort()];
  }, [localInventory]);

  // Summary Metrics
  const totalSites = localInventory.length;
  const availableCount = localInventory.filter(i => i.activeBookingsCount === 0 && i.status === "Available").length;
  const blockedCount = localInventory.filter(i => i.status === "Blocked" || (i.activeBookingsCount > 0 && i.activeBookingsCount < 3 && i.status !== "Booked")).length;
  const fullyBookedCount = localInventory.filter(i => i.activeBookingsCount >= 3 || i.status === "Booked").length;
  const totalActiveHolds = localInventory.reduce((acc, i) => acc + i.activeBookingsCount, 0);

  const filteredSites = useMemo(() => {
    let result = [...localInventory];

    // Filter by city
    if (selectedCity !== "All") {
      result = result.filter(item => item.city?.toLowerCase() === selectedCity.toLowerCase());
    }

    // Filter by slot state
    if (selectedSlotFilter === "Available") {
      result = result.filter(item => item.activeBookingsCount === 0 && item.status === "Available");
    } else if (selectedSlotFilter === "Blocked" || selectedSlotFilter === "Partial") {
      result = result.filter(item => item.status === "Blocked" || (item.activeBookingsCount > 0 && item.activeBookingsCount < 3 && item.status !== "Booked"));
    } else if (selectedSlotFilter === "Full") {
      result = result.filter(item => item.activeBookingsCount >= 3 || item.status === "Booked");
    }

    // Filter by search
    if (search.trim()) {
      const lower = search.toLowerCase();
      result = result.filter(item =>
        item.name?.toLowerCase().includes(lower) ||
        item.city?.toLowerCase().includes(lower) ||
        item.area?.toLowerCase().includes(lower) ||
        item.bookings?.some(b => b.client_name?.toLowerCase().includes(lower) || b.client_email?.toLowerCase().includes(lower))
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "slots_desc") {
        return b.activeBookingsCount - a.activeBookingsCount;
      }
      if (sortBy === "city_asc") {
        const cityCompare = (a.city || "").localeCompare(b.city || "");
        return cityCompare !== 0 ? cityCompare : (a.name || "").localeCompare(b.name || "");
      }
      if (sortBy === "city_desc") {
        const cityCompare = (b.city || "").localeCompare(a.city || "");
        return cityCompare !== 0 ? cityCompare : (a.name || "").localeCompare(b.name || "");
      }
      if (sortBy === "name_asc") {
        return (a.name || "").localeCompare(b.name || "");
      }
      if (sortBy === "status") {
        return (a.status || "").localeCompare(b.status || "");
      }
      return 0;
    });

    return result;
  }, [localInventory, search, selectedCity, selectedSlotFilter, sortBy]);

  // Handle direct status change (e.g. Blocked / Available)
  const handleStatusChange = (uuid: string, status: string) => {
    setUpdatingId(uuid);
    startTransition(async () => {
      try {
        const res = await updateSiteStatus(uuid, status);
        if (res && res.error) {
          alert(res.error);
        } else {
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
        }
      } catch (err: any) {
        alert(err.message || "An unexpected error occurred");
      } finally {
        setUpdatingId(null);
      }
    });
  };

  // Handle extend booking by 5 days
  const handleExtendBooking = async (bookingId: string, siteUuid: string) => {
    setActionLoadingId(bookingId);
    try {
      const res = await extendSiteBooking(bookingId, 5);
      if (res.success && res.newExpiresAt) {
        setLocalInventory(prev =>
          prev.map(site => {
            if (site.uuid !== siteUuid) return site;
            const updatedBookings = site.bookings.map(b => {
              if (b.id === bookingId) {
                return {
                  ...b,
                  expires_at: res.newExpiresAt!,
                  extended_count: (b.extended_count || 0) + 1,
                  status: "ACTIVE" as const,
                  is_expired: false,
                };
              }
              return b;
            });
            return {
              ...site,
              bookings: updatedBookings,
            };
          })
        );
      } else {
        alert(res.error || "Failed to extend booking.");
      }
    } catch (err: any) {
      alert(err.message || "Error extending booking.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle release booking
  const handleReleaseBooking = async (bookingId: string, siteUuid: string) => {
    if (!confirm("Are you sure you want to unbook/release this reservation hold?")) return;
    setActionLoadingId(bookingId);
    try {
      const res = await releaseSiteBooking(bookingId);
      if (res.success) {
        setLocalInventory(prev =>
          prev.map(site => {
            if (site.uuid !== siteUuid) return site;
            const remainingBookings = site.bookings.filter(b => b.id !== bookingId);
            const newCount = Math.max(0, site.activeBookingsCount - 1);
            return {
              ...site,
              activeBookingsCount: newCount,
              bookings: remainingBookings,
              status: newCount < 3 && site.status === "Booked" ? "Available" : site.status,
            };
          })
        );
      } else {
        alert(res.error || "Failed to release booking.");
      }
    } catch (err: any) {
      alert(err.message || "Error releasing booking.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const toggleExpand = (siteId: string) => {
    setExpandedSiteId(prev => (prev === siteId ? null : siteId));
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setSelectedSlotFilter("All")}
          className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-md ${
            selectedSlotFilter === "All" ? "border-indigo-600 ring-2 ring-indigo-500/20" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold mb-1">
            <span>Total Sites</span>
            <Tag className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalSites}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{totalActiveHolds} active booking holds</p>
        </div>

        <div
          onClick={() => setSelectedSlotFilter("Available")}
          className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-md ${
            selectedSlotFilter === "Available" ? "border-emerald-600 ring-2 ring-emerald-500/20" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between text-emerald-700 text-xs font-semibold mb-1">
            <span>Fully Available</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-700">{availableCount}</p>
          <p className="text-[11px] text-emerald-600/80 mt-0.5">0 of 3 slots booked</p>
        </div>

        <div
          onClick={() => setSelectedSlotFilter("Blocked")}
          className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-md ${
            selectedSlotFilter === "Blocked" ? "border-amber-600 ring-2 ring-amber-500/20" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between text-amber-700 text-xs font-semibold mb-1">
            <span>Blocked</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-700">{blockedCount}</p>
          <p className="text-[11px] text-amber-600/80 mt-0.5">Reserved / On-hold</p>
        </div>

        <div
          onClick={() => setSelectedSlotFilter("Full")}
          className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-md ${
            selectedSlotFilter === "Full" ? "border-rose-600 ring-2 ring-rose-500/20" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between text-rose-700 text-xs font-semibold mb-1">
            <span>Fully Booked</span>
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          </div>
          <p className="text-2xl font-bold text-rose-700">{fullyBookedCount}</p>
          <p className="text-[11px] text-rose-600/80 mt-0.5">3/3 slots occupied</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by site name, city, client name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* City Filter */}
        <div className="relative shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <MapPin className="h-4 w-4 text-indigo-600" />
          </div>
          <select
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
            className="h-11 pl-9 pr-8 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none cursor-pointer"
          >
            {citiesList.map(city => (
              <option key={city} value={city}>
                {city === "All" ? "All Cities" : city}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-3.5 pointer-events-none" />
        </div>

        {/* Sort Filter */}
        <div className="relative shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <ArrowUpDown className="h-4 w-4 text-indigo-600" />
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="h-11 pl-9 pr-8 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none cursor-pointer"
          >
            <option value="slots_desc">Sort: Most Bookings First</option>
            <option value="city_asc">Sort: City (A-Z)</option>
            <option value="city_desc">Sort: City (Z-A)</option>
            <option value="name_asc">Sort: Site Name (A-Z)</option>
            <option value="status">Sort: Status</option>
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-3.5 pointer-events-none" />
        </div>
      </div>

      {/* Quick Status Notice Bar */}
      <div className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-600">
          Showing {filteredSites.length} of {localInventory.length} sites
        </span>
        {isPending && (
          <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving changes...
          </div>
        )}
      </div>

      {/* Sites List Container */}
      <div className="space-y-3">
        {filteredSites.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-xs">
            <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-600 font-semibold">No hoarding sites match your filters.</p>
            <p className="text-xs text-gray-400 mt-1">Try clearing your search query or city selection.</p>
          </div>
        ) : (
          filteredSites.map(site => {
            const isExpanded = expandedSiteId === site.uuid;
            const activeBookings = site.bookings?.filter(b => b.status === "ACTIVE" || b.status === "CONFIRMED") || [];
            const isSiteBooked = site.status === "Booked" || site.activeBookingsCount >= 3;
            const canBookMore = site.activeBookingsCount < 3 && site.status !== "Booked";

            return (
              <div
                key={site.uuid}
                className={`bg-white rounded-2xl border border-gray-200 shadow-xs transition-all overflow-hidden ${
                  isExpanded ? "ring-2 ring-indigo-500/20 border-indigo-200" : "hover:border-gray-300"
                } ${updatingId === site.uuid ? "opacity-60" : ""}`}
              >
                {/* Main Site Header Row */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-bold text-gray-900 text-base leading-snug">{site.name}</h3>
                      <BookingSlotsBadge activeCount={site.activeBookingsCount} status={site.status} />
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 mt-2 text-xs text-gray-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        {site.city}{site.area ? `, ${site.area}` : ""}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        {site.type || "Billboard"} · {site.lit_type || "Front Lit"}
                      </span>
                      {site.activeBookingsCount > 0 && (
                        <button
                          onClick={() => toggleExpand(site.uuid)}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {site.activeBookingsCount} Active {site.activeBookingsCount === 1 ? "Hold" : "Holds"}
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Actions & Buttons */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {/* Book Site Button */}
                    <button
                      disabled={!canBookMore}
                      onClick={() => setBookingModalSite(site)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        canBookMore
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs hover:shadow"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {isSiteBooked ? "Fully Booked" : `Book Slot (${site.activeBookingsCount}/3)`}
                    </button>

                    {/* Direct Status Override Toggle */}
                    <select
                      value={site.status}
                      disabled={isPending && updatingId === site.uuid}
                      onChange={e => handleStatusChange(site.uuid, e.target.value)}
                      className="h-9 px-3 text-xs font-semibold rounded-xl border border-gray-200 bg-white text-gray-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="Available">Set: Available</option>
                      <option value="Booked">Set: Booked</option>
                      <option value="Blocked">Set: Blocked</option>
                    </select>

                    {site.bookings && site.bookings.length > 0 && (
                      <button
                        onClick={() => toggleExpand(site.uuid)}
                        className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
                        title={isExpanded ? "Hide bookings" : "View bookings"}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expandable Active Bookings List */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-slate-50/70 p-4 sm:p-5 space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                        Active Simultaneous Bookings ({site.activeBookingsCount} of 3)
                      </h4>
                      <span className="text-[11px] text-gray-500">
                        Holds auto-release after 5 days unless extended
                      </span>
                    </div>

                    {activeBookings.length === 0 ? (
                      <div className="bg-white rounded-xl border border-gray-200 p-4 text-center text-xs text-gray-500">
                        No active booking holds for this site currently.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {activeBookings.map((booking, idx) => {
                          const isActionLoading = actionLoadingId === booking.id;

                          return (
                            <div
                              key={booking.id || idx}
                              className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 shadow-2xs hover:border-indigo-200 transition-all flex flex-col justify-between"
                            >
                              <div className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0 flex-1">
                                    <p className="font-bold text-sm text-gray-900 truncate">
                                      {booking.client_name}
                                    </p>
                                    {booking.client_email && (
                                      <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-0.5">
                                        <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                                        {booking.client_email}
                                      </p>
                                    )}
                                  </div>
                                  <ExpiryBadge expiresAt={booking.expires_at} status={booking.status} />
                                </div>

                                {booking.booking_period && (
                                  <div className="flex items-center gap-1.5 text-xs text-indigo-900 bg-indigo-50/70 px-2.5 py-1 rounded-md">
                                    <Calendar className="w-3 h-3 text-indigo-600 shrink-0" />
                                    <span className="font-medium truncate">{booking.booking_period}</span>
                                  </div>
                                )}

                                <div className="text-[11px] text-gray-500 space-y-0.5 pt-1 border-t border-gray-100">
                                  <p className="truncate">
                                    <span className="text-gray-400">Staff:</span> {booking.booked_by_staff_name}
                                  </p>
                                  {booking.status === "CONFIRMED" ? (
                                    <p className="text-emerald-700 font-semibold truncate">
                                      Active Campaign: Confirmed Schedule
                                    </p>
                                  ) : (
                                    <p className="text-amber-700 font-medium truncate">
                                      5-Day Hold Until: {new Date(booking.expires_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                  )}
                                  {booking.extended_count > 0 && (
                                    <p className="text-purple-600 font-semibold">
                                      Extended {booking.extended_count} {booking.extended_count === 1 ? "time" : "times"}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                                {booking.status !== "CONFIRMED" ? (
                                  <button
                                    disabled={isActionLoading}
                                    onClick={() => handleExtendBooking(booking.id, site.uuid)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer disabled:opacity-50"
                                    title="Extend hold duration by +5 days"
                                  >
                                    {isActionLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                                    Extend (+5d)
                                  </button>
                                ) : (
                                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Booked
                                  </span>
                                )}

                                <button
                                  disabled={isActionLoading}
                                  onClick={() => handleReleaseBooking(booking.id, site.uuid)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer disabled:opacity-50 ml-auto"
                                  title="Release this booking hold immediately"
                                >
                                  Release Slot
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Booking Modal */}
      {bookingModalSite && (
        <SiteBookingModal
          isOpen={!!bookingModalSite}
          onClose={() => setBookingModalSite(null)}
          site={bookingModalSite}
          staffList={staffList}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          onBookingSuccess={() => {
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
