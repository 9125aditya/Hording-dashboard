import Link from "next/link";
import { ArrowRight, MapPin, Maximize2, Sparkles, Building2, TrendingUp, Users } from "lucide-react";
import HomeMap from "@/components/HomeMap";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import TestimonialsMarquee from "@/components/TestimonialsMarquee";

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

        {/* Ambient floating orbs */}
        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-[15%] w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-drift" />
          <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-blue-400/15 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute top-[50%] right-[30%] w-40 h-40 bg-sky-300/10 rounded-full blur-2xl animate-float" />
        </div>
        
        {/* Hero Content */}
        <div className="container relative z-20 px-4 text-center max-w-4xl mx-auto py-20">
          <AnimateOnScroll animation="blur-in" duration={1000}>
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 leading-tight">
              Own every street.
            </h1>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={200} duration={800}>
            <p className="text-lg md:text-2xl text-sky-tint mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Premium outdoor media locations for brands that demand visual impact.
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={400} duration={800}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
              <Link href="/catalog" className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:scale-105 hover:shadow-primary/25 hover:shadow-2xl active:scale-95">
                Browse Catalog
              </Link>
              <Link href="/contact" className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-full border-2 border-cloud bg-transparent px-8 text-base font-semibold text-cloud shadow-sm transition-all hover:bg-cloud hover:text-ink hover:scale-105 active:scale-95">
                Contact for rates
              </Link>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 z-20 flex flex-col items-center animate-float">
          <div className="w-6 h-10 border-2 border-cloud/40 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2.5 bg-cloud/60 rounded-full animate-bounce" />
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
            {[
              { id: 1, name: "Sitabuldi Main Road", size: "40 × 20 ft", type: "Front-lit", status: "Available", color: "bg-available", img: "https://images.unsplash.com/photo-1533069027836-fa937181a8ce?w=800&q=80", city: "Nagpur" },
              { id: 2, name: "Rajapeth Market", size: "60 × 30 ft", type: "Digital", status: "Booked", color: "bg-booked", img: "https://images.unsplash.com/photo-1513757378314-e46255f6ed16?w=800&q=80", city: "Amravati" },
              { id: 3, name: "Hinjewadi Phase 1", size: "100 × 40 ft", type: "Back-lit", status: "Available", color: "bg-available", img: "https://images.unsplash.com/photo-1699480114704-ac153307d2a0?w=800&q=80", city: "Pune" },
            ].map((site, i) => (
              <AnimateOnScroll key={site.id} animation="fade-up" delay={i * 150}>
                <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-sm hover-lift">
                  <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                    <div className={`absolute top-4 left-4 z-10 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${site.color}`}>
                      {site.status}
                    </div>
                    <img src={site.img} alt={site.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-60" />
                    {/* Shimmer overlay on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-heading font-semibold text-xl text-foreground line-clamp-1">{site.name}</h3>
                    </div>
                    <div className="text-sm text-primary font-medium mb-4">{site.city}</div>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-6">
                      <span className="flex items-center"><Maximize2 className="mr-1.5 h-4 w-4" /> {site.size}</span>
                      <span className="flex items-center"><MapPin className="mr-1.5 h-4 w-4" /> {site.type}</span>
                    </div>
                    <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
                       <span className="text-sm font-semibold text-primary group-hover:underline flex items-center">
                         View details <ArrowRight className="ml-1 h-3 w-3 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                       </span>
                    </div>
                  </div>
                </div>
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
            <p className="text-muted-foreground text-lg">Don't just take our word for it. Hear from marketing leaders who chose OOH Media.</p>
          </AnimateOnScroll>
        </div>
        <AnimateOnScroll animation="fade-up" delay={200} className="w-full">
          <TestimonialsMarquee />
        </AnimateOnScroll>
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
          {/* Animated radar rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/20 rounded-full animate-[spin_60s_linear_infinite] z-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/20 rounded-full animate-[spin_40s_linear_infinite_reverse] z-10" />
          
          {/* Orbiting dots */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 z-20">
            <div className="animate-orbit">
              <div className="w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/50" />
            </div>
          </div>

          {/* Floating ambient pins */}
          <div className="absolute top-[40%] left-[30%] z-20 animate-float text-primary"><MapPin className="h-8 w-8" fill="currentColor"/></div>
          <div className="absolute top-[60%] left-[55%] z-20 animate-float-slow text-available"><MapPin className="h-6 w-6" fill="currentColor"/></div>
          <div className="absolute top-[35%] left-[65%] z-20 animate-drift text-booked"><MapPin className="h-10 w-10" fill="currentColor"/></div>
        </div>

        <div className="container relative z-30 mx-auto px-4 max-w-7xl flex flex-col lg:flex-row items-center gap-16">
          
          <div className="lg:w-1/2 text-cloud">
            <AnimateOnScroll animation="fade-right" duration={800}>
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 tracking-tight">Locate your next big impact.</h2>
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-right" delay={150} duration={800}>
              <p className="text-lg text-sky-tint mb-8 font-light leading-relaxed">
                Use our interactive mapping tool to find premium hoarding inventory near specific landmarks, competitors, or high-traffic intersections.
              </p>
            </AnimateOnScroll>
            
            <AnimateOnScroll animation="fade-up" delay={300} duration={800}>
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
                      placeholder="Search Nagpur, Amravati, Pune..." 
                      className="w-full h-14 pl-12 pr-4 rounded-xl border border-cloud/20 bg-ink/50 text-cloud placeholder:text-cloud/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                  <Link href="/map" className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:scale-105 hover:shadow-primary/25 hover:shadow-2xl active:scale-95 whitespace-nowrap">
                    Explore Map
                  </Link>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-xs text-cloud/60 mr-2 self-center uppercase tracking-wider font-semibold">Popular:</span>
                  <button className="px-3 py-1 rounded-full border border-cloud/20 bg-transparent hover:bg-cloud/10 text-xs text-cloud transition-colors hover:scale-105 active:scale-95">Nagpur</button>
                  <button className="px-3 py-1 rounded-full border border-cloud/20 bg-transparent hover:bg-cloud/10 text-xs text-cloud transition-colors hover:scale-105 active:scale-95">Amravati</button>
                  <button className="px-3 py-1 rounded-full border border-cloud/20 bg-transparent hover:bg-cloud/10 text-xs text-cloud transition-colors hover:scale-105 active:scale-95">Pune</button>
                </div>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Map Preview */}
          <div className="lg:w-1/2 w-full">
            <AnimateOnScroll animation="zoom-in" delay={200} duration={1000}>
              <div className="relative aspect-square md:aspect-video lg:aspect-[4/3] w-full max-w-2xl mx-auto z-10">
                 <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent rounded-full blur-3xl animate-pulse-glow" />
                 <div className="w-full h-full relative z-10">
                   <HomeMap />
                 </div>
              </div>
            </AnimateOnScroll>
          </div>

        </div>
      </section>
    </div>
  );
}
