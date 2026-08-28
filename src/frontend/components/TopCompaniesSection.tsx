"use client";

import React, { useState } from "react";

// ==========================================
// BRAND LOGO VECTOR COMPONENTS
// ==========================================

export function TataLogo({ className = "h-8 sm:h-10 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg className="h-7 sm:h-8 w-auto text-[#00529b]" viewBox="0 0 100 70" fill="currentColor">
        <path d="M50 0C22.4 0 0 15.7 0 35c0 19.3 22.4 35 50 35s50-15.7 50-35C100 15.7 77.6 0 50 0zm0 62C27.9 62 10 49.9 10 35S27.9 8 50 8s40 12.1 40 27-17.9 27-40 27z" />
        <path d="M43 20h14v7h-3.5v22h-7V27H43v-7zm-14 7h10v6h-10v-6zm32 0h10v6h-10v-6z" />
      </svg>
      <span className="font-black text-lg sm:text-xl tracking-[0.2em] text-[#00529b] font-sans">
        TATA
      </span>
    </div>
  );
}

export function AdaniLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-bold text-2xl sm:text-3xl tracking-tight bg-gradient-to-r from-[#005cb9] via-[#85458a] to-[#d6204b] bg-clip-text text-transparent font-sans">
        adani
      </span>
    </div>
  );
}

export function InfosysLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="font-semibold text-2xl sm:text-3xl tracking-tight text-[#007cc3] font-serif italic">
        Infosys
      </span>
    </div>
  );
}

export function HdfcBankLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#004c8f] rounded flex items-center justify-center p-1 relative">
        <div className="w-full h-full border-2 border-white relative flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-[#ed232a]"></div>
        </div>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-black text-xs sm:text-sm tracking-wider text-[#004c8f]">HDFC BANK</span>
        <span className="text-[7.5px] font-bold text-slate-500 tracking-tight">We understand your world</span>
      </div>
    </div>
  );
}

export function SbiLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#00a1e0] flex items-center justify-center relative shadow-xs">
        <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
        <div className="absolute bottom-0 w-1 h-3.5 bg-white"></div>
      </div>
      <span className="font-black text-xl sm:text-2xl text-[#280071] tracking-tight font-sans">
        SBI
      </span>
    </div>
  );
}

export function DhlLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center px-4 py-1.5 bg-[#ffcc00] rounded-md shadow-xs ${className}`}>
      <span className="font-black text-xl sm:text-2xl italic tracking-tighter text-[#d40511] font-sans">
        DHL
      </span>
    </div>
  );
}

export function CocaColaLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="font-serif font-black text-2xl sm:text-3xl tracking-tight text-[#f40009] italic">
        Coca-Cola
      </span>
    </div>
  );
}

export function AsianPaintsLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-[#e31837] via-[#ffc20e] to-[#e31837] flex items-center justify-center text-white font-black text-xs">
        ap
      </div>
      <span className="font-bold text-base sm:text-lg text-[#231f20] tracking-tight">
        asian<span className="text-[#e31837] font-extrabold">paints</span>
      </span>
    </div>
  );
}

export function MarutiSuzukiLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#e2001a] rounded flex items-center justify-center text-white font-black text-sm italic">
        S
      </div>
      <span className="font-black text-xs sm:text-sm tracking-wider text-[#002868] uppercase">
        MARUTI SUZUKI
      </span>
    </div>
  );
}

export function NestleLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="font-serif font-bold text-xl sm:text-2xl text-[#6d6e71] tracking-tight">
        Nestlé
      </span>
    </div>
  );
}

export function PgLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#003cae] flex items-center justify-center shadow-xs">
        <span className="text-white font-black text-xs sm:text-sm tracking-tighter italic font-serif">
          P&G
        </span>
      </div>
    </div>
  );
}

export function VivoLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="font-black text-2xl sm:text-3xl tracking-tight text-[#415fff] font-sans">
        vivo
      </span>
    </div>
  );
}

export function TanishqLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-6 h-6 rounded-full border-2 border-[#a27b34] flex items-center justify-center text-[#a27b34] font-serif font-bold text-xs">
        T
      </div>
      <span className="font-serif font-bold text-base sm:text-lg text-[#855e1a] tracking-widest">
        TANISHQ
      </span>
    </div>
  );
}

export function KalyanLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center leading-none ${className}`}>
      <span className="font-serif font-black text-base sm:text-lg text-[#941c2f] tracking-widest">
        KALYAN
      </span>
      <span className="text-[8px] font-bold text-[#b48833] tracking-widest mt-0.5">JEWELLERS</span>
    </div>
  );
}

export function PngJewellersLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-7 h-7 rounded bg-[#85191b] flex items-center justify-center text-[#e5b358] font-serif font-bold text-xs">
        PNG
      </div>
      <span className="font-serif font-bold text-xs sm:text-sm text-[#85191b] tracking-wider">
        P. N. GADGIL
      </span>
    </div>
  );
}

export function HyundaiLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-7 h-5 border-2 border-[#002c5f] rounded-[50%] flex items-center justify-center transform -skew-x-12">
        <span className="text-[#002c5f] font-bold text-xs italic">H</span>
      </div>
      <span className="font-black text-xs sm:text-sm tracking-widest text-[#002c5f]">
        HYUNDAI
      </span>
    </div>
  );
}

export function TvsLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-black text-xl sm:text-2xl italic tracking-tight text-[#003399]">
        TVS <span className="text-[#e2001a] text-sm">MOTOR</span>
      </span>
    </div>
  );
}

export function PnbLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-7 h-7 rounded-full bg-[#a20d29] flex items-center justify-center text-[#ffc800] font-black text-[10px]">
        pnb
      </div>
      <span className="font-bold text-xs sm:text-sm text-[#a20d29] tracking-tight">
        punjab national bank
      </span>
    </div>
  );
}

export function IciciBankLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-6 h-6 rounded-full bg-[#b8281a] flex items-center justify-center text-white font-bold text-xs">
        i
      </div>
      <span className="font-bold text-xs sm:text-sm text-[#053c6d] tracking-tight">
        ICICI <span className="text-[#b8281a]">Bank</span>
      </span>
    </div>
  );
}

export function GodrejLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="font-serif font-black text-2xl sm:text-3xl tracking-tight text-[#00833e] italic">
        Godrej
      </span>
    </div>
  );
}

export function KalpataruLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-6 h-6 rounded-full bg-[#004831] flex items-center justify-center text-white font-serif text-xs">
        K
      </div>
      <span className="font-serif font-bold text-xs sm:text-sm text-[#004831] tracking-widest">
        KALPATARU
      </span>
    </div>
  );
}

export function UltratechLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center px-3 py-1 bg-[#ffdd00] rounded border border-yellow-400 ${className}`}>
      <span className="font-black text-xs sm:text-sm tracking-tight text-[#e31b23]">
        UltraTech <span className="text-black font-extrabold text-[10px]">CEMENT</span>
      </span>
    </div>
  );
}

export function AmbujaLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-6 h-6 bg-[#005ba3] flex items-center justify-center text-white font-bold text-xs rounded-sm">
        A
      </div>
      <span className="font-bold text-xs sm:text-sm text-[#005ba3] tracking-wider">
        Ambuja <span className="font-normal text-slate-600">Cement</span>
      </span>
    </div>
  );
}

export function PolycabLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-6 h-6 rounded-full bg-[#e31e24] flex items-center justify-center text-white font-black text-xs">
        P
      </div>
      <span className="font-black text-sm sm:text-base text-[#e31e24] tracking-tight">
        POLYCAB
      </span>
    </div>
  );
}

export function ZomatoLogo({ className = "h-6 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="font-black text-2xl sm:text-3xl tracking-tight text-[#cb202d] italic font-sans">
        zomato
      </span>
    </div>
  );
}

export function SwiggyLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-6 h-6 bg-[#fc8019] rounded-full flex items-center justify-center text-white font-bold text-xs">
        S
      </div>
      <span className="font-black text-base sm:text-lg text-[#fc8019] tracking-wider font-sans">
        SWIGGY
      </span>
    </div>
  );
}

export function BlinkitLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center px-3 py-1 bg-[#f8cb46] rounded-md ${className}`}>
      <span className="font-bold text-base sm:text-lg text-[#0c831f] tracking-tight">
        blink<span className="text-black font-extrabold">it</span>
      </span>
    </div>
  );
}

export function KrimsLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-6 h-6 rounded-full bg-[#0088cc] flex items-center justify-center text-white font-bold text-xs">
        +
      </div>
      <span className="font-bold text-xs sm:text-sm text-[#0088cc] tracking-tight">
        KRIMS <span className="text-slate-700 font-medium">Hospitals</span>
      </span>
    </div>
  );
}

export function AakashLogo({ className = "h-7 sm:h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-6 h-6 rounded-full bg-[#0072bc] flex items-center justify-center text-[#ffcc00] font-black text-xs">
        ✦
      </div>
      <span className="font-bold text-sm sm:text-base text-[#0072bc] tracking-tight">
        Aakash <span className="text-xs font-semibold text-slate-500">BYJU&apos;S</span>
      </span>
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
  // Row 1 (As seen in Mockup)
  { id: "tata", name: "Tata", category: "Automotive", logo: TataLogo },
  { id: "adani", name: "Adani", category: "Technology", logo: AdaniLogo },
  { id: "infosys", name: "Infosys", category: "Technology", logo: InfosysLogo },
  { id: "hdfc", name: "HDFC Bank", category: "Banking & Finance", logo: HdfcBankLogo },

  // Row 2 (As seen in Mockup)
  { id: "sbi", name: "SBI", category: "Banking & Finance", logo: SbiLogo },
  { id: "dhl", name: "DHL", category: "Technology", logo: DhlLogo },
  { id: "coca-cola", name: "Coca-Cola", category: "FMCG", logo: CocaColaLogo },
  { id: "asian-paints", name: "Asian Paints", category: "Building & Construction", logo: AsianPaintsLogo },

  // Row 3 (As seen in Mockup)
  { id: "maruti-suzuki", name: "Maruti Suzuki", category: "Automotive", logo: MarutiSuzukiLogo },
  { id: "nestle", name: "Nestle", category: "FMCG", logo: NestleLogo },
  { id: "pg", name: "P&G", category: "FMCG", logo: PgLogo },
  { id: "vivo", name: "Vivo", category: "Technology", logo: VivoLogo },

  // Additional Brands Across Categories
  { id: "tanishq", name: "Tanishq", category: "Jewellery & Luxury", logo: TanishqLogo },
  { id: "kalyan", name: "Kalyan Jewellers", category: "Jewellery & Luxury", logo: KalyanLogo },
  { id: "png", name: "PNG Jewellers", category: "Jewellery & Luxury", logo: PngJewellersLogo },
  { id: "hyundai", name: "Hyundai", category: "Automotive", logo: HyundaiLogo },
  { id: "tvs", name: "TVS Motor", category: "Automotive", logo: TvsLogo },
  { id: "pnb", name: "Punjab National Bank", category: "Banking & Finance", logo: PnbLogo },
  { id: "icici", name: "ICICI Bank", category: "Banking & Finance", logo: IciciBankLogo },
  { id: "godrej", name: "Godrej Properties", category: "Real Estate", logo: GodrejLogo },
  { id: "kalpataru", name: "Kalpataru", category: "Real Estate", logo: KalpataruLogo },
  { id: "ultratech", name: "UltraTech Cement", category: "Building & Construction", logo: UltratechLogo },
  { id: "ambuja", name: "Ambuja Cement", category: "Building & Construction", logo: AmbujaLogo },
  { id: "polycab", name: "Polycab", category: "Building & Construction", logo: PolycabLogo },
  { id: "zomato", name: "Zomato", category: "FMCG", logo: ZomatoLogo },
  { id: "swiggy", name: "Swiggy", category: "FMCG", logo: SwiggyLogo },
  { id: "blinkit", name: "Blinkit", category: "FMCG", logo: BlinkitLogo },
  { id: "krims", name: "Krims Hospital", category: "Healthcare", logo: KrimsLogo },
  { id: "aakash", name: "Aakash Institute", category: "Education", logo: AakashLogo },
];

export const CATEGORIES_LIST = [
  "All Clients",
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
  "Suzuki Motors", "TVS", "Punjab National Bank", "ESAF Bank", "Kalpataru", 
  "Godrej Properties", "Krims Hospital", "HCG Hospital", "UltraTech Cement", 
  "Ambuja Cement", "PNG Jewellers", "Tanishq Jewellers", "Polycab Wires", 
  "Blinkit", "Zomato", "Swiggy", "SDPL", "Priyadarshini", "Aakash Institute", "Allen"
];

export default function TopCompaniesSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Clients");

  const filteredLogos = selectedCategory === "All Clients"
    ? CLIENT_LOGOS
    : CLIENT_LOGOS.filter(c => c.category === selectedCategory);

  return (
    <section id="clients" className="py-20 md:py-24 bg-[#fafbfc] overflow-hidden border-t border-slate-200/80">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        
        {/* 1. HEADING & SUBHEADING (Preserved Intact) */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
            Top Companies We&apos;ve Worked With
          </h2>
          <p className="text-base sm:text-lg text-slate-500 font-medium">
            Leading brands choose TrueSign Media for their Branding Solutions.
          </p>
        </div>

        {/* 2. CAROUSEL (Logo Slider / Marquee - Preserved Intact) */}
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

        {/* 3. CATEGORY BUTTONS (Filter pills based on mockup item 4) */}
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

        {/* 4. CLIENT LOGO GRID (4 columns Desktop / 2 columns Mobile based on mockup item 5) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredLogos.map((client) => {
            const LogoComponent = client.logo;
            return (
              <div
                key={client.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 flex items-center justify-center min-h-[110px] sm:min-h-[135px] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-lg hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="transition-transform duration-300 group-hover:scale-105 flex items-center justify-center">
                  <LogoComponent />
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State Fallback (if any category has 0 items) */}
        {filteredLogos.length === 0 && (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200/80 p-8">
            <p className="text-sm font-semibold text-slate-500">
              No clients found in {selectedCategory}.
            </p>
            <button
              onClick={() => setSelectedCategory("All Clients")}
              className="mt-3 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all"
            >
              Show All Clients
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
