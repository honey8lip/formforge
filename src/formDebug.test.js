import {
  setDebugMode,
  isDebugEnabled,
  debugLog,
  getDebugLog,
  clearDebugLog,
  dumpState,
} from './formDebug.js';

beforeEach(() => {
  setDebugMode(false);
  clearDebugLog();
});

describe('setDebugMode / isDebugEnabled', () => {
  test('debug mode is off by default', () => {
    expect(isDebugEnabled()).toBe(false);
  });

  test('can be enabled', () => {
    setDebugMode(true);
    expect(isDebugEnabled()).toBe(true);
  });

  test('can be disabled again', () => {
    setDebugMode(true);
    setDebugMode(false);
    expect(isDebugEnabled()).toBe(false);
  });
});

describe('debugLog', () => {
  test('does not log when debug mode is off', () => {
    debugLog('state', 'should not appear');
    expect(getDebugLog()).toHaveLength(0);
  });

  test('logs an entry when debug mode is on', () => {
    setDebugMode(true);
    debugLog('event', 'field changed', { field: 'email' });
    const log = getDebugLog();
    expect(log).toHaveLength(1);
    expect(log[0].category).toBe('event');
    expect(log[0].message).toBe('field changed');
    expect(log[0].data).toEqual({ field: 'email' });
    expect(typeof log[0].timestamp).toBe('number');
  });

  test('stores a deep copy of data', () => {
    setDebugMode(true);
    const data = { value: 1 };
    debugLog('validation', 'test', data);
    data.value = 999;
    expect(getDebugLog()[0].data.value).toBe(1);
  });

  test('caps log at 200 entries', () => {
    setDebugMode(true);
    for (let i = 0; i < 210; i++) debugLog('state', `entry ${i}`);
    expect(getDebugLog().length).toBe(200);
  });
});

describe('getDebugLog', () => {
  test('returns a copy, not the internal array', () => {
    setDebugMode(true);
    debugLog('state', 'hello');
    const log = getDebugLog();
    log.push({ fake: true });
    expect(getDebugLog()).toHaveLength(1);
  });
});

describe('clearDebugLog', () => {
  test('empties the log', () => {
    setDebugMode(true);
    debugLog('state', 'a');
    debugLog('state', 'b');
    clearDebugLog();
    expect(getDebugLog()).toHaveLength(0);
  });
});

describe('dumpState', () => {
  test('does nothing when debug mode is off', () => {
    const spy = jest.spyOn(console, 'group').mockImplementation(() => {});
    dumpState({ name: 'Alice' });
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('calls console.group when debug mode is on', () => {
    setDebugMode(true);
    const groupSpy = jest.spyOn(console, 'group').mockImplementation(() => {});
    const tableSpy = jest.spyOn(console, 'table').mockImplementation(() => {});
    const groupEndSpy = jest.spyOn(console, 'groupEnd').mockImplementation(() => {});
    dumpState({ name: 'Alice', age: 30 });
    expect(groupSpy).toHaveBeenCalledTimes(1);
    expect(tableSpy).toHaveBeenCalledTimes(1);
    expect(groupEndSpy).toHaveBeenCalledTimes(1);
    groupSpy.mockRestore();
    tableSpy.mockRestore();
    groupEndSpy.mockRestore();
  });
});
