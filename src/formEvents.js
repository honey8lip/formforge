/**
 * formEvents.js
 * Simple event emitter for form lifecycle events.
 */

/** @type {Map<string, Set<Function>>} */
const listeners = new Map();

/**
 * Subscribe to a form event.
 * @param {string} event
 * @param {Function} handler
 * @returns {() => void} unsubscribe function
 */
export function on(event, handler) {
  if (!listeners.has(event)) {
    listeners.set(event, new Set());
  }
  listeners.get(event).add(handler);
  return () => off(event, handler);
}

/**
 * Unsubscribe from a form event.
 * @param {string} event
 * @param {Function} handler
 */
export function off(event, handler) {
  const handlers = listeners.get(event);
  if (handlers) {
    handlers.delete(handler);
    if (handlers.size === 0) listeners.delete(event);
  }
}

/**
 * Emit a form event with optional payload.
 * @param {string} event
 * @param {*} payload
 */
export function emit(event, payload) {
  const handlers = listeners.get(event);
  if (!handlers) return;
  for (const handler of handlers) {
    try {
      handler(payload);
    } catch (err) {
      console.error(`[formEvents] Error in handler for "${event}":`, err);
    }
  }
}

/**
 * Remove all listeners, optionally scoped to one event.
 * @param {string} [event]
 */
export function clearAll(event) {
  if (event) {
    listeners.delete(event);
  } else {
    listeners.clear();
  }
}

/** Well-known event names used across formforge. */
export const EVENTS = /** @type {const} */ ({
  FIELD_CHANGE: 'field:change',
  FORM_SUBMIT: 'form:submit',
  FORM_RESET: 'form:reset',
  VALIDATION_ERROR: 'validation:error',
  VALIDATION_SUCCESS: 'validation:success',
});
