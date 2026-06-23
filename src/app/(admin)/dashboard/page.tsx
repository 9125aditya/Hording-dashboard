export default function DashboardPage() {
  const cities = [
    { name: "Mumbai", total: 12, avail: 6, blocked: 2, booked: 4 },
    { name: "Pune", total: 6, avail: 3, blocked: 1, booked: 2 },
    { name: "Nagpur", total: 11, avail: 7, blocked: 2, booked: 2 },
    { name: "Delhi", total: 7, avail: 3, blocked: 2, booked: 2 },
  ];

  const totalSites = cities.reduce((sum, c) => sum + c.total, 0);
  const totalAvail = cities.reduce((sum, c) => sum + c.avail, 0);
  const totalBlocked = cities.reduce((sum, c) => sum + c.blocked, 0);
  const totalBooked = cities.reduce((sum, c) => sum + c.booked, 0);
  const occupancy = Math.round((totalBooked / totalSites) * 100);

  const mediaTypes = [
    { name: "Hoarding", icon: "🔲", cities: ["Mumbai", "Pune", "Nagpur", "Delhi"], avail: 13, blocked: 5, booked: 8 },
    { name: "LED Board", icon: "💠", cities: ["Mumbai"], avail: 2, blocked: 1, booked: 1 },
    { name: "Metro Pillar", icon: "🟪", cities: ["Nagpur"], avail: 4, blocked: 1, booked: 1 },
  ];

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
