"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ads = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
    brand: "LUMINOR",
    tagline: "The Future of Bright",
    color: "from-purple-600/80 to-blue-600/80"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2664&auto=format&fit=crop",
    brand: "AURA",
    tagline: "Unleash Your Senses",
    color: "from-rose-500/80 to-orange-500/80"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2938&auto=format&fit=crop",
    brand: "VELOCITY",
    tagline: "Uncompromising Speed",
    color: "from-red-600/80 to-black/80"
  }
];

export default function AnimatedBillboard() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-[420px] h-[580px] group perspective-1000">
      {/* Red Clips - Now darkened to look like heavy metal clamps */}
      <div className="absolute -top-4 left-16 w-8 h-7 bg-[#1a1a1a] rounded-t-lg z-20 shadow-[0_5px_15px_rgba(0,0,0,0.3)] border-t border-x border-slate-700"></div>
      <div className="absolute -top-4 right-16 w-8 h-7 bg-[#1a1a1a] rounded-t-lg z-20 shadow-[0_5px_15px_rgba(0,0,0,0.3)] border-t border-x border-slate-700"></div>
      
      {/* Metal Poles connecting clips */}
      <div className="absolute top-2 left-20 w-1.5 h-6 bg-slate-400 z-10 shadow-inner"></div>
      <div className="absolute top-2 right-20 w-1.5 h-6 bg-slate-400 z-10 shadow-inner"></div>

      {/* The Digital Board */}
      <div className="absolute inset-0 bg-[#0a0a0a] border-[8px] border-[#111] rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] flex items-center justify-center z-30 overflow-hidden transform transition-transform duration-700 group-hover:scale-[1.02] group-hover:rotate-y-2">
        
        {/* Screen Bezel inner shadow */}
        <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_0_30px_rgba(0,0,0,0.9)] z-40 pointer-events-none border border-white/5"></div>
        
        <AnimatePresence>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center text-white"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${ads[currentIndex].image})` }}
            />
            {/* Gradient Overlay for Text Readability */}
            <div className={`absolute inset-0 bg-gradient-to-t ${ads[currentIndex].color} mix-blend-multiply`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            {/* Ad Content */}
            <div className="relative z-10 text-center px-8 mt-auto mb-16">
              <motion.h3 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                className="text-4xl md:text-5xl font-black tracking-tight mb-3 text-white drop-shadow-2xl"
              >
                {ads[currentIndex].brand}
              </motion.h3>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                className="text-sm font-bold text-white/90 uppercase tracking-[0.25em] drop-shadow-md"
              >
                {ads[currentIndex].tagline}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Glossy Reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent z-40 pointer-events-none mix-blend-screen"></div>
        
        {/* Subtle LED Scanline effect */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9InRyYW5zcGFyZW50Ii8+PGxpbmUgeDE9IjAiIHkxPSIwIiB4Mj0iNCIgeTI9IjAiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-50 z-40 pointer-events-none"></div>
      </div>
      
      {/* Glow behind the billboard */}
      <motion.div 
        animate={{ 
          boxShadow: [
            "0 0 50px -10px rgba(139,92,246,0.3)", 
            "0 0 60px -5px rgba(244,63,94,0.3)", 
            "0 0 50px -10px rgba(139,92,246,0.3)"
          ] 
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
        className="absolute inset-4 -z-10 rounded-[2.5rem]"
      ></motion.div>
    </div>
  );
}
