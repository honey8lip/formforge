/**
 * @typedef {'eq'|'neq'|'gt'|'gte'|'lt'|'lte'|'in'|'nin'|'empty'|'notempty'} Operator
 */

/**
 * @typedef {Object} Condition
 * @property {string} field - The form field name to test.
 * @property {Operator} operator - Comparison operator.
 * @property {any} [value] - Value to compare against (not needed for empty/notempty).
 */

/**
 * @typedef {'and'|'or'} Logic
 */

/**
 * @typedef {'show'|'hide'|'enable'|'disable'} Effect
 */

/**
 * @typedef {Object} Rule
 * @property {Condition[]} conditions - Conditions to evaluate.
 * @property {Logic} [logic='and'] - How conditions are combined.
 * @property {Effect} effect - What to do when the rule matches.
 */

/**
 * @typedef {Record<string, Rule[]>} FieldConditionMap
 * Maps a field name to an array of rules that govern its visibility/state.
 */

export {};
