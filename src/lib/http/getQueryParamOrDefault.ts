// src/lib/http/getQueryParamOrDefault.ts

/**
 * Safely retrieves a query parameter from URLSearchParams.
 * If the parameter is missing or empty, returns the provided default value.
 *
 * @template T
 * @param {URLSearchParams} params - The URL search parameters object.
 * @param {string} key - The key of the parameter to retrieve.
 * @param {T} defaultValue - The default value to use if the parameter is missing or invalid.
 * @returns {string | T} The parameter value or the default value.
 *
 * @example
 * const page = getQueryParamOrDefault(searchParams, "page", "1");
 */
export function getQueryParamOrDefault<T>(
  params: URLSearchParams,
  key: string,
  defaultValue: T
): string | T {
  const value = params.get(key);

  if (value === null || value.trim() === "") {
    return defaultValue;
  }

  return value;
}
