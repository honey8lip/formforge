/**
 * @typedef {(value: any, param: any, field: FieldDefinition) => string | null} RuleFn
 */

/**
 * @typedef {Object} FieldDefinition
 * @property {string} name
 * @property {string} [type]
 * @property {boolean} [required]
 * @property {Record<string, any>} [rules]  - map of ruleName -> param
 * @property {string} [label]
 */

/**
 * @typedef {Object} RuleRegistry
 * @property {(name: string, fn: RuleFn) => void} registerRule
 * @property {(name: string) => void} unregisterRule
 * @property {(name: string) => boolean} hasRule
 * @property {(name: string, value: any, param: any, field: FieldDefinition) => string|null} runRule
 * @property {(value: any, field: FieldDefinition) => string[]} applyRules
 * @property {() => string[]} listRules
 */
