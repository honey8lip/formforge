/**
 * formI18n.js
 * Lightweight internationalization support for form labels, placeholders, and validation messages.
 */

/** @type {Record<string, Record<string, string>>} */
let locales = {};

/** @type {string} */
let currentLocale = 'en';

/**
 * Register a locale dictionary.
 * @param {string} locale - Locale key (e.g. 'en', 'fr', 'de')
 * @param {Record<string, string>} messages - Key-value translation map
 */
export function registerLocale(locale, messages) {
  if (!locale || typeof messages !== 'object') {
    throw new Error('registerLocale requires a locale string and a messages object');
  }
  locales[locale] = { ...(locales[locale] || {}), ...messages };
}

/**
 * Set the active locale.
 * @param {string} locale
 */
export function setLocale(locale) {
  if (!locales[locale]) {
    throw new Error(`Locale "${locale}" has not been registered`);
  }
  currentLocale = locale;
}

/**
 * Get the active locale key.
 * @returns {string}
 */
export function getLocale() {
  return currentLocale;
}

/**
 * Translate a key using the current locale.
 * Falls back to the key itself if no translation is found.
 * @param {string} key
 * @param {Record<string, string>} [vars] - Optional interpolation variables
 * @returns {string}
 */
export function t(key, vars = {}) {
  const dict = locales[currentLocale] || {};
  let message = dict[key] ?? key;
  for (const [varKey, value] of Object.entries(vars)) {
    message = message.replaceAll(`{{${varKey}}}`, String(value));
  }
  return message;
}

/**
 * Translate all translatable string fields on a normalized field descriptor.
 * @param {import('./schemaParser.types.js').NormalizedField} field
 * @returns {import('./schemaParser.types.js').NormalizedField}
 */
export function localizeField(field) {
  return {
    ...field,
    label: field.label ? t(field.label) : field.label,
    placeholder: field.placeholder ? t(field.placeholder) : field.placeholder,
    description: field.description ? t(field.description) : field.description,
  };
}

/**
 * Check whether a locale has been registered.
 * @param {string} locale
 * @returns {boolean}
 */
export function hasLocale(locale) {
  return Object.prototype.hasOwnProperty.call(locales, locale);
}

/**
 * Get all registered locale keys.
 * @returns {string[]}
 */
export function getRegisteredLocales() {
  return Object.keys(locales);
}

/**
 * Remove all registered locales and reset to defaults.
 */
export function resetI18n() {
  locales = {};
  currentLocale = 'en';
}
