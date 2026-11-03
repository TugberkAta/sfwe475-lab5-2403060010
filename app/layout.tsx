import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Task Board",
  description: "A simple board for planning your tasks.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <nav>
          <Link href="/">Home</Link> | <Link href="/tasks">All tasks</Link>
        </nav>
        {children}
        <footer>
          <a href="https://example.com/sponsor" rel="sponsored">
            Our sponsor
          </a>
          {" | "}
          <a href="https://example.org/planning-tips" rel="ugc">
            Tip from a user
          </a>
        </footer>
      </body>
    </html>
  );
}
