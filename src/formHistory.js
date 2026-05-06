/**
 * formHistory.js
 * Undo/redo history management for form state snapshots.
 */

/**
 * @typedef {import('./formHistory.types').FormHistory} FormHistory
 */

/**
 * Creates a history tracker for a form state instance.
 * @param {object} options
 * @param {number} [options.maxSize=50] - Maximum number of history entries to keep.
 * @returns {FormHistory}
 */
export function createFormHistory({ maxSize = 50 } = {}) {
  /** @type {any[]} */
  const past = [];
  /** @type {any[]} */
  const future = [];
  let current = null;

  function snapshot(state) {
    if (current !== null) {
      past.push(current);
      if (past.length > maxSize) past.shift();
    }
    current = structuredClone(state);
    future.length = 0;
  }

  function undo() {
    if (past.length === 0) return null;
    future.push(current);
    current = past.pop();
    return structuredClone(current);
  }

  function redo() {
    if (future.length === 0) return null;
    past.push(current);
    current = future.pop();
    return structuredClone(current);
  }

  function canUndo() {
    return past.length > 0;
  }

  function canRedo() {
    return future.length > 0;
  }

  function getCurrent() {
    return current !== null ? structuredClone(current) : null;
  }

  function clear() {
    past.length = 0;
    future.length = 0;
    current = null;
  }

  function getSize() {
    return { past: past.length, future: future.length };
  }

  return { snapshot, undo, redo, canUndo, canRedo, getCurrent, clear, getSize };
}
