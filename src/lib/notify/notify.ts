// src/lib/notify.ts

import { toast } from "sonner";

/**
 * Module for displaying consistent, reusable toasts across the application.
 *
 * @module notify
 */
export const notify = {
  /**
   * Displays a success toast.
   * @param {string} title - The main message to display.
   * @param {string} [description] - Optional additional description.
   */
  success: (title: string, description?: string) =>
    toast.success(title, { description }),

  /**
   * Displays an error toast.
   * @param {string} title - The main message to display.
   * @param {string} [description] - Optional additional description.
   */
  error: (title: string, description?: string) =>
    toast.error(title, { description }),

  /**
   * Displays an informational toast.
   * @param {string} title - The main message to display.
   * @param {string} [description] - Optional additional description.
   */
  info: (title: string, description?: string) => toast(title, { description }),
};
