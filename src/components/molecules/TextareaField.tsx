// src/components/molecules/TextareaField.tsx

import {
  ErrorMessage,
  ErrorMessageProps,
} from "@/components/atoms/ErrorMessage";
import { Label, LabelProps } from "@/components/atoms/Label";
import { Textarea, TextareaProps } from "@/components/atoms/Textarea";
import { cn } from "@/lib/utils";

/**
 * Props for the TextareaField component, combining native textarea properties
 * with additional label and error message options.
 *
 * @interface TextareaFieldProps
 * @extends {TextareaProps}
 * @property {string} id - Unique identifier for the textarea, used for id, aria attributes, and htmlFor.
 * @property {string} label - Text label displayed above the textarea.
 * @property {string} [error] - Optional error message displayed below the textarea.
 * @property {string} [className] - Optional CSS class for the container.
 * @property {LabelProps} [labelProps] - Additional props for the Label component.
 * @property {ErrorMessageProps} [errorProps] - Additional props for the ErrorMessage component.
 */
export interface TextareaFieldProps extends TextareaProps {
  id: string;
  label: string;
  error?: string;
  className?: string;
  labelProps?: LabelProps;
  errorProps?: ErrorMessageProps;
}

/**
 * TextareaField component: a styled multiline text area with an associated label
 * and optional error message. Applies accessible attributes and supports custom styling.
 *
 * @component TextareaField
 * @param {TextareaFieldProps} props - Props for the component.
 * @returns {JSX.Element} A ready-to-use form component for multiline text input.
 *
 * @example
 * ```tsx
 * <TextareaField
 *   id="notes"
 *   label="Notes"
 *   value={notes}
 *   onChange={(e) => setNotes(e.target.value)}
 *   error="This field is required"
 * />
 * ```
 */
export function TextareaField({
  id,
  label,
  error,
  className,
  labelProps,
  errorProps,
  ...textareaProps
}: TextareaFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {/* Label linked to the textarea via htmlFor */}
      <Label htmlFor={id} {...labelProps}>
        {label}
      </Label>

      {/* Accessible multiline textarea */}
      <Textarea
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...textareaProps}
      />

      {/* Accessible error message linked by aria-describedby */}
      {error && (
        <ErrorMessage id={`${id}-error`} {...errorProps}>
          {error}
        </ErrorMessage>
      )}
    </div>
  );
}
