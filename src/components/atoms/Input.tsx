// src/components/atoms/Input.tsx

import { Input as ShadInput } from "@/components/ui/input";

/**
 * Props for the Input atom component, equivalent to native HTML <input> attributes.
 * Allows customization of the input behavior while maintaining standard input characteristics.
 *
 * @typedef InputProps
 * @type {React.ComponentProps<'input'>}
 */
export type InputProps = React.ComponentProps<"input">;

/**
 * Input atom component: a styled, accessible input field based on ShadCN's Input.
 * Provides a customizable user input element with full HTML attribute support and consistent styling.
 *
 * @component Input
 * @param {InputProps} props - Props for the input component.
 * @param {string} [props.type] - Input type (e.g., 'text', 'email', 'number'); defaults to 'text'.
 * @param {string} [props.name] - Name attribute for form identification.
 * @param {string} [props.className] - Additional CSS classes for styling.
 * @param {any} [props.value] - Controlled input value for React forms.
 * @param {(e: React.ChangeEvent<HTMLInputElement>) => void} [props.onChange] - Callback on value change.
 * @param {string} [props.placeholder] - Placeholder text when input is empty.
 *
 * @returns {JSX.Element} A styled <input> element honoring provided props.
 *
 * @example
 * <Input type="email" name="userEmail" value={email} onChange={(e) => setEmail(e.target.value)} />
 */
export function Input(props: InputProps) {
  return <ShadInput {...props} />;
}
