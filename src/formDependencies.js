/**
 * formDependencies.js
 * Manages field dependency resolution — determines field evaluation order
 * and detects circular dependencies in form schemas.
 */

/**
 * Build an adjacency map of field dependencies.
 * @param {import('./schemaParser.types').NormalizedField[]} fields
 * @returns {Map<string, string[]>}
 */
export function buildDependencyGraph(fields) {
  const graph = new Map();
  for (const field of fields) {
    graph.set(field.name, []);
  }
  for (const field of fields) {
    const deps = field.dependsOn ?? [];
    for (const dep of deps) {
      if (graph.has(dep)) {
        graph.get(dep).push(field.name);
      }
    }
  }
  return graph;
}

/**
 * Topological sort (Kahn's algorithm) — returns evaluation order.
 * Throws if a cycle is detected.
 * @param {Map<string, string[]>} graph
 * @returns {string[]}
 */
export function resolveOrder(graph) {
  const inDegree = new Map();
  for (const key of graph.keys()) inDegree.set(key, 0);
  for (const [, neighbors] of graph) {
    for (const n of neighbors) {
      inDegree.set(n, (inDegree.get(n) ?? 0) + 1);
    }
  }

  const queue = [];
  for (const [key, deg] of inDegree) {
    if (deg === 0) queue.push(key);
  }

  const order = [];
  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);
    for (const neighbor of graph.get(node) ?? []) {
      const newDeg = inDegree.get(neighbor) - 1;
      inDegree.set(neighbor, newDeg);
      if (newDeg === 0) queue.push(neighbor);
    }
  }

  if (order.length !== graph.size) {
    const cycle = [...inDegree.entries()]
      .filter(([, d]) => d > 0)
      .map(([k]) => k);
    throw new Error(`Circular dependency detected among fields: ${cycle.join(', ')}`);
  }

  return order;
}

/**
 * Returns true if adding an edge from `from` to `to` would create a cycle.
 * @param {Map<string, string[]>} graph
 * @param {string} from
 * @param {string} to
 * @returns {boolean}
 */
export function wouldCreateCycle(graph, from, to) {
  // DFS from `to` — if we can reach `from`, adding the edge creates a cycle
  const visited = new Set();
  const stack = [to];
  while (stack.length > 0) {
    const node = stack.pop();
    if (node === from) return true;
    if (visited.has(node)) continue;
    visited.add(node);
    for (const neighbor of graph.get(node) ?? []) {
      stack.push(neighbor);
    }
  }
  return false;
}
