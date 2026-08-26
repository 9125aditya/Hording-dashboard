"use client";

import { useState } from "react";
import { 
  Sparkles, 
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
    color: "text-purple-600",
    bgLight: "bg-purple-50",
    borderColor: "border-purple-200",
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
    color: "text-amber-600",
    bgLight: "bg-amber-50",
    borderColor: "border-amber-200",
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
    color: "text-cyan-600",
    bgLight: "bg-cyan-50",
    borderColor: "border-cyan-200",
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
    color: "text-violet-600",
    bgLight: "bg-violet-50",
    borderColor: "border-violet-200",
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

// Flat list for infinite marquee carousel
const ALL_COMPANIES_FLAT = [
  "Suzuki Motors", "TVS", "Punjab National Bank", "ESAF Bank", "Kalpataru", 
  "Godrej Properties", "Krims Hospital", "HCG Hospital", "UltraTech Cement", 
  "Ambuja Cement", "PNG Jewellers", "Tanishq Jewellers", "Polycab Wires", 
  "Blinkit", "Zomato", "Swiggy", "SDPL", "Priyadarshini", "Aakash Institute", "Allen"
];

export default function TopCompaniesSection() {
  // 'all' represents overview mode where all category columns are visible
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const toggleCategory = (categoryId: string) => {
    setSelectedCategory(prev => prev === categoryId ? "all" : categoryId);
  };

  const activeCategoryObj = CATEGORIES_DATA.find(c => c.id === selectedCategory);

  return (
    <section id="clients" className="py-20 md:py-28 bg-white overflow-hidden border-t border-slate-100">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        
        {/* 1. HEADING & SUBHEADING */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold tracking-wide uppercase mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Trusted Partners</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Top Companies
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-500 font-medium">
            Leading brands choose TrueSign Media for their Branding Solutions.
          </p>
        </div>

        {/* 2. CAROUSEL / MARQUEE (Right below Heading & Subheading as shown in wireframe) */}
        <div className="relative flex overflow-x-hidden group mb-14 py-3 bg-slate-50/60 rounded-2xl border border-slate-100/80 shadow-xs">
          <div className="py-4 animate-marquee whitespace-nowrap flex items-center gap-12 sm:gap-16 px-6">
            {ALL_COMPANIES_FLAT.map((client, i) => (
              <div 
                key={i} 
                className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white border border-slate-200/70 shadow-xs hover:shadow-md hover:border-purple-300 transition-all cursor-default select-none"
              >
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-sm sm:text-base font-bold text-slate-700 group-hover:text-slate-900 tracking-tight">
                  {client}
                </span>
              </div>
            ))}
          </div>
          <div className="absolute top-0 py-4 animate-marquee2 whitespace-nowrap flex items-center gap-12 sm:gap-16 px-6 ml-6">
            {ALL_COMPANIES_FLAT.map((client, i) => (
              <div 
                key={`dup-${i}`} 
                className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white border border-slate-200/70 shadow-xs hover:shadow-md hover:border-purple-300 transition-all cursor-default select-none"
              >
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-sm sm:text-base font-bold text-slate-700 group-hover:text-slate-900 tracking-tight">
                  {client}
                </span>
              </div>
            ))}
          </div>

          {/* Gradient Edges */}
          <div className="absolute inset-y-0 left-0 w-24 sm:w-36 bg-gradient-to-r from-slate-50/90 to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-24 sm:w-36 bg-gradient-to-l from-slate-50/90 to-transparent pointer-events-none z-10" />
        </div>

        {/* 3. SUBHEADING / CATEGORY PILLS (Interactive filter buttons matching wireframe) */}
        <div className="mb-10">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-wider">
                Click to open/close a category:
              </h3>
            </div>
            {selectedCategory !== "all" && (
              <button
                onClick={() => setSelectedCategory("all")}
                className="text-xs font-bold text-purple-600 hover:text-purple-800 underline underline-offset-4 cursor-pointer transition-colors"
              >
                ← Back to All Categories
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth">
            {/* "All" button */}
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/20 scale-[1.02]"
                  : "bg-purple-100/70 text-purple-900 hover:bg-purple-200/80 border border-purple-200/60"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>All Categories</span>
            </button>

            {/* Individual category pills with toggle on click */}
            {CATEGORIES_DATA.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? "bg-purple-600 text-white shadow-md shadow-purple-500/20 scale-[1.02]"
                      : "bg-purple-100/70 text-purple-900 hover:bg-purple-200/80 border border-purple-200/60 hover:scale-[1.01]"
                  }`}
                  title={isSelected ? "Click again to close" : `Click to view all ${cat.name}`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? "text-white" : "text-purple-700"}`} />
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isSelected ? "bg-white/20 text-white" : "bg-purple-200/60 text-purple-800"
                  }`}>
                    {cat.companies.length}
                  </span>
                  {isSelected && (
                    <X className="w-3.5 h-3.5 text-white/80 hover:text-white ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. CATEGORIZED COMPANIES DISPLAY */}
        {selectedCategory === "all" ? (
          /* OVERVIEW MODE: Grid of category columns showing Top 3 Companies each (Exact match to wireframe!) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES_DATA.map((category) => {
              const Icon = category.icon;
              const topThree = category.companies.slice(0, 3);

              return (
                <div 
                  key={category.id} 
                  className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-4 sm:p-5 flex flex-col justify-between hover:border-purple-300 hover:shadow-md transition-all group"
                >
                  {/* Column Header / Category Subheading */}
                  <div>
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-200 text-left cursor-pointer group-hover:text-purple-700 transition-colors"
                      title={`Click to open/view all ${category.name}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg ${category.bgLight} ${category.color} flex items-center justify-center font-bold`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-800 group-hover:text-purple-700 transition-colors">
                            {category.name}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-medium">Top 3 Brands</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-purple-600 transition-all" />
                    </button>

                    {/* Top 3 Company Cards in this Column */}
                    <div className="space-y-3">
                      {topThree.map((company, idx) => (
                        <div
                          key={idx}
                          onClick={() => toggleCategory(category.id)}
                          className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs hover:border-purple-400 hover:shadow-sm transition-all cursor-pointer flex flex-col"
                          title={`Click to open all ${category.name} brands`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-bold text-sm text-slate-900 tracking-tight">
                              {company.name}
                            </span>
                            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                              #{idx + 1}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium line-clamp-1 mb-2">
                            {company.tagline}
                          </p>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 mt-auto">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span className="truncate">{company.campaignType}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* "View all X companies in this category" button */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="mt-4 pt-3 border-t border-slate-200/80 w-full flex items-center justify-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 cursor-pointer group-hover:underline"
                  >
                    <span>View all {category.companies.length} {category.shortName} brands</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          /* EXPANDED CATEGORY VIEW: Displays ALL companies belonging to the selected category */
          activeCategoryObj && (
            <div className="animate-in fade-in zoom-in-95 duration-200">
              {/* Category Header Banner */}
              <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-purple-300">
                      {(() => {
                        const Icon = activeCategoryObj.icon;
                        return <Icon className="w-7 h-7" />;
                      })()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                          Category Showcase
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/15 text-white font-medium">
                          {activeCategoryObj.companies.length} Leading Brands
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                        {activeCategoryObj.name}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-slate-900 hover:bg-slate-100 text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer self-start sm:self-auto"
                    title="Close and return to all categories"
                  >
                    <X className="w-4 h-4 text-purple-600" />
                    <span>Close &amp; View All</span>
                  </button>
                </div>
              </div>

              {/* All Companies Cards in this Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {activeCategoryObj.companies.map((company, index) => (
                  <div
                    key={index}
                    className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-purple-400 hover:shadow-lg transition-all flex flex-col justify-between group relative overflow-hidden"
                  >
                    {company.featured && (
                      <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider shadow-xs">
                        Top Brand
                      </div>
                    )}
                    <div>
                      <div className="flex items-start gap-3.5 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 font-black text-sm flex items-center justify-center shrink-0 border border-purple-100 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                          {company.name.charAt(0)}
                        </div>
                        <div className="pr-12">
                          <h4 className="font-bold text-base text-slate-900 tracking-tight group-hover:text-purple-700 transition-colors">
                            {company.name}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-0.5">
                            {company.tagline}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="font-medium text-[11px] truncate">{company.campaignType}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom return bar */}
              <div className="mt-10 text-center">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-sm transition-all cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>Show All Categories Grid</span>
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}
