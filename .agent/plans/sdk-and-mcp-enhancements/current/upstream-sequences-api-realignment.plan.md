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
    content: "DONE 2026-06-03 (Moonlit Waxing Nebula). Grounded via start-right-thorough; full OpenAPI diff derived by direct JSON diff of the cached schema vs a fresh fetch BEFORE regeneration (plan-mode evidence pass), then regenerated ONLINE from clean HEAD (forced turbo run — the healed cache replays old-schema outputs on unforced runs). Upstream change verified exactly as described; additionally /subjects collapsed to a 17-slug string enum (AllSubjectsResponseSchema). No hand-authored shapes, no casts, no widening anywhere in the realignment."
    status: completed
    depends_on: []
  - id: decide-delete-vs-adapt
    content: "ANSWERED 2026-06-03 (Moonlit Waxing Nebula) — verdict delivered with evidence and the adaptation route owner-approved via the session plan. See §Verdict below. (A) Full OpenAPI diff source-side enumerated: one path removed, one added, /subjects response collapsed, two schemas changed, all 25 other paths unchanged — including /sequences/{sequence}/units. (B) Bulk data UNCHANGED upstream: fresh authenticated fetch, schema.json byte-identical to the 2026-05-21 download; feature-request fields declared in schema but populated in ZERO units. (C) Verdict: NO — indexes cannot yet be built purely from bulk; tiers/exam_subjects/unit_topics come only from getSequenceUnits (which survives). Cure: delete getSubjectSequences, rewire enumeration to /subjects/{subject} sequenceSlugs, keep getSequenceUnits as the single remaining legacy supplementation endpoint."
    status: completed
    depends_on: [ground-and-regenerate]
  - id: execute-cure
    content: "DONE 2026-06-03 (Moonlit Waxing Nebula), owner-approved route executed: deleted getSubjectSequences (method, GetSubjectSequencesFn, OakClient member, factory wiring, removed-behaviour tests, the dead string-branch resolver, the dead endsWith-sequence classification branches in SDK response-augmentation) and rewired enumeration to getSubjectDetail (/subjects/{subject}) consuming sequenceSlugs — SubjectSequenceEntry now derives as SubjectDetail['sequenceSlugs'][number]. The four mechanical fixes re-applied. Sandbox fixture moved to subject-detail.json; evaluation api-checkers rewired off both changed endpoints. Reviewer pass (code-expert + type-expert, findings critically validated): dead SDK trio (subjectSequencesSchema/SearchSubjectSequences/isSubjectSequences) deleted, ingestion-harness doc fixed, SubjectSequenceInfo bound via Pick, fixture not_found behaviour tested. All gates green incl. online `pnpm check` (the recorded known-red is closed); tests 729 SDK + 1005 search-cli. Named follow-up surfaced to owner (pre-existing, not introduced here): SequenceUnitsFetcher returns Promise<unknown>, erasing the proven SequenceUnitsResponse type through the ks4-context/sequence-facet traversal — candidate for a typed-rethreading work item."
    status: completed
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

## Verdict (2026-06-03, Moonlit Waxing Nebula — evidence-complete, owner-approved route)

Owner clarifications folded in: search SHOULD be solely bulk-driven (target
architecture); bulk structure ≠ API structure; full change information on
BOTH surfaces precedes adaptation design.

1. **Full API diff** (direct JSON diff, old cached schema vs fresh fetch,
   every path + schema): REMOVED `/subjects/{subject}/sequences`; ADDED
   `/sequences/{slug}` (`SubjectSequenceResponseSchema` array → single
   object with `ks4ProgrammeFactors` — a per-factor inventory of VALID
   VALUES, not per-unit assignments); CHANGED `/subjects`
   (`AllSubjectsResponseSchema` collapsed to a 17-slug string enum). All
   25 other paths unchanged, including `/sequences/{sequence}/units`
   (`getSequenceUnits` — the critical supplementation source) and
   `/subjects/{subject}` (`SubjectResponseSchema.sequenceSlugs` carries
   the per-board enumeration, e.g. `science-secondary-aqa/edexcel/ocr`).
2. **Bulk data unchanged**: fresh authenticated bulk fetch — `schema.json`
   byte-identical to the local 2026-05-21 download; `tier`/`examSubjects`/
   `examBoard`/`pathway`/`categories`/`unitOptionGroup`/`canonicalUrl`
   declared optional in the bulk schema but populated in ZERO units (old
   and fresh). Schema presence ≠ population: the feature request's
   Phase 1–2 improvements have NOT landed upstream.
3. **Bulk-only verdict: NO, not yet.** Consumer-side census: `tiers`
   (maths KS4), `exam_subjects` (science KS4), `unit_topics` (categories)
   are sourced only from `getSequenceUnits`, which survives. Everything
   else is bulk-carried. The cure shrinks the API surface 2 → 1:
   DELETE `getSubjectSequences` (enumeration), rewire enumeration to
   `subjectDetail.sequenceSlugs` (schema-carried; slug construction from
   bulk `ks4Options` would be a hand-maintained parallel shape —
   forbidden), KEEP `getSequenceUnits`. Bulk-only completion stays
   blocked on the upstream feature request.

Additional in-scope surface found beyond the known red files: SDK
response-augmentation path-classification + tests reference the removed
path; search-cli sandbox fixtures (`sandbox-fixture.ts`,
`sandbox-fixture-data.ts`, `fixtures/sandbox/subject-sequences.json`)
parse the old array shape; `evaluation/validation/lib/api-checkers.ts`
raw-fetches the removed path.

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
