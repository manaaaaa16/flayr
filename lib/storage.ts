import { supabase } from "./supabase";
import type { Flashcard } from "@/app/page";

export type Deck = {
  id: string;
  name: string;
  createdAt: string;
  cards: Flashcard[];
};

export async function loadDecks(userId: string): Promise<Deck[]> {
  const { data: decks, error } = await supabase
    .from("decks")
    .select("*, cards(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !decks) return [];

  return decks.map((d) => ({
    id: d.id,
    name: d.name,
    createdAt: d.created_at,
    cards: (d.cards || [])
      .sort((a: { position: number }, b: { position: number }) => a.position - b.position)
      .map((c: { id: string; front: string; back: string }) => ({
        id: c.id,
        front: c.front,
        back: c.back,
      })),
  }));
}

export async function saveDeck(
  userId: string,
  name: string,
  cards: Flashcard[]
): Promise<Deck | null> {
  const { data: deck, error: deckError } = await supabase
    .from("decks")
    .insert({ user_id: userId, name })
    .select()
    .single();

  if (deckError || !deck) return null;

  const cardRows = cards.map((c, i) => ({
    deck_id: deck.id,
    front: c.front,
    back: c.back,
    position: i,
  }));

  await supabase.from("cards").insert(cardRows);

  return {
    id: deck.id,
    name: deck.name,
    createdAt: deck.created_at,
    cards,
  };
}

export async function deleteDeck(id: string): Promise<void> {
  await supabase.from("decks").delete().eq("id", id);
}

export async function updateDeckCards(
  deckId: string,
  cards: Flashcard[]
): Promise<void> {
  await supabase.from("cards").delete().eq("deck_id", deckId);
  const cardRows = cards.map((c, i) => ({
    deck_id: deckId,
    front: c.front,
    back: c.back,
    position: i,
  }));
  await supabase.from("cards").insert(cardRows);
}
