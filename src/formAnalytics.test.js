import {
  resetAnalytics,
  startSession,
  trackFocus,
  trackChange,
  trackSubmit,
  getSummary,
  attachToForm,
} from './formAnalytics.js';

beforeEach(() => {
  resetAnalytics();
});

describe('startSession', () => {
  test('adds a session_start event', () => {
    startSession();
    const { events } = getSummary();
    expect(events[0].type).toBe('session_start');
  });

  test('sessionDuration grows after start', async () => {
    startSession();
    await new Promise((r) => setTimeout(r, 20));
    expect(getSummary().sessionDuration).toBeGreaterThan(0);
  });
});

describe('trackFocus', () => {
  test('increments fieldFocusCount', () => {
    trackFocus('email');
    trackFocus('email');
    expect(getSummary().fieldFocusCount['email']).toBe(2);
  });

  test('records event with correct type and field', () => {
    trackFocus('name');
    const ev = getSummary().events.find((e) => e.type === 'focus');
    expect(ev).toBeDefined();
    expect(ev.field).toBe('name');
  });
});

describe('trackChange', () => {
  test('increments fieldChangeCount', () => {
    trackChange('country');
    expect(getSummary().fieldChangeCount['country']).toBe(1);
  });

  test('multiple fields tracked independently', () => {
    trackChange('a');
    trackChange('b');
    trackChange('a');
    const { fieldChangeCount } = getSummary();
    expect(fieldChangeCount['a']).toBe(2);
    expect(fieldChangeCount['b']).toBe(1);
  });
});

describe('trackSubmit', () => {
  test('records submit event with result meta', () => {
    trackSubmit('success');
    const ev = getSummary().events.find((e) => e.type === 'submit');
    expect(ev.meta.result).toBe('success');
  });
});

describe('getSummary', () => {
  test('totalEvents reflects all tracked events', () => {
    startSession();
    trackFocus('x');
    trackChange('x');
    expect(getSummary().totalEvents).toBe(3);
  });

  test('returns copies not references', () => {
    trackFocus('f');
    const s1 = getSummary();
    trackFocus('f');
    expect(s1.fieldFocusCount['f']).toBe(1);
  });
});

describe('attachToForm', () => {
  test('starts session on attach', () => {
    const form = document.createElement('form');
    attachToForm(form);
    const { events } = getSummary();
    expect(events[0].type).toBe('session_start');
  });

  test('tracks focusin events from named inputs', () => {
    const form = document.createElement('form');
    const input = document.createElement('input');
    input.name = 'username';
    form.appendChild(input);
    attachToForm(form);
    input.dispatchEvent(new Event('focusin', { bubbles: true }));
    expect(getSummary().fieldFocusCount['username']).toBe(1);
  });

  test('tracks change events from named inputs', () => {
    const form = document.createElement('form');
    const input = document.createElement('input');
    input.name = 'age';
    form.appendChild(input);
    attachToForm(form);
    input.dispatchEvent(new Event('change', { bubbles: true }));
    expect(getSummary().fieldChangeCount['age']).toBe(1);
  });
});
