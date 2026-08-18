"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AnimatedBillboard() {
  return (
    <div className="relative w-full max-w-[360px] sm:max-w-[440px] lg:max-w-[490px] perspective-[1200px] flex flex-col items-center justify-center pt-8 pb-4">
      
      {/* 3D Floating Motion Wrapper */}
      <motion.div
        className="relative w-full flex flex-col items-center"
        animate={{
          y: [-7, 7, -7],
          rotateY: [-2, 2, -2],
          rotateX: [1.5, -1.5, 1.5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        
        {/* ======================================================== */}
        {/* 1. TOP OVERHEAD FLOODLIGHTS / SPOTLIGHTS */}
        {/* ======================================================== */}
        <div className="relative w-11/12 flex justify-around px-4 z-30 -mb-2.5 pointer-events-none">
          {[0, 1, 2].map((i) => (
            <div key={i} className="relative flex flex-col items-center">
              {/* Gooseneck Curved Arm */}
              <div className="w-1.5 h-6 sm:h-7 bg-gradient-to-b from-slate-700 to-slate-900 rounded-t-full shadow-sm" />
              
              {/* Floodlight Fixture Head */}
              <div className="w-5 sm:w-6 h-2.5 sm:h-3 bg-gradient-to-r from-slate-800 via-slate-600 to-slate-900 rounded-sm shadow-md border border-slate-500/60 flex items-center justify-center -mt-0.5">
                <div className="w-3.5 sm:w-4 h-1 bg-amber-200 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-pulse" />
              </div>

              {/* Light Cone Cast onto Hoarding */}
              <div className="absolute top-7 w-20 sm:w-28 h-28 bg-gradient-to-b from-amber-300/25 via-amber-200/5 to-transparent blur-[6px] pointer-events-none transform -translate-x-1/2 left-1/2 -rotate-1" />
            </div>
          ))}
        </div>

        {/* ======================================================== */}
        {/* 2. MAIN HOARDING STRUCTURE (HEAVY STEEL BEVELED FRAME) */}
        {/* ======================================================== */}
        <div className="relative w-full rounded-2xl p-2.5 sm:p-3 bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#020617] border-2 border-slate-600/80 shadow-[0_25px_60px_rgba(2,24,87,0.28)] overflow-hidden">
          
          {/* Corner Bolt Rivets */}
          <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-slate-400 border border-slate-600 shadow-inner" />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-slate-400 border border-slate-600 shadow-inner" />
          <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-slate-400 border border-slate-600 shadow-inner" />
          <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-slate-400 border border-slate-600 shadow-inner" />

          {/* Inner Recessed Bezel */}
          <div className="relative w-full rounded-xl overflow-hidden border border-slate-900 bg-slate-950 shadow-inner">
            
            {/* The Mounted Billboard Image Canvas */}
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <Image
                src="/hero-billboard.jpg"
                alt="Mounted Hoarding Visual"
                fill
                priority
                sizes="(max-width: 640px) 340px, (max-width: 1024px) 440px, 490px"
                className="object-cover object-top transition-transform duration-700 hover:scale-105"
              />

              {/* Spotlight Sheen & Inner Shadows */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/30 pointer-events-none" />
              <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none" />

              {/* Floating Pill Badge: Live Status */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/20 text-[10.5px] font-bold text-white shadow-md">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Hoarding Space</span>
              </div>

              {/* Floating Pill Badge: City Pin */}
              <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 px-3 py-1 rounded-full bg-[#021857]/90 backdrop-blur-md border border-amber-400/40 text-[10.5px] font-bold text-amber-300 shadow-md">
                <span>📍 Nagpur Prime Location</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. MAINTENANCE CATWALK & SAFETY GRATING */}
        {/* ======================================================== */}
        <div className="relative w-[96%] h-3.5 sm:h-4 -mt-1 bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700 border-x-2 border-b-2 border-slate-900 rounded-b-md shadow-md flex items-center justify-between px-3 z-20">
          {/* Grating Pattern */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,#334155,#334155_2px,#1e293b_2px,#1e293b_6px)] opacity-60" />
          
          {/* Catwalk Railing Posts */}
          <div className="w-1 h-3.5 bg-slate-400 z-10 -mt-2 shadow" />
          <div className="w-1 h-3.5 bg-slate-400 z-10 -mt-2 shadow" />
          <div className="w-1 h-3.5 bg-slate-400 z-10 -mt-2 shadow" />
          <div className="w-1 h-3.5 bg-slate-400 z-10 -mt-2 shadow" />
        </div>

        {/* ======================================================== */}
        {/* 4. DUAL HEAVY STEEL I-BEAM PILLARS & CROSS-BRACING */}
        {/* ======================================================== */}
        <div className="relative w-3/4 flex justify-between px-6 z-10 -mt-0.5">
          {/* Left Steel Pillar */}
          <div className="relative w-4 sm:w-5 h-14 sm:h-18 bg-gradient-to-r from-slate-700 via-slate-300 to-slate-800 rounded-b-sm shadow-lg border-x border-slate-900">
            {/* Pillar Bolt lines */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-0.5 bg-slate-900" />
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-2 h-0.5 bg-slate-900" />
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-2 h-0.5 bg-slate-900" />
          </div>

          {/* Cross Truss Bracing */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2/3 h-8 border-t-2 border-b-2 border-slate-600/60 skew-x-12 opacity-50 pointer-events-none" />

          {/* Right Steel Pillar */}
          <div className="relative w-4 sm:w-5 h-14 sm:h-18 bg-gradient-to-r from-slate-700 via-slate-300 to-slate-800 rounded-b-sm shadow-lg border-x border-slate-900">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-0.5 bg-slate-900" />
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-2 h-0.5 bg-slate-900" />
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-2 h-0.5 bg-slate-900" />
          </div>
        </div>

        {/* Ambient Backlight Glow */}
        <div className="absolute inset-x-8 top-12 bottom-16 bg-gradient-to-r from-blue-600/15 via-amber-500/15 to-blue-600/15 rounded-3xl blur-2xl -z-10" />
      </motion.div>

      {/* ======================================================== */}
      {/* 5. GROUND CONTACT SHADOW */}
      {/* ======================================================== */}
      <motion.div 
        className="w-3/4 h-5 sm:h-6 bg-slate-950/20 blur-xl rounded-[100%] -mt-2"
        animate={{ scale: [1, 0.9, 1], opacity: [0.35, 0.2, 0.35] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
