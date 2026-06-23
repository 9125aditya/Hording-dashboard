import Link from "next/link";
import { ArrowRight, MapPin, Maximize2, SlidersHorizontal, Search } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";

import { createClient } from "@/lib/supabase/server";

export default async function CatalogPage() {
  const supabase = await createClient();
  const { data: dbSites } = await supabase.from('sites').select('*').order('created_at', { ascending: false });

  const sites = dbSites?.map((s: any) => ({
    id: s.site_id,
    name: s.name,
    size: s.size,
    type: s.type,
    status: s.status,
    color: s.status === 'Available' ? 'bg-available' : s.status === 'Booked' ? 'bg-booked' : 'bg-blocked text-white',
    img: s.photos?.[0] || 'https://images.unsplash.com/photo-1533069027836-fa937181a8ce?w=800&q=80',
    city: s.city
  })) || [];
  return (
    <div className="flex-1 bg-background pt-10 pb-24">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <AnimateOnScroll animation="fade-up" duration={800}>
          <div className="mb-12">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">Browse Sites</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explore our premium outdoor media inventory. Filter by location, size, or availability to find the perfect spot for your next campaign.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Filters and Search */}
        <AnimateOnScroll animation="fade-up" delay={100}>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 pb-6 border-b border-border">
            <div className="flex w-full md:w-auto items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              <button className="whitespace-nowrap px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95">All Sites</button>
              <button className="whitespace-nowrap px-4 py-2 rounded-full bg-muted text-muted-foreground hover:bg-secondary hover:text-secondary-foreground text-sm font-medium transition-all active:scale-95">Available Only</button>
              <button className="whitespace-nowrap px-4 py-2 rounded-full bg-muted text-muted-foreground hover:bg-secondary hover:text-secondary-foreground text-sm font-medium transition-all active:scale-95">Digital Displays</button>
              <button className="whitespace-nowrap px-4 py-2 rounded-full bg-muted text-muted-foreground hover:bg-secondary hover:text-secondary-foreground text-sm font-medium transition-all active:scale-95">Static Boards</button>
            </div>
            
            <div className="flex w-full md:w-auto gap-3">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search locations..." 
                  className="w-full h-10 pl-9 pr-4 rounded-full border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                />
              </div>
              <button className="h-10 px-4 flex items-center justify-center rounded-full border border-input bg-card text-foreground hover:bg-muted transition-colors active:scale-95">
                <SlidersHorizontal className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline text-sm font-medium">Filters</span>
              </button>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sites.map((site, i) => (
            <AnimateOnScroll key={site.id} animation="fade-up" delay={(i % 10) * 100}>
              <Link href={`/catalog/${site.id}`} className="group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-sm hover-lift">
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  <div className={`absolute top-4 left-4 z-10 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${site.color}`}>
                    {site.status}
                  </div>
                  <img src={site.img} alt={site.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-60" />
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
              </Link>
            </AnimateOnScroll>
          ))}
        </div>
        
        {/* Pagination */}
        <AnimateOnScroll animation="fade-up" delay={200}>
          <div className="mt-16 flex justify-center">
            <div className="flex items-center space-x-2">
              <button className="h-10 px-4 rounded-full border border-input bg-card text-sm font-medium hover:bg-muted disabled:opacity-50 transition-all active:scale-95">Previous</button>
              <button className="h-10 w-10 rounded-full bg-primary text-primary-foreground text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary/20">1</button>
              <button className="h-10 w-10 rounded-full border border-input bg-card hover:bg-muted text-sm font-medium transition-all active:scale-95">2</button>
              <button className="h-10 w-10 rounded-full border border-input bg-card hover:bg-muted text-sm font-medium transition-all active:scale-95">3</button>
              <button className="h-10 px-4 rounded-full border border-input bg-card text-sm font-medium hover:bg-muted transition-all active:scale-95">Next</button>
            </div>
          </div>
        </AnimateOnScroll>

      </div>
    </div>
  );
}
