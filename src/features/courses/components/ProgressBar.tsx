/**
 * Progress Bar Component
 * Shows course progress with animated fill
 */

import React from "react";
import { CheckCircle2 } from "lucide-react";

interface ProgressBarProps {
  progress: number; // 0-100
  size?: "sm" | "md" | "lg";
  showPercentage?: boolean;
  showLabel?: boolean;
  label?: string;
  completed?: boolean;
}

export function ProgressBar({
  progress,
  size = "md",
  showPercentage = true,
  showLabel = true,
  label = "Progress",
  completed = false,
}: ProgressBarProps) {
  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className={`font-medium text-slate-700 dark:text-slate-300 ${textSizeClasses[size]}`}>
            {label}
          </span>
          {showPercentage && (
            <span className={`text-slate-600 dark:text-slate-400 font-semibold ${textSizeClasses[size]}`}>
              {completed ? "100%" : `${progress}%`}
            </span>
          )}
        </div>
      )}

      <div className={`relative w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            completed
              ? "bg-gradient-to-r from-green-400 to-green-600"
              : "bg-gradient-to-r from-blue-400 to-blue-600"
          }`}
          style={{ width: `${completed ? 100 : progress}%` }}
        />

        {/* Shimmer effect while animating */}
        {progress < 100 && !completed && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent opacity-30" />
          </div>
        )}
      </div>

      {completed && (
        <div className="flex items-center gap-1 mt-2">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
            Course completed!
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Mini Progress Bar Component
 * Compact version for lists/cards
 */
export function MiniProgressBar({
  progress,
  showLabel = false,
  label = "Progress",
}: {
  progress: number;
  showLabel?: boolean;
  label?: string;
}) {
  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            {label}
          </span>
          <span className="text-xs text-slate-600 dark:text-slate-400">
            {progress}%
          </span>
        </div>
      )}
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
