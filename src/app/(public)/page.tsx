import Link from "next/link";
import { ArrowRight, MapPin, Maximize2, Sparkles, Building2, TrendingUp, Users } from "lucide-react";
import HomeMap from "@/components/HomeMap";

export default function PublicHomePage() {
  return (
    <div className="relative flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center bg-ink text-cloud overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/30 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1533069027836-fa937181a8ce?q=80&w=2532&auto=format&fit=crop" 
            alt="City billboard" 
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        
        {/* Hero Content */}
        <div className="container relative z-20 px-4 text-center max-w-4xl mx-auto py-20">
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 leading-tight">
            Own every street.
          </h1>
          <p className="text-lg md:text-2xl text-sky-tint mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Premium outdoor media locations for brands that demand visual impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
            <Link href="/catalog" className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:scale-105 active:scale-95">
              Browse Catalog
            </Link>
            <Link href="/contact" className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-full border-2 border-cloud bg-transparent px-8 text-base font-semibold text-cloud shadow-sm transition-all hover:bg-cloud hover:text-ink hover:scale-105 active:scale-95">
              Contact for rates
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Sites Section */}
      <section className="py-24 bg-background flex-1">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Featured Locations</h2>
              <p className="text-muted-foreground mt-2">High-impact sites available right now.</p>
            </div>
            <Link href="/catalog" className="hidden sm:flex items-center text-primary font-medium hover:underline">
              View all inventory <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Dummy Featured Cards */}
            {[
              { id: 1, name: "Connaught Place, Delhi", size: "40 × 20 ft", type: "Front-lit", status: "Available", color: "bg-available", img: "https://images.unsplash.com/photo-1533069027836-fa937181a8ce?w=800&q=80" },
              { id: 2, name: "Cyber Hub, Gurgaon", size: "60 × 30 ft", type: "Digital", status: "Booked", color: "bg-booked", img: "https://images.unsplash.com/photo-1513757378314-e46255f6ed16?w=800&q=80" },
              { id: 3, name: "Sector 17, Chandigarh", size: "100 × 40 ft", type: "Back-lit", status: "Available", color: "bg-available", img: "https://images.unsplash.com/photo-1699480114704-ac153307d2a0?w=800&q=80" },
            ].map((site) => (
              <div key={site.id} className="group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  <div className={`absolute top-4 left-4 z-10 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${site.color}`}>
                    {site.status}
                  </div>
                  <img src={site.img} alt={site.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-60" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-heading font-semibold text-xl mb-3 text-foreground line-clamp-1">{site.name}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-6">
                    <span className="flex items-center"><Maximize2 className="mr-1.5 h-4 w-4" /> {site.size}</span>
                    <span className="flex items-center"><MapPin className="mr-1.5 h-4 w-4" /> {site.type}</span>
                  </div>
                  <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
                     <span className="text-sm font-semibold text-primary group-hover:underline flex items-center">
                       View details <ArrowRight className="ml-1 h-3 w-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                     </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center sm:hidden">
            <Link href="/catalog" className="inline-flex items-center text-primary font-medium hover:underline">
              View all inventory <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Map Search Section */}
      <section className="py-24 bg-ink relative overflow-hidden flex-1">
        {/* Artistic Background Map */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-ink/80 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=2000&q=80" 
            alt="Map background" 
            className="w-full h-full object-cover mix-blend-overlay opacity-50"
          />
          {/* Decorative artistic circles/radar */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/20 rounded-full animate-[spin_60s_linear_infinite] z-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/20 rounded-full animate-[spin_40s_linear_infinite_reverse] z-10" />
          
          {/* Animated Pins */}
          <div className="absolute top-[40%] left-[30%] z-20 animate-pulse text-primary"><MapPin className="h-8 w-8" fill="currentColor"/></div>
          <div className="absolute top-[60%] left-[55%] z-20 animate-pulse text-available delay-700"><MapPin className="h-6 w-6" fill="currentColor"/></div>
          <div className="absolute top-[35%] left-[65%] z-20 animate-pulse text-booked delay-1000"><MapPin className="h-10 w-10" fill="currentColor"/></div>
        </div>

        <div className="container relative z-30 mx-auto px-4 max-w-7xl flex flex-col lg:flex-row items-center gap-16">
          
          <div className="lg:w-1/2 text-cloud">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 tracking-tight">Locate your next big impact.</h2>
            <p className="text-lg text-sky-tint mb-8 font-light leading-relaxed">
              Use our interactive mapping tool to find premium hoarding inventory near specific landmarks, competitors, or high-traffic intersections.
            </p>
            
            {/* Search Box */}
            <div className="bg-card/10 backdrop-blur-md border border-cloud/10 rounded-2xl p-6 shadow-2xl">
              <h3 className="font-semibold text-lg mb-4 text-cloud">Search Area</h3>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <div className="relative flex-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <MapPin className="h-5 w-5 text-cloud/50" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Enter pincode, city, or landmark..." 
                    className="w-full h-14 pl-12 pr-4 rounded-xl border border-cloud/20 bg-ink/50 text-cloud placeholder:text-cloud/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                <Link href="/map" className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 whitespace-nowrap">
                  Explore Map
                </Link>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs text-cloud/60 mr-2 self-center uppercase tracking-wider font-semibold">Popular:</span>
                <button className="px-3 py-1 rounded-full border border-cloud/20 bg-transparent hover:bg-cloud/10 text-xs text-cloud transition-colors">Connaught Place</button>
                <button className="px-3 py-1 rounded-full border border-cloud/20 bg-transparent hover:bg-cloud/10 text-xs text-cloud transition-colors">Cyber Hub</button>
                <button className="px-3 py-1 rounded-full border border-cloud/20 bg-transparent hover:bg-cloud/10 text-xs text-cloud transition-colors">Bandra Kurla</button>
              </div>
            </div>
          </div>

          {/* Map Preview */}
          <div className="lg:w-1/2 w-full">
            <div className="relative aspect-square md:aspect-video lg:aspect-[4/3] w-full max-w-2xl mx-auto z-10">
               <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent rounded-full blur-3xl animate-pulse" />
               <div className="w-full h-full relative z-10">
                 <HomeMap />
               </div>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
