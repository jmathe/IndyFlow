// src/app/page.tsx

import { HomePageClient } from "@/components/pages/HomePageClient";

/**
 * Server-side home page entry point.
 *
 * Delegates rendering to the client-side <HomePageClient> component
 * to allow client-side navigation logic (e.g., useRouter).
 *
 * @component Home
 * @returns {JSX.Element} Client-rendered home page component
 */
export default function Home() {
  return <HomePageClient />;
}
