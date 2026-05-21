---
name: "Upstream API v0.7.0 Workspace Alignment"
overview: "Land the v0.6.0 → v0.7.0 codegen + consumer cascade as one atomic commit. Expected maintenance per the AGENT.md Cardinal Rule, not remediation."
status: current
collection: sdk-and-mcp-enhancements
todos:
  - id: ws0-assumption-verification
    content: >
      WS0: Verify the nine named assumptions. A2 / A3 / A8 already
      verified; A4 already falsified (variant-info reconstruction
      required at 3 of 5 search-cli sites); A1 owner-blocking; A5 / A6
      / A7 / A9 unverified-but-falsifiable. Five pre-execution
      reviewers (assumptions-expert, code-expert, type-expert,
      architecture-expert-fred, architecture-expert-betty) must
      complete and owner-direction on the A4 design decision must be
      recorded before WS0 closes.
    status: pending
  - id: ws1-codegen-idempotency-check
    content: >
      WS1: VERIFIED 2026-05-21. Re-ran `pnpm sdk-codegen`; zero net
      diff. A2 is verified. Step retained in todos for traceability.
    status: completed
  - id: ws2-search-cli-cascade-fix
    content: >
      WS2 (revised): cascade fix across 7 source files + 3 JSON
      fixtures. Fix shape for 3 sites (api-supplementation.ts:81,
      index-batch-helpers.ts:102, sequence-facets.ts:120) depends on
      owner A4 decision (suffix parse / bulk-data source / drop
      feature). 4 search-cli runtime test failures must clear:
      sdk-api-methods.integration.test (1) + ingest-harness.unit (3).
      Fixture files: sandbox/subject-sequences.json + 2 fetched-data
      ks4 fixtures.
    status: pending
  - id: ws3-curriculum-sdk-test-body-update
    content: >
      WS3: Update the response-augmentation integration test body for
      `/subjects/maths` to include the now-required `ks4ProgrammeFactors`
      field. The augmentation behaviour is correct; only the test fixture
      was stale relative to the new required-field list.
    status: pending
  - id: ws4-atomic-commit-and-aggregate-gate
    content: >
      WS4: Stage the bundle by explicit pathspec (15 codegen artefacts +
      WS2 source + fixture fixes + WS3 fix + closed-claims.archive.json
      housekeeping), run `pnpm check`, commit as one atomic `chore(sdk):`
      landing. Cardinal-Rule atomic-landing invariant: schema + consumers
      move together, no intermediate broken state.
    status: pending
---

# Upstream API v0.7.0 Workspace Alignment

**Last Updated**: 2026-05-21 (revised post-gate-run by Opalescent Twinkling Supernova)
**Status**: 🟡 PLANNING — awaiting owner direction on **A4 design decision** (variant-info reconstruction strategy) + commit authorisation
**Scope**: Land the canonical schema-flow alignment for the upstream Open Curriculum API v0.6.0 → v0.7.0 bump as one atomic commit. Unblocks the three-way team session (WS2.2 / WS3.3 / Inc.1a gate-sweeper).

> **Revision note (2026-05-21 second session)**: After an independent full-gate run, the cascade surface is **larger than the original plan documented**. Test failures: 1 claimed → **5 actual** (1 curriculum-sdk + 4 search-cli). File scope: 6 source files → **7 source files + 3 JSON fixture files**. **A4 is empirically falsifiable**: 3 of 5 search-cli sites are variant-info reads, not simple "drop the property" sites — the upstream changelog directs variant info to the `sequenceSlug` suffix but bulk schemas retain the structured `{slug, title}[]`, so the design decision is owner-bound (suffix parse / bulk-data source / drop variant feature). All sections below updated to reflect actual surface; revision-diff rationale in §"Revision Audit Trail" at the end.

---

## Framing: Expected Maintenance, Not Remediation

The dirty SDK codegen tree at session-open represented an intentional upstream API version bump that had been run (`pnpm sdk-codegen`) but not yet aligned with consumer workspaces. This is the canonical schema-flow operation named in [AGENT.md §Cardinal Rule](../../../directives/AGENT.md):

> "If the upstream OpenAPI schema changes, then `pnpm sdk-codegen` followed by `pnpm build` MUST be sufficient to bring all workspaces into alignment."

The cascade is the expected second half of that workflow. It is not technical debt, not a quality regression, and not a feature change — it is the workspace half of a schema-flow operation that the codegen half has already started.

This plan documents the v0.7.0 alignment specifically. Future upstream version bumps will land their own per-version plans following the same shape; the pattern itself is what's repeating, not the file.

---

## What Changed Upstream (v0.6.0 → v0.7.0)

Authoritative source: the diff against `packages/sdks/oak-sdk-codegen/schema-cache/api-schema-original.json` between commit `84638bc9` and the dirty working tree (14 hunks).

### 1. Version pin

`0.6.0-c3184afa6b3c206b9139d74c292e351ee8fd59ae` → `0.7.0-3804b95b2b38a67f085077b82b763226a06966a2`

### 2. `subject` path parameter — `enum` constraint added

Previously a free-form string. Now restricted to exactly 17 values:

```text
art, citizenship, computing, cooking-nutrition, design-technology,
english, french, geography, german, history, maths, music,
physical-education, religious-education, rshe-pshe, science, spanish
```

Applies wherever `/subjects/{subject}` and its sub-routes are parameterised.

### 3. `ks4Options` field — removed from `sequenceSlugs[]` items

Affects three response schemas:

- `/subjects` response — `sequenceSlugs[]` items
- `/subjects/{subject}` response — `sequenceSlugs[]` items
- `/subjects/{subject}/sequences` response (`SubjectSequenceResponseSchema`)

The removed field:

```json
"ks4Options": {
  "anyOf": [
    { "type": "object",
      "properties": { "title": {"type":"string"}, "slug": {"type":"string"} },
      "required": ["title","slug"],
      "additionalProperties": false,
      "description": "The key stage 4 study pathway that this sequence represents. May be null." },
    { "type": "null" }
  ]
}
```

Property + `required` list + example values are all updated in the spec.

Per the upstream changelog: *"the variant is still encoded in the sequenceSlug suffix"* (e.g. `science-secondary-aqa`, `science-secondary-edexcel`, `science-secondary-ocr`).

### 4. `ks4ProgrammeFactors` field — added as a new required field on `/subjects/{subject}` response only

```json
"ks4ProgrammeFactors": {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "examBoard":    { "type":"array", "items": {title, slug} },
    "pathway":      { "type":"array", "items": {title, slug} },
    "tier":         { "type":"array", "items": {title, slug} },
    "childSubject": { "type":"array", "items": {title, slug},
                      "description": "...Only present for Science, which is split into child subjects at KS4." }
  }
}
```

The `required` list on the `/subjects/{subject}` response went from
`["subjectTitle","subjectSlug","sequenceSlugs","years","keyStages"]` to
`["subjectTitle","subjectSlug","sequenceSlugs","years","keyStages","ks4ProgrammeFactors"]`.

Each of `examBoard`/`pathway`/`tier`/`childSubject` is itself optional within the object.

### 5. Example payload swap

The `/subjects/{subject}` example switched from "art" to "science" to demonstrate `childSubject: [biology, chemistry, combined-science, physics]`.

### 6. Changelog field example update (mechanical)

`/changelog` and `/changelog/latest` example arrays gained the v0.7.0 entry and dropped the v0.5.0 entry. Routine.

No other paths, parameter shapes, or schema components are touched. Total spec diff: 339 lines in the original schema file; 1271 inserts / 590 deletes across the 15 generated artefacts.

---

## What Needs Doing (Workspace Cascade)

Verified by local gate runs against the working-tree state inherited from session-open.

### Cascade site 1: `@oaknational/search-cli` — 5 type errors (compile-time)

`pnpm --filter @oaknational/search-cli type-check` is RED. Output:

```text
src/adapters/api-supplementation.ts(81,21):
  error TS2339: Property 'ks4Options' does not exist on type
  '{ sequenceSlug: string; years: number[]; keyStages: ...; phaseSlug: string; phaseTitle: string; oakUrl?: string }'.

src/adapters/hybrid-data-source.integration.test.ts(194,11):
  error TS2353: Object literal may only specify known properties, and 'ks4Options' does not exist in type ...

src/lib/index-batch-helpers.ts(102,23):
  error TS2339: Property 'ks4Options' does not exist on type ...

src/lib/indexing/sequence-facets.ts(120,29):
  error TS2339: Property 'ks4Options' does not exist on type ...

src/lib/indexing/sequence-facets.unit.test.ts(91,5):
  error TS2353: Object literal may only specify known properties, and 'ks4Options' does not exist ...
```

Plus 2 `@typescript-eslint/no-unsafe-assignment` lint errors at the same call sites (cascading from the type errors).

**Site classification (revised; falsifies A4)**:

| # | Site | Shape | Action |
|---|---|---|---|
| 1a | `api-supplementation.ts:81` | **variant-info read** — populates internal `SubjectSequenceInfo.ks4Options: { slug, title } \| null` consumed by `buildKs4ContextMap` | **replace** — needs design decision (A4) |
| 1b | `hybrid-data-source.integration.test.ts:194` | test fixture literal | drop |
| 1c | `index-batch-helpers.ts:102` | **variant-info read** — same pattern as 1a, feeds `buildKs4ContextMap` | **replace** — needs design decision (A4) |
| 1d | `sequence-facets.ts:120` | **variant-info read** — `hasKs4Options: sequence.ks4Options !== null` boolean signal on the facet doc | **replace** — needs design decision (A4) |
| 1e | `sequence-facets.unit.test.ts:91` | test fixture supporting the `hasKs4Options: false` path | drop OR rewrite (depends on 1d outcome) |

The bulk-schema consumer at `src/adapters/bulk-sequence-transformer.ts` (which also uses `ks4Options`) is **NOT** affected — bulk schemas at `packages/sdks/oak-sdk-codegen/src/types/generated/bulk/bulk-schemas.ts` still carry `ks4Options` validly because the upstream change is to API responses only, not bulk-data shapes.

### Cascade site 2: `@oaknational/search-cli` — 4 runtime test failures (Zod strict-parse)

The original plan missed these. Confirmed via full `pnpm test` run.

`src/adapters/sdk-api-methods.integration.test.ts > makeGetSubjectSequences > should return Ok with subject sequences on successful response` (line 324 assertion) — fails because `createMockSubjectSequences()` at line 135 builds an inline fixture with `ks4Options: null`. The fixture is consumed via the SDK middleware which Zod-parses against `SubjectSequenceResponseSchema`; the new schema is strict-keyed and rejects `ks4Options` as `unrecognized_keys`. Inferred-type fixture → compile-time type-check did not catch this; only runtime Zod parse surfaces it.

`src/lib/indexing/ingest-harness.unit.test.ts × 3 tests` — all three failures rooted in `parseSubjectSequenceMap` at `sandbox-fixture-data.ts:214` calling `subjectSequencesSchema.parse(record[slug])` against the sandbox fixture JSON.

Failing tests:

- `ingest harness > performs ingestion when dry-run is disabled and logs summary metadata`
- `ingest harness > prepares bulk operations with per-index counts for sandbox target`
- `ingest harness > skips network calls when run in dry-run mode`

ZodError shape: `{ "code": "unrecognized_keys", "keys": ["ks4Options"], "path": [0], "message": "Unrecognized key: \"ks4Options\"" }`

### Cascade site 3: `@oaknational/curriculum-sdk` — 1 test failure

`pnpm --filter @oaknational/curriculum-sdk test` produces 1 failure of 728 tests:

```text
FAIL src/client/middleware/response-augmentation.integration.test.ts
  > createResponseAugmentationMiddleware > error containment
  > returns unaugmented response and logs warning when augmentation throws
  AssertionError: expected 0 to be greater than 0 [...response-augmentation.integration.test.ts:141:32]
```

The test body for `/subjects/maths` (line 120–130) lacks the now-required `ks4ProgrammeFactors` field. The augmentation's validation path no longer throws on this body as the test setup expected, so the `warnCalls.length > 0` assertion fails. Augmentation behaviour is correct; the test fixture is stale relative to the new required-field list.

### Cascade site 4: `@oaknational/search-cli` — 3 JSON fixture files (revised — missed by original plan)

Strict-key parsing of v0.7.0 API schemas means any sandbox / fetched-data fixture carrying `ks4Options` on a sequence shape now fails at load:

- `apps/oak-search-cli/fixtures/sandbox/subject-sequences.json` — **1** occurrence (line 9). Loaded by `sandbox-fixture-data.ts:201–217 (parseSubjectSequenceMap)`. **Root cause of cascade site 2's 3 ingest-harness failures.**
- `apps/oak-search-cli/fixtures/fetched-data/search-fixture-source-ks4-maths.json` — **2** occurrences. May or may not be parsed at test time; cleaned for consistency to prevent latent failure.
- `apps/oak-search-cli/fixtures/fetched-data/search-fixture-source-ks4-science.json` — **4** occurrences. Same rationale.

Action: remove the `ks4Options` keys from every fixture path that is parsed against the v0.7.0 API schema. **Important coherence question**: should fixture data also adopt the suffix-encoded variant convention (e.g., add `science-secondary-aqa` slugs) so that downstream variant-aware tests still exercise the variant path? Owner-bound — see A4.

### Cascade site 5: `closed-claims.archive.json` housekeeping

`.agent/state/collaboration/closed-claims.archive.json` carries a single appended record (claim `58fcf059`) — Fiery Firing Cinder's prior session-close residue from `84638bc9` that didn't make it into that commit. Trivial. Included in the bundle to avoid leaving it dangling.

### No other cascade sites

Verified by full repo gate run (Opalescent Twinkling Supernova, 2026-05-21 second session): only `search-cli` and `curriculum-sdk` workspaces show RED gates across type-check / lint / test / doc-gen. The 15 generated SDK files already in the working tree are the authoritative output of `pnpm sdk-codegen` against v0.7.0 (A2 **verified**: re-run produced zero net diff).

---

## Explicit Assumptions

Each assumption is named, classified as `verified` / `unverified-but-falsifiable` / `unverified-needs-owner-input`, and paired with the verification step or owner-question that resolves it. The plan does not proceed past WS0 until each is in a `verified` or owner-authorised state.

| # | Assumption | Status | Falsification / resolution |
|---|---|---|---|
| A1 | The v0.6.0 → v0.7.0 upstream API bump is intentional and accepted (i.e. it is not a rolled-back experiment in upstream that we should not adopt downstream). | unverified-needs-owner-input | Owner confirms upstream-team intent to ship v0.7.0. |
| A2 | The 15 generated SDK files in the working tree are the correct output of `pnpm sdk-codegen` against the v0.7.0 upstream pin (i.e. no partial-codegen state). | **verified** (2026-05-21) | Re-run of `pnpm sdk-codegen` produced zero net diff. |
| A3 | `bulk-sequence-transformer.ts` use of `ks4Options` remains valid (bulk schemas in `bulk-schemas.ts` retained the field; the upstream removal is API-response-scoped, not bulk-scoped). | verified | `grep "ks4Options" packages/sdks/oak-sdk-codegen/src/types/generated/bulk/bulk-schemas.ts` returns matches (confirmed at investigation time). |
| A4 | The five `search-cli` consumer sites that needed variant information from `ks4Options` can read the same information from the `sequenceSlug` suffix without semantic loss. | **falsified** (2026-05-21 gate run) | **Three of five sites (1a, 1c, 1d) are variant-info read sites that depend on the structured `{slug, title}` shape (or non-null check on it).** The upstream changelog directs variant info to the `sequenceSlug` suffix, BUT bulk schemas retain the structured form, so the design decision is not predetermined by the upstream change. Three legitimate options: (a) parse slug suffix (string-shape inference, schema-first anti-pattern); (b) source variant info from bulk data at indexing time (architecturally clean if available at this code path); (c) drop the variant feature in indexing. **Owner direction required before WS2 executes.** |
| A5 | The `curriculum-sdk` `response-augmentation.integration.test.ts` failure is a stale-test-fixture issue (body missing now-required field), not a behaviour change in the middleware that needs a different fix. | unverified-but-falsifiable | WS3 reads the middleware source + test setup, confirms the throw path fires on the new body shape, and that updating the body greens the test without weakening it. |
| A6 | No other workspace has cascade impact beyond `search-cli` and `curriculum-sdk`. | **verified — but `search-cli` cascade is bigger than originally documented** (2026-05-21 gate run) | Only those two workspaces RED. However, the *within*-`search-cli` cascade is 4 test failures + 3 fixture files in addition to the 5 type-check sites originally enumerated. |
| A7 | The 17-value `subject` enum constraint is added type-narrowing metadata, not a behaviour change requiring consumer logic updates. Existing consumers pass slug strings that already fall within the 17 values. | unverified-but-falsifiable | WS0 greps consumer code for `subject:` literal-string arguments and verifies none pass a slug outside the enum. (A consumer passing e.g. `"maths-and-stats"` would surface as a type error after codegen acceptance.) |
| A8 | The `closed-claims.archive.json` residue is benign housekeeping (a closed-claim record from a prior session) and can be staged into this commit alongside SDK artefacts. | verified | Inspected the single appended record; it is Fiery Firing Cinder's prior `git:index/head` claim close with intent "Move /rename rule from start-right-team into shared start-right". Pure history append. |
| A9 | The 3 JSON fixture files (`fixtures/sandbox/subject-sequences.json` + 2 fetched-data files) can have `ks4Options` keys mechanically removed without invalidating the test scenarios they drive. | unverified-but-falsifiable (new in revision) | WS2 reads each fixture's consumer + asserts on values. If any test asserts on `ks4Options` content from a fixture (rather than on the boolean signal derived from it), the fixture cannot be a pure deletion — variant info must be encoded into the `sequenceSlug` suffix instead. Depends on A4 outcome. |

**Assumption discipline**: any assumption that flips from its stated status during execution surfaces to owner before WS4 lands. Surface count is the audit signal — `0 flipped` is the green path; `N flipped` requires explicit disposition before commit.

---

## End Goal, Mechanism, Means

**End goal**: Workspaces aligned with upstream API v0.7.0; `pnpm check` green; the three-way team session (WS2.2 Celestial / WS3.3 Molten / Inc.1a gate-sweeper Pelagic) unblocks immediately afterwards.

**Mechanism**: The Cardinal Rule canonical workflow — `pnpm sdk-codegen` artefacts are already in the working tree (codegen half done); consumer alignment (workspace half) is the remaining step. One atomic landing keeps schema and consumers in sync.

**Means** (revised): file-scope changes plus the inherited codegen output, bundled into one atomic commit:

1. Accept the 15 generated SDK files already in the working tree (`packages/sdks/oak-sdk-codegen/**`).
2. Update 5 `search-cli` type-check sites — **action depends on A4 outcome** (drop / replace with bulk-data read / replace with suffix parse / drop feature).
3. Update 1 `search-cli` integration-test fixture (`sdk-api-methods.integration.test.ts:135 createMockSubjectSequences`).
4. Update 3 `search-cli` JSON fixture files (`fixtures/sandbox/subject-sequences.json` + 2 `fixtures/fetched-data/search-fixture-source-ks4-*.json`) — **shape depends on A4 outcome**.
5. Update 1 `curriculum-sdk` middleware test body to include the now-required `ks4ProgrammeFactors`.
6. Stage `.agent/state/collaboration/closed-claims.archive.json` housekeeping.
7. `pnpm check` green, then commit.

---

## Non-Goals (YAGNI)

- ❌ **Revising the upstream API v0.7.0 itself**. The upstream team owns that decision; this plan adopts the change, not the design.
- ❌ **Refactoring consumer logic beyond what is required to green type-check + tests**. If a `search-cli` site can be simplified now that `ks4Options` is gone, that simplification is a separate plan.
- ❌ **Touching bulk-schema consumers** (`bulk-sequence-transformer.ts` and friends) — bulk schemas retained `ks4Options` validly.
- ❌ **Splitting the cascade fix across multiple commits**. Per the Cardinal Rule, schema and consumers move together; no intermediate broken state.
- ❌ **Updating other plans, ADRs, or directives in this bundle**. If the v0.7.0 adoption surfaces a doctrine update (e.g. enum-narrowing pattern in consumers), it routes to its own plan or to `/jc-consolidate-docs`.
- ❌ **Documenting the recurring "upstream API bump" pattern**. The pattern can graduate to a docs surface later; this plan instantiates it for v0.7.0 specifically.

---

## Prerequisites

| Prerequisite | Class | If absent |
|---|---|---|
| Owner authorisation to land the `chore(sdk):` atomic commit (the earlier "leave it" direction was about not bundling SDK files into cycle commits; this plan asks for explicit authorisation to land the SDK-update commit itself). | **blocking** | No commit. Holding pattern continues. |
| Upstream API v0.7.0 confirmed intentional by owner (A1 above). | **blocking** | If v0.7.0 is to be rolled back, this plan inverts — revert the codegen artefacts to the v0.6.0 state; no consumer changes needed. |
| Other agents (Molten / Pelagic) holding (no concurrent staging in conflicting paths). | **blocking** | Coordinated via comms; both currently hold per their own broadcasts. |
| `pnpm sdk-codegen` idempotent against the current upstream pin (A2). | **beneficial** | Minimum shippable shape without it: land what's in the tree; if a future codegen run produces drift, that becomes its own alignment plan. |

---

## Quality Gates

Standard chain per `components/quality-gates.md`. No new gate logic.

### After each workstream

```bash
pnpm type-check
pnpm lint
pnpm test
```

### Final aggregate gate (WS4)

```bash
pnpm check
```

**All-quality-gates-blocking rule applies**: any red gate in any workspace blocks the commit. No `--no-verify`. No scoped-only gate runs as a workaround. If a gate surfaces beyond the expected cascade, surface to owner before staging.

---

## Workstreams

### WS0 — Verify Foundation Assumptions

**Goal**: each of A1–A8 reaches `verified` or owner-authorised state. Outcomes: GREEN (proceed to WS1) or RED (named assumption failed, surface to owner).

**Steps**:

1. Surface A1 to owner explicitly (this plan being read IS the surfacing; await yes/no on upstream v0.7.0 intent).
2. Verify A3, A7, A8 by grep / file-read (most are already verified at investigation time; re-check before WS2 to ensure no concurrent peer changes invalidate).
3. Defer A2, A4, A5, A6 to their dedicated workstreams below (each WS verifies its own assumption before executing).

**Acceptance**:

- ✅ Owner authorisation for A1 + the `chore(sdk):` commit recorded in chat or comms.
- ✅ A3, A7, A8 verifications produce expected output (matches recorded at investigation time).
- ✅ No new cascade sites discovered by re-grepping `ks4Options` and `ks4ProgrammeFactors` repo-wide.

**Deterministic validation**:

```bash
# A3: bulk schemas retain ks4Options
grep -c "ks4Options" packages/sdks/oak-sdk-codegen/src/types/generated/bulk/bulk-schemas.ts
# Expected: ≥ 1

# A7: enumerate subject-slug-literal call sites that might be outside the 17-value enum
grep -rn "subject:" apps/ packages/ --include="*.ts" | grep -v "// " | head -50
# Expected: every literal matches one of the 17 enum values OR is a variable reference

# A8: closed-claims.archive trailing record is the expected Fiery residue
git diff HEAD -- .agent/state/collaboration/closed-claims.archive.json | grep -A 5 "claim_id"
# Expected: matches the 58fcf059-* claim from the prior session
```

**Foundation alignment**: principles.md §First Question (could it be simpler), schema-first-execution.md (types flow from schema), AGENT.md Cardinal Rule.

---

### WS1 — Codegen Idempotency Check

**Goal**: confirm A2 — the 15 generated SDK files in the working tree are the correct output of the current upstream v0.7.0 pin.

**Parallel-safety**: must run before WS2/WS3 (otherwise consumer fixes might be against an in-flight codegen state).

**Steps**:

```bash
# Capture pre-state fingerprint
git diff --stat HEAD -- packages/sdks/oak-sdk-codegen/ > /tmp/sdk-pre.txt

# Re-run codegen
pnpm sdk-codegen

# Compare
git diff --stat HEAD -- packages/sdks/oak-sdk-codegen/ > /tmp/sdk-post.txt
diff /tmp/sdk-pre.txt /tmp/sdk-post.txt
```

**Acceptance**:

- ✅ `diff /tmp/sdk-pre.txt /tmp/sdk-post.txt` shows no change.

**If diff shows change**: STOP. The dirty tree was NOT the canonical codegen output. Surface to owner with the post-codegen diff for direction.

**Foundation alignment**: AGENT.md Cardinal Rule — `pnpm sdk-codegen` is the source of truth; this WS verifies the source-of-truth property holds.

---

### WS2 — search-cli Cascade Fix

**Goal**: clear the 5 type errors + 2 lint errors in `@oaknational/search-cli` by dropping `ks4Options` references on API response shapes.

**Parallel-safety**: sequenced after WS1; parallel-safe with WS3 (disjoint file scope).

**Pre-execution gate**: WS2 does NOT start until **A4 design decision is owner-confirmed**. The three options are (a) `sequenceSlug`-suffix parse, (b) bulk-data source for variant info, (c) drop the variant feature in indexing. The fix shape for sites 1a/1c/1d is determined by this decision and cannot be inferred from the cascade alone.

**File scope (revised — 7 source files + 3 JSON fixtures)**:

| # | File | Action | Depends on A4 |
|---|---|---|---|
| 1a | `apps/oak-search-cli/src/adapters/api-supplementation.ts` (line 81) | replace variant-info read | **yes** |
| 1b | `apps/oak-search-cli/src/adapters/hybrid-data-source.integration.test.ts` (line 194) | drop fixture field | no |
| 1c | `apps/oak-search-cli/src/lib/index-batch-helpers.ts` (line 102) | replace variant-info read | **yes** |
| 1d | `apps/oak-search-cli/src/lib/indexing/sequence-facets.ts` (line 120) | replace boolean signal | **yes** |
| 1e | `apps/oak-search-cli/src/lib/indexing/sequence-facets.unit.test.ts` (line 91) | drop / rewrite fixture | depends on 1d |
| 1f | `apps/oak-search-cli/src/adapters/sdk-api-methods.integration.test.ts` (line 135 `createMockSubjectSequences`) | drop `ks4Options: null` from fixture | no |
| 1g | `apps/oak-search-cli/fixtures/sandbox/subject-sequences.json` (line 9) | drop `ks4Options` key | depends on A9 |
| 1h | `apps/oak-search-cli/fixtures/fetched-data/search-fixture-source-ks4-maths.json` (2 occurrences) | drop or re-encode | depends on A9 |
| 1i | `apps/oak-search-cli/fixtures/fetched-data/search-fixture-source-ks4-science.json` (4 occurrences) | drop or re-encode | depends on A9 |

**Files NOT touched**:

- `apps/oak-search-cli/src/adapters/bulk-sequence-transformer.ts` — bulk schemas retained `ks4Options`.
- `apps/oak-search-cli/src/adapters/api-supplementation.integration.test.ts` (line 49 fixture uses `ks4Options: null` on a `maths-secondary` sequence — verify A4 reading: if the test exercises the API-response path under the strict-keyed schema, include in scope).
- `apps/oak-search-cli/src/lib/indexing/ks4-context-builder.{ts,unit.test.ts}` + `ks4-context-types.ts` + internal callers — these define `UnitContext.ks4Options: string[]` and consume from the bulk path; not affected by the API-response removal (name collision on `ks4Options` is intentional and stable).

**Verification before product change (A4 — now owner-bound)**: A4 is empirically falsified. The three sites (1a, 1c, 1d) need a design decision **before** any code is written. Surface to owner with the three options enumerated in A4. WS2 executes once direction is given.

- **Drop site**: the code only writes the `ks4Options` field through to its output, with no behaviour change needed beyond removing the property.
- **Variant-info site**: the code reads `ks4Options` to derive variant information (exam board / pathway / tier). For these, the upstream changelog directs reading the variant from the `sequenceSlug` suffix instead.
- **Test fixture site**: the code constructs a fixture with `ks4Options: null` to satisfy the (now-removed) required field. Remove the property from the fixture.

If any site is **Variant-info site** and the suffix-based read is non-trivial, surface to owner before writing the fix — that's an A4 falsification.

**Failing checks** (these are the deterministic acceptance signal):

```text
src/adapters/api-supplementation.ts(81,21): error TS2339
src/adapters/hybrid-data-source.integration.test.ts(194,11): error TS2353
src/lib/index-batch-helpers.ts(102,23): error TS2339
src/lib/indexing/sequence-facets.ts(120,29): error TS2339
src/lib/indexing/sequence-facets.unit.test.ts(91,5): error TS2353
```

**Product changes** (subject to A4 verification):

- Each of the 5 sites: remove or replace the `ks4Options` reference.
- If any site needed variant information, replace with a `sequenceSlug` suffix-derived read.

**Acceptance**:

- ✅ `pnpm --filter @oaknational/search-cli type-check` exits 0.
- ✅ `pnpm --filter @oaknational/search-cli lint` exits 0.
- ✅ `pnpm --filter @oaknational/search-cli test` exits 0 (all 1011 tests pass — currently 4 failing).
- ✅ A4 design decision recorded (suffix / bulk-data / drop-feature); rationale captured in commit body and napkin for graduation candidacy.
- ✅ A9 status reaches `verified` (fixture deletions / re-encodings preserve the test scenarios each fixture drives).

**Deterministic validation**:

```bash
pnpm --filter @oaknational/search-cli type-check
# Expected: exit 0

pnpm --filter @oaknational/search-cli lint
# Expected: exit 0

pnpm --filter @oaknational/search-cli test
# Expected: exit 0

grep -rn "ks4Options" apps/oak-search-cli/src/ --include="*.ts" | grep -v bulk-sequence-transformer
# Expected: no matches (or only intentional residue documented inline)
```

**Foundation alignment**: schema-first-execution.md (consumer types flow from generated schema; consumer logic adapts to the schema, not the reverse).

---

### WS3 — curriculum-sdk Test Body Update

**Goal**: clear the 1 test failure in `@oaknational/curriculum-sdk` by adding the now-required `ks4ProgrammeFactors` field to the augmentation test body.

**Parallel-safety**: sequenced after WS1; parallel-safe with WS2 (disjoint file scope).

**File scope**:

- `packages/sdks/oak-curriculum-sdk/src/client/middleware/response-augmentation.integration.test.ts` (line 120–130 test body, line 141 assertion site)

**Verification before product change (A5)**:

1. Read the middleware source (`packages/sdks/oak-curriculum-sdk/src/client/middleware/response-augmentation.ts`).
2. Confirm the augmentation throws when the response body fails schema validation (its declared behaviour per the test's name).
3. Confirm that the test's intent — "augmentation throws → warning logged → unaugmented response returned" — is preserved by adding `ks4ProgrammeFactors` to the body that triggers the throw.
4. If the middleware behaviour has changed (e.g. validation moved elsewhere, augmentation now-silent on validation failure), the fix is NOT a test-body update; surface to owner.

**Failing test** (deterministic acceptance signal):

```text
response-augmentation.integration.test.ts:141:32
  AssertionError: expected 0 to be greater than 0
```

**Product changes**:

- Add `ks4ProgrammeFactors: { ... }` to the test body for `/subjects/maths` such that the body still triggers an augmentation throw (the test's intent). Most likely: add the field with a deliberately-invalid value, OR add it with a valid value and ensure some OTHER property is invalid such that augmentation still throws.

The exact value depends on what makes the augmentation throw; A5 verification names it.

**Acceptance**:

- ✅ `pnpm --filter @oaknational/curriculum-sdk test` exits 0 (all 728 tests pass).
- ✅ The test still asserts the original behaviour ("augmentation throws → warning logged → unaugmented response returned"); the fix updates the fixture, not the assertion shape.
- ✅ A5 status flips to `verified`.

**Deterministic validation**:

```bash
pnpm --filter @oaknational/curriculum-sdk test
# Expected: exit 0

# Verify the test still asserts the intended behaviour
grep -B 2 -A 30 "returns unaugmented response and logs warning" \
  packages/sdks/oak-curriculum-sdk/src/client/middleware/response-augmentation.integration.test.ts
# Expected: warnCalls.length > 0 assertion still present
```

**Foundation alignment**: testing-strategy.md (a test describes a system state; fixture updates that preserve the assertion shape are valid maintenance, not test weakening).

---

### WS4 — Atomic Commit and Aggregate Gate

**Goal**: bundle WS2 + WS3 outputs with the 15 codegen artefacts and the closed-claims.archive housekeeping into one atomic `chore(sdk):` commit; `pnpm check` green; the workspace cascade closes.

**Parallel-safety**: sequenced after WS2 + WS3.

**Steps**:

1. Re-read `active-claims.json` and recent comms (last-glance discipline per napkin entry `defensive-last-glance`).
2. Open `git:index/head` commit-window claim per the commit-skill protocol.
3. Enqueue the commit-queue intent listing exact pathspecs.
4. Stage by explicit pathspec (`git add -- <paths>`):
   - All 15 files under `packages/sdks/oak-sdk-codegen/**` modified by codegen.
   - WS2 fixes in `apps/oak-search-cli/src/**`.
   - WS3 fix in `packages/sdks/oak-curriculum-sdk/src/client/middleware/response-augmentation.integration.test.ts`.
   - `.agent/state/collaboration/closed-claims.archive.json`.
   - This plan file (if it has not landed in a separate commit by this point; otherwise omit).
5. `record-staged` (commit-queue fingerprint capture).
6. Draft the commit message per commitlint constraints (verify via `pnpm agent-tools:check-commit-message` BEFORE `git commit`).
7. Run `pnpm check` against the staged state (or rely on the pre-commit hook for the in-line gate run — the hook does this anyway).
8. `verify-staged --commit-subject "<exact subject>"`.
9. `git commit -F <msg-file>` (one atomic commit; no `--no-verify`).
10. `complete --intent-id <id>`; `claims close <claim-id>`.
11. Broadcast `cascade-cleared` to Molten + Pelagic via comms so they can proceed.

**Acceptance**:

- ✅ `pnpm check` exits 0 against the staged tree.
- ✅ Exactly one commit lands on `feat/mcp-graph-support-foundation` carrying the bundle.
- ✅ Working tree clean after commit (no residue except whatever cycle work Molten / Pelagic are about to stage on top).
- ✅ Comms-event `cascade-cleared` posted, naming the commit SHA.

**Deterministic validation**:

```bash
pnpm check
# Expected: exit 0

git log -1 --stat
# Expected: one commit with the bundled file list

git status --short
# Expected: empty (or only files owned by other agents' in-flight cycles)
```

**Foundation alignment**: AGENT.md Cardinal Rule (atomic schema+consumer landing); principles.md §All Quality Gates Blocking (no scoped bypass); local-broken-code-never-leaves rule (tree green before commit).

---

## Plan-Body First-Principles Check

Per [`.agent/rules/plan-body-first-principles-check.md`](../../../rules/plan-body-first-principles-check.md):

- **Shape clause**: this plan's shape (one atomic commit covering codegen + consumer alignment) is mandated by the Cardinal Rule, not invented for this instance. Future v0.x.0 → v0.(x+1).0 plans will mirror it.
- **Landing-path clause**: the landing path is `feat/mcp-graph-support-foundation` (current working branch; the in-flight graph work depends on the cascade clearing). After cascade clears, the branch resumes its primary purpose.
- **Vendor-literal clause**: the only vendor-literal touchpoint is the upstream OpenAPI spec, which is already pinned in `api-schema-original.json` `info.version`. No drift risk inside this plan.

Fires before WS2 + WS3 execution to validate that the cycle shape matches the plan's stated shape; fires before WS4 to validate that the staged bundle matches the bundle the plan named.

---

## Reviewer Scheduling

Phase-aligned per `feature-workstream-template.md` precedent.

- **Pre-execution** (before WS0 completes — owner-directed 2026-05-21): five reviewers in parallel against the revised plan:
  - `assumptions-expert` — challenges A1–A9 (note A4 has falsified; A9 is new) and the revised framing.
  - `code-expert` — reviews the cascade fix-shape proposals and triages whether further specialist routing is required.
  - `type-expert` — schema-first compliance check on the three A4 options; `sequenceSlug`-suffix parsing in particular is at risk of widening from compile-time enum to runtime string inspection.
  - `architecture-expert-fred` — principles-first / ADR-compliance review of the A4 options against schema-first-execution.md and ADR-031 (generation-time extraction).
  - `architecture-expert-betty` — systems-thinking / long-term change-cost analysis of the three A4 options and the cascade landing shape.
- **During execution** (WS2 + WS3): no specialist review required at the cycle level — these are mechanical fixes once A4 is decided. If a new falsification surfaces during execution, escalate to owner before continuing.
- **Post-execution** (after WS4 lands): no reviewer dispatch from this plan. The integrated gate-sweep is owned by Pelagic per the three-way session split; their post-landing review covers WS2.2 + WS3.3, not this `chore(sdk):` commit.

Plan-readiness gate: all five pre-execution reviewers must complete and owner-direction on A4 must be recorded before WS0 closes.

---

## Foundation Document Commitment

Before WS0 begins and before each WS:

1. Re-read `.agent/directives/principles.md` §First Question + §All Quality Gates Blocking.
2. Re-read `.agent/directives/schema-first-execution.md` §Cardinal Rule.
3. Re-read `.agent/directives/AGENT.md` §Cardinal Rule.
4. Ask: *Could it be simpler?* Honest answer: no — every workspace named has a real cascade error from a real upstream change; the change set is minimal-by-construction (no consumer touched beyond the 5 + 1 sites).

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| A4 has falsified (2026-05-21 gate run) — 3 of 5 search-cli sites need variant-info reconstruction, not deletion. | **realised** | medium-high — WS2 cannot start without owner direction on the three options (suffix / bulk-data / drop-feature). Round-trip delay is the cost of getting the design right; rushing past A4 risks landing a schema-first-violating slug-parse pattern silently. | A4 is now an explicit owner-blocking question. WS2 file scope updated to reflect the empirical surface. Reviewer dispatch (`assumptions-expert` + `architecture-expert-fred` + `architecture-expert-betty` + `code-expert` + `type-expert`) covers the design decision before WS2 executes. |
| A5 falsifies — `curriculum-sdk` middleware behaviour has changed (validation moved, or throw path changed), not just the test fixture being stale. | low | medium — escalates WS3 from fixture update to behaviour-fix. | WS3 verification step reads the middleware source before writing code; if behaviour has changed, surface to owner. |
| A6 falsifies — another workspace has cascade impact. | low | low — adds one more WS to the plan; same shape. | WS4's `pnpm check` surfaces any further RED workspace; address in this commit's bundle if scope is comparable, surface to owner if not. |
| A2 falsifies — `pnpm sdk-codegen` produces more changes than what's in the working tree (i.e. codegen was partial). | low | medium — must accept the additional changes into the bundle, re-run consumer cascade verification. | WS1 explicitly tests for this; if it fails, plan adapts by accepting the post-codegen state as the new baseline. |
| Concurrent peer (Molten / Pelagic) stages a conflicting path during WS4. | very low | low — coordination layer (active-claims + commit-queue) surfaces overlap before staging. | Last-glance check at WS4 step 1; if peer activity is visible, coordinate via comms before opening commit-window. |
| Owner declines authorisation (A1 falsifies — v0.7.0 is to be rolled back). | low | high — invalidates the entire plan; revert codegen artefacts. | This is owner's prerogative; the plan inverts cleanly (revert the 15 codegen files, no consumer changes needed). |

---

## Lifecycle Trigger Commitment

Before WS0:

1. Work shape: bounded executable plan (this file).
2. Start-right complete (session-open); active claims consulted (one Celestial claim open, two peer team-starts visible).
3. Active areas registered (claim `f4613bdc-6af8-435d-a5aa-26067408c588` covers `packages/libs/graph-ingest/**` — to be replaced or expanded for this plan's scope before WS2 starts).
4. Apply `lifecycle-triggers.md`: session-handoff at session-close covers the consolidation; this plan does not span sessions if owner authorises immediately.

Before WS4:

1. Confirm no other agent has an overlapping active claim (Molten on `graph-project/src/adjacency/**`, Pelagic on read-only scope — both disjoint from this plan's file scope).
2. Open `git:index/head` commit-window claim with TTL ≤ 900s.

After WS4:

1. Close the commit-window claim with SHA in the closure summary.
2. Close the file-scope claim (or expand to cycle-work claim if proceeding immediately to WS2.2).
3. Broadcast `cascade-cleared` to Molten + Pelagic.
4. If session ends here, run `session-handoff` per the standard workflow.

---

## Documentation Propagation Commitment

Before WS4 lands:

1. **No ADR change** — the Cardinal Rule already covers this workflow; no new architectural decision is being made.
2. **No directive change** — schema-first-execution.md already names this pattern.
3. **No README change** in `sdk-and-mcp-enhancements/`. (The collection README sees this plan via its `current/` listing.)
4. **No `/jc-consolidate-docs` required** — this plan is a single-shot maintenance instance; nothing settles into permanent doctrine from its execution beyond the commit itself.

If WS2's verification step reveals a non-trivial variant-info-reconstruction pattern (A4 partial-falsification), document the pattern in `.agent/memory/active/napkin.md` for graduation candidacy; do not inline it in this plan body.

---

## Learning Loop

This plan's archival action (after WS4 lands):

1. Move this file to `.agent/plans/sdk-and-mcp-enhancements/archive/completed/`.
2. Update `.agent/plans/completed-plans.md` with the entry.
3. Update cross-references (the collection README's `current/` listing).
4. If A4 or A5 produced an interesting insight (e.g. variant-info reconstruction from `sequenceSlug` suffix is a reusable pattern), capture in napkin for graduation review.

This plan does NOT spawn a "v0.8.0 alignment template" plan — the template grows naturally from the second instance, not the first.

---

## Promotion / Status

This plan is in `current/` (queued, executable, not started). It moves to `active/` when owner authorises execution. Single-session execution expected (Molten and Pelagic are blocked on this clearing, so the actual landing is time-critical for the broader session).

---

## Revision Audit Trail

### 2026-05-21 second session — Opalescent Twinkling Supernova (revision)

Reason for revision: owner requested an independent full-gate run with "do not assume the plan is accurate". Findings vs original plan:

- **Accurate**: Cardinal-Rule framing; v0.6.0 → v0.7.0 delta enumeration; 5 type-check errors at named paths; 2 lint errors; curriculum-sdk single failure at line 141; A2 (verified), A3, A8.
- **Undercounted — test failures**: original "1 test failure" claim → **5 actual** (1 curriculum-sdk + 4 search-cli).
- **Undercounted — file scope**: original 6 files → **7 source files + 3 JSON fixture files**.
- **Falsified — A4**: 3 of 5 search-cli sites are variant-info read sites, not "drop the property" sites. The original framing of A4 as "unverified-but-falsifiable" with a soft escalation protocol was empirically too optimistic. A4 is now an explicit owner-blocking design decision.
- **Added — A9**: JSON fixture deletions / re-encodings may or may not preserve the test scenarios they drive; depends on A4 outcome.
- **Added — reviewer dispatch**: five pre-execution reviewers replace the single `assumptions-expert` gate.

Sections changed: header status line, "What Needs Doing (Workspace Cascade)" (renumbered + expanded to 5 cascade sites), Means list (5 → 7 items), Assumptions table (A2 verified, A4 falsified, A6 caveat, A9 added), WS2 file scope (5 → 9 items + dependency mapping), WS2 acceptance, Risk Assessment A4 row, Reviewer Scheduling pre-execution block.

No changes to: Cardinal-Rule framing, WS0 / WS1 / WS3 / WS4 step sequences, Non-Goals, Prerequisites, Quality Gates, Plan-Body First-Principles Check, Foundation Document Commitment, Documentation Propagation, Learning Loop, Promotion / Status, Cross-references.

## Cross-references

- [AGENT.md Cardinal Rule](../../../directives/AGENT.md) — schema-first execution
- [`schema-first-execution.md`](../../../directives/schema-first-execution.md) — generator-first contract
- [`principles.md`](../../../directives/principles.md) — all-quality-gates-blocking
- [`active/schema-resilience-and-response-architecture.plan.md`](../active/schema-resilience-and-response-architecture.plan.md) — sibling plan; broader response-architecture work the v0.7.0 alignment fits within
- [`active/upstream-api-reference-metadata.plan.md`](../active/upstream-api-reference-metadata.plan.md) — sibling plan; upstream API reference work
- [`.agent/memory/operational/threads/connecting-oak-resources.next-session.md`](../../../memory/operational/threads/connecting-oak-resources.next-session.md) — graph thread record (downstream consumer of cascade-clearing)
- [`active-claims.json`](../../../state/collaboration/active-claims.json) — live claim state
