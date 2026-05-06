/**
 * validator.js
 * Validates form data against a parsed schema definition.
 */

/**
 * @param {import('./schemaParser.types').NormalizedField} field
 * @param {*} value
 * @returns {string|null} error message or null if valid
 */
export function validateField(field, value) {
  const isEmpty = value === undefined || value === null || value === '';

  if (field.required && isEmpty) {
    return `${field.label} is required.`;
  }

  if (isEmpty) return null;

  if (field.type === 'email') {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(value)) {
      return `${field.label} must be a valid email address.`;
    }
  }

  if (field.type === 'number' || field.type === 'range') {
    const num = Number(value);
    if (isNaN(num)) {
      return `${field.label} must be a number.`;
    }
    if (field.min !== undefined && num < field.min) {
      return `${field.label} must be at least ${field.min}.`;
    }
    if (field.max !== undefined && num > field.max) {
      return `${field.label} must be no more than ${field.max}.`;
    }
  }

  if ((field.type === 'text' || field.type === 'textarea' || field.type === 'password') && typeof value === 'string') {
    if (field.minLength !== undefined && value.length < field.minLength) {
      return `${field.label} must be at least ${field.minLength} characters.`;
    }
    if (field.maxLength !== undefined && value.length > field.maxLength) {
      return `${field.label} must be no more than ${field.maxLength} characters.`;
    }
    if (field.pattern) {
      const re = new RegExp(field.pattern);
      if (!re.test(value)) {
        return field.patternMessage || `${field.label} format is invalid.`;
      }
    }
  }

  return null;
}

/**
 * Validates an entire form data object against a list of normalized fields.
 * @param {import('./schemaParser.types').NormalizedField[]} fields
 * @param {Record<string, *>} data
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 */
export function validateForm(fields, data) {
  const errors = {};

  for (const field of fields) {
    const error = validateField(field, data[field.name]);
    if (error) {
      errors[field.name] = error;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
