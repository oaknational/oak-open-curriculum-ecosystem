---
name: "Knip Phase 2.5: Resolve Phase 2 Follow-ups"
overview: "Investigate and resolve 4 architectural follow-ups from knip Phase 2. Each needs owner decision: action or defer with rationale."
todos:
  - id: investigate-auth-helpers
    content: "Follow-up 2.5.1: Investigate auth-response-helpers consolidation with mcp-auth.ts — gather evidence, present options."
    status: pending
  - id: investigate-gt-barrels
    content: "Follow-up 2.5.2: Investigate ground-truth barrel hierarchy — map current structure, assess nesting, present options."
    status: pending
  - id: investigate-schema-emitter
    content: "Follow-up 2.5.3: Investigate schema-emitter unused generation — identify what it emits that has zero consumers, present options."
    status: pending
  - id: investigate-cli-shared
    content: "Follow-up 2.5.4: Investigate cli/shared barrel — verify zero importers, present options."
    status: pending
  - id: implement-decisions
    content: "Implement owner decisions for all 4 follow-ups."
    status: pending
  - id: verify-gates
    content: "Verify pnpm knip still exits 0 and pnpm check passes after all changes."
    status: pending
---

# Knip Phase 2.5: Resolve Phase 2 Follow-ups

**Last Updated**: 2026-04-11
**Status**: Active — not yet started
**Scope**: Investigate and resolve 4 architectural follow-ups
surfaced during Phase 2 of the knip triage.
**Parent**: [knip-triage-and-remediation.plan.md](./knip-triage-and-remediation.plan.md)

## Context

Phase 2 resolved 850 unused exports/types across 4 batches. During
that work, 4 items were identified that represent architectural
improvements beyond simple export trimming. Each was deferred to
this phase because they require owner decision on scope (action vs
defer with rationale). Risk acceptance is a human decision.

After this phase completes, the knip plan is fully done and the
`enable-knip` item in the parent quality-gate-hardening plan is
closed.

## Guiding Principles

- **Evidence first** — investigate before recommending.
- **Risk acceptance is a human decision** — agents classify
  severity and present options; agents do not accept risks or
  defer items on behalf of the owner.
- **Architectural excellence over expediency** — prefer the
  structurally correct fix over the quick patch.
- **Each follow-up is independent** — they can be resolved in
  any order and in separate sessions if needed.

## Follow-ups

### 2.5.1: Consolidate auth response helpers

**Background**: `auth-response-helpers.ts` in streamable-http
exported 8 functions that duplicated private implementations in
`mcp-auth.ts`. Phase 2 deleted the 8 dead exports. The underlying
duplication between the two files remains.

**Investigation needed**:
1. Map the remaining functions in `auth-response-helpers.ts`
2. Map the private implementations in `mcp-auth.ts`
3. Identify overlap, divergence, and coupling
4. Assess whether consolidation would simplify or complicate

**Options**:
- (a) Consolidate into one module, import from the other
- (b) Keep separate with documented rationale (different
  responsibilities despite similar signatures)
- (c) Defer with rationale — the duplication is tolerable and
  consolidation has low value relative to effort

### 2.5.2: Restructure ground-truth barrel hierarchy

**Background**: 54 barrel files across 16 subjects with 3 nesting
levels (subject → phase → query). Phase 2 trimmed unused
re-exports but preserved the structure. The nesting is excessive
for an app with no downstream consumers.

**Investigation needed**:
1. Count current barrel files and nesting depth
2. Identify which barrels serve a purpose vs pure convenience
3. Assess whether the generator drives the structure
4. Check if flattening would break any consumption patterns

**Options**:
- (a) Flatten to 2 levels (subject + phase), update generator
- (b) Keep 3 levels with trimmed barrels, document rationale
- (c) Defer with rationale — structure is generator-driven and
  changing it has low value vs effort

### 2.5.3: Fix schema-emitter for unused generated exports

**Background**: `generate-ground-truth-types.ts` emits
`TOTAL_LESSON_COUNT`, `GENERATED_AT`, and validation schemas that
have zero runtime consumers. Phase 2 removed the dead constants
but the generator still has the capability to emit them.

**Investigation needed**:
1. Read the generator source to understand what it emits
2. Verify which emitted artefacts have zero consumers
3. Assess whether removing emission capability is safe

**Options**:
- (a) Fix generator to remove dead emission, regenerate
- (b) Defer with rationale — the dead code was already removed
  from output; the generator capability is dormant

### 2.5.4: Resolve cli/shared barrel (dead-on-arrival)

**Background**: `src/cli/shared/index.ts` in oak-search-cli is a
barrel with zero importers — all CLI code uses deep imports.
Phase 2 trimmed unused re-exports from the barrel.

**Investigation needed**:
1. Verify the barrel truly has zero importers
2. Check whether it was intended as a future API surface
3. Assess whether migration to barrel imports would improve the
   codebase

**Options**:
- (a) Delete the barrel entirely (zero consumers = dead code)
- (b) Migrate CLI imports to use the barrel consistently
- (c) Defer with rationale

## Workflow

For each follow-up:
1. **Investigate** — gather evidence (file reads, grep, ripgrep)
2. **Present options** — describe each option with pros/cons
3. **Owner decides** — wait for decision
4. **Implement** — execute the chosen option
5. **Verify** — run `pnpm knip` and relevant quality gates

## Quality Gate Strategy

After each implementation:

```bash
pnpm knip
pnpm type-check
pnpm lint:fix
pnpm test
```

After all follow-ups are resolved, run the full `pnpm check`.

## Acceptance Criteria

1. Each follow-up has a documented resolution (actioned or
   explicitly deferred with owner rationale)
2. `pnpm knip` still exits 0
3. All quality gates pass
4. Knip triage plan can be marked fully complete
