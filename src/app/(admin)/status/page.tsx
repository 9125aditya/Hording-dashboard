import { createClient } from "@/backend/db/server";
import StatusClient from "./StatusClient";
import { getAllSiteBookings, getStaffList } from "@/backend/actions/booking-actions";

export const dynamic = 'force-dynamic';

export default async function StatusPage() {
  const supabase = await createClient();

  const [{ data: { user } }, { data: dbSites, error }, { bookingsBySite, activeCountBySite }, staffList] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from('sites').select('*').order('name', { ascending: true }),
    getAllSiteBookings(),
    getStaffList(),
  ]);

  if (error) {
    console.error("StatusPage fetch error:", error.message);
  }

  const inventory = (dbSites ?? []).map((s: any) => {
    const uuid = s.site_id || String(s.id);
    const bookings = bookingsBySite[uuid] || bookingsBySite[String(s.id)] || [];
    const activeCount = activeCountBySite[uuid] || activeCountBySite[String(s.id)] || 0;

    let computedStatus = s.status || 'Available';
    // If active bookings reach 3, site is Booked
    if (activeCount >= 3) {
      computedStatus = 'Booked';
    }

    return {
      id: s.id,
      uuid: uuid,
      useSiteId: !!s.site_id,
      name: s.name || 'Unnamed Site',
      city: s.city || '',
      area: s.area || '',
      type: s.type || '',
      lit_type: s.lit_type || '',
      status: computedStatus,
      statusColor:
        computedStatus === 'Available' ? 'bg-emerald-100 text-emerald-700'
        : computedStatus === 'Booked'  ? 'bg-rose-100 text-rose-700'
        : computedStatus === 'Blocked' ? 'bg-amber-100 text-amber-700'
        : 'bg-gray-100 text-gray-700',
      activeBookingsCount: activeCount,
      bookings: bookings,
    };
  });

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Site Status &amp; Bookings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage live hoarding availability, 3-slot simultaneous bookings, and 5-day auto-released holds.
        </p>
      </div>
      <StatusClient
        initialInventory={inventory}
        staffList={staffList}
        currentUserId={user?.id}
        currentUserName={user?.user_metadata?.name || user?.email}
      />
    </div>
  );
}
