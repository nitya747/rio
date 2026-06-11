import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rio Chat — Cozy Real-Time Discussion",
  description: "A fast, open-access real-time chat room application powered by Supabase Realtime, Presence, and Broadcast.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

