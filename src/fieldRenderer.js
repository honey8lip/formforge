import { normalizeField } from './schemaParser.js';

/**
 * Renders a single form field to an HTML string.
 * @param {import('./schemaParser.types.js').NormalizedField} field
 * @returns {string}
 */
export function renderField(field) {
  const normalized = normalizeField(field);
  const { id, name, type, label, required, placeholder, options, value } = normalized;

  const labelHtml = `<label for="${id}">${label}${required ? ' <span aria-hidden="true">*</span>' : ''}</label>`;

  let inputHtml;

  switch (type) {
    case 'textarea':
      inputHtml = `<textarea
        id="${id}"
        name="${name}"
        ${placeholder ? `placeholder="${placeholder}"` : ''}
        ${required ? 'required aria-required="true"' : ''}
      >${value ?? ''}</textarea>`;
      break;

    case 'select':
      const optionsHtml = (options ?? []).map(
        (opt) => `<option value="${opt.value}"${opt.value === value ? ' selected' : ''}>${opt.label}</option>`
      ).join('\n');
      inputHtml = `<select
        id="${id}"
        name="${name}"
        ${required ? 'required aria-required="true"' : ''}
      >
        <option value="">-- Select --</option>
        ${optionsHtml}
      </select>`;
      break;

    case 'checkbox':
      inputHtml = `<input
        type="checkbox"
        id="${id}"
        name="${name}"
        ${value ? 'checked' : ''}
        ${required ? 'required aria-required="true"' : ''}
      />`;
      break;

    default:
      inputHtml = `<input
        type="${type}"
        id="${id}"
        name="${name}"
        ${placeholder ? `placeholder="${placeholder}"` : ''}
        ${value !== undefined ? `value="${value}"` : ''}
        ${required ? 'required aria-required="true"' : ''}
      />`;
  }

  return `<div class="ff-field ff-field--${type}">
  ${labelHtml}
  ${inputHtml}
</div>`;
}

/**
 * Renders a full form from an array of normalized fields.
 * @param {import('./schemaParser.types.js').NormalizedField[]} fields
 * @param {{ action?: string, method?: string, id?: string }} [formOptions]
 * @returns {string}
 */
export function renderForm(fields, formOptions = {}) {
  const { action = '#', method = 'post', id = 'ff-form' } = formOptions;
  const fieldsHtml = fields.map(renderField).join('\n');
  return `<form id="${id}" action="${action}" method="${method}" novalidate>
${fieldsHtml}
  <button type="submit">Submit</button>
</form>`;
}
