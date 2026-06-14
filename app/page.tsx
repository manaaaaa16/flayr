"use client";

import { useState, useEffect } from "react";
import CameraCapture from "@/components/CameraCapture";
import FlashcardDeck from "@/components/FlashcardDeck";
import GeneratingScreen from "@/components/GeneratingScreen";
import HomeScreen from "@/components/HomeScreen";
import SaveDeckModal from "@/components/SaveDeckModal";
import { loadDecks, saveDeck, deleteDeck, updateDeck } from "@/lib/storage";
import type { Deck } from "@/lib/storage";

export type Flashcard = {
  id: string;
  front: string;
  back: string;
};

type AppState = "home" | "capture" | "generating" | "naming" | "study";

export default function Home() {
  const [state, setState] = useState<AppState>("home");
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);

  useEffect(() => {
    setDecks(loadDecks());
  }, []);

  function refreshDecks() {
    setDecks(loadDecks());
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

  function handleSaveDeck(name: string) {
    const deck: Deck = {
      id: `deck-${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      cards,
    };
    saveDeck(deck);
    setActiveDeckId(deck.id);
    refreshDecks();
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

  function handleDeleteDeck(id: string) {
    deleteDeck(id);
    refreshDecks();
  }

  function handleCardsUpdated(updated: Flashcard[]) {
    setCards(updated);
    if (activeDeckId) {
      updateDeck(activeDeckId, updated);
      refreshDecks();
    }
  }

  function handleGoHome() {
    setCards([]);
    setError(null);
    setActiveDeckId(null);
    refreshDecks();
    setState("home");
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 bg-[#0a0a0f]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-purple-600/8 rounded-full blur-[100px] pointer-events-none" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {state === "home" && (
          <HomeScreen
            decks={decks}
            onNewScan={() => setState("capture")}
            onOpenDeck={handleOpenDeck}
            onDeleteDeck={handleDeleteDeck}
          />
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
          />
        )}
      </div>
    </main>
  );
}
