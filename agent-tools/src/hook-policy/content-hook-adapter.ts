import type { z } from 'zod';

import type { ContentChange, ContentDenyInput } from './content-types.js';

/**
 * Thin vendor-adapter contract for content-policy hooks.
 *
 * An adapter owns only host wire concerns: exact input schemas,
 * normalisation to canonical changes, and host response rendering.
 * Policy meaning remains in `content-policy-core.ts`.
 *
 * @packageDocumentation
 */

/** One named, closed vendor input schema normalised to canonical changes. */
export interface ContentHookRoute {
  readonly name: string;
  readonly schema: z.ZodType<readonly ContentChange[]>;
}

/** Thin adapter from one vendor's hook contract to the shared policy core. */
export interface ContentHookAdapter {
  readonly name: 'claude' | 'copilot-cli';
  readonly routes: readonly ContentHookRoute[];
  readonly renderDeny: (deny: ContentDenyInput) => unknown;
}

/** Successfully routed hook input with its matched boundary adapter. */
export interface RoutedContentChanges {
  readonly adapter: ContentHookAdapter;
  readonly changes: readonly ContentChange[];
}
