/**
 * formState.js
 * Manages reactive form state: values, touched fields, and dirty tracking.
 */

/**
 * Creates a new form state manager.
 * @param {Record<string, any>} initialValues
 * @returns {FormStateManager}
 */
export function createFormState(initialValues = {}) {
  let values = { ...initialValues };
  const initialSnapshot = { ...initialValues };
  const touched = new Set();
  const listeners = new Set();

  function notify() {
    listeners.forEach((fn) => fn(getState()));
  }

  function getState() {
    return {
      values: { ...values },
      touched: new Set(touched),
      isDirty: isDirty(),
      dirtyFields: getDirtyFields(),
    };
  }

  function setValue(name, value) {
    values[name] = value;
    touched.add(name);
    notify();
  }

  function setValues(newValues) {
    Object.entries(newValues).forEach(([key, val]) => {
      values[key] = val;
    });
    notify();
  }

  function touchField(name) {
    touched.add(name);
    notify();
  }

  function isDirty() {
    return Object.keys(values).some(
      (key) => values[key] !== initialSnapshot[key]
    );
  }

  function getDirtyFields() {
    return Object.keys(values).filter(
      (key) => values[key] !== initialSnapshot[key]
    );
  }

  function reset() {
    values = { ...initialSnapshot };
    touched.clear();
    notify();
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  return {
    getValue: (name) => values[name],
    getState,
    setValue,
    setValues,
    touchField,
    isDirty,
    getDirtyFields,
    reset,
    subscribe,
  };
}
