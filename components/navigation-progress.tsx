"use client";

import { useNavigationState } from "@/hooks/use-navigation-state";
import { useEffect, useState } from "react";

export function NavigationProgress() {
  const { isNavigating } = useNavigationState();
  const [visible, setVisible] = useState(false);

  // Use this effect to handle the appearance and disappearance with transition
  useEffect(() => {
    if (isNavigating) {
      // Show immediately when navigation starts
      setVisible(true);
    } else {
      // Hide with a delay to allow for smooth transition
      const timer = setTimeout(() => {
        setVisible(false);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isNavigating]);

  // If not visible at all, don't render anything
  if (!visible && !isNavigating) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 h-1 bg-primary/10 z-[100] overflow-hidden transition-opacity duration-300 ${
        isNavigating ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
      role="progressbar"
    >
      <div className="h-full w-full relative">
        {/* Progress bar with animation */}
        <div className="absolute inset-0 bg-primary animate-progress-bar origin-left shadow-sm shadow-primary/50" />

        {/* Pulsing overlay */}
        <div className="absolute inset-0 bg-primary/40 animate-pulse" />
      </div>
    </div>
  );
}
