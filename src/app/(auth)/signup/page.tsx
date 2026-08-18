"use client";

import { ShieldCheckIcon, LockClosedIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="w-full max-w-md bg-white border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="p-8 border-b border-border bg-slate-50/70 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground mb-1">Staff Access Only</h1>
            <p className="text-muted-foreground text-xs">Customer self-registration is disabled.</p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-blue-100 text-blue-700 ring-4 ring-blue-50 flex items-center justify-center">
            <ShieldCheckIcon className="h-6 w-6" />
          </div>
        </div>
      </div>
      
      <div className="p-8 space-y-6 text-center">
        <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-600 mx-auto flex items-center justify-center shadow-inner">
          <LockClosedIcon className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-800">Direct Registration Disabled</h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            Account creation is restricted to authorized personnel. Admin and Staff accounts are provisioned exclusively by the Super Administrator.
          </p>
        </div>

        <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl text-left text-xs text-blue-900 leading-relaxed">
          <span className="font-bold block mb-0.5">Need Access?</span>
          If you are an authorized staff member requiring login credentials, please contact the primary Super Administrator.
        </div>

        <Link
          href="/login"
          className="w-full h-11 flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white font-bold text-sm shadow-md hover:bg-blue-700 transition-all active:scale-[0.98]"
        >
          <span>Go to Management Login</span>
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
