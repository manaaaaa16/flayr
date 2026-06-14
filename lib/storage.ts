import type { Flashcard } from "@/app/page";

export type Deck = {
  id: string;
  name: string;
  createdAt: string;
  cards: Flashcard[];
};

const KEY = "flayr_decks";

export function loadDecks(): Deck[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveDeck(deck: Deck): void {
  const decks = loadDecks().filter((d) => d.id !== deck.id);
  localStorage.setItem(KEY, JSON.stringify([deck, ...decks]));
}

export function deleteDeck(id: string): void {
  const decks = loadDecks().filter((d) => d.id !== id);
  localStorage.setItem(KEY, JSON.stringify(decks));
}

export function updateDeck(id: string, cards: Flashcard[]): void {
  const decks = loadDecks().map((d) => (d.id === id ? { ...d, cards } : d));
  localStorage.setItem(KEY, JSON.stringify(decks));
}
