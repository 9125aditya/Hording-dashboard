"use client";

import { useTransition } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { logout } from "@/backend/actions/auth-actions";
import { clearTabSession } from "@/frontend/components/TabSessionManager";

export default function AdminLogoutButton({ 
  className, 
  iconClassName, 
  label = "Sign Out",
  showLabel = true,
  showIcon = true
}: { 
  className?: string; 
  iconClassName?: string;
  label?: string;
  showLabel?: boolean;
  showIcon?: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    clearTabSession();
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <form onSubmit={handleLogout} className="inline-block w-full">
      <button
        type="submit"
        disabled={isPending}
        title="Sign Out"
        className={className || "flex items-center px-3 py-2.5 text-[13.5px] font-medium rounded-lg w-full transition-all duration-200 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-60 cursor-pointer"}
      >
        {showIcon && (
          isPending ? (
            <Loader2 className={iconClassName || "mr-3 h-[18px] w-[18px] animate-spin text-red-600"} />
          ) : (
            <LogOut className={iconClassName || "mr-3 h-[18px] w-[18px]"} />
          )
        )}
        {showLabel && <span>{isPending ? "Signing out..." : label}</span>}
      </button>
    </form>
  );
}
