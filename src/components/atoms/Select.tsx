// src/components/atoms/Select.tsx

import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select as ShadSelect,
} from "@/components/ui/select";

/**
 * Namespace for the styled Select atom component, based on ShadCN.
 * Exposes subcomponents for granular usage under a single umbrella.
 *
 * @namespace Select
 * @property {typeof ShadSelect} Root - The root Select component, managing selection state.
 * @property {typeof SelectTrigger} Trigger - Button or field that toggles the dropdown.
 * @property {typeof SelectValue} Value - Displays the currently selected value.
 * @property {typeof SelectContent} Content - Dropdown menu containing available options.
 * @property {typeof SelectItem} Item - Individual selectable option within the menu.
 *
 * @example
 * ```tsx
 * <Select.Root value={selectedValue} onValueChange={setSelectedValue}>
 *   <Select.Trigger />
 *   <Select.Content>
 *     <Select.Item value="CLIENT">Client</Select.Item>
 *     <Select.Item value="PROSPECT">Prospect</Select.Item>
 *   </Select.Content>
 * </Select.Root>
 * ```
 */
export const Select = {
  Root: ShadSelect,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Content: SelectContent,
  Item: SelectItem,
};
