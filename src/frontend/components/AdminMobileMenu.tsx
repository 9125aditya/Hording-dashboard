"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Squares2X2Icon, MapIcon, ChatBubbleLeftIcon, ArrowRightOnRectangleIcon, XMarkIcon, Bars3Icon, ArrowTopRightOnSquareIcon, CheckCircleIcon, ShieldCheckIcon, UsersIcon, MapPinIcon, CubeIcon, DocumentChartBarIcon } from "@heroicons/react/24/outline";
import { logout } from "@/backend/actions/auth-actions";
import { clearTabSession } from "@/frontend/components/TabSessionManager";

export default function AdminMobileMenu({ isSuperAdmin = false, enquiryCount = 0, totalEnquiryCount = 0, pendingCount = 0 }: { isSuperAdmin?: boolean; enquiryCount?: number; totalEnquiryCount?: number; pendingCount?: number }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navLinkClass = "flex items-center px-3 py-2.5 text-[13.5px] font-medium rounded-lg transition-all duration-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700";

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="md:hidden mr-4 text-gray-500 hover:text-gray-900" aria-label="Open sidebar">
        <Bars3Icon className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsOpen(false)} />
          
          {/* Drawer */}
          <div
            className="absolute inset-y-0 left-0 w-[260px] flex flex-col bg-white shadow-2xl animate-in slide-in-from-left-full duration-300"
          >
            <div className="px-5 py-5 flex items-center justify-between border-b border-gray-100">
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center">
                <img src="/logo.png" alt="Logo" className="h-9 w-auto object-contain mix-blend-multiply" />
              </Link>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-3 space-y-0.5">
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className={navLinkClass}>
                <Squares2X2Icon className="mr-3 h-[18px] w-[18px]" /> Dashboard
              </Link>
              <Link href="/status" onClick={() => setIsOpen(false)} className={navLinkClass}>
                <CheckCircleIcon className="mr-3 h-[18px] w-[18px]" /> Update Status
              </Link>
              <Link href="/flex-inventory" onClick={() => setIsOpen(false)} className={navLinkClass}>
                <CubeIcon className="mr-3 h-[18px] w-[18px]" /> Flex Inventory
              </Link>
              <Link href="/admin-map" onClick={() => setIsOpen(false)} className={navLinkClass}>
                <MapIcon className="mr-3 h-[18px] w-[18px]" /> Map View
              </Link>
              <Link href="/inventory" onClick={() => setIsOpen(false)} className={navLinkClass}>
                <MapPinIcon className="mr-3 h-[18px] w-[18px]" /> Inventory
              </Link>
              <Link href="/enquiries" onClick={() => setIsOpen(false)} className={`${navLinkClass} justify-between`}>
                <span className="flex items-center">
                  <ChatBubbleLeftIcon className="mr-3 h-[18px] w-[18px]" /> Enquiries
                </span>
                {enquiryCount > 0 && (
                  <span className="text-[10px] font-bold bg-indigo-600 text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-tight">
                    {enquiryCount} new
                  </span>
                )}
              </Link>
              <Link href="/quotations" onClick={() => setIsOpen(false)} className={navLinkClass}>
                <DocumentChartBarIcon className="mr-3 h-[18px] w-[18px]" /> Quotation Builder
              </Link>
              {isSuperAdmin && (
                <>
                  <Link href="/approvals" onClick={() => setIsOpen(false)} className={`${navLinkClass} justify-between`}>
                    <span className="flex items-center">
                      <CheckCircleIcon className="mr-3 h-[18px] w-[18px]" /> Action History
                    </span>
                    {pendingCount > 0 && (
                      <span className="text-[10px] font-bold bg-amber-500 text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-tight">
                        {pendingCount}
                      </span>
                    )}
                  </Link>
                  <Link href="/permissions" onClick={() => setIsOpen(false)} className={navLinkClass}>
                    <ShieldCheckIcon className="mr-3 h-[18px] w-[18px]" /> Access Control
                  </Link>

                </>
              )}
            </nav>

            <div className="px-3 mb-2">
              <Link href="/" target="_blank" onClick={() => setIsOpen(false)} className={navLinkClass}>
                <ArrowTopRightOnSquareIcon className="mr-3 h-[18px] w-[18px]" /> View Live Site
              </Link>
            </div>

            <div className="p-3 border-t border-gray-100">
              <form action={logout} onSubmit={() => clearTabSession()}>
                <button type="submit" className="flex items-center px-3 py-2.5 text-[13.5px] font-medium rounded-lg w-full text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer">
                  <ArrowRightOnRectangleIcon className="mr-3 h-[18px] w-[18px]" /> Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
