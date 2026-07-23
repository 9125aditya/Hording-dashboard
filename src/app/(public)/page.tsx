import Link from "next/link";
import { MapPinIcon, MegaphoneIcon, GlobeAltIcon, CalendarIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import AnimateOnScroll from "@/frontend/components/AnimateOnScroll";
import HomeSearchBar from "@/frontend/components/HomeSearchBar";
import AnimatedBillboard from "@/frontend/components/AnimatedBillboard";

export const dynamic = 'force-dynamic';

export default function PublicHomePage() {
  const clients = ["Suzuki", "TVS", "Punjab National Bank", "ESAF Bank", "Kalptare", "Godrej Properties", "Krims Hospital", "HCG Hospital", "UltraTech Cement", "Ambuja Cement", "PNG Jewellers", "Tanishq Jewellers", "Polycab Wires", "Blinkit", "IGM", "SDPL", "Priyadarshini", "Aakash Institute", "Allen"];

  return (
    <div className="flex-1 flex flex-col bg-[#f4f8fb]">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] md:min-h-[85vh] flex items-center pt-8 pb-16 md:pb-20">
        {/* Subtle background glow wrapper to prevent horizontal scroll */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 z-0"></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="flex flex-col items-start max-w-2xl">

              <AnimateOnScroll animation="fade-right" delay={100} duration={700}>
                <h1 className="text-[2.6rem] sm:text-5xl lg:text-[6rem] font-black tracking-[-0.03em] leading-[1.05] mb-6 md:mb-8">
                  <span className="text-[#111111] block">Your Brand.</span>
                  <span className="text-[#0047cc] block font-[family-name:var(--font-michroma)] font-bold tracking-tight text-[0.85em] py-1">Every Street.</span>
                  <span className="text-[#111111] block">Every City.</span>
                </h1>
              </AnimateOnScroll>
              
              <AnimateOnScroll animation="fade-right" delay={200} duration={700}>
                <p className="text-[15px] md:text-[17px] text-slate-500 mb-8 md:mb-10 max-w-[500px] leading-relaxed font-medium">
                  Premium hoardings and billboards across Nagpur, Amravati, Chandrapur, and Pune. Browse inventory, pick your sites, and get personalized rates.
                </p>
              </AnimateOnScroll>
              
              <AnimateOnScroll animation="fade-up" delay={300} duration={700} className="w-full">
                <HomeSearchBar />
              </AnimateOnScroll>
            </div>

            {/* Right Content: Billboard Graphic */}
            <div className="relative hidden lg:flex items-center justify-center h-[600px] w-full">
              <AnimateOnScroll animation="zoom-in" delay={300} duration={1000} className="w-full flex justify-center">
                <AnimatedBillboard />
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
              <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 h-full flex flex-col group hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-slate-900 opacity-[0.03] font-black text-[140px] leading-none -mt-10 -mr-4 select-none group-hover:opacity-[0.05] transition-opacity duration-300">01</div>
                <div className="mb-6 relative z-10">
                  <MegaphoneIcon className="h-8 w-8 text-blue-600" strokeWidth={1.5} />
                </div>
                <h3 className="text-[22px] font-black text-slate-900 mb-4 tracking-tight relative z-10">Hoarding & Billboards</h3>
                <p className="text-[15px] text-slate-500 leading-relaxed mb-8 font-medium relative z-10">Outdoor advertising across major highways, junctions and city roads with prime visibility.</p>
                <Link href="/contact" className="mt-auto text-[#dd3333] font-bold text-[15px] flex items-center group-hover:text-red-700 relative z-10">
                  Learn more <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={200} className="h-full">
              <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 h-full flex flex-col group hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-slate-900 opacity-[0.03] font-black text-[140px] leading-none -mt-10 -mr-4 select-none group-hover:opacity-[0.05] transition-opacity duration-300">02</div>
                <div className="mb-6 relative z-10">
                  <GlobeAltIcon className="h-8 w-8 text-[#dd3333]" strokeWidth={1.5} />
                </div>
                <h3 className="text-[22px] font-black text-slate-900 mb-4 tracking-tight relative z-10">Digital Marketing</h3>
                <p className="text-[15px] text-slate-500 leading-relaxed mb-8 font-medium relative z-10">Social media, Google Ads, SEO and online campaigns that complement your outdoor presence.</p>
                <Link href="/contact" className="mt-auto text-[#dd3333] font-bold text-[15px] flex items-center group-hover:text-red-700 relative z-10">
                  Learn more <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={300} className="h-full">
              <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 h-full flex flex-col group hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-slate-900 opacity-[0.03] font-black text-[140px] leading-none -mt-10 -mr-4 select-none group-hover:opacity-[0.05] transition-opacity duration-300">03</div>
                <div className="mb-6 relative z-10">
                  <CalendarIcon className="h-8 w-8 text-[#fab935]" strokeWidth={1.5} />
                </div>
                <h3 className="text-[22px] font-black text-slate-900 mb-4 tracking-tight relative z-10">Event Branding</h3>
                <p className="text-[15px] text-slate-500 leading-relaxed mb-8 font-medium relative z-10">Exhibitions, launches, conferences — end-to-end branding and on-ground activations.</p>
                <Link href="/contact" className="mt-auto text-[#dd3333] font-bold text-[15px] flex items-center group-hover:text-red-700 relative z-10">
                  Learn more <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
            <p className="text-[17px] text-slate-500 font-medium">Leading brands across Maharashtra choose Sellads Outdoor Advertising for their outdoor campaigns.</p>
          </AnimateOnScroll>
        </div>
        
        <div className="relative flex overflow-x-hidden group">
          <div className="py-8 animate-marquee whitespace-nowrap flex items-center gap-16 px-8">
            {clients.map((client, i) => (
              <span key={i} className="text-xl sm:text-3xl font-black text-slate-200 hover:text-slate-800 transition-colors cursor-default select-none tracking-tight">
                {client}
              </span>
            ))}
          </div>
          <div className="absolute top-0 py-8 animate-marquee2 whitespace-nowrap flex items-center gap-16 px-8 ml-8">
            {clients.map((client, i) => (
              <span key={`dup-${i}`} className="text-xl sm:text-3xl font-black text-slate-200 hover:text-slate-800 transition-colors cursor-default select-none tracking-tight">
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
