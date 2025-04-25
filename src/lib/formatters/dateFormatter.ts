/**
 * Formats an ISO date string into a readable date.
 *
 * @param {string} isoDate - The ISO date string to format.
 * @param {string} [locale="fr-FR"] - The locale used for formatting.
 * @returns {string} The formatted date string.
 *
 * @example
 * formatDate("2025-05-01T00:00:00.000Z") => "01/05/2025"
 */
export function formatDate(isoDate: string, locale = "fr-FR"): string {
  const date = new Date(isoDate);

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
