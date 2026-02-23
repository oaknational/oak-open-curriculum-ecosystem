# Modernise quality-and-maintainability/ and architecture/ Plan Directories

## Context

Two plan directories need analysis and modernisation to match current
planning standards. This work follows the consolidation of
`pipeline-enhancements/` into `sdk-and-mcp-enhancements/` (completed
2026-02-23).

## Objective

Analyse all plans in both directories. For each document, determine
whether it should be: kept as-is, rewritten, consolidated with another
document, moved to the icebox, archived as completed, or deleted.

At the end, both directories should contain only documents that meet
modern planning standards: clear status, actionable content, no stale
assumptions, no redundancy, and proper cross-referencing.

## Grounding

Start with `/jc-start-right`. Read the foundation documents.

Key references for this task:

- `.agent/plans/high-level-plan.md` — strategic index; shows which plans
  from these directories are referenced at milestone level
- `.agent/plans/completed-plans.md` — canonical completion index
- `.agent/plans/README.md` — plan collection standards
- `.agent/directives/rules.md` — the rules

## Directories to Analyse

### `.agent/plans/quality-and-maintainability/` (13 files)

| File | Quick Assessment |
|------|-----------------|
| `no-console-enforcement.plan.md` | Likely current — referenced in high-level-plan Milestone 1 pre-alpha work |
| `contract-testing-schema-evolution.plan.md` | Speculative — icebox candidate? |
| `observability-and-quality-metrics.plan.md` | Speculative — referenced in high-level-plan Milestone 3 |
| `test-isolation-architecture-fix.md` | COMPLETE — not archived |
| `node-sdk-config-and-di-remediation-plan.md` | Dated 2025-02-14 — staleness risk; may overlap with architecture/config-standardisation |
| `global-state-elimination-and-testing-discipline-plan.md` | IN PROGRESS dated 2025-12-22 — staleness risk; may overlap with test-isolation and DI plans |
| `eslint/index.md` | Index file — assess whether ESLint subdirectory should be consolidated |
| `eslint/eslint-plugin-standards-research.md` | Reference doc — assess currency |
| `eslint/eslint-max-files-per-dir.md` | Design doc — assess currency |
| `eslint/eslint-max-files-per-dir-implementation-plan.md` | Dated 2025-02-14 — staleness risk |
| `eslint/eslint-enhancement-plan.md` | Phase 5 In Progress — assess actual progress |
| `COMPLETION-REPORT-2025-12-22.md` | COMPLETE — not archived |
| `ANALYSIS-test-isolation-root-cause.md` | Analysis complete — not archived |

### `.agent/plans/architecture/` (5 files)

| File | Quick Assessment |
|------|-----------------|
| `stdio-http-server-alignment.md` | BACKLOG, recent (2026-02-17) — referenced in high-level-plan Milestone 1 |
| `config-architecture-standardisation-plan.md` | READY TO START dated 2025-12-17 — may overlap with quality-and-maintainability/node-sdk-config |
| `matchmedia-di-refactoring-plan.md` | CRITICAL BLOCKING dated 2025-12-21 — but the fix appears COMPLETE in quality-and-maintainability/test-isolation-architecture-fix.md |
| `shared-error-library-plan.md` | Future Work dated 2025-11-06 — icebox candidate |
| `logger-sentry-otel-integration-plan.md` | Ready for implementation dated 2025-11-11 — likely stale given ADR-051 logger rework |

## Key Questions to Answer for Each Document

1. Is the work described still relevant? Check against current code state.
2. Is the plan stale? Validate file paths, ADR references, and
   assumptions against the current codebase.
3. Is there overlap or duplication with another plan?
4. Is the plan referenced from `high-level-plan.md` or other active
   documents?
5. Does the document contain documentation that should be extracted to
   a permanent location before archiving?

## Decision Categories

- **Keep**: Up to date, properly structured, actively referenced.
- **Rewrite**: Core concept is valid but document is stale or poorly
  structured.
- **Consolidate**: Overlaps with another document — merge into one.
- **Icebox**: Useful concept but speculative/distant — create an icebox
  stub.
- **Archive**: Work is complete — move to archive, add to
  `completed-plans.md`, fix references.
- **Delete**: Obsolete, superseded, or no remaining value.

## Cross-Cutting Concerns

1. **Neither directory has a README.md** — create one for each (or merge
   the directories if their domains overlap sufficiently).
2. **Three completed plans in quality-and-maintainability/ are not
   archived** — archive them properly.
3. **The matchMedia plan in architecture/ appears to describe work that
   is already complete** — verify and resolve.
4. **Potential overlap** between config-architecture-standardisation and
   node-sdk-config-and-di-remediation — determine if these are the same
   initiative or complementary.
5. **ESLint subdirectory (5 files)** — assess whether this should remain
   as a subdirectory or be consolidated.
6. **Update `high-level-plan.md`** and `plans/README.md` after any
   structural changes.

## Constraints

- Follow the cardinal rule: plans are not documentation. Extract any
  settled documentation to permanent locations before archiving.
- Do not create summary documents.
- Use British spelling and date formats.
- Run `pnpm markdownlint:root` after changes.

## Quality Gate

After all changes, verify:

```bash
pnpm markdownlint:root
```

And check for broken references:

```bash
rg "quality-and-maintainability\|architecture/" .agent/plans/high-level-plan.md .agent/plans/README.md
```
