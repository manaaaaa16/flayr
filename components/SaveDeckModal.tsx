"use client";

import { useState, useRef, useEffect } from "react";

type Props = {
  cardCount: number;
  onSave: (name: string) => void;
  onSkip: () => void;
};

export default function SaveDeckModal({ cardCount, onSave, onSkip }: Props) {
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  function handleSave() {
    const trimmed = name.trim();
    onSave(trimmed || `Deck — ${new Date().toLocaleDateString("en", { month: "short", day: "numeric" })}`);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 animate-fade-in">
      {/* Success icon */}
      <div className="w-20 h-20 rounded-3xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="text-green-400">
          <path d="M8 18L14 24L28 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <h2 className="text-2xl font-extrabold tracking-tight text-center">
        {cardCount} flashcards ready
      </h2>
      <p className="text-white/40 mt-2 text-sm text-center">
        Give this deck a name so you can find it later
      </p>

      {/* Name input */}
      <div className="mt-8 w-full max-w-sm">
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          placeholder="e.g. Biology Chapter 3"
          maxLength={60}
          className="w-full bg-white/5 border border-white/12 rounded-2xl px-4 py-4 text-white text-base placeholder:text-white/25 outline-none focus:border-brand-500/50 focus:bg-white/8 transition-all"
        />
      </div>

      {/* Actions */}
      <div className="mt-4 w-full max-w-sm flex flex-col gap-3">
        <button
          onClick={handleSave}
          className="w-full py-4 rounded-2xl bg-brand-500 text-white font-semibold text-base active:scale-[0.98] transition-transform"
        >
          Save &amp; Study
        </button>
        <button
          onClick={onSkip}
          className="w-full py-4 rounded-2xl glass text-white/50 font-medium text-base active:scale-[0.98] transition-transform"
        >
          Study without saving
        </button>
      </div>
    </div>
  );
}
