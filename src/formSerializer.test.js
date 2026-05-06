import { serializeForm, deserializeForm } from './formSerializer.js';

// Minimal DOM helpers (works with jsdom / happy-dom)
function makeForm(html) {
  const form = document.createElement('form');
  form.innerHTML = html;
  document.body.appendChild(form);
  return form;
}

function cleanup(form) {
  document.body.removeChild(form);
}

describe('serializeForm', () => {
  test('throws for non-form element', () => {
    expect(() => serializeForm(document.createElement('div'))).toThrow(TypeError);
  });

  test('serializes text and number inputs', () => {
    const form = makeForm(`
      <input name="username" type="text" value="alice" />
      <input name="age" type="number" value="30" />
    `);
    expect(serializeForm(form)).toEqual({ username: 'alice', age: 30 });
    cleanup(form);
  });

  test('returns null for empty number input', () => {
    const form = makeForm('<input name="score" type="number" value="" />');
    expect(serializeForm(form).score).toBeNull();
    cleanup(form);
  });

  test('serializes checkbox as boolean when value is default', () => {
    const form = makeForm('<input name="agree" type="checkbox" checked />');
    expect(serializeForm(form)).toEqual({ agree: true });
    cleanup(form);
  });

  test('serializes checkbox group as array', () => {
    const form = makeForm(`
      <input name="colors" type="checkbox" value="red" checked />
      <input name="colors" type="checkbox" value="blue" />
      <input name="colors" type="checkbox" value="green" checked />
    `);
    expect(serializeForm(form).colors).toEqual(['red', 'green']);
    cleanup(form);
  });

  test('serializes radio buttons', () => {
    const form = makeForm(`
      <input name="size" type="radio" value="small" />
      <input name="size" type="radio" value="large" checked />
    `);
    expect(serializeForm(form)).toEqual({ size: 'large' });
    cleanup(form);
  });

  test('skips disabled fields', () => {
    const form = makeForm('<input name="hidden" type="text" value="x" disabled />');
    expect(serializeForm(form)).toEqual({});
    cleanup(form);
  });
});

describe('deserializeForm', () => {
  test('throws for non-form element', () => {
    expect(() => deserializeForm(document.createElement('div'), {})).toThrow(TypeError);
  });

  test('populates text inputs', () => {
    const form = makeForm('<input name="email" type="text" />');
    deserializeForm(form, { email: 'test@example.com' });
    expect(form.elements['email'].value).toBe('test@example.com');
    cleanup(form);
  });

  test('populates checkbox from boolean', () => {
    const form = makeForm('<input name="subscribe" type="checkbox" />');
    deserializeForm(form, { subscribe: true });
    expect(form.elements['subscribe'].checked).toBe(true);
    cleanup(form);
  });

  test('populates checkbox group from array', () => {
    const form = makeForm(`
      <input name="tags" type="checkbox" value="js" />
      <input name="tags" type="checkbox" value="ts" />
    `);
    deserializeForm(form, { tags: ['ts'] });
    const boxes = Array.from(form.querySelectorAll('[name="tags"]'));
    expect(boxes[0].checked).toBe(false);
    expect(boxes[1].checked).toBe(true);
    cleanup(form);
  });

  test('sets null value to empty string', () => {
    const form = makeForm('<input name="note" type="text" value="old" />');
    deserializeForm(form, { note: null });
    expect(form.elements['note'].value).toBe('');
    cleanup(form);
  });

  test('ignores keys not present in data', () => {
    const form = makeForm('<input name="title" type="text" value="original" />');
    deserializeForm(form, {});
    expect(form.elements['title'].value).toBe('original');
    cleanup(form);
  });
});
