/**
 * @typedef {Object} LayoutSection
 * @property {string} name - Unique section identifier
 * @property {string} [label] - Human-readable section label (used as <legend>)
 * @property {string[]} fields - Ordered list of field names in this section
 * @property {number} [columns=1] - Number of grid columns for this section
 */

/**
 * @typedef {Object} FormLayout
 * @property {LayoutSection[]} sections - Ordered list of layout sections
 */

/**
 * @typedef {Object} LayoutOptions
 * @property {boolean} [preserveOrder=true] - Maintain field order within sections
 * @property {boolean} [wrapOrphans=true] - Wrap fields not assigned to any section
 */
