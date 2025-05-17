"use client";

import { TableOfContents as TOC } from "@/types/blog";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface TableOfContentsProps {
  toc: TOC[];
  className?: string;
}

export default function TableOfContents({ toc, className }: TableOfContentsProps) {
  const [activeHeading, setActiveHeading] = useState<string>("");

  // Set up intersection observer to highlight active heading
  useEffect(() => {
    if (toc.length === 0) return;

    const headingElements = toc.map((item) =>
      document.getElementById(item.slug)
    ).filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      {
        rootMargin: "0px 0px -80% 0px",
        threshold: 0.1,
      }
    );

    headingElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      headingElements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <div className={cn("mb-8 rounded-lg border p-4 sticky top-24", className)}>
      <h4 className="font-medium mb-3">Table of Contents</h4>
      <nav>
        <ul className="text-sm space-y-2">
          {toc.map((item) => (
            <li
              key={item.slug}
              className={cn(
                "transition-colors hover:text-foreground",
                activeHeading === item.slug
                  ? "text-foreground font-medium"
                  : "text-muted-foreground",
                item.level === 3 && "ml-4"
              )}
            >
              <a
                href={`#${item.slug}`}
                className={cn(
                  "block transition-colors",
                  activeHeading === item.slug
                    ? "border-l-2 border-primary pl-2"
                    : "pl-2.5"
                )}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
