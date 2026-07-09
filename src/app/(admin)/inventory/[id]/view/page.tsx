import { createClient } from "@/backend/db/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Tag, Info, Ruler, Zap, User, DollarSign, Image as ImageIcon } from "lucide-react";

export default async function ViewSiteDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  const isNumeric = /^\d+$/.test(params.id);
  let query = supabase.from("sites").select("*");
  if (isNumeric) {
    query = query.eq("id", parseInt(params.id));
  } else {
    query = query.eq("site_id", params.id);
  }
  
  const { data: site } = await query.single();

  if (!site) {
    notFound();
  }

  const renderSection = (title: string, icon: React.ReactNode, children: React.ReactNode) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 flex items-center mb-4">
        {icon}
        <span className="ml-2">{title}</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );

  const renderField = (label: string, value: any) => (
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-base text-gray-900 font-medium bg-gray-50 p-2.5 rounded-lg border border-gray-100">
        {value || <span className="text-gray-400 italic">Not specified</span>}
      </p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/inventory" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">{site.name}</h1>
            <p className="text-sm text-gray-500">Site ID: {site.site_id}</p>
          </div>
        </div>
        <div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
            site.status === 'Available' ? 'bg-emerald-100 text-emerald-800' :
            site.status === 'Booked' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {site.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* Basic Info */}
        {renderSection("Basic Information", <Info className="w-5 h-5 text-blue-500" />, (
          <>
            {renderField("Site Name", site.name)}
            {renderField("Type", site.type)}
            {renderField("Lit Type", site.lit_type)}
            {renderField("Is Metro?", site.is_metro ? "Yes" : "No")}
          </>
        ))}

        {/* Location Info */}
        {renderSection("Location Details", <MapPin className="w-5 h-5 text-red-500" />, (
          <>
            {renderField("City", site.city)}
            {renderField("Area / Region", site.area)}
            {renderField("Address", site.address)}
            {renderField("Coordinates", site.lat && site.lng ? `${site.lat}, ${site.lng}` : null)}
          </>
        ))}

        {/* Metrics */}
        {renderSection("Metrics & Dimensions", <Ruler className="w-5 h-5 text-amber-500" />, (
          <>
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
          </>
        ))}

        {/* Electricity */}
        {renderSection("Electricity", <Zap className="w-5 h-5 text-yellow-500" />, (
          <>
            {renderField("Consumer No.", site.electricity_consumer_no)}
            {renderField("Consumer Name", site.electricity_consumer_name)}
            {renderField("Bill Date", site.electricity_bill_date)}
            {renderField("Due Date", site.electricity_due_date)}
          </>
        ))}

        {/* Financials & Ownership */}
        {renderSection("Financials & Landlord", <DollarSign className="w-5 h-5 text-emerald-500" />, (
          <>
            {renderField("Landlord Name", site.landlord)}
            {renderField("Landlord Contact", site.landlord_contact)}
            {renderField("Rent Amount", site.rent ? `₹${site.rent}` : null)}
            {renderField("Net Rate", site.net_rate ? `₹${site.net_rate}` : null)}
            {renderField("DCPM Rate", site.dcpm_rate ? `₹${site.dcpm_rate}` : null)}
            {renderField("Agency Rate", site.agency_rate ? `₹${site.agency_rate}` : null)}
          </>
        ))}
      </div>
    </div>
  );
}
