/**
 * Format currency according to locale specification:
 * - English (en): SAR 2,500,000
 * - Arabic (ar): ٢٬٥٠٠٬٠٠٠ ر.س (using Arabic-Indic numerals)
 */
export function formatCurrency(amount: number, locale: string = 'en'): string {
  if (isNaN(amount)) return '';

  if (locale === 'ar') {
    // Format number in ar-SA or ar-EG to get Eastern Arabic / Arabic-Indic digits
    const formattedNum = new Intl.NumberFormat('ar-SA', {
      maximumFractionDigits: 0,
    }).format(amount);

    return `${formattedNum} ر.س`;
  }

  // English formatting: SAR 2,500,000
  const formattedNum = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(amount);

  return `SAR ${formattedNum}`;
}

/**
 * Format standard numbers (e.g. area, bedrooms, ratings) according to locale.
 */
export function formatNumber(value: number, locale: string = 'en'): string {
  if (isNaN(value)) return '0';
  const targetLocale = locale === 'ar' ? 'ar-SA' : 'en-US';
  return new Intl.NumberFormat(targetLocale).format(value);
}
