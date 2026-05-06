/**
 * formPlugins.types.js
 * JSDoc type definitions for the plugin system.
 */

/**
 * @typedef {Object} FormContext
 * @property {HTMLFormElement} formEl - The root form element.
 * @property {import('./formState').FormState} state - The form state instance.
 * @property {import('./formEvents').EventBus} events - The event bus for this form.
 * @property {import('./schemaParser.types').ParsedSchema} schema - The parsed schema.
 */

/**
 * @typedef {Object} FormPlugin
 * @property {string} [version] - Optional semver string for the plugin.
 * @property {string} [description] - Human-readable description.
 * @property {(context: FormContext) => void} install - Called when the plugin is applied to a form.
 * @property {((context: FormContext) => void)} [uninstall] - Optional cleanup hook.
 */

export {};
