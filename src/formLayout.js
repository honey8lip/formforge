/**
 * formLayout.js
 * Utilities for grouping and arranging form fields into layout sections.
 */

/**
 * Creates a layout definition with named sections.
 * @param {Array<{ name: string, label?: string, fields: string[], columns?: number }>} sections
 * @returns {FormLayout}
 */
export function createLayout(sections = []) {
  return {
    sections: sections.map((s) => ({
      name: s.name,
      label: s.label ?? s.name,
      fields: s.fields ?? [],
      columns: s.columns ?? 1,
    })),
  };
}

/**
 * Applies a layout to a rendered form element, wrapping fields in section containers.
 * @param {HTMLElement} formEl
 * @param {FormLayout} layout
 * @returns {HTMLElement} the mutated form element
 */
export function applyLayoutToForm(formEl, layout) {
  if (!formEl || !layout || !Array.isArray(layout.sections)) return formEl;

  const fieldMap = new Map();
  formEl.querySelectorAll('[data-field]').forEach((el) => {
    fieldMap.set(el.dataset.field, el);
  });

  // Clear form children
  while (formEl.firstChild) formEl.removeChild(formEl.firstChild);

  for (const section of layout.sections) {
    const sectionEl = document.createElement('fieldset');
    sectionEl.classList.add('ff-section');
    sectionEl.dataset.section = section.name;

    if (section.label) {
      const legend = document.createElement('legend');
      legend.textContent = section.label;
      sectionEl.appendChild(legend);
    }

    const grid = document.createElement('div');
    grid.classList.add('ff-section-grid');
    grid.style.gridTemplateColumns = `repeat(${section.columns}, 1fr)`;

    for (const fieldName of section.fields) {
      const fieldEl = fieldMap.get(fieldName);
      if (fieldEl) {
        grid.appendChild(fieldEl);
        fieldMap.delete(fieldName);
      }
    }

    sectionEl.appendChild(grid);
    formEl.appendChild(sectionEl);
  }

  // Append any unmapped fields at the end
  fieldMap.forEach((el) => formEl.appendChild(el));

  return formEl;
}

/**
 * Returns the section name a given field belongs to, or null.
 * @param {FormLayout} layout
 * @param {string} fieldName
 * @returns {string|null}
 */
export function getSectionForField(layout, fieldName) {
  if (!layout || !Array.isArray(layout.sections)) return null;
  const section = layout.sections.find((s) => s.fields.includes(fieldName));
  return section ? section.name : null;
}
