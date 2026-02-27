---
prompt_id: onboarding-rerun
title: "M0 Final Gates and V1-V10 Validation Findings"
type: handover
status: active
last_updated: 2026-02-27
---

# M0 Final Gates and V1-V10 Validation Findings

Session entry point. This prompt and the release plan together define the
full scope of work.

## Context (completed work)

N1-N21 documentation fixes and final onboarding validation are complete
(2026-02-27). N10 generator `as` casts eliminated. Two code patterns
extracted. Final validation with 4 personas confirmed fixes effective but
discovered 10 new findings (V1-V10).

## Step 1: Ground yourself

1. Read [release-plan-m1.plan.md](../plans/release-plan-m1.plan.md). It
   is self-contained. Pay particular attention to:
   - §Next Steps (what remains for M0)
   - §Remaining M0 gates
2. Read [rules.md](../directives/rules.md),
   [testing-strategy.md](../directives/testing-strategy.md), and
   [schema-first-execution.md](../directives/schema-first-execution.md).
3. Read [distilled.md](../memory/distilled.md) and
   [napkin.md](../memory/napkin.md).
4. Read the V1-V10 findings in
   [onboarding-simulations-public-alpha-readiness.md](../plans/developer-experience/onboarding-simulations-public-alpha-readiness.md).

## Step 2: Fix V1-V2 (P1 stale paths)

V1 and V2 are P1 items — stale file paths in `extending.md` and
`CONTRIBUTING.md` that send contributors to empty directories. Fix these
first.

After fixes:

```bash
pnpm build && pnpm type-check && pnpm lint:fix && pnpm format:root && pnpm markdownlint:root && pnpm test
```

## Step 3: Triage V3-V10 (P2 items)

Review each P2 finding. Fix what can be fixed quickly; document any that
require broader decisions as future work in the release plan.

## Step 4: Remaining M0 gates

After V1-V2 are resolved:

1. Final secrets and PII sweep (`pnpm secrets:scan:all`)
2. Update M0 milestone status in
   [m0-open-private-alpha.md](../milestones/m0-open-private-alpha.md)

Items 3-4 below require human action:

3. Manual sensitive-information review
4. Merge `feat/semantic_search_deployment` to `main` and make public

## Step 5: Consolidation

Run `/jc-consolidate-docs` to ensure no documentation is trapped in
ephemeral locations.

## Reference

- Release plan: `.agent/plans/release-plan-m1.plan.md`
- Onboarding tracker: `.agent/plans/developer-experience/onboarding-simulations-public-alpha-readiness.md`
- M0 milestone: `.agent/milestones/m0-open-private-alpha.md`
- Code patterns: `.agent/memory/code-patterns/README.md`
