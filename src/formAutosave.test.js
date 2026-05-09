import {
  startAutosave,
  stopAutosave,
  loadAutosaved,
  clearAutosaved,
  isAutosaving,
} from './formAutosave.js';

function makeStorage() {
  const store = {};
  return {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = v; },
    removeItem: (k) => { delete store[k]; },
    _store: store,
  };
}

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('startAutosave / stopAutosave', () => {
  test('saves values to storage after interval', () => {
    const storage = makeStorage();
    const getValues = () => ({ name: 'Alice' });
    startAutosave('form1', getValues, { key: 'form1_save', interval: 1000, storage });

    jest.advanceTimersByTime(1000);

    const saved = JSON.parse(storage._store['form1_save']);
    expect(saved.values).toEqual({ name: 'Alice' });
    expect(typeof saved.savedAt).toBe('number');

    stopAutosave('form1');
  });

  test('calls onSave callback with current values', () => {
    const storage = makeStorage();
    const onSave = jest.fn();
    startAutosave('form2', () => ({ email: 'a@b.com' }), {
      key: 'form2_save',
      interval: 500,
      onSave,
      storage,
    });

    jest.advanceTimersByTime(500);
    expect(onSave).toHaveBeenCalledWith({ email: 'a@b.com' });

    stopAutosave('form2');
  });

  test('replaces existing timer when started twice', () => {
    const storage = makeStorage();
    startAutosave('form3', () => ({ v: 1 }), { key: 'k', interval: 1000, storage });
    startAutosave('form3', () => ({ v: 2 }), { key: 'k', interval: 1000, storage });

    jest.advanceTimersByTime(1000);
    const saved = JSON.parse(storage._store['k']);
    expect(saved.values.v).toBe(2);

    stopAutosave('form3');
  });

  test('isAutosaving reflects active state', () => {
    const storage = makeStorage();
    startAutosave('form4', () => ({}), { key: 'k4', storage });
    expect(isAutosaving('form4')).toBe(true);
    stopAutosave('form4');
    expect(isAutosaving('form4')).toBe(false);
  });
});

describe('loadAutosaved', () => {
  test('returns parsed data when present', () => {
    const storage = makeStorage();
    storage.setItem('mykey', JSON.stringify({ values: { x: 1 }, savedAt: 123 }));
    expect(loadAutosaved('mykey', storage)).toEqual({ values: { x: 1 }, savedAt: 123 });
  });

  test('returns null when key is missing', () => {
    const storage = makeStorage();
    expect(loadAutosaved('missing', storage)).toBeNull();
  });

  test('returns null on invalid JSON', () => {
    const storage = makeStorage();
    storage.setItem('bad', 'not-json');
    expect(loadAutosaved('bad', storage)).toBeNull();
  });
});

describe('clearAutosaved', () => {
  test('removes the key from storage', () => {
    const storage = makeStorage();
    storage.setItem('clr', '{"values":{}}');
    clearAutosaved('clr', storage);
    expect(storage.getItem('clr')).toBeNull();
  });
});
