"use client";

import { useState, useTransition } from "react";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { deleteStaff } from "@/backend/actions/actions";

export default function StaffActions({ staffId }: { staffId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      setIsOpen(false);
      startTransition(async () => {
        await deleteStaff(staffId);
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
            <button 
              onClick={handleDelete}
              className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 flex items-center"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete Staff
            </button>
          </div>
        </>
      )}
    </div>
  );
}
