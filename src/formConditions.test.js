import { evaluateCondition, evaluateRule, applyConditions } from './formConditions.js';

// --- evaluateCondition ---

test('eq: matches equal value', () => {
  expect(evaluateCondition({ field: 'type', operator: 'eq', value: 'business' }, { type: 'business' })).toBe(true);
});

test('eq: does not match different value', () => {
  expect(evaluateCondition({ field: 'type', operator: 'eq', value: 'business' }, { type: 'personal' })).toBe(false);
});

test('neq: matches when values differ', () => {
  expect(evaluateCondition({ field: 'x', operator: 'neq', value: 1 }, { x: 2 })).toBe(true);
});

test('gt / gte / lt / lte comparisons', () => {
  expect(evaluateCondition({ field: 'n', operator: 'gt',  value: 5 }, { n: 6 })).toBe(true);
  expect(evaluateCondition({ field: 'n', operator: 'gte', value: 6 }, { n: 6 })).toBe(true);
  expect(evaluateCondition({ field: 'n', operator: 'lt',  value: 5 }, { n: 4 })).toBe(true);
  expect(evaluateCondition({ field: 'n', operator: 'lte', value: 4 }, { n: 4 })).toBe(true);
});

test('in: matches when value is in array', () => {
  expect(evaluateCondition({ field: 'color', operator: 'in', value: ['red', 'blue'] }, { color: 'red' })).toBe(true);
  expect(evaluateCondition({ field: 'color', operator: 'in', value: ['red', 'blue'] }, { color: 'green' })).toBe(false);
});

test('nin: matches when value is NOT in array', () => {
  expect(evaluateCondition({ field: 'color', operator: 'nin', value: ['red'] }, { color: 'blue' })).toBe(true);
});

test('empty / notempty operators', () => {
  expect(evaluateCondition({ field: 'v', operator: 'empty' },    { v: '' })).toBe(true);
  expect(evaluateCondition({ field: 'v', operator: 'notempty' }, { v: 'hi' })).toBe(true);
  expect(evaluateCondition({ field: 'v', operator: 'empty' },    { v: 'hi' })).toBe(false);
});

test('unknown operator returns false and warns', () => {
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  expect(evaluateCondition({ field: 'x', operator: 'unknown' }, { x: 1 })).toBe(false);
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});

// --- evaluateRule ---

test('evaluateRule: and — all conditions must pass', () => {
  const rule = {
    conditions: [
      { field: 'a', operator: 'eq', value: 1 },
      { field: 'b', operator: 'eq', value: 2 },
    ],
    logic: 'and',
    effect: 'show',
  };
  expect(evaluateRule(rule, { a: 1, b: 2 })).toBe(true);
  expect(evaluateRule(rule, { a: 1, b: 9 })).toBe(false);
});

test('evaluateRule: or — any condition passes', () => {
  const rule = {
    conditions: [
      { field: 'a', operator: 'eq', value: 1 },
      { field: 'b', operator: 'eq', value: 2 },
    ],
    logic: 'or',
    effect: 'show',
  };
  expect(evaluateRule(rule, { a: 9, b: 2 })).toBe(true);
  expect(evaluateRule(rule, { a: 9, b: 9 })).toBe(false);
});

test('evaluateRule: empty conditions returns true', () => {
  expect(evaluateRule({ conditions: [], effect: 'show' }, {})).toBe(true);
});

// --- applyConditions ---

function makeForm() {
  document.body.innerHTML = `
    <form>
      <div data-field><input name="accountType" value="personal" /></div>
      <div data-field><input name="companyName" value="" /></div>
      <div data-field><input name="submitBtn" type="submit" /></div>
    </form>`;
  return document.querySelector('form');
}

test('applyConditions: hides field when show rule is false', () => {
  const form = makeForm();
  const map = {
    companyName: [{ conditions: [{ field: 'accountType', operator: 'eq', value: 'business' }], logic: 'and', effect: 'show' }],
  };
  applyConditions(form, map, { accountType: 'personal' });
  const wrapper = form.querySelector('[name="companyName"]').closest('[data-field]');
  expect(wrapper.style.display).toBe('none');
});

test('applyConditions: shows field when show rule is true', () => {
  const form = makeForm();
  const map = {
    companyName: [{ conditions: [{ field: 'accountType', operator: 'eq', value: 'business' }], logic: 'and', effect: 'show' }],
  };
  applyConditions(form, map, { accountType: 'business' });
  const wrapper = form.querySelector('[name="companyName"]').closest('[data-field]');
  expect(wrapper.style.display).toBe('');
});

test('applyConditions: disables field when disable rule is true', () => {
  const form = makeForm();
  const map = {
    submitBtn: [{ conditions: [{ field: 'accountType', operator: 'eq', value: 'personal' }], logic: 'and', effect: 'disable' }],
  };
  applyConditions(form, map, { accountType: 'personal' });
  expect(form.querySelector('[name="submitBtn"]').disabled).toBe(true);
});
