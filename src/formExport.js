/**
 * formExport.js
 * Utilities for exporting form data to various formats (JSON, CSV, URLSearchParams).
 */

/**
 * Export form data as a plain JSON string.
 * @param {Record<string, any>} data
 * @param {number} [indent=2]
 * @returns {string}
 */
export function exportAsJSON(data, indent = 2) {
  if (data === null || typeof data !== 'object') {
    throw new TypeError('exportAsJSON: data must be a non-null object');
  }
  return JSON.stringify(data, null, indent);
}

/**
 * Export form data as a CSV string.
 * First row is headers (keys), second row is values.
 * Nested objects are JSON-stringified.
 * @param {Record<string, any>} data
 * @returns {string}
 */
export function exportAsCSV(data) {
  if (data === null || typeof data !== 'object') {
    throw new TypeError('exportAsCSV: data must be a non-null object');
  }
  const keys = Object.keys(data);
  if (keys.length === 0) return '';

  const escape = (val) => {
    const str = val === null || val === undefined
      ? ''
      : typeof val === 'object'
        ? JSON.stringify(val)
        : String(val);
    // Wrap in quotes if contains comma, quote, or newline
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };

  const header = keys.map(escape).join(',');
  const row = keys.map((k) => escape(data[k])).join(',');
  return header + '\n' + row;
}

/**
 * Export form data as a URLSearchParams-compatible query string.
 * Nested objects are JSON-stringified.
 * @param {Record<string, any>} data
 * @returns {string}
 */
export function exportAsQueryString(data) {
  if (data === null || typeof data !== 'object') {
    throw new TypeError('exportAsQueryString: data must be a non-null object');
  }
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) {
      params.set(key, '');
    } else if (typeof value === 'object') {
      params.set(key, JSON.stringify(value));
    } else {
      params.set(key, String(value));
    }
  }
  return params.toString();
}

/**
 * Import/parse a query string back into a plain object.
 * @param {string} queryString
 * @returns {Record<string, string>}
 */
export function importFromQueryString(queryString) {
  const params = new URLSearchParams(queryString);
  const result = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
}
