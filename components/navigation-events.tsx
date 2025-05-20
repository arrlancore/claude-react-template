"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useNavigationState } from "@/hooks/use-navigation-state";
import withSuspense from "@/lib/with-suspense";

/**
 * This component tracks navigation state and cleans up toasts
 */
function _NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setIsNavigating } = useNavigationState();
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  // Effect to detect when navigation has completed
  useEffect(() => {
    // Navigation has completed since pathname or searchParams have changed
    const handleRouteChangeComplete = () => {
      // Add a small delay before hiding to ensure progress bar is visible
      // even for very quick navigations
      navigationTimeoutRef.current = setTimeout(() => {
        setIsNavigating(false);
      }, 500);
    };

    // Call immediately when component mounts or when route changes
    handleRouteChangeComplete();

    // Clean up toasts
    if (typeof document !== "undefined") {
      const toastElements = document.querySelectorAll("[data-state]");
      toastElements.forEach((element) => {
        if (element.parentNode) {
          try {
            element.parentNode.removeChild(element);
          } catch (e) {
            console.debug(
              "Navigation cleanup: Error removing toast element",
              e
            );
          }
        }
      });
    }

    // No cleanup needed here as we want this to run on every pathname/searchParams change
  }, [pathname, searchParams, setIsNavigating]);

  // Effect to handle navigation start events
  useEffect(() => {
    // This function signals that navigation is starting
    function onRouteChangeStart() {
      // Clear any existing timeout to avoid race conditions
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
        navigationTimeoutRef.current = null;
      }

      // Signal that navigation is starting
      setIsNavigating(true);
    }

    // Events that indicate navigation is starting
    window.addEventListener("beforeunload", onRouteChangeStart);
    window.addEventListener("popstate", onRouteChangeStart);

    // Click events that may initiate navigation
    const handleDocumentClick = (e: MouseEvent) => {
      // Check if the click is on an anchor tag
      const link = (e.target as Element).closest("a");
      if (
        link &&
        link.href &&
        !link.target &&
        !link.download &&
        link.origin === window.location.origin
      ) {
        onRouteChangeStart();
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      window.removeEventListener("beforeunload", onRouteChangeStart);
      window.removeEventListener("popstate", onRouteChangeStart);
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [setIsNavigating]);

  return null;
}

export const NavigationEvents = withSuspense(_NavigationEvents);
