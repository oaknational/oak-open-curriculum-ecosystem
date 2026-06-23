---
name: "MCP Self-Description Fidelity — large-payload hints + curriculum-model generation"
overview: "Two schema-first fixes from the 2026-06-23 local UAT: large-payload tools carry accurate scope/page hints in their descriptions (WS1), and the curriculum-model ontology's drift-prone lists are derived from the schema instead of hand-maintained (WS2)."
todos:
  - id: ws1-cycle-1
    content: "WS1 cycle 1: generated-tool large-payload note — unit test in tool-description.unit.test.ts asserting getToolDescriptionEnhancement returns a scope/page note for the asset tools + Green via constant and switch cases. One commit. Tree green at end."
    status: pending
    depends_on: []
  - id: ws1-cycle-2
    content: "WS1 cycle 2: aggregated-tool scoping hints — unit test asserting the aggregated browse/explore/keyword-graph tool-definition descriptions carry a scoping hint + Green via the aggregated-* tool-definition edits. One commit. Tree green at end."
    status: pending
    depends_on: []
  - id: ws1-cycle-3
    content: "WS1 cycle 3: e2e proof — tools/list over the live server shows the scope/page hint for a known overflow tool (get-sequences-assets and browse-curriculum). One commit. Tree green at end."
    status: pending
    depends_on: [ws1-cycle-1, ws1-cycle-2]
  - id: ws2-cycle-1
    content: "WS2 cycle 1: subjects fidelity — unit test asserting ontologyData subjects' slugs equal the canonical generated subject-slug set (fails now: 13 vs 17) + Green by deriving the ontology subject slugs from the generated source. One commit. Tree green at end."
    status: pending
    depends_on: []
  - id: ws2-cycle-2
    content: "WS2 cycle 2: extend derivation to key stages + KS4 factor enums where schema-sourced; update ontology version/notice to state which fields are generated. One commit. Tree green at end."
    status: pending
    depends_on: [ws2-cycle-1]
  - id: ws3-doc-propagation
    content: "WS3: TSDoc/README/ADR-or-directive prose for the landed behaviour (schema-first ontology derivation; large-payload hint convention)."
    status: pending
    depends_on: [ws1-cycle-3, ws2-cycle-2]
  - id: ws4-quality-gates-final
    content: "WS4: full quality gate chain (sdk-codegen through test:e2e) on the integrated delivery."
    status: pending
    depends_on: [ws3-doc-propagation]
  - id: ws5-adversarial-review
    content: "WS5: adversarial specialist reviews (mcp-expert, type-expert, docs-adr-expert). Document findings."
    status: pending
    depends_on: [ws4-quality-gates-final]
  - id: ws6-consolidation
    content: "WS6: run /oak-consolidate-docs; propagate settled outcomes; archive."
    status: pending
    depends_on: [ws5-adversarial-review]
isProject: false
---

# MCP Self-Description Fidelity

**Last Updated**: 2026-06-23
**Status**: 🟢 ACTIVE (execution started 2026-06-23; readiness-reviewed by assumptions-expert; WS1 seam and WS2 canonical source resolved first-hand)
**Scope**: Make the Oak Curriculum MCP server's *self-description* accurate and robust, schema-first: tool descriptions tell agents how to avoid payload overflow (WS1), and the curriculum-model orientation cannot drift from the live subject/key-stage truth (WS2).

---

## Context

Both fixes are snags surfaced by the 2026-06-23 local UAT full-matrix run
([`uat-reports/2026-06-23-local.md`](../../../../apps/oak-curriculum-mcp-streamable-http/docs/uat-reports/2026-06-23-local.md)).
They share one root theme: the server describes itself — its tools and its
curriculum domain — and that self-description must be accurate and survive
codegen. Neither is a behaviour bug in data retrieval; both are fidelity gaps
in what the server *tells the agent*.

### Problem Statement

**WS1 — large-payload tools give no scoping signal.** Several tools return
payloads that exceed a host's per-result token cap, with nothing in the
description telling the agent to narrow first. Observed first-hand in the UAT
run:

- `browse-curriculum {}` — ~204 KB (overflowed the host cap)
- `search { scope: 'sequences' }` — ~75 KB at default size
- `get-sequences-assets` — ~77 KB

The agent only discovers the limit by hitting it mid-task (truncation or a hard
error). The descriptions should name the narrowing mechanism that already
exists (scope filters, `from`/`size`, `offset`/`limit`, `type`/`year`).

**WS2 — the curriculum-model ontology has drifted.** `get-curriculum-model`
and `curriculum://model` return a hand-authored static ontology
(`version: '0.1.0-poc'`, dated 2025-11-27). Its `subjects` array lists **13**
subjects; the live API serves **17** (missing: citizenship, design-technology,
rshe-pshe, cooking-nutrition). The file's own notice says: *"This is a static
POC. A future version will generate this data from the OpenAPI schema at compile
time."* The orientation tool the server *mandates calling first* is giving an
incomplete domain model.

### Existing Capabilities

- **Generated-tool descriptions** are built at codegen time in
  `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/tool-description.ts`.
  Tool-specific notes are appended via the `getToolDescriptionEnhancement(toolName)`
  switch (already carries `GET_RATE_LIMIT_NOTE`, `GET_KEYWORDS_DISAMBIGUATION_NOTE`,
  `ASSET_DOWNLOAD_NOTE`). Unit test home: `tool-description.unit.test.ts` (sibling).
- **Aggregated (hand-authored) tool descriptions** live in
  `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-*/tool-definition.ts`
  (browse, explore, keyword-graph, and the other aggregated tools). These are
  NOT generated from OpenAPI, so they are a second edit surface.
- **The ontology** is `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`;
  composed for the tool/resource by `curriculum-model-data.ts`. Unit test home:
  `curriculum-model-data.unit.test.ts`. Note `threads.countSummary` is **already**
  derived live from `@oaknational/graph-corpus-sdk` — proof the file mixes
  generated and authored fields cleanly.
- **The 17-subject truth already exists in generated output.** The canonical
  source (resolved first-hand) is `AllSubjectsResponseSchema` in
  `packages/sdks/oak-sdk-codegen/src/types/generated/zod/curriculumZodSchemas.ts`
  — a `z.array(z.enum([...]))` of exactly the 17 canonical slugs. WS2 cycle 1
  imports it and reads the inner enum `.options`.

---

## Design Principles

1. **Schema-first self-description** — the server's description of itself derives
   from the schema/SDK, never hand-maintained where a generated source exists.
   Both workstreams survive `pnpm sdk-codegen` regeneration; no runtime mutation.
2. **Cure the recurrence, not the instance** — WS2 generates the drift-prone list
   so it *cannot* drift again, rather than editing 13 → 17 by hand (a once-cure).
3. **Hints match the real mechanism** — WS1 notes name the *actual* narrowing each
   tool supports (scope filters / `from`,`size` / `offset`,`limit` / `type`,`year`),
   not a generic "this is large".
4. **Terse** — description notes are one line; they must not themselves bloat the
   agent context budget. Measure before/after.

**Non-Goals** (YAGNI):

- **Real pagination / server-side size caps** for genuinely unbounded tools
  (`browse-curriculum {}`, aggregated search). The observed overflow cases are all
  *narrowable today*, so a descriptive hint is the sufficient cure. Adding true
  pagination touches the upstream API shape and is a separate decision — recorded
  here, not built. If the owner wants it, it is a follow-up plan.
- **Duplicating or replacing** the official `oaknational/oak-curriculum-ontology`
  repo. `ontology-data.ts` is deliberately "a simple ontology for the public API
  data" (per its own `@remarks`); this plan keeps that scope.
- **Generating narrative / example / tips content** (definitions, example threads,
  workflow guidance). Those stay authored; only schema-sourced lists are derived.
- **MCPJam adoption / the inspector-smoke harness** — separate thread.

---

## Lifecycle Triggers

> See [Lifecycle Triggers component](../../templates/components/lifecycle-triggers.md)

Work shape: **bounded executable repo plan**, two independent workstreams.
Touch points: start-right at session open; an active-claim per workstream if
dispatched in parallel (WS1 and WS2 own disjoint file scopes — safe to claim
separately); session-handoff if the work spans sessions; consolidation at close
(WS6). No decision-thread needed: WS2 cycle 1's source question is resolved
(rich subject objects are not schema-derivable; derive slugs, author the rest —
see Cycle 2.1).

Session-discipline component is **not applicable** — the plan is small and
single-arc; if execution spans sessions, apply the standard discipline by
reference at that point.

---

## Cycle Dependencies and Parallelisation

> See [TDD Cycles component](../../templates/components/tdd-phases.md)
> §"Atomic, independent cycles for parallel dispatch"

**WS1 and WS2 are parallel-safe with each other** — disjoint file scopes
(WS1: codegen `parts/` + `aggregated-*/`; WS2: `ontology-data.ts`). They can be
dispatched to two agents simultaneously.

Within WS1: cycles 1 and 2 are parallel-safe (generated-tool surface vs
aggregated-tool surface — different files). Cycle 3 (e2e) is sequenced after
both, because it asserts the live merged `tools/list`.

Within WS2: cycle 2 is sequenced after cycle 1 (it extends the same derivation
seam cycle 1 introduces).

---

## WS1 — Large-payload tools carry accurate scope/page hints

> See [TDD Cycles component](../../templates/components/tdd-phases.md)

### Cycle 1.1: Generated-tool large-payload note

**Parallel-safety**: parallel-safe (separate file scope from 1.2)
**Starting state**: branch HEAD at dispatch

**File scope** (permitted to touch):

- `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/tool-description.unit.test.ts` (MODIFIED)
- `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/tool-description.ts` (MODIFIED)

**File scope NOT to touch**: the `aggregated-*/tool-definition.ts` files (owned by 1.2); `ontology-data.ts` (WS2).

**Test** (Red): in `tool-description.unit.test.ts`, assert
`getToolDescriptionEnhancement('get-sequences-assets')` (and
`get-key-stages-subject-assets`) returns a note naming the `type`/`year`
narrowing, and that `appendToolEnhancements` composes it onto the base
description. Note the asset tools already return `ASSET_DOWNLOAD_NOTE`, so the
assertion is that the large-payload guidance is *also* present (compose, don't
replace).

**Product code** (Green): add a `LARGE_PAYLOAD_NOTE` builder (parameterised by
the narrowing mechanism string so each tool names its real filters) and extend
the `getToolDescriptionEnhancement` switch for the generated tools that overflow
or are large at broad scope.

**Seam note (verified first-hand)**: `getToolDescriptionEnhancement` is a
`switch` returning **exactly one** note, and `appendToolEnhancements`
concatenates that single returned note onto the base description. The asset
tools already return `ASSET_DOWNLOAD_NOTE` through that one slot. So
"compose, don't replace" is not free: the asset-tool switch cases must return
`ASSET_DOWNLOAD_NOTE` **and** `LARGE_PAYLOAD_NOTE` joined into one string
(compose within the case). Do this locally in the switch — do not refactor
`appendToolEnhancements` to take a list unless a third compose-case appears
(consolidate-at-third-consumer).

**Acceptance**:

1. New assertions pass.
2. Whole tree green (`pnpm test` exits 0; no skipped tests).
3. Commit message names cycle 1.1.

**Deterministic Validation**:

```bash
pnpm --filter @oaknational/sdk-codegen test
pnpm test
```

**Reviewer dispatch**: `mcp-expert` (description idiom, MCP spec), `type-expert`.

### Cycle 1.2: Aggregated-tool scoping hints

**Parallel-safety**: parallel-safe (separate file scope from 1.1)
**Starting state**: branch HEAD at dispatch

**File scope** (permitted to touch):

- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-browse/tool-definition.ts` (MODIFIED)
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/tool-definition.ts` (MODIFIED)
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-keyword-graph.ts` (MODIFIED)
- the matching unit test(s) for those definitions (MODIFIED or NEW)

**File scope NOT to touch**: the codegen `parts/` files (owned by 1.1); `ontology-data.ts` (WS2).

**Test** (Red): assert each aggregated tool-definition description contains a
scoping hint naming its real narrowing — `browse-curriculum` → "pass `subject`
and/or `keyStage`; the unfiltered call is very large"; `explore-topic` → bounded
top-5 already, document it; aggregated keyword tool → prefer bounded
`get-keyword-graph` with `limit`. (Confirm exact tool list during execution by
enumerating `oak-curriculum-sdk/src/mcp/aggregated-*/`.)

**Product code** (Green): edit the description strings in the aggregated
tool-definition files, reusing the WS1 note phrasing for consistency across the
two surfaces.

**Acceptance**: new assertions pass; whole tree green; commit names cycle 1.2.

**Deterministic Validation**:

```bash
pnpm --filter @oaknational/oak-curriculum-sdk test
pnpm test
```

**Reviewer dispatch**: `mcp-expert`.

### Cycle 1.3: e2e proof — live tools/list carries the hint

**Parallel-safety**: sequenced after 1.1 and 1.2
**Starting state**: after 1.1 and 1.2 land

**File scope**: a new/extended e2e test under
`apps/oak-curriculum-mcp-streamable-http/e2e-tests/` (the in-process MCP SDK
client suite).

**Test** (Red→Green once 1.1/1.2 land): call `tools/list` and assert the
descriptions for `get-sequences-assets` and `browse-curriculum` contain the
scope/page hint substring.

**Acceptance**: e2e assertion passes; `pnpm test:e2e` exits 0; whole tree green.

**Deterministic Validation**:

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e
```

**Value-proxy (non-gating, recorded)**: re-run the UAT smoke calls that
overflowed (`browse-curriculum {}`, `search {scope:sequences}`,
`get-sequences-assets`) and confirm the description now tells the agent how to
narrow. Note in the UAT report.

---

## WS2 — Curriculum-model lists are schema-derived (no drift)

### Cycle 2.1: Subjects fidelity

**Parallel-safety**: parallel-safe (independent of WS1)
**Starting state**: branch HEAD at dispatch

**File scope** (permitted to touch):

- `packages/sdks/oak-curriculum-sdk/src/mcp/curriculum-model-data.unit.test.ts` (MODIFIED) — or a focused `ontology-data` test
- `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts` (MODIFIED)

**File scope NOT to touch**: any WS1 file.

**Canonical source (resolved first-hand — no longer a decision point)**: the
single canonical source is `AllSubjectsResponseSchema` at
`packages/sdks/oak-sdk-codegen/src/types/generated/zod/curriculumZodSchemas.ts`
— `z.array(z.enum([...]))` whose inner enum is exactly the **17 canonical
slugs** (art, citizenship, computing, cooking-nutrition, design-technology,
english, french, geography, german, history, maths, music, physical-education,
religious-education, rshe-pshe, science, spanish), **no KS4 variants**. The slug
set is extractable via the inner enum's `.options`. `SUBJECT_TO_PARENT`
(`generated/search/subject-hierarchy.ts`) is **rejected** for this list — it
carries 21 (the 17 plus KS4 factor variants physics/chemistry/biology/
combined-science), which are not browsable subjects. The
request-parameter-map candidate is also dropped.

**Test** (Red — fails now, 13 ≠ 17): assert the set of
`ontologyData.curriculumStructure.subjects[].slug` equals the slug set derived
from `AllSubjectsResponseSchema`.

**Product code** (Green): derive the ontology's subject `slug` set by importing
`AllSubjectsResponseSchema` and reading its inner enum `.options`, rather than
the hand-typed array (mirrors the existing `threads.countSummary` live
derivation; respects `generator-first-mindset` — import the generated artefact,
never copy or edit it). No single generated source carries rich subject objects
(titles + per-subject key-stage coverage live only in `SubjectResponseSchema`, a
*response* shape, not a static list), so the fallback IS the path: **keep
authored `name` + `keyStages`, and hand-author those two fields for the 4 new
subjects** (citizenship, design-technology, rshe-pshe, cooking-nutrition). The
slug-equality test guards completeness; the slugs cannot drift after this cycle.

**Acceptance**:

1. The subjects test passes (ontology now exposes all 17).
2. `curriculum-model-data` / `universal-tools` tests still green.
3. Whole tree green; commit names cycle 2.1.

**Deterministic Validation**:

```bash
pnpm --filter @oaknational/oak-curriculum-sdk test
pnpm test
```

**Reviewer dispatch**: `type-expert` (schema-derived type flow), `mcp-expert`.

### Cycle 2.2: Extend derivation + update version/notice

**Parallel-safety**: sequenced after 2.1
**Starting state**: after 2.1 lands

**Test** (Red): assert key stages (and the KS4 factor variants from
`SUBJECT_TO_PARENT` in `generated/search/subject-hierarchy.ts` — physics,
chemistry, biology, combined-science) match the schema where a generated source
exists; assert the ontology `version`/`notice` no longer claim "static POC" for
the now-generated fields (state which fields are generated vs authored).

**Product code** (Green): extend the cycle-2.1 derivation seam to key stages and
the KS4 factor variants (source: `SUBJECT_TO_PARENT`); revise `version` (e.g.
drop `-poc` or bump) and the `notice` text to describe partial generation
honestly — slugs are schema-derived; names and per-subject key-stage coverage
are authored.

**Acceptance**: new assertions pass; whole tree green; commit names cycle 2.2.

**Deterministic Validation**:

```bash
pnpm --filter @oaknational/oak-curriculum-sdk test
pnpm test
```

---

## WS3 — Documentation and Cross-Surface Updates

### 3.1: TSDoc and NL guidance

- TSDoc on the new `LARGE_PAYLOAD_NOTE` builder and the derivation seam.
- If the large-payload hint becomes a repeated convention, note it where the
  other enhancement notes are documented.

### 3.2: Documentation

- Update `ontology-data.ts` header comment to match the new version/notice.
- ADR/directive: if WS2 establishes "curriculum-model lists are schema-derived"
  as a durable rule, record it (candidate: extend the OpenAPI-pipeline doc at
  `docs/architecture/openapi-pipeline.md` and/or an ADR) — `docs-adr-expert`
  decides whether an ADR is warranted at WS5.

---

## WS4 — Quality Gates

> See [Quality Gates component](../../templates/components/quality-gates.md)

```bash
pnpm clean && pnpm sdk-codegen && pnpm build && pnpm type-check && \
pnpm format:root && pnpm markdownlint:root && pnpm lint:fix && \
pnpm test && pnpm test:ui && pnpm test:e2e
```

The `pnpm sdk-codegen` step is load-bearing here: both workstreams must survive
regeneration (WS1 notes are emitted by codegen; WS2 derivation runs at codegen
time). A clean re-run with no diff churn beyond the intended changes is part of
acceptance.

---

## WS5 — Adversarial Review

> See [Adversarial Review component](../../templates/components/adversarial-review.md)

- `mcp-expert` — description idiom, schema-first fidelity, spec conformance.
- `type-expert` — schema-derived type flow for the ontology subjects.
- `docs-adr-expert` — whether the schema-derivation rule needs an ADR; doc drift.
- `release-readiness-expert` (optional) — these are GA-fidelity snags.

Document findings; create a follow-up plan only if BLOCKERs surface.

---

## Proof Contract

| Acceptance id | Proof level | Proof |
|---|---|---|
| ws1-cycle-1 | unit | `tool-description.unit.test.ts` asserts the asset-tool note; `pnpm --filter @oaknational/sdk-codegen test` |
| ws1-cycle-2 | unit | aggregated tool-definition tests assert the scoping hint |
| ws1-cycle-3 | e2e | `tools/list` over the in-process server shows the hint; `pnpm test:e2e` |
| ws1 (value) | value-proxy | re-run the overflowing UAT calls; hint now guides narrowing (recorded in UAT report, non-gating) |
| ws2-cycle-1 | unit | subjects-set equality test (17 slugs) green; `pnpm --filter @oaknational/oak-curriculum-sdk test` |
| ws2-cycle-2 | unit | key-stage / factor equality + version/notice assertions green |
| ws3 / ws4 | non-code / aggregate | docs landed; full gate chain exits 0 with clean `sdk-codegen` |

Completion (`current` → done) requires every id above proven. TDD evidence is
test-first per cycle (the WS2 cycle-1 test fails before the derivation lands —
13 ≠ 17 is the Red).

---

## Risk Assessment

> See [Risk Assessment component](../../templates/components/risk-assessment.md)

| Risk | Mitigation |
|------|------------|
| Rich subject fields (titles, key-stage coverage) are not cleanly schema-derivable | **Settled (verified first-hand), not an open risk**: no single generated source carries rich subject objects, so cycle 2.1 derives the slug set from `AllSubjectsResponseSchema` and keeps authored names/key-stages (hand-authored for the 4 new subjects), guarded by the slug-equality test. Slugs cannot drift. No decision-thread. |
| Description notes bloat the agent context budget | Keep each note one line; measure total `tools/list` description bytes before/after; `mcp-expert` reviews terseness. |
| Two description surfaces (generated vs aggregated) drift in phrasing | Single shared note phrasing reused across 1.1 and 1.2. |
| `sdk-codegen` regeneration churns unrelated output | WS4 runs `pnpm clean && pnpm sdk-codegen` and reviews the diff is scoped; WS2 derivation must be deterministic. |
| Divergence from the official `oak-curriculum-ontology` repo | Explicit non-goal; this file stays the API-orientation aid only. |

---

## Foundation Alignment

> See [Foundation Alignment component](../../templates/components/foundation-alignment.md)

- [`principles.md`](../../../directives/principles.md) — single source of truth;
  self-description derives from the schema, no hand-maintained drift.
- [`testing-strategy.md`](../../../directives/testing-strategy.md) — every cycle
  is a test+product-code pair in one commit; no global state; the WS2 cycle-1
  Red (13 ≠ 17) precedes its Green.
- [`schema-first-execution.md`](../../../directives/schema-first-execution.md) —
  the spine of WS2 (generate from schema at compile time) and WS1 (notes emitted
  through the codegen pipeline).

### Plan-body first-principles check

> See [`plan-body-first-principles-check.md`](../../../rules/plan-body-first-principles-check.md)

- **Vendor-literal clause**: not applicable — no third-party vendor integration
  (the Build-vs-Buy attestation is intentionally omitted; MCPJam is a separate thread).
- **Shape check**: the enhancement-switch shape (WS1) and the ontology
  mixed-generated/authored shape (WS2) were confirmed first-hand against
  `tool-description.ts` and `ontology-data.ts` while authoring this plan; the
  executing agent re-confirms before editing.
- **Landing path**: each cycle is one atomic commit; the tree is green at every
  commit; no test/product-code split.

---

## Documentation Propagation

> See [Documentation Propagation component](../../templates/components/documentation-propagation.md)

Candidate canonical homes: `docs/architecture/openapi-pipeline.md` (schema-first
derivation now extends to the ontology), and a possible ADR for "curriculum-model
lists are schema-derived." Decided at WS5 with `docs-adr-expert`.

---

## Consolidation

After all work is complete and quality gates pass, run `/oak-consolidate-docs`
to graduate settled content, extract reusable patterns, rotate the napkin,
manage fitness, and update the practice exchange. Mine outcomes into permanent
docs and archive per ADR-117.

---

## Dependencies

**Blocking**: none. Both workstreams are runnable now against current `main`.

**Beneficial**: none required. (WS1 and WS2 are independent; either can ship
alone — minimum shippable shape is WS2 cycle 1 alone, which removes the proven
subjects drift.)

**Related Plans**:

- [`oak-prod-mcp-snagging-2026-06-11.plan.md`](../current/oak-prod-mcp-snagging-2026-06-11.plan.md) — sibling snagging plan; the keyword-limit schema-bound finding there is adjacent to WS1.
- [`output-schemas-for-mcp-tools.plan.md`](../current/output-schemas-for-mcp-tools.plan.md) — also threads through the universal-tools/codegen seam; coordinate if both touch tool registration.

**Source**: 2026-06-23 local UAT report —
[`uat-reports/2026-06-23-local.md`](../../../../apps/oak-curriculum-mcp-streamable-http/docs/uat-reports/2026-06-23-local.md).
