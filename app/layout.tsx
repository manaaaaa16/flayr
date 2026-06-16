import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  icons: { icon: "/logo.png", apple: "/logo.png" },
  title: "Flayr — Snap. Study. Done.",
  description: "Turn any photo of notes into instant flashcards with AI. Study smarter in seconds.",
  keywords: ["flashcards", "AI", "study", "notes", "anki"],
  openGraph: {
    title: "Flayr — AI Flashcard Generator",
    description: "Snap a photo of your notes. Get instant flashcards.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a0f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a0f] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
