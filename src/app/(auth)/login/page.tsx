"use client";

import { useTransition, useState } from "react";
import { loginUser } from "@/backend/actions/auth-actions";
import { Lock, UserCircle } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [loginMode, setLoginMode] = useState<'client' | 'admin'>('client');

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await loginUser(formData);
      if (res?.error) {
        setError(res.error);
      }
    });
  };

  return (
    <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="p-8 text-center border-b border-border bg-slate-50/50">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Welcome Back</h1>
        <p className="text-muted-foreground mt-2">Sign in to your ESTROC account.</p>
      </div>
      
      <div className="px-8 pt-6">
        <div className="flex p-1 bg-slate-100 rounded-lg">
          <button 
            type="button"
            onClick={() => setLoginMode('client')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${loginMode === 'client' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Client
          </button>
          <button 
            type="button"
            onClick={() => setLoginMode('admin')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${loginMode === 'admin' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Admin
          </button>
        </div>
      </div>

      <form onSubmit={handleLogin} className="px-8 py-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserCircle className="h-5 w-5 text-muted-foreground" />
              </div>
              <input 
                type="email" 
                name="email"
                placeholder="you@company.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <input 
                type="password" 
                name="password"
                placeholder="Enter your password"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
              />
            </div>
          </div>
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full h-12 flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
        >
          {isPending ? "Authenticating..." : "Sign in"}
        </button>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
