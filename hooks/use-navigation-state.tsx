"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of our context
interface NavigationStateContextType {
  isNavigating: boolean;
  setIsNavigating: (state: boolean) => void;
}

// Create the context with default values
const NavigationStateContext = createContext<NavigationStateContextType>({
  isNavigating: false,
  setIsNavigating: () => {},
});

// Provider component
export function NavigationStateProvider({ children }: { children: ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);

  return (
    <NavigationStateContext.Provider value={{ isNavigating, setIsNavigating }}>
      {children}
    </NavigationStateContext.Provider>
  );
}

// Hook to use the navigation state context
export function useNavigationState() {
  const context = useContext(NavigationStateContext);

  if (context === undefined) {
    throw new Error("useNavigationState must be used within a NavigationStateProvider");
  }

  return context;
}
