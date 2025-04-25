// src/components/atoms/Badge.tsx

import { badgeVariants, Badge as ShadBadge } from "@/components/ui/badge";
import { VariantProps } from "class-variance-authority";

/**
 * Props for the Badge atom component, combining standard HTML <span> attributes
 * with visual variants defined by badgeVariants (via class-variance-authority).
 * Includes an optional `asChild` flag to allow using a different component as the wrapper via Slot.
 *
 * @typedef BadgeProps
 * @property {boolean} [asChild] - If true, uses another component as the wrapper instead of a span.
 * @property {VariantProps<typeof badgeVariants>['variant']} [variant] - Visual variant (e.g., "default", "secondary", "destructive").
 * @property {string} [className] - Custom CSS class to apply.
 * @property {React.ReactNode} children - Content to display inside the badge.
 */
export type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
  };

/**
 * Badge atom component: displays a styled tag or label with configurable variants.
 * Uses badgeVariants for style definitions and supports `asChild` for Slot composition.
 *
 * @component Badge
 * @param {BadgeProps} props - Component props.
 * @param {string} [props.variant] - Visual style variant of the badge.
 * @param {string} [props.className] - Custom CSS class for additional styling.
 * @param {React.ReactNode} props.children - Inner content of the badge.
 * @param {boolean} [props.asChild] - If true, renders the badge as a child of another component via Slot.
 * @returns {JSX.Element} A styled <span> (or child component) representing a badge.
 */
export function Badge({
  variant,
  className,
  children,
  asChild,
  ...props
}: BadgeProps) {
  return (
    <ShadBadge
      variant={variant}
      className={className}
      asChild={asChild}
      {...props}
    >
      {children}
    </ShadBadge>
  );
}
