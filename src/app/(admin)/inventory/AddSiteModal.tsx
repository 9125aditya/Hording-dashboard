"use client";

import { useState, useTransition } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { addSite } from "@/lib/actions";

export default function AddSiteModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await addSite(formData);
      if (res?.success) {
        setIsOpen(false);
      } else {
        alert(res?.error || "Failed to add site");
      }
    });
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Site
      </button>
    );
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Site
      </button>

      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-card w-full max-w-lg border border-border shadow-lg rounded-xl overflow-hidden animate-in fade-in zoom-in-95">
          <div className="flex justify-between items-center p-4 border-b border-border">
            <h2 className="text-lg font-bold">Add New Site</h2>
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">Site Name</label>
                <input required name="name" type="text" className="w-full h-10 px-3 rounded-md border border-input bg-background focus:ring-1 focus:ring-primary outline-none" placeholder="e.g. NH-44 Highway Billboard" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <select required name="type" className="w-full h-10 px-3 rounded-md border border-input bg-background focus:ring-1 focus:ring-primary outline-none">
                  <option value="Billboard">Billboard</option>
                  <option value="Digital Screen">Digital Screen</option>
                  <option value="Transit">Transit</option>
                  <option value="Street Furniture">Street Furniture</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <input required name="city" type="text" className="w-full h-10 px-3 rounded-md border border-input bg-background focus:ring-1 focus:ring-primary outline-none" placeholder="Nagpur" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Size</label>
                <input required name="size" type="text" className="w-full h-10 px-3 rounded-md border border-input bg-background focus:ring-1 focus:ring-primary outline-none" placeholder="20x10 ft" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select required name="status" className="w-full h-10 px-3 rounded-md border border-input bg-background focus:ring-1 focus:ring-primary outline-none">
                  <option value="Available">Available</option>
                  <option value="Booked">Booked</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">Internal Rate (₹)</label>
                <input required name="price" type="number" className="w-full h-10 px-3 rounded-md border border-input bg-background focus:ring-1 focus:ring-primary outline-none" placeholder="150000" />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors">
                Cancel
              </button>
              <button disabled={isPending} type="submit" className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Site
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
