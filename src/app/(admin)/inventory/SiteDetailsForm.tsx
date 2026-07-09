"use client";

import { useState } from "react";
import { saveSiteDetails } from "@/backend/actions/actions";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save, MapPin, Building2, FileText, IndianRupee, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function SiteDetailsForm({ site = null }: { site?: any }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await saveSiteDetails(site?.id ? String(site.id) : null, formData);

    if (res.error) {
      setError(res.error);
      setIsPending(false);
    } else {
      router.push("/admin/inventory");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/inventory" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{site ? 'Edit Site Details' : 'Add New Site'}</h1>
          <p className="text-sm text-muted-foreground">Complete the form below to update inventory records.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: BASIC INFO */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b pb-3">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Basic Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Site Name / Code *</label>
              <input required name="name" defaultValue={site?.name} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Shankar Nagar Sq." />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select name="status" defaultValue={site?.status || 'Available'} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Media Type *</label>
              <input required name="type" defaultValue={site?.type || 'Billboard'} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Billboard, Gantry" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Variant (Lit Type)</label>
              <input name="lit_type" defaultValue={site?.lit_type} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Front Lit, Back Lit, Non-Lit" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Size (W x H) *</label>
              <input required name="size" defaultValue={site?.size} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 40x20" />
            </div>
          </div>
        </div>

        {/* SECTION 2: LOCATION */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b pb-3">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Location Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">City *</label>
              <input required name="city" defaultValue={site?.city} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Area / Region</label>
              <input name="area" defaultValue={site?.area} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Full Address</label>
              <textarea name="address" defaultValue={site?.address} className="w-full min-h-[80px] p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Complete physical address..." />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Google Maps Link</label>
              <input name="maps_link" defaultValue={site?.maps_link} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://maps.google.com/..." />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Latitude</label>
              <input type="number" step="any" name="lat" defaultValue={site?.lat} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="21.1458" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Longitude</label>
              <input type="number" step="any" name="lng" defaultValue={site?.lng} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="79.0882" />
            </div>
          </div>
        </div>

        {/* SECTION 3: COMMERCIALS & LANDLORD */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b pb-3">
            <IndianRupee className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Commercials & Landlord</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Net Rate</label>
              <input type="number" name="net_rate" defaultValue={site?.net_rate} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">DCPM Rate</label>
              <input type="number" name="dcpm_rate" defaultValue={site?.dcpm_rate} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Agency Rate</label>
              <input type="number" name="agency_rate" defaultValue={site?.agency_rate} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Landlord Name</label>
              <input name="landlord" defaultValue={site?.landlord} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Landlord Contact</label>
              <input name="landlord_contact" defaultValue={site?.landlord_contact} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Rent Amount</label>
              <input type="number" name="rent" defaultValue={site?.rent} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        </div>

        {/* SECTION 4: ELECTRICITY */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b pb-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Electricity Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Consumer Number</label>
              <input name="electricity_consumer_no" defaultValue={site?.electricity_consumer_no} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Consumer Name</label>
              <input name="electricity_consumer_name" defaultValue={site?.electricity_consumer_name} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Bill Date</label>
              <input name="electricity_bill_date" defaultValue={site?.electricity_bill_date} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 5th of every month" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Due Date</label>
              <input name="electricity_due_date" defaultValue={site?.electricity_due_date} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 15th of every month" />
            </div>
          </div>
        </div>

        {/* SECTION 5: RATIONALE */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b pb-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Rationale / Advertising Value</h2>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Audience profile, traffic count, facing direction, visibility...</label>
            <textarea name="rationale" defaultValue={site?.rationale} className="w-full min-h-[120px] p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Describe the commercial advantages of this site..." />
          </div>
        </div>

        {/* SECTION 6: PHOTOS */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b pb-3">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Photos</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Day (Long) Image URL</label>
              <input name="day_long_photo" defaultValue={site?.day_long_photo} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Day (Mid) Image URL</label>
              <input name="day_mid_photo" defaultValue={site?.day_mid_photo} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Night (Mid) Image URL</label>
              <input name="night_mid_photo" defaultValue={site?.night_mid_photo} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            disabled={isPending}
            className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Site Details
          </button>
        </div>
      </form>
    </div>
  );
}
