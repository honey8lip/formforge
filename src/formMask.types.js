/**
 * @typedef {(value: string) => string} MaskFn
 * A function that takes a raw string and returns a masked string.
 */

/**
 * @typedef {Object} MaskDefinition
 * @property {string} name - Unique mask identifier
 * @property {MaskFn} fn - Masking function
 */

/**
 * @typedef {Object} MaskOptions
 * @property {string} mask - Name of a registered mask
 * @property {HTMLInputElement} input - Target input element
 */

export {};
