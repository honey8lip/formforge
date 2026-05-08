/**
 * @typedef {Object} FormOptions
 * @property {string} [action] - The form action URL. Defaults to '#'.
 * @property {'get'|'post'} [method] - The HTTP method. Defaults to 'post'.
 * @property {string} [id] - The form element id. Defaults to 'ff-form'.
 * @property {string} [className] - Additional CSS class names to apply to the form element.
 * @property {boolean} [novalidate] - If true, adds the novalidate attribute to disable native browser validation.
 */

/**
 * @typedef {Object} RenderedForm
 * @property {string} html - The rendered HTML string of the full form.
 * @property {string[]} fieldIds - List of rendered field IDs in order.
 */

/**
 * @typedef {Object} FieldRenderContext
 * @property {string} fieldId - The unique identifier for the field.
 * @property {string} [labelText] - The display label for the field.
 * @property {boolean} [required] - Whether the field is required.
 * @property {string} [errorMessage] - Validation error message to display, if any.
 */

export {};
