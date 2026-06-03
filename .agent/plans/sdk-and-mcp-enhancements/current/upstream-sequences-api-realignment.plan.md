---
name: "Upstream Sequences API Realignment"
overview: "The upstream Oak OpenAPI schema changed: /subjects/{subject}/sequences (list sequences per subject) was REMOVED and replaced by /sequences/{slug} (fetch one sequence by slug, new richer shape incl. ks4ProgrammeFactors and pathway); the generated tool get-subjects-sequences became get-sequences. pnpm sdk-codegen regenerates cleanly, the mechanical name-reference fixes are done, but oak-search-cli's API-supplementation pipeline was built on the removed list-per-subject capability and is red (~6 files: type-check, test, lint, doc-gen). Owner-directed (2026-06-03): a dedicated specialist session handles this very carefully — adapting code to new upstream API shapes on low context easily breaks the strict rule that all types flow automatically from the API (ADR-029/030/031, the Cardinal Rule). FIRST question for that session: the search ingest's API supplementation is legacy-by-intent (the bulk-data feature request aims to eliminate ALL live API calls during ingestion) — establish whether the broken path is DELETION scope before adapting anything."
type: execution
status: current
thread: semantic-search
related_plans:
  - "../../semantic-search/current/bulk_data_for_semantic_search.feature_request.md"
  - "../../semantic-search/current/category-integration-remediation.md"
isProject: false
todos:
  - id: ground-and-regenerate
    content: "Open the specialist session with start-right grounding, then re-run `pnpm sdk-codegen` + `pnpm build` from a clean HEAD so the session works from a fresh regeneration, not an inherited working-tree diff. Verify the upstream change directly in the regenerated schema: /subjects/{subject}/sequences removed; /sequences/{slug} added (operationId getSequences-getSubjectSequence; response is ONE sequence object with ks4ProgrammeFactors/pathway); /subjects/{subject} (subject detail, SubjectResponseSchema) carries sequenceSlugs — the apparent intended enumeration replacement. Treat the schema as the sole type authority throughout (Cardinal Rule; ADR-029/030/031): no hand-authored shapes, no `as` casts, no widening to make old code compile."
    status: pending
    depends_on: []
  - id: decide-delete-vs-adapt
    content: "BEFORE adapting any search-cli code, answer the owner's standing question: the search index is supposed to be driven entirely from bulk data; the API-driven search ingest is legacy and was supposed to be removed (the removal exists as a draft feature request to the API team — bulk_data_for_semantic_search.feature_request.md, Phase 1 'Eliminate API calls during ingestion', which names api-supplementation.ts and hybrid-data-source.ts, exactly the broken files). Establish from the bulk-download schema and current ingest code whether the sequence data the broken API path supplied is now available in bulk data. If yes, the cure is DELETING the legacy API-supplementation path (replace-dont-bridge), not adapting it to the new endpoints. Adaptation is the fallback only if the bulk data demonstrably cannot supply the fields. Surface the delete-vs-adapt verdict to the owner before executing either."
    status: pending
    depends_on: [ground-and-regenerate]
  - id: execute-cure
    content: "Execute the owner-confirmed cure. Deletion route: remove the legacy sequence API-supplementation path and its tests atomically, with consumers updated in the same change (test and product code co-land). Adaptation route (fallback): rewire enumeration to subjectDetail.sequenceSlugs + per-slug /sequences/{slug} fetches, with every type flowing from the regenerated schema. Either route: type-check, lint, AND test after every edit; finish with a green `pnpm check`; update .agent/analysis/mcp-tool-mapping.md and any tool-count claims if the registered tool set changed. The three mechanical name fixes from 2026-06-03 (tool-guidance-data.ts 'get-sequences', the kebab-to-title-case fixture, the ground-truth-archive comment annotation) are already in the working tree — verify they survive or re-apply."
    status: pending
    depends_on: [decide-delete-vs-adapt]
---

# Upstream Sequences API Realignment

## Why this plan exists

Discovered 2026-06-03 by the EEF D3 closeout session (Lacustrine Swimming
Beacon) when the session-handoff `pnpm check` gate ran `sdk-codegen` and
pulled the changed upstream schema. HEAD is green only in the sense that its
own gates ran against the cached schema; see the blocking facts below.

## Codegen fetch/cache mechanics — read before anything else (verified empirically 2026-06-03)

1. **Online vs offline mode**: `codegen.ts` fetches the LIVE upstream schema
   by default; it reads `schema-cache/api-schema-original.json` instead only
   when `process.env.CI === 'true'` (the exact string — `CI=1` does NOT
   work). Locally, any uncached execution of the `sdk-codegen` turbo task
   (and `pnpm check`, which forces it) re-pulls the moved upstream schema
   and re-dirties the tree.
2. **Cache poisoning happened and was healed (owner-directed cure)**: the
   morning `pnpm check` fetched under HEAD-content input keys and cached
   NEW-schema outputs against them (both `sdk-codegen` and
   `@oaknational/sdk-codegen#build`), so even FULL-TURBO replays re-dirtied
   a restored tree. Cure that worked: restore the code files to HEAD, then
   `CI=true pnpm turbo run sdk-codegen --filter @oaknational/sdk-codegen --force`
   and `CI=true pnpm turbo run build --filter @oaknational/sdk-codegen --force`
   — regenerate from the cached schema and overwrite the poisoned entries.
   Verified: unforced replays now leave the tree clean; full
   `CI=true pnpm build` + `pnpm type-check` green.
3. **Commits are unblocked**; `pnpm check` remains a known-red (it
   deliberately runs codegen online) until this plan's realignment lands —
   run gates with `CI=true` in the interim where regeneration must not
   fetch.
4. For this session: regenerate ONLINE deliberately at todo 1 (the new
   schema is the target state), and expect the poisoned-cache pattern if
   you mix online and offline runs — heal with the forced `CI=true` runs
   above if you need to return to the old-schema state.

## Evidence (verified 2026-06-03, against the regenerated schema)

- Removed: `/subjects/{subject}/sequences` (list of sequences for a subject;
  old operationId `getSubjects-getSubjectSequences`; old tool
  `get-subjects-sequences`).
- Added: `/sequences/{slug}` — ONE sequence by slug; operationId
  `getSequences-getSubjectSequence`; tool `get-sequences`; new fields incl.
  `ks4ProgrammeFactors` (`examBoard`/`pathway`/`tier`/`childSubject`).
- `SubjectResponseSchema` (`/subjects/{subject}`) carries `sequenceSlugs` —
  the apparent enumeration replacement (slug list per subject).
- Red after regeneration + mechanical fixes:
  `@oaknational/search-cli` type-check/test/lint/doc-gen. Failing files:
  `src/adapters/sequence-methods.ts` (calls the removed path),
  `src/adapters/api-supplementation.ts`, `src/adapters/oak-adapter-types.ts`,
  `src/lib/index-batch-helpers.ts`, plus their unit/integration tests — all
  built on the removed list-per-subject response (array where the new shape
  is a single object).
- Mechanical reference fixes were made on 2026-06-03 and then REVERTED with
  the owner-authorised codegen revert (the whole code-world diff was restored
  to HEAD so the closeout docs could land on a green tree). RE-APPLY them
  after regeneration: `oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
  browsing tools list `'get-subjects-sequences'` → `'get-sequences'`;
  `oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/kebab-to-title-case.unit.test.ts`
  fixture row → `['get-sequences', 'Get Sequences']`;
  `oak-search-cli/src/lib/search-quality/ground-truth-archive/sequences/index.ts`
  methodology comment gains a history-preserving annotation (endpoint since
  moved to `/sequences/{slug}`, tool now `get-sequences`);
  `.agent/analysis/mcp-tool-mapping.md` sequences row →
  `oak-get-sequences | /sequences/{slug} | GET |
  getSequences-getSubjectSequence | path: slug`.

## The risk this plan exists to manage (owner-stated 2026-06-03)

Adapting code to new upstream API shapes — especially on low context — easily
breaks the strict rules that ALL static data structures, types, guards, and
schemas flow from the OpenAPI schema at codegen time (Cardinal Rule;
ADR-029/030/031; `pnpm sdk-codegen` + `pnpm build` must suffice to realign
the workspaces). The named stop signals apply in full: `as` casts,
`Object.keys` type erasure, hand-maintained parallel shapes, and widening
types to make legacy code compile are each the signal that the approach is
wrong. The session must be a dedicated, well-grounded specialist session,
not a tail-of-session fix.

## The delete-first hypothesis (owner-stated 2026-06-03)

The search index is intended to be driven entirely from bulk data; the
API-driven ingest supplementation is legacy whose removal exists as a draft
feature request
([`bulk_data_for_semantic_search.feature_request.md`](../../semantic-search/current/bulk_data_for_semantic_search.feature_request.md),
Phase 1: "Eliminate API calls during ingestion") that may simply not have
been implemented yet. The feature request names `api-supplementation.ts` and
`hybrid-data-source.ts` — the same files now broken. If the bulk data carries
what the removed endpoint supplied, the correct cure is deleting the legacy
path, not adapting it. Establish this FIRST.
