/**
 * formSerializer.js
 * Utilities for serializing form DOM state into a plain data object,
 * and deserializing (populating) a form from a data object.
 */

/**
 * Reads current values from a <form> element and returns a plain object.
 * Handles text, number, checkbox, radio, select, and textarea inputs.
 *
 * @param {HTMLFormElement} formEl
 * @returns {Record<string, any>}
 */
export function serializeForm(formEl) {
  if (!(formEl instanceof HTMLElement) || formEl.tagName !== 'FORM') {
    throw new TypeError('serializeForm expects an HTMLFormElement');
  }

  const data = {};
  const elements = Array.from(formEl.elements);

  for (const el of elements) {
    const name = el.name;
    if (!name || el.disabled) continue;

    switch (el.type) {
      case 'checkbox':
        if (el.value && el.value !== 'on') {
          // multi-value checkbox group
          if (!Array.isArray(data[name])) data[name] = [];
          if (el.checked) data[name].push(el.value);
        } else {
          data[name] = el.checked;
        }
        break;

      case 'radio':
        if (el.checked) data[name] = el.value;
        break;

      case 'number':
      case 'range':
        data[name] = el.value === '' ? null : Number(el.value);
        break;

      case 'select-multiple': {
        const selected = Array.from(el.selectedOptions).map((o) => o.value);
        data[name] = selected;
        break;
      }

      default:
        data[name] = el.value;
    }
  }

  return data;
}

/**
 * Populates a <form> element with values from a plain data object.
 *
 * @param {HTMLFormElement} formEl
 * @param {Record<string, any>} data
 */
export function deserializeForm(formEl, data) {
  if (!(formEl instanceof HTMLElement) || formEl.tagName !== 'FORM') {
    throw new TypeError('deserializeForm expects an HTMLFormElement');
  }

  const elements = Array.from(formEl.elements);

  for (const el of elements) {
    const name = el.name;
    if (!name || !(name in data)) continue;

    const value = data[name];

    switch (el.type) {
      case 'checkbox':
        if (Array.isArray(value)) {
          el.checked = value.includes(el.value);
        } else {
          el.checked = Boolean(value);
        }
        break;

      case 'radio':
        el.checked = el.value === String(value);
        break;

      case 'select-multiple':
        for (const opt of el.options) {
          opt.selected = Array.isArray(value) && value.includes(opt.value);
        }
        break;

      default:
        el.value = value == null ? '' : String(value);
    }
  }
}
