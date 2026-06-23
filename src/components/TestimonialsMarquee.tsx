"use client";

import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "The impact we got in Delhi NCR was phenomenal. The interactive map made it incredibly easy to select the right billboards for our campaign.",
    author: "Rohan Kapoor",
    role: "CMO, FinTech India",
    company: "PayNova"
  },
  {
    quote: "Finally, a transparent and visually stunning way to book outdoor media. The team at ESTROC helped us dominate Cyber Hub completely.",
    author: "Aditi Desai",
    role: "Marketing Director",
    company: "Zest Retail"
  },
  {
    quote: "We were able to coordinate our product launch across Mumbai, Pune, and Nagpur effortlessly using their premium inventory.",
    author: "Vikram Singh",
    role: "Head of Growth",
    company: "UrbanDrive"
  },
  {
    quote: "The visibility and analytics provided for the digital boards in Connaught Place gave our brand the exact boost it needed.",
    author: "Neha Sharma",
    role: "Brand Manager",
    company: "Lumina Beauty"
  },
  {
    quote: "Finding high-traffic sites in tier-1 and tier-2 cities used to be a hassle. Now, we just use the map search and book directly.",
    author: "Arjun Reddy",
    role: "Founder & CEO",
    company: "TechGear India"
  }
];

export default function TestimonialsMarquee() {
  // Double the array to create a seamless infinite loop
  const duplicatedTestimonials = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <div className="relative flex overflow-hidden py-10 w-full group">
      {/* Left/Right Fade Masks */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      <div className="flex w-[200%] animate-marquee gap-6 px-4">
        {duplicatedTestimonials.map((t, i) => (
          <div 
            key={i} 
            className="flex-shrink-0 w-[350px] md:w-[450px] bg-card border border-border rounded-2xl p-8 shadow-sm transition-shadow duration-300 hover:shadow-lg"
          >
            <Quote className="h-8 w-8 text-primary/20 mb-4" />
            <p className="text-foreground text-lg leading-relaxed mb-6 font-medium line-clamp-4">
              "{t.quote}"
            </p>
            <div className="flex items-center gap-4 border-t border-border pt-4 mt-auto">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {t.author.charAt(0)}
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-foreground">{t.author}</h4>
                <p className="text-xs text-muted-foreground">{t.role}, {t.company}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
