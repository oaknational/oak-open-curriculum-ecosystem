# ADR-204: Merge-Gate Strategy — Require Branches Up To Date, Not a Merge Queue

**Status**: Accepted (owner-ratified, 2026-06-26)
**Date**: 2026-06-26
**Decision Makers**: Owner (@jimCresswell) + agentic session (Wombat wakes Eventide)
**Related**:
[ADR-161](161-network-free-pr-check-ci-boundary.md) (network-free PR-check CI
boundary — the constraint that rules out the merge-queue-compatible SonarCloud
route);
[ADR-121](121-quality-gate-surfaces.md) (quality-gate surfaces);
[ADR-174](174-dependency-vulnerability-scanning-quality-gate.md) (dependency
vulnerability scanning gate);
[github/codeql-action#1537](https://github.com/github/codeql-action/issues/1537)
(GitHub merge-queue builds don't report CodeQL status — open since 2023).

## Context

`main` is protected by a repository ruleset requiring three status checks —
`CodeQL`, `SonarCloud Code Analysis`, and `run-quality-gates` — plus a
`required_deployments: [Preview]` rule and code-owner review. Without
`strict_required_status_checks_policy`, two independently-green PRs can merge
into a `main` that neither tested together (semantic merge skew: "both green,
`main` breaks").

GitHub offers two mechanisms to close that gap:

1. A **merge queue** — builds a temporary `merge_group` ref combining the PR
   with those ahead of it, and requires the checks to pass on that ref.
2. **"Require branches up to date before merging"**
   (`strict_required_status_checks_policy: true`) — a PR must be current with
   `main` and re-pass its checks before it can merge.

A merge queue was enabled briefly on 2026-06-26 and found incompatible with this
repo's integrations (see "Why not a merge queue").

## Decision

Use **require-branches-up-to-date** (`strict_required_status_checks_policy:
true`). Do **not** use a merge queue. Keep the three required status checks,
`required_deployments: [Preview]`, and code-owner review.

## Why this approach (require branches up to date)

- It delivers the merge-skew protection: a PR is brought up to date with current
  `main` and its required checks re-run before merge, so the **merged** state is
  what is tested.
- Every required gate runs on `pull_request` / `push`, which all of this repo's
  integrations support — **CodeQL default setup**, **SonarCloud automatic
  analysis (GitHub App)**, and **Vercel's Git integration** all report on PR
  refs.
- It is compatible with **ADR-161** (network-free PR CI): it introduces no new
  CI-side vendor network call.
- It needs **no new workflows** and no migration off the repo's default/app
  integrations.
- It needs **no merge-queue bypass**: there is no `merge_group` ref for required
  checks to miss, so merges proceed under normal protection.
- At this repo's low PR volume, the "branch must be up to date" re-run cost is
  negligible.

## Why not a merge queue

A merge queue requires **every** required gate to report a status (or
deployment) against the temporary `merge_group` ref. None of the three required
checks does so as currently configured, and the route to fix each is heavy or
self-contradicting:

- **CodeQL (default setup)** does not run on the `merge_group` event and cannot
  report in a queue. This is a long-standing, unresolved GitHub limitation:
  `github/codeql-action#1537` has been **open since 2023-02-11**, was confirmed
  still unresolved on 2026-05-22, and the only workaround disables CodeQL on
  merge groups entirely. Default setup's triggers are not customisable, so the
  `merge_group` event cannot be added without **migrating to advanced setup** (a
  hand-maintained workflow), abandoning default setup's simplicity. _(Verified
  first-hand against the issue.)_
- **SonarCloud automatic analysis (GitHub App)** analyses on PR-create and
  PR-push and is not documented or observed to post its status against a
  `merge_group` ref. The supported route to a merge-queue-reporting Sonar check
  is a **CI-based scanner** triggered on `merge_group` — but a CI scanner
  uploads results to SonarCloud, a third-party vendor, from the PR-check path,
  which **violates ADR-161**. _(SonarCloud's merge_group gap: medium-high
  confidence — Sonar-staff and community statements, not a single primary-doc
  sentence. The ADR-161 conflict of the CI-scanner fix is certain.)_
- **Vercel's Git integration** deploys branch and PR-push refs, with no
  documented deployment of `merge_group` / `gh-readonly-queue` refs, so
  `required_deployments: [Preview]` could not be satisfied inside the queue.
  Vercel's own guidance recommends **against** merge queues. Making it work would
  need a custom GitHub-Actions Vercel deploy on `merge_group`, against the
  integration's grain. _(Medium-high confidence — evidence of absence; Vercel
  publishes no `merge_group` support.)_

Making the queue work would therefore require advanced-setup CodeQL **and** an
ADR-161-violating CI SonarCloud scanner **and** a custom Vercel deploy — a
large, partly self-contradicting change against the repo's deliberate
architecture (default-setup CodeQL, app-based SonarCloud, network-free CI). The
marginal benefit over require-branches-up-to-date does not justify it at this
repo's scale.

## Consequences

### Positive

- Merge-skew protection with no new infrastructure; ADR-161 preserved; no
  merge-queue bypass needed; compatible with all current integrations.

### Trade-offs

- With several PRs open at once, merging one makes the others out of date,
  requiring an update + re-run before they can merge ("thrash"). Acceptable at
  current low PR volume.
- `ci.yml` retains a `merge_group` trigger (added while the queue was briefly
  enabled). It is **inert** without a queue — GitHub never dispatches
  `merge_group` — and is kept as zero-cost readiness should a queue be
  reconsidered.

## Future Work

If PR volume grows enough that require-branches-up-to-date serialisation becomes
a real cost, a merge queue can be revisited — but only after, and conditional
on: (a) migrating CodeQL to advanced setup with a `merge_group` trigger;
(b) resolving the SonarCloud `merge_group` route without violating ADR-161
(which would itself require an ADR-161 amendment); and (c) a custom Vercel
`merge_group` deployment. Each is a precondition, not an afterthought.
