"use client";

import { useState } from "react";
import { saveSiteDetails } from "@/backend/actions/actions";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save, MapPin, Building2, FileText, IndianRupee, Image as ImageIcon, Train, X } from "lucide-react";
import Link from "next/link";
import LocationSearch from "@/frontend/components/LocationSearch";

export default function SiteDetailsForm({ site = null }: { site?: any }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [isMetro, setIsMetro] = useState(site?.is_metro || false);
  
  // Image handling state
  const [existingImages, setExistingImages] = useState<string[]>(
    site?.images || []
  );
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Check total limit
    if (existingImages.length + newFiles.length + files.length > 5) {
      setError("You can only upload a maximum of 5 images in total.");
      return;
    }

    // Check size limit (2MB)
    const MAX_SIZE = 2 * 1024 * 1024;
    for (const file of files) {
      if (file.size > MAX_SIZE) {
        setError(`Image ${file.name} exceeds the 2MB size limit.`);
        return;
      }
    }

    setError("");
    setNewFiles(prev => [...prev, ...files]);
    
    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      // Revoke the URL to avoid memory leaks
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.append("is_metro", isMetro.toString());
    
    // Append existing images as a JSON string so backend knows what to keep
    formData.append("existing_images", JSON.stringify(existingImages));
    
    // Append new files
    newFiles.forEach(file => {
      formData.append("images", file);
    });

    const res = await saveSiteDetails(site?.id ? String(site.id) : null, formData);

    if (res?.error) {
      setError(res.error);
      setIsPending(false);
    } else {
      // Site saved directly
      router.push("/inventory");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link href="/inventory" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
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

      {/* Metro Toggle */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Train className="w-5 h-5 text-blue-600" />
            Is this a Metro Station or Metro Pillar?
          </h2>
          <p className="text-sm text-muted-foreground">Toggle this to show specific fields like Lines and Pillars.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsMetro(!isMetro)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isMetro ? 'bg-blue-600' : 'bg-gray-200'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isMetro ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* SECTION 1: BASIC INFO */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b pb-3">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Basic Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Site Name / Code / Location *</label>
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
              <label className="text-sm font-medium">Size (W x H)</label>
              <input name="size" defaultValue={site?.size} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 40x20" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Printable Size</label>
              <input name="printable_size" defaultValue={site?.printable_size} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 39x19" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Qty (Faces/Displays)</label>
              <input type="number" name="qty" defaultValue={site?.qty || 1} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Total Sq Ft</label>
              <input type="number" step="any" name="total_sq_ft" defaultValue={site?.total_sq_ft} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        </div>

        {/* METRO SPECIFIC */}
        {isMetro && (
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-indigo-200 pb-3">
              <Train className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-indigo-900">Metro Specific Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-indigo-900">Metro Line / Station</label>
                <input name="metro_line" list="metro-suggestions" defaultValue={site?.metro_line} className="w-full h-10 px-3 rounded-md border border-indigo-300 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Sitabuldi Metro" />
                <datalist id="metro-suggestions">
                  <option value="Jhansi Rani Metro" />
                  <option value="Sitabuldi Metro" />
                  <option value="Metro Pillar Signages Current" />
                </datalist>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-indigo-900">From Pillar To Pillar</label>
                <input name="metro_pillars" defaultValue={site?.metro_pillars} className="w-full h-10 px-3 rounded-md border border-indigo-300 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. P1 to P10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-indigo-900">No. of Pillars</label>
                <input type="number" name="no_of_pillars" defaultValue={site?.no_of_pillars} className="w-full h-10 px-3 rounded-md border border-indigo-300 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-indigo-900">No. of Displays Back To Back</label>
                <input type="number" name="no_of_displays" defaultValue={site?.no_of_displays} className="w-full h-10 px-3 rounded-md border border-indigo-300 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: LOCATION */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b pb-3">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Location Details</h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <LocationSearch 
              defaultAddress={site?.address || ''}
              defaultCity={site?.city || ''}
              defaultLat={site?.lat || ''}
              defaultLng={site?.lng || ''}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              <div className="space-y-2">
                <label className="text-sm font-medium">Area / Region</label>
                <input name="area" defaultValue={site?.area} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Google Maps Link</label>
                <input name="maps_link" defaultValue={site?.maps_link} className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://maps.google.com/..." />
              </div>
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
            <div className="md:col-span-3 space-y-4">
              <label className="text-sm font-medium block">Upload Images (Max 5, up to 2MB each)</label>
              
              <div className="flex items-center gap-4">
                <label className="flex items-center justify-center w-full max-w-xs h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                  <span className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="font-medium text-gray-600">Drop files or click to upload</span>
                  </span>
                  <input type="file" name="file_upload" accept="image/*" multiple className="hidden" onChange={handleFileChange} disabled={existingImages.length + newFiles.length >= 5} />
                </label>
                <div className="text-sm text-gray-500">
                  {existingImages.length + newFiles.length} / 5 images added
                </div>
              </div>

              {/* Previews */}
              {(existingImages.length > 0 || previewUrls.length > 0) && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                  {/* Existing Images */}
                  {existingImages.map((url, i) => (
                    <div key={`existing-${i}`} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Existing ${i}`} className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeExistingImage(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {/* New File Previews */}
                  {previewUrls.map((url, i) => (
                    <div key={`new-${i}`} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`New ${i}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                        <span className="bg-white/80 text-xs px-2 py-1 rounded font-medium">New</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeNewImage(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
