"use client";

import React, { useState } from "react";

// ==========================================
// BRAND LOGO VECTOR COMPONENTS
// ==========================================

// --- AUTOMOTIVE LOGOS ---
export function TataLogo({ className = "h-8 sm:h-10 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg className="h-9 sm:h-10 w-auto text-[#00529b]" viewBox="0 0 100 70" fill="currentColor">
        <path d="M50 0C22.4 0 0 15.7 0 35c0 19.3 22.4 35 50 35s50-15.7 50-35C100 15.7 77.6 0 50 0zm0 62C27.9 62 10 49.9 10 35S27.9 8 50 8s40 12.1 40 27-17.9 27-40 27z" />
        <path d="M43 20h14v7h-3.5v22h-7V27H43v-7zm-14 7h10v6h-10v-6zm32 0h10v6h-10v-6z" />
      </svg>
      <span className="font-black text-lg sm:text-xl tracking-[0.2em] text-[#00529b] font-sans">
        TATA
      </span>
    </div>
  );
}

export function MarutiSuzukiLogo({ className = "h-8 sm:h-10 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#d32f2f] text-white font-black italic flex items-center justify-center rounded-xs text-base sm:text-lg">
        S
      </div>
      <span className="font-black text-sm sm:text-base tracking-wider text-[#002663] uppercase">
        Maruti Suzuki
      </span>
    </div>
  );
}

export function HyundaiLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-5 border-2 border-[#002c6c] rounded-[50%] flex items-center justify-center italic font-black text-[#002c6c] text-xs">
        H
      </div>
      <span className="font-black text-sm sm:text-base tracking-widest text-[#002c6c] uppercase font-sans">
        Hyundai
      </span>
    </div>
  );
}

export function TvsLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-black italic text-xl sm:text-2xl text-[#1e3c72] tracking-tighter">
        TVS
      </span>
      <span className="font-extrabold italic text-sm text-[#e52d27] uppercase tracking-normal">
        MOTOR
      </span>
    </div>
  );
}

export function MahindraLogo({ className = "h-8 sm:h-10 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex items-center text-[#d32f2f] font-black text-xl sm:text-2xl tracking-wide">
        <span className="text-[#d32f2f]">mahindra</span>
      </div>
    </div>
  );
}

export function HondaLogo({ className = "h-8 sm:h-10 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-serif font-black text-xl sm:text-2xl text-[#cc0000] tracking-widest">
        HONDA
      </span>
    </div>
  );
}

export function HeroLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-5 h-5 bg-[#e31837] rounded-sm flex items-center justify-center text-white font-black text-xs">
        H
      </div>
      <span className="font-black text-base sm:text-lg text-slate-900 tracking-wider">
        Hero
      </span>
    </div>
  );
}

export function ToyotaLogo({ className = "h-8 sm:h-10 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-black text-base sm:text-lg text-[#eb0a1e] tracking-[0.2em]">
        TOYOTA
      </span>
    </div>
  );
}

export function BajajLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-black text-base sm:text-lg text-[#005ba6] tracking-wider">
        BAJAJ
      </span>
    </div>
  );
}

export function KiaLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="font-black text-lg sm:text-xl tracking-[0.25em] text-[#05141f]">
        KIA
      </span>
    </div>
  );
}

export function RoyalEnfieldLogo({ className = "h-8 sm:h-10 w-auto" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <span className="font-serif font-black text-sm sm:text-base text-[#b8860b] tracking-widest uppercase">
        ROYAL ENFIELD
      </span>
    </div>
  );
}

export function SkodaLogo({ className = "h-8 sm:h-10 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-black text-base sm:text-lg text-[#0e3b2e] tracking-[0.15em] uppercase">
        ŠKODA
      </span>
    </div>
  );
}

export function AudiLogo({ className = "h-10 sm:h-12 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img src="/assets/client-logos/audi.png" alt="Audi" className="h-8 sm:h-10 w-auto" />
    </div>
  );
}

export function MercedesLogo({ className = "h-10 sm:h-12 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img src="/assets/client-logos/mercides.png" alt="Mercedes" className="h-8 sm:h-10 w-auto" />
    </div>
  );
}

export function BMWLogo({ className = "h-10 sm:h-12 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img src="/assets/client-logos/bmw.png" alt="BMW" className="h-8 sm:h-10 w-auto" />
    </div>
  );
}

export function TriumphLogo({ className = "h-10 sm:h-12 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img src="/assets/client-logos/triumph-motorcycles-ltd.png" alt="Triumph" className="h-8 sm:h-10 w-auto" />
    </div>
  );
}

export function VolkswagenLogo({ className = "h-10 sm:h-12 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img src="/assets/client-logos/volkswagen.png" alt="Volkswagen" className="h-8 sm:h-10 w-auto" />
    </div>
  );
}


// --- BANKING & FINANCE LOGOS ---
export function HdfcBankLogo({ className = "h-12 sm:h-14 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#004c8f] rounded flex items-center justify-center p-1 relative">
        <div className="w-full h-full border border-white relative flex items-center justify-center">
          <div className="w-2 h-2 bg-[#ed232a]"></div>
        </div>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-black text-base sm:text-lg tracking-wider text-[#004c8f]">HDFC BANK</span>
      </div>
    </div>
  );
}

export function SbiLogo({ className = "h-12 sm:h-14 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#00a3e0] flex items-center justify-center relative">
        <div className="w-2 h-2 rounded-full bg-white relative">
          <div className="absolute top-1 left-0.5 w-1 h-3 bg-[#00a3e0] -translate-x-1/2"></div>
        </div>
      </div>
      <span className="font-black text-base sm:text-lg tracking-wider text-[#22408c]">
        State Bank of India
      </span>
    </div>
  );
}

export function IciciBankLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-6 h-6 rounded-full bg-[#b8292f] flex items-center justify-center text-white font-serif font-black text-xs italic">
        i
      </div>
      <span className="font-black text-xs sm:text-sm text-[#b8292f] tracking-tight">
        ICICI Bank
      </span>
    </div>
  );
}

export function PnbLogo({ className = "h-12 sm:h-14 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#a20a3a] rounded flex items-center justify-center text-[#ffc20e] font-bold text-lg">
        pnb
      </div>
      <span className="font-bold text-base sm:text-lg text-[#a20a3a]">
        Punjab National Bank
      </span>
    </div>
  );
}

export function AxisBankLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-5 h-5 bg-[#97144d] rounded-sm rotate-45 flex items-center justify-center text-white text-[8px] font-bold">
        A
      </div>
      <span className="font-black text-xs sm:text-sm text-[#97144d] tracking-wide">
        AXIS BANK
      </span>
    </div>
  );
}

export function KotakLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-6 h-6 rounded-full bg-[#ed1c24] flex items-center justify-center text-white font-bold text-xs">
        k
      </div>
      <span className="font-black text-xs sm:text-sm text-[#003366]">
        kotak
      </span>
    </div>
  );
}

export function BankOfBarodaLogo({ className = "h-12 sm:h-14 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#f26522] rounded-full flex items-center justify-center text-white font-bold text-lg">
        B
      </div>
      <span className="font-bold text-base sm:text-lg text-[#f26522]">
        Bank of Baroda
      </span>
    </div>
  );
}

export function CanaraBankLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-6 h-6 bg-[#0093d8] rounded flex items-center justify-center text-yellow-300 font-bold text-xs">
        CB
      </div>
      <span className="font-bold text-xs sm:text-sm text-[#0093d8]">
        Canara Bank
      </span>
    </div>
  );
}

export function IndusIndLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-black text-xs sm:text-sm text-[#8b0000] tracking-wide">
        IndusInd Bank
      </span>
    </div>
  );
}

export function EsafLogo({ className = "h-12 sm:h-14 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-black text-lg sm:text-xl text-[#006837]">
        ESAF <span className="text-[14px] text-slate-500 font-medium">Bank</span>
      </span>
    </div>
  );
}

export function BajajFinservLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-black text-xs sm:text-sm text-[#005ba6]">
        BAJAJ <span className="text-[#008080]">FINSERV</span>
      </span>
    </div>
  );
}

export function MuthootFinanceLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-5 h-5 bg-[#e31e24] rounded-full flex items-center justify-center text-yellow-300 font-bold text-[9px]">
        M
      </div>
      <span className="font-black text-xs sm:text-sm text-[#e31e24]">
        Muthoot Finance
      </span>
    </div>
  );
}


// --- FMCG & QUICK COMMERCE LOGOS ---
export function CocaColaLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="font-serif italic font-black text-xl sm:text-2xl text-[#f40009] tracking-tighter">
        Coca-Cola
      </span>
    </div>
  );
}

export function PepsiLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-6 h-6 rounded-full border border-slate-200 overflow-hidden relative flex flex-col">
        <div className="h-3 bg-[#e32934]"></div>
        <div className="h-3 bg-[#004b93]"></div>
      </div>
      <span className="font-black italic text-sm sm:text-base text-[#004b93]">
        pepsi
      </span>
    </div>
  );
}

export function NestleLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-serif font-black text-lg sm:text-xl text-[#2d5c88] tracking-tight">
        Nestlé
      </span>
    </div>
  );
}

export function PgLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="font-serif font-black text-2xl sm:text-3xl tracking-tight text-[#003cae]">
        P&amp;G
      </span>
    </div>
  );
}

export function HulLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-black text-xs sm:text-sm text-[#1f365c]">
        Hindustan Unilever
      </span>
    </div>
  );
}

export function BritanniaLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-black text-sm sm:text-base text-[#d8232a] tracking-wide">
        BRITANNIA
      </span>
    </div>
  );
}

export function AmulLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-serif font-black text-lg sm:text-xl text-[#d71920]">
        Amul
      </span>
      <span className="text-[9px] font-bold text-slate-500">The Taste of India</span>
    </div>
  );
}

export function ItcLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="px-2 py-0.5 bg-[#004b87] rounded text-white font-serif font-black text-xs tracking-widest">
        ITC
      </div>
      <span className="text-xs font-bold text-slate-700">Limited</span>
    </div>
  );
}

export function DaburLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-serif font-black text-base sm:text-lg text-[#007a3d]">
        Dabur
      </span>
    </div>
  );
}

export function ZomatoLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="font-black italic text-xl sm:text-2xl text-[#cb202d] tracking-tight">
        zomato
      </span>
    </div>
  );
}

export function SwiggyLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#fc8019] flex items-center justify-center text-white font-bold text-xs">
        S
      </div>
      <span className="font-black text-base sm:text-lg text-[#fc8019] tracking-tight">
        SWIGGY
      </span>
    </div>
  );
}

export function BlinkitLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className="font-black text-lg sm:text-xl text-[#f8cb46]">blink</span>
      <span className="font-black text-lg sm:text-xl text-[#0c831f]">it</span>
    </div>
  );
}


// --- JEWELLERY & LUXURY LOGOS ---
export function TanishqLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center leading-none ${className}`}>
      <span className="font-serif font-black text-sm sm:text-base tracking-[0.2em] text-[#8e1b3d] uppercase">
        TANISHQ
      </span>
      <span className="text-[7.5px] tracking-widest text-[#a37d36] font-medium mt-0.5">A TATA PRODUCT</span>
    </div>
  );
}

export function KalyanLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center leading-none ${className}`}>
      <span className="font-serif font-bold text-sm sm:text-base tracking-widest text-[#c29b38] uppercase">
        KALYAN
      </span>
      <span className="text-[8px] font-semibold text-slate-700 tracking-wider">JEWELLERS</span>
    </div>
  );
}

export function PngJewellersLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-6 h-6 bg-[#b22222] rounded flex items-center justify-center text-amber-300 font-serif font-bold text-xs">
        PNG
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-serif font-bold text-xs sm:text-sm text-slate-900">P. N. GADGIL</span>
        <span className="text-[7.5px] font-semibold text-[#b22222] tracking-wider">JEWELLERS</span>
      </div>
    </div>
  );
}

export function MalabarLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center leading-none ${className}`}>
      <span className="font-serif font-bold text-xs sm:text-sm tracking-widest text-[#9d7b38] uppercase">
        MALABAR
      </span>
      <span className="text-[7.5px] font-semibold text-slate-600 tracking-wider mt-0.5">GOLD &amp; DIAMONDS</span>
    </div>
  );
}

export function JoyalukkasLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center leading-none ${className}`}>
      <span className="font-serif font-black text-xs sm:text-sm tracking-wide text-[#961c1e]">
        Joyalukkas
      </span>
      <span className="text-[7px] text-[#c29b38] font-bold tracking-widest">WORLD&apos;S FAVOURITE JEWELLER</span>
    </div>
  );
}

export function SencoGoldLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center leading-none ${className}`}>
      <span className="font-serif font-black text-xs sm:text-sm text-[#bd1e2d]">
        SENCO
      </span>
      <span className="text-[7px] font-bold text-slate-600 tracking-widest">GOLD &amp; DIAMONDS</span>
    </div>
  );
}

export function TbzLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center leading-none ${className}`}>
      <span className="font-serif font-black text-sm sm:text-base text-[#1b365d]">
        TBZ
      </span>
      <span className="text-[7px] font-bold text-[#b4975a] tracking-wider">THE ORIGINAL</span>
    </div>
  );
}

export function PcJewellerLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-5 h-5 bg-[#be1e2d] text-white flex items-center justify-center font-bold text-[10px] rounded-sm">
        PCJ
      </div>
      <span className="font-bold text-xs text-[#be1e2d]">PC Jeweller</span>
    </div>
  );
}

export function CaratLaneLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center leading-none ${className}`}>
      <span className="font-black text-xs sm:text-sm text-[#492364] tracking-wide">
        CARATLANE
      </span>
      <span className="text-[7px] font-bold text-[#de6d76]">A TATA PRODUCT</span>
    </div>
  );
}

export function BhimaLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center leading-none ${className}`}>
      <span className="font-serif font-black text-xs sm:text-sm text-[#8b1e23]">
        BHIMA
      </span>
      <span className="text-[7px] font-bold text-slate-600">JEWELLERY</span>
    </div>
  );
}

export function LalithaJewelleryLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center leading-none ${className}`}>
      <span className="font-serif font-black text-xs sm:text-sm text-[#d41c24]">
        LALITHAA
      </span>
      <span className="text-[7px] font-bold text-[#b8912d]">JEWELLERY</span>
    </div>
  );
}

export function GrtJewellersLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center leading-none ${className}`}>
      <span className="font-serif font-black text-xs sm:text-sm text-[#005596]">
        GRT
      </span>
      <span className="text-[7px] font-bold text-[#d4af37]">JEWELLERS</span>
    </div>
  );
}


// --- REAL ESTATE LOGOS ---
export function GodrejLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex flex-col leading-none ${className}`}>
      <span className="font-serif italic font-bold text-lg sm:text-xl text-[#0072ce] tracking-tight">
        Godrej
      </span>
      <span className="text-[8px] font-semibold text-slate-600 tracking-wider">PROPERTIES</span>
    </div>
  );
}

export function KalpataruLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-5 h-5 border border-[#1b75bc] rounded flex items-center justify-center text-[#1b75bc] font-bold text-xs">
        K
      </div>
      <span className="font-bold text-sm sm:text-base text-[#1b75bc] tracking-widest uppercase font-sans">
        KALPATARU
      </span>
    </div>
  );
}

export function SdplLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-black text-base sm:text-lg text-[#1e3a8a] tracking-wider">
        SDPL <span className="text-xs font-semibold text-slate-500">Builders</span>
      </span>
    </div>
  );
}

export function DlfLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center leading-none ${className}`}>
      <span className="font-serif font-black text-sm sm:text-base text-[#005a9c] tracking-[0.2em]">
        DLF
      </span>
      <span className="text-[7px] font-bold text-slate-500 tracking-widest">BUILDING INDIA</span>
    </div>
  );
}

export function LodhaLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center leading-none ${className}`}>
      <span className="font-serif font-black text-sm sm:text-base text-[#b8860b] tracking-[0.2em]">
        LODHA
      </span>
      <span className="text-[7px] font-bold text-slate-500 tracking-widest">BUILDING A BETTER LIFE</span>
    </div>
  );
}

export function PrestigeLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center leading-none ${className}`}>
      <span className="font-serif font-black text-xs sm:text-sm text-[#003865] tracking-widest uppercase">
        PRESTIGE
      </span>
      <span className="text-[7px] font-bold text-[#c29b38]">GROUP</span>
    </div>
  );
}

export function SobhaLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center leading-none ${className}`}>
      <span className="font-black text-xs sm:text-sm text-[#c8102e] tracking-[0.2em]">
        SOBHA
      </span>
      <span className="text-[7px] font-bold text-slate-500">PASSION AT WORK</span>
    </div>
  );
}

export function BrigadeLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center leading-none ${className}`}>
      <span className="font-black text-xs sm:text-sm text-[#1c3f94] tracking-widest">
        BRIGADE
      </span>
      <span className="text-[7px] font-bold text-slate-500">Building Positive Experiences</span>
    </div>
  );
}

export function HiranandaniLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center leading-none ${className}`}>
      <span className="font-serif font-black text-xs sm:text-sm text-[#2d5c88] tracking-wide">
        Hiranandani
      </span>
      <span className="text-[7px] font-bold text-[#b8860b]">COMMUNITIES</span>
    </div>
  );
}

export function OberoiRealtyLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center leading-none ${className}`}>
      <span className="font-serif font-black text-xs sm:text-sm text-[#d4af37] tracking-widest">
        OBEROI
      </span>
      <span className="text-[7px] font-bold text-slate-800 tracking-wider">REALTY</span>
    </div>
  );
}

export function MahindraLifespacesLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex flex-col leading-none ${className}`}>
      <span className="font-bold text-xs text-[#d32f2f]">mahindra</span>
      <span className="font-semibold text-[9px] text-slate-700">LIFESPACES</span>
    </div>
  );
}

export function PuravankaraLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className="font-black text-xs text-[#002f6c] tracking-tight">
        PURAVANKARA
      </span>
    </div>
  );
}


// --- HEALTHCARE LOGOS ---
export function KrimsLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-6 h-6 bg-[#008080] rounded flex items-center justify-center text-white font-bold text-xs">
        +
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-black text-xs sm:text-sm text-[#008080]">KRIMS</span>
        <span className="text-[8px] font-semibold text-slate-600">HOSPITALS</span>
      </div>
    </div>
  );
}

export function CareHospitalLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-6 h-6 rounded-full bg-[#e31837] flex items-center justify-center text-white font-bold text-xs">
        C
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-black text-xs sm:text-sm text-[#1e3c72]">CARE</span>
        <span className="text-[8px] font-bold text-[#e31837]">HOSPITALS</span>
      </div>
    </div>
  );
}

export function ApolloLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-6 h-6 bg-[#800000] text-yellow-400 rounded-full flex items-center justify-center font-serif font-bold text-xs">
        A
      </div>
      <span className="font-serif font-black text-xs sm:text-sm text-[#800000]">
        Apollo Hospitals
      </span>
    </div>
  );
}

export function FortisLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-5 h-5 bg-[#008000] rounded-sm flex items-center justify-center text-white font-bold text-[10px]">
        F
      </div>
      <span className="font-black text-xs sm:text-sm text-[#008000] tracking-wide">
        Fortis
      </span>
    </div>
  );
}

export function ManipalLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-bold text-xs sm:text-sm text-[#00386b]">
        Manipal <span className="text-[#e31837] font-extrabold">Hospitals</span>
      </span>
    </div>
  );
}

export function MaxHealthcareLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-serif font-black text-xs sm:text-sm text-[#005596]">
        Max <span className="text-slate-600 font-sans font-bold text-[10px]">Healthcare</span>
      </span>
    </div>
  );
}

export function HcgLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex flex-col leading-none ${className}`}>
      <span className="font-black text-xs sm:text-sm text-[#e31e24] tracking-wide">
        HCG
      </span>
      <span className="text-[8px] font-bold text-slate-600">The Specialist in Cancer Care</span>
    </div>
  );
}

export function MedantaLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className="font-serif font-black text-xs sm:text-sm text-[#007a3d]">
        Medanta
      </span>
      <span className="text-[8px] font-bold text-slate-500">THE MEDICITY</span>
    </div>
  );
}

export function NarayanaHealthLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex flex-col leading-none ${className}`}>
      <span className="font-black text-xs sm:text-sm text-[#004b87]">
        Narayana Health
      </span>
      <span className="text-[7.5px] text-slate-500 font-medium">Health for all. All for health.</span>
    </div>
  );
}

export function AsterLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-black text-xs sm:text-sm text-[#00a3e0]">
        Aster <span className="text-[#004b87] text-[10px]">DM HEALTHCARE</span>
      </span>
    </div>
  );
}

export function WockhardtLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-black text-xs sm:text-sm text-[#b8292f] tracking-wide">
        WOCKHARDT <span className="text-[9px] font-normal text-slate-600">Hospitals</span>
      </span>
    </div>
  );
}

export function AlexisLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-black text-xs sm:text-sm text-[#1b75bc]">
        Alexis <span className="text-xs font-semibold text-slate-600">Hospital</span>
      </span>
    </div>
  );
}


// --- EDUCATION LOGOS ---
export function AakashLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-6 h-6 rounded-full bg-[#005a9c] flex items-center justify-center text-white font-bold text-xs">
        A
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-black text-xs sm:text-sm text-[#005a9c]">Aakash</span>
        <span className="text-[8px] font-semibold text-slate-500">BYJU&apos;S</span>
      </div>
    </div>
  );
}

export function AllenLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-black text-base sm:text-lg text-[#0072ce] tracking-widest">
        ALLEN
      </span>
    </div>
  );
}

export function FiitjeeLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-black text-xs sm:text-sm text-[#d32f2f] tracking-widest">
        FIITJEE
      </span>
    </div>
  );
}

export function ResonanceLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-black text-xs sm:text-sm text-[#008080] tracking-wide">
        Resonance
      </span>
    </div>
  );
}

export function PriyadarshiniLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex flex-col leading-none ${className}`}>
      <span className="font-bold text-xs text-[#1e3a8a]">Priyadarshini</span>
      <span className="text-[8px] text-slate-500 font-medium">Group of Institutions</span>
    </div>
  );
}

export function RaisoniLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex flex-col leading-none ${className}`}>
      <span className="font-black text-xs sm:text-sm text-[#e31837]">RAISONI</span>
      <span className="text-[8px] text-slate-500 font-medium">Group of Institutions</span>
    </div>
  );
}

export function SymbiosisLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-serif font-black text-xs sm:text-sm text-[#800000]">
        SYMBIOSIS
      </span>
    </div>
  );
}

export function NarayanaGroupLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-black text-xs sm:text-sm text-[#ff6600]">
        NARAYANA
      </span>
    </div>
  );
}

export function SriChaitanyaLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex flex-col leading-none ${className}`}>
      <span className="font-serif font-black text-xs sm:text-sm text-[#003366]">
        Sri Chaitanya
      </span>
      <span className="text-[7.5px] text-[#ff6600] font-bold">EDUCATIONAL INSTITUTIONS</span>
    </div>
  );
}

export function PaceLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-black text-xs sm:text-sm text-[#005ba6] tracking-wider">
        PACE <span className="text-[9px] font-normal text-slate-600">IIT &amp; Medical</span>
      </span>
    </div>
  );
}

export function ByjusLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-5 h-5 bg-[#813588] rounded-full flex items-center justify-center text-white font-bold text-xs">
        B
      </div>
      <span className="font-black text-xs sm:text-sm text-[#813588]">BYJU&apos;S</span>
    </div>
  );
}

export function PhysicsWallahLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-xs">
        PW
      </div>
      <span className="font-black text-xs sm:text-sm text-black">PhysicsWallah</span>
    </div>
  );
}


// --- BUILDING & CONSTRUCTION LOGOS ---
export function AsianPaintsLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-5 h-5 bg-[#e31837] rounded-sm flex items-center justify-center text-white font-bold text-xs">
        ap
      </div>
      <span className="font-black text-xs sm:text-sm tracking-wider text-slate-900 uppercase">
        asianpaints
      </span>
    </div>
  );
}

export function UltratechLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-5 h-5 bg-[#ffcc00] rounded flex items-center justify-center text-slate-900 font-black text-xs">
        U
      </div>
      <span className="font-black text-xs sm:text-sm text-slate-900 tracking-wider">
        UltraTech
      </span>
    </div>
  );
}

export function AmbujaLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-5 h-5 rounded-full bg-[#005ba6] flex items-center justify-center text-white font-bold text-xs">
        A
      </div>
      <span className="font-black text-xs sm:text-sm text-[#005ba6] tracking-wider">
        Ambuja Cement
      </span>
    </div>
  );
}

export function AccCementLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="px-2 py-0.5 bg-[#e31e24] text-white font-black text-xs rounded">
        ACC
      </div>
      <span className="text-xs font-bold text-slate-800">Cement</span>
    </div>
  );
}

export function BergerPaintsLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-serif font-black text-xs sm:text-sm text-[#d41c24]">
        Berger <span className="font-sans text-[10px] font-bold text-slate-700">PAINTS</span>
      </span>
    </div>
  );
}

export function NerolacLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-black text-xs sm:text-sm text-[#008080]">
        NEROLAC
      </span>
    </div>
  );
}

export function PolycabLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-5 h-5 bg-[#e41e2b] rounded-full flex items-center justify-center text-white font-bold text-xs">
        P
      </div>
      <span className="font-black text-xs sm:text-sm text-[#e41e2b] tracking-wider uppercase">
        POLYCAB
      </span>
    </div>
  );
}

export function HavellsLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-5 h-5 bg-[#e31837] rounded-sm flex items-center justify-center text-white font-bold text-[10px]">
        H
      </div>
      <span className="font-black text-xs sm:text-sm text-[#e31837] tracking-wider">
        HAVELLS
      </span>
    </div>
  );
}

export function AstralPipesLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-black text-xs sm:text-sm text-[#004b87]">
        ASTRAL <span className="text-[9px] font-medium text-slate-500">PIPES</span>
      </span>
    </div>
  );
}

export function SupremeIndustriesLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-serif font-black text-xs sm:text-sm text-[#1c3f94]">
        Supreme <span className="font-sans text-[8px] font-bold text-slate-600">PIPING</span>
      </span>
    </div>
  );
}

export function FinolexLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-black text-xs sm:text-sm text-[#ed1c24]">
        Finolex <span className="text-[9px] text-slate-600 font-bold">PIPES</span>
      </span>
    </div>
  );
}

export function JswSteelLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-black text-xs sm:text-sm text-[#002f6c]">
        JSW <span className="text-[#e31837]">Steel</span>
      </span>
    </div>
  );
}


// --- TECHNOLOGY, ELECTRONICS & TELECOM LOGOS ---
export function InfosysLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="font-semibold text-xl sm:text-2xl tracking-tight text-[#007cc3] font-serif italic">
        Infosys
      </span>
    </div>
  );
}

export function TcsLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex flex-col leading-none ${className}`}>
      <span className="font-black text-xs sm:text-sm text-[#00529b] tracking-wider">
        TCS
      </span>
      <span className="text-[7.5px] font-bold text-slate-600">TATA CONSULTANCY SERVICES</span>
    </div>
  );
}

export function WiproLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#009b77] via-[#f7941d] to-[#7f3f98] flex items-center justify-center text-white text-[8px] font-bold">
        w
      </div>
      <span className="font-bold text-xs sm:text-sm text-slate-900">wipro</span>
    </div>
  );
}

export function AirtelLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-5 h-5 rounded-full bg-[#e40000] flex items-center justify-center text-white font-bold text-xs">
        a
      </div>
      <span className="font-black text-sm sm:text-base text-[#e40000] tracking-tight">
        airtel
      </span>
    </div>
  );
}

export function JioLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-6 h-6 rounded-full bg-[#004f9f] flex items-center justify-center text-white font-bold text-xs">
        Jio
      </div>
      <span className="font-black text-xs sm:text-sm text-[#004f9f]">Reliance Jio</span>
    </div>
  );
}

export function SamsungLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="font-black text-sm sm:text-base tracking-widest text-[#1428a0]">
        SAMSUNG
      </span>
    </div>
  );
}

export function VivoLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="font-black text-lg sm:text-xl tracking-tight text-[#415fff]">
        vivo
      </span>
    </div>
  );
}

export function OppoLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="font-bold text-lg sm:text-xl tracking-wider text-[#008060]">
        oppo
      </span>
    </div>
  );
}

export function XiaomiLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-5 h-5 bg-[#ff6700] rounded-sm flex items-center justify-center text-white font-bold text-[10px]">
        mi
      </div>
      <span className="font-bold text-xs sm:text-sm text-[#ff6700]">Xiaomi</span>
    </div>
  );
}

export function HpLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-6 h-6 rounded-full bg-[#0096d6] flex items-center justify-center text-white font-serif italic font-bold text-sm">
        hp
      </div>
    </div>
  );
}

export function DellLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="font-black text-sm sm:text-base tracking-wider text-[#007db8]">
        DELL
      </span>
    </div>
  );
}

export function DhlLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center bg-[#ffcc00] px-2.5 py-1 rounded-xs ${className}`}>
      <span className="font-black italic text-sm sm:text-base text-[#d40511] tracking-wider">
        DHL
      </span>
    </div>
  );
}

export function AuBankLogo({ className = "h-12 sm:h-14 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img src="/assets/client-logos/au-bank.png" alt="AU Bank" className="h-12 sm:h-14 w-auto object-contain" />
    </div>
  );
}

export function DcbBankLogo({ className = "h-12 sm:h-14 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img src="/assets/client-logos/dcb-bank.png" alt="DCB Bank" className="h-12 sm:h-14 w-auto object-contain" />
    </div>
  );
}

export function UnionBankLogo({ className = "h-12 sm:h-14 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img src="/assets/client-logos/union-bank.png" alt="Union Bank" className="h-12 sm:h-14 w-auto object-contain" />
    </div>
  );
}

export function TheDharampethLogo({ className = "h-12 sm:h-14 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img src="/assets/client-logos/the-dharampeth-mahila.png" alt="The Dharampeth" className="h-12 sm:h-14 w-auto object-contain" />
    </div>
  );
}

export function MaharashtraGrinBankLogo({ className = "h-12 sm:h-14 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img src="/assets/client-logos/maharastra-gramin-bank.png" alt="Maharashtra Gramin Bank" className="h-12 sm:h-14 w-auto object-contain" />
    </div>
  );
}

export function SaraswatBankLogo({ className = "h-12 sm:h-14 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img src="/assets/client-logos/sarasvat-bank.png" alt="Saraswat Bank" className="h-12 sm:h-14 w-auto object-contain" />
    </div>
  );
}

export function NnsbLogo({ className = "h-12 sm:h-14 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img src="/assets/client-logos/nnsb.png" alt="NNSB" className="h-12 sm:h-14 w-auto object-contain" />
    </div>
  );
}


// ==========================================
// CLIENT DATA STRUCTURE BY CATEGORY
// ==========================================

export type ClientLogoItem = {
  id: string;
  name: string;
  category: string;
  logo: React.ComponentType<{ className?: string }>;
};

export const CLIENT_LOGOS: ClientLogoItem[] = [
  // 1. Automotive (12 clients)
  { id: "audi", name: "Audi", category: "Automotive", logo: AudiLogo },
  { id: "mercedes", name: "Mercedes", category: "Automotive", logo: MercedesLogo },
  { id: "maruti-suzuki", name: "Maruti Suzuki", category: "Automotive", logo: MarutiSuzukiLogo },
  { id: "bmw", name: "BMW", category: "Automotive", logo: BMWLogo },
  { id: "triumph", name: "Triumph", category: "Automotive", logo: TriumphLogo },
  { id: "tata", name: "Tata Motors", category: "Automotive", logo: TataLogo },
  { id: "royal-enfield", name: "Royal Enfield", category: "Automotive", logo: RoyalEnfieldLogo },
  { id: "toyota", name: "Toyota", category: "Automotive", logo: ToyotaLogo },
  { id: "mahindra", name: "Mahindra", category: "Automotive", logo: MahindraLogo },
  { id: "volkswagen", name: "Volkswagen", category: "Automotive", logo: VolkswagenLogo },
  { id: "skoda", name: "Škoda Auto", category: "Automotive", logo: SkodaLogo },
  { id: "honda", name: "Honda", category: "Automotive", logo: HondaLogo },

  // 2. Banking & Finance (12 clients)
  { id: "sbi", name: "SBI", category: "Banking & Finance", logo: SbiLogo },
  { id: "hdfc", name: "HDFC", category: "Banking & Finance", logo: HdfcBankLogo },
  { id: "pnb", name: "PNB", category: "Banking & Finance", logo: PnbLogo },
  { id: "au-bank", name: "AU Bank", category: "Banking & Finance", logo: AuBankLogo },
  { id: "bob", name: "Bank of Baroda", category: "Banking & Finance", logo: BankOfBarodaLogo },
  { id: "dcb-bank", name: "DCB Bank", category: "Banking & Finance", logo: DcbBankLogo },
  { id: "esaf", name: "ESAF Bank", category: "Banking & Finance", logo: EsafLogo },
  { id: "union-bank", name: "Union Bank", category: "Banking & Finance", logo: UnionBankLogo },
  { id: "the-dharampeth", name: "The Dharampeth Mahila Sahakari Bank", category: "Banking & Finance", logo: TheDharampethLogo },
  { id: "maharastra-gramin-bank", name: "Maharashtra Gramin Bank", category: "Banking & Finance", logo: MaharashtraGrinBankLogo },
  { id: "sarasvat-bank", name: "Saraswat Bank", category: "Banking & Finance", logo: SaraswatBankLogo },
  { id: "nnsb", name: "NNSB Bank", category: "Banking & Finance", logo: NnsbLogo },

  // 3. FMCG & Quick Commerce (12 clients)
  { id: "coca-cola", name: "Coca-Cola", category: "FMCG", logo: CocaColaLogo },
  { id: "pepsi", name: "PepsiCo", category: "FMCG", logo: PepsiLogo },
  { id: "nestle", name: "Nestle", category: "FMCG", logo: NestleLogo },
  { id: "pg", name: "P&G", category: "FMCG", logo: PgLogo },
  { id: "hul", name: "Hindustan Unilever", category: "FMCG", logo: HulLogo },
  { id: "britannia", name: "Britannia", category: "FMCG", logo: BritanniaLogo },
  { id: "amul", name: "Amul", category: "FMCG", logo: AmulLogo },
  { id: "itc", name: "ITC Limited", category: "FMCG", logo: ItcLogo },
  { id: "dabur", name: "Dabur", category: "FMCG", logo: DaburLogo },
  { id: "zomato", name: "Zomato", category: "FMCG", logo: ZomatoLogo },
  { id: "swiggy", name: "Swiggy", category: "FMCG", logo: SwiggyLogo },
  { id: "blinkit", name: "Blinkit", category: "FMCG", logo: BlinkitLogo },

  // 4. Jewellery & Luxury (12 clients)
  { id: "tanishq", name: "Tanishq", category: "Jewellery & Luxury", logo: TanishqLogo },
  { id: "kalyan", name: "Kalyan Jewellers", category: "Jewellery & Luxury", logo: KalyanLogo },
  { id: "png", name: "PNG Jewellers", category: "Jewellery & Luxury", logo: PngJewellersLogo },
  { id: "malabar", name: "Malabar Gold", category: "Jewellery & Luxury", logo: MalabarLogo },
  { id: "joyalukkas", name: "Joyalukkas", category: "Jewellery & Luxury", logo: JoyalukkasLogo },
  { id: "senco", name: "Senco Gold", category: "Jewellery & Luxury", logo: SencoGoldLogo },
  { id: "tbz", name: "TBZ The Original", category: "Jewellery & Luxury", logo: TbzLogo },
  { id: "pcj", name: "PC Jeweller", category: "Jewellery & Luxury", logo: PcJewellerLogo },
  { id: "caratlane", name: "CaratLane", category: "Jewellery & Luxury", logo: CaratLaneLogo },
  { id: "bhima", name: "Bhima Jewellery", category: "Jewellery & Luxury", logo: BhimaLogo },
  { id: "lalitha", name: "Lalithaa Jewellery", category: "Jewellery & Luxury", logo: LalithaJewelleryLogo },
  { id: "grt", name: "GRT Jewellers", category: "Jewellery & Luxury", logo: GrtJewellersLogo },

  // 5. Real Estate & Infrastructure (12 clients)
  { id: "godrej", name: "Godrej Properties", category: "Real Estate", logo: GodrejLogo },
  { id: "kalpataru", name: "Kalpataru", category: "Real Estate", logo: KalpataruLogo },
  { id: "sdpl", name: "SDPL Builders", category: "Real Estate", logo: SdplLogo },
  { id: "dlf", name: "DLF Building India", category: "Real Estate", logo: DlfLogo },
  { id: "lodha", name: "Lodha Group", category: "Real Estate", logo: LodhaLogo },
  { id: "prestige", name: "Prestige Group", category: "Real Estate", logo: PrestigeLogo },
  { id: "sobha", name: "Sobha", category: "Real Estate", logo: SobhaLogo },
  { id: "brigade", name: "Brigade Group", category: "Real Estate", logo: BrigadeLogo },
  { id: "hiranandani", name: "Hiranandani Communities", category: "Real Estate", logo: HiranandaniLogo },
  { id: "oberoi", name: "Oberoi Realty", category: "Real Estate", logo: OberoiRealtyLogo },
  { id: "mahindra-lifespaces", name: "Mahindra Lifespaces", category: "Real Estate", logo: MahindraLifespacesLogo },
  { id: "puravankara", name: "Puravankara", category: "Real Estate", logo: PuravankaraLogo },

  // 6. Healthcare & Hospitals (12 clients)
  { id: "krims", name: "Krims Hospital", category: "Healthcare", logo: KrimsLogo },
  { id: "care", name: "Care Hospitals", category: "Healthcare", logo: CareHospitalLogo },
  { id: "apollo", name: "Apollo Hospitals", category: "Healthcare", logo: ApolloLogo },
  { id: "fortis", name: "Fortis Healthcare", category: "Healthcare", logo: FortisLogo },
  { id: "manipal", name: "Manipal Hospitals", category: "Healthcare", logo: ManipalLogo },
  { id: "max", name: "Max Healthcare", category: "Healthcare", logo: MaxHealthcareLogo },
  { id: "hcg", name: "HCG Cancer Hospital", category: "Healthcare", logo: HcgLogo },
  { id: "medanta", name: "Medanta The Medicity", category: "Healthcare", logo: MedantaLogo },
  { id: "narayana", name: "Narayana Health", category: "Healthcare", logo: NarayanaHealthLogo },
  { id: "aster", name: "Aster DM Healthcare", category: "Healthcare", logo: AsterLogo },
  { id: "wockhardt", name: "Wockhardt Hospitals", category: "Healthcare", logo: WockhardtLogo },
  { id: "alexis", name: "Alexis Hospital", category: "Healthcare", logo: AlexisLogo },

  // 7. Education & EdTech (12 clients)
  { id: "aakash", name: "Aakash Institute", category: "Education", logo: AakashLogo },
  { id: "allen", name: "Allen Career Institute", category: "Education", logo: AllenLogo },
  { id: "fiitjee", name: "FIITJEE", category: "Education", logo: FiitjeeLogo },
  { id: "resonance", name: "Resonance", category: "Education", logo: ResonanceLogo },
  { id: "priyadarshini", name: "Priyadarshini Group", category: "Education", logo: PriyadarshiniLogo },
  { id: "raisoni", name: "Raisoni Group", category: "Education", logo: RaisoniLogo },
  { id: "symbiosis", name: "Symbiosis", category: "Education", logo: SymbiosisLogo },
  { id: "narayana-edu", name: "Narayana Group", category: "Education", logo: NarayanaGroupLogo },
  { id: "sri-chaitanya", name: "Sri Chaitanya", category: "Education", logo: SriChaitanyaLogo },
  { id: "pace", name: "PACE IIT & Medical", category: "Education", logo: PaceLogo },
  { id: "byjus", name: "BYJU'S", category: "Education", logo: ByjusLogo },
  { id: "pw", name: "PhysicsWallah", category: "Education", logo: PhysicsWallahLogo },

  // 8. Building, Electrical & Construction (12 clients)
  { id: "asian-paints", name: "Asian Paints", category: "Building & Construction", logo: AsianPaintsLogo },
  { id: "ultratech", name: "UltraTech Cement", category: "Building & Construction", logo: UltratechLogo },
  { id: "ambuja", name: "Ambuja Cement", category: "Building & Construction", logo: AmbujaLogo },
  { id: "acc", name: "ACC Cement", category: "Building & Construction", logo: AccCementLogo },
  { id: "berger", name: "Berger Paints", category: "Building & Construction", logo: BergerPaintsLogo },
  { id: "nerolac", name: "Nerolac", category: "Building & Construction", logo: NerolacLogo },
  { id: "polycab", name: "Polycab", category: "Building & Construction", logo: PolycabLogo },
  { id: "havells", name: "Havells", category: "Building & Construction", logo: HavellsLogo },
  { id: "astral", name: "Astral Pipes", category: "Building & Construction", logo: AstralPipesLogo },
  { id: "supreme", name: "Supreme Piping", category: "Building & Construction", logo: SupremeIndustriesLogo },
  { id: "finolex", name: "Finolex Pipes", category: "Building & Construction", logo: FinolexLogo },
  { id: "jsw", name: "JSW Steel", category: "Building & Construction", logo: JswSteelLogo },

  // 9. Technology & Telecom (12 clients)
  { id: "infosys", name: "Infosys", category: "Technology", logo: InfosysLogo },
  { id: "tcs", name: "TCS", category: "Technology", logo: TCSLogoSafe },
  { id: "wipro", name: "Wipro", category: "Technology", logo: WiproLogo },
  { id: "airtel", name: "Airtel", category: "Technology", logo: AirtelLogo },
  { id: "jio", name: "Reliance Jio", category: "Technology", logo: JioLogo },
  { id: "samsung", name: "Samsung", category: "Technology", logo: SamsungLogo },
  { id: "vivo", name: "Vivo", category: "Technology", logo: VivoLogo },
  { id: "oppo", name: "Oppo", category: "Technology", logo: OppoLogo },
  { id: "xiaomi", name: "Xiaomi", category: "Technology", logo: XiaomiLogo },
  { id: "hp", name: "HP", category: "Technology", logo: HpLogo },
  { id: "dell", name: "Dell", category: "Technology", logo: DellLogo },
  { id: "dhl", name: "DHL Express", category: "Technology", logo: DhlLogo },
];

function TCSLogoSafe({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return <TcsLogo className={className} />;
}

export const CATEGORIES_LIST = [
  "Automotive",
  "Banking & Finance",
  "FMCG",
  "Jewellery & Luxury",
  "Real Estate",
  "Healthcare",
  "Education",
  "Building & Construction",
  "Technology"
];

// Flat list for marquee
const ALL_COMPANIES_FLAT = [
  "Audi", "Mercedes", "Maruti Suzuki", "BMW", "Triumph", "Tata Motors", "Royal Enfield", "Toyota", "Mahindra", "Volkswagen", "Škoda", "Honda",
  "SBI", "HDFC", "PNB", "AU Bank", "Bank of Baroda", "DCB Bank", "ESAF", "Union Bank", "The Dharampeth", "Maharashtra Gramin Bank", "Saraswat Bank", "NNSB",
  "Coca-Cola", "PepsiCo", "Nestlé", "P&G", "Hindustan Unilever", "Britannia", "Amul", "ITC", "Dabur", "Zomato", "Swiggy", "Blinkit",
  "Tanishq", "Kalyan Jewellers", "PNG Jewellers", "Malabar Gold", "Joyalukkas", "Senco Gold", "TBZ", "PC Jeweller", "CaratLane", "Bhima", "Lalithaa", "GRT",
  "Godrej Properties", "Kalpataru", "SDPL", "DLF", "Lodha", "Prestige", "Sobha", "Brigade", "Hiranandani", "Oberoi Realty", "Mahindra Lifespaces", "Puravankara",
  "Krims Hospital", "Care Hospitals", "Apollo Hospitals", "Fortis", "Manipal", "Max Healthcare", "HCG Cancer Care", "Medanta", "Narayana Health", "Aster DM", "Wockhardt", "Alexis",
  "Aakash Institute", "Allen", "FIITJEE", "Resonance", "Priyadarshini", "Raisoni", "Symbiosis", "Narayana", "Sri Chaitanya", "PACE", "BYJU'S", "PhysicsWallah",
  "Asian Paints", "UltraTech Cement", "Ambuja Cement", "ACC Cement", "Berger Paints", "Nerolac", "Polycab", "Havells", "Astral", "Supreme", "Finolex", "JSW Steel",
  "Infosys", "TCS", "Wipro", "Airtel", "Jio", "Samsung", "Vivo", "Oppo", "Xiaomi", "HP", "Dell", "DHL"
];

export default function TopCompaniesSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Automotive");

  const filteredLogos = CLIENT_LOGOS.filter(c => c.category === selectedCategory);

  return (
    <section id="clients" className="py-20 md:py-24 bg-[#fafbfc] overflow-hidden border-t border-slate-200/80">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        
        {/* 1. HEADING & SUBHEADING */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
            Top Companies We&apos;ve Worked With
          </h2>
          <p className="text-base sm:text-lg text-slate-500 font-medium">
            Leading brands choose TrueSign Media for their Branding Solutions.
          </p>
        </div>

        {/* 2. CAROUSEL (Logo Slider / Marquee) */}
        <div className="relative flex overflow-x-hidden mb-12 sm:mb-16 group">
          <div className="py-4 animate-marquee whitespace-nowrap flex items-center gap-10 sm:gap-16 px-6">
            {ALL_COMPANIES_FLAT.map((client, i) => (
              <span 
                key={i} 
                className="text-xl sm:text-3xl font-black text-slate-300 hover:text-slate-800 transition-colors cursor-default select-none tracking-tight"
              >
                {client}
              </span>
            ))}
          </div>
          <div className="absolute top-0 py-4 animate-marquee2 whitespace-nowrap flex items-center gap-10 sm:gap-16 px-6 ml-6">
            {ALL_COMPANIES_FLAT.map((client, i) => (
              <span 
                key={`dup-${i}`} 
                className="text-xl sm:text-3xl font-black text-slate-300 hover:text-slate-800 transition-colors cursor-default select-none tracking-tight"
              >
                {client}
              </span>
            ))}
          </div>

          {/* Clean Fade Masks */}
          <div className="absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-[#fafbfc] to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-[#fafbfc] to-transparent pointer-events-none z-10" />
        </div>

        {/* 3. CATEGORY BUTTONS */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth">
            {CATEGORIES_LIST.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 ${
                    isSelected
                      ? "bg-[#6355d8] text-white shadow-md shadow-indigo-500/20"
                      : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80 shadow-xs hover:border-slate-300"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. CLIENT LOGO GRID (12 Sharp Edged Rectangular Boxes Per Category) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredLogos.map((client) => {
            const LogoComponent = client.logo;
            return (
              <div
                key={client.id}
                className="bg-white rounded-none border border-slate-200/90 p-6 sm:p-8 flex items-center justify-center min-h-[110px] sm:min-h-[135px] shadow-xs hover:shadow-md hover:border-slate-400 hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div className="transition-transform duration-300 group-hover:scale-105 flex items-center justify-center text-center">
                  <LogoComponent />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
