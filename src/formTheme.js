/**
 * formTheme.js
 * Applies CSS class themes to rendered form elements based on a theme config.
 */

/** @type {Record<string, Record<string, string>>} */
const defaultTheme = {
  form: 'ff-form',
  field: 'ff-field',
  label: 'ff-label',
  input: 'ff-input',
  select: 'ff-select',
  textarea: 'ff-textarea',
  checkbox: 'ff-checkbox',
  radio: 'ff-radio',
  error: 'ff-error',
  description: 'ff-description',
  required: 'ff-required',
};

/**
 * Merges a partial theme with the default theme.
 * @param {Partial<typeof defaultTheme>} overrides
 * @returns {typeof defaultTheme}
 */
export function createTheme(overrides = {}) {
  return { ...defaultTheme, ...overrides };
}

/**
 * Applies theme classes to a single form element by its role.
 * @param {HTMLElement} element
 * @param {string} role - Key from the theme map (e.g. 'input', 'label')
 * @param {typeof defaultTheme} theme
 */
export function applyThemeToElement(element, role, theme) {
  if (!element || !role || !theme) return;
  const cls = theme[role];
  if (cls) {
    cls.split(' ').filter(Boolean).forEach((c) => element.classList.add(c));
  }
}

/**
 * Applies theme classes to all recognized elements within a form container.
 * @param {HTMLElement} container
 * @param {typeof defaultTheme} theme
 */
export function applyThemeToForm(container, theme) {
  if (!container || !theme) return;

  const roleSelectors = [
    { role: 'field', selector: '[data-ff-field]' },
    { role: 'label', selector: 'label' },
    { role: 'input', selector: 'input:not([type=checkbox]):not([type=radio])' },
    { role: 'select', selector: 'select' },
    { role: 'textarea', selector: 'textarea' },
    { role: 'checkbox', selector: 'input[type=checkbox]' },
    { role: 'radio', selector: 'input[type=radio]' },
    { role: 'error', selector: '[data-ff-error]' },
    { role: 'description', selector: '[data-ff-description]' },
  ];

  roleSelectors.forEach(({ role, selector }) => {
    container.querySelectorAll(selector).forEach((el) => {
      applyThemeToElement(el, role, theme);
    });
  });

  if (container.tagName === 'FORM') {
    applyThemeToElement(container, 'form', theme);
  }
}

export { defaultTheme };
