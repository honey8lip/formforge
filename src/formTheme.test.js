import { createTheme, applyThemeToElement, applyThemeToForm, defaultTheme } from './formTheme.js';

describe('createTheme', () => {
  it('returns default theme when no overrides given', () => {
    const theme = createTheme();
    expect(theme).toEqual(defaultTheme);
  });

  it('merges overrides into default theme', () => {
    const theme = createTheme({ input: 'my-input extra' });
    expect(theme.input).toBe('my-input extra');
    expect(theme.label).toBe(defaultTheme.label);
  });

  it('does not mutate defaultTheme', () => {
    createTheme({ form: 'custom-form' });
    expect(defaultTheme.form).toBe('ff-form');
  });
});

describe('applyThemeToElement', () => {
  let el;
  beforeEach(() => { el = document.createElement('input'); });

  it('adds the theme class to the element', () => {
    applyThemeToElement(el, 'input', defaultTheme);
    expect(el.classList.contains('ff-input')).toBe(true);
  });

  it('handles multi-class theme values', () => {
    const theme = createTheme({ input: 'class-a class-b' });
    applyThemeToElement(el, 'input', theme);
    expect(el.classList.contains('class-a')).toBe(true);
    expect(el.classList.contains('class-b')).toBe(true);
  });

  it('does nothing if element is null', () => {
    expect(() => applyThemeToElement(null, 'input', defaultTheme)).not.toThrow();
  });

  it('does nothing if role has no matching theme key', () => {
    applyThemeToElement(el, 'nonexistent', defaultTheme);
    expect(el.className).toBe('');
  });
});

describe('applyThemeToForm', () => {
  let form;

  beforeEach(() => {
    form = document.createElement('form');
    form.innerHTML = `
      <div data-ff-field>
        <label for="name">Name</label>
        <input id="name" type="text" />
        <span data-ff-error>Required</span>
        <span data-ff-description>Your full name</span>
      </div>
      <div data-ff-field>
        <label for="bio">Bio</label>
        <textarea id="bio"></textarea>
      </div>
      <div data-ff-field>
        <label for="role">Role</label>
        <select id="role"><option>Dev</option></select>
      </div>
      <input type="checkbox" id="agree" />
      <input type="radio" name="opt" id="opt1" />
    `;
  });

  it('applies form class to form element', () => {
    applyThemeToForm(form, defaultTheme);
    expect(form.classList.contains('ff-form')).toBe(true);
  });

  it('applies field class to data-ff-field elements', () => {
    applyThemeToForm(form, defaultTheme);
    form.querySelectorAll('[data-ff-field]').forEach((el) => {
      expect(el.classList.contains('ff-field')).toBe(true);
    });
  });

  it('applies input class to text inputs', () => {
    applyThemeToForm(form, defaultTheme);
    expect(form.querySelector('#name').classList.contains('ff-input')).toBe(true);
  });

  it('applies textarea class', () => {
    applyThemeToForm(form, defaultTheme);
    expect(form.querySelector('textarea').classList.contains('ff-textarea')).toBe(true);
  });

  it('applies select class', () => {
    applyThemeToForm(form, defaultTheme);
    expect(form.querySelector('select').classList.contains('ff-select')).toBe(true);
  });

  it('applies checkbox and radio classes', () => {
    applyThemeToForm(form, defaultTheme);
    expect(form.querySelector('[type=checkbox]').classList.contains('ff-checkbox')).toBe(true);
    expect(form.querySelector('[type=radio]').classList.contains('ff-radio')).toBe(true);
  });

  it('does nothing if container is null', () => {
    expect(() => applyThemeToForm(null, defaultTheme)).not.toThrow();
  });
});
