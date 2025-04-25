// src/components/molecules/InputField.tsx

import {
  ErrorMessage,
  ErrorMessageProps,
} from "@/components/atoms/ErrorMessage";
import { Input, InputProps } from "@/components/atoms/Input";
import { Label, LabelProps } from "@/components/atoms/Label";
import { cn } from "@/lib/utils";

/**
 * Props for the InputField component, combining native input properties
 * with additional label and error message options.
 *
 * @interface InputFieldProps
 * @extends {InputProps}
 * @property {string} id - Unique identifier for the input, used for htmlFor and id attributes.
 * @property {string} label - Text displayed above the input.
 * @property {string} [error] - Error message to display below the input.
 * @property {string} [className] - Optional CSS class for the container.
 * @property {LabelProps} [labelProps] - Additional props for the Label component.
 * @property {ErrorMessageProps} [errorProps] - Additional props for the ErrorMessage component.
 */
export interface InputFieldProps extends InputProps {
  id: string;
  label: string;
  error?: string;
  className?: string;
  labelProps?: LabelProps;
  errorProps?: ErrorMessageProps;
}

/**
 * InputField component: a styled input with associated label and error message.
 * Applies accessible attributes (aria-invalid, aria-describedby) and supports
 * custom styling and validation messaging.
 *
 * @component InputField
 * @param {InputFieldProps} props - Props for the component.
 * @returns {JSX.Element} A labeled input with optional error display.
 */
export function InputField({
  id,
  label,
  error,
  className,
  labelProps,
  errorProps,
  ...inputProps
}: InputFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {/* Label linked to the input via htmlFor */}
      <Label htmlFor={id} {...labelProps}>
        {label}
      </Label>

      {/* Accessible input with error state */}
      <Input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...inputProps}
      />

      {/* Conditional error message linked by aria-describedby */}
      {error && (
        <ErrorMessage id={`${id}-error`} {...errorProps}>
          {error}
        </ErrorMessage>
      )}
    </div>
  );
}
