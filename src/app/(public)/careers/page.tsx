"use client";

import Link from "next/link";
import { BriefcaseIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import AnimateOnScroll from "@/frontend/components/AnimateOnScroll";
import { useState, useTransition } from "react";
import { addApplication } from "@/backend/actions/actions";

export default function CareersPage() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("idle");
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await addApplication(formData);
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
    <div className="flex-1 flex flex-col bg-[#f4f8fb] min-h-screen">
      {/* Header Section */}
      <section className="bg-[#004ce6] pt-20 pb-28 px-6">
        <div className="container mx-auto max-w-4xl">
          <AnimateOnScroll animation="fade-up">
            <p className="text-[#fab935] font-bold text-[13px] tracking-widest uppercase mb-4">
              Careers
            </p>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-5 tracking-tight">
              Join Our Team
            </h1>
            <p className="text-blue-100 text-[17px] max-w-2xl font-medium leading-relaxed">
              We're hiring across sales, operations, and creative. Help us put great brands on every street.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Form Section */}
      <section className="px-6 pb-24 -mt-14 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <AnimateOnScroll animation="fade-up" delay={100}>
            <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-12">
              
              {/* Form Header */}
              <div className="flex flex-col md:flex-row md:items-center gap-5 mb-8">
                <div className="w-[52px] h-[52px] bg-orange-50 rounded-2xl flex items-center justify-center shrink-0 border border-orange-100/50">
                  <BriefcaseIcon className="h-6 w-6 text-orange-600" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-[26px] font-black text-slate-900 tracking-tight mb-1">Apply Now</h2>
                  <p className="text-slate-500 font-medium text-[15px]">Tell us about yourself and we'll be in touch.</p>
                </div>
              </div>

              {/* Email Alert */}
              <div className="bg-[#eef5fd] rounded-xl p-4 flex items-center gap-3 mb-10 text-slate-600 font-medium text-[14.5px]">
                <EnvelopeIcon className="h-5 w-5 text-slate-500 shrink-0" />
                <p>
                  You can also mail your resume to us at <a href="mailto:careers@sellads.in" className="text-red-500 font-semibold hover:underline">careers@sellads.in</a>
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <label className="text-[11.5px] font-bold text-slate-600 tracking-wider uppercase">FULL NAME *</label>
                    <input name="fullName" required type="text" className="w-full h-[50px] px-4 rounded-xl border border-slate-200 bg-[#f8fafc] focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium" />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[11.5px] font-bold text-slate-600 tracking-wider uppercase">EMAIL *</label>
                    <input name="email" required type="email" className="w-full h-[50px] px-4 rounded-xl border border-slate-200 bg-[#f8fafc] focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium" />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[11.5px] font-bold text-slate-600 tracking-wider uppercase">PHONE *</label>
                    <input name="phone" required type="tel" className="w-full h-[50px] px-4 rounded-xl border border-slate-200 bg-[#f8fafc] focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium" />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[11.5px] font-bold text-slate-600 tracking-wider uppercase">ROLE</label>
                    <div className="relative">
                      <select name="role" className="w-full h-[50px] px-4 rounded-xl border border-slate-200 bg-[#f8fafc] focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none text-slate-800 font-medium text-sm pr-10">
                        <option>Sales Executive</option>
                        <option>Field Operations</option>
                        <option>Designer / Creative</option>
                        <option>Account Manager</option>
                        <option>Internship</option>
                        <option>Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[11.5px] font-bold text-slate-600 tracking-wider uppercase">EXPERIENCE</label>
                    <div className="relative">
                      <select name="experience" className="w-full h-[50px] px-4 rounded-xl border border-slate-200 bg-[#f8fafc] focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none text-slate-800 font-medium text-sm pr-10">
                        <option>0-1 yrs</option>
                        <option>1-3 yrs</option>
                        <option>3-5 yrs</option>
                        <option>5+ yrs</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[11.5px] font-bold text-slate-600 tracking-wider uppercase">PORTFOLIO / RESUME URL</label>
                    <input name="portfolio" type="url" className="w-full h-[50px] px-4 rounded-xl border border-slate-200 bg-[#f8fafc] focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium" />
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <label className="text-[11.5px] font-bold text-slate-600 tracking-wider uppercase">WHY DO YOU WANT TO JOIN?</label>
                  <textarea name="whyJoin" rows={5} className="w-full p-4 rounded-xl border border-slate-200 bg-[#f8fafc] focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none text-sm font-medium"></textarea>
                </div>

                {status === "error" && (
                  <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm">
                    {errorMsg || "Failed to submit application. Please try again."}
                  </div>
                )}

                {status === "success" && (
                  <div className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-medium text-center">
                    Thank you! Your application has been received. We will contact you shortly.
                  </div>
                )}

                <div className="pt-2">
                  <button type="submit" disabled={isPending || status === "success"} className="w-full h-14 bg-[#0047cc] hover:bg-[#003cb3] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center text-white font-bold rounded-xl text-[16px] transition-colors shadow-md shadow-blue-500/20">
                    {isPending ? (
                      <>
                        <ArrowPathIcon className="mr-2 h-5 w-5 animate-spin" /> Submitting...
                      </>
                    ) : (
                      "Send Application"
                    )}
                  </button>
                </div>
              </form>

            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}
