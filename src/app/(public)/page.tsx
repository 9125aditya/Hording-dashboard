import Link from "next/link";
import { ArrowRight, MapPin, Maximize2, Sparkles, Building2, TrendingUp, Users } from "lucide-react";
import HomeMap from "@/components/HomeMap";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import TestimonialsMarquee from "@/components/TestimonialsMarquee";

export default function PublicHomePage() {
  return (
    <div className="relative flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-[#0B1120] text-cloud overflow-hidden pt-16 pb-20">
        {/* Subtle grid background */}
        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        
        <div className="container relative z-20 px-4 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
            
            {/* Left Column: Content */}
            <div className="flex flex-col items-start text-left max-w-2xl">
              <AnimateOnScroll animation="fade-right" duration={800}>
                <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 mb-6 text-xs font-semibold text-primary uppercase tracking-widest shadow-[0_0_15px_rgba(249,115,22,0.15)]">
                  Outdoor Media • OOH Advertising
                </div>
              </AnimateOnScroll>
              
              <AnimateOnScroll animation="fade-right" delay={100} duration={800}>
                <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                  Your Brand.<br />
                  <span className="text-primary drop-shadow-[0_0_25px_rgba(249,115,22,0.3)]">Every Street.</span><br />
                  Every City.
                </h1>
              </AnimateOnScroll>
              
              <AnimateOnScroll animation="fade-right" delay={200} duration={800}>
                <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl font-light leading-relaxed">
                  Premium hoardings and billboards across Nagpur, Amravati, Chandrapur, and Pune. Browse inventory, pick your sites, get personalized rates.
                </p>
              </AnimateOnScroll>
              
              <AnimateOnScroll animation="fade-up" delay={300} duration={800} className="w-full">
                <div className="w-full bg-white rounded-2xl p-2 flex items-center shadow-2xl relative z-30">
                  <div className="pl-4 pr-2 text-slate-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search by area, landmark, or city..." 
                    className="flex-1 h-12 bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none px-2 text-base md:text-lg"
                  />
                  <Link href="/map" className="h-12 px-6 sm:px-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl flex items-center transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/30">
                    Search
                  </Link>
                </div>
                
                <div className="flex flex-wrap gap-3 mt-6">
                  <Link href="/catalog" className="px-4 py-1.5 rounded-full border border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-sm font-medium text-slate-300 transition-colors">Nagpur</Link>
                  <Link href="/catalog" className="px-4 py-1.5 rounded-full border border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-sm font-medium text-slate-300 transition-colors">Amravati</Link>
                  <Link href="/catalog" className="px-4 py-1.5 rounded-full border border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-sm font-medium text-slate-300 transition-colors">Chandrapur</Link>
                  <Link href="/catalog" className="px-4 py-1.5 rounded-full border border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-sm font-medium text-slate-300 transition-colors">Pune</Link>
                </div>
              </AnimateOnScroll>
            </div>

            {/* Right Column: Premium CSS Billboard Illustration */}
            <div className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center lg:justify-end perspective-[1000px] z-10 hidden md:flex mt-10 lg:mt-0">
              <AnimateOnScroll animation="zoom-in" delay={200} duration={1000} className="relative w-[90%] max-w-[500px]">
                
                {/* Structural Pole */}
                <div className="absolute top-[80%] left-1/2 -translate-x-1/2 w-32 h-[300px] flex flex-col items-center">
                  <div className="w-full h-full border-x-[6px] border-slate-700/80 bg-gradient-to-b from-slate-800 to-slate-900/0 relative">
                    {/* Cross beams */}
                    <div className="absolute top-[20%] left-0 w-full h-[4px] bg-slate-700/60 rotate-45 scale-110"></div>
                    <div className="absolute top-[20%] left-0 w-full h-[4px] bg-slate-700/60 -rotate-45 scale-110"></div>
                    <div className="absolute top-[50%] left-0 w-full h-[4px] bg-slate-700/60 rotate-45 scale-110"></div>
                    <div className="absolute top-[50%] left-0 w-full h-[4px] bg-slate-700/60 -rotate-45 scale-110"></div>
                  </div>
                </div>

                {/* The Billboard Display */}
                <div className="relative w-full aspect-[21/9] rounded-2xl border-[6px] border-primary bg-slate-950 shadow-[0_0_50px_rgba(249,115,22,0.4)] flex flex-col items-center justify-center overflow-hidden animate-float z-20">
                  {/* Subtle screen grid */}
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#f97316 1px, transparent 1px), linear-gradient(90deg, #f97316 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                  
                  {/* Glowing edges inside */}
                  <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(249,115,22,0.3)]"></div>
                  
                  {/* Billboard Content */}
                  <div className="relative z-10 text-center flex flex-col items-center">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-primary drop-shadow-[0_0_15px_rgba(249,115,22,0.8)] tracking-tight">
                      YOUR AD
                    </h2>
                    <div className="w-24 h-[1px] bg-primary/50 my-3"></div>
                    <p className="text-[10px] md:text-xs font-bold text-slate-300 uppercase tracking-[0.3em] opacity-80">
                      Goes Here
                    </p>
                  </div>
                  
                  {/* Ambient light streak */}
                  <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-30deg] animate-[shimmer_3s_infinite]"></div>
                </div>

                {/* Top Lights */}
                <div className="absolute -top-6 left-[10%] w-8 h-8 flex flex-col items-center z-30">
                  <div className="w-6 h-4 bg-primary rounded-t-lg shadow-[0_-10px_25px_rgba(249,115,22,0.9)] animate-pulse-glow"></div>
                  <div className="w-1.5 h-4 bg-slate-600"></div>
                </div>
                <div className="absolute -top-6 right-[10%] w-8 h-8 flex flex-col items-center z-30">
                  <div className="w-6 h-4 bg-primary rounded-t-lg shadow-[0_-10px_25px_rgba(249,115,22,0.9)] animate-pulse-glow"></div>
                  <div className="w-1.5 h-4 bg-slate-600"></div>
                </div>

                {/* Hanging Tag */}
                <div className="absolute -bottom-6 -right-4 bg-[#1e293b] border border-primary text-primary text-[10px] md:text-xs font-bold px-4 py-2 rounded-lg rotate-[-5deg] shadow-lg shadow-primary/20 z-30">
                  NOW BOOKING
                  <div className="absolute -top-2 left-[20%] w-[2px] h-3 bg-slate-400 -rotate-[15deg]"></div>
                  <div className="absolute -top-2 right-[20%] w-[2px] h-3 bg-slate-400 rotate-[15deg]"></div>
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
