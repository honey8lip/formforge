import { validateField, validateForm } from './validator.js';

const baseField = (overrides = {}) => ({
  name: 'testField',
  label: 'Test Field',
  type: 'text',
  required: false,
  ...overrides,
});

describe('validateField', () => {
  test('returns null for optional empty field', () => {
    expect(validateField(baseField(), '')).toBeNull();
    expect(validateField(baseField(), null)).toBeNull();
    expect(validateField(baseField(), undefined)).toBeNull();
  });

  test('returns error for required empty field', () => {
    const field = baseField({ required: true });
    expect(validateField(field, '')).toBe('Test Field is required.');
  });

  test('validates email format', () => {
    const field = baseField({ type: 'email' });
    expect(validateField(field, 'not-an-email')).toBe('Test Field must be a valid email address.');
    expect(validateField(field, 'user@example.com')).toBeNull();
  });

  test('validates number min/max', () => {
    const field = baseField({ type: 'number', min: 5, max: 10 });
    expect(validateField(field, 3)).toBe('Test Field must be at least 5.');
    expect(validateField(field, 15)).toBe('Test Field must be no more than 10.');
    expect(validateField(field, 7)).toBeNull();
  });

  test('validates text minLength and maxLength', () => {
    const field = baseField({ type: 'text', minLength: 3, maxLength: 8 });
    expect(validateField(field, 'ab')).toBe('Test Field must be at least 3 characters.');
    expect(validateField(field, 'toolongvalue')).toBe('Test Field must be no more than 8 characters.');
    expect(validateField(field, 'hello')).toBeNull();
  });

  test('validates pattern with custom message', () => {
    const field = baseField({ type: 'text', pattern: '^[A-Z]+$', patternMessage: 'Only uppercase letters.' });
    expect(validateField(field, 'abc')).toBe('Only uppercase letters.');
    expect(validateField(field, 'ABC')).toBeNull();
  });

  test('validates pattern with default message when no patternMessage', () => {
    const field = baseField({ type: 'text', pattern: '^\\d+$' });
    expect(validateField(field, 'abc')).toBe('Test Field format is invalid.');
  });
});

describe('validateForm', () => {
  const fields = [
    baseField({ name: 'username', label: 'Username', required: true, type: 'text', minLength: 3 }),
    baseField({ name: 'email', label: 'Email', required: true, type: 'email' }),
    baseField({ name: 'age', label: 'Age', type: 'number', min: 18 }),
  ];

  test('returns valid true when all fields pass', () => {
    const result = validateForm(fields, { username: 'alice', email: 'alice@example.com', age: 25 });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  test('collects multiple errors', () => {
    const result = validateForm(fields, { username: '', email: 'bad', age: 10 });
    expect(result.valid).toBe(false);
    expect(result.errors.username).toBe('Username is required.');
    expect(result.errors.email).toBe('Email must be a valid email address.');
    expect(result.errors.age).toBe('Age must be at least 18.');
  });

  test('ignores optional fields that are empty', () => {
    const result = validateForm(fields, { username: 'bob', email: 'bob@example.com' });
    expect(result.valid).toBe(true);
    expect(result.errors.age).toBeUndefined();
  });
});
