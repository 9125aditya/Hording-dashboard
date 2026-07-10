import Link from "next/link";
import { MapPin, Megaphone, Globe, Calendar, ArrowRight } from "lucide-react";
import AnimateOnScroll from "@/frontend/components/AnimateOnScroll";

export default function PublicHomePage() {
  const clients = ["Skyline Group", "Vogue Mart", "Freshly", "MotoEdge", "BrightPath", "CareWell", "Urban Nest", "Threadworks", "Velocity Auto", "EduForge", "Pulsecare", "DailyDrop"];

  return (
    <div className="flex-1 flex flex-col bg-[#f4f8fb]">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center pt-10 pb-20 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 z-0 pointer-events-none"></div>
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="flex flex-col items-start max-w-2xl">
              <AnimateOnScroll animation="fade-right" duration={700}>
                <div className="inline-flex items-center rounded-xl border-2 border-slate-900 bg-white px-3 py-1 mb-8 text-[11px] font-bold text-slate-900">
                  .outdoor advertising .ooh media
                </div>
              </AnimateOnScroll>
              
              <AnimateOnScroll animation="fade-right" delay={100} duration={700}>
                <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-black tracking-[-0.04em] leading-[1.05] mb-6">
                  <span className="text-slate-900 block">Your Brand.</span>
                  <span className="text-blue-600 block">Every Street.</span>
                  <span className="text-slate-900 block">Every City.</span>
                </h1>
              </AnimateOnScroll>
              
              <AnimateOnScroll animation="fade-right" delay={200} duration={700}>
                <p className="text-[17px] text-slate-500 mb-10 max-w-[500px] leading-relaxed font-medium">
                  Premium hoardings and billboards across Nagpur, Amravati, Chandrapur, and Pune. Browse inventory, pick your sites, and get personalized rates.
                </p>
              </AnimateOnScroll>
              
              <AnimateOnScroll animation="fade-up" delay={300} duration={700} className="w-full max-w-[480px]">
                <div className="w-full bg-white rounded-xl p-1.5 flex items-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200">
                  <div className="pl-4 pr-2 text-[#dd3333]">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search by area or city..." 
                    className="flex-1 h-12 bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none px-2 text-[15px] font-semibold"
                  />
                  <Link href="/catalog" className="h-12 px-8 bg-[#dd3333] hover:bg-[#c42c2c] text-white font-bold rounded-lg flex items-center transition-colors shadow-sm text-sm">
                    Search
                  </Link>
                </div>
              </AnimateOnScroll>
            </div>

            {/* Right Content: Billboard Graphic */}
            <div className="relative hidden lg:flex items-center justify-center h-[600px]">
              <AnimateOnScroll animation="zoom-in" delay={300} duration={1000} className="relative w-full max-w-[420px] h-[580px]">
                {/* Red Clips */}
                <div className="absolute -top-4 left-16 w-8 h-7 bg-[#dd3333] rounded-t-md z-20 shadow-md"></div>
                <div className="absolute -top-4 right-16 w-8 h-7 bg-[#dd3333] rounded-t-md z-20 shadow-md"></div>
                {/* Metal Poles connecting clips */}
                <div className="absolute top-2 left-20 w-1.5 h-6 bg-slate-400 z-10"></div>
                <div className="absolute top-2 right-20 w-1.5 h-6 bg-slate-400 z-10"></div>

                {/* The Board */}
                <div className="absolute inset-0 bg-white border-4 border-blue-600 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] flex items-center justify-center z-30 overflow-hidden group transition-transform duration-500 hover:scale-[1.02]">
                  {/* Subtle inner shadow/gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-slate-50/80"></div>
                  
                  <div className="relative z-40 text-center">
                    <p className="text-blue-200 font-black tracking-[0.4em] text-sm uppercase group-hover:text-blue-500 transition-colors duration-500">
                      Your ad here
                    </p>
                  </div>
                </div>
                
                {/* Glow behind the billboard */}
                <div className="absolute inset-0 bg-blue-500/10 blur-[50px] -z-10 rounded-[2.5rem]"></div>
              </AnimateOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-[#f8fafc]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <AnimateOnScroll animation="fade-up">
              <span className="text-[#dd3333] text-[11px] font-black tracking-[0.2em] uppercase mb-4 block">What We Do</span>
              <h2 className="text-4xl md:text-[2.75rem] font-black text-slate-900 tracking-tight">Services Built for Reach</h2>
            </AnimateOnScroll>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimateOnScroll animation="fade-up" delay={100} className="h-full">
              <div className="bg-white p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 h-full flex flex-col group hover:-translate-y-2 transition-transform duration-300">
                <div className="w-[60px] h-[60px] bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-blue-600/20">
                  <Megaphone className="h-7 w-7" />
                </div>
                <h3 className="text-[22px] font-black text-slate-900 mb-4 tracking-tight">Hoarding & Billboards</h3>
                <p className="text-[15px] text-slate-500 leading-relaxed mb-8 font-medium">Outdoor advertising across major highways, junctions and city roads with prime visibility.</p>
                <Link href="/contact" className="mt-auto text-[#dd3333] font-bold text-[15px] flex items-center group-hover:text-red-700">
                  Learn more <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={200} className="h-full">
              <div className="bg-white p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 h-full flex flex-col group hover:-translate-y-2 transition-transform duration-300">
                <div className="w-[60px] h-[60px] bg-[#fab935] rounded-2xl flex items-center justify-center text-slate-900 mb-8 shadow-lg shadow-amber-400/20">
                  <Globe className="h-7 w-7" />
                </div>
                <h3 className="text-[22px] font-black text-slate-900 mb-4 tracking-tight">Digital Marketing</h3>
                <p className="text-[15px] text-slate-500 leading-relaxed mb-8 font-medium">Social media, Google Ads, SEO and online campaigns that complement your outdoor presence.</p>
                <Link href="/contact" className="mt-auto text-[#dd3333] font-bold text-[15px] flex items-center group-hover:text-red-700">
                  Learn more <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={300} className="h-full">
              <div className="bg-white p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 h-full flex flex-col group hover:-translate-y-2 transition-transform duration-300">
                <div className="w-[60px] h-[60px] bg-blue-700 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-blue-700/20">
                  <Calendar className="h-7 w-7" />
                </div>
                <h3 className="text-[22px] font-black text-slate-900 mb-4 tracking-tight">Event Branding</h3>
                <p className="text-[15px] text-slate-500 leading-relaxed mb-8 font-medium">Exhibitions, launches, conferences — end-to-end branding and on-ground activations.</p>
                <Link href="/contact" className="mt-auto text-[#dd3333] font-bold text-[15px] flex items-center group-hover:text-red-700">
                  Learn more <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section id="clients" className="py-24 bg-white overflow-hidden border-t border-slate-100">
        <div className="container mx-auto px-6 max-w-7xl text-center mb-16">
          <AnimateOnScroll animation="fade-up">
            <h2 className="text-3xl md:text-[2.5rem] font-black text-slate-900 tracking-tight mb-4">Top Companies We&apos;ve Worked With</h2>
            <p className="text-[17px] text-slate-500 font-medium">Leading brands across Maharashtra choose Outreach OOH for their outdoor campaigns.</p>
          </AnimateOnScroll>
        </div>
        
        <div className="relative flex overflow-x-hidden group">
          <div className="py-8 animate-marquee whitespace-nowrap flex items-center gap-16 px-8">
            {clients.map((client, i) => (
              <span key={i} className="text-3xl font-black text-slate-200 hover:text-slate-800 transition-colors cursor-default select-none tracking-tight">
                {client}
              </span>
            ))}
          </div>
          <div className="absolute top-0 py-8 animate-marquee2 whitespace-nowrap flex items-center gap-16 px-8 ml-8">
            {clients.map((client, i) => (
              <span key={`dup-${i}`} className="text-3xl font-black text-slate-200 hover:text-slate-800 transition-colors cursor-default select-none tracking-tight">
                {client}
              </span>
            ))}
          </div>
          
          {/* Gradient Edges */}
          <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </div>
      </section>
    </div>
  );
}
