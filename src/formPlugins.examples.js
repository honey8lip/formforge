/**
 * formPlugins.examples.js
 * Example built-in plugins shipped with FormForge.
 */

/**
 * CharCountPlugin — appends a live character counter below text inputs.
 * @type {import('./formPlugins.types').FormPlugin}
 */
export const CharCountPlugin = {
  description: 'Shows a live character count beneath text fields that have maxlength set.',
  install(context) {
    const { formEl } = context;
    const inputs = formEl.querySelectorAll('input[type="text"][maxlength], textarea[maxlength]');

    inputs.forEach((input) => {
      const max = parseInt(input.getAttribute('maxlength'), 10);
      const counter = document.createElement('span');
      counter.className = 'ff-char-count';
      counter.setAttribute('aria-live', 'polite');

      const update = () => {
        const remaining = max - input.value.length;
        counter.textContent = `${remaining} character${remaining !== 1 ? 's' : ''} remaining`;
      };

      update();
      input.addEventListener('input', update);
      input.insertAdjacentElement('afterend', counter);
    });
  },
};

/**
 * AutoSavePlugin — emits a debounced 'autosave' event on every form change.
 * @param {number} [delay=1000] Debounce delay in ms.
 * @returns {import('./formPlugins.types').FormPlugin}
 */
export function createAutoSavePlugin(delay = 1000) {
  return {
    description: 'Debounced autosave emitter.',
    install(context) {
      const { formEl, events } = context;
      let timer = null;

      formEl.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          events.emit('autosave', context.state.getState());
        }, delay);
      });
    },
  };
}

/**
 * ReadOnlyPlugin — disables all form fields.
 * @type {import('./formPlugins.types').FormPlugin}
 */
export const ReadOnlyPlugin = {
  description: 'Makes every field in the form read-only.',
  install(context) {
    const { formEl } = context;
    formEl.querySelectorAll('input, select, textarea, button[type="submit"]').forEach((el) => {
      el.setAttribute('disabled', 'true');
      el.setAttribute('aria-disabled', 'true');
    });
  },
};
