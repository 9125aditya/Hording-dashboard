"use client";

import { useState, useTransition } from "react";
import { MoreHorizontal, Trash2, CheckCircle, Ban, AlertCircle, ExternalLink, Pencil } from "lucide-react";
import { deleteSite, updateSiteStatus } from "@/backend/actions/actions";
import Link from "next/link";

export default function SiteActions({ siteId, currentStatus, uuid }: { siteId: string, currentStatus: string, uuid: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (status: string) => {
    setIsOpen(false);
    startTransition(async () => {
      const res = await updateSiteStatus(Number(siteId), status);
      if (res?.isPending) {
        alert("Status update request sent for approval to Super Admin.");
      }
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this site?")) {
      setIsOpen(false);
      startTransition(async () => {
        const res = await deleteSite(Number(siteId));
        if (res?.isPending) {
          alert("Deletion request sent for approval to Super Admin.");
        }
      });
    }
  };

  return (
    <div className="relative">
      <button 
        disabled={isPending}
        onClick={() => setIsOpen(!isOpen)}
        className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors disabled:opacity-50"
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border shadow-lg rounded-md z-50 overflow-hidden py-1 animate-in fade-in zoom-in-95">
            
            <Link 
              href={`/admin/inventory/${siteId}`}
              className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center"
            >
              <Pencil className="mr-2 h-4 w-4 text-blue-600" /> Edit Details
            </Link>

            <Link 
              href={`/catalog/${uuid}`}
              target="_blank"
              onClick={() => setIsOpen(false)}
              className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center"
            >
              <ExternalLink className="mr-2 h-4 w-4 text-blue-500" /> View Live
            </Link>

            {currentStatus !== "Available" && (
              <button 
                onClick={() => handleStatusChange("Available")}
                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center"
              >
                <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" /> Mark Available
              </button>
            )}
            
            {currentStatus !== "Booked" && (
              <button 
                onClick={() => handleStatusChange("Booked")}
                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center"
              >
                <AlertCircle className="mr-2 h-4 w-4 text-red-500" /> Mark Booked
              </button>
            )}

            {currentStatus !== "Blocked" && (
              <button 
                onClick={() => handleStatusChange("Blocked")}
                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center"
              >
                <Ban className="mr-2 h-4 w-4 text-amber-500" /> Mark Blocked
              </button>
            )}

            <div className="h-px bg-border my-1" />

            <button 
              onClick={handleDelete}
              className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 flex items-center"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete Site
            </button>
          </div>
        </>
      )}
    </div>
  );
}
