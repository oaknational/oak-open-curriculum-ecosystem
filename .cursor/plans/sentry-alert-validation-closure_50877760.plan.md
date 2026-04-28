---
name: sentry-alert-validation-closure
overview: "Execute CLI validation of Sentry alert rule 521866 and close the parent Sentry + OTel foundation plan on branch feat/otel_sentry_enhancements. Scope: Parts 1 and 2 only; Part 3 (expansion lanes) deferred to a separate session."
todos:
  - id: run-sentry-api-validation
    content: Load env.local and run the three sentry api calls for rule 521866, project rules list, and org combined-rules
    status: completed
  - id: check-five-acceptance-criteria
    content: Verify rule 521866 against all five acceptance criteria (status, environment, condition, LevelFilter, action, frequency)
    status: completed
  - id: append-outcome-subsection
    content: Append an Outcome (validated 2026-04-17) subsection to alerting-baseline-enumeration-note.md with resolved values and UI URL
    status: completed
  - id: reprobe-oak-preview-alignment
    content: Re-probe oak-preview OAuth metadata endpoint to confirm alignment with current branch HEAD
    status: completed
  - id: close-evidence-item-8
    content: Flip evidence bundle README item 8 from OWNER ACTION REQUIRED to MET and update Outstanding owner action section
    status: cancelled
  - id: flip-parent-step-5-and-todos
    content: Flip Road to Provably Working Sentry step 5 to DONE and frontmatter todos deployment-and-evidence + sentry-credential-provisioning to completed
    status: completed
  - id: update-current-execution-snapshot
    content: Update parent plan Current Execution Snapshot with final foundation closure state and 2026-04-17 validation date (do NOT archive)
    status: completed
  - id: run-fitness-and-check
    content: Run pnpm practice:fitness (advisory) and pnpm check; confirm no new regressions beyond pre-existing foundational-doc violations
    status: completed
  - id: commit-validation-closure
    content: "Commit the validation-only diff with message 'docs(sentry): validate alert rule 521866 and close parent foundation' (no push)"
    status: completed
isProject: false
---

## Scope

This session covers Parts 1 and 2 from the kickoff only. Part 3 (EXP-A/B/C2/D/E/F/G expansion lanes) and Part 4 (branch/PR closure) are explicitly out of scope and will run in later sessions on the same branch.

Branch: `feat/otel_sentry_enhancements` (HEAD `9c3044ff`, pushed).
Working tree already carries the pre-session scaffolding:

- [.agent/plans/architecture-and-infrastructure/evidence/2026-04-16-http-mcp-sentry-validation/alerting-baseline-enumeration-note.md](.agent/plans/architecture-and-infrastructure/evidence/2026-04-16-http-mcp-sentry-validation/alerting-baseline-enumeration-note.md) — "Owner action COMPLETE" + "Validation for the next session" already added
- [.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md](.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md) — snapshot + "Road to Provably Working Sentry" step 5 already reworded to `DONE (pending next-session CLI validation of alert rule 521866)`; `deployment-and-evidence` todo already flipped `pending → in_progress`
- [.agent/prompts/session-continuation.prompt.md](.agent/prompts/session-continuation.prompt.md) — continuity contract refreshed for this session

## Part 1 — Alert-rule CLI validation (closes evidence-bundle item 8)

Hard rule: **do not edit rule 521866**. We are validating, not mutating.

### 1.1 Load env and run the three `sentry api` calls

```bash
set -a
. apps/oak-curriculum-mcp-streamable-http/.env.local
set +a

sentry api projects/oak-national-academy/oak-open-curriculum-mcp/rules/521866/
sentry api projects/oak-national-academy/oak-open-curriculum-mcp/rules/ \
  | jq 'length, [.[].id]'
sentry api organizations/oak-national-academy/combined-rules/ \
  | jq '[.[] | select(.projects[]? == "oak-open-curriculum-mcp")] | length'
```

Capture each response. Do not paste raw tokens or secrets; the rule body itself is non-sensitive but headers never belong in the evidence bundle.

### 1.2 Check the five acceptance criteria against rule 521866

Recorded in [alerting-baseline-enumeration-note.md § "Validation for the next session"](.agent/plans/architecture-and-infrastructure/evidence/2026-04-16-http-mcp-sentry-validation/alerting-baseline-enumeration-note.md):

- `status == "active"`
- `environment == "production"` (top-level field; record deviation if different)
- at least one condition `== FirstSeenEventCondition` (or an equivalent "new issue" trigger — record variant if different)
- at least one filter `LevelFilter` with `level == "40"`, `match == "gte"`
- at least one notification action (record concrete shape)
- `frequency` is a small positive integer

### 1.3 Decision branches

- **All checks pass** → append an `## Outcome (validated 2026-04-17)` subsection to `alerting-baseline-enumeration-note.md` with the resolved field values, the concrete action shape, and the rule UI URL.
- **Any check diverges** → record the delta in the same note, stop, raise with the owner, do **not** flip item 8 to MET and do **not** proceed to Part 2.

### 1.4 Propagate closure across the three authority documents

Only if all five acceptance checks passed:

- [.agent/plans/architecture-and-infrastructure/evidence/2026-04-16-http-mcp-sentry-validation/README.md](.agent/plans/architecture-and-infrastructure/evidence/2026-04-16-http-mcp-sentry-validation/README.md) — change item 8 row from `**OWNER ACTION REQUIRED**` to `**MET**`, citing the new Outcome subsection and rule 521866; update "Outstanding owner action" § to record closure.
- [sentry-otel-integration.execution.plan.md](.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md) — flip "Road to Provably Working Sentry" row 5 from `**DONE (pending next-session CLI validation of alert rule 521866)**` to `**DONE**`; flip frontmatter todo `deployment-and-evidence` from `in_progress` to `completed` with a closing note that cites the validation subsection; flip frontmatter todo `sentry-credential-provisioning` from `in_progress` to `completed` after the re-alignment check in the next step.

### 1.5 Re-confirm oak-preview alignment with current HEAD

Since the last alignment confirmation was at `0f9245f5` and both commits since (`40b212d4`, `9c3044ff`) are docs-only, a lightweight re-probe suffices:

```bash
curl -sSf https://curriculum-mcp-alpha.oaknational.dev/.well-known/oauth-protected-resource \
  | jq '.scopes_supported'
```

Expect `["email"]`. If anything else comes back, stop and raise — that would indicate preview drift and blocks Part 2 closure. Record the probe outcome as a one-liner inside the `sentry-credential-provisioning` todo note.

## Part 2 — Parent foundation closure (after Part 1 succeeds)

Parent plan: [sentry-otel-integration.execution.plan.md](.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md). Closure conditions already met once Part 1 lands:

- authoritative HTTP live path stable (DONE since 2026-04-16)
- platform-readiness gates complete (closed by Part 1)

### 2.1 Update the parent plan's "Current Execution Snapshot"

Narrative edits within the § "Current Execution Snapshot (2026-04-17)" block:

- flip the `Credential provisioning` line from "in progress" to final closure state, citing the preview re-probe
- flip the `Phase 4 evidence/deployment` line from "pending" to "complete" with the validation date
- add a one-line entry noting "Foundation closure: 2026-04-17" so future sessions can tell at a glance

### 2.2 Do NOT archive the parent plan

The plan stays active while Part 3 (expansion lanes) still executes on this branch. Archival happens in Part 4 only.

### 2.3 Advisory fitness + canonical gate

```bash
pnpm practice:fitness        # advisory — expect only pre-existing foundational-doc hard-zone violations
pnpm check                   # canonical aggregate gate — must exit 0
```

Expectations (from the napkin / distilled context):

- `practice:fitness` will surface pre-existing hard-zone violations in [.agent/directives/principles.md](.agent/directives/principles.md) and [.agent/directives/testing-strategy.md](.agent/directives/testing-strategy.md). Do **not** edit those files — the "never delegate foundational Practice doc edits to sub-agents" rule applies and they are owner-scoped. Record them as pre-existing and carry on.
- `pnpm check` must be fully green; if not, it indicates the validation-only edits introduced a regression and the cause must be fixed before closing this session.

## Commit boundary

End-of-session commit on the validation-only diff:

```bash
git add .agent/plans/architecture-and-infrastructure/evidence/2026-04-16-http-mcp-sentry-validation/alerting-baseline-enumeration-note.md \
        .agent/plans/architecture-and-infrastructure/evidence/2026-04-16-http-mcp-sentry-validation/README.md \
        .agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md \
        .agent/prompts/session-continuation.prompt.md
git commit -m "docs(sentry): validate alert rule 521866 and close parent foundation"
```

Do **not** push. Do **not** open the PR. Both are deferred to Part 4 per the kickoff.

## Reviewer scope

Validation-only edits with no code touched do not require specialist reviewers beyond the gates above. If any acceptance check in 1.2 diverges from the advisory baseline, that becomes a reviewer-gated change (pattern: `route-reviewers-by-abstraction-layer`) and should pause for owner input.

## Hard invariants preserved throughout

- no edits to alert rule 521866
- no code changes in this session
- redaction / `SENTRY_MODE=off` kill-switch / deny-by-default trace propagation invariants untouched
- no edits to `.agent/directives/principles.md` or `.agent/directives/testing-strategy.md` (pre-existing hard-zone violations stay owner-scoped)
- no push, no PR, no archival — Part 3 still runs on this same branch