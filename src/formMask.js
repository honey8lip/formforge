/**
 * formMask.js
 * Input masking for form fields (phone, date, credit card, custom patterns)
 */

/** @type {Map<string, (value: string) => string>} */
const masks = new Map();

/**
 * Register a named mask function.
 * @param {string} name
 * @param {(value: string) => string} fn
 */
export function registerMask(name, fn) {
  if (typeof fn !== 'function') throw new Error('Mask must be a function');
  masks.set(name, fn);
}

/**
 * Unregister a named mask.
 * @param {string} name
 */
export function unregisterMask(name) {
  masks.delete(name);
}

/**
 * Check if a mask is registered.
 * @param {string} name
 * @returns {boolean}
 */
export function hasMask(name) {
  return masks.has(name);
}

/**
 * Apply a named mask to a raw value.
 * @param {string} name
 * @param {string} value
 * @returns {string}
 */
export function applyMask(name, value) {
  const fn = masks.get(name);
  if (!fn) throw new Error(`Mask "${name}" is not registered`);
  return fn(String(value ?? ''));
}

/**
 * Apply a mask to an input element and wire up the input event.
 * @param {HTMLInputElement} input
 * @param {string} maskName
 * @returns {() => void} cleanup function
 */
export function attachMaskToInput(input, maskName) {
  const handler = () => {
    const masked = applyMask(maskName, input.value);
    if (input.value !== masked) {
      const pos = input.selectionStart;
      input.value = masked;
      // Restore cursor roughly after masking
      try { input.setSelectionRange(pos, pos); } catch (_) {}
    }
  };
  input.addEventListener('input', handler);
  return () => input.removeEventListener('input', handler);
}

/**
 * List all registered mask names.
 * @returns {string[]}
 */
export function listMasks() {
  return Array.from(masks.keys());
}
