import { createFormState } from './formState.js';

describe('createFormState', () => {
  const initial = { name: 'Alice', age: 30, email: '' };

  test('initializes with provided values', () => {
    const state = createFormState(initial);
    expect(state.getValue('name')).toBe('Alice');
    expect(state.getValue('age')).toBe(30);
  });

  test('getState returns values snapshot', () => {
    const state = createFormState(initial);
    const snap = state.getState();
    expect(snap.values).toEqual(initial);
    expect(snap.isDirty).toBe(false);
    expect(snap.dirtyFields).toHaveLength(0);
  });

  test('setValue updates value and marks field as touched', () => {
    const state = createFormState(initial);
    state.setValue('name', 'Bob');
    expect(state.getValue('name')).toBe('Bob');
    expect(state.getState().touched.has('name')).toBe(true);
  });

  test('isDirty returns true after a value changes', () => {
    const state = createFormState(initial);
    expect(state.isDirty()).toBe(false);
    state.setValue('email', 'bob@example.com');
    expect(state.isDirty()).toBe(true);
  });

  test('getDirtyFields returns only changed field names', () => {
    const state = createFormState(initial);
    state.setValue('age', 31);
    expect(state.getDirtyFields()).toEqual(['age']);
  });

  test('setValues updates multiple fields at once', () => {
    const state = createFormState(initial);
    state.setValues({ name: 'Carol', email: 'carol@example.com' });
    expect(state.getValue('name')).toBe('Carol');
    expect(state.getValue('email')).toBe('carol@example.com');
    expect(state.getDirtyFields()).toContain('name');
    expect(state.getDirtyFields()).toContain('email');
  });

  test('touchField marks field touched without changing value', () => {
    const state = createFormState(initial);
    state.touchField('age');
    const snap = state.getState();
    expect(snap.touched.has('age')).toBe(true);
    expect(snap.values.age).toBe(30);
    expect(state.isDirty()).toBe(false);
  });

  test('reset restores initial values and clears touched', () => {
    const state = createFormState(initial);
    state.setValue('name', 'Dave');
    state.reset();
    expect(state.getValue('name')).toBe('Alice');
    expect(state.getState().touched.size).toBe(0);
    expect(state.isDirty()).toBe(false);
  });

  test('subscribe fires on state change and unsubscribes cleanly', () => {
    const state = createFormState(initial);
    const spy = jest.fn();
    const unsub = state.subscribe(spy);
    state.setValue('name', 'Eve');
    expect(spy).toHaveBeenCalledTimes(1);
    unsub();
    state.setValue('name', 'Frank');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('subscribe receives current state snapshot', () => {
    const state = createFormState(initial);
    let received;
    state.subscribe((s) => { received = s; });
    state.setValue('email', 'test@test.com');
    expect(received.values.email).toBe('test@test.com');
    expect(received.isDirty).toBe(true);
  });
});
