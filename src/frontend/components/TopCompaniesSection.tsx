"use client";

import { useState } from "react";
import { 
  ArrowRight, 
  Building2, 
  Gem, 
  Car, 
  Landmark, 
  Home, 
  HeartPulse, 
  GraduationCap, 
  Hammer, 
  ShoppingBag,
  CheckCircle2,
  ChevronRight,
  Layers,
  X
} from "lucide-react";

export type Company = {
  name: string;
  tagline: string;
  campaignType: string;
  featured?: boolean;
};

export type Category = {
  id: string;
  name: string;
  shortName: string;
  icon: any;
  color: string;
  bgLight: string;
  borderColor: string;
  companies: Company[];
};

export const CATEGORIES_DATA: Category[] = [
  {
    id: "jewellery",
    name: "Jewellery & Luxury",
    shortName: "Jewellery",
    icon: Gem,
    color: "text-amber-600",
    bgLight: "bg-amber-50",
    borderColor: "border-amber-200",
    companies: [
      { name: "PNG Jewellers", tagline: "Heritage Gold & Diamond Jewellery", campaignType: "Highway Unipoles & City Hoardings", featured: true },
      { name: "Tanishq Jewellers", tagline: "Tata's Premier Jewellery Brand", campaignType: "Prime High-Street Digital Billboards", featured: true },
      { name: "Kalyan Jewellers", tagline: "Traditional & Wedding Jewellery", campaignType: "Festival Season Citywide Campaigns", featured: true },
      { name: "Malabar Gold & Diamonds", tagline: "Global Jewellery Brand", campaignType: "Major Junction Gantries & Hoardings" },
      { name: "TBZ - The Original", tagline: "Iconic Luxury Jewellery Since 1864", campaignType: "Premium Mall & Metro Hoardings" },
      { name: "Senco Gold & Diamonds", tagline: "Artisanal Handcrafted Jewellery", campaignType: "Airport Road Billboards" },
      { name: "Joyalukkas", tagline: "World's Favourite Jeweller", campaignType: "Regional Retail Billboards" }
    ]
  },
  {
    id: "automobile",
    name: "Automobile & Motors",
    shortName: "Automobile",
    icon: Car,
    color: "text-blue-600",
    bgLight: "bg-blue-50",
    borderColor: "border-blue-200",
    companies: [
      { name: "Suzuki Motors", tagline: "India's No. 1 Passenger Vehicle Brand", campaignType: "Highway Large Format Billboards", featured: true },
      { name: "TVS Motor Company", tagline: "Leading Two & Three-Wheeler Maker", campaignType: "Multi-City Launch Campaigns", featured: true },
      { name: "Tata Motors", tagline: "Next-Gen Commercial & EV Mobility", campaignType: "Prime Traffic Junction Gantries", featured: true },
      { name: "Hyundai Motors", tagline: "Smart Mobility & SUV Campaigns", campaignType: "Ring Road & Expressway Unipoles" },
      { name: "Mahindra & Mahindra", tagline: "Authentic SUV Specialist", campaignType: "Arterial Road Hoardings" },
      { name: "Hero MotoCorp", tagline: "World's Largest 2-Wheeler Manufacturer", campaignType: "Tier-2 & Tier-3 City Networks" },
      { name: "Royal Enfield", tagline: "Pure Motorcycling Experiences", campaignType: "Youth Hub & Iconic Highway Hoardings" }
    ]
  },
  {
    id: "banking",
    name: "Banking & Finance",
    shortName: "Banking",
    icon: Landmark,
    color: "text-indigo-600",
    bgLight: "bg-indigo-50",
    borderColor: "border-indigo-200",
    companies: [
      { name: "Punjab National Bank", tagline: "Trusted Public Sector Banking Since 1894", campaignType: "City Center Commercial Displays", featured: true },
      { name: "ESAF Small Finance Bank", tagline: "Joy of Banking & Micro-Loans", campaignType: "Regional Branch Branding Networks", featured: true },
      { name: "State Bank of India", tagline: "The Banker to Every Indian", campaignType: "High-Traffic Hubs & Bus Shelters", featured: true },
      { name: "HDFC Bank", tagline: "India's Leading Private Sector Bank", campaignType: "Financial District Gantries" },
      { name: "ICICI Bank", tagline: "Comprehensive Digital & Retail Banking", campaignType: "Metro Pillars & Digital Billboards" },
      { name: "Axis Bank", tagline: "Open Financial Opportunities", campaignType: "Suburban Arterial Billboards" },
      { name: "Bajaj Finance", tagline: "Instant Consumer & Business Loans", campaignType: "High Footfall Commercial Corridors" }
    ]
  },
  {
    id: "real-estate",
    name: "Real Estate & Infrastructure",
    shortName: "Real Estate",
    icon: Home,
    color: "text-emerald-600",
    bgLight: "bg-emerald-50",
    borderColor: "border-emerald-200",
    companies: [
      { name: "Godrej Properties", tagline: "Premium Sustainable Residential Living", campaignType: "Expressway Luxury Hoardings", featured: true },
      { name: "Kalpataru Group", tagline: "Iconic Landmarks & Luxury Towers", campaignType: "City Gateway Unipoles", featured: true },
      { name: "SDPL Builders", tagline: "Trusted Central India Developers", campaignType: "Township & Metro Billboards", featured: true },
      { name: "Rachana Construction", tagline: "Prime Urban Homes & Commercial Hubs", campaignType: "Suburban Junction Signages" },
      { name: "Kukreja Infrastructure", tagline: "Luxury High-Rises & Commercial Parks", campaignType: "Prime High-Street Billboards" },
      { name: "Mahindra Lifespaces", tagline: "Joyful Spaces & Green Townships", campaignType: "Flyover & Highway Billboards" }
    ]
  },
  {
    id: "healthcare",
    name: "Healthcare & Hospitals",
    shortName: "Healthcare",
    icon: HeartPulse,
    color: "text-rose-600",
    bgLight: "bg-rose-50",
    borderColor: "border-rose-200",
    companies: [
      { name: "Krims Hospitals", tagline: "Pioneering Multi-Speciality Care", campaignType: "Key Junction Awareness Boards", featured: true },
      { name: "HCG Cancer Centre", tagline: "Specialist Oncology & Research Care", campaignType: "Health Corridor Unipoles", featured: true },
      { name: "Care Hospitals", tagline: "Comprehensive Tertiary Healthcare", campaignType: "Hospital Road Gantry Network", featured: true },
      { name: "Wockhardt Hospitals", tagline: "Life Wins Everyday - Super Speciality", campaignType: "Central Highway Billboards" },
      { name: "Alexis Hospital", tagline: "Advanced Multispeciality Facilities", campaignType: "Metro Station & Pillar Branding" },
      { name: "Kingsway Hospital", tagline: "World-Class Multi-Disciplinary Care", campaignType: "City Center Flyover Displays" }
    ]
  },
  {
    id: "education",
    name: "Education & Coaching",
    shortName: "Education",
    icon: GraduationCap,
    color: "text-sky-600",
    bgLight: "bg-sky-50",
    borderColor: "border-sky-200",
    companies: [
      { name: "Aakash Institute", tagline: "NEET & IIT-JEE Exam Coaching Leader", campaignType: "Student Hub Mega Billboards", featured: true },
      { name: "Allen Career Institute", tagline: "Proven Excellence in Competitive Exams", campaignType: "Admission Season City Campaigns", featured: true },
      { name: "Priyadarshini Group", tagline: "Leading Engineering & Tech Colleges", campaignType: "Youth Corridor & Ring Road Unipoles", featured: true },
      { name: "Raisoni Group", tagline: "Universities & Professional Institutions", campaignType: "Campus Corridor Large Formats" },
      { name: "FIITJEE", tagline: "Premier Forum for IIT-JEE Prep", campaignType: "Metro Pillars & Transit Media" },
      { name: "Resonance", tagline: "Educating for Better Tomorrow", campaignType: "School Zone Hoardings" }
    ]
  },
  {
    id: "construction",
    name: "Building & Construction",
    shortName: "Construction",
    icon: Hammer,
    color: "text-teal-600",
    bgLight: "bg-teal-50",
    borderColor: "border-teal-200",
    companies: [
      { name: "UltraTech Cement", tagline: "The Engineer's Choice - No. 1 Cement", campaignType: "National Highway Mega Unipoles", featured: true },
      { name: "Ambuja Cement", tagline: "Giant Compressive Strength", campaignType: "Strategic Transport Corridors", featured: true },
      { name: "Polycab Wires", tagline: "Connection Zindagi Ka - Wires & Cables", campaignType: "City Flyover & Overhead Gantries", featured: true },
      { name: "ACC Cement", tagline: "Cementing India's Heritage", campaignType: "Industrial Highway Gantries" },
      { name: "Finolex Cables", tagline: "Be Safe, Be Sure - Electric Wire Leader", campaignType: "Commercial Market Hoardings" },
      { name: "Havells India", tagline: "Making a Difference - Modern Electronics", campaignType: "City Center Lit Billboards" }
    ]
  },
  {
    id: "retail",
    name: "E-Commerce & Quick Commerce",
    shortName: "Retail & Tech",
    icon: ShoppingBag,
    color: "text-slate-700",
    bgLight: "bg-slate-100",
    borderColor: "border-slate-300",
    companies: [
      { name: "Blinkit", tagline: "10-Minute Grocery Delivery Leader", campaignType: "Hyperlocal Residential Billboards", featured: true },
      { name: "Zomato", tagline: "Never Have a Bad Meal", campaignType: "High-Traffic Fun & Contextual Hoardings", featured: true },
      { name: "Swiggy", tagline: "Food, Groceries & Quick Errands", campaignType: "Metro Stations & Arterial Displays", featured: true },
      { name: "Zepto", tagline: "10-Minute Grocery Delivery Pioneer", campaignType: "Youth Hub Unipoles & Digital Screens" },
      { name: "D-Mart Hypermarkets", tagline: "Daily Value - Big Savings Superstore", campaignType: "Suburban Access Road Billboards" },
      { name: "Reliance Digital", tagline: "Personalising Technology For You", campaignType: "Electronics Hub Gantries" }
    ]
  }
];

// Flat list for marquee
const ALL_COMPANIES_FLAT = [
  "Suzuki Motors", "TVS", "Punjab National Bank", "ESAF Bank", "Kalpataru", 
  "Godrej Properties", "Krims Hospital", "HCG Hospital", "UltraTech Cement", 
  "Ambuja Cement", "PNG Jewellers", "Tanishq Jewellers", "Polycab Wires", 
  "Blinkit", "Zomato", "Swiggy", "SDPL", "Priyadarshini", "Aakash Institute", "Allen"
];

export default function TopCompaniesSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const toggleCategory = (categoryId: string) => {
    setSelectedCategory(prev => prev === categoryId ? "all" : categoryId);
  };

  const activeCategoryObj = CATEGORIES_DATA.find(c => c.id === selectedCategory);

  return (
    <section id="clients" className="py-20 md:py-24 bg-[#fafbfc] overflow-hidden border-t border-slate-200/80">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        
        {/* 1. HEADING & SUBHEADING (Clean, Professional, No extra tag) */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
            Top Companies
          </h2>
          <p className="text-base sm:text-lg text-slate-500 font-medium">
            Leading brands choose TrueSign Media for their Branding Solutions.
          </p>
        </div>

        {/* 2. SLEEK CLIENT TICKER / CAROUSEL */}
        <div className="relative flex overflow-x-hidden mb-12 py-3 bg-white rounded-2xl border border-slate-200/70 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="py-3 animate-marquee whitespace-nowrap flex items-center gap-10 sm:gap-14 px-6">
            {ALL_COMPANIES_FLAT.map((client, i) => (
              <div 
                key={i} 
                className="flex items-center gap-2.5 px-4 py-1.5 rounded-lg bg-slate-50/80 border border-slate-200/60 text-slate-700 text-sm font-semibold tracking-tight hover:text-slate-900 hover:bg-slate-100 transition-colors select-none"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                <span>{client}</span>
              </div>
            ))}
          </div>
          <div className="absolute top-0 py-3 animate-marquee2 whitespace-nowrap flex items-center gap-10 sm:gap-14 px-6 ml-6">
            {ALL_COMPANIES_FLAT.map((client, i) => (
              <div 
                key={`dup-${i}`} 
                className="flex items-center gap-2.5 px-4 py-1.5 rounded-lg bg-slate-50/80 border border-slate-200/60 text-slate-700 text-sm font-semibold tracking-tight hover:text-slate-900 hover:bg-slate-100 transition-colors select-none"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                <span>{client}</span>
              </div>
            ))}
          </div>

          {/* Clean Fade Masks */}
          <div className="absolute inset-y-0 left-0 w-24 sm:w-32 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-24 sm:w-32 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
        </div>

        {/* 3. CATEGORY PILLS (Refined Corporate Design) */}
        <div className="mb-10">
          <div className="flex items-center justify-between gap-4 mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Browse by Industry
            </span>
            {selectedCategory !== "all" && (
              <button
                onClick={() => setSelectedCategory("all")}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>View all categories</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
            {/* "All" button */}
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80 shadow-xs"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>All Industries</span>
            </button>

            {/* Individual category pills with toggle on click */}
            {CATEGORIES_DATA.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/10"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80 shadow-xs"
                  }`}
                  title={isSelected ? "Click to close" : `View ${cat.name}`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-slate-500"}`} />
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                  }`}>
                    {cat.companies.length}
                  </span>
                  {isSelected && (
                    <X className="w-3 h-3 text-slate-300 hover:text-white ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. CATEGORIZED COMPANIES DISPLAY */}
        {selectedCategory === "all" ? (
          /* OVERVIEW MODE: 4-Column Grid of Categories showing Top 3 Companies each */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORIES_DATA.map((category) => {
              const Icon = category.icon;
              const topThree = category.companies.slice(0, 3);

              return (
                <div 
                  key={category.id} 
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-slate-300 transition-all group"
                >
                  {/* Category Header */}
                  <div>
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 text-left cursor-pointer group-hover:text-indigo-600 transition-colors"
                      title={`Click to open ${category.name}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {category.name}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-medium">Top 3 Brands</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:text-indigo-600 transition-all" />
                    </button>

                    {/* Top 3 Company Cards */}
                    <div className="space-y-2.5">
                      {topThree.map((company, idx) => (
                        <div
                          key={idx}
                          onClick={() => toggleCategory(category.id)}
                          className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/60 hover:bg-white hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer flex flex-col"
                          title={`Click to view all ${category.name}`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-bold text-sm text-slate-900 tracking-tight">
                              {company.name}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                              #{idx + 1}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-normal line-clamp-1 mb-2">
                            {company.tagline}
                          </p>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mt-auto">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="truncate">{company.campaignType}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* View all link */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-between text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    <span>View all {category.companies.length} brands</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          /* EXPANDED CATEGORY VIEW: Displays ALL companies in selected category */
          activeCategoryObj && (
            <div className="animate-in fade-in duration-200">
              {/* Category Header Banner */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 mb-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                    {(() => {
                      const Icon = activeCategoryObj.icon;
                      return <Icon className="w-6 h-6" />;
                    })()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                        Industry Showcase
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 text-slate-200 font-medium">
                        {activeCategoryObj.companies.length} Brands
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                      {activeCategoryObj.name}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCategory("all")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer self-start sm:self-auto"
                >
                  <X className="w-4 h-4 text-slate-500" />
                  <span>Close &amp; Back to Overview</span>
                </button>
              </div>

              {/* All Companies Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeCategoryObj.companies.map((company, index) => (
                  <div
                    key={index}
                    className="bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-bold text-base text-slate-900 tracking-tight">
                          {company.name}
                        </h4>
                        {company.featured && (
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                            Top Brand
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-normal line-clamp-2 mb-4">
                        {company.tagline}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-medium text-[11px] truncate">{company.campaignType}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Return link */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>Show All Industries Overview</span>
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}
