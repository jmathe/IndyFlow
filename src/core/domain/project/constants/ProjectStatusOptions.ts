// src/core/domain/project/constants/ProjectStatusOptions.ts

import { ProjectStatus } from "@/generated/prisma";

/**
 * List of project statuses allowed at creation (no completed/cancelled).
 */
export const ALLOWED_STATUSES: ProjectStatus[] = [
  "PENDING",
  "QUOTE_SENT",
  "ACCEPTED",
  "IN_PROGRESS",
];

/**
 * Utility function to format ProjectStatus into readable labels.
 *
 * @param {ProjectStatus} status
 * @returns {string} User-friendly label
 */
export function formatStatusLabel(status: ProjectStatus): string {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "QUOTE_SENT":
      return "Quote Sent";
    case "ACCEPTED":
      return "Accepted";
    case "IN_PROGRESS":
      return "In Progress";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
}
