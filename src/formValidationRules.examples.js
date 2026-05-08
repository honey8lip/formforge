/**
 * formValidationRules.examples.js
 * Example custom rules for formforge.
 */

import { registerRule } from './formValidationRules.js';

/**
 * Validates that a value matches another field's value (e.g. confirm password).
 * Usage: field.rules = { matches: 'passwordFieldName' }
 * Requires field.formValues to be injected by the caller.
 */
export function registerMatchesRule() {
  registerRule('matches', (value, param, field) => {
    const formValues = field.formValues || {};
    return value !== formValues[param]
      ? `Must match ${param}`
      : null;
  });
}

/**
 * Validates that a numeric string is a whole integer.
 */
export function registerIntegerRule() {
  registerRule('integer', (value) =>
    value !== '' && !/^-?\d+$/.test(String(value))
      ? 'Must be a whole number'
      : null
  );
}

/**
 * Validates that a value is one of an allowed set.
 * Usage: field.rules = { oneOf: ['a', 'b', 'c'] }
 */
export function registerOneOfRule() {
  registerRule('oneOf', (value, param) => {
    const allowed = Array.isArray(param) ? param : [];
    return value !== '' && !allowed.includes(value)
      ? `Must be one of: ${allowed.join(', ')}`
      : null;
  });
}

/**
 * Validates that a URL string is well-formed.
 */
export function registerUrlRule() {
  registerRule('url', (value) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return 'Must be a valid URL';
    }
  });
}
