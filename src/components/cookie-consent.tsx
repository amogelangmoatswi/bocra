"use client";

import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const COOKIE_CONSENT_KEY = "bocra-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if consent hasn't been given yet
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay for a smooth entrance after page load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-[90] animate-fade-in-up"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="bg-white dark:bg-bocra-navy border-t border-border/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Icon */}
            <div className="w-10 h-10 rounded-lg bg-bocra-blue/10 flex items-center justify-center shrink-0">
              <Cookie className="w-5 h-5 text-bocra-blue" />
            </div>

            {/* Text */}
            <div className="flex-1 text-sm text-muted-foreground leading-relaxed">
              <h3 className="font-semibold text-foreground mb-1">Privacy Notice</h3>
              <p>
                Please note that we use cookies to offer you a better user experience. By continuing to use this
                website, you consent to the use of cookies in accordance with our{" "}
                <a href="/terms" className="text-bocra-blue hover:underline font-medium">
                  terms &amp; conditions
                </a>{" "}
                and our{" "}
                <a href="/privacy" className="text-bocra-blue hover:underline font-medium">
                  Privacy Policy
                </a>
                .
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecline}
                className="text-muted-foreground"
              >
                Decline
              </Button>
              <Button
                size="sm"
                onClick={handleAccept}
                className="bg-bocra-blue hover:bg-bocra-blue-light text-white"
              >
                Accept Cookies
              </Button>
            </div>

            {/* Close */}
            <button
              onClick={handleDecline}
              className="absolute top-2 right-3 sm:static text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close cookie notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
