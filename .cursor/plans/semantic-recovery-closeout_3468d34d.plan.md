---
name: semantic-recovery-closeout
overview: Close the semantic-search recovery lane by completing Task 2.3 remediation, aligning docs/ADR authority, and clearing full reviewer and quality-gate closure evidence.
todos:
  - id: reviewer-triage-round1
    content: Run full readonly reviewer roster and produce a must-fix/high remediation log for Task 2.3 scope.
    status: completed
  - id: task-2-3-taxonomy-types
    content: Execute Task 2.3 test taxonomy and type-discipline remediation across CLI/SDK lifecycle and retrieval tests.
    status: completed
  - id: boundary-simplification-close
    content: Resolve remaining boundary ownership simplification issues, including alias-only ingest shim pattern.
    status: completed
  - id: phase-3-doc-adr-sync
    content: Synchronise prompt, runbook, operations doc, and ADR doctrine language with implemented runtime guardrails.
    status: completed
  - id: phase-4-reviewer-convergence
    content: Re-run affected reviewers iteratively until no unresolved must-fix/high findings remain.
    status: completed
  - id: phase-4-full-gates
    content: Run full one-gate-at-a-time quality sequence with restart-on-fix and record closure evidence in the recovery plan.
    status: in_progress
isProject: false
---

# Semantic Search Recovery Closeout Plan

## Goal

Complete the remaining implementation and closure work for the active recovery lane so Phase 2, Phase 3, and Phase 4 can be marked complete with deterministic evidence.

## Scope And Boundaries

- In scope: Task 2.3 remediation, doc/ADR synchronisation, reviewer convergence, and full quality-gate closure for the existing active lane in `[/Users/jim/code/oak/oak-mcp-ecosystem/.agent/plans/semantic-search/active/semantic-search-recovery-and-guardrails.execution.plan.md](/Users/jim/code/oak/oak-mcp-ecosystem/.agent/plans/semantic-search/active/semantic-search-recovery-and-guardrails.execution.plan.md)`.
- Out of scope: new feature lanes, re-running completed Phase 0/1 incident recovery unless fresh regression evidence appears.

## Current State Snapshot

- Guardrail runtime work is largely landed (lease contract, mapping-contract enforcement, alias swap hardening) in:
  - `[/Users/jim/code/oak/oak-mcp-ecosystem/packages/sdks/oak-search-sdk/src/admin/lifecycle-lease-infra.ts](/Users/jim/code/oak/oak-mcp-ecosystem/packages/sdks/oak-search-sdk/src/admin/lifecycle-lease-infra.ts)`
  - `[/Users/jim/code/oak/oak-mcp-ecosystem/packages/sdks/oak-search-sdk/src/admin/index-meta-mapping-contract.ts](/Users/jim/code/oak/oak-mcp-ecosystem/packages/sdks/oak-search-sdk/src/admin/index-meta-mapping-contract.ts)`
  - `[/Users/jim/code/oak/oak-mcp-ecosystem/packages/sdks/oak-search-sdk/src/admin/alias-operations.ts](/Users/jim/code/oak/oak-mcp-ecosystem/packages/sdks/oak-search-sdk/src/admin/alias-operations.ts)`
- Remaining closure risk is concentrated in Task 2.3 test-doctrine/type-discipline clean-up and final reviewer/gate evidence.

## Implementation Phases

### Phase A: Reviewer-First Triage (Mandatory Restart)

1. Run the full required reviewer roster in readonly mode, using the order defined in Phase 4 Task 4.1.
2. Classify findings into: must-fix/high (blocking), medium, and rejected-with-rationale.
3. Create a single remediation log (issue -> owner file -> fix strategy -> validation command) to prevent drift across iterations.

### Phase B: Task 2.3 Remediation Execution

1. **Test taxonomy correction**

- Ensure `*.unit.test.ts` files contain pure/no-mock tests only.
- Move integration-style behaviours into `*.integration.test.ts` where needed.
- Primary surfaces:
  - `[/Users/jim/code/oak/oak-mcp-ecosystem/packages/sdks/oak-search-sdk/src/admin/lifecycle-lease.unit.test.ts](/Users/jim/code/oak/oak-mcp-ecosystem/packages/sdks/oak-search-sdk/src/admin/lifecycle-lease.unit.test.ts)`
  - `[/Users/jim/code/oak/oak-mcp-ecosystem/packages/sdks/oak-search-sdk/src/admin/lifecycle-lease-infra.ts](/Users/jim/code/oak/oak-mcp-ecosystem/packages/sdks/oak-search-sdk/src/admin/lifecycle-lease-infra.ts)`
  - retrieval tests in `[/Users/jim/code/oak/oak-mcp-ecosystem/packages/sdks/oak-search-sdk/src/retrieval/](/Users/jim/code/oak/oak-mcp-ecosystem/packages/sdks/oak-search-sdk/src/retrieval/)`

1. **Type-discipline clean-up in tests**

- Remove `as unknown as` and Object-mutation shortcuts in touched tests.
- Replace with compile-time-safe builders and native ES error types.
- Priority file: `[/Users/jim/code/oak/oak-mcp-ecosystem/packages/sdks/oak-search-sdk/src/retrieval/search-sequences.integration.test.ts](/Users/jim/code/oak/oak-mcp-ecosystem/packages/sdks/oak-search-sdk/src/retrieval/search-sequences.integration.test.ts)`.

1. **Boundary simplification follow-through**

- Remove/replace alias-only fake ingest shim pattern and keep one canonical ownership boundary for lifecycle contracts.
- Primary surfaces:
  - `[/Users/jim/code/oak/oak-mcp-ecosystem/apps/oak-search-cli/src/cli/admin/admin-lifecycle-alias-commands.ts](/Users/jim/code/oak/oak-mcp-ecosystem/apps/oak-search-cli/src/cli/admin/admin-lifecycle-alias-commands.ts)`
  - `[/Users/jim/code/oak/oak-mcp-ecosystem/apps/oak-search-cli/src/cli/admin/shared/build-lifecycle-service.ts](/Users/jim/code/oak/oak-mcp-ecosystem/apps/oak-search-cli/src/cli/admin/shared/build-lifecycle-service.ts)`
  - `[/Users/jim/code/oak/oak-mcp-ecosystem/packages/sdks/oak-search-sdk/src/admin/build-lifecycle-deps.ts](/Users/jim/code/oak/oak-mcp-ecosystem/packages/sdks/oak-search-sdk/src/admin/build-lifecycle-deps.ts)`

1. Validate Phase B at workspace scope:

- `pnpm --filter @oaknational/search-cli type-check`
- `pnpm --filter @oaknational/search-cli lint`
- `pnpm --filter @oaknational/search-cli test`
- `pnpm --filter @oaknational/oak-search-sdk type-check`
- `pnpm --filter @oaknational/oak-search-sdk lint`
- `pnpm --filter @oaknational/oak-search-sdk test`

### Phase C: Phase 3 Documentation And ADR Sync

1. Align operational sequencing and authority split across:

- `[/Users/jim/code/oak/oak-mcp-ecosystem/.agent/prompts/semantic-search/semantic-search.prompt.md](/Users/jim/code/oak/oak-mcp-ecosystem/.agent/prompts/semantic-search/semantic-search.prompt.md)`
- `[/Users/jim/code/oak/oak-mcp-ecosystem/.agent/plans/semantic-search/active/semantic-search-ingest-runbook.md](/Users/jim/code/oak/oak-mcp-ecosystem/.agent/plans/semantic-search/active/semantic-search-ingest-runbook.md)`
- `[/Users/jim/code/oak/oak-mcp-ecosystem/docs/operations/elasticsearch-ingest-lifecycle.md](/Users/jim/code/oak/oak-mcp-ecosystem/docs/operations/elasticsearch-ingest-lifecycle.md)`

1. Ensure ADR doctrine is explicitly reflected and index-linked for:

- alias swap strictness (`must_exist=true`) and metadata/alias coherence preconditions in `[/Users/jim/code/oak/oak-mcp-ecosystem/docs/architecture/architectural-decisions/130-blue-green-index-swapping.md](/Users/jim/code/oak/oak-mcp-ecosystem/docs/architecture/architectural-decisions/130-blue-green-index-swapping.md)`

1. Run `pnpm markdownlint:root` after doc updates.

### Phase D: Phase 4 Final Closure

1. Re-run affected reviewers after fixes; continue until no unresolved must-fix/high findings.
2. Execute full one-gate-at-a-time quality sequence with restart-on-fix from `pnpm secrets:scan:all`.
3. Capture closeout evidence in the active recovery plan and confirm phase status/todos are aligned.

## Deterministic Gate Sequence (Final)

- `pnpm secrets:scan:all`
- `pnpm clean`
- `pnpm sdk-codegen`
- `pnpm build`
- `pnpm type-check`
- `pnpm doc-gen`
- `pnpm lint:fix`
- `pnpm format:root`
- `pnpm markdownlint:root`
- `pnpm subagents:check`
- `pnpm portability:check`
- `pnpm test`
- `pnpm test:ui`
- `pnpm test:e2e`
- `pnpm smoke:dev:stub`

## Exit Criteria

- Task 2.3 acceptance criteria fully met with passing deterministic validation commands.
- Phase 3 docs/ADR surfaces are mutually consistent and authority-safe.
- Full reviewer roster converged (no unresolved must-fix/high findings).
- Full gate sequence passes end-to-end with restart-on-fix discipline.
- Active recovery plan status updated to reflect completed phases and evidence links.
