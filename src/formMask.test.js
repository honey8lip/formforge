import {
  registerMask,
  unregisterMask,
  hasMask,
  applyMask,
  attachMaskToInput,
  listMasks,
} from './formMask.js';
import {
  registerPhoneMask,
  registerDateMask,
  registerCreditCardMask,
  registerZipMask,
} from './formMask.examples.js';

beforeEach(() => {
  // Clean up any masks registered during tests
  listMasks().forEach(unregisterMask);
});

describe('registerMask / hasMask / unregisterMask', () => {
  test('registers and detects a mask', () => {
    registerMask('upper', (v) => v.toUpperCase());
    expect(hasMask('upper')).toBe(true);
  });

  test('unregisters a mask', () => {
    registerMask('upper', (v) => v.toUpperCase());
    unregisterMask('upper');
    expect(hasMask('upper')).toBe(false);
  });

  test('throws when fn is not a function', () => {
    expect(() => registerMask('bad', 'notafn')).toThrow();
  });
});

describe('applyMask', () => {
  test('throws for unknown mask', () => {
    expect(() => applyMask('ghost', '123')).toThrow(/not registered/);
  });

  test('applies a custom mask', () => {
    registerMask('upper', (v) => v.toUpperCase());
    expect(applyMask('upper', 'hello')).toBe('HELLO');
  });

  test('handles null/undefined value gracefully', () => {
    registerMask('upper', (v) => v.toUpperCase());
    expect(() => applyMask('upper', null)).not.toThrow();
  });
});

describe('listMasks', () => {
  test('returns empty array when none registered', () => {
    expect(listMasks()).toEqual([]);
  });

  test('lists registered masks', () => {
    registerMask('a', (v) => v);
    registerMask('b', (v) => v);
    expect(listMasks()).toEqual(expect.arrayContaining(['a', 'b']));
  });
});

describe('built-in masks', () => {
  beforeEach(() => {
    registerPhoneMask();
    registerDateMask();
    registerCreditCardMask();
    registerZipMask();
  });

  test('phone-us formats correctly', () => {
    expect(applyMask('phone-us', '1234567890')).toBe('(123) 456-7890');
    expect(applyMask('phone-us', '123')).toBe('123');
    expect(applyMask('phone-us', '123456')).toBe('(123) 456');
  });

  test('date-us formats correctly', () => {
    expect(applyMask('date-us', '12312024')).toBe('12/31/2024');
    expect(applyMask('date-us', '12')).toBe('12');
  });

  test('credit-card formats correctly', () => {
    expect(applyMask('credit-card', '1234567890123456')).toBe('1234 5678 9012 3456');
  });

  test('zip-us formats correctly', () => {
    expect(applyMask('zip-us', '123456789')).toBe('12345-6789');
    expect(applyMask('zip-us', '12345')).toBe('12345');
  });
});

describe('attachMaskToInput', () => {
  test('returns a cleanup function', () => {
    registerMask('upper', (v) => v.toUpperCase());
    const input = document.createElement('input');
    const cleanup = attachMaskToInput(input, 'upper');
    expect(typeof cleanup).toBe('function');
    cleanup();
  });

  test('masks input value on input event', () => {
    registerMask('upper', (v) => v.toUpperCase());
    const input = document.createElement('input');
    attachMaskToInput(input, 'upper');
    input.value = 'hello';
    input.dispatchEvent(new Event('input'));
    expect(input.value).toBe('HELLO');
  });
});
