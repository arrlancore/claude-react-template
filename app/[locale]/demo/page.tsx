import { Metadata } from "next";
import DemoClient from "./demo-client";

export const metadata: Metadata = {
  title: "Premium Two Pointer Demo | PatternLift",
  description:
    "Experience our premium interactive algorithm visualization with advanced animations and real-time feedback.",
  keywords: [
    "algorithm visualization",
    "two pointer",
    "interactive learning",
    "premium UI",
  ],
};

export default function DemoPage() {
  return (
    <div className="min-h-screen">
      <DemoClient />
    </div>
  );
}
