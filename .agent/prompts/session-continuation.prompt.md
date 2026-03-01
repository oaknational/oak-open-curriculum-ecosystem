---
prompt_id: session-continuation
title: "Continue: get-curriculum-model Replacement"
type: handover
status: active
last_updated: 2026-03-01
---

# Continue: get-curriculum-model Replacement

Session entry point. Execute the active plan.

## Critical Design Rule

**`get-curriculum-model` REPLACES `get-ontology` and `get-help`.**

The standalone tools are removed entirely. No compatibility layer. No
deprecation period. Previous sessions repeatedly drifted towards keeping
the old tools alongside the new one — this is incorrect and violates
the rules ("NEVER create compatibility layers — replace old approaches
with new approaches").

## What to do

Execute the plan:
[ws1-get-curriculum-model.plan.md](../plans/sdk-and-mcp-enhancements/active/ws1-get-curriculum-model.plan.md)

The plan has been reviewed by **6 specialist agents** (Barney, Fred,
Wilma, type-reviewer, test-reviewer, docs-adr-reviewer). All BLOCKERs
are resolved. The plan is execution-ready.

**All work streams (WS1-WS6) are complete.** Plan execution finished.

### Plan structure (all complete)

| Phase | Purpose | Outcome |
|-------|---------|---------|
| ~~WS1 (RED)~~ | ~~Write tests asserting final state~~ | ~~13 failing tests~~ |
| ~~WS2 (GREEN)~~ | ~~Atomic removal + fixes~~ | ~~All tests green~~ |
| ~~WS3 (REFACTOR)~~ | ~~`as` assertion cleanup, dependency inversion~~ | ~~21 `as` casts removed, circular dep fixed~~ |
| ~~WS4~~ | ~~Quality gate chain + E2E test updates~~ | ~~All 11 gates green (693 unit + 185 E2E)~~ |
| ~~WS5~~ | ~~Adversarial specialist reviews~~ | ~~7/7 specialists, no blockers~~ |
| ~~WS6~~ | ~~Documentation propagation~~ | ~~54 stale refs fixed across 10 docs~~ |

### Key decisions (locked)

- `get-curriculum-model` is the sole orientation tool (replaces `get-ontology` + `get-help`)
- `curriculum://model` is the sole orientation resource (replaces `curriculum://ontology`)
- Barrel import in `definitions.ts` KEPT for consistency (Fred ruling)
- Unknown `tool_name` returns base orientation without error (Wilma ruling)
- `isKnownAggregatedTool` removed — guidance data is the single source of truth

### WS5 review outcomes (7/7 specialists, no blockers)

- **code-reviewer**: APPROVED WITH SUGGESTIONS — praised drift-detection and negative testing
- **test-reviewer**: PASS — TDD cycle confirmed, stale `@todo` fixed
- **type-reviewer**: SAFE — zero assertions, type flow mechanically sound
- **barney**: 2 MEDIUM (workflow duplication in payload, barrel transitive edge) — accepted
- **fred**: COMPLIANT runtime code — barrel KEEP ruling, ADR drift catalogued
- **wilma**: budget test gap noted (90KB combined test exists), latent type cycle (no runtime impact)
- **docs-adr**: 54 stale refs catalogued, all fixed in WS6

**Remaining follow-ups** (not blocking, for future sessions):

1. `widget-metadata.e2e.test.ts` — 3 pre-existing `as` casts (migrate to Zod)
2. Latent type-only cycle through `tool-guidance-types` (no runtime impact)
3. Workflow duplication in combined payload (`domainModel.workflows` + `toolGuidance.workflows`)
4. Missing E2E `resources/read` test for `curriculum://model`

## Separate concern: M0 gates

These are **not part of the WS1 plan** but remain outstanding:

- Final secrets and PII sweep (`pnpm secrets:scan:all`)
- Manual sensitive-information review (human)
- Merge `feat/semantic_search_deployment` to `main`
- Make repository public on GitHub

Address only after WS1 plan is complete, or in a separate session.

## Session provenance

- [Plan review and hardening](eee143e8-dfde-41f7-b3e7-246013bd7418)
  (6 specialist reviews, all findings integrated)
