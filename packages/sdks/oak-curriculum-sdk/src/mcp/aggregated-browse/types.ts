/**
 * Type definitions for the browse-curriculum tool.
 *
 * The browse tool provides structured navigation of the curriculum
 * without a search query. It returns facet data showing what subjects,
 * key stages, and units are available, backed by `fetchSequenceFacets()`.
 */

import type { KeyStage, Subject } from '@oaknational/curriculum-sdk-generation/api-schema';

/**
 * Validated arguments for the browse-curriculum tool.
 *
 * Both fields are optional. With no filters, returns all available
 * subjects and key stages. With filters, narrows the faceted view.
 */
export interface BrowseArgs {
  /** Filter by subject slug to see what's available in that subject. */
  readonly subject?: Subject;

  /** Filter by key stage to see what's available at that level. */
  readonly keyStage?: KeyStage;
}
