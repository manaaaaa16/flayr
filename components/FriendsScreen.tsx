"use client";

import { useState, useEffect } from "react";
import type { Profile, LeaderboardEntry } from "@/lib/friends";
import { addFriendByCode, getLeaderboard } from "@/lib/friends";

type Props = {
  userId: string;
  profile: Profile;
};

function Avatar({ name, avatarUrl, size = 36 }: { name: string; avatarUrl: string | null; size?: number }) {
  if (avatarUrl) {
    return <img src={avatarUrl} alt={name} style={{ width: size, height: size }} className="rounded-full object-cover" />;
  }
  return (
    <div
      style={{ width: size, height: size, background: "rgba(79,99,255,0.2)", flexShrink: 0 }}
      className="rounded-full flex items-center justify-center text-brand-500 font-bold text-sm"
    >
      {name[0]?.toUpperCase()}
    </div>
  );
}

export default function FriendsScreen({ userId, profile }: Props) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getLeaderboard(userId).then(setLeaderboard);
  }, [userId]);

  async function handleAdd() {
    if (!code.trim()) return;
    setLoading(true);
    setMessage(null);
    const result = await addFriendByCode(userId, code.trim());
    setMessage({ text: result.message, ok: result.success });
    setLoading(false);
    if (result.success) {
      setCode("");
      getLeaderboard(userId).then(setLeaderboard);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(profile.friendCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col min-h-screen px-5 pt-14 pb-28">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Friends</h1>
        <p className="text-white/40 text-sm mt-1">Compete on weekly quizzes</p>
      </div>

      {/* Your friend code */}
      <div className="mt-6 glass rounded-2xl p-4 animate-slide-up">
        <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2">Your friend code</p>
        <div className="flex items-center justify-between">
          <span className="text-white font-bold text-2xl tracking-widest">{profile.friendCode}</span>
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
              copied ? "bg-green-500/20 text-green-400" : "bg-brand-500/20 text-brand-500"
            }`}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p className="text-white/25 text-xs mt-2">Share this code with friends so they can add you</p>
      </div>

      {/* Add a friend */}
      <div className="mt-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2">Add a friend</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Enter friend code"
            maxLength={7}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 outline-none focus:border-brand-500/50 transition-all tracking-widest font-mono"
          />
          <button
            onClick={handleAdd}
            disabled={loading || !code.trim()}
            className="px-5 py-3 rounded-xl bg-brand-500 text-white font-semibold text-sm active:scale-95 transition-transform disabled:opacity-40"
          >
            {loading ? "..." : "Add"}
          </button>
        </div>
        {message && (
          <p className={`text-xs mt-2 font-medium ${message.ok ? "text-green-400" : "text-red-400"}`}>
            {message.text}
          </p>
        )}
      </div>

      {/* Leaderboard */}
      <div className="mt-6 animate-slide-up" style={{ animationDelay: "0.15s" }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-white/40 text-xs font-semibold uppercase tracking-widest">This week</p>
          <p className="text-white/25 text-xs">Resets Monday</p>
        </div>

        {leaderboard.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-white/30 font-medium">No friends yet</p>
            <p className="text-white/20 text-sm mt-1">Share your code to get started</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {leaderboard.map((entry, i) => {
              const isYou = entry.userId === userId;
              const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;

              return (
                <div
                  key={entry.userId}
                  className={`flex items-center gap-3 p-4 rounded-2xl ${
                    isYou
                      ? "bg-brand-500/10 border border-brand-500/20"
                      : "glass"
                  }`}
                >
                  <span className="text-white/30 text-sm font-bold w-5 text-center">
                    {medal || `${i + 1}`}
                  </span>

                  <Avatar name={entry.name} avatarUrl={entry.avatarUrl} size={36} />

                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">
                      {entry.name} {isYou && <span className="text-brand-500/60 text-xs">(you)</span>}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-white/30 text-xs">🔥 {entry.currentStreak} day streak</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-white font-bold text-lg">{entry.weeklyQuizzes}</p>
                    <p className="text-white/30 text-xs">quizzes</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
