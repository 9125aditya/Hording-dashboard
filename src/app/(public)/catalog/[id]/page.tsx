import Link from "next/link";
import { ArrowLeft, MapPin, Maximize2, Check, Share2, Printer, Map as MapIcon } from "lucide-react";

export default function SiteDetailsPage({ params }: { params: { id: string } }) {
  // In a real app, fetch site by ID. Using mock data here.
  const site = {
    id: params.id,
    name: "Connaught Place",
    city: "Delhi",
    address: "Inner Circle, Connaught Place, Block A",
    size: "40 × 20 ft",
    type: "Front-lit",
    status: "Available",
    color: "bg-available text-primary-foreground",
    images: [
      "https://images.unsplash.com/photo-1533069027836-fa937181a8ce?w=1600&q=80",
      "https://images.unsplash.com/photo-1513757378314-e46255f6ed16?w=800&q=80"
    ],
    description: "A highly visible front-lit hoarding in the heart of Delhi's premier commercial hub. Captures premium footfall and slow-moving vehicular traffic navigating the Inner Circle. Excellent sightlines with no obstructions for 200 meters.",
    dailyTraffic: "85,000",
    illumination: "18:00 to 02:00",
  };

  return (
    <div className="flex-1 bg-background pb-24">
      {/* Top Nav / Breadcrumbs */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 max-w-7xl h-14 flex items-center justify-between">
          <Link href="/catalog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Catalog
          </Link>
          <div className="flex items-center space-x-4">
            <button className="text-muted-foreground hover:text-foreground transition-colors"><Share2 className="h-4 w-4" /></button>
            <button className="text-muted-foreground hover:text-foreground transition-colors"><Printer className="h-4 w-4" /></button>
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
                 <span className={`px-3 py-1 rounded-full text-xs font-semibold ${site.color}`}>{site.status}</span>
                 <span className="text-sm font-medium text-primary">{site.city}</span>
               </div>
               <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">{site.name}</h1>
               <p className="text-lg text-muted-foreground flex items-center"><MapPin className="mr-2 h-5 w-5" /> {site.address}</p>
            </div>

            {/* Gallery */}
            <div className="space-y-4">
              <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-muted border border-border">
                <img src={site.images[0]} alt={site.name} className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-video rounded-xl overflow-hidden bg-muted border border-border">
                  <img src={site.images[1]} alt={site.name} className="w-full h-full object-cover" />
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
                   <div className="p-3 bg-secondary rounded-lg mr-4"><Maximize2 className="h-5 w-5 text-secondary-foreground" /></div>
                   <div>
                     <p className="text-sm text-muted-foreground font-medium mb-1">Dimensions</p>
                     <p className="font-semibold text-lg">{site.size}</p>
                   </div>
                 </div>
                 <div className="flex items-start">
                   <div className="p-3 bg-secondary rounded-lg mr-4"><MapPin className="h-5 w-5 text-secondary-foreground" /></div>
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
                 <p className="text-muted-foreground mb-8">This site is currently available. Contact us for the latest rates and booking terms.</p>
                 
                 <div className="space-y-4 mb-8">
                   <div className="flex items-center text-sm">
                     <Check className="h-4 w-4 text-available mr-3" /> 
                     <span>Est. {site.dailyTraffic} daily traffic</span>
                   </div>
                   <div className="flex items-center text-sm">
                     <Check className="h-4 w-4 text-available mr-3" /> 
                     <span>Illuminated {site.illumination}</span>
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
                   <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80" alt="Map area" className="w-full h-full object-cover opacity-50 grayscale" />
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                     <MapPin className="h-8 w-8 text-primary drop-shadow-md" fill="currentColor" />
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
