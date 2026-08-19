"use client";

import { useEffect } from "react";
import { createClient } from "@/backend/db/client";

const SESSION_STORAGE_KEY = "sellads_tab_auth_session";

export function getTabSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setTabSession(session: any) {
  if (typeof window === "undefined") return;
  try {
    if (session) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at,
        user: session.user ? { id: session.user.id, email: session.user.email } : null
      }));
    } else {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch (err) {
    console.warn("Failed to set tab session in sessionStorage:", err);
  }
}

export function clearTabSession() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (err) {
    console.warn("Failed to clear tab session:", err);
  }
}

export default function TabSessionManager() {
  useEffect(() => {
    const supabase = createClient();

    // 1. Check active session on mount and ensure this tab's sessionStorage has it
    async function syncSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const savedTabSession = getTabSession();

        if (session) {
          // Update this tab's private sessionStorage with active tokens
          setTabSession(session);
        } else if (savedTabSession?.access_token && savedTabSession?.refresh_token) {
          // Another tab cleared the cookie on logout, but THIS tab still has its session!
          // Restore the session and browser cookies for this tab!
          const { data: restored } = await supabase.auth.setSession({
            access_token: savedTabSession.access_token,
            refresh_token: savedTabSession.refresh_token,
          });
          if (restored?.session) {
            setTabSession(restored.session);
          }
        }
      } catch (err) {
        console.warn("TabSessionManager sync error:", err);
      }
    }

    syncSession();

    // 2. When switching back to this tab (focus / visibilitychange), auto-restore cookies if cleared
    const handleFocus = async () => {
      const savedTabSession = getTabSession();
      if (savedTabSession?.access_token && savedTabSession?.refresh_token) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            // Cookie missing - restore immediately
            await supabase.auth.setSession({
              access_token: savedTabSession.access_token,
              refresh_token: savedTabSession.refresh_token,
            });
          }
        } catch (err) {
          console.warn("Focus session restore error:", err);
        }
      }
    };

    window.addEventListener("focus", handleFocus);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        handleFocus();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // 3. Before clicking links / navigating, ensure cookies are valid for this tab
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (target && target.getAttribute("href")?.startsWith("/")) {
        const saved = getTabSession();
        if (saved?.access_token && saved?.refresh_token) {
          supabase.auth.setSession({
            access_token: saved.access_token,
            refresh_token: saved.refresh_token,
          }).catch(() => {});
        }
      }
    };

    document.addEventListener("click", handleLinkClick, { capture: true });

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("click", handleLinkClick, { capture: true });
    };
  }, []);

  return null;
}
