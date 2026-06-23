import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: dbSites } = await supabase.from('sites').select('*');
  const sites = dbSites || [];

  // Calculate cities breakdown
  const cityMap: Record<string, { total: number, avail: number, blocked: number, booked: number }> = {};
  
  // Calculate media types breakdown
  const mediaMap: Record<string, { total: number, avail: number, blocked: number, booked: number, cities: Set<string> }> = {};

  sites.forEach((site: any) => {
    // City Aggregation
    if (!cityMap[site.city]) cityMap[site.city] = { total: 0, avail: 0, blocked: 0, booked: 0 };
    cityMap[site.city].total += 1;
    if (site.status === 'Available') cityMap[site.city].avail += 1;
    else if (site.status === 'Blocked') cityMap[site.city].blocked += 1;
    else if (site.status === 'Booked') cityMap[site.city].booked += 1;

    // Media Type Aggregation
    const mType = site.type || 'Other';
    if (!mediaMap[mType]) mediaMap[mType] = { total: 0, avail: 0, blocked: 0, booked: 0, cities: new Set() };
    mediaMap[mType].total += 1;
    mediaMap[mType].cities.add(site.city);
    if (site.status === 'Available') mediaMap[mType].avail += 1;
    else if (site.status === 'Blocked') mediaMap[mType].blocked += 1;
    else if (site.status === 'Booked') mediaMap[mType].booked += 1;
  });

  const cities = Object.keys(cityMap).map(name => ({
    name,
    ...cityMap[name]
  })).sort((a, b) => b.total - a.total);

  const mediaTypes = Object.keys(mediaMap).map(name => {
    const { cities: mediaCities, ...rest } = mediaMap[name];
    return {
      name,
      icon: name.includes('Digital') ? "💠" : name.includes('Kiosk') ? "🟪" : "🔲",
      cities: Array.from(mediaCities),
      ...rest
    };
  }).sort((a, b) => b.total - a.total);

  const totalSites = sites.length;
  const totalAvail = sites.filter((s: any) => s.status === 'Available').length;
  const totalBlocked = sites.filter((s: any) => s.status === 'Blocked').length;
  const totalBooked = sites.filter((s: any) => s.status === 'Booked').length;
  const occupancy = totalSites > 0 ? Math.round((totalBooked / totalSites) * 100) : 0;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* KPI Row */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <KpiCard label="TOTAL SITES" value={totalSites} sub={`${cities.length} cities`} color="#0f172a" />
        <KpiCard label="AVAILABLE" value={totalAvail} sub={`${Math.round((totalAvail / totalSites) * 100)}%`} color="#10b981" />
        <KpiCard label="BLOCKED" value={totalBlocked} sub="Soft holds" color="#f59e0b" />
        <KpiCard label="BOOKED" value={totalBooked} sub="Confirmed" color="#ef4444" />
        <KpiCard label="OCCUPANCY" value={`${occupancy}%`} sub="Booked / Total" color="#7c3aed" />
      </div>

      {/* City Breakdown */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">City Breakdown</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {cities.map((city) => (
            <div key={city.name} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">{city.name}</h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{city.total}</span>
              </div>
              <div className="space-y-3">
                <BarRow label="Avail" value={city.avail} max={city.total} color="#10b981" />
                <BarRow label="Blocked" value={city.blocked} max={city.total} color="#f59e0b" />
                <BarRow label="Booked" value={city.booked} max={city.total} color="#ef4444" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Media Types */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Media Types</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {mediaTypes.map((mt) => (
            <div key={mt.name} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900">{mt.name}</h3>
                  <div className="flex gap-1.5 mt-1.5">
                    {mt.cities.map((c) => (
                      <span key={c} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{c}</span>
                    ))}
                  </div>
                </div>
                <span className="text-2xl">{mt.icon}</span>
              </div>
              <div className="flex items-center gap-6 mt-4 pt-3 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-lg font-bold text-emerald-600">{mt.avail}</div>
                  <div className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Avail</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-amber-500">{mt.blocked}</div>
                  <div className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Blocked</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-500">{mt.booked}</div>
                  <div className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Booked</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, color }: { label: string; value: string | number; sub: string; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <p className="text-[11px] text-gray-500 uppercase font-semibold tracking-wider">{label}</p>
      <p className="text-3xl font-bold mt-1" style={{ color }}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  );
}

function BarRow({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-14">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-5 text-right">{value}</span>
    </div>
  );
}
