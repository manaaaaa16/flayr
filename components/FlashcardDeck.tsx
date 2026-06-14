"use client";

import { useState, useRef } from "react";
import type { Flashcard } from "@/app/page";
import FlashcardCard from "./FlashcardCard";
import QuizMode from "./QuizMode";

type Mode = "cards" | "quiz";

type Props = {
  cards: Flashcard[];
  onCardsUpdated: (cards: Flashcard[]) => void;
  onBack: () => void;
};

export default function FlashcardDeck({ cards: initialCards, onCardsUpdated, onBack }: Props) {
  const [cards, setCards] = useState<Flashcard[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [knownIds, setKnownIds] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<Mode>("cards");
  const touchStartX = useRef<number | null>(null);

  const current = cards[currentIndex];
  const progress = (currentIndex / cards.length) * 100;

  function handleCardEdit(updated: Flashcard) {
    const next = cards.map((c) => (c.id === updated.id ? updated : c));
    setCards(next);
    onCardsUpdated(next);
  }

  function goNext() {
    if (currentIndex < cards.length - 1) setCurrentIndex((i) => i + 1);
    else setCompleted(true);
  }

  function goPrev() {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }

  function markKnown() {
    setKnownIds((s) => new Set([...s, current.id]));
    goNext();
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(diff) < 60) return;
    if (diff < 0) goNext();
    else goPrev();
  }

  if (completed) {
    const knownCount = knownIds.size;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center animate-fade-in">
        <div className="w-24 h-24 rounded-3xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-6">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" className="text-brand-500">
            <path d="M22 6L26 16H38L28.5 22.5L32 33L22 27L12 33L15.5 22.5L6 16H18L22 6Z" fill="currentColor" opacity="0.2"/>
            <path d="M22 6L26 16H38L28.5 22.5L32 33L22 27L12 33L15.5 22.5L6 16H18L22 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight">Round complete!</h2>
        <p className="text-white/40 mt-2 text-base">You went through all {cards.length} flashcards</p>

        <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-xs">
          <div className="glass rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-green-400">{knownCount}</p>
            <p className="text-white/40 text-sm mt-1">Got it</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-yellow-400">{cards.length - knownCount}</p>
            <p className="text-white/40 text-sm mt-1">Still learning</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => { setCurrentIndex(0); setCompleted(false); setKnownIds(new Set()); }}
            className="w-full py-4 rounded-2xl bg-brand-500 text-white font-semibold text-base active:scale-[0.98] transition-transform"
          >
            Study Again
          </button>
          <button
            onClick={() => { setMode("quiz"); setCompleted(false); }}
            className="w-full py-4 rounded-2xl glass border border-brand-500/20 text-brand-500 font-semibold text-base active:scale-[0.98] transition-transform"
          >
            Try Quiz Mode
          </button>
          <button
            onClick={onBack}
            className="w-full py-4 rounded-2xl glass text-white/50 font-medium text-base active:scale-[0.98] transition-transform"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl glass flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Back to library"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 5L7 9L11 13" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
          </svg>
        </button>

        {/* Mode toggle */}
        <div className="flex items-center glass rounded-xl p-1 gap-1">
          <button
            onClick={() => setMode("cards")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${mode === "cards" ? "bg-brand-500 text-white" : "text-white/40 hover:text-white/60"}`}
          >
            Cards
          </button>
          <button
            onClick={() => setMode("quiz")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${mode === "quiz" ? "bg-brand-500 text-white" : "text-white/40 hover:text-white/60"}`}
          >
            Quiz
          </button>
        </div>

        <div className="w-10 h-10 flex items-center justify-center">
          <span className="text-white/30 text-xs">{cards.length} cards</span>
        </div>
      </div>

      {mode === "quiz" ? (
        <QuizMode cards={cards} onBack={() => setMode("cards")} />
      ) : (
        <>
          {/* Progress bar */}
          <div className="px-5 mb-6">
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Card */}
          <div
            className="flex-1 flex flex-col justify-center animate-slide-up"
            key={current.id}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <FlashcardCard
              card={current}
              index={currentIndex}
              total={cards.length}
              onEdit={handleCardEdit}
            />
          </div>

          {/* Action buttons */}
          <div className="px-5 pt-6 pb-10">
            <div className="flex gap-3">
              {currentIndex > 0 && (
                <button
                  onClick={goPrev}
                  className="w-12 h-14 rounded-2xl glass flex items-center justify-center active:scale-95 transition-transform flex-shrink-0"
                  aria-label="Previous card"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10 4L6 8L10 12" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
                  </svg>
                </button>
              )}

              <button
                onClick={goNext}
                className="flex-1 py-4 rounded-2xl glass border border-yellow-500/20 text-yellow-400 font-semibold text-sm active:scale-[0.98] transition-all active:bg-yellow-500/10 flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3V8L11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                Still learning
              </button>

              <button
                onClick={markKnown}
                className="flex-1 py-4 rounded-2xl bg-green-500/10 border border-green-500/25 text-green-400 font-semibold text-sm active:scale-[0.98] transition-all active:bg-green-500/20 flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 8L7 11L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Got it
              </button>
            </div>

            <p className="text-center text-white/20 text-xs mt-4">
              Swipe left / right to navigate
            </p>
          </div>
        </>
      )}
    </div>
  );
}
