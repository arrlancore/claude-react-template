"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { brand } from "@/config";
import Link from "next/link";

export default function HeroSection() {
  const t = useTranslations();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const array = [1, 3, 6, 8, 11, 15];
  const target = 14;

  const steps = [
    { left: 0, right: 5, sum: 16, message: "Start: 1 + 15 = 16 (too high)" },
    {
      left: 0,
      right: 4,
      sum: 12,
      message: "Move right: 1 + 11 = 12 (too low)",
    },
    { left: 1, right: 4, sum: 14, message: "Move left: 3 + 11 = 14 ✓ Found!" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          return 0; // Auto-restart
        }
        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [steps.length]);

  // Start animation on mount
  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const handleStartDemo = () => {
    setCurrentStep(0);
    setIsAnimating(true);
  };

  const currentData = steps[currentStep];

  return (
    <section className=" sm:px-6 lg:px-8 bg-gradient-to-br from-purple-100 via-pink-50 to-purple-200 ">
      <div className="max-w-7xl mx-auto rounded-3xl pb-12 md:pb-20 px-4">
        <div className="flex items-center py-8 mb-12">
          <Link href={"/"} className="flex items-center">
            <h1 className="text-xl md:text-2xl font-extrabold">
              <span>{brand.title}.</span>
            </h1>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Master DSA Patterns in
                <span className="text-primary"> 30 Days</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                Stop grinding LeetCode blindly. Learn the 8 essential algorithm
                patterns that unlock 90% of coding interviews.
              </p>
            </div>

            <div className="flex justify-start">
              <Button size="lg" asChild>
                <a href="/dashboard">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>

            {/* Interview Readiness Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="text-center sm:text-left">
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  87%
                </div>
                <div className="text-sm text-muted-foreground">
                  Interview Ready after Two Pointer
                </div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  90%
                </div>
                <div className="text-sm text-muted-foreground">
                  Problems solved with 8 patterns
                </div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  6-8h
                </div>
                <div className="text-sm text-muted-foreground">
                  vs weeks of grinding
                </div>
              </div>
            </div>
          </div>

          {/* Right Visualization */}
          <div className="relative min-h-[500px] perspective-1000">
            {/* 3D Container */}
            <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl overflow-hidden shadow-2xl">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)",
                  }}
                ></div>
              </div>

              {/* Main 3D Scene */}
              <div className="relative h-full flex flex-col items-center justify-center p-8">
                {/* Problem Title */}
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Two Sum Problem
                  </h3>
                  <p className="text-purple-200 text-sm">
                    Find two numbers that sum to {target}
                  </p>
                </div>

                {/* Array Container - 3D Platform */}
                <div className="relative transform-gpu perspective-1000">
                  {/* Platform Base */}
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-80 h-6 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-full blur-sm"></div>

                  {/* Array Elements */}
                  <div className="flex gap-4 mb-8">
                    {array.map((num, index) => {
                      const isLeft = index === currentData.left;
                      const isRight = index === currentData.right;
                      const isHighlighted = isLeft || isRight;

                      return (
                        <div
                          key={index}
                          className={`
                          relative w-16 h-16 rounded-xl flex items-center justify-center font-bold text-lg
                          transition-all duration-700 transform-gpu
                          ${isHighlighted ? "scale-110 -translate-y-2" : "scale-100"}
                          ${
                            isLeft
                              ? "bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-2xl shadow-blue-500/50"
                              : isRight
                                ? "bg-gradient-to-br from-pink-400 to-pink-600 text-white shadow-2xl shadow-pink-500/50"
                                : "bg-gradient-to-br from-white/10 to-white/5 text-white border border-white/20 backdrop-blur-sm"
                          }
                        `}
                          style={{
                            transformStyle: "preserve-3d",
                            transform: isHighlighted
                              ? "rotateX(-10deg) rotateY(5deg) translateZ(20px)"
                              : "rotateX(0deg) rotateY(0deg) translateZ(0px)",
                          }}
                        >
                          {num}

                          {/* Glow Effect */}
                          {isHighlighted && (
                            <div
                              className={`absolute inset-0 rounded-xl blur-xl opacity-60 ${
                                isLeft ? "bg-blue-400" : "bg-pink-400"
                              }`}
                            ></div>
                          )}

                          {/* Floating Labels */}
                          {isLeft && (
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                              LEFT
                            </div>
                          )}
                          {isRight && (
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-pink-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                              RIGHT
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Status Display - Floating Card */}
                  <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
                    <div className="text-center">
                      <div className="text-sm text-purple-200 mb-2">
                        Current Sum
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {array[currentData.left]} + {array[currentData.right]} =
                        <span
                          className={`ml-1 ${currentData.sum === target ? "text-green-400" : "text-orange-400"}`}
                        >
                          {currentData.sum}
                        </span>
                      </div>
                      <div
                        className={`text-sm mt-2 ${currentData.sum === target ? "text-green-400" : "text-orange-400"}`}
                      >
                        {currentData.message}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
