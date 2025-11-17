"use client";

import React from "react";
import Header from "../header";
import Footer from "../footer";

interface MainLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

export default function MainLayout({
  children,
  fullWidth = false,
  className = "",
  showHeader = true,
  showFooter = true,
}: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {showHeader && <Header />}
      <main
        className={`flex-grow ${!fullWidth && "container mx-auto px-4 sm:px-6 lg:px-8"} ${className}`}
      >
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
