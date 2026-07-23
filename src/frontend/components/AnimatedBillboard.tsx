"use client";

import { motion } from "framer-motion";

export default function AnimatedBillboard() {
  return (
    <div className="relative w-full max-w-[420px] h-[580px] perspective-[1200px] flex items-center justify-center">
      
      {/* 3D Animated Billboard Container */}
      <motion.div
        className="relative w-full h-[540px]"
        animate={{
          rotateY: [-5, 5, -5],
          rotateX: [2, -2, 2],
          y: [-10, 10, -10],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        
        {/* Shadow on the ground */}
        <motion.div 
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/10 blur-xl rounded-[100%]"
          animate={{ scale: [1, 0.9, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* --- Billboard Structure --- */}
        
        {/* Left Metal Pole */}
        <div className="absolute -bottom-10 left-12 w-4 h-24 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400 rounded-b-md shadow-lg" style={{ transform: "translateZ(-10px)" }}></div>
        {/* Right Metal Pole */}
        <div className="absolute -bottom-10 right-12 w-4 h-24 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400 rounded-b-md shadow-lg" style={{ transform: "translateZ(-10px)" }}></div>

        {/* Top Clips */}
        <div className="absolute -top-3 left-16 w-10 h-8 bg-[#dd3333] rounded-t-lg shadow-md border-b-2 border-red-800" style={{ transform: "translateZ(10px)" }}></div>
        <div className="absolute -top-3 right-16 w-10 h-8 bg-[#dd3333] rounded-t-lg shadow-md border-b-2 border-red-800" style={{ transform: "translateZ(10px)" }}></div>

        {/* Main Board Frame */}
        <div 
          className="absolute inset-0 bg-white border-8 border-blue-600 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center justify-center overflow-hidden"
          style={{ transform: "translateZ(0px)" }}
        >
          {/* Subtle inner grid/gradient to look like a blank canvas */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-50"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-slate-100"></div>

          {/* Animated Glow Sweeping Across */}
          <motion.div 
            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-blue-100/50 to-transparent skew-x-12"
            animate={{ left: ["-100%", "200%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
          />

          {/* Text Content */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-blue-600 font-black tracking-[0.3em] text-lg uppercase px-6 py-3 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/50 backdrop-blur-sm"
            >
              Your Ad Here
            </motion.div>
            <motion.p 
              className="mt-4 text-slate-400 font-medium text-sm tracking-widest uppercase"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              Premium Space Available
            </motion.p>
          </div>
        </div>

        {/* Ambient Backlight Glow */}
        <div 
          className="absolute inset-0 bg-blue-500/10 blur-[60px] rounded-[2.5rem] -z-10"
          style={{ transform: "translateZ(-20px)" }}
        ></div>

      </motion.div>
    </div>
  );
}
