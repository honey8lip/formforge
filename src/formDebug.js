/**
 * formDebug.js
 * Utilities for inspecting and debugging form state, events, and validation.
 */

let _enabled = false;
const _log = [];
const MAX_LOG = 200;

/**
 * Enable or disable debug mode.
 * @param {boolean} flag
 */
export function setDebugMode(flag) {
  _enabled = !!flag;
}

/**
 * Returns whether debug mode is active.
 * @returns {boolean}
 */
export function isDebugEnabled() {
  return _enabled;
}

/**
 * Log a debug entry (only when debug mode is on).
 * @param {string} category - e.g. 'state', 'event', 'validation'
 * @param {string} message
 * @param {*} [data]
 */
export function debugLog(category, message, data) {
  if (!_enabled) return;
  const entry = {
    timestamp: Date.now(),
    category,
    message,
    data: data !== undefined ? JSON.parse(JSON.stringify(data)) : undefined,
  };
  _log.push(entry);
  if (_log.length > MAX_LOG) _log.shift();
  // eslint-disable-next-line no-console
  console.debug(`[formforge:${category}] ${message}`, data !== undefined ? data : '');
}

/**
 * Return a copy of the current debug log.
 * @returns {Array<{timestamp: number, category: string, message: string, data: *}>}
 */
export function getDebugLog() {
  return [..._log];
}

/**
 * Clear the in-memory debug log.
 */
export function clearDebugLog() {
  _log.length = 0;
}

/**
 * Dump a summary of form state to the console.
 * @param {object} state - plain state object from getState()
 */
export function dumpState(state) {
  if (!_enabled) return;
  // eslint-disable-next-line no-console
  console.group('[formforge:state] Form State Dump');
  // eslint-disable-next-line no-console
  console.table(
    Object.entries(state).map(([field, value]) => ({ field, value: JSON.stringify(value) }))
  );
  // eslint-disable-next-line no-console
  console.groupEnd();
}
