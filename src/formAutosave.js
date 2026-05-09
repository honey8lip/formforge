/**
 * formAutosave.js
 * Provides autosave functionality for forms using localStorage or a custom storage backend.
 */

/** @type {Map<string, ReturnType<typeof setInterval>>} */
const timers = new Map();

/**
 * @typedef {Object} AutosaveOptions
 * @property {string} key - Storage key to use
 * @property {number} [interval=3000] - Autosave interval in milliseconds
 * @property {function(Record<string, any>): void} [onSave] - Called after each save
 * @property {{ getItem(k: string): string|null, setItem(k: string, v: string): void, removeItem(k: string): void }} [storage] - Custom storage backend
 */

/**
 * Start autosaving form values at a regular interval.
 * @param {string} formId - Unique identifier for this form instance
 * @param {function(): Record<string, any>} getValues - Returns current form values
 * @param {AutosaveOptions} options
 */
export function startAutosave(formId, getValues, options) {
  const {
    key,
    interval = 3000,
    onSave,
    storage = localStorage,
  } = options;

  if (timers.has(formId)) {
    stopAutosave(formId);
  }

  const timer = setInterval(() => {
    const values = getValues();
    storage.setItem(key, JSON.stringify({ values, savedAt: Date.now() }));
    if (typeof onSave === 'function') onSave(values);
  }, interval);

  timers.set(formId, timer);
}

/**
 * Stop autosaving for a given form.
 * @param {string} formId
 */
export function stopAutosave(formId) {
  const timer = timers.get(formId);
  if (timer !== undefined) {
    clearInterval(timer);
    timers.delete(formId);
  }
}

/**
 * Load previously autosaved values.
 * @param {string} key
 * @param {{ getItem(k: string): string|null }} [storage]
 * @returns {{ values: Record<string, any>, savedAt: number } | null}
 */
export function loadAutosaved(key, storage = localStorage) {
  const raw = storage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Clear autosaved data for a given key.
 * @param {string} key
 * @param {{ removeItem(k: string): void }} [storage]
 */
export function clearAutosaved(key, storage = localStorage) {
  storage.removeItem(key);
}

/**
 * Check whether autosave is currently active for a form.
 * @param {string} formId
 * @returns {boolean}
 */
export function isAutosaving(formId) {
  return timers.has(formId);
}
