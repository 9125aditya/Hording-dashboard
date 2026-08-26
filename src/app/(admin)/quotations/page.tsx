import { createClient } from "@/backend/db/server";
import QuotationsClient from "./QuotationsClient";

export const dynamic = 'force-dynamic';

function getCityAbbreviation(city: string) {
  const c = (city || "Nagpur").trim().toUpperCase();
  if (c.startsWith("NAGPUR")) return "NGP";
  if (c.startsWith("MUMBAI")) return "MUM";
  if (c.startsWith("PUNE")) return "PUN";
  if (c.startsWith("DELHI")) return "DEL";
  if (c.startsWith("HYDERABAD")) return "HYD";
  if (c.startsWith("BANGALORE") || c.startsWith("BENGALURU")) return "BLR";
  if (c.startsWith("CHANDRAPUR")) return "CHP";
  if (c.startsWith("AMRAVATI")) return "AMR";
  if (c.startsWith("WARDHA")) return "WRD";
  if (c.startsWith("NASHIK")) return "NSK";
  if (c.startsWith("AURANGABAD") || c.startsWith("SAMBHAJINAGAR")) return "CSN";
  return c.slice(0, 3).toUpperCase();
}

function getMediaTypeAbbreviation(type: string) {
  const t = (type || "Hoarding").trim().toUpperCase();
  if (t.includes("GANTRY")) return "G";
  if (t.includes("UNIPOLE")) return "U";
  if (t.includes("KIOSK")) return "K";
  if (t.includes("METRO") || t.includes("PILLAR")) return "M";
  if (t.includes("SHELTER") || t.includes("BUS")) return "B";
  return "H"; // Hoarding default
}

export default async function QuotationsPage() {
  const supabase = await createClient();
  const { data: dbSites } = await supabase.from('sites').select('*').order('created_at', { ascending: true });

  const cityCounters: Record<string, number> = {};

  const sites = dbSites?.map((s: any, index: number) => {
    const cityCode = getCityAbbreviation(s.city);
    const mediaCode = getMediaTypeAbbreviation(s.type);
    const key = `${cityCode}/${mediaCode}`;
    cityCounters[key] = (cityCounters[key] || 0) + 1;
    const serialStr = String(cityCounters[key]).padStart(3, '0');
    const formattedCode = `${cityCode}/${mediaCode}/${serialStr}`;

    return {
      id: index + 1,
      uuid: s.site_id || String(index + 1),
      code: formattedCode, // e.g. NGP/H/001
      name: s.name || 'Unnamed Site',
      city: s.city || 'Nagpur',
      area: s.area || '',
      size: s.size || '30x15',
      type: s.type || 'Hoarding',
      lit_type: s.lit_type || 'Front Lit',
      status: s.status || 'Available',
      net_rate: s.net_rate || 50000,
      agency_rate: s.agency_rate || 0,
      dcpm_rate: s.dcpm_rate || 0,
      mounting_charges: s.mounting_charges || 0,
      images: s.photos || s.images || [],
      photo: s.photos?.[0] || s.images?.[0] || 'https://images.unsplash.com/photo-1533069027836-fa937181a8ce?w=800&q=80',
      maps_link: s.maps_link || '',
      remarks: s.remarks || s.address || ''
    };
  }) || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <QuotationsClient initialSites={sites} />
    </div>
  );
}
