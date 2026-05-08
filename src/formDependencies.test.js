import { buildDependencyGraph, resolveOrder, wouldCreateCycle } from './formDependencies.js';

const makeFields = (defs) =>
  defs.map(([name, dependsOn = []]) => ({ name, dependsOn }));

describe('buildDependencyGraph', () => {
  test('creates entries for all fields', () => {
    const fields = makeFields([['a'], ['b'], ['c']]);
    const graph = buildDependencyGraph(fields);
    expect([...graph.keys()]).toEqual(['a', 'b', 'c']);
  });

  test('maps dependency edges correctly', () => {
    const fields = makeFields([['a'], ['b', ['a']], ['c', ['a', 'b']]]);
    const graph = buildDependencyGraph(fields);
    expect(graph.get('a')).toEqual(['b', 'c']);
    expect(graph.get('b')).toEqual(['c']);
    expect(graph.get('c')).toEqual([]);
  });

  test('ignores dependsOn references to unknown fields', () => {
    const fields = makeFields([['a', ['ghost']]]);
    const graph = buildDependencyGraph(fields);
    expect(graph.get('a')).toEqual([]);
  });

  test('handles fields with no dependsOn', () => {
    const fields = [{ name: 'x' }];
    const graph = buildDependencyGraph(fields);
    expect(graph.get('x')).toEqual([]);
  });
});

describe('resolveOrder', () => {
  test('returns all field names for independent fields', () => {
    const fields = makeFields([['a'], ['b'], ['c']]);
    const graph = buildDependencyGraph(fields);
    const order = resolveOrder(graph);
    expect(order.sort()).toEqual(['a', 'b', 'c']);
  });

  test('respects dependency ordering', () => {
    const fields = makeFields([['a'], ['b', ['a']], ['c', ['b']]]);
    const graph = buildDependencyGraph(fields);
    const order = resolveOrder(graph);
    expect(order.indexOf('a')).toBeLessThan(order.indexOf('b'));
    expect(order.indexOf('b')).toBeLessThan(order.indexOf('c'));
  });

  test('throws on circular dependency', () => {
    const graph = new Map([
      ['a', ['b']],
      ['b', ['a']],
    ]);
    expect(() => resolveOrder(graph)).toThrow(/Circular dependency/);
  });

  test('throws and names the offending fields', () => {
    const graph = new Map([
      ['x', ['y']],
      ['y', ['x']],
      ['z', []],
    ]);
    expect(() => resolveOrder(graph)).toThrow(/x|y/);
  });
});

describe('wouldCreateCycle', () => {
  test('returns false when no cycle would be created', () => {
    const fields = makeFields([['a'], ['b', ['a']]]);
    const graph = buildDependencyGraph(fields);
    expect(wouldCreateCycle(graph, 'b', 'c')).toBe(false);
  });

  test('returns true when adding edge creates direct cycle', () => {
    const graph = new Map([['a', ['b']], ['b', []]]);
    expect(wouldCreateCycle(graph, 'a', 'b')).toBe(true);
  });

  test('returns true for transitive cycle', () => {
    const graph = new Map([['a', ['b']], ['b', ['c']], ['c', []]]);
    // adding c -> a would create a -> b -> c -> a
    expect(wouldCreateCycle(graph, 'a', 'c')).toBe(true);
  });

  test('returns false for self-loop check on isolated node', () => {
    const graph = new Map([['a', []]]);
    expect(wouldCreateCycle(graph, 'a', 'b')).toBe(false);
  });
});
