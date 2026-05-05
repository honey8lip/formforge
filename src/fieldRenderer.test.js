import { renderField, renderForm } from './fieldRenderer.js';

describe('renderField', () => {
  test('renders a text input with label', () => {
    const html = renderField({ name: 'username', type: 'text', label: 'Username' });
    expect(html).toContain('<label for="username">');
    expect(html).toContain('type="text"');
    expect(html).toContain('id="username"');
  });

  test('marks required fields with aria-required', () => {
    const html = renderField({ name: 'email', type: 'email', label: 'Email', required: true });
    expect(html).toContain('aria-required="true"');
    expect(html).toContain('required');
    expect(html).toContain('<span aria-hidden="true">*</span>');
  });

  test('renders a textarea', () => {
    const html = renderField({ name: 'bio', type: 'textarea', label: 'Bio' });
    expect(html).toContain('<textarea');
    expect(html).toContain('name="bio"');
    expect(html).not.toContain('<input');
  });

  test('renders a select with options', () => {
    const html = renderField({
      name: 'color',
      type: 'select',
      label: 'Favorite Color',
      options: [
        { value: 'red', label: 'Red' },
        { value: 'blue', label: 'Blue' },
      ],
    });
    expect(html).toContain('<select');
    expect(html).toContain('<option value="red">Red</option>');
    expect(html).toContain('<option value="blue">Blue</option>');
    expect(html).toContain('-- Select --');
  });

  test('renders a select with a pre-selected value', () => {
    const html = renderField({
      name: 'color',
      type: 'select',
      label: 'Color',
      value: 'blue',
      options: [
        { value: 'red', label: 'Red' },
        { value: 'blue', label: 'Blue' },
      ],
    });
    expect(html).toContain('<option value="blue" selected>');
  });

  test('renders a checkbox', () => {
    const html = renderField({ name: 'agree', type: 'checkbox', label: 'I agree', value: true });
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('checked');
  });

  test('renders placeholder when provided', () => {
    const html = renderField({ name: 'search', type: 'text', label: 'Search', placeholder: 'Type here...' });
    expect(html).toContain('placeholder="Type here..."');
  });
});

describe('renderForm', () => {
  const fields = [
    { name: 'first_name', type: 'text', label: 'First Name' },
    { name: 'last_name', type: 'text', label: 'Last Name' },
  ];

  test('wraps fields in a form element', () => {
    const html = renderForm(fields);
    expect(html).toContain('<form');
    expect(html).toContain('</form>');
    expect(html).toContain('name="first_name"');
    expect(html).toContain('name="last_name"');
  });

  test('uses default form options', () => {
    const html = renderForm(fields);
    expect(html).toContain('action="#"');
    expect(html).toContain('method="post"');
    expect(html).toContain('id="ff-form"');
  });

  test('accepts custom form options', () => {
    const html = renderForm(fields, { action: '/submit', method: 'get', id: 'my-form' });
    expect(html).toContain('action="/submit"');
    expect(html).toContain('method="get"');
    expect(html).toContain('id="my-form"');
  });

  test('includes a submit button', () => {
    const html = renderForm(fields);
    expect(html).toContain('<button type="submit">Submit</button>');
  });
});
