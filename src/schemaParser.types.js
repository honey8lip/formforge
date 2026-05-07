/**
 * JSDoc type definitions for formforge schema parsing.
 * Consumed via @typedef references across the codebase.
 */

/**
 * @typedef {object} FieldDescriptor
 * Normalized representation of a single form field derived from a JSON schema property.
 *
 * @property {string}          name         - The property key from the schema
 * @property {string}          type         - Normalized field type (string | number | integer | boolean | array)
 * @property {string}          label        - Human-readable label (from title or field name)
 * @property {string|null}     description  - Optional helper text
 * @property {boolean}         required     - Whether the field is required
 * @property {*}               defaultValue - Default value or null
 * @property {Array|null}      enum         - Allowed values for select-type fields
 * @property {number|null}     minLength    - Minimum string length constraint
 * @property {number|null}     maxLength    - Maximum string length constraint
 * @property {number|null}     minimum      - Minimum numeric value
 * @property {number|null}     maximum      - Maximum numeric value
 * @property {string|null}     pattern      - Regex pattern string for validation
 * @property {string|null}     format       - JSON Schema format hint (e.g. 'date', 'email', 'uri')
 */

/**
 * @typedef {object} ParsedSchema
 * Result of parsing a full JSON schema object.
 *
 * @property {FieldDescriptor[]} fields      - Ordered list of normalized field descriptors
 * @property {string|null}       title       - Optional form title from the root schema
 * @property {string|null}       description - Optional form description from the root schema
 */

/**
 * @typedef {object} JSONSchema
 * Subset of JSON Schema (draft-07) supported by formforge.
 *
 * @property {'object'}         type        - Must be 'object'
 * @property {object}           properties  - Map of field names to their schema definitions
 * @property {string[]}         [required]  - List of required field names
 * @property {string}           [title]     - Optional form title
 * @property {string}           [description] - Optional form description
 */

module.exports = {};
