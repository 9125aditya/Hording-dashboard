import Link from "next/link";
import { ArrowRight, Briefcase, Mail } from "lucide-react";
import AnimateOnScroll from "@/frontend/components/AnimateOnScroll";

export default function CareersPage() {
  return (
    <div className="flex-1 flex flex-col bg-[#f4f8fb]">
      {/* Header Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
        </div>
        
        <div className="container relative z-10 px-6 mx-auto max-w-7xl text-center">
          <AnimateOnScroll animation="fade-up" duration={700}>
            <div className="inline-flex items-center rounded-xl border-2 border-slate-900 bg-white px-3 py-1 mb-8 text-[11px] font-bold text-slate-900">
              .join our team
            </div>
          </AnimateOnScroll>
          
          <AnimateOnScroll animation="fade-up" delay={100} duration={700}>
            <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-black tracking-tight mb-6 text-slate-900">
              Build the Future of <br className="hidden md:block"/>
              <span className="text-blue-600">Outdoor Advertising</span>
            </h1>
          </AnimateOnScroll>
          
          <AnimateOnScroll animation="fade-up" delay={200} duration={700}>
            <p className="text-[17px] text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
              We're always looking for passionate, driven individuals to join our growing team. If you love media, marketing, and making an impact, we want to hear from you.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="order-2 lg:order-1">
              <AnimateOnScroll animation="fade-right">
                <div className="bg-white p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                  <div className="w-[60px] h-[60px] bg-[#fab935] rounded-2xl flex items-center justify-center text-slate-900 mb-8 shadow-lg shadow-amber-400/20">
                    <Briefcase className="h-7 w-7" />
                  </div>
                  <h2 className="text-[28px] font-black text-slate-900 mb-4 tracking-tight">Open Positions</h2>
                  <p className="text-[15px] text-slate-500 leading-relaxed mb-8 font-medium">
                    Currently, we don't have any specific roles open. However, we are constantly expanding and always happy to connect with talented professionals in sales, marketing, and operations.
                  </p>
                  
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-2">Send us an open application</h3>
                    <p className="text-sm text-slate-500 mb-4">Email us your resume and a brief introduction.</p>
                    <a href="mailto:careers@outreachooh.in" className="inline-flex items-center text-[#dd3333] font-bold text-[15px] hover:text-red-700 transition-colors group">
                      <Mail className="h-4 w-4 mr-2" />
                      careers@outreachooh.in
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>

            <div className="order-1 lg:order-2">
              <AnimateOnScroll animation="fade-left">
                <div className="aspect-[4/3] w-full rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" 
                    alt="Team working together" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </AnimateOnScroll>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
