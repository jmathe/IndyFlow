// src/components/molecules/SelectField.tsx

import {
  ErrorMessage,
  ErrorMessageProps,
} from "@/components/atoms/ErrorMessage";
import { Label, LabelProps } from "@/components/atoms/Label";
import { Select } from "@/components/atoms/Select";
import { cn } from "@/lib/utils";

/**
 * Props for the SelectField component, combining a dropdown select
 * with an associated label and error messaging.
 *
 * @interface SelectFieldProps
 * @property {string} id - Logical field identifier, used for htmlFor, id, and aria-describedby.
 * @property {string} label - Text label displayed above the select.
 * @property {string} value - Currently selected value.
 * @property {(value: string) => void} onChange - Callback invoked when the value changes.
 * @property {React.ReactNode} children - Select options (e.g., <Select.Item />).
 * @property {string} [error] - Optional error message displayed below the field.
 * @property {string} [className] - Optional CSS class for the outer container.
 * @property {LabelProps} [labelProps] - Additional props for the Label component.
 * @property {ErrorMessageProps} [errorProps] - Additional props for the ErrorMessage component.
 */
export interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  error?: string;
  className?: string;
  labelProps?: LabelProps;
  errorProps?: ErrorMessageProps;
}

/**
 * SelectField component: a dropdown select with an accessible label
 * and optional error message. Built on ShadCN atomic Select components.
 *
 * @component SelectField
 * @param {SelectFieldProps} props - Component props.
 * @returns {JSX.Element} A reusable, accessible select field.
 *
 * @example
 * ```tsx
 * <SelectField
 *   id="status"
 *   label="Status"
 *   value={status}
 *   onChange={setStatus}
 *   error="This field is required"
 * >
 *   <Select.Item value="PROSPECT">Prospect</Select.Item>
 *   <Select.Item value="CLIENT">Client</Select.Item>
 * </SelectField>
 * ```
 */
export function SelectField({
  id,
  label,
  value,
  onChange,
  children,
  error,
  className,
  labelProps,
  errorProps,
}: SelectFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {/* Label linked to the select via htmlFor */}
      <Label htmlFor={id} {...labelProps}>
        {label}
      </Label>

      {/* ShadCN Select root with Trigger and Content */}
      <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger
          id={id}
          name={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        >
          <Select.Value placeholder="Select an option" />
        </Select.Trigger>
        <Select.Content>{children}</Select.Content>
      </Select.Root>

      {/* Accessible error message linked by aria-describedby */}
      {error && (
        <ErrorMessage id={`${id}-error`} {...errorProps}>
          {error}
        </ErrorMessage>
      )}
    </div>
  );
}
