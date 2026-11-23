/**
 * Upstream paths the code generators do not consume.
 *
 * Two sets, because they are two different classes of exclusion that act at different
 * stages of generation:
 *
 * - {@link SKIPPED_PATHS} — **not surfaced over MCP.** A decision about the MCP server.
 *   Honoured by the MCP tool generator only: these paths stay in the SDK schema, the
 *   generated types and the Zod schemas, and never become MCP tools. The SDK is a
 *   separate product from the MCP server and carries the API whole, so a decision about
 *   what the server offers belongs here and nowhere else. The reasons an entry is here
 *   are Oak's policy on content, or an endpoint that offers no value over MCP (the
 *   upstream API's own search is superseded by Elasticsearch search). Permanent:
 *   removing an entry is a design decision, not a chore.
 * - {@link DEFERRED_PATHS} — **not processed.** A statement about the pipeline's input,
 *   not about the MCP server: generating from the path today would produce an SDK that
 *   is broken or untrue. Honoured by the whole pipeline: the SDK schema
 *   (`api-schema-sdk.json`) and everything derived from it — types, Zod schemas, MCP
 *   tools, parameter and response maps — omit these paths. Two cases, each measured by
 *   moving the entries into `SKIPPED_PATHS` and regenerating from the cached schema:
 *   - the check-restricted (usage-licence) family: the generators cannot yet emit valid
 *     code for it. It holds the first request body, the first path with no `get`, and
 *     the first map-shaped response; the generated workspace then fails `type-check`.
 *     Building that capability is tracked by MCP-214 (blocked by MCP-152), serving it
 *     by MCP-215 (blocked by MCP-214), under an owner-ruled deferral of 2026-07-26.
 *   - the changelog pair: generation succeeds, and the SDK then describes two endpoints
 *     the live API no longer serves (dead since spec 0.11.0, removal decided
 *     2026-09-02). They leave when the schema-cache refresh tracked by MCP-630 erases
 *     them from the cache.
 *
 *   Temporary by construction. Each entry names the ticket that retires it, and the
 *   entries are self-retiring: `applyDeferredPaths` throws when a configured path is
 *   absent from the document, so the refresh that removes a path from the cache forces
 *   its entry's deletion in the same change. A path that becomes processable is then
 *   either served or moved to `SKIPPED_PATHS`; it never stays here as a way to keep it
 *   off the MCP server. When the last entry retires, delete this constant,
 *   `apply-deferred-paths.ts` and their wiring, then regenerate; one filter remains.
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
