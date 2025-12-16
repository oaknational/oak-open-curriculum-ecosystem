/**
 * Type definitions for the aggregated search tool.
 */

import type { KeyStage, Subject } from '../../types/generated/api-schema/path-parameters.js';

/**
 * Validated search arguments for the search aggregated tool.
 *
 * Uses KeyStage and Subject types from the generated path-parameters
 * to ensure type safety with the upstream API schema.
 *
 * @remarks
 * This interface represents the validated form of search input,
 * after the raw input has been parsed and normalised by validateSearchArgs.
 */
export interface SearchArgs {
  /** The search query string (required). */
  readonly q: string;
  /** Optional key stage filter (ks1, ks2, ks3, or ks4). */
  readonly keyStage?: KeyStage;
  /** Optional subject filter (e.g., "maths", "science"). */
  readonly subject?: Subject;
  /** Optional unit slug to narrow results. */
  readonly unit?: string;
}
