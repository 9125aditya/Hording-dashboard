"use client";

import { motion } from "framer-motion";

export default function AnimatedBillboard() {
  return (
    <div className="relative w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[420px] h-[360px] sm:h-[460px] lg:h-[560px] perspective-[1200px] flex items-center justify-center">
      
      {/* 3D Animated Billboard Container */}
      <motion.div
        className="relative w-full h-[320px] sm:h-[420px] lg:h-[500px]"
        animate={{
          rotateY: [-4, 4, -4],
          rotateX: [2, -2, 2],
          y: [-8, 8, -8],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        
        {/* Shadow on the ground */}
        <motion.div 
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-6 sm:h-8 bg-black/10 blur-xl rounded-[100%]"
          animate={{ scale: [1, 0.9, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* --- Billboard Structure --- */}
        
        {/* Left Metal Pole */}
        <div className="absolute -bottom-8 sm:-bottom-10 left-8 sm:left-12 w-3 sm:w-4 h-16 sm:h-24 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400 rounded-b-md shadow-md" style={{ transform: "translateZ(-10px)" }}></div>
        {/* Right Metal Pole */}
        <div className="absolute -bottom-8 sm:-bottom-10 right-8 sm:right-12 w-3 sm:w-4 h-16 sm:h-24 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400 rounded-b-md shadow-md" style={{ transform: "translateZ(-10px)" }}></div>

        {/* Top Clips */}
        <div className="absolute -top-2.5 sm:-top-3 left-10 sm:left-16 w-8 sm:w-10 h-6 sm:h-8 bg-[#dd3333] rounded-t-lg shadow-md border-b-2 border-red-800" style={{ transform: "translateZ(10px)" }}></div>
        <div className="absolute -top-2.5 sm:-top-3 right-10 sm:right-16 w-8 sm:w-10 h-6 sm:h-8 bg-[#dd3333] rounded-t-lg shadow-md border-b-2 border-red-800" style={{ transform: "translateZ(10px)" }}></div>

        {/* Main Board Frame */}
        <div 
          className="absolute inset-0 bg-white border-4 sm:border-8 border-blue-600 rounded-[1.75rem] sm:rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.12)] flex items-center justify-center overflow-hidden"
          style={{ transform: "translateZ(0px)" }}
        >
          {/* Subtle inner grid/gradient to look like a blank canvas */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] sm:bg-[size:2rem_2rem] opacity-50"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-slate-100"></div>

          {/* Animated Glow Sweeping Across */}
          <motion.div 
            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-blue-100/50 to-transparent skew-x-12"
            animate={{ left: ["-100%", "200%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
          />

          {/* Text Content */}
          <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-blue-600 font-black tracking-[0.2em] sm:tracking-[0.3em] text-sm sm:text-base lg:text-lg uppercase px-4 sm:px-6 py-2 sm:py-3 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/60 backdrop-blur-sm"
            >
              Your Ad Here
            </motion.div>
            <motion.p 
              className="mt-3 sm:mt-4 text-slate-400 font-medium text-xs sm:text-sm tracking-widest uppercase"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              Premium Space Available
            </motion.p>
          </div>
        </div>

        {/* Ambient Backlight Glow */}
        <div 
          className="absolute inset-0 bg-blue-500/10 blur-[40px] sm:blur-[60px] rounded-[2.5rem] -z-10"
          style={{ transform: "translateZ(-20px)" }}
        ></div>

      </motion.div>
    </div>
  );
}
