/**
 * formAnalytics.examples.js
 * Demonstrates how to integrate formAnalytics with a rendered form.
 */

import { renderForm } from './fieldRenderer.js';
import { attachToForm, getSummary, resetAnalytics } from './formAnalytics.js';

/**
 * Creates a demo form, attaches analytics, and logs a summary on submit.
 * @returns {{ formEl: HTMLFormElement, printSummary: () => void }}
 */
export function createAnalyticsDemo() {
  const schema = [
    { name: 'username', type: 'text', label: 'Username', required: true },
    { name: 'email', type: 'email', label: 'Email', required: true },
    { name: 'age', type: 'number', label: 'Age' },
  ];

  const formEl = renderForm(schema, { id: 'demo-form' });

  attachToForm(formEl);

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const summary = getSummary();
    console.log('[formAnalytics] Session duration (ms):', summary.sessionDuration);
    console.log('[formAnalytics] Field focus counts:', summary.fieldFocusCount);
    console.log('[formAnalytics] Field change counts:', summary.fieldChangeCount);
    console.log('[formAnalytics] Total events:', summary.totalEvents);
  });

  return {
    formEl,
    printSummary() {
      console.table(getSummary().events);
    },
  };
}

/**
 * Example: reset analytics between wizard steps.
 * @param {import('./formWizard.types').Wizard} wizard
 */
export function trackWizardStep(wizard) {
  resetAnalytics();
  const step = wizard.getCurrentStep();
  console.log(`[formAnalytics] Starting tracking for step: ${step.title}`);
}
