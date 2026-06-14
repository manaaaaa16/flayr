"use client";

import { useState, useRef, useEffect } from "react";
import type { Flashcard } from "@/app/page";

type Props = {
  card: Flashcard;
  index: number;
  total: number;
  onEdit: (updated: Flashcard) => void;
};

export default function FlashcardCard({ card, index, total, onEdit }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editSide, setEditSide] = useState<"front" | "back">("front");
  const [draftFront, setDraftFront] = useState(card.front);
  const [draftBack, setDraftBack] = useState(card.back);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraftFront(card.front);
    setDraftBack(card.back);
    setEditing(false);
    setFlipped(false);
  }, [card.id]);

  useEffect(() => {
    if (editing) {
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [editing, editSide]);

  function openEdit(side: "front" | "back", e: React.MouseEvent) {
    e.stopPropagation();
    setEditSide(side);
    setEditing(true);
    if (side === "back" && !flipped) setFlipped(true);
    if (side === "front" && flipped) setFlipped(false);
  }

  function saveEdit() {
    onEdit({ ...card, front: draftFront.trim() || card.front, back: draftBack.trim() || card.back });
    setEditing(false);
  }

  function cancelEdit() {
    setDraftFront(card.front);
    setDraftBack(card.back);
    setEditing(false);
  }

  const currentDraft = editSide === "front" ? draftFront : draftBack;
  const setCurrentDraft = editSide === "front" ? setDraftFront : setDraftBack;

  return (
    <div className="w-full px-5">
      {/* Card counter + edit controls */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-white/30 text-sm font-medium">
          {index + 1} <span className="text-white/15">/ {total}</span>
        </span>
        {editing ? (
          <div className="flex items-center gap-2">
            <button onClick={cancelEdit} className="text-white/40 text-xs px-2 py-1">Cancel</button>
            <button
              onClick={saveEdit}
              className="text-brand-500 text-xs font-semibold px-3 py-1 rounded-lg bg-brand-500/10 active:scale-95 transition-transform"
            >
              Save
            </button>
          </div>
        ) : (
          <span className="text-white/30 text-xs">{flipped ? "Answer" : "Tap to reveal"}</span>
        )}
      </div>

      {/* Card */}
      {editing ? (
        <div className="w-full rounded-3xl border border-brand-500/30 p-6 flex flex-col gap-4" style={{ minHeight: "360px", background: "rgba(79,99,255,0.06)" }}>
          {/* Side toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setEditSide("front")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${editSide === "front" ? "bg-brand-500/20 text-brand-500" : "text-white/30 hover:text-white/50"}`}
            >
              Question
            </button>
            <button
              onClick={() => setEditSide("back")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${editSide === "back" ? "bg-purple-500/20 text-purple-400" : "text-white/30 hover:text-white/50"}`}
            >
              Answer
            </button>
          </div>

          <textarea
            ref={textareaRef}
            value={currentDraft}
            onChange={(e) => setCurrentDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Escape") cancelEdit(); }}
            className="flex-1 bg-transparent text-white text-lg font-semibold resize-none outline-none placeholder:text-white/20 leading-relaxed"
            placeholder={editSide === "front" ? "Question…" : "Answer…"}
            rows={5}
          />

          <p className="text-white/20 text-xs">Press Esc to cancel · Switch tabs to edit both sides</p>
        </div>
      ) : (
        <div
          className="card-scene w-full cursor-pointer select-none"
          style={{ height: "360px" }}
          onClick={() => !editing && setFlipped((f) => !f)}
          role="button"
          aria-label={flipped ? "Showing answer, tap to see question" : "Showing question, tap to reveal answer"}
        >
          <div className={`card-inner ${flipped ? "flipped" : ""}`}>
            {/* Front — Question */}
            <div className="card-face w-full h-full rounded-3xl glass p-8 flex flex-col items-center justify-center">
              <div className="absolute top-5 left-5">
                <span className="text-brand-500/60 text-xs font-semibold uppercase tracking-widest">Question</span>
              </div>
              <button
                onClick={(e) => openEdit("front", e)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/25 hover:text-white/60 hover:bg-white/8 transition-colors"
                aria-label="Edit question"
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M9 2L11 4L4 11H2V9L9 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <div className="flex flex-col items-center gap-4 w-full">
                <div className="w-10 h-10 rounded-2xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-brand-500">
                    <path d="M9 3C6.8 3 5 4.8 5 7C5 8.4 5.7 9.6 6.8 10.3L7 10.5V12H11V10.5L11.2 10.3C12.3 9.6 13 8.4 13 7C13 4.8 11.2 3 9 3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                    <path d="M7 14H11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    <path d="M8 16H10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className="text-white text-xl font-semibold text-center leading-relaxed">{card.front}</p>
              </div>

              <div className="absolute bottom-5 right-5 flex items-center gap-1.5 text-white/20">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6H10M6 2L10 6L6 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xs">Flip</span>
              </div>
            </div>

            {/* Back — Answer */}
            <div
              className="card-back card-face w-full h-full rounded-3xl p-8 flex flex-col items-center justify-center"
              style={{ background: "linear-gradient(135deg, rgba(79,99,255,0.15) 0%, rgba(120,60,200,0.08) 100%)", border: "1px solid rgba(79,99,255,0.25)" }}
            >
              <div className="absolute top-5 left-5">
                <span className="text-purple-400/60 text-xs font-semibold uppercase tracking-widest">Answer</span>
              </div>
              <button
                onClick={(e) => openEdit("back", e)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/25 hover:text-white/60 hover:bg-white/8 transition-colors"
                aria-label="Edit answer"
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M9 2L11 4L4 11H2V9L9 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <div className="flex flex-col items-center gap-4 w-full">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-purple-400">
                    <path d="M5 9L8 12L13 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-white text-xl font-semibold text-center leading-relaxed">{card.back}</p>
              </div>

              <div className="absolute bottom-5 right-5 flex items-center gap-1.5 text-white/20">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M10 6H2M6 10L2 6L6 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xs">Flip back</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
