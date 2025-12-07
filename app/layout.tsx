import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/Sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kino Flow | Stream the Universe",
  description: "Your premium gateway to infinite entertainment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex selection:bg-electric-purple/30 selection:text-white`}
      >
        <Sidebar />
        <main className="flex-1 pl-16 relative w-full h-full min-h-screen flex flex-col">
          {/* Top gradient accent */}
          <div className="fixed top-0 left-0 w-full h-32 bg-gradient-to-b from-electric-purple/5 to-transparent pointer-events-none select-none z-0" />

          <div className="relative z-10 p-6 md:p-8 lg:p-10 max-w-[1920px] mx-auto w-full">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
