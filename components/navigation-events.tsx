"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * This component handles toast cleanup on navigation events
 * It captures Next.js router changes and cleans up toasts
 */
export function NavigationEvents() {
  const router = useRouter();

  useEffect(() => {
    // This function will clear any toast-related DOM operations when navigating
    function onRouteChangeStart() {
      // Find any toast elements and remove them gracefully
      if (typeof document !== 'undefined') {
        // Find toast elements by their data attributes (common in shadcn/ui implementation)
        const toastElements = document.querySelectorAll('[data-state]');

        // Remove them one by one
        toastElements.forEach(element => {
          if (element.parentNode) {
            try {
              element.parentNode.removeChild(element);
            } catch (e) {
              // Ignore errors if the node has already been removed
              console.debug('Navigation cleanup: Error removing toast element', e);
            }
          }
        });
      }
    }

    // We can't directly listen to Next.js App Router navigation events,
    // so we rely on DOM events as a proxy
    window.addEventListener('beforeunload', onRouteChangeStart);

    // Browser back/forward button
    window.addEventListener('popstate', onRouteChangeStart);

    return () => {
      window.removeEventListener('beforeunload', onRouteChangeStart);
      window.removeEventListener('popstate', onRouteChangeStart);
    };
  }, [router]);

  return null;
}
