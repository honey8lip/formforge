const { parseSchema, normalizeField, SUPPORTED_TYPES } = require('./schemaParser');

describe('normalizeField', () => {
  test('uses field key as label when title is absent', () => {
    const field = normalizeField('username', { type: 'string' }, []);
    expect(field.label).toBe('username');
  });

  test('uses title as label when provided', () => {
    const field = normalizeField('username', { type: 'string', title: 'Your Username' }, []);
    expect(field.label).toBe('Your Username');
  });

  test('marks field as required when name is in required array', () => {
    const field = normalizeField('email', { type: 'string' }, ['email']);
    expect(field.required).toBe(true);
  });

  test('marks field as not required by default', () => {
    const field = normalizeField('bio', { type: 'string' }, []);
    expect(field.required).toBe(false);
  });

  test('falls back to string for unsupported types', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const field = normalizeField('data', { type: 'object' }, []);
    expect(field.type).toBe('string');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test('captures enum values', () => {
    const field = normalizeField('role', { type: 'string', enum: ['admin', 'user'] }, []);
    expect(field.enum).toEqual(['admin', 'user']);
  });
});

describe('parseSchema', () => {
  const schema = {
    type: 'object',
    required: ['email'],
    properties: {
      email: { type: 'string', title: 'Email Address', format: 'email' },
      age: { type: 'integer', minimum: 0, maximum: 120 },
      subscribe: { type: 'boolean', default: false },
    },
  };

  test('returns an array with one entry per property', () => {
    const fields = parseSchema(schema);
    expect(fields).toHaveLength(3);
  });

  test('correctly parses required fields', () => {
    const fields = parseSchema(schema);
    const email = fields.find(f => f.name === 'email');
    expect(email.required).toBe(true);
  });

  test('correctly parses numeric constraints', () => {
    const fields = parseSchema(schema);
    const age = fields.find(f => f.name === 'age');
    expect(age.minimum).toBe(0);
    expect(age.maximum).toBe(120);
  });

  test('correctly parses default values', () => {
    const fields = parseSchema(schema);
    const subscribe = fields.find(f => f.name === 'subscribe');
    expect(subscribe.defaultValue).toBe(false);
  });

  test('throws when schema is not an object type', () => {
    expect(() => parseSchema({ type: 'array' })).toThrow();
  });

  test('throws when properties are missing', () => {
    expect(() => parseSchema({ type: 'object' })).toThrow();
  });
});
