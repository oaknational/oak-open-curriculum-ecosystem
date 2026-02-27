---
prompt_id: onboarding-rerun
title: "M0 Final Gates — W1-W13 Fixes"
type: handover
status: active
last_updated: 2026-02-27
---

# M0 Final Gates — W1-W13 Fixes

Session entry point. This prompt and the release plan together define the
full scope of work.

## Context (completed work)

V1-V10 fixes complete. Post-V-fix onboarding review complete (2026-02-27,
4 personas: junior dev, lead dev, CTO, CEO). V fixes verified effective.
No genuine P1 blockers. 13 new items (W1-W13) identified and dispositioned
— all fix before M0.

## Step 1: Ground yourself

1. Read [release-plan-m1.plan.md](../plans/release-plan-m1.plan.md). Pay
   particular attention to:
   - §Post-Review Documentation Fixes (W1-W13)
   - §Remaining M0 gates
2. Read [rules.md](../directives/rules.md),
   [testing-strategy.md](../directives/testing-strategy.md), and
   [schema-first-execution.md](../directives/schema-first-execution.md).
3. Read [distilled.md](../memory/distilled.md) and
   [napkin.md](../memory/napkin.md).

## Step 2: Fix W1-W13

Fix all 13 items per the descriptions in the release plan. Group by file
for efficiency (several items touch `README.md`, `CONTRIBUTING.md`,
`docs/operations/environment-variables.md`).

After fixes:

```bash
pnpm build && pnpm type-check && pnpm lint:fix && pnpm format:root && pnpm markdownlint:root && pnpm test
```

## Step 3: Remaining M0 gates

After W-fixes and quality gates pass:

1. Final secrets and PII sweep (`pnpm secrets:scan:all`)
2. Update M0 milestone status in
   [m0-open-private-alpha.md](../milestones/m0-open-private-alpha.md)

Items 3-4 below require human action:

3. Manual sensitive-information review
4. Merge `feat/semantic_search_deployment` to `main` and make public

## Step 4: Consolidation

Run `/jc-consolidate-docs` to ensure no documentation is trapped in
ephemeral locations.

## Reference

- Release plan: `.agent/plans/release-plan-m1.plan.md`
- Onboarding tracker: `.agent/plans/developer-experience/onboarding-simulations-public-alpha-readiness.md`
- M0 milestone: `.agent/milestones/m0-open-private-alpha.md`
- Code patterns: `.agent/memory/code-patterns/README.md`
