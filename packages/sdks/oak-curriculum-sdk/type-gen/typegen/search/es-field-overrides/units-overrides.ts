/**
 * @module es-field-overrides/units-overrides
 * @description Field overrides for the oak_units index.
 */

import type { EsFieldMapping } from '../es-field-config.js';
import { UNITS_COMPLETION_CONTEXTS } from '../completion-contexts.js';
import { createCompletionContexts } from './common.js';

/**
 * Field overrides for the oak_units index.
 *
 * @see UNITS_COMPLETION_CONTEXTS - Source of truth for completion contexts
 */
export const UNITS_FIELD_OVERRIDES = {
  unit_title: {
    type: 'text',
    analyzer: 'standard',
  },
  unit_url: {
    type: 'keyword',
    ignore_above: 1024,
  },
  subject_programmes_url: {
    type: 'keyword',
    ignore_above: 1024,
  },
  thread_slugs: {
    type: 'keyword',
    normalizer: 'oak_lower',
  },
  thread_titles: {
    type: 'keyword',
    normalizer: 'oak_lower',
  },
  thread_orders: {
    type: 'integer',
  },
  title_suggest: {
    type: 'completion',
    contexts: createCompletionContexts(UNITS_COMPLETION_CONTEXTS),
  },
} as const satisfies Readonly<Record<string, EsFieldMapping>>;
