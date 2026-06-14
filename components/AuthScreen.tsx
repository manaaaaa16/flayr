"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function AuthScreen() {
  const [loading, setLoading] = useState(false);

  async function handleGoogleLogin() {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div className="flex items-center gap-2 mb-12">
        <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L8.5 5.5H13L9.25 8.5L10.5 13L7 10.5L3.5 13L4.75 8.5L1 5.5H5.5L7 1Z" fill="white"/>
          </svg>
        </div>
        <span className="text-white font-bold text-2xl tracking-tight">Flayr</span>
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight">
        Study smarter,<br />
        <span className="text-brand-500">not harder.</span>
      </h1>
      <p className="text-white/40 mt-3 text-base leading-relaxed">
        Snap a photo of your notes.<br />Get flashcards in seconds.
      </p>

      <div className="mt-12 w-full max-w-xs flex flex-col gap-3">
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-white text-gray-800 font-semibold text-base flex items-center justify-center gap-3 active:scale-[0.98] transition-transform disabled:opacity-60"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.78h5.4a4.6 4.6 0 01-2 3.02v2.5h3.24c1.9-1.74 3-4.3 3-7.3z" fill="#4285F4"/>
            <path d="M10 20c2.7 0 4.96-.9 6.62-2.42l-3.24-2.5c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.6-4.12H1.08v2.58A10 10 0 0010 20z" fill="#34A853"/>
            <path d="M4.4 11.92A6 6 0 014.08 10c0-.67.12-1.32.32-1.92V5.5H1.08A10 10 0 000 10c0 1.62.38 3.14 1.08 4.5l3.32-2.58z" fill="#FBBC05"/>
            <path d="M10 3.96c1.46 0 2.78.5 3.8 1.5l2.86-2.86C14.96.9 12.7 0 10 0A10 10 0 001.08 5.5l3.32 2.58C5.2 5.72 7.4 3.96 10 3.96z" fill="#EA4335"/>
          </svg>
          {loading ? "Redirecting..." : "Continue with Google"}
        </button>

        <p className="text-white/20 text-xs mt-2">
          Free to use · No credit card needed
        </p>
      </div>
    </div>
  );
}
