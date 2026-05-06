import { applyAriaAttributes, setFieldError, setFieldDescription } from './formAccessibility.js';

function makeInput(name) {
  const input = document.createElement('input');
  input.name = name;
  input.id = name;
  return input;
}

function makeContainer() {
  return document.createElement('div');
}

describe('applyAriaAttributes', () => {
  test('sets aria-required when field is required', () => {
    const input = makeInput('email');
    applyAriaAttributes(input, { name: 'email', required: true });
    expect(input.getAttribute('aria-required')).toBe('true');
  });

  test('does not set aria-required when field is not required', () => {
    const input = makeInput('nickname');
    applyAriaAttributes(input, { name: 'nickname', required: false });
    expect(input.hasAttribute('aria-required')).toBe(false);
  });

  test('sets aria-describedby when description is present', () => {
    const input = makeInput('bio');
    applyAriaAttributes(input, { name: 'bio', description: 'Tell us about yourself' });
    expect(input.getAttribute('aria-describedby')).toBe('bio-desc');
  });

  test('sets aria-invalid on failed validation', () => {
    const input = makeInput('age');
    applyAriaAttributes(input, { name: 'age' }, { valid: false, message: 'Required' });
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toContain('age-error');
  });

  test('removes aria-invalid on passing validation', () => {
    const input = makeInput('age');
    input.setAttribute('aria-invalid', 'true');
    applyAriaAttributes(input, { name: 'age' }, { valid: true });
    expect(input.hasAttribute('aria-invalid')).toBe(false);
  });

  test('appends error id to existing aria-describedby', () => {
    const input = makeInput('phone');
    input.setAttribute('aria-describedby', 'phone-desc');
    applyAriaAttributes(input, { name: 'phone' }, { valid: false, message: 'Invalid' });
    expect(input.getAttribute('aria-describedby')).toBe('phone-desc phone-error');
  });

  test('handles null fieldEl gracefully', () => {
    expect(() => applyAriaAttributes(null, { name: 'x' })).not.toThrow();
  });
});

describe('setFieldError', () => {
  test('creates error element with correct id and role', () => {
    const container = makeContainer();
    const el = setFieldError(container, 'username', 'This field is required');
    expect(el).not.toBeNull();
    expect(el.id).toBe('username-error');
    expect(el.getAttribute('role')).toBe('alert');
    expect(el.textContent).toBe('This field is required');
  });

  test('removes error element when message is null', () => {
    const container = makeContainer();
    setFieldError(container, 'username', 'Error!');
    setFieldError(container, 'username', null);
    expect(container.querySelector('#username-error')).toBeNull();
  });

  test('updates existing error element text', () => {
    const container = makeContainer();
    setFieldError(container, 'email', 'First error');
    setFieldError(container, 'email', 'Updated error');
    const els = container.querySelectorAll('#email-error');
    expect(els.length).toBe(1);
    expect(els[0].textContent).toBe('Updated error');
  });

  test('returns null for null container', () => {
    expect(setFieldError(null, 'x', 'oops')).toBeNull();
  });
});

describe('setFieldDescription', () => {
  test('creates description element with correct id', () => {
    const container = makeContainer();
    const el = setFieldDescription(container, 'bio', 'Short bio');
    expect(el.id).toBe('bio-desc');
    expect(el.textContent).toBe('Short bio');
    expect(el.className).toBe('ff-field-description');
  });

  test('returns null when description is empty', () => {
    const container = makeContainer();
    expect(setFieldDescription(container, 'bio', '')).toBeNull();
  });

  test('updates existing description element', () => {
    const container = makeContainer();
    setFieldDescription(container, 'bio', 'First');
    setFieldDescription(container, 'bio', 'Second');
    const els = container.querySelectorAll('#bio-desc');
    expect(els.length).toBe(1);
    expect(els[0].textContent).toBe('Second');
  });
});
