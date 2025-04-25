// src/app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/atoms/Toaster";
import ReactQueryProvider from "@/lib/reactQueryProvider";

// 🧩 Font loading using next/font (automatic optimization)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Default SEO metadata for the app.
 * This data is used by search engines and social platforms.
 */
export const metadata: Metadata = {
  title: "IndyFlow – Mini CRM Freelance",
  description: "Gérez vos contacts et projets freelance en toute simplicité.",
};

/**
 * Props for the root layout component.
 *
 * @typedef {Object} RootLayoutProps
 * @property {React.ReactNode} children - The component tree of the current page.
 */
type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

/**
 * Root layout component for the entire Next.js application.
 *
 * This layout:
 * - Applies global fonts and CSS
 * - Wraps all pages in the React Query provider
 * - Injects the Toaster for global notifications
 *
 * @function RootLayout
 * @param {RootLayoutProps} props - Props containing page children.
 * @returns {JSX.Element} The fully wrapped application layout.
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Query cache and devtools context */}
        <ReactQueryProvider>
          {/* Main page content (routes/layouts) */}
          {children}

          {/* Global toast notifications */}
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
