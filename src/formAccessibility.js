/**
 * formAccessibility.js
 * Utilities for enhancing form accessibility (ARIA attributes, roles, etc.)
 */

/**
 * Adds appropriate ARIA attributes to a form field element.
 * @param {HTMLElement} fieldEl - The input/select/textarea element
 * @param {object} field - Normalized field definition
 * @param {object} [validationResult] - Optional validation result { valid, message }
 */
export function applyAriaAttributes(fieldEl, field, validationResult) {
  if (!fieldEl || !field) return;

  if (field.required) {
    fieldEl.setAttribute('aria-required', 'true');
  }

  if (field.description) {
    const descId = `${field.name}-desc`;
    fieldEl.setAttribute('aria-describedby', descId);
  }

  if (validationResult) {
    if (!validationResult.valid) {
      fieldEl.setAttribute('aria-invalid', 'true');
      const errId = `${field.name}-error`;
      const existing = fieldEl.getAttribute('aria-describedby');
      fieldEl.setAttribute(
        'aria-describedby',
        existing ? `${existing} ${errId}` : errId
      );
    } else {
      fieldEl.removeAttribute('aria-invalid');
    }
  }
}

/**
 * Creates or updates an error message element for a field.
 * @param {HTMLElement} container - The field's container element
 * @param {string} fieldName - The field name
 * @param {string|null} errorMessage - Error text, or null to clear
 * @returns {HTMLElement|null}
 */
export function setFieldError(container, fieldName, errorMessage) {
  if (!container) return null;

  const errId = `${fieldName}-error`;
  let errEl = container.querySelector(`#${errId}`);

  if (!errorMessage) {
    if (errEl) errEl.remove();
    return null;
  }

  if (!errEl) {
    errEl = document.createElement('span');
    errEl.id = errId;
    errEl.setAttribute('role', 'alert');
    errEl.className = 'ff-field-error';
    container.appendChild(errEl);
  }

  errEl.textContent = errorMessage;
  return errEl;
}

/**
 * Applies a description hint element for a field.
 * @param {HTMLElement} container
 * @param {string} fieldName
 * @param {string} description
 * @returns {HTMLElement}
 */
export function setFieldDescription(container, fieldName, description) {
  if (!container || !description) return null;

  const descId = `${fieldName}-desc`;
  let descEl = container.querySelector(`#${descId}`);

  if (!descEl) {
    descEl = document.createElement('span');
    descEl.id = descId;
    descEl.className = 'ff-field-description';
    container.appendChild(descEl);
  }

  descEl.textContent = description;
  return descEl;
}
