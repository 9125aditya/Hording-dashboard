/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { ArrowRight, MapPin, Maximize2, Sparkles, Building2, TrendingUp, Users } from "lucide-react";
import HomeMap from "@/frontend/components/HomeMap";
import AnimateOnScroll from "@/frontend/components/AnimateOnScroll";
import TestimonialsMarquee from "@/frontend/components/TestimonialsMarquee";
import { createClient } from "@/backend/db/server";

export default async function PublicHomePage() {
  const supabase = await createClient();
  const { data: dbSites } = await supabase.from('sites').select('*').order('created_at', { ascending: false });

  const sites = dbSites?.map((s: any) => ({
    id: s.site_id,
    name: s.name,
    size: s.size,
    type: s.type,
    lat: Number(s.lat),
    lng: Number(s.lng),
    status: s.status,
    color: s.status === 'Available' ? 'bg-available' : s.status === 'Booked' ? 'bg-booked' : 'bg-blocked text-white',
    img: s.photos?.[0] || 'https://images.unsplash.com/photo-1533069027836-fa937181a8ce?w=800&q=80',
    city: s.city
  })) || [];

  const featuredSites = sites.slice(0, 3);
  return (
    <div className="relative flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-slate-50 text-slate-900 overflow-hidden pt-20 pb-24 border-b border-border">
        {/* Clean minimal background */}
        <div className="absolute inset-0 z-0 bg-slate-50"></div>
        
        <div className="container relative z-20 px-4 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Content */}
            <div className="flex flex-col items-start text-left max-w-2xl relative z-10">
              <AnimateOnScroll animation="fade-right" duration={800}>
                <div className="inline-flex items-center rounded-sm border border-slate-200 bg-white px-4 py-1.5 mb-8 text-xs font-bold text-slate-600 uppercase tracking-widest shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                  Outdoor Media • OOH Advertising
                </div>
              </AnimateOnScroll>
              
              <AnimateOnScroll animation="fade-right" delay={100} duration={800}>
                <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.15] text-slate-900">
                  Your Brand.<br />
                  <span className="text-primary">
                    Every Street.
                  </span><br />
                  Every City.
                </h1>
              </AnimateOnScroll>
              
              <AnimateOnScroll animation="fade-right" delay={200} duration={800}>
                <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-xl leading-relaxed">
                  Premium hoardings and billboards across Nagpur, Amravati, Chandrapur, and Pune. Browse inventory, pick your sites, and get personalized rates.
                </p>
              </AnimateOnScroll>
              
              <AnimateOnScroll animation="fade-up" delay={300} duration={800} className="w-full">
                <div className="w-full bg-white rounded-2xl p-2.5 flex items-center shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 relative z-30 transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                  <div className="pl-4 pr-2 text-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search by area, landmark, or city..." 
                    className="flex-1 h-14 bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none px-2 text-base md:text-lg font-medium"
                  />
                  <Link href="/map" className="h-14 px-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl flex items-center transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-primary/20">
                    Search
                  </Link>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 mt-6">
                  <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider mr-2">Trending:</span>
                  <Link href="/catalog" className="px-4 py-1.5 rounded-full bg-white border border-slate-200 hover:border-primary/50 hover:text-primary text-sm font-medium text-slate-600 transition-colors shadow-sm">Nagpur</Link>
                  <Link href="/catalog" className="px-4 py-1.5 rounded-full bg-white border border-slate-200 hover:border-primary/50 hover:text-primary text-sm font-medium text-slate-600 transition-colors shadow-sm">Amravati</Link>
                  <Link href="/catalog" className="px-4 py-1.5 rounded-full bg-white border border-slate-200 hover:border-primary/50 hover:text-primary text-sm font-medium text-slate-600 transition-colors shadow-sm">Chandrapur</Link>
                  <Link href="/catalog" className="px-4 py-1.5 rounded-full bg-white border border-slate-200 hover:border-primary/50 hover:text-primary text-sm font-medium text-slate-600 transition-colors shadow-sm">Pune</Link>
                </div>
              </AnimateOnScroll>
            </div>

            {/* Right Column: Imagery */}
            <div className="relative h-[500px] lg:h-[600px] w-full z-10 hidden md:block">
              <AnimateOnScroll animation="fade-left" duration={1000}>
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-full max-w-lg aspect-square bg-slate-100 rounded-sm border border-border shadow-md overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1517502758552-87f5df599f50?w=1200&q=80" alt="Billboard" className="w-full h-full object-cover grayscale opacity-80" />
                </div>
              </AnimateOnScroll>
            </div>
            
          </div>
        </div>
      </section>

      {/* Stats Ticker */}
      <section className="py-6 bg-card border-b border-border">
        <div className="container mx-auto px-4 max-w-7xl">
          <AnimateOnScroll animation="fade-up" duration={600}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {[
                { value: "500+", label: "Sites", icon: <MapPin className="h-5 w-5" /> },
                { value: "4", label: "Cities", icon: <Building2 className="h-5 w-5" /> },
                { value: "10,000+", label: "Campaigns Delivered", icon: <Users className="h-5 w-5" /> },
              ].map((stat, i) => (
                <AnimateOnScroll key={i} animation="zoom-in" delay={i * 100}>
                  <div className="flex flex-col items-center gap-2 py-3">
                    <div className="text-primary mb-1">{stat.icon}</div>
                    <div className="text-2xl md:text-4xl font-bold font-heading text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground font-semibold">{stat.label}</div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Featured Sites Section */}
      <section className="py-24 bg-background flex-1">
        <div className="container mx-auto px-4 max-w-7xl">
          <AnimateOnScroll animation="fade-up">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Featured Locations</h2>
                <p className="text-muted-foreground mt-2">High-impact sites available right now.</p>
              </div>
              <Link href="/catalog" className="hidden sm:flex items-center text-primary font-medium hover:underline group">
                View all inventory <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </AnimateOnScroll>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredSites.map((site: any, i: number) => (
              <AnimateOnScroll key={site.id} animation="fade-up" delay={i * 100}>
                <Link href={`/catalog/${site.id}`} className="group block h-full">
                  <div className="bg-card rounded-sm overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                    <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                      <div className={`absolute top-4 left-4 z-10 text-xs font-semibold uppercase px-3 py-1 rounded-sm shadow-sm ${site.color}`}>
                        {site.status}
                      </div>
                      <img src={site.img} alt={site.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-heading text-xl font-bold text-foreground mb-2 line-clamp-1">{site.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center mb-4">
                        <MapPin className="mr-1.5 h-4 w-4" /> {site.city}
                      </p>
                      
                      <div className="mt-auto pt-4 border-t border-border grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Format</p>
                          <p className="text-sm font-semibold">{site.type}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Size</p>
                          <p className="text-sm font-semibold flex items-center">
                            <Maximize2 className="mr-1 h-3 w-3" /> {site.size}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
          <div className="mt-12 text-center sm:hidden">
            <Link href="/catalog" className="inline-flex items-center text-primary font-medium hover:underline">
              View all inventory <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-background overflow-hidden flex flex-col items-center">
        <div className="container mx-auto px-4 max-w-7xl text-center mb-12">
          <AnimateOnScroll animation="fade-up">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Trusted by top brands in India</h2>
            <p className="text-muted-foreground text-lg">Don&apos;t just take our word for it. Hear from marketing leaders who chose OOH Media.</p>
          </AnimateOnScroll>
        </div>
        <AnimateOnScroll animation="fade-up" delay={200} className="w-full">
          <TestimonialsMarquee />
        </AnimateOnScroll>
      </section>

      {/* Interactive Map Search Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden flex-1">
        <div className="container relative z-30 mx-auto px-4 max-w-7xl flex flex-col lg:flex-row items-center gap-16">
          
          <div className="lg:w-1/2 text-white">
            <AnimateOnScroll animation="fade-right" duration={800}>
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 tracking-tight">Locate your next big impact.</h2>
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-right" delay={150} duration={800}>
              <p className="text-lg text-slate-300 mb-8 font-light leading-relaxed">
                Use our interactive mapping tool to find premium hoarding inventory near specific landmarks, competitors, or high-traffic intersections.
              </p>
            </AnimateOnScroll>
            
            <AnimateOnScroll animation="fade-up" delay={300} duration={800}>
              {/* Search Box */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
                <h3 className="font-semibold text-lg mb-4 text-white">Search Area</h3>
                <div className="flex flex-col gap-3 w-full">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      placeholder="Search Nagpur, Amravati, Pune..." 
                      className="w-full h-14 pl-4 pr-4 rounded-xl border border-white/10 bg-slate-800 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Link href="/catalog" className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                      Explore Catalog <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    <Link href="/contact" className="inline-flex h-12 items-center justify-center rounded-md border border-white/20 bg-transparent px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                      Contact Sales
                    </Link>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Map Preview */}
          <div className="lg:w-1/2 w-full">
            <AnimateOnScroll animation="zoom-in" delay={200} duration={1000}>
              <div className="relative aspect-square md:aspect-video lg:aspect-[4/3] w-full max-w-2xl mx-auto z-10">
                 <div className="absolute inset-0 bg-slate-800 rounded-xl" />
                 <div className="w-full h-full relative z-10">
                   <HomeMap initialSites={sites} />
                 </div>
              </div>
            </AnimateOnScroll>
          </div>

        </div>
      </section>
    </div>
  );
}
