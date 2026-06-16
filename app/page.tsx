"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import CameraCapture from "@/components/CameraCapture";
import FlashcardDeck from "@/components/FlashcardDeck";
import GeneratingScreen from "@/components/GeneratingScreen";
import HomeScreen from "@/components/HomeScreen";
import SaveDeckModal from "@/components/SaveDeckModal";
import AuthScreen from "@/components/AuthScreen";
import { loadDecks, saveDeck, deleteDeck, updateDeckCards, updateDeckBestScore } from "@/lib/storage";
import type { Deck } from "@/lib/storage";
import { loadStreak, recordStudySession } from "@/lib/streaks";
import type { StreakData } from "@/lib/streaks";
import { getOrCreateProfile } from "@/lib/friends";
import type { Profile } from "@/lib/friends";
import FriendsScreen from "@/components/FriendsScreen";

export type Flashcard = {
  id: string;
  front: string;
  back: string;
};

type AppState = "home" | "capture" | "generating" | "naming" | "study";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [state, setState] = useState<AppState>("home");
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);
  const [streak, setStreak] = useState<StreakData>({ currentStreak: 0, longestStreak: 0, lastStudyDate: null, freezeUsedThisWeek: false });
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tab, setTab] = useState<"home" | "friends">("home");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      refreshDecks();
      loadStreak(user.id).then(setStreak);
      getOrCreateProfile(
        user.id,
        user.user_metadata?.full_name || user.email || "User",
        user.user_metadata?.avatar_url || null
      ).then(setProfile);
    }
  }, [user]);

  async function refreshDecks() {
    if (!user) return;
    const data = await loadDecks(user.id);
    setDecks(data);
  }

  async function handleImageCaptured(imageBase64: string, mimeType: string) {
    setState("generating");
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, mimeType }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate flashcards");
      }

      const data = await res.json();
      setCards(data.cards);
      setActiveDeckId(null);
      setState("naming");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("capture");
    }
  }

  async function handleSaveDeck(name: string) {
    if (!user) return;
    const deck = await saveDeck(user.id, name, cards);
    if (deck) {
      setActiveDeckId(deck.id);
      await refreshDecks();
    }
    setState("study");
  }

  function handleSkipSave() {
    setState("study");
  }

  function handleOpenDeck(deck: Deck) {
    setCards(deck.cards);
    setActiveDeckId(deck.id);
    setState("study");
  }

  async function handleDeleteDeck(id: string) {
    await deleteDeck(id);
    await refreshDecks();
  }

  async function handleCardsUpdated(updated: Flashcard[]) {
    setCards(updated);
    if (activeDeckId) {
      await updateDeckCards(activeDeckId, updated);
      await refreshDecks();
    }
  }

  async function handleQuizComplete(scorePct: number) {
    if (!user) return;
    const updated = await recordStudySession(user.id);
    setStreak(updated);
    if (activeDeckId) {
      await updateDeckBestScore(activeDeckId, scorePct);
      await refreshDecks();
    }
  }

  async function handleGoHome() {
    setCards([]);
    setError(null);
    setActiveDeckId(null);
    await refreshDecks();
    setState("home");
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setDecks([]);
    setState("home");
  }

  if (authLoading) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <div className="fixed inset-0 bg-[#0a0a0f]" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 rounded-full border-2 border-brand-500/30 border-t-brand-500 animate-spin" />
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 bg-[#0a0a0f]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-purple-600/8 rounded-full blur-[100px] pointer-events-none" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {!user ? (
          <AuthScreen />
        ) : (
          <>
            {/* Main screens */}
            {state === "home" && tab === "home" && profile && (
              <HomeScreen
                decks={decks}
                user={user}
                streak={streak}
                profile={profile}
                onProfileUpdated={setProfile}
                onNewScan={() => setState("capture")}
                onOpenDeck={handleOpenDeck}
                onDeleteDeck={handleDeleteDeck}
                onSignOut={handleSignOut}
              />
            )}
            {state === "home" && tab === "friends" && profile && (
              <FriendsScreen userId={user.id} profile={profile} />
            )}
            {state === "capture" && (
              <CameraCapture
                onImageCaptured={handleImageCaptured}
                error={error}
                onBack={() => setState("home")}
              />
            )}
            {state === "generating" && <GeneratingScreen />}
            {state === "naming" && (
              <SaveDeckModal
                cardCount={cards.length}
                onSave={handleSaveDeck}
                onSkip={handleSkipSave}
              />
            )}
            {state === "study" && (
              <FlashcardDeck
                cards={cards}
                onCardsUpdated={handleCardsUpdated}
                onBack={handleGoHome}
                onQuizComplete={handleQuizComplete}
                language={profile?.language || "en"}
              />
            )}

            {/* Bottom tab bar — only show on home screens */}
            {state === "home" && (
              <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
                <div className="glass border-t border-white/8 flex">
                  <button
                    onClick={() => setTab("home")}
                    className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${tab === "home" ? "text-brand-500" : "text-white/30"}`}
                  >
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <path d="M3 9.5L11 3L19 9.5V19C19 19.6 18.6 20 18 20H14V15H8V20H4C3.4 20 3 19.6 3 19V9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-xs font-medium">Home</span>
                  </button>
                  <button
                    onClick={() => setTab("friends")}
                    className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${tab === "friends" ? "text-brand-500" : "text-white/30"}`}
                  >
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M3 19C3 16.2 5.7 14 9 14C12.3 14 15 16.2 15 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M16 11C17.7 11 19 12.3 19 14C19 15.4 18.1 16.6 16.8 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M19 19C19 17.4 17.9 16 16.4 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span className="text-xs font-medium">Friends</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
