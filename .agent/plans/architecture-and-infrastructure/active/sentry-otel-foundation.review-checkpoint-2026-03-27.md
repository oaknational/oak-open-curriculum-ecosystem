# Sentry + OpenTelemetry Foundation — Review Checkpoint (2026-03-27)

## Scope

This checkpoint records review status for the **handover bundle**:

1. `active/sentry-otel-integration.execution.plan.md`
2. `.agent/prompts/architecture-and-infrastructure/sentry-otel-foundation.prompt.md`
3. `future/observability-and-quality-metrics.plan.md`
4. `architecture-and-infrastructure/README.md`
5. `architecture-and-infrastructure/current/README.md`
6. `architecture-and-infrastructure/future/README.md`
7. `.agent/prompts/README.md`
8. `.agent/memory/napkin.md`
9. ADR-117 and ADR-141

This file is authoritative for whether the handover bundle can be trusted after
session compression. It is not the later post-implementation code-review
record.

## Current Status

**Status: cleared for restart**

The first review round found real documentation and plan-quality issues, and
those findings have now been folded back into the rewritten bundle. The
refreshed reviewer matrix has re-checked the rewritten documents and found no
remaining blocker findings.

Execution-state addendum, same date:

- The active plan and thin prompt have now been refreshed again to foreground
  the Phase 1 code-review blocker bundle.
- This does not revoke handover-bundle restart clearance; it changes the next
  execution step from "start Phase 1 implementation" to "fix the blocker
  bundle first".
- The remaining architectural branch has now been removed from the handover:
  the chosen resolution is to move provider-neutral observability into `core`
  and replace bespoke sibling-lib allow-lists with an explicit layered-library
  rule.

## Findings Being Closed by the Current Rewrite

1. ADR-117 authority drift between plan, prompt, checkpoint, and napkin
2. Lane ambiguity from keeping the umbrella observability plan in `current/`
3. Prompt duplication of plan-owned facts and missing restart-reading links
4. Missing TDD phases and deterministic validation commands in the active plan
5. Under-specified `LogEvent`, `Result<T, E>`, MCP metadata, and
   `SENTRY_MODE` type contracts
6. Under-specified fail-closed config, kill-switch proof, release resolution,
   and shared config-builder defaults
7. Under-specified privacy rules for redaction breadth, evidence hygiene,
   correlation fallback, outbound trace propagation, and Sentry hooks
8. Under-specified Sentry runtime rules for manual-only init strategy and
   Search CLI bounded drain

## Reviewer-Matrix Status

Refreshed status against the rewritten bundle:

| Reviewer lens | Status |
|---|---|
| `code-reviewer` | Re-reviewed; no further blocker findings |
| `architecture-reviewer-barney` | Re-reviewed; no further blocker findings |
| `architecture-reviewer-fred` | Re-reviewed; no further blocker findings |
| `architecture-reviewer-betty` | Re-reviewed; no further blocker findings after checkpoint freshness was corrected |
| `architecture-reviewer-wilma` | Re-reviewed; no further blocker findings |
| `test-reviewer` | Re-reviewed; no further blocker findings |
| `type-reviewer` | Re-reviewed; no further blocker findings |
| `config-reviewer` | Re-reviewed; no further blocker findings |
| `security-reviewer` | Re-reviewed; no further blocker findings after checkpoint freshness was corrected |
| `docs-adr-reviewer` | Re-reviewed; no further blocker findings |
| `mcp-reviewer` | Re-reviewed; no further blocker findings |
| `sentry-reviewer` | Re-reviewed; no further blocker findings |

## Validation Status

1. `pnpm practice:fitness` passes against the current workspace.
2. `git diff --check` passes against the current workspace.
3. `pnpm markdownlint:root` is not runnable in this workspace at present
   because the `markdownlint` CLI dependency is unavailable locally.

## Exit Condition for This Checkpoint

Satisfied:

1. The rewritten bundle is on disk.
2. The full reviewer matrix has been rerun or explicitly re-confirmed against
   the rewritten bundle with no remaining blocker findings.

## Still Required Later

1. The full reviewer pass must be repeated against the runtime implementation
   once shared packages and app adoption code exist.
2. The Sentry-specific review at code time must still check current official
   Sentry documentation, not just these local documents.
3. The blocker bundle now recorded in the active plan must be cleared before
   any HTTP or Search CLI adoption work resumes.
