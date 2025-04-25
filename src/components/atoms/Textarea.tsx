// src/components/atoms/Textarea.tsx

import { Textarea as ShadTextarea } from "@/components/ui/textarea";

/**
 * Props for the Textarea atom component, extending standard HTML <textarea> attributes.
 *
 * @typedef TextareaProps
 * @type {React.ComponentProps<'textarea'>}
 */
export type TextareaProps = React.ComponentProps<"textarea">;

/**
 * Textarea atom component: a styled multiline text input based on ShadCN.
 * Used for entering long-form content such as notes or descriptions.
 * Inherits all standard HTML <textarea> properties.
 *
 * @component Textarea
 * @param {TextareaProps} props - Properties for the textarea component.
 * @param {string} [props.placeholder] - Placeholder text displayed when the field is empty.
 * @param {string} [props.className] - Custom CSS class for specific styling.
 * @param {string} [props.value] - Controlled value of the textarea.
 * @param {(e: React.ChangeEvent<HTMLTextAreaElement>) => void} [props.onChange] - Callback executed on value change.
 * @returns {JSX.Element} A styled <textarea> element ready for forms.
 *
 * @example
 * <Textarea placeholder="Enter your notes here" value={notes} onChange={(e) => setNotes(e.target.value)} />
 */
export function Textarea(props: TextareaProps) {
  return <ShadTextarea {...props} />;
}
