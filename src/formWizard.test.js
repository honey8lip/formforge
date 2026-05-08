import { createWizard } from './formWizard.js';

const steps = [
  { id: 'step1', label: 'Step 1', fields: [{ name: 'a', type: 'text' }] },
  { id: 'step2', label: 'Step 2', fields: [{ name: 'b', type: 'email' }] },
  { id: 'step3', label: 'Step 3', fields: [] },
];

function makeWizard(overrides = {}) {
  return createWizard({ steps, ...overrides });
}

describe('createWizard', () => {
  test('throws if steps is empty', () => {
    expect(() => createWizard({ steps: [] })).toThrow();
  });

  test('starts on first step', () => {
    const w = makeWizard();
    expect(w.getCurrentStep().id).toBe('step1');
  });

  test('getStepCount returns correct count', () => {
    const w = makeWizard();
    expect(w.getStepCount()).toBe(3);
  });

  test('getProgress returns 1-based progress', () => {
    const w = makeWizard();
    expect(w.getProgress()).toEqual({ current: 1, total: 3 });
  });

  test('canGoPrev is false on first step', () => {
    const w = makeWizard();
    expect(w.canGoPrev()).toBe(false);
  });

  test('canGoNext is true when not on last step', () => {
    const w = makeWizard();
    expect(w.canGoNext()).toBe(true);
  });

  test('next advances step and returns true', () => {
    const w = makeWizard();
    const result = w.next();
    expect(result).toBe(true);
    expect(w.getCurrentStep().id).toBe('step2');
  });

  test('next returns false when validation fails', () => {
    const w = makeWizard();
    const validate = () => ({ a: 'required' });
    expect(w.next(validate)).toBe(false);
    expect(w.getCurrentStep().id).toBe('step1');
  });

  test('next returns false on last step', () => {
    const w = makeWizard();
    w.goTo(2);
    expect(w.next()).toBe(false);
  });

  test('prev goes back and returns true', () => {
    const w = makeWizard();
    w.next();
    expect(w.prev()).toBe(true);
    expect(w.getCurrentStep().id).toBe('step1');
  });

  test('prev returns false on first step', () => {
    const w = makeWizard();
    expect(w.prev()).toBe(false);
  });

  test('goTo jumps to specific step', () => {
    const w = makeWizard();
    w.goTo(2);
    expect(w.getCurrentStep().id).toBe('step3');
  });

  test('goTo throws on out-of-range index', () => {
    const w = makeWizard();
    expect(() => w.goTo(5)).toThrow(RangeError);
  });

  test('onStepChange is called with correct args', () => {
    const onStepChange = jest.fn();
    const w = createWizard({ steps, onStepChange });
    w.next();
    expect(onStepChange).toHaveBeenCalledWith({ from: 0, to: 1, step: steps[1] });
  });

  test('complete calls onComplete and returns true', () => {
    const onComplete = jest.fn();
    const w = createWizard({ steps, onComplete });
    expect(w.complete()).toBe(true);
    expect(onComplete).toHaveBeenCalledWith({ steps });
  });

  test('complete returns false when validation fails', () => {
    const onComplete = jest.fn();
    const w = createWizard({ steps, onComplete });
    const validate = () => ({ b: 'required' });
    expect(w.complete(validate)).toBe(false);
    expect(onComplete).not.toHaveBeenCalled();
  });

  test('reset goes back to first step', () => {
    const w = makeWizard();
    w.goTo(2);
    w.reset();
    expect(w.getCurrentStep().id).toBe('step1');
    expect(w.getProgress().current).toBe(1);
  });
});
