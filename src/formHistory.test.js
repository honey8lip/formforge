import { createFormHistory } from './formHistory.js';

describe('createFormHistory', () => {
  let history;

  beforeEach(() => {
    history = createFormHistory();
  });

  test('starts with no current state', () => {
    expect(history.getCurrent()).toBeNull();
    expect(history.canUndo()).toBe(false);
    expect(history.canRedo()).toBe(false);
  });

  test('snapshot stores initial state', () => {
    history.snapshot({ name: 'Alice' });
    expect(history.getCurrent()).toEqual({ name: 'Alice' });
  });

  test('snapshot returns deep clone (immutable)', () => {
    const state = { name: 'Alice' };
    history.snapshot(state);
    state.name = 'Bob';
    expect(history.getCurrent()).toEqual({ name: 'Alice' });
  });

  test('canUndo is true after two snapshots', () => {
    history.snapshot({ a: 1 });
    history.snapshot({ a: 2 });
    expect(history.canUndo()).toBe(true);
  });

  test('undo returns previous state', () => {
    history.snapshot({ a: 1 });
    history.snapshot({ a: 2 });
    const prev = history.undo();
    expect(prev).toEqual({ a: 1 });
    expect(history.getCurrent()).toEqual({ a: 1 });
  });

  test('undo returns null when no past', () => {
    history.snapshot({ a: 1 });
    expect(history.undo()).toBeNull();
  });

  test('redo returns state after undo', () => {
    history.snapshot({ a: 1 });
    history.snapshot({ a: 2 });
    history.undo();
    const redone = history.redo();
    expect(redone).toEqual({ a: 2 });
  });

  test('redo returns null when nothing to redo', () => {
    history.snapshot({ a: 1 });
    expect(history.redo()).toBeNull();
  });

  test('new snapshot clears redo stack', () => {
    history.snapshot({ a: 1 });
    history.snapshot({ a: 2 });
    history.undo();
    history.snapshot({ a: 3 });
    expect(history.canRedo()).toBe(false);
  });

  test('respects maxSize limit', () => {
    history = createFormHistory({ maxSize: 3 });
    for (let i = 0; i < 6; i++) history.snapshot({ i });
    const { past } = history.getSize();
    expect(past).toBeLessThanOrEqual(3);
  });

  test('clear resets all state', () => {
    history.snapshot({ a: 1 });
    history.snapshot({ a: 2 });
    history.clear();
    expect(history.getCurrent()).toBeNull();
    expect(history.canUndo()).toBe(false);
    expect(history.getSize()).toEqual({ past: 0, future: 0 });
  });

  test('getSize reflects past and future counts', () => {
    history.snapshot({ a: 1 });
    history.snapshot({ a: 2 });
    history.snapshot({ a: 3 });
    history.undo();
    expect(history.getSize()).toEqual({ past: 1, future: 1 });
  });
});
