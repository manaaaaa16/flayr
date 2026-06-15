"use client";

import { useState } from "react";
import type { Deck } from "@/lib/storage";
import { getMastery } from "@/lib/storage";
import type { StreakData } from "@/lib/streaks";
import type { User } from "@supabase/supabase-js";

type Props = {
  decks: Deck[];
  user: User;
  streak: StreakData;
  onNewScan: () => void;
  onOpenDeck: (deck: Deck) => void;
  onDeleteDeck: (id: string) => void;
  onSignOut: () => void;
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en", { month: "short", day: "numeric" });
}

export default function HomeScreen({ decks, user, streak, onNewScan, onOpenDeck, onDeleteDeck, onSignOut }: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function confirmDelete(id: string) {
    setDeletingId(id);
  }

  function handleDelete(id: string) {
    onDeleteDeck(id);
    setDeletingId(null);
  }

  return (
    <div className="flex flex-col min-h-screen px-5 pt-14 pb-10">
      {/* Header */}
      <div className="animate-fade-in flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L8.5 5.5H13L9.25 8.5L10.5 13L7 10.5L3.5 13L4.75 8.5L1 5.5H5.5L7 1Z" fill="white"/>
              </svg>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Flayr</span>
          </div>
          <p className="text-white/40 text-sm mt-1">
            Hey {user.user_metadata?.name?.split(" ")[0] || "there"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Streak badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass">
            <span className="text-base">🔥</span>
            <span className="text-white font-bold text-sm">{streak.currentStreak}</span>
            {streak.freezeUsedThisWeek && (
              <span className="text-blue-400 text-xs ml-0.5">❄️</span>
            )}
          </div>
          <button
            onClick={onSignOut}
            className="px-3 py-1.5 rounded-lg glass text-white/30 text-xs hover:text-white/60 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* New scan CTA */}
      <button
        onClick={onNewScan}
        className="mt-8 w-full rounded-2xl p-5 flex items-center gap-4 bg-brand-500 active:scale-[0.98] transition-transform animate-slide-up"
      >
        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-white">
            <path d="M15 4H18C19.1 4 20 4.9 20 6V17C20 18.1 19.1 19 18 19H4C2.9 19 2 18.1 2 17V6C2 4.9 2.9 4 4 4H7L9 2H13L15 4Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="11" cy="11" r="3.5" stroke="currentColor" strokeWidth="1.6"/>
          </svg>
        </div>
        <div className="text-left">
          <p className="text-white font-bold text-base">Scan new notes</p>
          <p className="text-white/70 text-sm">Photo → flashcards in seconds</p>
        </div>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-auto text-white/60 flex-shrink-0">
          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Library */}
      <div className="mt-8 flex-1 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        {decks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/4 border border-white/8 flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-white/30">
                <rect x="3" y="6" width="22" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M3 10H25" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 14H14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                <path d="M8 18H12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-white/40 font-medium">No decks yet</p>
            <p className="text-white/20 text-sm mt-1">Scan some notes to get started</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/50 text-xs font-semibold uppercase tracking-widest">Saved decks</p>
              <p className="text-white/25 text-xs">{decks.length} {decks.length === 1 ? "deck" : "decks"}</p>
            </div>
            <div className="flex flex-col gap-3">
              {decks.map((deck) => (
                <div key={deck.id} className="relative">
                  {deletingId === deck.id ? (
                    <div className="glass rounded-2xl p-4 flex items-center justify-between border border-red-500/20">
                      <p className="text-white/70 text-sm">Delete "{deck.name}"?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDeletingId(null)}
                          className="px-3 py-1.5 rounded-lg text-white/50 text-sm hover:text-white/80 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDelete(deck.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => onOpenDeck(deck)}
                      className="w-full glass rounded-2xl p-4 flex items-center gap-4 active:scale-[0.98] transition-transform text-left group"
                    >
                      {/* Card count badge */}
                      <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/15 flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-brand-500 font-bold text-lg leading-none">{deck.cards.length}</span>
                        <span className="text-brand-500/60 text-[9px] font-medium uppercase tracking-wide mt-0.5">cards</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{deck.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-white/35 text-xs">{timeAgo(deck.createdAt)}</p>
                          {(() => {
                            const m = getMastery(deck.bestScore);
                            return m ? (
                              <span className={`text-xs font-semibold ${m.color}`}>{m.emoji} {m.label}</span>
                            ) : null;
                          })()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); confirmDelete(deck.id); }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                          aria-label="Delete deck"
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 3.5H12M5 3.5V2.5C5 2.2 5.2 2 5.5 2H8.5C8.8 2 9 2.2 9 2.5V3.5M10.5 3.5L10 11C10 11.3 9.8 11.5 9.5 11.5H4.5C4.2 11.5 4 11.3 4 11L3.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white/20 flex-shrink-0">
                          <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
