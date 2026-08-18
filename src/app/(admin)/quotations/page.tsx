import { createClient } from "@/backend/db/server";
import QuotationsClient from "./QuotationsClient";

export const dynamic = 'force-dynamic';

export default async function QuotationsPage() {
  const supabase = await createClient();
  const { data: dbSites } = await supabase.from('sites').select('*').order('created_at', { ascending: false });

  const sites = dbSites?.map((s: any) => ({
    id: s.id,
    uuid: s.site_id || String(s.id),
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
    images: s.photos || s.images || [],
    photo: s.photos?.[0] || s.images?.[0] || 'https://images.unsplash.com/photo-1533069027836-fa937181a8ce?w=800&q=80',
    maps_link: s.maps_link || '',
    remarks: s.remarks || s.address || ''
  })) || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <QuotationsClient initialSites={sites} />
    </div>
  );
}
