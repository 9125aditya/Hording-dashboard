"use client";

import { useTransition, useState } from "react";
import { loginUser } from "@/backend/actions/auth-actions";
import { 
  LockClosedIcon, 
  UserCircleIcon, 
  EyeIcon, 
  EyeSlashIcon
} from "@heroicons/react/24/outline";

export default function LoginPage() {
  const [loginType, setLoginType] = useState<"admin" | "super_admin">("admin");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("loginType", loginType);
    
    startTransition(async () => {
      const res = await loginUser(formData);
      if (res?.error) {
        setError(res.error);
      }
    });
  };

  return (
    <div suppressHydrationWarning className="w-full max-w-md bg-white border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header */}
      <div suppressHydrationWarning className="p-7 border-b border-border bg-slate-50/70 relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-1.5 transition-all duration-300 ${
          loginType === "super_admin" 
            ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500" 
            : "bg-gradient-to-r from-blue-600 to-indigo-600"
        }`} />
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              {loginType === "super_admin" ? "Super Admin Portal" : "Admin Portal"}
            </h1>
            <p className="text-muted-foreground text-xs mt-1">
              {loginType === "super_admin" 
                ? "Executive governance & system administration" 
                : "Operational management & inventory tools"}
            </p>
          </div>
        </div>

        {/* 2 Role Options: Admin vs Super Admin */}
        <div suppressHydrationWarning className="mt-5 grid grid-cols-2 p-1 bg-slate-200/70 rounded-xl gap-1">
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => {
              setLoginType("admin");
              setError(null);
            }}
            className={`flex items-center justify-center py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              loginType === "admin"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Admin / Staff</span>
          </button>

          <button
            type="button"
            suppressHydrationWarning
            onClick={() => {
              setLoginType("super_admin");
              setError(null);
            }}
            className={`flex items-center justify-center py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              loginType === "super_admin"
                ? "bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Super Admin</span>
          </button>
        </div>
      </div>

      {/* Form */}
      <form suppressHydrationWarning onSubmit={handleLogin} className="p-7 space-y-5">
        <input type="hidden" name="loginType" value={loginType} />

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {loginType === "super_admin" ? "Super Admin Email" : "Admin / Staff Email"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserCircleIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <input 
                type="email" 
                name="email"
                placeholder={loginType === "super_admin" ? "superadmin@sellads.in" : "admin@sellads.in"}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-sm text-foreground" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <input 
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-sm text-foreground" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs leading-relaxed text-center animate-in fade-in duration-150">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isPending}
          className={`w-full h-11 flex items-center justify-center rounded-lg font-bold text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none cursor-pointer ${
            loginType === "super_admin"
              ? "bg-gradient-to-r from-purple-700 via-indigo-600 to-indigo-700 text-white hover:brightness-110 shadow-purple-600/20"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20"
          }`}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Authenticating...
            </span>
          ) : (
            <span>
              {loginType === "super_admin" ? "Sign In as Super Admin" : "Sign In as Admin"}
            </span>
          )}
        </button>

        {/* Security Notice */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-center text-center text-slate-400">
          <p className="text-[11px] font-medium">
            Authorized personnel only. Access is strictly managed.
          </p>
        </div>
      </form>
    </div>
  );
}
