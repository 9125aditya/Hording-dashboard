import Link from "next/link";
import { CheckBadgeIcon, ShieldCheckIcon, ChartBarIcon, SparklesIcon } from "@heroicons/react/24/solid";
import { ArrowRightIcon, PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import AnimateOnScroll from "@/frontend/components/AnimateOnScroll";

// Icons specifically crafted to match the reference images
function CampaignIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 24L38 14V42L24 32H16V24H24Z" />
      <path d="M20 32V42C20 44 22 46 24 46H26" />
      <circle cx="48" cy="18" r="4" />
      <circle cx="52" cy="30" r="4" />
      <circle cx="46" cy="42" r="4" />
      <line x1="38" y1="20" x2="44" y2="18" />
      <line x1="38" y1="28" x2="48" y2="30" />
      <line x1="38" y1="36" x2="42" y2="40" />
    </svg>
  );
}

function BillboardIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="10" width="44" height="28" rx="3" />
      <line x1="18" y1="38" x2="18" y2="54" />
      <line x1="46" y1="38" x2="46" y2="54" />
      <line x1="12" y1="54" x2="52" y2="54" />
      <rect x="16" y="16" width="14" height="16" rx="1.5" />
      <line x1="34" y1="18" x2="48" y2="18" />
      <line x1="34" y1="24" x2="46" y2="24" />
      <line x1="34" y1="30" x2="44" y2="30" />
      <circle cx="23" cy="24" r="3" />
    </svg>
  );
}

function MetroIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="32" cy="32" r="24" />
      <rect x="22" y="18" width="20" height="26" rx="4" />
      <line x1="22" y1="28" x2="42" y2="28" />
      <circle cx="26" cy="36" r="2" fill="currentColor" />
      <circle cx="38" cy="36" r="2" fill="currentColor" />
      <line x1="26" y1="44" x2="22" y2="48" />
      <line x1="38" y1="44" x2="42" y2="48" />
    </svg>
  );
}

function LedDisplayIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="12" width="44" height="30" rx="3" />
      <line x1="32" y1="42" x2="32" y2="52" />
      <line x1="22" y1="52" x2="42" y2="52" />
      <polygon points="28,20 28,34 39,27" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path d="M46 18L50 14" />
      <path d="M48 24L53 22" />
    </svg>
  );
}

function BrandPromotionIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 28L32 20L48 28L32 36L16 28Z" />
      <path d="M16 28V44L32 52V36" />
      <path d="M48 28V44L32 52" />
      <circle cx="32" cy="14" r="5" />
      <path d="M30 11L32 9L34 11" />
      <line x1="32" y1="14" x2="32" y2="20" />
    </svg>
  );
}

function SocialMediaIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="20" y="10" width="24" height="44" rx="4" />
      <circle cx="32" cy="48" r="1.5" fill="currentColor" />
      <rect x="25" y="18" width="14" height="11" rx="2" />
      <polygon points="30,21 30,26 34,23.5" fill="currentColor" stroke="none" />
      <path d="M25 35H39" />
      <path d="M25 39H35" />
    </svg>
  );
}

function GraphicDesignIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="14" y="14" width="36" height="26" rx="2" />
      <line x1="8" y1="46" x2="56" y2="46" />
      <path d="M24 40L20 46" />
      <path d="M40 40L44 46" />
      <circle cx="24" cy="24" r="3" />
      <polyline points="18,34 28,26 36,33 46,24" />
    </svg>
  );
}

function DigitalMarketingIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="32" cy="32" r="24" />
      <path d="M32 14C24 24 22 34 22 42C26 44 32 40 32 40C32 40 38 44 42 42C42 34 40 24 32 14Z" />
      <line x1="32" y1="28" x2="32" y2="40" />
      <circle cx="32" cy="27" r="1.5" fill="currentColor" />
    </svg>
  );
}

const SERVICES_LIST = [
  {
    id: "campaign-planning",
    name: "Campaign Planning & Management",
    icon: CampaignIcon,
  },
  {
    id: "billboard-advertising",
    name: "Billboard Advertising",
    icon: BillboardIcon,
  },
  {
    id: "metro-advertising",
    name: "Metro Advertisment",
    icon: MetroIcon,
  },
  {
    id: "led-display",
    name: "LED Display Advertising",
    icon: LedDisplayIcon,
  },
  {
    id: "brand-promotion",
    name: "Brand Promotion",
    icon: BrandPromotionIcon,
  },
  {
    id: "social-media",
    name: "Social Media",
    icon: SocialMediaIcon,
  },
  {
    id: "graphic-designing",
    name: "Graphic Designing",
    icon: GraphicDesignIcon,
  },
  {
    id: "digital-marketing",
    name: "Digital Marketing",
    icon: DigitalMarketingIcon,
  },
];

export default function ServicesPage() {
  return (
    <div className="flex-1 flex flex-col bg-[#f4f8fb]">
      {/* Top Hero Section: Curved Sky-Blue Aesthetic matching the reference */}
      <section className="relative bg-gradient-to-b from-[#0ea5e9] via-[#0284c7] to-[#0369a1] text-white pt-16 pb-28 md:pb-36 px-6 overflow-hidden rounded-b-[2.5rem] md:rounded-b-[4rem] shadow-xl">
        {/* Background subtle elements */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-sky-200 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <AnimateOnScroll animation="fade-down" duration={600}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-6">
              Our Services
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={150} duration={700}>
            <p className="text-[15px] sm:text-[17px] md:text-[18px] text-sky-100 max-w-4xl mx-auto leading-relaxed font-normal mb-14 px-2">
              We deliver innovative outdoor and digital advertising solutions. From billboards, metro advertising, and LED displays to brand promotion, campaign management, social media marketing, graphic design, and digital marketing, we help businesses increase their visibility, reach the right audience, and grow their brand.
            </p>
          </AnimateOnScroll>

          {/* Service Icon Circles - Perfectly balanced 2-col on Mobile, 4-col on Desktop */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10 justify-items-center">
              {SERVICES_LIST.map((service) => {
                const IconComponent = service.icon;
                return (
                  <div
                    key={service.id}
                    className="flex flex-col items-center text-center group w-full max-w-[150px] transition-all duration-300"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center text-slate-800 shadow-lg group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300 border-2 border-white/80 shrink-0">
                      <IconComponent className="w-10 h-10 sm:w-12 sm:h-12 text-slate-800 group-hover:text-[#0284c7] transition-colors" />
                    </div>
                    <span className="mt-3 text-[13px] sm:text-[14px] font-bold text-white leading-snug group-hover:text-sky-200 transition-colors">
                      {service.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area: Standard Clean & Professional Layout */}
      <section className="container mx-auto px-6 max-w-6xl -mt-12 md:-mt-16 pb-24 relative z-20">
        <div className="bg-white p-8 sm:p-12 md:p-16 rounded-[2.5rem] shadow-xl border border-slate-100">
          
          {/* Main Heading & Intro */}
          <div className="max-w-4xl">
            <AnimateOnScroll animation="fade-up" duration={600}>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                Why Choose Truesign Media as your Branding Partner?
              </h2>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={150} duration={700}>
              <div className="space-y-6 text-slate-600 text-[16px] md:text-[17px] leading-relaxed font-normal">
                <p>
                  At <strong className="text-slate-900 font-bold">Truesign Media & Advertisement</strong>, we combine creativity, strategic planning, and industry expertise to deliver advertising solutions that help your brand stand out in a competitive market. From billboards, hoardings, metro advertising, LED displays, and brand promotions to campaign management, social media marketing, graphic design, and digital marketing, we offer complete end-to-end marketing solutions under one roof.
                </p>
                <p>
                  We believe every brand has a unique story, and our team works closely with you to create impactful campaigns that connect with the right audience across both offline and online platforms. With a focus on innovation, quality, and measurable results, we help businesses increase brand visibility, strengthen their market presence, and achieve long-term growth through effective advertising and marketing strategies.
                </p>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Value Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12 pt-10 border-t border-slate-100">
            <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-100 flex flex-col justify-between">
              <div>
                <CheckBadgeIcon className="w-8 h-8 text-[#0284c7] mb-3" />
                <h4 className="text-[15px] font-bold text-slate-900 mb-1">Prime Locations</h4>
                <p className="text-[13px] text-slate-500 leading-relaxed">High-visibility billboard network covering arterial roads and junctions.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-100 flex flex-col justify-between">
              <div>
                <ShieldCheckIcon className="w-8 h-8 text-amber-600 mb-3" />
                <h4 className="text-[15px] font-bold text-slate-900 mb-1">End-to-End Solutions</h4>
                <p className="text-[13px] text-slate-500 leading-relaxed">Complete campaign lifecycle from graphic artwork to installation and reporting.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex flex-col justify-between">
              <div>
                <ChartBarIcon className="w-8 h-8 text-emerald-600 mb-3" />
                <h4 className="text-[15px] font-bold text-slate-900 mb-1">Measurable Impact</h4>
                <p className="text-[13px] text-slate-500 leading-relaxed">Data-driven targeting for offline media and targeted digital campaigns.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col justify-between">
              <div>
                <SparklesIcon className="w-8 h-8 text-indigo-600 mb-3" />
                <h4 className="text-[15px] font-bold text-slate-900 mb-1">Omnichannel Reach</h4>
                <p className="text-[13px] text-slate-500 leading-relaxed">Harmonious synergy connecting outdoor brand visibility with digital marketing.</p>
              </div>
            </div>
          </div>

          {/* CTA Row */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full lg:w-auto">
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-md text-center"
              >
                Browse Inventory Catalogue <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#fab935] text-slate-900 text-sm font-bold hover:bg-[#f2a81d] transition-all shadow-sm text-center"
              >
                Get In Touch <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-[13.5px] font-semibold text-slate-700 w-full lg:w-auto pt-2 lg:pt-0">
              <a href="tel:+919765556861" className="flex items-center gap-2.5 hover:text-[#0284c7] transition-colors">
                <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
                  <PhoneIcon className="w-4 h-4" />
                </div>
                <span className="whitespace-nowrap">+91 9765556861</span>
              </a>
              <a href="mailto:truesignmedia@gmail.com" className="flex items-center gap-2.5 hover:text-[#0284c7] transition-colors">
                <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
                  <EnvelopeIcon className="w-4 h-4" />
                </div>
                <span>truesignmedia@gmail.com</span>
              </a>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
