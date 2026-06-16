"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { saveDeck } from "@/lib/storage";
import type { Flashcard } from "@/app/page";

type DeckData = {
  id: string;
  name: string;
  cards: Flashcard[];
};

export default function SharedDeckPage() {
  const { id } = useParams<{ id: string }>();
  const [deck, setDeck] = useState<DeckData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("decks")
        .select("*, cards(*)")
        .eq("id", id)
        .single();

      if (error || !data) { setNotFound(true); setLoading(false); return; }

      const cards = (data.cards || [])
        .sort((a: { position: number }, b: { position: number }) => a.position - b.position)
        .map((c: { id: string; front: string; back: string }) => ({ id: c.id, front: c.front, back: c.back }));

      setDeck({ id: data.id, name: data.name, cards });
      setLoading(false);
    }
    if (id) load();
  }, [id]);

  async function handleSave() {
    if (!user || !deck) return;
    setSaving(true);
    await saveDeck(user.id, deck.name + " (shared)", deck.cards);
    setSaved(true);
    setSaving(false);
  }

  function toggleFlip(cardId: string) {
    setFlipped(prev => {
      const next = new Set(prev);
      next.has(cardId) ? next.delete(cardId) : next.add(cardId);
      return next;
    });
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-500/30 border-t-brand-500 animate-spin" />
      </main>
    );
  }

  if (notFound || !deck) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-6 text-center">
        <p className="text-white/40 font-medium">Deck not found</p>
        <p className="text-white/20 text-sm mt-1">This link may have expired or been deleted</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-brand-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-5 pt-14 pb-20">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <img src="/logo.png" alt="Flayr" className="w-7 h-7 rounded-lg object-cover" />
          <span className="text-white/40 text-sm font-medium">Flayr</span>
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight mt-4">{deck.name}</h1>
        <p className="text-white/40 text-sm mt-1">{deck.cards.length} flashcards · tap to flip</p>

        {/* Save button */}
        <div className="mt-5">
          {!user ? (
            <a
              href="/"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-500 text-white font-semibold text-sm active:scale-95 transition-transform"
            >
              Sign in to save this deck
            </a>
          ) : saved ? (
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-green-500/15 border border-green-500/25 text-green-400 font-semibold text-sm">
              ✓ Saved to your library
            </div>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-500 text-white font-semibold text-sm active:scale-95 transition-transform disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save to my library"}
            </button>
          )}
        </div>

        {/* Cards */}
        <div className="mt-8 flex flex-col gap-4">
          {deck.cards.map((card, i) => {
            const isFlipped = flipped.has(card.id);
            return (
              <button
                key={card.id}
                onClick={() => toggleFlip(card.id)}
                className="w-full text-left"
              >
                <div className="glass rounded-2xl p-5 border border-white/8 active:scale-[0.98] transition-transform">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-brand-500/60 text-xs font-semibold uppercase tracking-widest">
                      {isFlipped ? "Answer" : "Question"}
                    </span>
                    <span className="text-white/20 text-xs">#{i + 1}</span>
                  </div>
                  <p className="text-white font-medium text-base leading-relaxed">
                    {isFlipped ? card.back : card.front}
                  </p>
                  {!isFlipped && (
                    <p className="text-white/25 text-xs mt-3">tap to reveal answer</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 glass rounded-2xl p-5 text-center border border-brand-500/15">
          <p className="text-white font-semibold text-base mb-1">Study smarter with Flayr</p>
          <p className="text-white/40 text-sm mb-4">Snap a photo of your notes → instant flashcards</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 text-white font-semibold text-sm"
          >
            Try Flayr for free
          </a>
        </div>
      </div>
    </main>
  );
}
