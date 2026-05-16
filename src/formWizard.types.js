/**
 * @typedef {Object} WizardStep
 * @property {string} id - Unique step identifier
 * @property {string} label - Human-readable step label
 * @property {import('./schemaParser.types').FieldSchema[]} fields - Fields for this step
 * @property {boolean} [optional] - Whether the step can be skipped
 */

/**
 * @typedef {Object} WizardConfig
 * @property {WizardStep[]} steps
 * @property {function({ from: number, to: number, step: WizardStep }): void} [onStepChange]
 * @property {function({ steps: WizardStep[] }): void} [onComplete]
 */

/**
 * @typedef {Object} WizardProgress
 * @property {number} current - 1-based current step number
 * @property {number} total - Total number of steps
 * @property {number} percent - Completion percentage (0-100)
 */

/**
 * @typedef {Object} WizardInstance
 * @property {function(): WizardStep} getCurrentStep
 * @property {function(): number} getStepCount
 * @property {function(): WizardProgress} getProgress
 * @property {function(): boolean} canGoNext
 * @property {function(): boolean} canGoPrev
 * @property {function(number): void} goTo
 * @property {function(function=): boolean} next
 * @property {function(): boolean} prev
 * @property {function(function=): boolean} complete
 * @property {function(): void} reset
 * @property {function(string): WizardStep|undefined} getStepById - Find a step by its id
 */
