/**
 * @typedef {'session_start'|'focus'|'change'|'submit'} AnalyticsEventType
 */

/**
 * @typedef {Object} AnalyticsEvent
 * @property {AnalyticsEventType} type
 * @property {number} timestamp
 * @property {string|null} field
 * @property {Record<string, any>} [meta]
 */

/**
 * @typedef {Object} AnalyticsSummary
 * @property {number} sessionDuration        - ms since session start
 * @property {number} totalEvents
 * @property {Record<string, number>} fieldFocusCount
 * @property {Record<string, number>} fieldChangeCount
 * @property {AnalyticsEvent[]} events
 */

export {};
