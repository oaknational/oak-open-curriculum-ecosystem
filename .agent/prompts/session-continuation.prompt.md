---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-03-29
---

# Session Continuation

## Ground First

1. Read `.agent/directives/AGENT.md` and `.agent/directives/principles.md`
2. Read the active plan:
   `.agent/plans/architecture-and-infrastructure/active/ci-consolidation-and-gate-parity.plan.md`
3. Re-establish live branch state instead of trusting stale document
   snapshots:

```bash
git status --short
git diff --cached --stat
git log --oneline --decorate origin/feat/mcp_app..HEAD
```

## This Prompt's Role

- This file is the operational entry point only.
- The active plan is authoritative for scope, sequencing, acceptance
  criteria, and detailed validation.
- Do not duplicate volatile git facts, long file inventories, or full
  plan detail here.

## Immediate Priority

1. Finish the in-progress Phase 3 generated-data and eslint-disable
   remediation slice in `packages/sdks/oak-sdk-codegen/` and its
   `curriculum-sdk` consumer.
2. Reuse the shipped prerequisite-graph JSON loader pattern for the
   remaining large generated datasets.
3. Keep the completed CI consolidation closed unless fresh CI evidence
   proves a regression.

## Durable Guidance

- `pnpm check` is the decisive full-repo verification command.
- Use package-scoped loops only for iteration.
- `apps/oak-curriculum-mcp-stdio` is outside the current workspace
  graph; do not let it displace the HTTP/codegen path.
- Do not rely on stash ordinals as continuation state.
- The active plan contains the detailed follow-on order for logger, DI
  fake, authored-code, and documentation work.

## Key References

- Active plan:
  `.agent/plans/architecture-and-infrastructure/active/ci-consolidation-and-gate-parity.plan.md`
- CI workflow: `.github/workflows/ci.yml`
- Reporter: `scripts/ci-turbo-report.mjs`
- Enforcement rule:
  `packages/core/oak-eslint/src/rules/no-eslint-disable.ts`

## Quality Gates

Full verification: `pnpm check`
Auto-fix: `pnpm fix`
