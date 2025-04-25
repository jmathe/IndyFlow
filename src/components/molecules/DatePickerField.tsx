"use client";

import { Button } from "@/components/atoms/Button";
import { Label } from "@/components/atoms/Label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils"; // utilitaire pour fusionner les className si besoin
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

/**
 * Props for the DatePickerField component.
 *
 * @typedef {Object} DatePickerFieldProps
 * @property {string} id - Unique identifier for the input.
 * @property {string} label - Label displayed above the picker.
 * @property {Date | null} value - Selected date value.
 * @property {(date: Date | null) => void} onChange - Callback fired when the date changes.
 * @property {string} [error] - Optional error message to display.
 */
interface DatePickerFieldProps {
  id: string;
  label: string;
  selected?: Date;
  onChange: (date: Date | null) => void;
  error?: string;
}

/**
 * DatePickerField
 *
 * A controlled DatePicker component integrated with React Hook Form.
 * - Displays a label and optional error message
 * - Uses a Popover and Calendar component from Shadcn
 *
 * @component
 * @param {DatePickerFieldProps} props
 * @returns {JSX.Element}
 */
export function DatePickerField({
  id,
  label,
  selected,
  onChange,
  error,
}: DatePickerFieldProps) {
  return (
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor={id}>{label}</Label>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selected && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selected ? format(selected, "dd/MM/yyyy") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selected ?? undefined}
            onSelect={(date) => onChange(date ?? null)}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
