/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/backend/db/server";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: dbSites } = await supabase.from('sites').select('*');
  const sites = dbSites || [];

  // Calculate cities breakdown
  const cityMap: Record<string, { total: number, avail: number, blocked: number, booked: number }> = {};
  
  // Calculate media types breakdown
  const mediaMap: Record<string, { total: number, avail: number, blocked: number, booked: number, cities: Set<string> }> = {};

  // Helper for title casing
  const toTitleCase = (str: string) => {
    return str
      .trim()
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  sites.forEach((site: any) => {
    const city = site.city ? toTitleCase(site.city) : 'Unknown';
    
    // City Aggregation
    if (!cityMap[city]) cityMap[city] = { total: 0, avail: 0, blocked: 0, booked: 0 };
    cityMap[city].total += 1;
    if (site.status === 'Available') cityMap[city].avail += 1;
    else if (site.status === 'Blocked') cityMap[city].blocked += 1;
    else if (site.status === 'Booked') cityMap[city].booked += 1;

    // Media Type Aggregation
    const mType = site.type ? toTitleCase(site.type) : 'Other';
    if (!mediaMap[mType]) mediaMap[mType] = { total: 0, avail: 0, blocked: 0, booked: 0, cities: new Set() };
    mediaMap[mType].total += 1;
    mediaMap[mType].cities.add(city);
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
    <div className="space-y-8 max-w-[1100px]">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Key performance metrics and inventory summary</p>
      </div>

      {/* KPI Row */}
      <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <Link href="/inventory"><KpiCard label="NO. OF BOARDS" value={totalSites} sub={`${cities.length} cities`} accent="indigo" /></Link>
        <Link href="/inventory"><KpiCard label="AVAILABLE" value={totalAvail} sub={totalSites > 0 ? `${Math.round((totalAvail / totalSites) * 100)}%` : '0%'} accent="emerald" /></Link>
        <Link href="/inventory"><KpiCard label="BLOCKED" value={totalBlocked} sub="Soft holds" accent="amber" /></Link>
        <Link href="/inventory"><KpiCard label="BOOKED" value={totalBooked} sub="Confirmed" accent="rose" /></Link>
        <KpiCard label="OCCUPANCY" value={`${occupancy}%`} sub="Booked / Total" accent="violet" />
      </div>

      {/* Status Distribution - Horizontal Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Status Distribution</h2>
        <div className="flex rounded-full overflow-hidden h-3 bg-gray-100">
          {totalAvail > 0 && <div className="bg-emerald-500 transition-all" style={{ width: `${(totalAvail/totalSites)*100}%` }} />}
          {totalBooked > 0 && <div className="bg-indigo-500 transition-all" style={{ width: `${(totalBooked/totalSites)*100}%` }} />}
          {totalBlocked > 0 && <div className="bg-amber-400 transition-all" style={{ width: `${(totalBlocked/totalSites)*100}%` }} />}
        </div>
        <div className="flex gap-6 mt-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Available: {totalAvail}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Booked: {totalBooked}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Blocked: {totalBlocked}
          </div>
        </div>
      </div>

      {/* Cities Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Cities</h2>
        </div>
        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-50">
          {cities.map((city) => (
            <div key={city.name} className="px-4 py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">{city.name}</p>
                <div className="flex h-2 rounded-full overflow-hidden bg-gray-100 w-full mt-1.5">
                  {city.avail > 0 && <div className="bg-emerald-500" style={{ width: `${(city.avail/city.total)*100}%` }} />}
                  {city.booked > 0 && <div className="bg-indigo-500" style={{ width: `${(city.booked/city.total)*100}%` }} />}
                  {city.blocked > 0 && <div className="bg-amber-400" style={{ width: `${(city.blocked/city.total)*100}%` }} />}
                </div>
              </div>
              <span className="text-sm font-bold text-gray-700 shrink-0">{city.total}</span>
            </div>
          ))}
        </div>
        {/* Desktop table */}
        <table className="w-full text-sm hidden md:table">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">City</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Sites</th>
              <th className="px-6 py-3 w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {cities.map((city) => (
              <tr key={city.name} className="hover:bg-indigo-50/40 transition-colors cursor-pointer group">
                <td className="px-6 py-4 font-medium text-gray-900">
                  <Link href="/inventory" className="hover:text-indigo-600 transition-colors">{city.name}</Link>
                </td>
                <td className="px-6 py-4">
                  <div className="flex h-2.5 rounded-full overflow-hidden bg-gray-100 w-40">
                    {city.avail > 0 && <div className="bg-emerald-500 transition-all duration-500" style={{ width: `${(city.avail/city.total)*100}%` }} />}
                    {city.booked > 0 && <div className="bg-indigo-500 transition-all duration-500" style={{ width: `${(city.booked/city.total)*100}%` }} />}
                    {city.blocked > 0 && <div className="bg-amber-400 transition-all duration-500" style={{ width: `${(city.blocked/city.total)*100}%` }} />}
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-semibold text-gray-700">{city.total}</td>
                <td className="px-6 py-4 text-gray-400 group-hover:text-indigo-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Media Types */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Media Types</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {mediaTypes.map((mt) => (
            <Link key={mt.name} href="/inventory" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-indigo-300 hover:shadow-sm transition-all block">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-[15px] font-semibold text-gray-900">{mt.name}</h3>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {mt.cities.map((c) => (
                      <span key={c} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">{c}</span>
                    ))}
                  </div>
                </div>
                <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">{mt.total}</span>
              </div>
              <div className="flex items-center gap-5 mt-4 pt-3 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-lg font-bold text-emerald-600">{mt.avail}</div>
                  <div className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Avail</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-amber-500">{mt.blocked}</div>
                  <div className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Blocked</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-rose-500">{mt.booked}</div>
                  <div className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Booked</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, accent }: { label: string; value: string | number; sub: string; accent: string }) {
  const colorMap: Record<string, { text: string; bg: string; line: string }> = {
    indigo: { text: 'text-indigo-700', bg: 'bg-indigo-50', line: 'bg-indigo-500' },
    emerald: { text: 'text-emerald-700', bg: 'bg-emerald-50', line: 'bg-emerald-500' },
    amber: { text: 'text-amber-700', bg: 'bg-amber-50', line: 'bg-amber-500' },
    rose: { text: 'text-rose-700', bg: 'bg-rose-50', line: 'bg-rose-500' },
    violet: { text: 'text-violet-700', bg: 'bg-violet-50', line: 'bg-violet-500' },
  };
  const c = colorMap[accent] || colorMap.indigo;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-1 ${c.line}`} />
      <p className="text-[11px] text-gray-500 uppercase font-semibold tracking-wider">{label}</p>
      <p className={`text-3xl font-bold mt-1.5 ${c.text}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  );
}
