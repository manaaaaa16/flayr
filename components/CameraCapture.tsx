"use client";

import { useRef, useState, useCallback } from "react";

type Props = {
  onImageCaptured: (base64: string, mimeType: string) => void;
  error: string | null;
  onBack: () => void;
};

export default function CameraCapture({ onImageCaptured, error, onBack }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        const base64 = result.split(",")[1];
        onImageCaptured(base64, file.type);
      };
      reader.readAsDataURL(file);
    },
    [onImageCaptured]
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  return (
    <div className="flex flex-col min-h-screen px-5 pt-14 pb-10">
      {/* Header */}
      <div className="animate-fade-in">
        <div className="flex items-center gap-2 mb-1">
          <button onClick={onBack} className="mr-1 w-8 h-8 rounded-lg glass flex items-center justify-center active:scale-95 transition-transform" aria-label="Back">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8L10 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/></svg>
          </button>
          <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L8.5 5.5H13L9.25 8.5L10.5 13L7 10.5L3.5 13L4.75 8.5L1 5.5H5.5L7 1Z" fill="white"/>
            </svg>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">Flayr</span>
        </div>
        <p className="text-white/40 text-sm mt-4">AI Flashcard Generator</p>
      </div>

      {/* Main headline */}
      <div className="mt-8 animate-slide-up">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
          Snap your notes.
          <br />
          <span className="text-brand-500">Study instantly.</span>
        </h1>
        <p className="mt-3 text-white/50 text-base leading-relaxed">
          Point your camera at any handwritten notes or textbook page. Get flashcards in seconds.
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mt-5 animate-fade-in glass rounded-2xl p-4 border border-red-500/20 bg-red-500/5">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 3V5M5 7H5.01M9 5C9 7.20914 7.20914 9 5 9C2.79086 9 1 7.20914 1 5C1 2.79086 2.79086 1 5 1C7.20914 1 9 2.79086 9 5Z" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-red-400 text-sm leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Camera / upload zone */}
      <div className="mt-8 flex-1 flex flex-col gap-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        {/* Primary: camera snap (mobile) */}
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="relative w-full rounded-3xl overflow-hidden aspect-[3/2] bg-white/[0.03] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 active:scale-[0.98] transition-all duration-200 group"
          aria-label="Take a photo"
        >
          {/* Animated ring */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-brand-500/30 animate-pulse-ring" />
            <div className="relative w-20 h-20 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center group-active:bg-brand-500/20 transition-colors">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="text-brand-500">
                <path d="M23 8H28C29.1 8 30 8.9 30 10V26C30 27.1 29.1 28 28 28H8C6.9 28 6 27.1 6 26V10C6 8.9 6.9 8 8 8H13L15 6H21L23 8Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="18" cy="18" r="5" stroke="currentColor" strokeWidth="1.8"/>
              </svg>
            </div>
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-lg">Take a Photo</p>
            <p className="text-white/40 text-sm mt-1">Point at your notes or textbook</p>
          </div>

          {/* Corner decoration */}
          <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-brand-500/40 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-brand-500/40 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-brand-500/40 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-brand-500/40 rounded-br-lg" />
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-white/30 text-xs font-medium uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        {/* Secondary: upload from gallery */}
        <button
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`w-full rounded-2xl p-5 flex items-center gap-4 border transition-all duration-200 active:scale-[0.98] ${
            isDragging
              ? "border-brand-500/50 bg-brand-500/10"
              : "border-white/8 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.05]"
          }`}
          aria-label="Upload from gallery"
        >
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-white/60">
              <path d="M4 16L7.5 11L10.5 14.5L13.5 10L18 16H4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="2" y="2" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="7" cy="7" r="1.5" fill="currentColor"/>
            </svg>
          </div>
          <div className="text-left">
            <p className="text-white font-medium">Upload from Gallery</p>
            <p className="text-white/40 text-sm">JPG, PNG, or WebP</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-auto text-white/20 flex-shrink-0">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Tips */}
      <div className="mt-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <p className="text-white/25 text-xs text-center">
          Works best with clear, well-lit photos · Handwritten or printed notes
        </p>
      </div>

      {/* Hidden inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
