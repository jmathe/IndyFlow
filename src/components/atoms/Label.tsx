// src/components/atoms/Label.tsx

import { Label as ShadLabel } from "@/components/ui/label";
import * as LabelPrimitive from "@radix-ui/react-label";

/**
 * Props for the Label atom component, based on Radix UI's LabelPrimitive.Root.
 * Combines standard HTML <label> attributes with Radix accessibility features.
 *
 * @typedef LabelProps
 * @type {React.ComponentProps<typeof LabelPrimitive.Root>}
 */
export type LabelProps = React.ComponentProps<typeof LabelPrimitive.Root>;

/**
 * Label atom component: a styled <label> element using ShadCN and Radix UI.
 * Associates form fields with accessible text via the htmlFor attribute and supports custom styling.
 *
 * @component Label
 * @param {LabelProps} props - Props for the Label component.
 * @param {string} props.htmlFor - ID of the form field this label is for.
 * @param {React.ReactNode} props.children - Label content (text or JSX).
 * @param {string} [props.className] - Optional CSS classes for styling.
 * @returns {JSX.Element} A styled <label> element.
 *
 * @example
 * <Label htmlFor="email">Email</Label>
 */
export function Label(props: LabelProps) {
  return <ShadLabel {...props} />;
}
