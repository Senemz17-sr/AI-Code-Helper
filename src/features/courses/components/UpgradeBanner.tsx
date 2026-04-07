/**
 * Upgrade Banner Component
 * Displays upgrade call-to-action for premium features
 */

import React from "react";
import { Crown, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpgradeBannerProps {
  title?: string;
  description?: string;
  onUpgrade?: () => void;
  onDismiss?: () => void;
  variant?: "default" | "compact" | "inline";
  showDismiss?: boolean;
}

export function UpgradeBanner({
  title = "Unlock Premium Features",
  description = "Upgrade to Premium to access advanced courses and exclusive content.",
  onUpgrade,
  onDismiss,
  variant = "default",
  showDismiss = true,
}: UpgradeBannerProps) {
  if (variant === "compact") {
    return (
      <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg p-3 text-white shadow-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-semibold">{title}</span>
          </div>
          {onUpgrade && (
            <Button
              onClick={onUpgrade}
              size="sm"
              variant="secondary"
              className="flex-shrink-0"
            >
              Upgrade
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
        <div className="flex items-start gap-3">
          <Crown className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-amber-900 dark:text-amber-100 text-sm">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-amber-800 dark:text-amber-200 mt-1">
                {description}
              </p>
            )}
          </div>
          {onUpgrade && (
            <Button
              onClick={onUpgrade}
              variant="default"
              size="sm"
              className="flex-shrink-0 ml-2"
            >
              Upgrade
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="relative bg-gradient-to-r from-amber-400 via-orange-400 to-orange-500 rounded-xl p-6 text-white shadow-lg overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -right-8 -top-8 w-20 h-20 bg-white/10 rounded-full" />
      <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 rounded-full p-3 flex-shrink-0">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">{title}</h3>
              <p className="text-sm font-medium opacity-90 max-w-md">
                {description}
              </p>

              {/* Features list */}
              <ul className="mt-3 space-y-1 text-sm font-medium opacity-90">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                  Advanced Courses & Tutorials
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                  Priority AI Support
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                  Certificates of Completion
                </li>
              </ul>
            </div>
          </div>

          {/* Close button */}
          {showDismiss && onDismiss && (
            <button
              onClick={onDismiss}
              className="flex-shrink-0 text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Action button */}
        {onUpgrade && (
          <Button
            onClick={onUpgrade}
            size="lg"
            className="mt-4 bg-white text-amber-600 hover:bg-slate-100 font-bold group w-full sm:w-auto"
          >
            Upgrade to Premium
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default UpgradeBanner;
