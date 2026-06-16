"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import type { Flashcard } from "@/app/page";
import Confetti from "./Confetti";
import MistakeReview from "./MistakeReview";

type Mistake = { question: string; correctAnswer: string; userAnswer: string };

type Props = {
  cards: Flashcard[];
  onBack: () => void;
  onComplete: (scorePct: number) => void;
  language: string;
};

type AnswerState = "idle" | "correct" | "wrong";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildQuestion(cards: Flashcard[], index: number) {
  const card = cards[index];
  const others = cards.filter((c) => c.id !== card.id);
  const distractors = shuffle(others)
    .slice(0, 3)
    .map((c) => c.back);

  while (distractors.length < 3) {
    distractors.push("None of the above");
  }

  const options = shuffle([card.back, ...distractors]);
  return { card, options, correct: card.back };
}

function CountUp({ value, duration = 800 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(value / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(start);
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <>{display}</>;
}

export default function QuizMode({ cards, onBack, onComplete, language }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [showReview, setShowReview] = useState(false);

  const question = useMemo(
    () => buildQuestion(cards, currentIndex),
    [cards, currentIndex]
  );

  const progress = ((currentIndex) / cards.length) * 100;

  function handleSelect(option: string) {
    if (answerState !== "idle") return;
    setSelected(option);
    const isCorrect = option === question.correct;
    setAnswerState(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      setScore((s) => s + 1);
    } else {
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
      setMistakes((m) => [...m, {
        question: question.card.front,
        correctAnswer: question.correct,
        userAnswer: option,
      }]);
    }
  }

  function handleNext() {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setAnswerState("idle");
    } else {
      const finalPct = Math.round((score / cards.length) * 100);
      setFinished(true);
      if (finalPct >= 50) setConfetti(true);
      onComplete(finalPct);
    }
  }

  function handleRestart() {
    setCurrentIndex(0);
    setSelected(null);
    setAnswerState("idle");
    setScore(0);
    setFinished(false);
    setMistakes([]);
    setConfetti(false);
  }

  if (showReview) {
    return <MistakeReview mistakes={mistakes} language={language} onClose={() => setShowReview(false)} />;
  }

  if (finished) {
    const pct = Math.round((score / cards.length) * 100);
    const grade =
      pct >= 90 ? { label: "Excellent!", sublabel: "You're on fire", color: "text-green-400", ring: "border-green-500/40", glow: "rgba(16,185,129,0.12)" } :
      pct >= 70 ? { label: "Good job!", sublabel: "Keep it up", color: "text-brand-500", ring: "border-brand-500/40", glow: "rgba(79,99,255,0.12)" } :
      pct >= 50 ? { label: "Almost there!", sublabel: "A bit more practice", color: "text-yellow-400", ring: "border-yellow-500/40", glow: "rgba(234,179,8,0.10)" } :
      { label: "Keep going!", sublabel: "You'll get it next time", color: "text-orange-400", ring: "border-orange-500/40", glow: "rgba(249,115,22,0.10)" };

    return (
      <div className="flex flex-col items-center justify-center flex-1 px-6 text-center animate-fade-in pb-10">
        <Confetti trigger={confetti} />

        {/* Glow */}
        <div className="fixed inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 30%, ${grade.glow} 0%, transparent 65%)` }} />

        {/* Score ring */}
        <div className="relative mb-8">
          <div className={`w-36 h-36 rounded-full border-2 ${grade.ring} flex flex-col items-center justify-center`}
               style={{ background: "rgba(255,255,255,0.03)" }}>
            <span className={`text-5xl font-extrabold ${grade.color} count-up`}>
              <CountUp value={pct} />
            </span>
            <span className={`text-lg font-bold ${grade.color} opacity-70`}>%</span>
          </div>
          {/* Orbit dot */}
          <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${grade.color.replace("text-", "bg-")} opacity-60`} />
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight text-white">{grade.label}</h2>
        <p className="text-white/35 mt-1 text-base">{grade.sublabel}</p>

        {/* Stats row */}
        <div className="mt-8 grid grid-cols-3 gap-3 w-full max-w-xs">
          <div className="glass rounded-2xl p-4 text-center count-up">
            <p className="text-2xl font-bold text-green-400"><CountUp value={score} /></p>
            <p className="text-white/35 text-xs mt-1">Correct</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center count-up" style={{ animationDelay: "0.08s" }}>
            <p className="text-2xl font-bold text-red-400"><CountUp value={cards.length - score} /></p>
            <p className="text-white/35 text-xs mt-1">Wrong</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center count-up" style={{ animationDelay: "0.16s" }}>
            <p className="text-2xl font-bold text-white/70"><CountUp value={cards.length} /></p>
            <p className="text-white/35 text-xs mt-1">Total</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 w-full max-w-xs">
          {mistakes.length > 0 && (
            <button
              onClick={() => setShowReview(true)}
              className="w-full py-4 rounded-2xl bg-brand-500 text-white font-semibold text-base active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
            >
              ✨ Review {mistakes.length} mistake{mistakes.length !== 1 ? "s" : ""} with AI
            </button>
          )}
          <button
            onClick={handleRestart}
            className={`w-full py-4 rounded-2xl border text-white font-semibold text-base active:scale-[0.98] transition-transform ${mistakes.length === 0 ? "bg-brand-500 border-transparent" : "glass border-white/10"}`}
          >
            Retry Quiz
          </button>
          <button
            onClick={onBack}
            className="w-full py-4 rounded-2xl glass text-white/45 font-medium text-base active:scale-[0.98] transition-transform"
          >
            Back to Flashcards
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Progress */}
      <div className="px-5 mb-2">
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Counter + score */}
      <div className="flex items-center justify-between px-5 mb-6">
        <span className="text-white/30 text-sm">
          {currentIndex + 1} <span className="text-white/15">/ {cards.length}</span>
        </span>
        <span className="text-white/30 text-sm">
          Score: <span className="text-green-400 font-semibold">{score}</span>
        </span>
      </div>

      {/* Question */}
      <div className={`px-5 mb-6 animate-slide-up ${shaking ? "shake" : ""}`} key={currentIndex}>
        <div className="glass rounded-3xl p-6 min-h-[130px] flex flex-col justify-center">
          <span className="text-brand-500/60 text-xs font-semibold uppercase tracking-widest mb-3 block">Question</span>
          <p className="text-white text-xl font-semibold leading-relaxed">{question.card.front}</p>
        </div>
      </div>

      {/* Options */}
      <div className="px-5 flex flex-col gap-3 flex-1">
        {question.options.map((option, i) => {
          const isSelected = selected === option;
          const isCorrect = option === question.correct;
          const revealed = answerState !== "idle";

          let style = "glass border-white/8 text-white/80";
          if (revealed && isCorrect) style = "bg-green-500/12 border-green-500/30 text-green-300";
          else if (revealed && isSelected && !isCorrect) style = "bg-red-500/12 border-red-500/30 text-red-300";
          else if (revealed) style = "glass border-white/5 text-white/30";

          return (
            <button
              key={i}
              onClick={() => handleSelect(option)}
              disabled={revealed}
              className={`w-full rounded-2xl p-4 text-left border text-sm font-medium transition-all duration-200 flex items-center gap-3 ${style} ${!revealed ? "active:scale-[0.98]" : ""}`}
            >
              <span
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                  revealed && isCorrect ? "bg-green-500/20 text-green-300" :
                  revealed && isSelected && !isCorrect ? "bg-red-500/20 text-red-300" :
                  "bg-white/8 text-white/40"
                }`}
              >
                {revealed && isCorrect ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : revealed && isSelected && !isCorrect ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                ) : (
                  String.fromCharCode(65 + i)
                )}
              </span>
              <span className="leading-snug">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Next button — appears after answering */}
      {answerState !== "idle" && (
        <div className="px-5 pt-4 pb-10 animate-slide-up">
          <div className={`mb-3 px-4 py-2 rounded-xl text-sm font-medium text-center ${answerState === "correct" ? "bg-green-500/10 text-green-400" : "bg-red-500/8 text-red-400"}`}>
            {answerState === "correct" ? "Correct!" : `Answer: ${question.correct}`}
          </div>
          <button
            onClick={handleNext}
            className="w-full py-4 rounded-2xl bg-brand-500 text-white font-semibold text-base active:scale-[0.98] transition-transform"
          >
            {currentIndex < cards.length - 1 ? "Next question" : "See results"}
          </button>
        </div>
      )}
    </div>
  );
}
