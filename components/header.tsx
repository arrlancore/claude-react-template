"use client";

import Link from "next/link";
import { useState } from "react";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { brand } from "@/config";
import { Menu, X } from "lucide-react";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo section */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <h1 className="text-xl md:text-2xl font-extrabold">
              <span>{brand.title}</span>
              {brand.domain && (
                <span className="bg-gradient-to-tr from-primary to-primary-foreground bg-clip-text text-transparent">
                  .{brand.domain}
                </span>
              )}
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#features"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </a>
          <a
            href="#about"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </a>
          <a
            href="#contact"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </a>
          <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
            Blog
          </Link>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost">Sign In</Button>
          <Button>Get Started</Button>
          <ModeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle Menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b">
          <div className="container py-4 px-4 sm:px-6">
            <nav className="flex flex-col space-y-4">
              <a
                href="#features"
                className="py-2 text-muted-foreground hover:text-foreground"
                onClick={toggleMenu}
              >
                Features
              </a>
              <a
                href="#pricing"
                className="py-2 text-muted-foreground hover:text-foreground"
                onClick={toggleMenu}
              >
                Pricing
              </a>
              <a
                href="#about"
                className="py-2 text-muted-foreground hover:text-foreground"
                onClick={toggleMenu}
              >
                About
              </a>
              <a
                href="#contact"
                className="py-2 text-muted-foreground hover:text-foreground"
                onClick={toggleMenu}
              >
                Contact
              </a>
              <Link
                href="/blog"
                className="py-2 text-muted-foreground hover:text-foreground"
                onClick={toggleMenu}
              >
                Blog
              </Link>

              <div className="pt-4 flex flex-col space-y-3">
                <Button variant="outline" className="w-full justify-center" onClick={toggleMenu}>
                  Sign In
                </Button>
                <Button className="w-full justify-center" onClick={toggleMenu}>
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
