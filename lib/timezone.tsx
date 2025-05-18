"use client";
import React, { createContext, useContext } from "react";
import { i18nConfig } from "@/config";

// Context to store and provide the current timezone
const TimeZoneContext = createContext<string>(i18nConfig.timeZone);

// Hook to access the current timezone
export const useTimeZone = () => useContext(TimeZoneContext);

// Provider component that allows overriding the timezone
export interface TimeProviderProps {
  timeZone?: string;
  children: React.ReactNode;
}

export const TimeProvider: React.FC<TimeProviderProps> = ({
  timeZone = i18nConfig.timeZone,
  children,
}) => {
  return (
    <TimeZoneContext.Provider value={timeZone}>
      {children}
    </TimeZoneContext.Provider>
  );
};

// Function to get the configured timezone or a provided one
export const getTimeZone = (customTimeZone?: string): string => {
  return customTimeZone || i18nConfig.timeZone;
};

// Function to format a date in the provided timezone
export const formatDateInTimeZone = (
  date: Date | string | number,
  format: string,
  timeZone: string = i18nConfig.timeZone
): string => {
  const dateObject =
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;

  // Format the date using Intl.DateTimeFormat
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(dateObject);
};
