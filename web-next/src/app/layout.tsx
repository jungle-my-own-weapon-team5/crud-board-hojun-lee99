import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRUD Board",
  description: "CRUD Board",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-zinc-50 text-zinc-900 antialiased">
        <div className="mx-auto min-h-screen w-full max-w-5xl border-x border-zinc-200 bg-white px-6 py-8">
          {children}
        </div>
      </body>
    </html>
  );
}
