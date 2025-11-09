/**
 * Locale-Aware Formatting using Intl API
 * Provides proper formatting for dates, numbers, and currencies based on user's language
 * Version: 1.0.0
 */

(function() {
  'use strict';

  /**
   * Locale Formatter Class
   */
  class LocaleFormatter {
    constructor() {
      this.currentLocale = 'en-US';
      this.localeMap = {
        'en': 'en-US',
        'fr': 'fr-FR',
        'es': 'es-ES',
        'zh': 'zh-CN',
        'ja': 'ja-JP',
        'ko': 'ko-KR'
      };
    }

    /**
     * Set the current locale based on language code
     */
    setLocale(languageCode) {
      this.currentLocale = this.localeMap[languageCode] || 'en-US';
      console.log(`[LocaleFormatter] Locale set to: ${this.currentLocale}`);
    }

    /**
     * Get the current locale
     */
    getLocale() {
      return this.currentLocale;
    }

    /**
     * ============================================
     * DATE FORMATTING
     * ============================================
     */

    /**
     * Format a date in short format (e.g., "1/8/2025" or "8/1/2025")
     */
    formatDate(date, options = {}) {
      if (!(date instanceof Date)) {
        date = new Date(date);
      }

      const defaultOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      };

      return new Intl.DateTimeFormat(this.currentLocale, { ...defaultOptions, ...options }).format(date);
    }

    /**
     * Format a date in long format (e.g., "January 8, 2025" or "8 janvier 2025")
     */
    formatDateLong(date) {
      if (!(date instanceof Date)) {
        date = new Date(date);
      }

      return new Intl.DateTimeFormat(this.currentLocale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    }

    /**
     * Format a date in medium format (e.g., "Jan 8, 2025" or "8 janv. 2025")
     */
    formatDateMedium(date) {
      if (!(date instanceof Date)) {
        date = new Date(date);
      }

      return new Intl.DateTimeFormat(this.currentLocale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);
    }

    /**
     * Format time (e.g., "2:30 PM" or "14:30")
     */
    formatTime(date, use24Hour = null) {
      if (!(date instanceof Date)) {
        date = new Date(date);
      }

      // Auto-detect 24-hour format based on locale if not specified
      const hour12 = use24Hour !== null ? !use24Hour : !this.uses24HourFormat();

      return new Intl.DateTimeFormat(this.currentLocale, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: hour12
      }).format(date);
    }

    /**
     * Format date and time together
     */
    formatDateTime(date, options = {}) {
      if (!(date instanceof Date)) {
        date = new Date(date);
      }

      const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      };

      return new Intl.DateTimeFormat(this.currentLocale, { ...defaultOptions, ...options }).format(date);
    }

    /**
     * Format relative time (e.g., "2 days ago", "in 3 hours")
     */
    formatRelativeTime(date) {
      if (!(date instanceof Date)) {
        date = new Date(date);
      }

      const now = new Date();
      const diffMs = date - now;
      const diffSec = Math.round(diffMs / 1000);
      const diffMin = Math.round(diffSec / 60);
      const diffHour = Math.round(diffMin / 60);
      const diffDay = Math.round(diffHour / 24);
      const diffMonth = Math.round(diffDay / 30);
      const diffYear = Math.round(diffDay / 365);

      const rtf = new Intl.RelativeTimeFormat(this.currentLocale, { numeric: 'auto' });

      if (Math.abs(diffYear) > 0) {
        return rtf.format(diffYear, 'year');
      } else if (Math.abs(diffMonth) > 0) {
        return rtf.format(diffMonth, 'month');
      } else if (Math.abs(diffDay) > 0) {
        return rtf.format(diffDay, 'day');
      } else if (Math.abs(diffHour) > 0) {
        return rtf.format(diffHour, 'hour');
      } else if (Math.abs(diffMin) > 0) {
        return rtf.format(diffMin, 'minute');
      } else {
        return rtf.format(diffSec, 'second');
      }
    }

    /**
     * Check if locale uses 24-hour format
     */
    uses24HourFormat() {
      const testDate = new Date(2000, 0, 1, 13, 0, 0);
      const formatted = new Intl.DateTimeFormat(this.currentLocale, { hour: 'numeric' }).format(testDate);
      return !formatted.match(/AM|PM|am|pm/);
    }

    /**
     * ============================================
     * NUMBER FORMATTING
     * ============================================
     */

    /**
     * Format a number with proper thousands separators and decimal points
     */
    formatNumber(number, options = {}) {
      const defaultOptions = {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      };

      return new Intl.NumberFormat(this.currentLocale, { ...defaultOptions, ...options }).format(number);
    }

    /**
     * Format a number as a percentage
     */
    formatPercent(number, decimals = 0) {
      return new Intl.NumberFormat(this.currentLocale, {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(number);
    }

    /**
     * Format a number with units (e.g., "5 cards", "10 readings")
     */
    formatUnit(number, unit, options = {}) {
      // Check if Intl.NumberFormat supports unit formatting
      if (typeof Intl.NumberFormat.prototype.formatToParts !== 'undefined') {
        try {
          return new Intl.NumberFormat(this.currentLocale, {
            style: 'unit',
            unit: unit,
            ...options
          }).format(number);
        } catch (e) {
          // Fallback for unsupported units
          return `${this.formatNumber(number)} ${unit}${number !== 1 ? 's' : ''}`;
        }
      } else {
        return `${this.formatNumber(number)} ${unit}${number !== 1 ? 's' : ''}`;
      }
    }

    /**
     * Format file size (bytes to human-readable)
     */
    formatFileSize(bytes) {
      const units = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte'];
      let size = bytes;
      let unitIndex = 0;

      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }

      return this.formatUnit(size, units[unitIndex], { maximumFractionDigits: 2 });
    }

    /**
     * ============================================
     * CURRENCY FORMATTING
     * ============================================
     */

    /**
     * Format a number as currency
     */
    formatCurrency(amount, currencyCode = 'USD', options = {}) {
      const defaultOptions = {
        style: 'currency',
        currency: currencyCode
      };

      return new Intl.NumberFormat(this.currentLocale, { ...defaultOptions, ...options }).format(amount);
    }

    /**
     * ============================================
     * LIST FORMATTING
     * ============================================
     */

    /**
     * Format a list of items (e.g., "A, B, and C" or "A, B et C")
     */
    formatList(items, type = 'conjunction') {
      // conjunction: "A, B, and C"
      // disjunction: "A, B, or C"
      // unit: "A, B, C" (no conjunction)

      if (!items || items.length === 0) {
        return '';
      }

      if (items.length === 1) {
        return items[0];
      }

      if (typeof Intl.ListFormat !== 'undefined') {
        return new Intl.ListFormat(this.currentLocale, { type: type }).format(items);
      } else {
        // Fallback for browsers without ListFormat support
        if (type === 'conjunction') {
          const last = items[items.length - 1];
          const rest = items.slice(0, -1);
          return `${rest.join(', ')} and ${last}`;
        } else if (type === 'disjunction') {
          const last = items[items.length - 1];
          const rest = items.slice(0, -1);
          return `${rest.join(', ')} or ${last}`;
        } else {
          return items.join(', ');
        }
      }
    }

    /**
     * ============================================
     * UTILITY FUNCTIONS
     * ============================================
     */

    /**
     * Get the first day of the week for the current locale (0 = Sunday, 1 = Monday)
     */
    getFirstDayOfWeek() {
      const localeData = {
        'en-US': 0, // Sunday
        'fr-FR': 1, // Monday
        'es-ES': 1, // Monday
        'zh-CN': 1, // Monday
        'ja-JP': 0, // Sunday
        'ko-KR': 0  // Sunday
      };

      return localeData[this.currentLocale] || 1; // Default to Monday
    }

    /**
     * Get locale-specific day names
     */
    getDayNames(format = 'long') {
      const days = [];
      const date = new Date(2000, 0, 2); // A Sunday

      for (let i = 0; i < 7; i++) {
        date.setDate(2 + i);
        days.push(new Intl.DateTimeFormat(this.currentLocale, { weekday: format }).format(date));
      }

      return days;
    }

    /**
     * Get locale-specific month names
     */
    getMonthNames(format = 'long') {
      const months = [];
      const date = new Date(2000, 0, 1);

      for (let i = 0; i < 12; i++) {
        date.setMonth(i);
        months.push(new Intl.DateTimeFormat(this.currentLocale, { month: format }).format(date));
      }

      return months;
    }

    /**
     * Get the decimal separator for the current locale
     */
    getDecimalSeparator() {
      const formatted = new Intl.NumberFormat(this.currentLocale).format(1.1);
      return formatted.charAt(1);
    }

    /**
     * Get the thousands separator for the current locale
     */
    getThousandsSeparator() {
      const formatted = new Intl.NumberFormat(this.currentLocale).format(1000);
      return formatted.charAt(1);
    }

    /**
     * ============================================
     * TAROT-SPECIFIC FORMATTING
     * ============================================
     */

    /**
     * Format card count (e.g., "22 cards", "22 cartes")
     */
    formatCardCount(count) {
      const cardTranslations = {
        'en-US': 'card',
        'fr-FR': 'carte',
        'es-ES': 'carta',
        'zh-CN': '张牌',
        'ja-JP': '枚',
        'ko-KR': '장'
      };

      const unit = cardTranslations[this.currentLocale] || 'card';

      // For Asian languages, don't pluralize
      if (['zh-CN', 'ja-JP', 'ko-KR'].includes(this.currentLocale)) {
        return `${count}${unit}`;
      }

      return `${count} ${unit}${count !== 1 ? 's' : ''}`;
    }

    /**
     * Format reading date (e.g., "Daily Reading - January 8, 2025")
     */
    formatReadingDate(date = new Date()) {
      if (!(date instanceof Date)) {
        date = new Date(date);
      }

      return this.formatDateLong(date);
    }
  }

  /**
   * Create singleton instance
   */
  const localeFormatter = new LocaleFormatter();

  /**
   * Auto-detect and set locale from currentLanguage if available
   */
  if (typeof currentLanguage !== 'undefined') {
    localeFormatter.setLocale(currentLanguage);
  }

  /**
   * Listen for language changes
   */
  document.addEventListener('languageChanged', function(event) {
    if (event.detail && event.detail.language) {
      localeFormatter.setLocale(event.detail.language);
    }
  });

  /**
   * Export to window
   */
  window.LocaleFormatter = localeFormatter;

  console.log('[LocaleFormatter] Initialized');

})();
