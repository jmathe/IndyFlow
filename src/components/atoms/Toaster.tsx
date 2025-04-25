// src/components/atoms/Toaster.tsx

import { Toaster as ShadToaster } from "@/components/ui/sonner";

/**
 * Toaster component: global notification wrapper based on Sonner (ShadCN).
 * Should be mounted once in the application, typically in `layout.tsx`,
 * to enable toast notifications from any page.
 *
 * Configured with richColors and positioned at the bottom-right of the viewport.
 *
 * @component Toaster
 * @returns {JSX.Element} A configured Toaster for global notifications.
 *
 * @example
 * ```tsx
 * // src/app/layout.tsx
 * import { Toaster } from "@/components/atoms/Toaster";
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="en">
 *       <body>
 *         {children}
 *         <Toaster />
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function Toaster() {
  return <ShadToaster richColors position="bottom-right" />;
}
