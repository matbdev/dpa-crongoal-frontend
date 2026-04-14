import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import CustomToaster from "@/components/layout/CustomToaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CronGoal — Goal Tracking",
    template: "%s | CronGoal",
  },
  description:
    "Track your goals, manage projects with Kanban boards, build daily routines, and earn rewards. The open-source productivity app designed for you.",
  keywords: [
    "goal tracking",
    "kanban",
    "productivity",
    "task manager",
    "routines",
    "gamification",
  ],
  authors: [{ name: "CronGoal" }],
  openGraph: {
    title: "CronGoal — Goal Tracking",
    description:
      "Track goals, manage Kanban projects, build routines, and earn rewards.",
    siteName: "CronGoal",
    type: "website",
    locale: "pt_BR",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#DEDEDE" },
    { media: "(prefers-color-scheme: dark)", color: "#1F1F21" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased font-sans">
        <Providers>
          {children}
          <CustomToaster />
        </Providers>
      </body>
    </html>
  );
}
