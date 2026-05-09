/**
 * formFieldWatch.js
 * Watch specific fields for value changes and trigger callbacks.
 */

/** @type {Map<string, Set<Function>>} */
const watchers = new Map();

/**
 * Register a watcher for a specific field key.
 * @param {string} fieldKey
 * @param {Function} callback - called with (newValue, oldValue, fieldKey)
 * @returns {Function} unwatch function
 */
export function watchField(fieldKey, callback) {
  if (typeof fieldKey !== 'string' || !fieldKey) {
    throw new Error('watchField: fieldKey must be a non-empty string');
  }
  if (typeof callback !== 'function') {
    throw new Error('watchField: callback must be a function');
  }
  if (!watchers.has(fieldKey)) {
    watchers.set(fieldKey, new Set());
  }
  watchers.get(fieldKey).add(callback);
  return () => unwatchField(fieldKey, callback);
}

/**
 * Remove a specific watcher for a field.
 * @param {string} fieldKey
 * @param {Function} callback
 */
export function unwatchField(fieldKey, callback) {
  const set = watchers.get(fieldKey);
  if (set) {
    set.delete(callback);
    if (set.size === 0) watchers.delete(fieldKey);
  }
}

/**
 * Notify all watchers for a field that its value changed.
 * @param {string} fieldKey
 * @param {*} newValue
 * @param {*} oldValue
 */
export function notifyWatchers(fieldKey, newValue, oldValue) {
  const set = watchers.get(fieldKey);
  if (!set) return;
  for (const cb of set) {
    try {
      cb(newValue, oldValue, fieldKey);
    } catch (e) {
      console.error(`formFieldWatch: error in watcher for "${fieldKey}"`, e);
    }
  }
}

/**
 * Check whether a field has any active watchers.
 * @param {string} fieldKey
 * @returns {boolean}
 */
export function hasWatchers(fieldKey) {
  return watchers.has(fieldKey) && watchers.get(fieldKey).size > 0;
}

/**
 * Remove all watchers for a field, or all watchers entirely.
 * @param {string} [fieldKey]
 */
export function clearWatchers(fieldKey) {
  if (fieldKey !== undefined) {
    watchers.delete(fieldKey);
  } else {
    watchers.clear();
  }
}

/**
 * Return list of field keys currently being watched.
 * @returns {string[]}
 */
export function listWatchedFields() {
  return Array.from(watchers.keys());
}
