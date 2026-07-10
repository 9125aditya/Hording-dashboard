/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { ArrowRight, MapPin, Maximize2, SlidersHorizontal, Search } from "lucide-react";
import AnimateOnScroll from "@/frontend/components/AnimateOnScroll";

import { createClient } from "@/backend/db/server";
import CatalogClient from "./CatalogClient";

export default async function CatalogPage() {
  const supabase = await createClient();
  const { data: dbSites } = await supabase.from('sites').select('*').order('created_at', { ascending: false });

  const sites = dbSites?.map((s: any) => ({
    id: s.site_id,
    name: s.name,
    size: s.size,
    type: s.type,
    status: s.status,
    color: s.status === 'Available' ? 'bg-available' : s.status === 'Booked' ? 'bg-booked' : 'bg-blocked text-white',
    img: s.photos?.[0] || 'https://images.unsplash.com/photo-1533069027836-fa937181a8ce?w=800&q=80',
    city: s.city
  })) || [];
  return (
    <div className="flex-1 bg-background pt-10 pb-24">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <AnimateOnScroll animation="fade-up" duration={800}>
          <div className="mb-12">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">Browse Sites</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explore our premium outdoor media inventory. Filter by location, size, or availability to find the perfect spot for your next campaign.
            </p>
          </div>
        </AnimateOnScroll>

        <CatalogClient sites={sites} />

      </div>
    </div>
  );
}
