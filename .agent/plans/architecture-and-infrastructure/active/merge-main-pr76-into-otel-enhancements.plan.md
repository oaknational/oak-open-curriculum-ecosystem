---
name: "Merge main (PR #76) into feat/otel_sentry_enhancements"
overview: >
  Merge origin/main (PR #76 React MCP App + design tokens, 977 files,
  ~78k insertions) into feat/otel_sentry_enhancements (7 commits, 36 files).
  4 text conflicts, 10 files changed on both sides, 33 files deleted by main.
  One hazard: core-endpoints.ts imports deleted tools-list-override.ts.
  ADR-144 numbering collision (both branches created ADR-144 for different things).
status: active
last_updated: 2026-04-11
parent_plan: ./sentry-otel-integration.execution.plan.md
---

# Plan: Merge `origin/main` (PR #76) into `feat/otel_sentry_enhancements`

## Divergence

- Merge base: `54309a6a` (PR #73 merge commit)
- Main: 3 commits ahead (PR #76 + two release commits), 977 files changed
- Branch: 7 commits ahead (docs + rate limiting), 36 files changed
- Asymmetry favours accepting main for most conflicts

## Text Conflicts (4 files)

| File | Resolution |
|------|-----------|
| `.agent/plans/architecture-and-infrastructure/README.md` | Accept main structure, keep our updated status text and date |
| `apps/oak-curriculum-mcp-streamable-http/src/application.ts` | **Semantic** — main restructured the app composition root (widget build pipeline, new `getWidgetHtml` param). Accept main, re-apply rate limiting wiring. |
| `docs/architecture/architectural-decisions/README.md` | **ADR-144 collision** — both branches created ADR-144. Main: "Two-Threshold Fitness Model". Branch: "Multi-Layer Security and Rate Limiting". See Hazard 2 below. |
| `pnpm-lock.yaml` | Accept main, regenerate with `pnpm install` |

## Files Changed on Both Sides (10 files)

Most auto-merge cleanly. The risk zone:

| File | Risk | Notes |
|------|------|-------|
| `application.ts` | **High** | Text conflict — main restructured composition root |
| `ADR README.md` | **High** | ADR-144 numbering collision |
| `plans/arch/README.md` | Low | Both updated status text |
| `plans/arch/active/README.md` | Low | Both updated active plan list |
| `plans/arch/current/README.md` | Low | Both updated queue status |
| `execution.plan.md` | Low | Both updated snapshot; auto-merges |
| `HTTP app README.md` | Low | Both updated; auto-merges |
| `HTTP app package.json` | Low | Both added deps; auto-merges |
| `safety-and-security.md` | Low | Both updated; auto-merges |
| `pnpm-lock.yaml` | Low | Regenerate |

## Hazards

### Hazard 1: `tools-list-override.ts` deleted by main

**File**: `apps/oak-curriculum-mcp-streamable-http/src/tools-list-override.ts`

Main deleted this file. Our branch's `core-endpoints.ts` imports it:
```
import { overrideToolsListHandler } from '../tools-list-override.js';
```

**Resolution**: Accept main's deletion. Check what `overrideToolsListHandler`
did and whether main replaced it with a different mechanism (likely moved into
the MCP App widget registration or `registerAppTool` from `ext-apps`). Adapt
`core-endpoints.ts` to use main's approach.

### Hazard 2: ADR-144 numbering collision

Both branches independently created ADR-144:
- **Branch**: `144-multi-layer-security-and-rate-limiting.md`
- **Main**: `144-two-threshold-fitness-model.md`

Main also added ADR-145 through ADR-156. Both files have different filenames
so Git merges them without conflict — but the numbering is broken.

**Resolution**: Renumber our ADR-144 to the next available number after
main's highest (ADR-156 → ours becomes **ADR-157**). Update the file, the
ADR index, all internal references, and cross-references in plans, prompts,
safety-and-security.md, and code comments.

### Hazard 3: `register-resources.ts` structural change

Main restructured resource registration significantly:
- Deleted `register-json-resources.ts` (our branch imported from it in the
  previous merge, but that was already adapted)
- Added `register-widget-resource.ts` as a separate module
- Changed `registerAllResources` signature to accept `getWidgetHtml` param
- Changed `registerHandlers` to pass `getWidgetHtml`

Our branch's `register-resources.ts` auto-merges from main (we didn't touch
it this session), but callers in our `application.ts` and test files must
match the new signatures.

### Hazard 4: `application.ts` composition root restructured

Main restructured the app composition root to support the widget build
pipeline. Our branch added rate limiting wiring to this file. The text
conflict will require careful merging of both sets of changes.

## Resolution Order

1. **Trivial**: accept main for `pnpm-lock.yaml`, plan READMEs
2. **ADR collision**: renumber our ADR-144 → ADR-157
3. **Semantic**: resolve `application.ts` — accept main's structure, re-apply
   rate limiting wiring
4. **Hazard 1**: adapt `core-endpoints.ts` for deleted `tools-list-override`
5. **Non-conflicting adaptations**: check auto-merged files for signature
   mismatches
6. `pnpm install` to regenerate lockfile
7. `pnpm type-check` immediately — catches silent breaks
8. `pnpm check` — full verification
9. **Post-merge observability gap analysis** — verify new widget resource
   handler is wrapped, characterisation tests pass, no gaps in new code

## Post-Merge Scope Assessment

After the merge is clean and gates pass:

1. Verify all `wrapResourceHandler()` / `wrapToolHandler()` usage on new
   and changed handlers
2. Check if the new widget Vite build pipeline interacts with any
   observability paths
3. Check if new Turbo tasks need observability configuration
4. Run characterisation tests to confirm observability wiring survived
5. Assess whether the scope of Search CLI adoption needs expanding based
   on any new patterns from PR #76

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| `core-endpoints.ts` import break | High | Medium | Adapt to main's replacement |
| ADR numbering collision missed | High | Low | Explicit renumber step |
| `application.ts` merge error | Medium | High | Careful semantic merge |
| Observability gap in new widget | Low | Medium | Post-merge gap analysis |
| Rate limiting wiring lost | Medium | Medium | Re-apply after accepting main |

## Estimated Complexity

- **Text conflicts**: 4 files (2 trivial, 2 semantic)
- **Hazards**: 4 (1 import cascade, 1 ADR collision, 2 signature changes)
- **Non-conflicting adaptations**: ~5 files (auto-merged but may need params)
- **Scale**: Much smaller than the PR #70 merge (4 conflicts vs 22)
