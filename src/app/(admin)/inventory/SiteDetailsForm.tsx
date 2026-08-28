"use client";

import { useState, useMemo } from "react";
import { saveSiteDetails } from "@/backend/actions/actions";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  ArrowLeft, 
  Save, 
  MapPin, 
  Building2, 
  FileText, 
  IndianRupee, 
  Image as ImageIcon, 
  Train, 
  X, 
  Plus, 
  Link as LinkIcon, 
  Upload, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import LocationSearch from "@/frontend/components/LocationSearch";

export default function SiteDetailsForm({ site = null }: { site?: any }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isMetro, setIsMetro] = useState(site?.is_metro || false);

  // Parse existing images properly from site.photos, site.images, or site.image_url
  const initialPhotos = useMemo(() => {
    if (!site) return [];
    let list: string[] = [];
    if (Array.isArray(site.photos)) {
      list = [...site.photos];
    } else if (typeof site.photos === 'string' && site.photos.trim()) {
      try {
        const parsed = JSON.parse(site.photos);
        list = Array.isArray(parsed) ? parsed : [site.photos];
      } catch {
        list = [site.photos];
      }
    } else if (Array.isArray(site.images)) {
      list = [...site.images];
    } else if (typeof site.images === 'string' && site.images.trim()) {
      try {
        const parsed = JSON.parse(site.images);
        list = Array.isArray(parsed) ? parsed : [site.images];
      } catch {
        list = [site.images];
      }
    } else if (site.image_url) {
      list = [site.image_url];
    }
    return list.filter(Boolean);
  }, [site]);

  // Image handling state
  const [existingImages, setExistingImages] = useState<string[]>(initialPhotos);
  const [manualUrls, setManualUrls] = useState<string[]>([]);
  const [manualUrlInput, setManualUrlInput] = useState("");
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleAddManualUrl = () => {
    const trimmed = manualUrlInput.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://") && !trimmed.startsWith("/")) {
      setError("Please enter a valid image URL starting with https://, http://, or /");
      return;
    }
    if (existingImages.length + manualUrls.length + newFiles.length >= 10) {
      setError("You can have a maximum of 10 pictures per site.");
      return;
    }
    setError("");
    setManualUrls(prev => [...prev, trimmed]);
    setManualUrlInput("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Check total limit
    if (existingImages.length + manualUrls.length + newFiles.length + files.length > 10) {
      setError("You can only upload or attach a maximum of 10 images in total.");
      return;
    }

    // Check size limit (5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    for (const file of files) {
      if (file.size > MAX_SIZE) {
        setError(`Image ${file.name} exceeds the 5MB size limit.`);
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

  const removeManualUrl = (index: number) => {
    setManualUrls(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    formData.append("is_metro", isMetro.toString());
    
    // Append existing images & manual URLs
    formData.append("existing_images", JSON.stringify(existingImages));
    formData.append("manual_urls", JSON.stringify(manualUrls));
    
    // Append new files
    newFiles.forEach(file => {
      formData.append("images", file);
    });

    const targetSiteId = site?.id ? String(site.id) : (site?.site_id ? String(site.site_id) : null);
    const res = await saveSiteDetails(targetSiteId, formData);

    if (res?.error) {
      setError(res.error);
      setIsPending(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/inventory");
        router.refresh();
      }, 1000);
    }
  };

  const totalImagesCount = existingImages.length + manualUrls.length + newFiles.length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/inventory" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {site ? 'Edit Site Details & Pictures' : 'Add New Site & Pictures Manually'}
            </h1>
            <p className="text-sm text-slate-500">
              {site 
                ? 'Update site dimensions, rates, electricity, location, and upload or paste picture URLs.'
                : 'Enter site specifications and attach photos manually (Admin / Super Admin).'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm font-medium">{error}</div>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-sm font-bold">Site details and pictures saved successfully! Redirecting to inventory...</div>
        </div>
      )}

      {/* Metro Toggle */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Train className="w-5 h-5 text-indigo-600" />
            Is this a Metro Station or Metro Pillar?
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Toggle this to show specific Metro fields like Lines and Pillars.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsMetro(!isMetro)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isMetro ? 'bg-indigo-600' : 'bg-gray-200'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isMetro ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* SECTION 1: BASIC INFO */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b pb-3">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Basic Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Site Name / Code / Location *</label>
              <input 
                required 
                name="name" 
                defaultValue={site?.name} 
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm" 
                placeholder="e.g. Shankar Nagar Square Unipole" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Status</label>
              <select 
                name="status" 
                defaultValue={site?.status || 'Available'} 
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white"
              >
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Media Type *</label>
              <select 
                required 
                name="type" 
                defaultValue={site?.type || 'Billboard'} 
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white"
              >
                <option value="Billboard">Billboard</option>
                <option value="Digital Screen">Digital Screen</option>
                <option value="Transit">Transit</option>
                <option value="Street Furniture">Street Furniture</option>
                <option value="Gantry">Gantry</option>
                <option value="Unipole">Unipole</option>
                <option value="Bridge Panel">Bridge Panel</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Lit Type (Variant)</label>
              <div className="relative">
                <input
                  name="lit_type"
                  list="lit-type-options"
                  defaultValue={site?.lit_type || "Front Lit"}
                  className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white"
                  placeholder="e.g. Front Lit, Back Lit, Non-Lit"
                />
                <datalist id="lit-type-options">
                  <option value="Front Lit">Front Lit (External Lighting)</option>
                  <option value="Back Lit">Back Lit (Internal Lighting)</option>
                  <option value="Non-Lit">Non-Lit (Standard Daylight)</option>
                  <option value="Digital Screen">Digital Screen (LED / DOOH)</option>
                  <option value="Both Side Lit">Both Side Lit</option>
                </datalist>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Size (W x H ft)</label>
              <input 
                name="size" 
                defaultValue={site?.size} 
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                placeholder="e.g. 40x20" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Printable Size</label>
              <input 
                name="printable_size" 
                defaultValue={site?.printable_size} 
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                placeholder="e.g. 39x19" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Qty (Faces/Displays)</label>
              <input 
                type="number" 
                name="qty" 
                defaultValue={site?.qty || 1} 
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Sq Ft</label>
              <input 
                type="number" 
                step="any" 
                name="total_sq_ft" 
                defaultValue={site?.total_sq_ft} 
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                placeholder="e.g. 800"
              />
            </div>
          </div>
        </div>

        {/* METRO SPECIFIC */}
        {isMetro && (
          <div className="bg-indigo-50/70 p-6 rounded-xl border border-indigo-200 shadow-xs space-y-6">
            <div className="flex items-center gap-2 border-b border-indigo-200 pb-3">
              <Train className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-indigo-950">Metro Specific Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Metro Line / Station</label>
                <input 
                  name="metro_line" 
                  list="metro-suggestions" 
                  defaultValue={site?.metro_line} 
                  className="w-full h-10 px-3 rounded-lg border border-indigo-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white" 
                  placeholder="e.g. Sitabuldi Metro" 
                />
                <datalist id="metro-suggestions">
                  <option value="Jhansi Rani Metro" />
                  <option value="Sitabuldi Metro" />
                  <option value="Metro Pillar Signages Current" />
                </datalist>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-indigo-900 uppercase tracking-wider">From Pillar To Pillar</label>
                <input 
                  name="metro_pillars" 
                  defaultValue={site?.metro_pillars} 
                  className="w-full h-10 px-3 rounded-lg border border-indigo-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white" 
                  placeholder="e.g. P1 to P10" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-indigo-900 uppercase tracking-wider">No. of Pillars</label>
                <input 
                  type="number" 
                  name="no_of_pillars" 
                  defaultValue={site?.no_of_pillars} 
                  className="w-full h-10 px-3 rounded-lg border border-indigo-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-indigo-900 uppercase tracking-wider">No. of Displays Back To Back</label>
                <input 
                  type="number" 
                  name="no_of_displays" 
                  defaultValue={site?.no_of_displays} 
                  className="w-full h-10 px-3 rounded-lg border border-indigo-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white" 
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: LOCATION */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b pb-3">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Location Details</h2>
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
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Area / Region</label>
                <input 
                  name="area" 
                  defaultValue={site?.area} 
                  className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                  placeholder="e.g. Dharampeth / West Nagpur"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Google Maps Link</label>
                <input 
                  name="maps_link" 
                  defaultValue={site?.maps_link} 
                  className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                  placeholder="https://maps.google.com/..." 
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: COMMERCIALS & LANDLORD */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b pb-3">
            <IndianRupee className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Commercials &amp; Landlord Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Net Rate (₹)</label>
              <input 
                type="number" 
                name="net_rate" 
                defaultValue={site?.net_rate || site?.price} 
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                placeholder="e.g. 150000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">DCPM Rate (₹)</label>
              <input 
                type="number" 
                name="dcpm_rate" 
                defaultValue={site?.dcpm_rate} 
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                placeholder="e.g. 450"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Agency Rate (₹)</label>
              <input 
                type="number" 
                name="agency_rate" 
                defaultValue={site?.agency_rate} 
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                placeholder="e.g. 180000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Mounting Charges (₹)</label>
              <input 
                type="number" 
                name="mounting_charges" 
                defaultValue={site?.mounting_charges} 
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                placeholder="e.g. 5000" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Landlord Name</label>
              <input 
                name="landlord" 
                defaultValue={site?.landlord} 
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                placeholder="e.g. Mr. Sharma"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Landlord Contact</label>
              <input 
                name="landlord_contact" 
                defaultValue={site?.landlord_contact} 
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                placeholder="e.g. 9876543210"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Rent Amount (₹)</label>
              <input 
                type="number" 
                name="rent" 
                defaultValue={site?.rent} 
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                placeholder="e.g. 40000"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: ELECTRICITY */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b pb-3">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Electricity Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Electricity Consumer No.</label>
              <input 
                name="electricity_consumer_no" 
                defaultValue={site?.electricity_consumer_no} 
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                placeholder="e.g. 410012345678"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Consumer Name</label>
              <input 
                name="electricity_consumer_name" 
                defaultValue={site?.electricity_consumer_name} 
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                placeholder="e.g. TrueSign Media Pvt Ltd"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Bill Date</label>
              <input 
                name="electricity_bill_date" 
                defaultValue={site?.electricity_bill_date} 
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                placeholder="e.g. 5th of every month" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Due Date</label>
              <input 
                name="electricity_due_date" 
                defaultValue={site?.electricity_due_date} 
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                placeholder="e.g. 15th of every month" 
              />
            </div>
          </div>
        </div>

        {/* SECTION 5: RATIONALE */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b pb-3">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Rationale / Advertising Value</h2>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Audience profile, traffic count, facing direction, commercial visibility...</label>
            <textarea 
              name="rationale" 
              defaultValue={site?.rationale} 
              className="w-full min-h-[110px] p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
              placeholder="Describe the commercial advantages of this hoarding (e.g., Heavy vehicular traffic heading towards Airport, 100% unobstructed 150m sightline)..." 
            />
          </div>
        </div>

        {/* SECTION 6: PHOTOS & PICTURES (UPLOAD OR PASTE URLS) */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">Site Pictures &amp; Media</h2>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              {totalImagesCount} / 10 Pictures
            </span>
          </div>

          <div className="space-y-6">
            {/* 1. Add Picture via Direct URL */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <LinkIcon className="w-4 h-4 text-indigo-600" />
                Add Picture via URL (Manual Link)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="url"
                  value={manualUrlInput}
                  onChange={(e) => setManualUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddManualUrl();
                    }
                  }}
                  placeholder="Paste direct image URL (e.g. https://images.unsplash.com/... or cloud storage URL)"
                  className="flex-1 h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddManualUrl}
                  disabled={!manualUrlInput.trim() || totalImagesCount >= 10}
                  className="h-10 px-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add URL
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                You can paste image links from Google Drive, Unsplash, CDN, or any public image URL directly.
              </p>
            </div>

            {/* 2. Upload from Computer / Phone */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-indigo-600" />
                Upload Picture Files (From Phone or Computer)
              </label>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <label className={`flex flex-col items-center justify-center w-full max-w-sm h-32 px-4 transition bg-white border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/20 ${totalImagesCount >= 10 ? 'opacity-40 cursor-not-allowed' : ''}`}>
                  <Upload className="w-7 h-7 text-indigo-500 mb-1.5" />
                  <span className="text-xs font-bold text-slate-700">Choose images to upload</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, JPEG, WEBP up to 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={totalImagesCount >= 10}
                  />
                </label>
                <div className="text-xs text-slate-500">
                  <p className="font-semibold text-slate-700 mb-1">Tips for pictures:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-500">
                    <li>First picture is used as the primary display thumbnail.</li>
                    <li>You can mix uploaded files and manual URLs.</li>
                    <li>Up to 10 photos total allowed.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. Combined Pictures Preview Grid */}
            {totalImagesCount > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Attached Pictures ({totalImagesCount}):
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
                  {/* Existing Pictures */}
                  {existingImages.map((url, i) => (
                    <div key={`existing-${i}`} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-[4/3] bg-slate-900 shadow-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                        {i === 0 ? "★ Primary" : `#${i + 1}`}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExistingImage(i)}
                        className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-md transition-transform active:scale-90 cursor-pointer"
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Manual URLs Added */}
                  {manualUrls.map((url, i) => (
                    <div key={`manual-${i}`} className="relative group rounded-xl overflow-hidden border-2 border-indigo-400 aspect-[4/3] bg-slate-900 shadow-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Manual Link ${i + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute top-1.5 left-1.5 bg-indigo-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        URL Link
                      </div>
                      <button
                        type="button"
                        onClick={() => removeManualUrl(i)}
                        className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-md transition-transform active:scale-90 cursor-pointer"
                        title="Remove URL"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Newly Uploaded Files */}
                  {previewUrls.map((url, i) => (
                    <div key={`new-${i}`} className="relative group rounded-xl overflow-hidden border-2 border-emerald-400 aspect-[4/3] bg-slate-900 shadow-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`New upload ${i + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute top-1.5 left-1.5 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        New File
                      </div>
                      <button
                        type="button"
                        onClick={() => removeNewImage(i)}
                        className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-md transition-transform active:scale-90 cursor-pointer"
                        title="Remove upload"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
          <Link 
            href="/inventory"
            className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            ← Cancel &amp; Back to Inventory
          </Link>

          <button
            disabled={isPending}
            type="submit"
            className="w-full sm:w-auto h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2.5 transition-all shadow-md hover:shadow-indigo-500/20 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span>{site ? 'Save Updated Site & Pictures' : 'Add Site & Pictures Now'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
