/**
 * @typedef {Object} FieldChangePayload
 * @property {string} name - Field name that changed
 * @property {*} value - New value
 * @property {*} previousValue - Previous value
 */

/**
 * @typedef {Object} FormSubmitPayload
 * @property {Record<string, *>} values - All form values at submit time
 * @property {Record<string, string[]>} errors - Validation errors keyed by field name
 */

/**
 * @typedef {Object} FormResetPayload
 * @property {Record<string, *>} defaultValues - Values restored on reset
 */

/**
 * @typedef {Object} ValidationErrorPayload
 * @property {string} name - Field name that failed validation
 * @property {string[]} errors - List of error messages
 */

/**
 * @typedef {Object} ValidationSuccessPayload
 * @property {string} name - Field name that passed validation
 */

/**
 * @typedef {(payload: FieldChangePayload) => void} FieldChangeHandler
 * @typedef {(payload: FormSubmitPayload) => void} FormSubmitHandler
 * @typedef {(payload: FormResetPayload) => void} FormResetHandler
 * @typedef {(payload: ValidationErrorPayload) => void} ValidationErrorHandler
 * @typedef {(payload: ValidationSuccessPayload) => void} ValidationSuccessHandler
 */

export {};
