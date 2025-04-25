// src/lib/reactQueryProvider.tsx

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";

/**
 * Props for the ReactQueryProvider component.
 *
 * @typedef {Object} ReactQueryProviderProps
 * @property {ReactNode} children - The React component tree to wrap with React Query context.
 */
type ReactQueryProviderProps = {
  children: ReactNode;
};

/**
 * ReactQueryProvider
 *
 * Wraps the application with TanStack Query's QueryClientProvider to enable
 * global data fetching capabilities with caching, background sync, and more.
 *
 * This provider:
 * - Instantiates a single `QueryClient` instance per render tree
 * - Integrates React Query Devtools (only enabled in dev mode by default)
 *
 * Usage:
 * ```tsx
 * <ReactQueryProvider>
 *   <App />
 * </ReactQueryProvider>
 * ```
 *
 * @component
 * @param {ReactQueryProviderProps} props - The props object containing children to render.
 * @returns {JSX.Element} The wrapped component tree with React Query context.
 */
export default function ReactQueryProvider({
  children,
}: ReactQueryProviderProps) {
  /**
   * Local query client instance, memoized on mount.
   */
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
