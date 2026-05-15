import {
  registerTransform,
  unregisterTransform,
  hasTransform,
  applyTransform,
  applyTransforms,
  listTransforms,
  clearTransforms,
} from './formFieldTransform.js';
import { registerAllBuiltinTransforms } from './formFieldTransform.examples.js';

beforeEach(() => {
  clearTransforms();
});

describe('registerTransform', () => {
  test('registers a transform and hasTransform returns true', () => {
    registerTransform('upper', (v) => v.toUpperCase());
    expect(hasTransform('upper')).toBe(true);
  });

  test('throws on empty name', () => {
    expect(() => registerTransform('', (v) => v)).toThrow();
  });

  test('throws when fn is not a function', () => {
    expect(() => registerTransform('bad', 42)).toThrow();
  });
});

describe('unregisterTransform', () => {
  test('removes a registered transform', () => {
    registerTransform('x', (v) => v);
    unregisterTransform('x');
    expect(hasTransform('x')).toBe(false);
  });

  test('does not throw when removing unknown transform', () => {
    expect(() => unregisterTransform('nonexistent')).not.toThrow();
  });
});

describe('applyTransform', () => {
  test('applies a registered transform', () => {
    registerTransform('double', (v) => v * 2);
    expect(applyTransform('double', 5)).toBe(10);
  });

  test('throws for unregistered transform', () => {
    expect(() => applyTransform('missing', 'val')).toThrow(/not registered/);
  });
});

describe('applyTransforms', () => {
  test('applies multiple transforms in order', () => {
    registerTransform('trim', (v) => v.trim());
    registerTransform('lower', (v) => v.toLowerCase());
    expect(applyTransforms(['trim', 'lower'], '  HELLO  ')).toBe('hello');
  });

  test('returns original value for empty array', () => {
    expect(applyTransforms([], 'abc')).toBe('abc');
  });
});

describe('listTransforms', () => {
  test('returns names of all registered transforms', () => {
    registerTransform('a', (v) => v);
    registerTransform('b', (v) => v);
    expect(listTransforms()).toEqual(expect.arrayContaining(['a', 'b']));
    expect(listTransforms()).toHaveLength(2);
  });
});

describe('clearTransforms', () => {
  test('removes all transforms', () => {
    registerTransform('z', (v) => v);
    clearTransforms();
    expect(listTransforms()).toHaveLength(0);
  });
});

describe('built-in transforms', () => {
  beforeEach(() => {
    registerAllBuiltinTransforms();
  });

  test('trim removes surrounding whitespace', () => {
    expect(applyTransform('trim', '  hi  ')).toBe('hi');
  });

  test('lowercase converts to lowercase', () => {
    expect(applyTransform('lowercase', 'HELLO')).toBe('hello');
  });

  test('uppercase converts to uppercase', () => {
    expect(applyTransform('uppercase', 'hello')).toBe('HELLO');
  });

  test('toNumber parses a numeric string', () => {
    expect(applyTransform('toNumber', '3.14')).toBeCloseTo(3.14);
  });

  test('toBoolean converts falsy strings', () => {
    expect(applyTransform('toBoolean', 'false')).toBe(false);
    expect(applyTransform('toBoolean', '1')).toBe(true);
  });

  test('collapseSpaces normalises internal spaces', () => {
    expect(applyTransform('collapseSpaces', '  foo   bar  ')).toBe('foo bar');
  });
});
