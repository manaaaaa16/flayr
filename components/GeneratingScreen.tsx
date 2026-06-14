"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "Scanning your notes…",
  "Identifying key concepts…",
  "Writing flashcards…",
  "Almost ready…",
];

export default function GeneratingScreen() {
  const [stepIndex, setStepIndex] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    }, 2200);

    const dotTimer = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 400);

    return () => {
      clearInterval(stepTimer);
      clearInterval(dotTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center">
      {/* Animated orb */}
      <div className="relative w-32 h-32 mb-10">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border border-brand-500/20 animate-spin" style={{ animationDuration: "3s" }} />
        <div className="absolute inset-2 rounded-full border border-brand-500/15 animate-spin" style={{ animationDuration: "2s", animationDirection: "reverse" }} />

        {/* Pulsing core */}
        <div className="absolute inset-4 rounded-full bg-brand-500/10 animate-pulse" />
        <div className="absolute inset-6 rounded-full bg-brand-500/20 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-brand-500 animate-pulse">
            <path d="M14 4L16.5 11.5H24L18 16L20 23.5L14 19.5L8 23.5L10 16L4 11.5H11.5L14 4Z" fill="currentColor"/>
          </svg>
        </div>

        {/* Floating particles */}
        <div className="absolute -top-1 left-1/2 w-1.5 h-1.5 rounded-full bg-brand-500/60 animate-bounce" style={{ animationDelay: "0s" }} />
        <div className="absolute top-1/2 -right-1 w-1 h-1 rounded-full bg-purple-400/60 animate-bounce" style={{ animationDelay: "0.3s" }} />
        <div className="absolute bottom-0 left-1/4 w-1 h-1 rounded-full bg-brand-500/40 animate-bounce" style={{ animationDelay: "0.6s" }} />
      </div>

      {/* Status text */}
      <div className="h-8 flex items-center">
        <p className="text-white text-lg font-medium tabular-nums transition-all duration-500">
          {STEPS[stepIndex]}
        </p>
      </div>

      <p className="text-white/30 text-sm mt-2">
        AI is analyzing your content{dots}
      </p>

      {/* Progress bar */}
      <div className="mt-8 w-48 h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all duration-700"
          style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <p className="mt-12 text-white/20 text-xs">
        Usually takes 5–10 seconds
      </p>
    </div>
  );
}
