/**
 * formValidationRules.js
 * Built-in and custom validation rule registry for formforge.
 */

/** @type {Map<string, (value: any, param: any, field: object) => string|null>} */
const ruleRegistry = new Map();

/**
 * Register a named validation rule.
 * @param {string} name
 * @param {(value: any, param: any, field: object) => string|null} fn
 */
export function registerRule(name, fn) {
  if (typeof fn !== 'function') throw new TypeError(`Rule "${name}" must be a function`);
  ruleRegistry.set(name, fn);
}

/**
 * Unregister a named rule.
 * @param {string} name
 */
export function unregisterRule(name) {
  ruleRegistry.delete(name);
}

/**
 * Check if a rule is registered.
 * @param {string} name
 * @returns {boolean}
 */
export function hasRule(name) {
  return ruleRegistry.has(name);
}

/**
 * Run a named rule against a value.
 * Returns an error string or null.
 * @param {string} name
 * @param {any} value
 * @param {any} param
 * @param {object} field
 * @returns {string|null}
 */
export function runRule(name, value, param, field = {}) {
  const fn = ruleRegistry.get(name);
  if (!fn) throw new Error(`Unknown validation rule: "${name}"`);
  return fn(value, param, field) ?? null;
}

/**
 * Apply all rules defined in a field's `rules` map to a value.
 * @param {any} value
 * @param {object} field  - field definition, may have field.rules: { [ruleName]: param }
 * @returns {string[]}
 */
export function applyRules(value, field) {
  const errors = [];
  const rules = field.rules || {};
  for (const [name, param] of Object.entries(rules)) {
    const error = runRule(name, value, param, field);
    if (error) errors.push(error);
  }
  return errors;
}

/**
 * List all registered rule names.
 * @returns {string[]}
 */
export function listRules() {
  return Array.from(ruleRegistry.keys());
}

// --- Built-in rules ---

registerRule('minLength', (value, param) =>
  typeof value === 'string' && value.length < param
    ? `Minimum length is ${param}`
    : null
);

registerRule('maxLength', (value, param) =>
  typeof value === 'string' && value.length > param
    ? `Maximum length is ${param}`
    : null
);

registerRule('pattern', (value, param) => {
  const re = param instanceof RegExp ? param : new RegExp(param);
  return typeof value === 'string' && !re.test(value)
    ? `Value does not match required pattern`
    : null;
});

registerRule('min', (value, param) =>
  Number(value) < param ? `Minimum value is ${param}` : null
);

registerRule('max', (value, param) =>
  Number(value) > param ? `Maximum value is ${param}` : null
);

registerRule('email', (value) =>
  typeof value === 'string' && value.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? `Must be a valid email address`
    : null
);
