/**
 * English ground truth type extensions.
 *
 * Extends the base ground truth types with English-specific metadata.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery, QueryCategory } from '../types';

/**
 * English curriculum areas for ground truth organisation.
 *
 * Maps to the main strands of the English National Curriculum.
 */
export type EnglishCurriculumArea =
  | 'reading-fiction'
  | 'reading-non-fiction'
  | 'writing'
  | 'grammar-vocabulary'
  | 'spoken-language'
  | 'poetry'
  | 'shakespeare'
  | 'nineteenth-century';

/**
 * Re-export base types for convenience.
 */
export type { GroundTruthQuery, QueryCategory };
