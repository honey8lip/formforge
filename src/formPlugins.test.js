import {
  registerPlugin,
  unregisterPlugin,
  hasPlugin,
  applyPlugins,
  listPlugins,
  clearPlugins,
} from './formPlugins.js';

beforeEach(() => {
  clearPlugins();
});

describe('registerPlugin', () => {
  test('registers a valid plugin', () => {
    const plugin = { install: jest.fn() };
    registerPlugin('myPlugin', plugin);
    expect(hasPlugin('myPlugin')).toBe(true);
  });

  test('throws if plugin is registered twice', () => {
    const plugin = { install: jest.fn() };
    registerPlugin('dup', plugin);
    expect(() => registerPlugin('dup', plugin)).toThrow(/already registered/);
  });

  test('throws if plugin has no install method', () => {
    expect(() => registerPlugin('bad', {})).toThrow(/install\(\)/);
  });
});

describe('unregisterPlugin', () => {
  test('removes a registered plugin', () => {
    registerPlugin('temp', { install: jest.fn() });
    expect(unregisterPlugin('temp')).toBe(true);
    expect(hasPlugin('temp')).toBe(false);
  });

  test('returns false for unknown plugin', () => {
    expect(unregisterPlugin('ghost')).toBe(false);
  });
});

describe('listPlugins', () => {
  test('returns names of all registered plugins', () => {
    registerPlugin('a', { install: jest.fn() });
    registerPlugin('b', { install: jest.fn() });
    expect(listPlugins()).toEqual(['a', 'b']);
  });

  test('returns empty array when none registered', () => {
    expect(listPlugins()).toEqual([]);
  });
});

describe('applyPlugins', () => {
  test('calls install on each plugin with context', () => {
    const installA = jest.fn();
    const installB = jest.fn();
    registerPlugin('plugA', { install: installA });
    registerPlugin('plugB', { install: installB });

    const ctx = { formEl: {}, state: {}, events: {}, schema: {} };
    applyPlugins(ctx);

    expect(installA).toHaveBeenCalledWith(ctx);
    expect(installB).toHaveBeenCalledWith(ctx);
  });

  test('continues applying remaining plugins if one throws', () => {
    const installBad = jest.fn(() => { throw new Error('oops'); });
    const installGood = jest.fn();
    registerPlugin('bad', { install: installBad });
    registerPlugin('good', { install: installGood });

    const ctx = { formEl: {}, state: {}, events: {}, schema: {} };
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => applyPlugins(ctx)).not.toThrow();
    expect(installGood).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

describe('clearPlugins', () => {
  test('removes all plugins', () => {
    registerPlugin('x', { install: jest.fn() });
    clearPlugins();
    expect(listPlugins()).toEqual([]);
  });
});
