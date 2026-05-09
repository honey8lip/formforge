/**
 * formMask.examples.js
 * Built-in mask definitions ready to register.
 */
import { registerMask } from './formMask.js';

/** US phone: (123) 456-7890 */
export function registerPhoneMask() {
  registerMask('phone-us', (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  });
}

/** Date: MM/DD/YYYY */
export function registerDateMask() {
  registerMask('date-us', (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  });
}

/** Credit card: 1234 5678 9012 3456 */
export function registerCreditCardMask() {
  registerMask('credit-card', (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  });
}

/** Postal/ZIP: 12345 or 12345-6789 */
export function registerZipMask() {
  registerMask('zip-us', (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 9);
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  });
}

/** Register all built-in masks at once. */
export function registerAllBuiltinMasks() {
  registerPhoneMask();
  registerDateMask();
  registerCreditCardMask();
  registerZipMask();
}
