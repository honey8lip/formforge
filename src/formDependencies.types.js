/**
 * @typedef {Object} DependencyGraph
 * A map from field name to the list of field names that depend on it.
 * @type {Map<string, string[]>}
 */

/**
 * @typedef {Object} DependencyResolutionResult
 * @property {string[]} order - Field names in safe evaluation order
 * @property {Map<string, string[]>} graph - The resolved dependency graph
 */

export {};
