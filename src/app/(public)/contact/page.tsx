"use client";

import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import AnimateOnScroll from "@/frontend/components/AnimateOnScroll";
import { useState, useTransition, useEffect } from "react";
import { addEnquiry } from "@/backend/actions/actions";
import { createClient } from "@/backend/db/client";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default function ContactPage() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [sites, setSites] = useState<{site_id: string, name: string, city: string}[]>([]);

  useEffect(() => {
    const fetchSites = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('sites').select('site_id, name, city').order('city', { ascending: true });
      if (data) setSites(data);
    };
    fetchSites();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("idle");
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await addEnquiry(formData);
      if (res?.error) {
        setStatus("error");
        setErrorMsg(res.error);
      } else {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      }
    });
  };
  return (
    <div className="flex-1 bg-background pt-10 pb-24 relative overflow-hidden">
      {/* Ambient glowing elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-400/5 rounded-full blur-[100px] pointer-events-none animate-float-slow" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
          
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-10">
            <AnimateOnScroll animation="fade-right" duration={800}>
              <div>
                <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">Let&apos;s talk.</h1>
                <p className="text-lg text-muted-foreground">
                  Ready to make an impact? Get in touch with our team to discuss rates, availability, and campaign strategies.
                </p>
              </div>
            </AnimateOnScroll>

            <div className="space-y-8 stagger-children">
              <AnimateOnScroll animation="fade-right" delay={100}>
                <div className="flex items-start group">
                  <EnvelopeIcon className="h-5 w-5 text-primary mt-1 mr-4 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">Email us</h3>
                    <p className="text-muted-foreground text-sm mb-2">Our team usually responds within 2 hours.</p>
                    <a href="mailto:hello@outreachooh.in" className="font-medium text-primary hover:underline">hello@outreachooh.in</a>
                  </div>
                </div>
              </AnimateOnScroll>
              
              <AnimateOnScroll animation="fade-right" delay={200}>
                <div className="flex items-start group">
                  <PhoneIcon className="h-5 w-5 text-primary mt-1 mr-4 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">Call us</h3>
                    <p className="text-muted-foreground text-sm mb-2">Mon-Sat from 10am to 7pm IST.</p>
                    <a href="tel:+919000000000" className="font-medium text-primary hover:underline">+91 90000 00000</a>
                  </div>
                </div>
              </AnimateOnScroll>
              
              <AnimateOnScroll animation="fade-right" delay={300}>
                <div className="flex items-start group">
                  <MapPinIcon className="h-5 w-5 text-primary mt-1 mr-4 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">Office</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      123, Bhagwaghar Layout, Dharampeth<br />
                      Nagpur, Maharashtra 440010
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <AnimateOnScroll animation="blur-in" delay={300} duration={1000}>
              <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm hover-lift relative overflow-hidden group">
                {/* Form glow effect */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <h2 className="font-heading text-2xl font-bold mb-8 relative z-10">Send an enquiry</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 group/input">
                      <label htmlFor="firstName" className="text-sm font-medium text-foreground transition-colors group-focus-within/input:text-primary">First Name</label>
                      <input type="text" name="firstName" id="firstName" required className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-primary/50" placeholder="Rahul" />
                    </div>
                    <div className="space-y-2 group/input">
                      <label htmlFor="lastName" className="text-sm font-medium text-foreground transition-colors group-focus-within/input:text-primary">Last Name</label>
                      <input type="text" name="lastName" id="lastName" required className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-primary/50" placeholder="Sharma" />
                    </div>
                  </div>

                  <div className="space-y-2 group/input">
                    <label htmlFor="email" className="text-sm font-medium text-foreground transition-colors group-focus-within/input:text-primary">Work Email</label>
                    <input type="email" name="email" id="email" required className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-primary/50" placeholder="rahul@company.in" />
                  </div>

                  <div className="space-y-2 group/input">
                    <label htmlFor="company" className="text-sm font-medium text-foreground transition-colors group-focus-within/input:text-primary">Company</label>
                    <input type="text" name="company" id="company" className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-primary/50" placeholder="Tata Communications" />
                  </div>

                  <div className="space-y-2 group/input">
                    <label htmlFor="phone" className="text-sm font-medium text-foreground transition-colors group-focus-within/input:text-primary">Phone Number</label>
                    <input type="tel" name="phone" id="phone" className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-primary/50" placeholder="+91 98765 43210" />
                  </div>

                  <div className="space-y-2 group/input">
                    <div className="flex justify-between items-center">
                      <label htmlFor="preferredSite" className="text-sm font-medium text-foreground transition-colors group-focus-within/input:text-primary">Preferred Site / Location (Optional)</label>
                      <Link href="/catalog" target="_blank" className="text-xs text-primary hover:underline flex items-center">
                        <MapPinIcon className="h-3 w-3 mr-1" /> Browse Catalog
                      </Link>
                    </div>
                    <div className="relative">
                      <select name="preferredSite" id="preferredSite" className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-primary/50 appearance-none">
                        <option value="">-- Select a site from our catalog --</option>
                        {sites.map(s => (
                          <option key={s.site_id} value={`${s.name} (${s.city})`}>{s.name} - {s.city}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-muted-foreground">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 group/input">
                    <label htmlFor="message" className="text-sm font-medium text-foreground transition-colors group-focus-within/input:text-primary">Project Details</label>
                    <textarea id="message" name="message" rows={4} required className="w-full p-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover:border-primary/50 resize-none" placeholder="Tell us about your campaign goals, target locations, and timeline..."></textarea>
                  </div>

                  {status === "error" && (
                    <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm">
                      {errorMsg || "Failed to submit enquiry. Please try again."}
                    </div>
                  )}

                  {status === "success" && (
                    <div className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-medium text-center">
                      Thank you! Your enquiry has been received. We will contact you shortly.
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isPending || status === "success"}
                    className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-md hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                  >
                    {isPending ? (
                      <span className="flex items-center justify-center">
                        <ArrowPathIcon className="mr-2 h-5 w-5 animate-spin" /> Submitting...
                      </span>
                    ) : (
                      "Submit Enquiry"
                    )}
                  </button>
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    By submitting this form, you agree to our privacy policy.
                  </p>
                </form>
              </div>
            </AnimateOnScroll>
          </div>

        </div>
      </div>
    </div>
  );
}
