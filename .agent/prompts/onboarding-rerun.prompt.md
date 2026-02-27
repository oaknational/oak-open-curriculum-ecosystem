---
prompt_id: onboarding-rerun
title: "M0 Final Gates — Post W1-W13"
type: handover
status: active
last_updated: 2026-02-27
---

# M0 Final Gates — Post W1-W13

Session entry point. This prompt and the release plan together define the
full scope of work.

## Context (completed work)

All documentation remediation complete: N-items (17), V-items (9),
W-items (13), plus the rename from "Oak MCP Ecosystem" to
"Oak Open Curriculum Ecosystem" (2026-02-27). Quality gates green. Repo
slug is now `oaknational/oak-open-curriculum-ecosystem`.

## What remains (human-driven)

These are the final M0 gates. Steps 1-2 can be agent-assisted; 3-4
require human action:

1. Final secrets and PII sweep (`pnpm secrets:scan:all`)
2. Update M0 milestone status in
   [m0-open-private-alpha.md](../milestones/m0-open-private-alpha.md)
3. Manual sensitive-information review
4. Merge `feat/semantic_search_deployment` to `main` and make public

## If snags arise

1. Read [release-plan-m1.plan.md](../plans/release-plan-m1.plan.md)
2. Read [rules.md](../directives/rules.md),
   [testing-strategy.md](../directives/testing-strategy.md), and
   [schema-first-execution.md](../directives/schema-first-execution.md)
3. Read [distilled.md](../memory/distilled.md) and
   [napkin.md](../memory/napkin.md)
4. Fix the issue, run quality gates, consolidate

## Reference

- Release plan: `.agent/plans/release-plan-m1.plan.md`
- Onboarding tracker: `.agent/plans/developer-experience/onboarding-simulations-public-alpha-readiness.md`
- M0 milestone: `.agent/milestones/m0-open-private-alpha.md`
- Code patterns: `.agent/memory/code-patterns/README.md`
