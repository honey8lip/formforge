import { on, off, emit, clearAll, EVENTS } from './formEvents.js';

beforeEach(() => clearAll());

describe('on / emit', () => {
  test('handler is called with payload', () => {
    const handler = jest.fn();
    on(EVENTS.FIELD_CHANGE, handler);
    emit(EVENTS.FIELD_CHANGE, { name: 'email', value: 'a@b.com', previousValue: '' });
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({ name: 'email', value: 'a@b.com', previousValue: '' });
  });

  test('multiple handlers for same event all fire', () => {
    const h1 = jest.fn();
    const h2 = jest.fn();
    on(EVENTS.FORM_SUBMIT, h1);
    on(EVENTS.FORM_SUBMIT, h2);
    emit(EVENTS.FORM_SUBMIT, { values: {}, errors: {} });
    expect(h1).toHaveBeenCalledTimes(1);
    expect(h2).toHaveBeenCalledTimes(1);
  });

  test('emitting unknown event does not throw', () => {
    expect(() => emit('no:such:event', {})).not.toThrow();
  });
});

describe('off', () => {
  test('unsubscribes a specific handler', () => {
    const handler = jest.fn();
    on(EVENTS.VALIDATION_ERROR, handler);
    off(EVENTS.VALIDATION_ERROR, handler);
    emit(EVENTS.VALIDATION_ERROR, { name: 'age', errors: ['required'] });
    expect(handler).not.toHaveBeenCalled();
  });

  test('returned unsubscribe function works', () => {
    const handler = jest.fn();
    const unsub = on(EVENTS.FORM_RESET, handler);
    unsub();
    emit(EVENTS.FORM_RESET, { defaultValues: {} });
    expect(handler).not.toHaveBeenCalled();
  });

  test('off on non-existent event does not throw', () => {
    expect(() => off('ghost:event', () => {})).not.toThrow();
  });
});

describe('clearAll', () => {
  test('clears all listeners when called without argument', () => {
    const h1 = jest.fn();
    const h2 = jest.fn();
    on(EVENTS.FIELD_CHANGE, h1);
    on(EVENTS.FORM_SUBMIT, h2);
    clearAll();
    emit(EVENTS.FIELD_CHANGE, {});
    emit(EVENTS.FORM_SUBMIT, {});
    expect(h1).not.toHaveBeenCalled();
    expect(h2).not.toHaveBeenCalled();
  });

  test('clears listeners for a specific event only', () => {
    const h1 = jest.fn();
    const h2 = jest.fn();
    on(EVENTS.FIELD_CHANGE, h1);
    on(EVENTS.FORM_SUBMIT, h2);
    clearAll(EVENTS.FIELD_CHANGE);
    emit(EVENTS.FIELD_CHANGE, {});
    emit(EVENTS.FORM_SUBMIT, {});
    expect(h1).not.toHaveBeenCalled();
    expect(h2).toHaveBeenCalledTimes(1);
  });
});

describe('error resilience', () => {
  test('a throwing handler does not stop other handlers', () => {
    const bad = jest.fn(() => { throw new Error('boom'); });
    const good = jest.fn();
    on(EVENTS.VALIDATION_SUCCESS, bad);
    on(EVENTS.VALIDATION_SUCCESS, good);
    expect(() => emit(EVENTS.VALIDATION_SUCCESS, { name: 'username' })).not.toThrow();
    expect(good).toHaveBeenCalledTimes(1);
  });
});
