import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon, MapPinIcon, ArrowsPointingOutIcon, CheckIcon, MapIcon, SunIcon, BoltIcon } from "@heroicons/react/24/outline";
import { createClient } from "@/backend/db/server";
import { notFound } from "next/navigation";
import LeafletMap from "@/frontend/components/LeafletMap";

export const dynamic = 'force-dynamic';

export default async function SiteDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: dbSite, error } = await supabase
    .from("sites")
    .select("*")
    .eq("site_id", resolvedParams.id)
    .single();

  if (error || !dbSite) {
    notFound();
  }

  const litTypeDisplay = dbSite.lit_type || 'Front Lit';

  const site = {
    id: dbSite.site_id,
    name: dbSite.name,
    city: dbSite.city,
    address: dbSite.area,
    size: dbSite.size,
    type: dbSite.type,
    lit_type: litTypeDisplay,
    status: dbSite.status,
    lat: Number(dbSite.lat),
    lng: Number(dbSite.lng),
    color: dbSite.status === "Available" ? "bg-available text-primary-foreground" : dbSite.status === "Booked" ? "bg-booked text-primary-foreground" : "bg-blocked text-white",
    images: dbSite.photos && dbSite.photos.length > 0 ? dbSite.photos : [
      "https://images.unsplash.com/photo-1533069027836-fa937181a8ce?w=1600&q=80",
      "https://images.unsplash.com/photo-1513757378314-e46255f6ed16?w=800&q=80"
    ],
    description: `A highly visible ${litTypeDisplay.toLowerCase()} hoarding in ${dbSite.area || dbSite.city}, ${dbSite.city}. Excellent sightlines with no obstructions, perfect for high-impact brand campaigns.`,
    dailyTraffic: "85,000",
    illumination: dbSite.lit_type === 'Digital' ? '24/7' : dbSite.lit_type === 'Non-Lit' ? 'Daylight Only' : '6:00 PM to 11:00 PM',
  };

  return (
    <div className="flex-1 bg-background pb-24">
      {/* Top Nav / Breadcrumbs */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 max-w-7xl h-14 flex items-center justify-between">
          <Link href="/catalog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Catalog
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content (Gallery & Details) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
               <div className="flex items-center gap-3 mb-4">
                 <span className="text-sm font-semibold text-primary">{site.city}</span>
                 <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
                   {site.lit_type}
                 </span>
               </div>
               <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">{site.name}</h1>
               <p className="text-lg text-muted-foreground flex items-center"><MapPinIcon className="mr-2 h-5 w-5" /> {site.address || site.city}</p>
            </div>

            {/* Gallery */}
            <div className="space-y-4">
              <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-muted border border-border relative">
                <Image src={site.images[0]} alt={site.name} fill priority sizes="100vw" className="object-cover" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-video rounded-xl overflow-hidden bg-muted border border-border relative">
                  <Image src={site.images[1]} alt={site.name} fill sizes="(max-width: 1024px) 50vw, 33vw" className="object-cover" />
                </div>
                <Link href={`/map?siteId=${site.id}`} className="aspect-video rounded-xl overflow-hidden bg-muted border border-border flex items-center justify-center relative group cursor-pointer">
                  <MapIcon className="h-10 w-10 text-muted-foreground group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-primary/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-background px-4 py-2 rounded-full text-sm font-medium shadow-sm">View interactive map</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Description */}
            <div className="pt-8 border-t border-border">
              <h2 className="font-heading text-2xl font-bold mb-4">About this site</h2>
              <p className="text-foreground/80 leading-relaxed text-lg">{site.description}</p>
            </div>
            
            {/* Specs */}
            <div className="pt-8 border-t border-border">
               <h2 className="font-heading text-2xl font-bold mb-6">Specifications</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="flex items-start">
                   <ArrowsPointingOutIcon className="h-5 w-5 text-muted-foreground mt-1 mr-4" />
                   <div>
                     <p className="text-sm text-muted-foreground font-medium mb-1">Dimensions</p>
                     <p className="font-semibold text-lg">{site.size}</p>
                   </div>
                 </div>
                 <div className="flex items-start">
                   <MapPinIcon className="h-5 w-5 text-muted-foreground mt-1 mr-4" />
                   <div>
                     <p className="text-sm text-muted-foreground font-medium mb-1">Media Type</p>
                     <p className="font-semibold text-lg">{site.type}</p>
                   </div>
                 </div>
                 <div className="flex items-start">
                   <SunIcon className="h-5 w-5 text-amber-500 mt-1 mr-4" />
                   <div>
                     <p className="text-sm text-muted-foreground font-medium mb-1">Lit Type / Variant</p>
                     <p className="font-semibold text-lg">{site.lit_type}</p>
                   </div>
                 </div>
                 <div className="flex items-start">
                   <BoltIcon className="h-5 w-5 text-indigo-500 mt-1 mr-4" />
                   <div>
                     <p className="text-sm text-muted-foreground font-medium mb-1">Illumination Hours</p>
                     <p className="font-semibold text-lg">{site.illumination}</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>

          {/* Sidebar (CTA & Map) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Action Card */}
              <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                 <h3 className="font-heading text-2xl font-bold mb-2">Interested?</h3>
                 <p className="text-muted-foreground mb-8">Contact us for the latest rates and booking terms for this location.</p>
                 
                 <div className="space-y-4 mb-8">
                   <div className="flex items-center text-sm">
                     <CheckIcon className="h-4 w-4 text-primary mr-3" /> 
                     <span>Available for immediate booking</span>
                   </div>
                 </div>

                 <Link href={`/contact?site=${site.id}`} className="flex w-full h-14 items-center justify-center rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-95">
                   Get In Touch
                 </Link>
                 <p className="text-center text-xs text-muted-foreground mt-4">No commitment required.</p>
              </div>

              {/* Mini Map */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm flex flex-col p-3">
                <div className="px-2 py-1 mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Location Preview</span>
                  <span className="text-[11px] text-muted-foreground font-medium">{site.city}</span>
                </div>
                {site.lat && site.lng ? (
                  <>
                    <div className="h-[280px] w-full rounded-xl overflow-hidden relative border border-slate-200">
                      <LeafletMap
                        sites={[{ id: site.id, name: site.name, city: site.city, lat: site.lat, lng: site.lng, status: site.status, size: site.size, type: site.type, lit_type: site.lit_type }]}
                        singleSiteZoom={15}
                      />
                    </div>
                    <Link href={`/map?siteId=${site.id}`} className="flex w-full h-11 items-center justify-center rounded-xl bg-slate-900 text-white text-xs font-semibold shadow transition-all hover:bg-slate-800 active:scale-95 mt-3">
                      Open full interactive map
                    </Link>
                  </>
                ) : (
                  <div className="p-8 text-center text-sm text-muted-foreground">Map coordinates not available</div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
