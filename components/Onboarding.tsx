"use client";

import { useState } from "react";

type Props = {
  onDone: () => void;
};

function SlideOneIllustration() {
  return (
    <svg width="260" height="220" viewBox="0 0 260 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Phone outline */}
      <rect x="80" y="10" width="100" height="170" rx="16" fill="#1a1a2e" stroke="#2a2a4a" strokeWidth="1.5"/>
      {/* Camera viewfinder */}
      <rect x="92" y="30" width="76" height="110" rx="8" fill="#0f0f1f" stroke="#2a2a4a" strokeWidth="1"/>
      {/* Notes content on screen */}
      <rect x="100" y="42" width="60" height="6" rx="3" fill="#4f63ff" opacity="0.6"/>
      <rect x="100" y="54" width="45" height="4" rx="2" fill="#ffffff" opacity="0.15"/>
      <rect x="100" y="63" width="55" height="4" rx="2" fill="#ffffff" opacity="0.12"/>
      <rect x="100" y="72" width="40" height="4" rx="2" fill="#ffffff" opacity="0.15"/>
      <rect x="100" y="81" width="50" height="4" rx="2" fill="#ffffff" opacity="0.12"/>
      <rect x="100" y="90" width="48" height="4" rx="2" fill="#ffffff" opacity="0.15"/>
      <rect x="100" y="99" width="35" height="4" rx="2" fill="#ffffff" opacity="0.12"/>
      <rect x="100" y="108" width="52" height="4" rx="2" fill="#ffffff" opacity="0.15"/>
      {/* Corner brackets on viewfinder */}
      <path d="M96 36 L96 44 M96 36 L104 36" stroke="#4f63ff" strokeWidth="2" strokeLinecap="round"/>
      <path d="M164 36 L164 44 M164 36 L156 36" stroke="#4f63ff" strokeWidth="2" strokeLinecap="round"/>
      <path d="M96 134 L96 126 M96 134 L104 134" stroke="#4f63ff" strokeWidth="2" strokeLinecap="round"/>
      <path d="M164 134 L164 126 M164 134 L156 134" stroke="#4f63ff" strokeWidth="2" strokeLinecap="round"/>
      {/* Shutter button */}
      <circle cx="130" cy="162" r="10" fill="#1e1e3a" stroke="#4f63ff" strokeWidth="1.5"/>
      <circle cx="130" cy="162" r="6" fill="#4f63ff" opacity="0.7"/>
      {/* Flash indicator */}
      <circle cx="110" cy="162" r="3" fill="#ffffff" opacity="0.2"/>
      {/* Floating sparkle */}
      <circle cx="185" cy="50" r="4" fill="#4f63ff" opacity="0.5"/>
      <circle cx="75" cy="90" r="3" fill="#7c8fff" opacity="0.4"/>
      <circle cx="195" cy="130" r="2.5" fill="#4f63ff" opacity="0.3"/>
    </svg>
  );
}

function SlideTwoIllustration() {
  return (
    <svg width="260" height="220" viewBox="0 0 260 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Back card */}
      <rect x="65" y="50" width="140" height="90" rx="14" fill="#181830" stroke="#2a2a4a" strokeWidth="1.5"/>
      {/* Middle card */}
      <rect x="55" y="38" width="140" height="90" rx="14" fill="#1e1e38" stroke="#2a2a4a" strokeWidth="1.5"/>
      {/* Front card */}
      <rect x="45" y="26" width="140" height="90" rx="14" fill="#232344" stroke="#3a3a6a" strokeWidth="1.5"/>
      {/* Question label */}
      <rect x="60" y="40" width="36" height="6" rx="3" fill="#4f63ff" opacity="0.5"/>
      {/* Question text lines */}
      <rect x="60" y="54" width="100" height="5" rx="2.5" fill="#ffffff" opacity="0.5"/>
      <rect x="60" y="64" width="80" height="5" rx="2.5" fill="#ffffff" opacity="0.35"/>
      {/* Divider */}
      <line x1="60" y1="80" x2="170" y2="80" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1"/>
      {/* Answer lines */}
      <rect x="60" y="88" width="90" height="4" rx="2" fill="#ffffff" opacity="0.2"/>
      <rect x="60" y="97" width="70" height="4" rx="2" fill="#ffffff" opacity="0.15"/>
      {/* Lightning bolt - AI indicator */}
      <path d="M198 30 L188 52 L196 52 L186 74 L202 48 L194 48 Z" fill="#4f63ff" opacity="0.9"/>
      {/* Glow behind bolt */}
      <circle cx="194" cy="52" r="18" fill="#4f63ff" opacity="0.08"/>
      {/* Checkmark badge */}
      <circle cx="172" cy="106" r="12" fill="#10b981" opacity="0.15"/>
      <circle cx="172" cy="106" r="12" stroke="#10b981" strokeWidth="1" opacity="0.4"/>
      <path d="M167 106 L170.5 109.5 L177 103" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SlideThreeIllustration() {
  return (
    <svg width="260" height="220" viewBox="0 0 260 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Podium base */}
      <rect x="85" y="140" width="50" height="60" rx="6" fill="#1e1e38" stroke="#2a2a4a" strokeWidth="1.5"/>
      <rect x="55" y="160" width="46" height="40" rx="6" fill="#181830" stroke="#2a2a4a" strokeWidth="1.5"/>
      <rect x="149" y="170" width="46" height="30" rx="6" fill="#181830" stroke="#2a2a4a" strokeWidth="1.5"/>
      {/* Podium numbers */}
      <text x="110" y="175" textAnchor="middle" fill="#4f63ff" fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif">1</text>
      <text x="78" y="190" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="600" fontFamily="Inter, sans-serif" opacity="0.5">2</text>
      <text x="172" y="195" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="600" fontFamily="Inter, sans-serif" opacity="0.5">3</text>
      {/* Avatar circles */}
      <circle cx="110" cy="122" r="16" fill="#2a2a50" stroke="#4f63ff" strokeWidth="2"/>
      <circle cx="78" cy="145" r="13" fill="#222240" stroke="#3a3a5a" strokeWidth="1.5"/>
      <circle cx="172" cy="153" r="13" fill="#222240" stroke="#3a3a5a" strokeWidth="1.5"/>
      {/* Avatar initials */}
      <text x="110" y="127" textAnchor="middle" fill="#4f63ff" fontSize="11" fontWeight="700" fontFamily="Inter, sans-serif">R</text>
      <text x="78" y="150" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="600" fontFamily="Inter, sans-serif" opacity="0.5">A</text>
      <text x="172" y="158" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="600" fontFamily="Inter, sans-serif" opacity="0.5">M</text>
      {/* Crown above 1st */}
      <path d="M100 105 L104 95 L110 101 L116 95 L120 105 Z" fill="#f59e0b" opacity="0.9"/>
      {/* Streak flame */}
      <text x="185" y="80" fontSize="22" fontFamily="Inter, sans-serif">🔥</text>
      <rect x="176" y="84" width="28" height="16" rx="8" fill="#1e1e38" stroke="#2a2a4a" strokeWidth="1"/>
      <text x="190" y="96" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="700" fontFamily="Inter, sans-serif">12</text>
      {/* Stars */}
      <circle cx="55" cy="60" r="2.5" fill="#4f63ff" opacity="0.4"/>
      <circle cx="200" cy="50" r="2" fill="#7c8fff" opacity="0.5"/>
      <circle cx="45" cy="130" r="2" fill="#4f63ff" opacity="0.3"/>
    </svg>
  );
}

const slides = [
  {
    illustration: <SlideOneIllustration />,
    title: "Snap your notes",
    description: "Take a photo of any notes, textbook, or slide. Flayr reads it instantly.",
    glow: "rgba(79,99,255,0.12)",
  },
  {
    illustration: <SlideTwoIllustration />,
    title: "Get instant flashcards",
    description: "AI turns your photo into perfect study cards in seconds. No typing needed.",
    glow: "rgba(124,99,255,0.12)",
  },
  {
    illustration: <SlideThreeIllustration />,
    title: "Study & compete",
    description: "Build streaks, earn mastery badges, and beat your friends on the leaderboard.",
    glow: "rgba(245,158,11,0.08)",
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
      {/* Glow blob */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{ background: `radial-gradient(ellipse at 50% 30%, ${slide.glow} 0%, transparent 70%)` }}
      />

      {/* Skip */}
      <button
        onClick={() => { setExiting(true); setTimeout(onDone, 350); }}
        className="absolute top-14 right-6 text-white/25 text-sm font-medium"
      >
        Skip
      </button>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center" key={index}>
        {/* Illustration */}
        <div className="relative flex items-center justify-center mb-10 animate-slide-up">
          {slide.illustration}
        </div>

        {/* Text */}
        <h1 className="relative text-3xl font-extrabold tracking-tight text-white mb-4 animate-slide-up" style={{ animationDelay: "0.06s" }}>
          {slide.title}
        </h1>
        <p className="relative text-white/45 text-base leading-relaxed max-w-xs animate-slide-up" style={{ animationDelay: "0.12s" }}>
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
