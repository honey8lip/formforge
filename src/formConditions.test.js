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

test('evaluateRule: defaults to and logic when logic is not specified', () => {
  const rule = {
    conditions: [
      { field: 'a', operator: 'eq', value: 1 },
      { field: 'b', operator: 'eq', value: 2 },
    ],
    effect: 'show',
  };
  // both match — should pass
  expect(evaluateRule(rule, { a: 1, b: 2 })).toBe(true);
  // one fails — should fail under and semantics
  expect(evaluateRule(rule, { a: 1, b: 9 })).toBe(false);
});

// --- applyConditions ---

