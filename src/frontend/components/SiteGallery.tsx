"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowsPointingOutIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface SiteGalleryProps {
  images: string[];
  siteName: string;
  siteId: string;
}

export default function SiteGallery({ images, siteName, siteId }: SiteGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const safeImages = images && images.length > 0 ? images : [
    "https://images.unsplash.com/photo-1533069027836-fa937181a8ce?w=1600&q=80"
  ];

  const openLightbox = (index: number) => {
    setLightboxIdx(index);
    setZoomLevel(1);
    setPanPos({ x: 0, y: 0 });
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setZoomLevel(1);
    setPanPos({ x: 0, y: 0 });
  };

  const nextImage = useCallback(() => {
    setLightboxIdx((prev) => (prev + 1) % safeImages.length);
    setZoomLevel(1);
    setPanPos({ x: 0, y: 0 });
  }, [safeImages.length]);

  const prevImage = useCallback(() => {
    setLightboxIdx((prev) => (prev - 1 + safeImages.length) % safeImages.length);
    setZoomLevel(1);
    setPanPos({ x: 0, y: 0 });
  }, [safeImages.length]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPanPos({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanPos({ x: 0, y: 0 });
  };

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "+" || e.key === "=") handleZoomIn();
      if (e.key === "-") handleZoomOut();
      if (e.key === "0") handleResetZoom();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [lightboxOpen, nextImage, prevImage]);

  // Pan / Drag handlers for zoomed image
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPos.x, y: e.clientY - panPos.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    setPanPos({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-4">
      {/* Main Image Container — Adaptive height with full fit without cropping */}
      <div 
        onClick={() => openLightbox(activeIdx)}
        className="group relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] max-h-[560px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-md cursor-zoom-in transition-all duration-300 hover:shadow-xl"
      >
        {/* Subtle blurred backdrop layer to eliminate harsh empty bars while keeping main photo uncropped */}
        <div className="absolute inset-0 overflow-hidden opacity-35 filter blur-2xl scale-110 pointer-events-none">
          <Image
            src={safeImages[activeIdx]}
            alt={siteName}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>

        {/* Foreground full uncropped image */}
        <div className="relative w-full h-full p-2 sm:p-3 flex items-center justify-center">
          <Image
            src={safeImages[activeIdx]}
            alt={siteName}
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            priority
            className="object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-[1.01]"
          />
        </div>

        {/* Enlarge Prompt Pill Overlay */}
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 bg-slate-900/80 hover:bg-slate-900 backdrop-blur-md text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-lg border border-white/20 transition-all group-hover:scale-105">
          <ArrowsPointingOutIcon className="h-4 w-4 text-amber-400" />
          <span>Click to Enlarge / Zoom</span>
        </div>

        {/* Image index indicator if multiple */}
        {safeImages.length > 1 && (
          <div className="absolute top-4 left-4 z-10 bg-slate-900/75 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10">
            {activeIdx + 1} / {safeImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails & Interactive Map button */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-1">
        {safeImages.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIdx(idx)}
            className={`group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border-2 transition-all cursor-pointer ${
              activeIdx === idx
                ? "border-blue-600 ring-2 ring-blue-500/30 shadow-md scale-[1.02]"
                : "border-slate-200/80 hover:border-slate-400 opacity-80 hover:opacity-100"
            }`}
          >
            {/* Blurry background */}
            <div className="absolute inset-0 overflow-hidden opacity-30 filter blur-md scale-110">
              <Image src={img} alt={`${siteName} thumbnail ${idx + 1}`} fill sizes="20vw" className="object-cover" />
            </div>
            {/* Contained thumbnail */}
            <Image
              src={img}
              alt={`${siteName} thumbnail ${idx + 1}`}
              fill
              sizes="20vw"
              className="object-contain p-1"
            />
            {/* Quick Enlarge on Hover overlay */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                openLightbox(idx);
              }}
              title="Enlarge this photo"
              className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
            >
              <ArrowsPointingOutIcon className="h-5 w-5 text-white drop-shadow" />
            </div>
          </button>
        ))}

        {/* View Interactive Map Tile */}
        <Link
          href={`/map?siteId=${siteId}`}
          className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex flex-col items-center justify-center gap-1.5 group cursor-pointer hover:bg-slate-200/70 transition-all text-slate-700 hover:text-slate-900 shadow-xs"
        >
          <MapIcon className="h-6 w-6 text-slate-500 group-hover:text-blue-600 group-hover:scale-110 transition-all" />
          <span className="text-[11px] font-bold tracking-tight text-center px-1">View Map</span>
        </Link>
      </div>

      {/* FULLSCREEN LIGHTBOX ZOOM MODAL */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex flex-col justify-between animate-in fade-in duration-200 select-none"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Top Bar / Controls */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-black/40 border-b border-white/10 text-white z-20">
            <div className="flex items-center gap-3">
              <span className="text-sm sm:text-base font-bold truncate max-w-[200px] sm:max-w-md">{siteName}</span>
              <span className="text-xs sm:text-sm text-slate-400 font-mono bg-white/10 px-2.5 py-1 rounded-md">
                {lightboxIdx + 1} / {safeImages.length}
              </span>
            </div>

            {/* Zoom & Action Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3.5}
                title="Zoom In (+)"
                className="p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
              >
                <MagnifyingGlassPlusIcon className="h-5 w-5" />
              </button>

              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
                title="Zoom Out (-)"
                className="p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
              >
                <MagnifyingGlassMinusIcon className="h-5 w-5" />
              </button>

              <button
                onClick={handleResetZoom}
                title="Reset Zoom (0)"
                className="px-2.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowPathIcon className="h-4 w-4" />
                <span>{Math.round(zoomLevel * 100)}%</span>
              </button>

              <div className="h-5 w-px bg-white/20 mx-1" />

              <button
                onClick={closeLightbox}
                title="Close (Esc)"
                className="p-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Center Image Viewport with Pan & Zoom */}
          <div 
            className="relative flex-1 flex items-center justify-center overflow-hidden p-2 sm:p-6"
            onMouseDown={handleMouseDown}
            style={{ cursor: zoomLevel > 1 ? (isDragging ? "grabbing" : "grab") : "default" }}
          >
            {/* Navigation Previous Button */}
            {safeImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                title="Previous photo (Left arrow)"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md transition-all shadow-lg cursor-pointer"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
            )}

            {/* Rendered Zoomable Image */}
            <div 
              className="relative w-full h-full flex items-center justify-center transition-transform duration-100 ease-out"
              style={{
                transform: `scale(${zoomLevel}) translate(${panPos.x / zoomLevel}px, ${panPos.y / zoomLevel}px)`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={safeImages[lightboxIdx]}
                alt={siteName}
                className="max-w-full max-h-[80vh] object-contain drop-shadow-2xl pointer-events-none select-none rounded-lg"
              />
            </div>

            {/* Navigation Next Button */}
            {safeImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                title="Next photo (Right arrow)"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md transition-all shadow-lg cursor-pointer"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Strip in Lightbox */}
          {safeImages.length > 1 && (
            <div className="flex items-center justify-center gap-2 py-3 px-4 bg-black/40 border-t border-white/10 z-20 overflow-x-auto">
              {safeImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setLightboxIdx(idx);
                    setZoomLevel(1);
                    setPanPos({ x: 0, y: 0 });
                  }}
                  className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 bg-slate-900 ${
                    lightboxIdx === idx ? "border-amber-400 scale-105" : "border-white/20 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx + 1}`} fill sizes="64px" className="object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
