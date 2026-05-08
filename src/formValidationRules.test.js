import {
  registerRule,
  unregisterRule,
  hasRule,
  runRule,
  applyRules,
  listRules,
} from './formValidationRules.js';

describe('registerRule / hasRule / listRules', () => {
  it('registers a rule and reports it exists', () => {
    registerRule('testAlpha', () => null);
    expect(hasRule('testAlpha')).toBe(true);
    expect(listRules()).toContain('testAlpha');
  });

  it('throws when fn is not a function', () => {
    expect(() => registerRule('bad', 'nope')).toThrow(TypeError);
  });

  it('unregisters a rule', () => {
    registerRule('tempRule', () => null);
    unregisterRule('tempRule');
    expect(hasRule('tempRule')).toBe(false);
  });
});

describe('runRule', () => {
  it('throws for unknown rule', () => {
    expect(() => runRule('doesNotExist', 'val', null)).toThrow('Unknown validation rule');
  });

  it('returns null on passing rule', () => {
    expect(runRule('minLength', 'hello', 3)).toBeNull();
  });

  it('returns error string on failing rule', () => {
    expect(runRule('minLength', 'hi', 5)).toBe('Minimum length is 5');
  });
});

describe('built-in rules', () => {
  it('maxLength passes and fails', () => {
    expect(runRule('maxLength', 'hi', 5)).toBeNull();
    expect(runRule('maxLength', 'toolongstring', 5)).toBe('Maximum length is 5');
  });

  it('pattern passes and fails', () => {
    expect(runRule('pattern', 'abc123', '^[a-z0-9]+$')).toBeNull();
    expect(runRule('pattern', 'ABC', '^[a-z]+$')).toBe('Value does not match required pattern');
  });

  it('min and max', () => {
    expect(runRule('min', 10, 5)).toBeNull();
    expect(runRule('min', 2, 5)).toBe('Minimum value is 5');
    expect(runRule('max', 3, 10)).toBeNull();
    expect(runRule('max', 15, 10)).toBe('Maximum value is 10');
  });

  it('email passes valid and fails invalid', () => {
    expect(runRule('email', 'user@example.com', null)).toBeNull();
    expect(runRule('email', 'notanemail', null)).toBe('Must be a valid email address');
    expect(runRule('email', '', null)).toBeNull(); // empty is allowed (required handles that)
  });
});

describe('applyRules', () => {
  it('returns empty array when no rules defined', () => {
    expect(applyRules('anything', { name: 'f' })).toEqual([]);
  });

  it('collects multiple errors', () => {
    const field = { name: 'f', rules: { minLength: 10, maxLength: 3 } };
    const errors = applyRules('hello', field);
    expect(errors).toHaveLength(2);
  });

  it('returns no errors when all rules pass', () => {
    const field = { name: 'f', rules: { minLength: 2, maxLength: 10 } };
    expect(applyRules('hello', field)).toEqual([]);
  });

  it('custom rule receives field context', () => {
    registerRule('ctxCheck', (_v, _p, field) => field.extra === 'yes' ? null : 'missing extra');
    const field = { name: 'f', rules: { ctxCheck: true }, extra: 'yes' };
    expect(applyRules('val', field)).toEqual([]);
    const field2 = { name: 'f', rules: { ctxCheck: true }, extra: 'no' };
    expect(applyRules('val', field2)).toEqual(['missing extra']);
  });
});
