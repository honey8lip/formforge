/**
 * formFieldTransform.examples.js
 * Built-in utility transforms for common field value conversions.
 */

import { registerTransform } from './formFieldTransform.js';

/** Trim whitespace from string values. */
export function registerTrimTransform() {
  registerTransform('trim', (v) => (typeof v === 'string' ? v.trim() : v));
}

/** Convert value to lowercase string. */
export function registerLowercaseTransform() {
  registerTransform('lowercase', (v) => (typeof v === 'string' ? v.toLowerCase() : v));
}

/** Convert value to uppercase string. */
export function registerUppercaseTransform() {
  registerTransform('uppercase', (v) => (typeof v === 'string' ? v.toUpperCase() : v));
}

/** Parse a string as a float; returns NaN if not parseable. */
export function registerToNumberTransform() {
  registerTransform('toNumber', (v) => parseFloat(v));
}

/** Convert value to boolean: 'false', '0', '' become false; everything else truthy. */
export function registerToBooleanTransform() {
  registerTransform('toBoolean', (v) => {
    if (typeof v === 'boolean') return v;
    if (v === 'false' || v === '0' || v === '') return false;
    return Boolean(v);
  });
}

/** Replace multiple internal whitespace sequences with a single space (after trim). */
export function registerCollapseSpacesTransform() {
  registerTransform('collapseSpaces', (v) =>
    typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : v
  );
}

/** Register all built-in transforms at once. */
export function registerAllBuiltinTransforms() {
  registerTrimTransform();
  registerLowercaseTransform();
  registerUppercaseTransform();
  registerToNumberTransform();
  registerToBooleanTransform();
  registerCollapseSpacesTransform();
}
