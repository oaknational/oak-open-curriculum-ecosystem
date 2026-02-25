/**
 * Type definitions for the explore-topic compound tool.
 *
 * The explore tool searches lessons, units, AND threads in parallel
 * for a topic, returning a unified topic map. It's the "I don't know
 * what I'm looking for yet" tool.
 */

import type { KeyStage, Subject } from '@oaknational/sdk-codegen/api-schema';

/**
 * Validated arguments for the explore-topic tool.
 *
 * Requires a search text. Optional subject and keyStage narrow all
 * three parallel searches (lessons, units, threads).
 */
export interface ExploreArgs {
  /** The topic to explore across the curriculum (required, non-empty). */
  readonly text: string;

  /** Filter by subject slug across all scopes. */
  readonly subject?: Subject;

  /** Filter by key stage across all scopes. */
  readonly keyStage?: KeyStage;
}
