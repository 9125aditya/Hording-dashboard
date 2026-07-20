"use client";

import { useState, useTransition } from "react";
import { MoreHorizontal, Trash2, CheckCircle, Ban, AlertCircle, ExternalLink, Pencil, Eye } from "lucide-react";
import { deleteSite, updateSiteStatus } from "@/backend/actions/actions";
import Link from "next/link";

export default function SiteActions({ siteId, currentStatus, uuid }: { siteId: string, currentStatus: string, uuid: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this site?")) {
      setIsOpen(false);
      startTransition(async () => {
        const res = await deleteSite(uuid);
        // Site deleted directly
      });
    }
  };

  const menuItemClass = "w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors";

  return (
    <div className="relative">
      <button 
        disabled={isPending}
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-all disabled:opacity-50"
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 shadow-lg rounded-xl z-50 overflow-hidden py-1.5">
            
            <Link 
              href={`/inventory/${uuid}/view`}
              className={menuItemClass}
            >
              <Eye className="mr-2.5 h-4 w-4 text-indigo-500" /> View Details
            </Link>

            <Link 
              href={`/inventory/${uuid}`}
              className={menuItemClass}
            >
              <Pencil className="mr-2.5 h-4 w-4 text-blue-500" /> Edit Details
            </Link>





            <button 
              onClick={handleDelete}
              className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 flex items-center transition-colors"
            >
              <Trash2 className="mr-2.5 h-4 w-4" /> Delete Site
            </button>
          </div>
        </>
      )}
    </div>
  );
}
