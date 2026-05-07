import { createLayout, applyLayoutToForm, getSectionForField } from './formLayout.js';

function makeForm(fields) {
  const form = document.createElement('form');
  for (const name of fields) {
    const wrapper = document.createElement('div');
    wrapper.dataset.field = name;
    const input = document.createElement('input');
    input.name = name;
    wrapper.appendChild(input);
    form.appendChild(wrapper);
  }
  return form;
}

describe('createLayout', () => {
  test('returns a layout with sections', () => {
    const layout = createLayout([
      { name: 'personal', fields: ['name', 'email'] },
      { name: 'address', fields: ['city', 'zip'], columns: 2 },
    ]);
    expect(layout.sections).toHaveLength(2);
    expect(layout.sections[0].name).toBe('personal');
    expect(layout.sections[1].columns).toBe(2);
  });

  test('defaults label to name if not provided', () => {
    const layout = createLayout([{ name: 'info', fields: [] }]);
    expect(layout.sections[0].label).toBe('info');
  });

  test('defaults columns to 1', () => {
    const layout = createLayout([{ name: 's', fields: [] }]);
    expect(layout.sections[0].columns).toBe(1);
  });

  test('returns empty sections array when called with no args', () => {
    const layout = createLayout();
    expect(layout.sections).toEqual([]);
  });
});

describe('applyLayoutToForm', () => {
  test('wraps fields in section fieldsets', () => {
    const form = makeForm(['name', 'email', 'city']);
    const layout = createLayout([
      { name: 'personal', label: 'Personal Info', fields: ['name', 'email'] },
      { name: 'address', label: 'Address', fields: ['city'] },
    ]);
    applyLayoutToForm(form, layout);
    const sections = form.querySelectorAll('.ff-section');
    expect(sections).toHaveLength(2);
    expect(sections[0].dataset.section).toBe('personal');
    expect(sections[0].querySelector('legend').textContent).toBe('Personal Info');
  });

  test('places fields inside correct sections', () => {
    const form = makeForm(['name', 'city']);
    const layout = createLayout([
      { name: 'a', fields: ['name'] },
      { name: 'b', fields: ['city'] },
    ]);
    applyLayoutToForm(form, layout);
    const sectionA = form.querySelector('[data-section="a"]');
    expect(sectionA.querySelector('[data-field="name"]')).not.toBeNull();
  });

  test('appends unmapped fields after sections', () => {
    const form = makeForm(['name', 'orphan']);
    const layout = createLayout([{ name: 'main', fields: ['name'] }]);
    applyLayoutToForm(form, layout);
    const lastChild = form.lastChild;
    expect(lastChild.dataset.field).toBe('orphan');
  });

  test('returns form unchanged if layout is null', () => {
    const form = makeForm(['name']);
    const result = applyLayoutToForm(form, null);
    expect(result).toBe(form);
  });

  test('sets grid-template-columns based on columns option', () => {
    const form = makeForm(['a', 'b']);
    const layout = createLayout([{ name: 's', fields: ['a', 'b'], columns: 3 }]);
    applyLayoutToForm(form, layout);
    const grid = form.querySelector('.ff-section-grid');
    expect(grid.style.gridTemplateColumns).toBe('repeat(3, 1fr)');
  });
});

describe('getSectionForField', () => {
  const layout = createLayout([
    { name: 'personal', fields: ['name', 'email'] },
    { name: 'address', fields: ['city'] },
  ]);

  test('returns correct section name for a field', () => {
    expect(getSectionForField(layout, 'email')).toBe('personal');
    expect(getSectionForField(layout, 'city')).toBe('address');
  });

  test('returns null for an unmapped field', () => {
    expect(getSectionForField(layout, 'unknown')).toBeNull();
  });

  test('returns null if layout is null', () => {
    expect(getSectionForField(null, 'name')).toBeNull();
  });
});
