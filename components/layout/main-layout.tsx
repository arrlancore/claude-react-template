"use client";

import React from "react";
import Header from "../header";
import Footer from "../footer";

interface MainLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export default function MainLayout({
  children,
  fullWidth = false,
  className = ""
}: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className={`flex-grow ${!fullWidth && "container mx-auto px-4 sm:px-6 lg:px-8"} ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
