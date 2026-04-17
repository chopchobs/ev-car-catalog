import type { Metadata } from "next";
import { Geist, Geist_Mono, Prompt } from "next/font/google"; // 1. Import Prompt
import "./globals.css";
import { CompareProvider } from "@/providers/CompareProvider";
import CompareFloatingBar from "@/components/ui/CompareFloatingBar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 2. Configure Prompt font
const prompt = Prompt({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin", "thai"],
  variable: "--font-prompt",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EVo Auto Drive",
  description: "EVo Auto Drive - Premium EV Cars",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} ${prompt.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100 bg-white text-gray-900">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CompareProvider>
            {children}
            <CompareFloatingBar />
          </CompareProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
