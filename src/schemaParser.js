/**
 * Parses a JSON schema definition and normalizes it into
 * an internal field descriptor array used by the form renderer.
 */

const SUPPORTED_TYPES = ['string', 'number', 'integer', 'boolean', 'array'];

/**
 * Normalize a single field from the schema properties.
 * @param {string} name - Field key
 * @param {object} definition - JSON schema field definition
 * @param {string[]} required - List of required field names
 * @returns {object} Normalized field descriptor
 */
function normalizeField(name, definition, required = []) {
  const type = definition.type || 'string';

  if (!SUPPORTED_TYPES.includes(type)) {
    console.warn(`[formforge] Unsupported field type "${type}" for field "${name}". Falling back to string.`);
  }

  return {
    name,
    type: SUPPORTED_TYPES.includes(type) ? type : 'string',
    label: definition.title || name,
    description: definition.description || null,
    required: required.includes(name),
    defaultValue: definition.default !== undefined ? definition.default : null,
    enum: definition.enum || null,
    minLength: definition.minLength || null,
    maxLength: definition.maxLength || null,
    minimum: definition.minimum !== undefined ? definition.minimum : null,
    maximum: definition.maximum !== undefined ? definition.maximum : null,
    pattern: definition.pattern || null,
  };
}

/**
 * Parse a full JSON schema object into a list of field descriptors.
 * @param {object} schema - A JSON Schema object (draft-07 compatible)
 * @returns {object[]} Array of normalized field descriptors
 */
function parseSchema(schema) {
  if (!schema || schema.type !== 'object' || !schema.properties) {
    throw new Error('[formforge] Schema must be an object type with a "properties" field.');
  }

  const required = Array.isArray(schema.required) ? schema.required : [];

  return Object.entries(schema.properties).map(([name, definition]) =>
    normalizeField(name, definition, required)
  );
}

module.exports = { parseSchema, normalizeField, SUPPORTED_TYPES };
