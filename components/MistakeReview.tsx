"use client";

import { useState, useEffect } from "react";

type Mistake = {
  question: string;
  correctAnswer: string;
  userAnswer: string;
};

type Props = {
  mistakes: Mistake[];
  onClose: () => void;
};

export default function MistakeReview({ mistakes, onClose }: Props) {
  const [explanations, setExplanations] = useState<string[]>([]);
  const limited = mistakes.slice(0, 5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchExplanations() {
      try {
        const res = await fetch("/api/explain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mistakes: limited }),
        });
        const data = await res.json();
        console.log("explain response:", data);
        if (data.explanations) {
          setExplanations(data.explanations.map((e: { tip: string }) => e.tip));
        } else {
          setError(true);
        }
      } catch (e) {
        console.error("explain error:", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchExplanations();
  }, []);

  return (
    <div className="flex flex-col min-h-screen px-5 pt-14 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Review mistakes</h1>
          <p className="text-white/40 text-sm mt-1">{mistakes.length} wrong answer{mistakes.length !== 1 ? "s" : ""} — here's why</p>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl glass text-white/50 text-sm font-medium active:scale-95 transition-transform"
        >
          Done
        </button>
      </div>

      {loading && (
        <div className="flex flex-col gap-4">
          {limited.map((_, i) => (
            <div key={i} className="glass rounded-2xl p-5 animate-pulse">
              <div className="h-3 bg-white/10 rounded-full w-3/4 mb-3" />
              <div className="h-3 bg-white/6 rounded-full w-1/2 mb-6" />
              <div className="h-2 bg-white/8 rounded-full w-full mb-2" />
              <div className="h-2 bg-white/8 rounded-full w-5/6" />
            </div>
          ))}
          <p className="text-center text-white/25 text-sm mt-2">Claude is analyzing your mistakes...</p>
        </div>
      )}

      {error && (
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-white/50">Couldn't load explanations. Try again later.</p>
        </div>
      )}

      {!loading && !error && (
        <div className="flex flex-col gap-4">
          {limited.map((m, i) => (
            <div key={i} className="glass rounded-2xl p-5 animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
              {/* Question */}
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2">Question</p>
              <p className="text-white font-semibold text-sm mb-4">{m.question}</p>

              {/* Answers */}
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-red-500/8 border border-red-500/15">
                  <span className="text-red-400 text-xs mt-0.5 flex-shrink-0">✗</span>
                  <p className="text-red-300/80 text-xs">{m.userAnswer}</p>
                </div>
                <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-green-500/8 border border-green-500/15">
                  <span className="text-green-400 text-xs mt-0.5 flex-shrink-0">✓</span>
                  <p className="text-green-300/80 text-xs">{m.correctAnswer}</p>
                </div>
              </div>

              {/* AI explanation */}
              <div className="border-t border-white/6 pt-4">
                <p className="text-brand-500/70 text-xs font-semibold uppercase tracking-widest mb-2">Why?</p>
                <p className="text-white/70 text-sm leading-relaxed">{explanations[i]}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
