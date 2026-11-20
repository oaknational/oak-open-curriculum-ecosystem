---
id: release-process
node_type: runbook
name: "Release process: merge to production"
overview: "How a merge to main becomes a production deployment — CI, semantic-release, the version-bump push, the Vercel ignore-gate — and how each link is verified or recovered."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-07-23
ratified_where: "Owner card via the Director, 2026-07-23 — substance approved; the §Rollback no-rollback step (immutable tags/releases) accepted, dated by this stamp"
impact_areas:
  - practice-and-estate
  - analytics-and-observability
tickets:
  - MCP-131
depends_on: []
last_updated: 2026-07-23
---

# Release process: merge to production

The chain is fully automated; this runbook exists so any session can
verify a release end to end, and diagnose the exact link that failed
when production lags main. Its founding worked instance is the
2026-07-23 composition incident (§Worked instance): every component
green in isolation, production silently stale across nine merges.

## When to run

- After merging a PR whose change should reach production, to verify
  the release landed.
- Whenever production is suspected of lagging main (the symptom: main
  advances, the production version does not).
- On any Slack release-failure alert from the `notify-failure` job in
  `.github/workflows/release.yml`.

## Preconditions

- The merge is on `main` (check: `git log origin/main --oneline -5`).
- The commit type is releasable: semantic-release cuts a release for
  `feat`/`fix`/`perf`/breaking (commit-analyzer defaults, which apply
  beneath the explicit rules) plus the patch-mapped types in
  `.releaserc.mjs` (`docs`, `chore`, `style`, `refactor`, `test`,
  `build`, `ci`, `revert`); the automation's own `release(...)` commits
  never re-trigger (check: the merged commits' conventional-commit
  types against `.releaserc.mjs` releaseRules plus the analyzer
  defaults).
- No release is already in flight (the workflow's `concurrency: release`
  group serialises; check: `gh run list --workflow Release --limit 3`).

## Steps

Each step names its executor and the verification that proves it
happened. The chain runs itself, so from step 2 on the agent's part is
verify-only: confirm the automated link fired, never perform it by
hand.

1. **Merge to main** (executor: agent — the bot REST-merge at settled,
   per the merge doctrine). Verify: the merge sha is on `origin/main`.
2. **CI runs on main** (executor: agent, verify-only). Verify:
   `gh run list --workflow CI --branch main --limit 1` shows the merge
   sha with conclusion `success`. A CI failure here stops the chain by
   design and surfaces through CI's own signals — the Release workflow
   run is still created, but its `release` job is skipped by the `if:`
   success guard.
3. **Release workflow fires** (executor: agent, verify-only; chained
   via `workflow_run` on CI completion). Verify at the JOB level, not
   the run level: `gh run view <run-id> --json jobs` shows the
   `release` job with conclusion `success`. A run whose jobs are all
   skipped (CI failed upstream) still concludes `success` — the
   skipped-run signature; run-level green proves nothing here. On a
   `release` job failure, the `notify-failure` job posts to the team
   Slack channel and this runbook's §Recovery applies; a manually
   CANCELLED release job fires no alert (`failure()` is false) — the
   one silent path, named.
4. **semantic-release cuts the release** (executor: agent, verify-only;
   inside step 3's run). It analyses commits since the last tag; when a
   release is due it bumps the root and SDK `package.json` versions,
   updates `CHANGELOG.md`, commits
   `release(x.y.z): x.y.z [skip ci]`, tags `vx.y.z`, and pushes
   directly to main under the release App token (the token bypasses the
   review requirement only; every other ruleset rule binds — a ruleset
   change that blocks this push is the founding failure mode). Verify:
   `git fetch origin main && git log origin/main --oneline -1` shows the
   `release(x.y.z)` commit; the tag exists on the remote. **No
   releasable commits is a clean non-release**, not a failure: the run
   succeeds and the chain ends here by design.
5. **Vercel deploys production** (executor: agent, verify-only). Vercel builds
   every push to main; the app's `vercel.json` `ignoreCommand`
   (`runtime-only-scripts/vercel-ignore-production-non-release-build.mjs`)
   cancels production builds whose root `package.json` version has not
   advanced past the last production deployment — so ordinary merge
   pushes cancel (by design) and exactly the version-bump push from
   step 4 deploys. Verify: the newest production deployment is READY at
   the release commit's sha (Vercel dashboard or MCP
   `list_deployments`); CANCELED entries for non-release pushes are the
   design working, not a fault.
6. **Production serves the new version** (executor: agent, verify-only). Verify:
   the production landing surface reports the released version (the app
   renders its version from runtime config), or the Vercel deployment's
   sha matches step 4's release commit.

## Verification

The end state, confirmed with instruments:

- `git log origin/main --oneline -3` — release commit and merge both
  present.
- The Release run's `release` JOB concluded `success`
  (`gh run view <run-id> --json jobs`) — never the run-level
  conclusion alone: an all-jobs-skipped run (CI failed upstream) still
  concludes `success` (the skipped-run signature).
- Vercel: newest production deployment READY at the release sha.
- The served version equals the tag cut in step 4.

The composition property matters more than any single check: **a green
run list plus a stale production version is the incident signature** —
go straight to §Recovery diagnosis.

## Recovery

Diagnosis order when production lags main:

1. Did the Release workflow run at all? (`workflow_run` chaining broke,
   or CI failed.) Re-run: `gh run rerun <ci-run-id>` or land the CI fix.
2. Did semantic-release push? A rejected push (the GH013/ruleset class)
   fails the run — the Slack alert fires; the cure is platform-side
   (ruleset/App-permission), then re-run the Release workflow.
3. Did the version advance? If semantic-release succeeded but cut no
   release, the merged commit types were non-releasable — a clean
   non-release; the next releasable merge deploys.
4. Did Vercel cancel the release build? The ignore script cancels when
   the version did not advance — and also when the current root
   `package.json` version is unreadable or not valid semver (its
   fail-closed leg), so an "advanced" version comparison alone does not
   clear the script. If it cancelled a genuine release build, check
   both legs: the deployed base's `package.json` version against the
   pushed one, and that the pushed version parses as strict semver.

## Rollback

- **Bad release live in production**: Vercel instant rollback to the
  previous READY production deployment (owner-held — dashboard action;
  verify: production serves the prior version), then revert the
  offending change on main through a normal PR (agent), which cuts a
  new forward release.
- **Git tags and GitHub releases are immutable history**: a cut release
  is never unpublished — a no-rollback step by design (npm publishing
  is disabled in `.releaserc.mjs`, so no package registry surface
  exists). Owner acceptance of this no-rollback step is a ratification
  item: dated at this runbook's ratification stamp. The rollback unit
  is the production deployment, and the forward path is a new release.
- Steps 1–3 change no shared state beyond CI runs and need no rollback.

## Worked instance — 2026-07-23 silent-stall incident

Production sat at 1.81.3 while main advanced nine merges. Every part
was green in isolation: merges landed, CI passed, Vercel showed builds.
The composition failed silently: a ruleset change rejected
semantic-release's version-bump push (GH013), so the version never
advanced, so the ignore-gate cancelled every production build — and a
cancelled build is not an error state anywhere. The cure was
platform-side (ruleset adjustment); releases resumed at 1.82.0. The
`notify-failure` Slack job exists so this class fails loudly at step 3;
the ignore-gate's cancellations remain silent by design, which is why
step 5's verification names them explicitly.
