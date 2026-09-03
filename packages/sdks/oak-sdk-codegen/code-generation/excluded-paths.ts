/**
 * Upstream paths the code generators do not consume.
 *
 * Two sets, deliberately separate so a reader can tell a permanent design decision
 * from a temporary one:
 *
 * - {@link SKIPPED_PATHS} — permanent. Honoured by the MCP tool generator only: these
 *   paths remain in the SDK schema, the generated types, and the Zod schemas, but never
 *   become MCP tools, because they are superseded by Elasticsearch search or are not
 *   transportable over MCP. Removing an entry is a design decision, not a chore.
 * - {@link DEFERRED_PATHS} — temporary. Honoured by the whole generation pipeline: the
 *   SDK schema (`api-schema-sdk.json`) and everything derived from it — types, Zod
 *   schemas, MCP tools, parameter and response maps — omit these paths. Each entry
 *   names the ticket that retires it, and carries one of two directions:
 *   capability deferred before it is built (the check-restricted family — owner-ruled
 *   deferral 2026-07-26, tracked by MCP-214 (build, blocked by MCP-152) and MCP-215
 *   (serve, blocked by MCP-214)), or an upstream-removed endpoint disabled ahead of
 *   the schema-cache refresh that erases it (the changelog pair — dead on the live
 *   API since spec 0.11.0, removal decided 2026-09-02, refresh tracked by MCP-630).
 *   Either way the entries are self-retiring: `applyDeferredPaths` throws when a
 *   configured path is absent from the document, so the refresh that removes a path
 *   from the cache forces its entry's deletion in the same change. When the last
 *   entry retires, delete this constant, `apply-deferred-paths.ts`, and their wiring,
 *   then regenerate; nothing else changes.
 *
 * Neither set touches the committed schema cache or the emitted
 * `api-schema-original.json`: both stay verbatim upstream truth, so the CI schema-drift
 * check and the upstream alignment runbook keep comparing like with like.
 */

/** A deferred upstream path and the ticket that lifts its deferral. */
export interface DeferredPathEntry {
  readonly path: string;
  readonly ticket: string;
}

/** Paths excluded from MCP tool generation — superseded by ES search or non-transportable. */
export const SKIPPED_PATHS: ReadonlySet<string> = new Set([
  '/search/lessons',
  '/search/transcripts',
  '/lessons/{lesson}/assets/{type}',
]);

/**
 * Paths omitted whole-pipeline, each with the ticket that retires its entry:
 * the check-restricted (usage-licence) family, deferred until built; and the
 * changelog pair, removed from the live API (404, spec 0.11.0 dropped both
 * paths) and disabled here ahead of the MCP-630 schema-cache refresh, which
 * erases them from the cache and thereby forces these entries' deletion.
 */
export const DEFERRED_PATHS: readonly DeferredPathEntry[] = [
  { path: '/key-stages/{keyStage}/subject/{subject}/check-restricted', ticket: 'MCP-214' },
  { path: '/lessons/check-restricted', ticket: 'MCP-214' },
  { path: '/changelog', ticket: 'MCP-630' },
  { path: '/changelog/latest', ticket: 'MCP-630' },
];
