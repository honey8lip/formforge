/**
 * formWizard.js
 * Multi-step form wizard — manages steps, navigation, and per-step validation.
 */

/**
 * @param {import('./formWizard.types').WizardConfig} config
 * @returns {import('./formWizard.types').WizardInstance}
 */
export function createWizard(config) {
  const { steps, onStepChange, onComplete } = config;

  if (!Array.isArray(steps) || steps.length === 0) {
    throw new Error('createWizard: steps must be a non-empty array');
  }

  let currentIndex = 0;

  function getCurrentStep() {
    return steps[currentIndex];
  }

  function getStepCount() {
    return steps.length;
  }

  function getProgress() {
    return { current: currentIndex + 1, total: steps.length };
  }

  function canGoNext() {
    return currentIndex < steps.length - 1;
  }

  function canGoPrev() {
    return currentIndex > 0;
  }

  function goTo(index) {
    if (index < 0 || index >= steps.length) {
      throw new RangeError(`goTo: index ${index} out of range`);
    }
    const prev = currentIndex;
    currentIndex = index;
    if (typeof onStepChange === 'function') {
      onStepChange({ from: prev, to: currentIndex, step: getCurrentStep() });
    }
  }

  function next(validateFn) {
    if (!canGoNext()) return false;
    if (typeof validateFn === 'function') {
      const errors = validateFn(getCurrentStep());
      if (errors && Object.keys(errors).length > 0) return false;
    }
    goTo(currentIndex + 1);
    return true;
  }

  function prev() {
    if (!canGoPrev()) return false;
    goTo(currentIndex - 1);
    return true;
  }

  function complete(validateFn) {
    if (typeof validateFn === 'function') {
      const errors = validateFn(getCurrentStep());
      if (errors && Object.keys(errors).length > 0) return false;
    }
    if (typeof onComplete === 'function') {
      onComplete({ steps });
    }
    return true;
  }

  function reset() {
    currentIndex = 0;
  }

  return { getCurrentStep, getStepCount, getProgress, canGoNext, canGoPrev, goTo, next, prev, complete, reset };
}
