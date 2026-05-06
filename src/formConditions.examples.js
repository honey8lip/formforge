/**
 * formConditions.examples.js
 * Example condition maps for common use-cases.
 */

/**
 * Show a "company name" field only when the user selects "business" account type.
 * @type {import('./formConditions.types').FieldConditionMap}
 */
export const accountTypeConditions = {
  companyName: [
    {
      conditions: [{ field: 'accountType', operator: 'eq', value: 'business' }],
      logic: 'and',
      effect: 'show',
    },
  ],
};

/**
 * Disable the submit button until both terms and privacy are accepted.
 * @type {import('./formConditions.types').FieldConditionMap}
 */
export const consentConditions = {
  submit: [
    {
      conditions: [
        { field: 'acceptTerms', operator: 'eq', value: true },
        { field: 'acceptPrivacy', operator: 'eq', value: true },
      ],
      logic: 'and',
      effect: 'enable',
    },
  ],
};

/**
 * Hide the "other reason" textarea unless user picks "other" from a dropdown.
 * @type {import('./formConditions.types').FieldConditionMap}
 */
export const contactReasonConditions = {
  otherReason: [
    {
      conditions: [{ field: 'contactReason', operator: 'eq', value: 'other' }],
      logic: 'and',
      effect: 'show',
    },
  ],
};
