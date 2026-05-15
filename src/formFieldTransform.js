/**
 * formFieldTransform.js
 * Register and apply value transformers to form fields.
 * Transformers convert raw input values before storage or display.
 */

/** @type {Map<string, Function>} */
const transforms = new Map();

/**
 * Register a named transform function.
 * @param {string} name
 * @param {(value: any) => any} fn
 */
export function registerTransform(name, fn) {
  if (typeof name !== 'string' || !name) throw new Error('Transform name must be a non-empty string');
  if (typeof fn !== 'function') throw new Error('Transform must be a function');
  transforms.set(name, fn);
}

/**
 * Unregister a transform by name.
 * @param {string} name
 */
export function unregisterTransform(name) {
  transforms.delete(name);
}

/**
 * Check if a transform is registered.
 * @param {string} name
 * @returns {boolean}
 */
export function hasTransform(name) {
  return transforms.has(name);
}

/**
 * Apply a single named transform to a value.
 * @param {string} name
 * @param {any} value
 * @returns {any}
 */
export function applyTransform(name, value) {
  const fn = transforms.get(name);
  if (!fn) throw new Error(`Transform "${name}" is not registered`);
  return fn(value);
}

/**
 * Apply an ordered list of transform names to a value in sequence.
 * @param {string[]} names
 * @param {any} value
 * @returns {any}
 */
export function applyTransforms(names, value) {
  return names.reduce((v, name) => applyTransform(name, v), value);
}

/**
 * List all registered transform names.
 * @returns {string[]}
 */
export function listTransforms() {
  return Array.from(transforms.keys());
}

/**
 * Clear all registered transforms.
 */
export function clearTransforms() {
  transforms.clear();
}
