/*
 * @function formatCurrency
 * Format number as currency (EUR)
 *
 * @param {number} amount
 * @return {string} number formatted as currency
 *
 * @example
 * formatCurrency(0)
 * // => 0.00 €
 *
 * @example
 * formatCurrency(1.5)
 * // => 1.50 €
 *
 */

// helper fn to format number as currency
export const formatCurrency = (amount) => {
  // Intl.NumberFormat object enables language-sensitive number formatting.
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(amount);
};
