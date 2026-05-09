import {
  watchField,
  unwatchField,
  notifyWatchers,
  hasWatchers,
  clearWatchers,
  listWatchedFields,
} from './formFieldWatch.js';

beforeEach(() => {
  clearWatchers();
});

describe('watchField', () => {
  test('registers a callback and returns unwatch fn', () => {
    const cb = jest.fn();
    const unwatch = watchField('email', cb);
    expect(hasWatchers('email')).toBe(true);
    expect(typeof unwatch).toBe('function');
  });

  test('throws on invalid fieldKey', () => {
    expect(() => watchField('', jest.fn())).toThrow();
    expect(() => watchField(null, jest.fn())).toThrow();
  });

  test('throws if callback is not a function', () => {
    expect(() => watchField('name', 'not-a-fn')).toThrow();
  });

  test('multiple callbacks can watch the same field', () => {
    const cb1 = jest.fn();
    const cb2 = jest.fn();
    watchField('age', cb1);
    watchField('age', cb2);
    notifyWatchers('age', 25, 24);
    expect(cb1).toHaveBeenCalledWith(25, 24, 'age');
    expect(cb2).toHaveBeenCalledWith(25, 24, 'age');
  });
});

describe('unwatchField', () => {
  test('removes a specific callback', () => {
    const cb = jest.fn();
    watchField('city', cb);
    unwatchField('city', cb);
    notifyWatchers('city', 'NY', 'LA');
    expect(cb).not.toHaveBeenCalled();
    expect(hasWatchers('city')).toBe(false);
  });

  test('unwatch fn returned by watchField works', () => {
    const cb = jest.fn();
    const unwatch = watchField('zip', cb);
    unwatch();
    notifyWatchers('zip', '10001', '90210');
    expect(cb).not.toHaveBeenCalled();
  });

  test('no-op if field has no watchers', () => {
    expect(() => unwatchField('ghost', jest.fn())).not.toThrow();
  });
});

describe('notifyWatchers', () => {
  test('passes newValue, oldValue, and fieldKey to callback', () => {
    const cb = jest.fn();
    watchField('score', cb);
    notifyWatchers('score', 99, 0);
    expect(cb).toHaveBeenCalledWith(99, 0, 'score');
  });

  test('does not throw if no watchers registered', () => {
    expect(() => notifyWatchers('unknown', 'a', 'b')).not.toThrow();
  });

  test('continues notifying other watchers if one throws', () => {
    const bad = jest.fn(() => { throw new Error('oops'); });
    const good = jest.fn();
    watchField('field', bad);
    watchField('field', good);
    expect(() => notifyWatchers('field', 1, 0)).not.toThrow();
    expect(good).toHaveBeenCalled();
  });
});

describe('clearWatchers', () => {
  test('clears watchers for a specific field', () => {
    watchField('a', jest.fn());
    watchField('b', jest.fn());
    clearWatchers('a');
    expect(hasWatchers('a')).toBe(false);
    expect(hasWatchers('b')).toBe(true);
  });

  test('clears all watchers when called with no args', () => {
    watchField('x', jest.fn());
    watchField('y', jest.fn());
    clearWatchers();
    expect(listWatchedFields()).toHaveLength(0);
  });
});

describe('listWatchedFields', () => {
  test('returns all watched field keys', () => {
    watchField('firstName', jest.fn());
    watchField('lastName', jest.fn());
    const list = listWatchedFields();
    expect(list).toContain('firstName');
    expect(list).toContain('lastName');
    expect(list).toHaveLength(2);
  });
});
