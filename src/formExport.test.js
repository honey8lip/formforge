import {
  exportAsJSON,
  exportAsCSV,
  exportAsQueryString,
  importFromQueryString,
} from './formExport.js';

describe('exportAsJSON', () => {
  it('serializes a flat object', () => {
    const result = exportAsJSON({ name: 'Alice', age: 30 });
    expect(JSON.parse(result)).toEqual({ name: 'Alice', age: 30 });
  });

  it('respects indent parameter', () => {
    const result = exportAsJSON({ a: 1 }, 0);
    expect(result).toBe('{"a":1}');
  });

  it('throws on non-object input', () => {
    expect(() => exportAsJSON('string')).toThrow(TypeError);
    expect(() => exportAsJSON(null)).toThrow(TypeError);
  });
});

describe('exportAsCSV', () => {
  it('returns empty string for empty object', () => {
    expect(exportAsCSV({})).toBe('');
  });

  it('produces header and value rows', () => {
    const csv = exportAsCSV({ name: 'Bob', age: 25 });
    const lines = csv.split('\n');
    expect(lines[0]).toBe('name,age');
    expect(lines[1]).toBe('Bob,25');
  });

  it('escapes values containing commas', () => {
    const csv = exportAsCSV({ address: '123 Main St, Suite 4' });
    expect(csv).toContain('"123 Main St, Suite 4"');
  });

  it('escapes values containing double quotes', () => {
    const csv = exportAsCSV({ note: 'say "hello"' });
    expect(csv).toContain('"say ""hello"""');
  });

  it('JSON-stringifies nested objects', () => {
    const csv = exportAsCSV({ meta: { active: true } });
    const lines = csv.split('\n');
    expect(lines[1]).toContain('active');
  });

  it('throws on non-object input', () => {
    expect(() => exportAsCSV(42)).toThrow(TypeError);
  });
});

describe('exportAsQueryString', () => {
  it('encodes simple key-value pairs', () => {
    const qs = exportAsQueryString({ name: 'Alice', role: 'admin' });
    const params = new URLSearchParams(qs);
    expect(params.get('name')).toBe('Alice');
    expect(params.get('role')).toBe('admin');
  });

  it('converts null/undefined to empty string', () => {
    const qs = exportAsQueryString({ field: null });
    const params = new URLSearchParams(qs);
    expect(params.get('field')).toBe('');
  });

  it('JSON-stringifies nested objects', () => {
    const qs = exportAsQueryString({ meta: { x: 1 } });
    const params = new URLSearchParams(qs);
    expect(JSON.parse(params.get('meta'))).toEqual({ x: 1 });
  });

  it('throws on non-object input', () => {
    expect(() => exportAsQueryString(null)).toThrow(TypeError);
  });
});

describe('importFromQueryString', () => {
  it('parses a query string into an object', () => {
    const result = importFromQueryString('name=Alice&age=30');
    expect(result).toEqual({ name: 'Alice', age: '30' });
  });

  it('returns empty object for empty string', () => {
    expect(importFromQueryString('')).toEqual({});
  });

  it('round-trips with exportAsQueryString for flat string values', () => {
    const data = { city: 'New York', country: 'US' };
    const qs = exportAsQueryString(data);
    const parsed = importFromQueryString(qs);
    expect(parsed).toEqual(data);
  });
});
