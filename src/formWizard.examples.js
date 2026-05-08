/**
 * formWizard.examples.js
 * Example wizard configurations for documentation and manual testing.
 */

import { createWizard } from './formWizard.js';

export const registrationWizardConfig = {
  steps: [
    {
      id: 'personal',
      label: 'Personal Info',
      fields: [
        { name: 'firstName', type: 'text', label: 'First Name', required: true },
        { name: 'lastName', type: 'text', label: 'Last Name', required: true },
      ],
    },
    {
      id: 'contact',
      label: 'Contact Details',
      fields: [
        { name: 'email', type: 'email', label: 'Email', required: true },
        { name: 'phone', type: 'tel', label: 'Phone' },
      ],
    },
    {
      id: 'review',
      label: 'Review & Submit',
      fields: [],
    },
  ],
  onStepChange({ from, to, step }) {
    console.log(`Moved from step ${from} to step ${to}: ${step.label}`);
  },
  onComplete({ steps }) {
    console.log('Wizard completed with steps:', steps.map((s) => s.id));
  },
};

/**
 * Creates a ready-to-use registration wizard instance.
 * @returns {import('./formWizard.types').WizardInstance}
 */
export function createRegistrationWizard() {
  return createWizard(registrationWizardConfig);
}
