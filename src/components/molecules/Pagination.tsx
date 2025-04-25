"use client";

import { Button } from "@/components/atoms/Button";

/**
 * Props for the Pagination component.
 *
 * @interface PaginationProps
 * @property {number} page - Current page number (1-indexed).
 * @property {number} pageSize - Number of items per page.
 * @property {number} totalCount - Total number of items across all pages.
 * @property {(newPage: number) => void} onPageChange - Callback function when the page changes.
 */
interface PaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (newPage: number) => void;
}

/**
 * Pagination
 *
 * Displays previous/next buttons and the current page information.
 * Handles disabling buttons when at the first or last page.
 *
 * @component Pagination
 * @param {PaginationProps} props - Pagination component props.
 * @returns {JSX.Element} The rendered pagination controls.
 *
 * @example
 * <Pagination
 *   page={1}
 *   pageSize={10}
 *   totalCount={50}
 *   onPageChange={(newPage) => console.log(newPage)}
 * />
 */
export function Pagination({
  page,
  pageSize,
  totalCount,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  /**
   * Handle moving to the previous page.
   */
  const handlePrevious = () => {
    onPageChange(Math.max(page - 1, 1));
  };

  /**
   * Handle moving to the next page.
   */
  const handleNext = () => {
    onPageChange(Math.min(page + 1, totalPages));
  };

  return (
    <div className="flex justify-center items-center gap-4">
      {/* Previous button */}
      <Button onClick={handlePrevious} disabled={page === 1}>
        Previous
      </Button>

      {/* Page indicator */}
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>

      {/* Next button */}
      <Button onClick={handleNext} disabled={page === totalPages}>
        Next
      </Button>
    </div>
  );
}
