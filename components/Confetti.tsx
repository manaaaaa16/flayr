"use client";

import { useEffect, useState } from "react";

type Particle = {
  id: number;
  x: number;
  color: string;
  duration: number;
  delay: number;
  size: number;
};

const COLORS = ["#4f63ff", "#a855f7", "#22d3ee", "#f59e0b", "#10b981", "#f43f5e", "#fff"];

export default function Confetti({ trigger }: { trigger: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger) return;
    const ps: Particle[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: 1.8 + Math.random() * 1.4,
      delay: Math.random() * 0.6,
      size: 6 + Math.random() * 6,
    }));
    setParticles(ps);
    const t = setTimeout(() => setParticles([]), 3500);
    return () => clearTimeout(t);
  }, [trigger]);

  if (!particles.length) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left: `${p.x}%`,
            top: "-10px",
            background: p.color,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
