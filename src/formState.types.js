/**
 * @typedef {Object} FormState
 * @property {Record<string, any>} values - Current field values
 * @property {Set<string>} touched - Set of field names that have been interacted with
 * @property {boolean} isDirty - Whether any value differs from the initial snapshot
 * @property {string[]} dirtyFields - Names of fields whose values have changed
 */

/**
 * @typedef {Object} FormStateManager
 * @property {(name: string) => any} getValue - Get the current value for a field
 * @property {() => FormState} getState - Get a snapshot of the full form state
 * @property {(name: string, value: any) => void} setValue - Set a single field value
 * @property {(values: Record<string, any>) => void} setValues - Batch-set multiple field values
 * @property {(name: string) => void} touchField - Mark a field as touched without changing its value
 * @property {() => boolean} isDirty - Returns true if any field differs from initial values
 * @property {() => string[]} getDirtyFields - Returns names of fields that have changed
 * @property {() => void} reset - Reset all values to initial snapshot and clear touched state
 * @property {(fn: (state: FormState) => void) => () => void} subscribe - Subscribe to state changes; returns unsubscribe function
 */

export {};
