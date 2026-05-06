/**
 * Integration test: formConditions + formState
 * Verifies that conditions re-evaluate correctly when state changes.
 */
import { createFormState } from './formState.js';
import { applyConditions } from './formConditions.js';

function buildForm() {
  document.body.innerHTML = `
    <form>
      <div data-field><select name="plan"><option value="free">Free</option><option value="pro">Pro</option></select></div>
      <div data-field><input name="billingInfo" /></div>
    </form>`;
  return document.querySelector('form');
}

const conditionMap = {
  billingInfo: [
    {
      conditions: [{ field: 'plan', operator: 'eq', value: 'pro' }],
      logic: 'and',
      effect: 'show',
    },
  ],
};

test('billingInfo hidden on free plan, visible on pro', () => {
  const form = buildForm();
  const state = createFormState({ plan: 'free', billingInfo: '' });

  // Initial render
  applyConditions(form, conditionMap, state.getState().values);
  const wrapper = form.querySelector('[name="billingInfo"]').closest('[data-field]');
  expect(wrapper.style.display).toBe('none');

  // Simulate plan change
  state.setValue('plan', 'pro');
  applyConditions(form, conditionMap, state.getState().values);
  expect(wrapper.style.display).toBe('');
});

test('re-hiding works when switching back to free', () => {
  const form = buildForm();
  const state = createFormState({ plan: 'pro', billingInfo: 'card-123' });

  applyConditions(form, conditionMap, state.getState().values);
  const wrapper = form.querySelector('[name="billingInfo"]').closest('[data-field]');
  expect(wrapper.style.display).toBe('');

  state.setValue('plan', 'free');
  applyConditions(form, conditionMap, state.getState().values);
  expect(wrapper.style.display).toBe('none');
});
