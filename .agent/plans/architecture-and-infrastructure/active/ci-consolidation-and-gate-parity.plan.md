---
name: "CI Consolidation, Gate Parity, and eslint-disable Remediation"
overview: "Finish the remaining eslint-disable remediation and documentation work after the completed CI consolidation and widget cleanup."
todos:
  - id: phase-0-foundation
    content: "Phase 0: Verify foundation assumptions — catalogue eslint-disable instances, confirm widget deletion scope, verify Turbo graph."
    status: done
  - id: phase-1-eslint-enforcement
    content: "Phase 1: Add ESLint rule to detect and ban all eslint-disable comments."
    status: done
  - id: phase-2-widget-deletion
    content: "Phase 2: Delete dead widget Playwright tests and supporting infrastructure."
    status: done
  - id: phase-3-eslint-remediation
    content: "Phase 3: Remediate the remaining actionable eslint-disable and TS directive debt, led by the generated-data rollout."
    status: pending
  - id: phase-4-reporter-script
    content: "Phase 4: Create CI reporter script (TDD) — parses Turbo --summarize JSON, emits GitHub Step Summary and annotations."
    status: done
  - id: phase-5-ci-consolidation
    content: "Phase 5: Consolidate CI workflow — single Turbo invocation, add missing gates, wire reporter."
    status: done
  - id: phase-6-documentation
    content: "Phase 6: Propagate the settled enforcement and CI decisions into permanent documentation."
    status: pending
---

# CI Consolidation, Gate Parity, and eslint-disable Remediation

**Last Updated**: 2026-03-29
**Status**: 🟢 IN PROGRESS — CI consolidation and widget cleanup are complete; the remaining work is eslint-disable remediation plus documentation propagation.
**Scope**: Complete the remaining remediation work without reopening settled CI and widget decisions unless fresh evidence disproves them.

## Document Role

- This plan is the authoritative source for this workstream's scope,
  sequencing, remaining tasks, and validation.
- The session prompt should stay short and operational, and should link
  here instead of duplicating plan detail.
- Volatile git facts are not authoritative in this file. Re-establish
  them at session start with live git commands.

## Durable Current State

- Phases 0-2 and 4-5 are complete.
- Phase 3 is in progress. The prerequisite-graph generated-data slice
  proved the baseline pattern that should now be reused for the
  remaining large generated datasets.
- Phase 6 remains after the remediation work is stable enough to
  document without churn.
- `pnpm check` is the decisive full-repo verification command.
- `apps/oak-curriculum-mcp-stdio` is outside the current root workspace
  graph and must not displace the HTTP/codegen path work.

## Completed Baseline

- ESLint enforcement exists via `@oaknational/no-eslint-disable`.
- Dead widget Playwright tests and renderer test infrastructure were
  deleted; landing-page coverage was kept.
- CI now batches Turbo gates through one invocation and reports via the
  Turbo summary reporter.
- The prerequisite-graph slice established the approved generated-data
  pattern:
  - `data.json` + `types.ts` + `index.ts`
  - JSON copied into `dist`
  - runtime consumers updated to use the typed loader

The remaining work should extend these settled patterns, not redesign
them.

## Remaining Problem

The branch risk is no longer CI structure. The remaining risk is the
unfinished remediation surface:

- remaining actionable `eslint-disable` and TS directive debt
- incomplete rollout of the JSON loader pattern across the large
  generated datasets
- documentation drift between the implemented system and the permanent
  docs/prompt surfaces

## Quality Gate Strategy

Use fast package-scoped loops while iterating, then run the full repo
gate before commit or push.

### Local loops

```bash
pnpm --filter @oaknational/sdk-codegen type-check
pnpm --filter @oaknational/sdk-codegen lint
pnpm --filter @oaknational/sdk-codegen test
pnpm --filter @oaknational/curriculum-sdk type-check
pnpm --filter @oaknational/curriculum-sdk test
```

### Decisive verification

```bash
pnpm check
```

## Non-Goals

- Reopening the completed CI consolidation unless fresh CI evidence
  disproves it
- Reintroducing widget test infrastructure for the deleted ChatGPT
  widget path
- Moving suppressions from inline comments into config overrides
- Touching `type-helpers` user-approved exceptions
- Treating stash ordinals as durable continuation state
- Investing in standalone stdio maintenance instead of either
  de-scoping or replacing it safely

## Foundation Alignment

Before each substantial step:

1. Re-read `.agent/directives/principles.md`
2. Re-read `.agent/directives/testing-strategy.md`
3. Re-read `.agent/directives/schema-first-execution.md`
4. Ask: could it be simpler without compromising quality?

## Remaining Execution Plan

### Phase 3: Remediate existing `eslint-disable` comments

**Goal**: remove the remaining directive debt by fixing root causes, not
relocating suppressions.

#### TDD mode for each category

1. **RED**: add or adjust the smallest failing test that proves the
   required behaviour or generator contract
2. **GREEN**: implement the minimal change using the established
   pattern
3. **REFACTOR**: remove obsolete code and comments, tighten docs, and
   simplify the boundary

#### Execution order

1. Extend the shipped JSON loader pattern across the remaining large
   generated vocab datasets.
2. Remove any generator output that still emits suppression strings.
3. Move logger remediation ahead of broad fake cleanup.
4. Clean the easy DI fake cases first, then extract the narrow
   `McpToolRegistrar` seam in streamable-http and remove the related
   config override.
5. Tackle authored-code `max-lines`, `max-lines-per-function`,
   `complexity`, and `max-statements` cases.
6. Finish the `Object.*`, async callback, restricted-type, and TS
   directive stragglers.
7. Promote `@oaknational/no-eslint-disable` from `warn` to `error` only
   when the remaining actionable count reaches zero.

#### Established pattern to reuse

Use the prerequisite-graph slice as the single baseline:

- generators write `data.json`, `types.ts`, and `index.ts`
- consumers import the typed loader, not huge TypeScript data files
- generated JSON assets are copied into build output
- tests prove both generator output and consumer behaviour

Do not use `stash@{n}` as execution input. If historical work is
needed, inspect it explicitly first.

#### Category guidance

- Generated data: prefer JSON + typed loader, not chunked TypeScript
  outputs
- Logger: replace custom sanitisation plumbing with an off-the-shelf
  stringify path that preserves `unknown` at the boundary
- Test fakes: narrow interfaces via DI, not `as`
- Authored code: split files and functions by responsibility instead of
  weakening rules
- Miscellaneous rule fixes: prefer `typeSafeEntries`,
  `typeSafeKeys`, `typeSafeValues`, and small async wrappers

#### Acceptance criteria

1. No actionable `eslint-disable` comments remain
2. No actionable `@ts-ignore`, `@ts-expect-error`, or `@ts-nocheck`
   comments remain
3. The remaining large generated datasets use the shared JSON loader
   pattern
4. The streamable-http override seam is fixed by narrowing the
   interface, not by keeping config exceptions
5. `pnpm check` passes

#### Deterministic validation

```bash
grep -r "eslint-disable" --include="*.ts" --include="*.mjs" --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.turbo . | grep -v "node_modules" | grep -v "jc:" | grep -v "type-helpers/src/index.ts" | wc -l
pnpm check
```

### Phase 6: Documentation and validation

**Goal**: align permanent docs with the settled enforcement and CI
decisions, and keep the prompt concise.

#### Tasks

1. Update ADR-065 where CI consolidation changes documented gate
   surfaces or rationale.
2. Update `docs/engineering/build-system.md` where the authoritative
   gate surface changed.
3. Update `.agent/directives/testing-strategy.md` only where the
   implemented behaviour changed stable testing guidance.
4. Update `.agent/directives/principles.md` only where the enforcement
   mechanism itself needs explicit documentation.
5. Keep the session prompt short and make it point back to this plan
   for detail.

#### Acceptance criteria

1. Permanent docs reflect the actual implemented system
2. The session prompt is concise and operational only
3. No duplicate or contradictory facts remain between prompt and plan
4. `pnpm check` still passes after documentation-affecting edits that
   trigger gates

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Remaining remediation scope is still large | High | Branch drags on and accumulates more drift | Ship by category and do not reopen settled CI work |
| Generated-data rollout diverges between datasets | Medium | Multiple loader patterns and future drift | Treat prerequisite-graph as the single approved baseline |
| Volatile git facts go stale again | High | Bad continuation guidance and wrong next actions | Keep volatile state out of docs and inspect git live at session start |
| Stdio legacy surfaces consume attention | Medium | Time lost on a non-critical path | Keep stdio explicitly de-scoped unless replacement or retirement work requires it |

## Success Criteria

- This plan remains the authoritative, concise source for the
  workstream
- The prompt remains a short operational entry point instead of a
  second plan
- Remaining remediation finishes without reintroducing suppressions or
  compatibility layers
- Full repo verification passes via `pnpm check`

## References

- `.github/workflows/ci.yml`
- `scripts/ci-turbo-report.mjs`
- `packages/core/oak-eslint/src/rules/no-eslint-disable.ts`
- `docs/architecture/architectural-decisions/065-turbo-task-dependencies.md`
- `.agent/directives/principles.md`
- `.agent/directives/testing-strategy.md`
- `.agent/directives/schema-first-execution.md`
