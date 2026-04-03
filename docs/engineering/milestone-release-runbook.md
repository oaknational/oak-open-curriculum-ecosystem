# Milestone Release Runbook

This runbook defines the release control model used for milestone transitions
such as private alpha and invite-only alpha. It is separate from npm package
publishing in `release-and-publishing.md`.

## Release Control Model

| Phase | Focus                          | Exit condition                                                  |
| ----- | ------------------------------ | --------------------------------------------------------------- |
| R0    | Freeze release candidate scope | Candidate commit identified; only release-blocker fixes allowed |
| R1    | Mandatory checks               | All mandatory check gates pass with evidence                    |
| R2    | Snagging                       | No open P0/P1 snags; P2/P3 disposition recorded                 |
| R3    | Go/No-Go                       | Explicit decision recorded with owner sign-off                  |
| R4    | Release execution              | Rollout completed and smoke verification passes                 |
| R5    | Early-life watch               | Monitoring window completed or rollback executed                |

## Mandatory Gate Template

Use this gate structure for each milestone and mark each gate as complete only
when evidence exists.

- **G1 Quality gates**: `pnpm check` passes.
- **G2 Generated artefact stability**: regeneration produces no unexplained drift.
- **G3 Secrets baseline**: `pnpm secrets:scan:all` passes; manual spot-check complete.
- **G4 Onboarding release gate**: onboarding simulation evidence exists; blockers closed.
- **G5 Experience contract**: milestone experience contract accepted by owner.
- **G6 Auth migration readiness**: target auth scope implemented for milestone.
- **G7 Observability minimum**: baseline monitoring verified (milestone-dependent).
- **G8 Release communications**: release notes and rollback contact path approved.

Not every milestone uses every gate as a blocker. Record per-milestone gate
scope explicitly in the active release plan.

## Snagging Protocol

### Severity Model

1. **P0**: release stop. Security, data integrity, or core-path outage risk.
2. **P1**: must fix before release unless formally accepted by milestone owner.
3. **P2**: acceptable with explicit follow-up owner and date.
4. **P3**: defer to post-release backlog.

### Snag Workflow

1. Log snag with reproducible steps and owning stream.
2. Assign severity and owner.
3. Triage daily during the release phase.
4. Re-test fix and record evidence.
5. Close only when behaviour is verified and documented.

### Snag Register Template

| ID      | Severity | Description         | Owner  | Status | Decision            |
| ------- | -------- | ------------------- | ------ | ------ | ------------------- |
| Mx-S001 | P1       | Example placeholder | @owner | Open   | Fix before go/no-go |

## Go/No-Go Decision

No release without an explicit recorded decision.

### Required Inputs

1. Gate checklist status.
2. Snag register with no open P0/P1.
3. Rollback plan validated and callable.
4. Named on-call or responsible engineer for early-life watch.

### Decision Record Template

| Field                | Value                      |
| -------------------- | -------------------------- |
| Decision             | Go / No-Go                 |
| Date                 | YYYY-MM-DD                 |
| Milestone owner      | name                       |
| Engineering approver | name                       |
| Product approver     | name                       |
| Notes                | rationale and risk summary |

## Release Execution and Safety Controls

### Controlled Rollout

1. Announce release window and freeze non-release merges.
2. Deploy release candidate.
3. Run post-deploy smoke checks on core paths.
4. Verify auth, tool execution, and search baseline behaviour.
5. Start early-life watch window.

### Rollback Readiness

Rollback triggers:

1. unresolved P0 after release,
2. sustained core-path failure,
3. security or data-risk signal requiring immediate reversal.

Rollback actions:

1. revert deployment to last known good release,
2. communicate rollback status and incident owner,
3. open post-incident snag with root-cause follow-up plan.

## Exit Criteria Template

A milestone release is complete when all are true:

1. Required gates for that milestone are complete with evidence.
2. No open P0/P1 snags.
3. Go decision recorded.
4. Release executed and monitored with no unresolved critical regressions.
5. All snagging items addressed (fixed or explicitly closed with rationale).
