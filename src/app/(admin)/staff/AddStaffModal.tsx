"use client";

import { useState, useTransition } from "react";
import { Plus, X, Loader2, AlertCircle } from "lucide-react";
import { addStaffMemberWithAuth } from "@/backend/actions/admin-actions";

export default function AddStaffModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await addStaffMemberWithAuth(formData);
      if (res?.success) {
        setIsOpen(false);
        setError(null);
      } else {
        setError(res?.error || "Failed to add staff member. Please try again.");
      }
    });
  };

  return (
    <>
      <button 
        onClick={() => { setIsOpen(true); setError(null); }}
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Staff Member
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg border border-border shadow-lg rounded-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h2 className="text-lg font-bold">Add Staff Member</h2>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors rounded-md p-1 hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <input required name="name" type="text" className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. John Doe" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Email Address</label>
                  <input required name="email" type="email" className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="john@sellads advertising.com" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Temporary Password</label>
                  <input required name="password" type="password" className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Min. 6 characters" minLength={6} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Role</label>
                  <input required name="role" type="text" className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. Installer" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Department</label>
                  <select required name="department" className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                    <option value="Operations">Operations</option>
                    <option value="Sales">Sales</option>
                    <option value="Management">Management</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Pay Type</label>
                  <select required name="payType" className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                    <option value="Salaried">Salaried</option>
                    <option value="Hourly">Hourly</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Salary / Rate (₹)</label>
                  <input required name="salary" type="number" className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="25000" />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2 border-t border-border">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2.5 rounded-md hover:bg-muted text-sm font-medium transition-colors">
                  Cancel
                </button>
                <button disabled={isPending} type="submit" className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
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
