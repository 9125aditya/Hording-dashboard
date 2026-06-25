"use client";

import { useState, useTransition } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { addStaff } from "@/lib/actions";

export default function AddStaffModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await addStaff(formData);
      if (res?.success) {
        setIsOpen(false);
      } else {
        alert(res?.error || "Failed to add staff member");
      }
    });
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Staff Member
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg border border-border shadow-lg rounded-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h2 className="text-lg font-bold">Add Staff Member</h2>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <input required name="name" type="text" className="w-full h-10 px-3 rounded-md border border-input bg-background focus:ring-1 focus:ring-primary outline-none" placeholder="e.g. John Doe" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <input required name="role" type="text" className="w-full h-10 px-3 rounded-md border border-input bg-background focus:ring-1 focus:ring-primary outline-none" placeholder="e.g. Installer" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <select required name="department" className="w-full h-10 px-3 rounded-md border border-input bg-background focus:ring-1 focus:ring-primary outline-none">
                    <option value="Operations">Operations</option>
                    <option value="Sales">Sales</option>
                    <option value="Management">Management</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Pay Type</label>
                  <select required name="payType" className="w-full h-10 px-3 rounded-md border border-input bg-background focus:ring-1 focus:ring-primary outline-none">
                    <option value="Salaried">Salaried</option>
                    <option value="Hourly">Hourly</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Salary / Rate (₹)</label>
                  <input required name="salary" type="number" className="w-full h-10 px-3 rounded-md border border-input bg-background focus:ring-1 focus:ring-primary outline-none" placeholder="25000" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors">
                  Cancel
                </button>
                <button disabled={isPending} type="submit" className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Save Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
