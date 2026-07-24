import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon, MapPinIcon, ArrowsPointingOutIcon, CheckIcon, ShareIcon, PrinterIcon, MapIcon } from "@heroicons/react/24/outline";
import { createClient } from "@/backend/db/server";
import { notFound } from "next/navigation";

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

  const site = {
    id: dbSite.site_id,
    name: dbSite.name,
    city: dbSite.city,
    address: dbSite.area,
    size: dbSite.size,
    type: dbSite.type,
    status: dbSite.status,
    color: dbSite.status === "Available" ? "bg-available text-primary-foreground" : dbSite.status === "Booked" ? "bg-booked text-primary-foreground" : "bg-blocked text-white",
    images: dbSite.photos && dbSite.photos.length > 0 ? dbSite.photos : [
      "https://images.unsplash.com/photo-1533069027836-fa937181a8ce?w=1600&q=80",
      "https://images.unsplash.com/photo-1513757378314-e46255f6ed16?w=800&q=80"
    ],
    description: `A highly visible ${dbSite.lit_type?.toLowerCase() || 'premium'} hoarding in ${dbSite.area}, ${dbSite.city}. Excellent sightlines with no obstructions, perfect for high-impact brand campaigns.`,
    dailyTraffic: "85,000",
    illumination: dbSite.lit_type === 'Digital' ? '24/7' : '18:00 to 02:00',
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
          <div className="flex items-center space-x-4">
            <button className="text-muted-foreground hover:text-foreground transition-colors"><ShareIcon className="h-4 w-4" /></button>
            <button className="text-muted-foreground hover:text-foreground transition-colors"><PrinterIcon className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content (Gallery & Details) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
               <div className="flex items-center gap-3 mb-4">
                 <span className="text-sm font-medium text-primary">{site.city}</span>
               </div>
               <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">{site.name}</h1>
               <p className="text-lg text-muted-foreground flex items-center"><MapPinIcon className="mr-2 h-5 w-5" /> {site.address}</p>
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
                <div className="aspect-video rounded-xl overflow-hidden bg-muted border border-border flex items-center justify-center relative group cursor-pointer">
                  <MapIcon className="h-10 w-10 text-muted-foreground group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-primary/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-background px-4 py-2 rounded-full text-sm font-medium shadow-sm">View interactive map</span>
                  </div>
                </div>
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
                     <p className="text-sm text-muted-foreground font-medium mb-1">Type</p>
                     <p className="font-semibold text-lg">{site.type}</p>
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
                   Contact for rates
                 </Link>
                 <p className="text-center text-xs text-muted-foreground mt-4">No commitment required.</p>
              </div>

              {/* Mini Map */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm flex flex-col">
                 <div className="h-48 bg-muted relative">
                   <Image src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80" alt="Map area" fill sizes="300px" className="object-cover opacity-50 grayscale" />
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                     <MapPinIcon className="h-8 w-8 text-primary drop-shadow-md" fill="currentColor" />
                   </div>
                 </div>
                 <div className="p-4 bg-card text-center">
                    <button className="text-sm font-medium text-primary hover:underline">Open full map</button>
                 </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
