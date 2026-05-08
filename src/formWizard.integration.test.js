/**
 * Integration test: wizard + validator working together.
 */
import { createWizard } from './formWizard.js';
import { validateForm } from './validator.js';

const steps = [
  {
    id: 'info',
    label: 'Info',
    fields: [
      { name: 'username', type: 'text', label: 'Username', required: true, minLength: 3 },
    ],
  },
  {
    id: 'done',
    label: 'Done',
    fields: [],
  },
];

function validateStep(step, values) {
  return validateForm(step.fields, values);
}

describe('formWizard + validator integration', () => {
  test('blocks next when required field is empty', () => {
    const w = createWizard({ steps });
    const result = w.next((step) => validateStep(step, { username: '' }));
    expect(result).toBe(false);
    expect(w.getCurrentStep().id).toBe('info');
  });

  test('blocks next when field is too short', () => {
    const w = createWizard({ steps });
    const result = w.next((step) => validateStep(step, { username: 'ab' }));
    expect(result).toBe(false);
  });

  test('advances when validation passes', () => {
    const w = createWizard({ steps });
    const result = w.next((step) => validateStep(step, { username: 'alice' }));
    expect(result).toBe(true);
    expect(w.getCurrentStep().id).toBe('done');
  });

  test('full wizard flow: advance then complete', () => {
    const onComplete = jest.fn();
    const w = createWizard({ steps, onComplete });
    w.next((step) => validateStep(step, { username: 'alice' }));
    const done = w.complete();
    expect(done).toBe(true);
    expect(onComplete).toHaveBeenCalled();
  });
});
