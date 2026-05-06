/**
 * formPlugins.js
 * Plugin system for extending FormForge with custom behavior.
 */

/** @type {Map<string, import('./formPlugins.types').FormPlugin>} */
const registry = new Map();

/**
 * Register a plugin by name.
 * @param {string} name
 * @param {import('./formPlugins.types').FormPlugin} plugin
 */
export function registerPlugin(name, plugin) {
  if (registry.has(name)) {
    throw new Error(`FormForge: plugin "${name}" is already registered.`);
  }
  if (typeof plugin.install !== 'function') {
    throw new Error(`FormForge: plugin "${name}" must have an install() method.`);
  }
  registry.set(name, plugin);
}

/**
 * Unregister a plugin by name.
 * @param {string} name
 * @returns {boolean}
 */
export function unregisterPlugin(name) {
  return registry.delete(name);
}

/**
 * Check if a plugin is registered.
 * @param {string} name
 * @returns {boolean}
 */
export function hasPlugin(name) {
  return registry.has(name);
}

/**
 * Apply all registered plugins to a form context.
 * @param {import('./formPlugins.types').FormContext} context
 */
export function applyPlugins(context) {
  for (const [name, plugin] of registry.entries()) {
    try {
      plugin.install(context);
    } catch (err) {
      console.error(`FormForge: plugin "${name}" threw during install:`, err);
    }
  }
}

/**
 * Return a list of currently registered plugin names.
 * @returns {string[]}
 */
export function listPlugins() {
  return Array.from(registry.keys());
}

/**
 * Clear all registered plugins (useful for testing).
 */
export function clearPlugins() {
  registry.clear();
}
