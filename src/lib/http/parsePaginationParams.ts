// src/lib/http/parsePaginationParams.ts
import { getQueryParamOrDefault } from "./getQueryParamOrDefault";

/**
 * Safely extracts and validates pagination parameters from URLSearchParams.
 * Defaults to page 1 and limit 10 if not provided or invalid.
 *
 * @param {URLSearchParams} searchParams - The search parameters from the URL.
 * @returns {{ page: number; limit: number }} An object containing validated page and limit numbers.
 *
 * @example
 * const { page, limit } = parsePaginationParams(req.nextUrl.searchParams);
 */
export function parsePaginationParams(searchParams: URLSearchParams): {
  page: number;
  limit: number;
} {
  const rawPage = getQueryParamOrDefault(searchParams, "page", "1");
  const rawLimit = getQueryParamOrDefault(searchParams, "limit", "10");

  const page = Math.max(1, Number(rawPage));
  const limit = Math.max(1, Number(rawLimit));

  return { page, limit };
}
