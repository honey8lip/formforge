/**
 * formConditions.js
 * Evaluate and apply conditional visibility/enable rules to form fields.
 */

/**
 * Evaluate a single condition against the current form values.
 * @param {import('./formConditions.types').Condition} condition
 * @param {Record<string, any>} values
 * @returns {boolean}
 */
export function evaluateCondition(condition, values) {
  const { field, operator, value } = condition;
  const fieldValue = values[field];

  switch (operator) {
    case 'eq':  return fieldValue === value;
    case 'neq': return fieldValue !== value;
    case 'gt':  return fieldValue > value;
    case 'gte': return fieldValue >= value;
    case 'lt':  return fieldValue < value;
    case 'lte': return fieldValue <= value;
    case 'in':  return Array.isArray(value) && value.includes(fieldValue);
    case 'nin': return Array.isArray(value) && !value.includes(fieldValue);
    case 'empty':   return fieldValue === undefined || fieldValue === null || fieldValue === '';
    case 'notempty': return fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
    default:
      console.warn(`[formConditions] Unknown operator: "${operator}"`);
      return false;
  }
}

/**
 * Evaluate a rule (array of conditions joined by logic).
 * @param {import('./formConditions.types').Rule} rule
 * @param {Record<string, any>} values
 * @returns {boolean}
 */
export function evaluateRule(rule, values) {
  const { conditions, logic = 'and' } = rule;
  if (!conditions || conditions.length === 0) return true;
  if (logic === 'or') {
    return conditions.some(c => evaluateCondition(c, values));
  }
  return conditions.every(c => evaluateCondition(c, values));
}

/**
 * Apply conditional rules to a DOM form element.
 * Hides/shows or enables/disables fields based on current values.
 * @param {HTMLFormElement} formEl
 * @param {import('./formConditions.types').FieldConditionMap} conditionMap
 * @param {Record<string, any>} values
 */
export function applyConditions(formEl, conditionMap, values) {
  for (const [fieldName, rules] of Object.entries(conditionMap)) {
    const el = formEl.querySelector(`[name="${fieldName}"]`);
    if (!el) continue;
    const wrapper = el.closest('[data-field]') || el.parentElement;

    for (const rule of rules) {
      const result = evaluateRule(rule, values);
      if (rule.effect === 'show') {
        wrapper.style.display = result ? '' : 'none';
      } else if (rule.effect === 'hide') {
        wrapper.style.display = result ? 'none' : '';
      } else if (rule.effect === 'enable') {
        el.disabled = !result;
      } else if (rule.effect === 'disable') {
        el.disabled = result;
      }
    }
  }
}
