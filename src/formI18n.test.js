import {
  registerLocale,
  setLocale,
  getLocale,
  t,
  localizeField,
  resetI18n,
} from './formI18n.js';

beforeEach(() => {
  resetI18n();
  registerLocale('en', {
    'field.name.label': 'Full Name',
    'field.name.placeholder': 'Enter your name',
    'validation.required': 'This field is required',
    'greeting': 'Hello, {{name}}!',
  });
});

describe('registerLocale', () => {
  it('registers a new locale', () => {
    registerLocale('fr', { 'field.name.label': 'Nom complet' });
    setLocale('fr');
    expect(t('field.name.label')).toBe('Nom complet');
  });

  it('merges messages into existing locale', () => {
    registerLocale('en', { 'extra.key': 'Extra' });
    expect(t('extra.key')).toBe('Extra');
    expect(t('field.name.label')).toBe('Full Name');
  });

  it('throws if locale or messages are invalid', () => {
    expect(() => registerLocale('', {})).toThrow();
    expect(() => registerLocale('en', null)).toThrow();
  });
});

describe('setLocale / getLocale', () => {
  it('sets and gets the current locale', () => {
    registerLocale('de', { hello: 'Hallo' });
    setLocale('de');
    expect(getLocale()).toBe('de');
  });

  it('throws when setting an unregistered locale', () => {
    expect(() => setLocale('es')).toThrow('Locale "es" has not been registered');
  });
});

describe('t()', () => {
  it('translates a known key', () => {
    expect(t('field.name.label')).toBe('Full Name');
  });

  it('falls back to the key when translation is missing', () => {
    expect(t('unknown.key')).toBe('unknown.key');
  });

  it('interpolates variables into the message', () => {
    expect(t('greeting', { name: 'Alice' })).toBe('Hello, Alice!');
  });

  it('leaves unused placeholders intact', () => {
    expect(t('greeting')).toBe('Hello, {{name}}!');
  });
});

describe('localizeField()', () => {
  it('translates label, placeholder, and description', () => {
    registerLocale('en', { 'field.desc': 'Your full name' });
    const field = {
      name: 'fullName',
      type: 'text',
      label: 'field.name.label',
      placeholder: 'field.name.placeholder',
      description: 'field.desc',
      required: true,
    };
    const localized = localizeField(field);
    expect(localized.label).toBe('Full Name');
    expect(localized.placeholder).toBe('Enter your name');
    expect(localized.description).toBe('Your full name');
  });

  it('leaves fields without translation keys unchanged', () => {
    const field = { name: 'age', type: 'number', label: null, placeholder: null, description: null };
    const localized = localizeField(field);
    expect(localized.label).toBeNull();
  });
});
