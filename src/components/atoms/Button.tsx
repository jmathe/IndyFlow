// src/components/atoms/Button.tsx

import { buttonVariants, Button as ShadButton } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";

/**
 * Props for the Button atom component, combining standard HTML <button> attributes
 * with visual variants defined by buttonVariants (via class-variance-authority).
 * Includes an optional `asChild` flag to allow using a different component as the wrapper via Slot.
 *
 * @typedef ButtonProps
 * @property {boolean} [asChild] - If true, renders the button as a child of another component via Slot.
 * @property {VariantProps<typeof buttonVariants>["variant"]} [variant] - Visual style variant (e.g., "default", "destructive", "outline", "ghost", "link").
 * @property {string} [className] - Custom CSS class to apply.
 * @property {React.ReactNode} [children] - Content of the button (text or JSX elements).
 * @property {() => void} [onClick] - Callback invoked on button click.
 * @property {"button" | "submit" | "reset"} [type] - HTML button type.
 */
export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

/**
 * Button atom component: a styled button based on ShadCN.
 * Use for user actions such as submit, cancel, or delete.
 * Highly customizable via `variant` and `className` props.
 * Supports `asChild` for rendering with a different wrapper component (e.g., Link).
 *
 * @component Button
 * @param {ButtonProps} props - Component props.
 * @returns {JSX.Element} A styled <button> element.
 */
export function Button(props: ButtonProps) {
  return <ShadButton {...props} />;
}
