// src/components/atoms/ErrorMessage.tsx

import { cn } from "@/lib/utils";

/**
 * Props for the ErrorMessage component, combining standard HTML <p> attributes
 * with custom styling options.
 *
 * @typedef ErrorMessageProps
 * @property {React.ReactNode} children - Text or JSX element to display as the error message.
 * @property {string} [className] - Optional custom CSS class for styling the error message.
 * @property {...any} [props] - Any other valid HTML paragraph attributes (e.g., id, aria-describedby).
 */
export type ErrorMessageProps = {
  children: React.ReactNode;
  className?: string;
} & React.ComponentProps<"p">;

/**
 * ErrorMessage component: displays an accessible error message below a form field.
 * Designed for reuse in form validation scenarios. The message is announced by screen readers (role="alert").
 *
 * @component ErrorMessage
 * @param {ErrorMessageProps} props - Component props.
 * @param {React.ReactNode} props.children - Error message content.
 * @param {string} [props.className] - Optional custom CSS class.
 * @param {...any} props - Other standard HTML <p> attributes (id, aria-describedby, etc.).
 * @returns {JSX.Element | null} A styled <p> for the error message, or null if no content.
 *
 * @example
 * <ErrorMessage className="text-red-500">This field is required.</ErrorMessage>
 */
export function ErrorMessage({
  children,
  className,
  ...props
}: ErrorMessageProps) {
  if (!children) return null;

  return (
    <p
      className={cn("text-sm font-medium text-destructive mt-1", className)}
      role="alert"
      {...props}
    >
      {children}
    </p>
  );
}
