import { createClient } from "@/backend/db/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Info, Ruler, Zap, DollarSign, Images } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ViewSiteDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  
  const isNumeric = /^\d+$/.test(resolvedParams.id);
  let query = supabase.from("sites").select("*");
  if (isNumeric) {
    query = query.eq("id", parseInt(resolvedParams.id));
  } else {
    query = query.eq("site_id", resolvedParams.id);
  }
  
  const { data: site } = await query.single();

  if (!site) {
    notFound();
  }

  const renderField = (label: string, value: any) => (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</p>
      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
        {value || <span className="text-gray-400 italic">Not specified</span>}
      </p>
    </div>
  );

  // Safe photo extraction
  let siteImages: string[] = [];
  if (Array.isArray(site.photos)) {
    siteImages = site.photos;
  } else if (typeof site.photos === 'string' && site.photos.trim()) {
    try {
      const parsed = JSON.parse(site.photos);
      siteImages = Array.isArray(parsed) ? parsed : [site.photos];
    } catch {
      siteImages = [site.photos];
    }
  } else if (Array.isArray(site.images)) {
    siteImages = site.images;
  } else if (typeof site.images === 'string' && site.images.trim()) {
    try {
      const parsed = JSON.parse(site.images);
      siteImages = Array.isArray(parsed) ? parsed : [site.images];
    } catch {
      siteImages = [site.images];
    }
  } else if (site.image_url) {
    siteImages = [site.image_url];
  }
  siteImages = siteImages.filter(Boolean);

  return (
    <div className="max-w-[900px] mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/inventory" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">{site.name}</h1>
            <p className="text-xs text-gray-500 font-mono mt-0.5">{site.site_id}</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold ${
          site.status === 'Available' ? 'bg-emerald-100 text-emerald-700' :
          site.status === 'Booked' ? 'bg-rose-100 text-rose-700' :
          'bg-amber-100 text-amber-700'
        }`}>
          {site.status}
        </span>
      </div>

      {/* Sections */}
      <div className="space-y-5">

        {/* Photos Gallery */}
        {siteImages.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-5">
              <Images className="w-4 h-4 text-purple-500" /> Site Photos
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {siteImages.map((url: string, i: number) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden border border-gray-200 aspect-video hover:opacity-90 transition-opacity">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Site photo ${i + 1}`} className="w-full h-full object-cover" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-5">
            <Info className="w-4 h-4 text-indigo-500" /> Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("Site Name", site.name)}
            {renderField("Type", site.type)}
            {renderField("Lit Type", site.lit_type)}
            {renderField("Is Metro?", site.is_metro ? "Yes" : "No")}
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-5">
            <MapPin className="w-4 h-4 text-rose-500" /> Location Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("City", site.city)}
            {renderField("Area / Region", site.area)}
            {renderField("Address", site.address)}
            {renderField("Coordinates", site.lat && site.lng ? `${site.lat}, ${site.lng}` : null)}
          </div>
        </div>

        {/* Metrics */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-5">
            <Ruler className="w-4 h-4 text-amber-500" /> Metrics &amp; Dimensions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("Size (WxH)", site.size)}
            {renderField("Quantity", site.qty)}
            {renderField("Total Sq Ft", site.total_sq_ft)}
            {renderField("Printable Size", site.printable_size)}
            {site.is_metro && (
              <>
                {renderField("Metro Line", site.metro_line)}
                {renderField("Metro Pillars", site.metro_pillars)}
                {renderField("No. of Pillars", site.no_of_pillars)}
                {renderField("No. of Displays", site.no_of_displays)}
              </>
            )}
          </div>
        </div>

        {/* Electricity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-5">
            <Zap className="w-4 h-4 text-yellow-500" /> Electricity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("Electricity Consumer No.", site.electricity_consumer_no)}
            {renderField("Consumer Name", site.electricity_consumer_name)}
            {renderField("Bill Date", site.electricity_bill_date)}
            {renderField("Due Date", site.electricity_due_date)}
          </div>
        </div>

        {/* Financials */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-5">
            <DollarSign className="w-4 h-4 text-emerald-500" /> Financials &amp; Landlord
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("Landlord Name", site.landlord)}
            {renderField("Landlord Contact", site.landlord_contact)}
            {renderField("Rent Amount", site.rent ? `₹${site.rent}` : null)}
            {renderField("Net Rate", site.net_rate ? `₹${site.net_rate}` : null)}
            {renderField("DCPM Rate", site.dcpm_rate ? `₹${site.dcpm_rate}` : null)}
            {renderField("Agency Rate", site.agency_rate ? `₹${site.agency_rate}` : null)}
            {renderField("Mounting Charges", site.mounting_charges ? `₹${site.mounting_charges}` : null)}
          </div>
        </div>
      </div>
    </div>
  );
}
