"use client";

import { useState, useEffect } from "react";
import { Cookie, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if consent has already been given
    const consent = getCookie("gym_nation_cookie_consent");
    if (!consent) {
      // Show banner with a slight delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    setCookie("gym_nation_cookie_consent", "accepted", 365);
    setIsVisible(false);
  };

  const handleDecline = () => {
    setCookie("gym_nation_cookie_consent", "declined", 365);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="bg-card/95 border border-border/80 backdrop-blur-md shadow-2xl p-6 rounded-2xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-brand/10 text-brand rounded-xl flex items-center justify-center shrink-0">
              <Cookie className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">Cookie Preference</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Shield className="h-3.5 w-3.5 text-success" /> GDPR & Privacy Compliant
              </p>
            </div>
          </div>
          <button 
            onClick={handleDecline} 
            className="text-muted-foreground hover:text-foreground p-1 hover:bg-muted rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          We use essential cookies to maintain your shopping cart, persist user authentication, and secure checkout processes. Optional analytics cookies help us optimize program scheduling.
        </p>

        {/* Buttons */}
        <div className="flex gap-2 justify-end pt-2 border-t border-border/50">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDecline}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground rounded-lg h-9 px-3 cursor-pointer"
          >
            Reject Non-Essential
          </Button>
          <Button 
            size="sm" 
            onClick={handleAccept}
            className="text-xs font-semibold bg-brand hover:bg-brand-light text-brand-foreground rounded-lg h-9 px-4 cursor-pointer"
          >
            Accept All Cookies
          </Button>
        </div>
      </div>
    </div>
  );
}

// Cookie helpers
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

function setCookie(name: string, value: string, days: number): void {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `; expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Lax; Secure`;
}
