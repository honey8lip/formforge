/**
 * formAnalytics.js
 * Tracks form interaction events and computes basic usage metrics.
 */

/** @type {import('./formAnalytics.types').AnalyticsEvent[]} */
let eventLog = [];

/** @type {Record<string, number>} */
let fieldFocusCount = {};

/** @type {Record<string, number>} */
let fieldChangeCount = {};

/** @type {number|null} */
let formStartTime = null;

/**
 * Reset all analytics state.
 */
export function resetAnalytics() {
  eventLog = [];
  fieldFocusCount = {};
  fieldChangeCount = {};
  formStartTime = null;
}

/**
 * Mark the start of a form session.
 */
export function startSession() {
  formStartTime = Date.now();
  eventLog.push({ type: 'session_start', timestamp: formStartTime, field: null });
}

/**
 * Record a field focus event.
 * @param {string} fieldName
 */
export function trackFocus(fieldName) {
  const timestamp = Date.now();
  fieldFocusCount[fieldName] = (fieldFocusCount[fieldName] || 0) + 1;
  eventLog.push({ type: 'focus', timestamp, field: fieldName });
}

/**
 * Record a field change event.
 * @param {string} fieldName
 */
export function trackChange(fieldName) {
  const timestamp = Date.now();
  fieldChangeCount[fieldName] = (fieldChangeCount[fieldName] || 0) + 1;
  eventLog.push({ type: 'change', timestamp, field: fieldName });
}

/**
 * Record a form submission event.
 * @param {'success'|'failure'} result
 */
export function trackSubmit(result) {
  eventLog.push({ type: 'submit', timestamp: Date.now(), field: null, meta: { result } });
}

/**
 * Get a summary of analytics data.
 * @returns {import('./formAnalytics.types').AnalyticsSummary}
 */
export function getSummary() {
  const sessionDuration = formStartTime ? Date.now() - formStartTime : 0;
  return {
    sessionDuration,
    totalEvents: eventLog.length,
    fieldFocusCount: { ...fieldFocusCount },
    fieldChangeCount: { ...fieldChangeCount },
    events: [...eventLog],
  };
}

/**
 * Attach analytics listeners to a form element.
 * @param {HTMLFormElement} formEl
 */
export function attachToForm(formEl) {
  startSession();
  formEl.addEventListener('focusin', (e) => {
    const name = /** @type {HTMLElement} */ (e.target).getAttribute('name');
    if (name) trackFocus(name);
  });
  formEl.addEventListener('change', (e) => {
    const name = /** @type {HTMLElement} */ (e.target).getAttribute('name');
    if (name) trackChange(name);
  });
  formEl.addEventListener('submit', () => trackSubmit('success'));
}
