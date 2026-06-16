"use client";

import { useState } from "react";

type Props = {
  onDone: () => void;
};

const slides = [
  {
    emoji: "📸",
    title: "Snap your notes",
    description: "Take a photo of any notes, textbook, or slide. Flayr reads it instantly.",
    color: "from-brand-500/20 to-purple-500/10",
    accent: "bg-brand-500",
  },
  {
    emoji: "⚡",
    title: "Get instant flashcards",
    description: "AI turns your photo into perfect study cards in seconds. No typing needed.",
    color: "from-purple-500/20 to-pink-500/10",
    accent: "bg-purple-500",
  },
  {
    emoji: "🏆",
    title: "Study & compete",
    description: "Build streaks, earn mastery badges, and beat your friends on the leaderboard.",
    color: "from-yellow-500/15 to-orange-500/10",
    accent: "bg-yellow-500",
  },
];

export default function Onboarding({ onDone }: Props) {
  const [index, setIndex] = useState(0);
  const [exiting, setExiting] = useState(false);

  const slide = slides[index];
  const isLast = index === slides.length - 1;

  function handleNext() {
    if (isLast) {
      setExiting(true);
      setTimeout(onDone, 350);
    } else {
      setIndex(index + 1);
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between px-6 pt-20 pb-14 bg-[#0a0a0f] transition-opacity duration-300 ${exiting ? "opacity-0" : "opacity-100"}`}
    >
      {/* Skip */}
      <button
        onClick={() => { setExiting(true); setTimeout(onDone, 350); }}
        className="absolute top-14 right-6 text-white/25 text-sm font-medium"
      >
        Skip
      </button>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center" key={index}>
        {/* Glow blob */}
        <div className={`absolute inset-0 bg-gradient-to-b ${slide.color} pointer-events-none`} />

        {/* Icon */}
        <div className="relative w-32 h-32 rounded-3xl glass flex items-center justify-center mb-10 animate-slide-up">
          <span className="text-6xl">{slide.emoji}</span>
        </div>

        {/* Text */}
        <h1 className="relative text-3xl font-extrabold tracking-tight text-white mb-4 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          {slide.title}
        </h1>
        <p className="relative text-white/50 text-base leading-relaxed max-w-xs animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {slide.description}
        </p>
      </div>

      {/* Bottom controls */}
      <div className="relative w-full flex flex-col items-center gap-6">
        {/* Dots */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${i === index ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/20"}`}
            />
          ))}
        </div>

        {/* Button */}
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-brand-500 text-white font-bold text-base active:scale-[0.98] transition-transform"
        >
          {isLast ? "Get started" : "Next"}
        </button>
      </div>
    </div>
  );
}
