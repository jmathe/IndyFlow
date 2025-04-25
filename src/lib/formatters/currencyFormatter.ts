/**
 * Formats a number as a localized currency string.
 *
 * @param {number} amount - The numeric amount to format.
 * @param {string} [locale="fr-FR"] - The locale used for formatting.
 * @param {string} [currency="EUR"] - The currency code.
 * @returns {string} The formatted currency string.
 *
 * @example
 * formatCurrency(1000) => "1 000,00 €"
 */
export function formatCurrency(
  amount: number,
  locale = "fr-FR",
  currency = "EUR"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
