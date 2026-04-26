---
name: Sentry Preview Validation + CodeQL/Sonar Triage
overview: >
  Next-session deliverables on the observability-sentry-otel thread after the
  2026-04-25 VERCEL_BRANCH_URL bug fix (commit 6485773f) restored the Vercel
  preview deployment. Three deliverables, in order: validate Sentry
  observability is actually working against the new preview; validate the
  preview MCP server itself responds; fetch CodeQL and SonarCloud results for
  the PR head and triage them for blockers. Owner-directed scope; PR-87 plan
  (the broader Sonar/CodeQL fix sequence) is the receiving body for any
  triage findings that warrant code changes.
todos:
  - id: phase-1-preview-baseline
    content: "Phase 1: confirm preview deployment is reachable and the MCP server responds correctly to baseline endpoints (/healthz, /.well-known/oauth-protected-resource, /mcp HTTP method probe)."
    status: pending
  - id: phase-2-sentry-validation
    content: "Phase 2: validate Sentry observability against the preview deployment. Confirm release name appears, source maps / Debug IDs are uploaded, deploy event is registered, and a deliberate test error reaches Sentry with the expected release attribution."
    status: pending
  - id: phase-3-codeql-triage
    content: "Phase 3: fetch all CodeQL alerts for the PR-87 head; classify each by severity, file, and category; cross-reference against the existing PR-87 plan's already-named alerts (#70, #71, #75, #76, #77, #79, #80); identify any new alerts not yet in the plan; produce a blocker / non-blocker disposition table."
    status: pending
  - id: phase-4-sonar-triage
    content: "Phase 4: fetch SonarCloud Quality Gate breakdown for the PR-87 head; classify all OPEN issues by severity (CRITICAL / MAJOR / MINOR) and category (correctness / stylistic); cross-reference against the PR-87 plan's existing per-rule disposition table; identify any drift since the plan was authored; update the disposition table with current evidence."
    status: pending
  - id: phase-5-blocker-routing
    content: "Phase 5: route triage outputs back into the PR-87 plan body. Real correctness blockers (Phase 1/2 of PR-87) get prioritised; stylistic findings stay in Phase 5 of PR-87 per the existing per-rule decisions; any net-new findings get an explicit owner gate call-out before action."
    status: pending
  - id: phase-6-handoff
    content: "Phase 6: refresh continuity surfaces with the validation outcomes; close session claim; commit + push."
    status: pending
---

# Sentry Preview Validation + CodeQL/Sonar Triage

**Last Updated**: 2026-04-25 (Keen Dahl handoff)
**Status**: 🔴 NOT STARTED — queued for next observability-thread session
**Scope**: Sentry observability validation against the new preview deployment +
CodeQL/Sonar triage for PR #87. NOT a fix-everything plan — the broader fix
sequence is in `pr-87-quality-finding-resolution.plan.md`; this plan's
Phases 3–5 feed evidence and updated dispositions back into that plan.

---

## Context

The 2026-04-25 session fixed the `VERCEL_BRANCH_URL` hostname-vs-URL bug that
had broken the Vercel preview deployment for at least 5 commits (commit
`6485773f`; `dpl_FtjdEbwRN2qwM1m78hzoQoEDG95R` was the first deployment
showing **state: SUCCESS** for this PR head since 2026-04-21). The fix
unblocked the Vercel preview gate but did not by itself validate that the
deployed system actually works end-to-end. Three concerns remain:

1. **Sentry observability is the original goal of this thread** and has not
   been validated against the new preview. The release-identifier work
   (WS0–WS3) lands a hostname-derived release name like
   `poc-oak-open-curriculum-mcp-git-feat-otelsentryenhancements`. We need
   evidence Sentry actually receives events under that release name,
   source maps upload correctly, and deploy events register.
2. **The MCP server itself** must respond correctly to baseline endpoints.
   Build success ≠ runtime correctness.
3. **CodeQL and SonarCloud** results have not been re-fetched since the
   bug-fix commits landed. The PR-87 plan body's per-rule disposition table
   was authored against findings on commit `d318b8bd`. The current PR head
   is `f4bf2fa1`, several refactor commits later. Triage needs current
   evidence.

This plan owns the validation + triage; PR-87 owns the fix sequence.

---

## Quality Gate Strategy

This plan is read-mostly for Phases 1–4. Code or doc changes only land in
Phase 5 (PR-87 plan body update) and Phase 6 (continuity refresh). Standard
gates apply per `.agent/commands/gates.md` after any commits.

---

## Solution Architecture

### Principles applied

- **`read-diagnostic-artefacts-in-full`** (`.agent/rules/`) — fetch the
  complete CodeQL + SonarCloud result set, not the first page. Workspace-
  first when the owner has downloaded a copy locally; otherwise via MCP /
  GitHub API.
- **"All gate failures are blocking at all times, regardless of cause or
  location"** (principles.md §Code Quality) — Phase 1 confirms gate state;
  Phases 3–4 produce evidence so blocker / non-blocker dispositions are
  evidence-based.
- **`gh pr checks` overrides any brief enumeration** (captured 2026-04-25
  in `feedback_gh_pr_checks_over_brief.md`) — at session-open, run
  `gh pr checks 87` first; cross-check against any prior findings list.

### Strategy

- **Phase 1**: confirm deployment reachable + MCP baseline responses. Read-
  only HTTP probes via standard tools. No state changes.
- **Phase 2**: Sentry validation via the project-scoped Sentry MCP. Look for
  the release event under the expected release name, confirm Debug IDs
  uploaded, confirm deploy event present. If a test error is required to
  prove the wiring, choose a reversible, owner-authorised mechanism.
- **Phase 3**: CodeQL triage via `gh api repos/.../code-scanning/alerts`
  scoped to the PR's commit SHA, OR via the GitHub MCP if available.
  Output: a markdown table with one row per alert, sorted by severity.
- **Phase 4**: Sonar triage via the project-scoped SonarQube MCP
  (`mcp__sonarqube__search_sonar_issues_in_projects`). Output: same
  shape as Phase 3 but for Sonar.
- **Phase 5**: route findings into PR-87 plan. Real correctness ⇒ Phase 1/2
  of PR-87. Stylistic ⇒ Phase 5 of PR-87 per the existing decisions.
  New / drifted findings ⇒ surface for owner gate.
- **Phase 6**: continuity refresh + commit + push.

### Non-Goals (YAGNI)

- ❌ Implementing any of the PR-87 fixes (those have their own plan).
- ❌ Running Sentry-side configuration (not in repo scope).
- ❌ Provisioning new Sentry projects, environments, or tokens.
- ❌ Modifying CodeQL or Sonar rule configuration (Phase 0 of PR-87 owns
  that decision; rule tuning is downstream of triage findings).
- ❌ Adding new test infrastructure (the smoke-config fix landed
  separately as `f4bf2fa1`).

---

## Reviewer Scheduling

- **Pre-execution (already completed 2026-04-25)**:
  - `code-reviewer` ran on the plan body; 3 MAJOR + 2 MINOR + 1 NIT
    absorbed into the Reviewer Dispositions table below.
  - `assumptions-reviewer` ran on the plan body (retry after credit
    exhaustion); 3 MAJOR + 2 MINOR + 2 POSITIVE absorbed into the same
    table.
- **During**:
  - `sentry-reviewer` after Phase 2 if the validation surfaces a wiring
    concern (release attribution wrong, source maps missing, deploy event
    absent).
  - `security-reviewer` after Phase 3 if any CodeQL alert is reclassified
    as a real correctness risk.
  - `assumptions-reviewer` re-dispatch after Phase 5 if any net-new
    finding introduces a new task to PR-87 Phase 1/2 (per the absorbed
    cross-finding from both reviewers — the assumption-challenge gate
    PDR-015 names assumptions-reviewer as Phase 0 close on PR-87, so
    PR-87 Phase 0 effectively re-opens for any added scope).
- **Post**:
  - none until PR-87 fixes land.

---

## Foundation Document Commitment

Before starting:

1. **Re-read** `.agent/directives/principles.md` — particularly §Code
   Quality and the no-warning-toleration rule.
2. **Re-read** `.agent/rules/read-diagnostic-artefacts-in-full.md` — the
   workspace-first amendment is queued in
   `.agent/plans/agentic-engineering-enhancements/future/recurrence-prevention-after-vercel-branch-url-bug.plan.md`
   but the current rule still applies: walk the complete artefact before
   forming a hypothesis.
3. **Read** `.agent/plans/observability/current/pr-87-quality-finding-resolution.plan.md`
   — particularly the Reviewer Dispositions tables (code-reviewer 2026-04-25 +
   assumptions-reviewer 2026-04-25) and the Phase 0 findings block.
4. **Read** the prior-session brief at the top of
   `.agent/memory/operational/threads/observability-sentry-otel.next-session.md`
   for the day's commit set and the open follow-up.

---

## Resolution Plan

### Phase 1: Preview deployment + MCP baseline (~30 min)

**Foundation Check-In**: re-read principles.md §Strict and Complete; this
phase confirms the deployment fact-set, no inferences.

#### Task 1.1: Confirm Vercel deployment for current PR head

Find the latest deployment for `feat/otel_sentry_enhancements` via the
Vercel MCP. Confirm `state: READY`. Capture:

- Deployment ID and URL alias
- Created-at timestamp
- Git commit SHA matches `git rev-parse origin/feat/otel_sentry_enhancements`
- Build logs end with the expected success markers
- **Expected release name** (computed at session-open, not hard-coded)
  per the BuildEnvSchema's hostname-not-URL rule: derive from the
  Vercel branch alias as the leftmost label, e.g.
  `<vercel-project-slug>-git-<sanitised-branch>`. Capture once and
  assert against it for the rest of the session — this replaces the
  brittle hard-coded literal in Task 2.1.

**Deterministic validation**:

```bash
git rev-parse origin/feat/otel_sentry_enhancements
# Compare against deployment.meta.githubCommitSha returned by the MCP
```

```text
mcp__plugin_vercel_vercel__list_deployments({
  projectId: 'prj_y9hRhJxzdzX198RzOrwq9t8j7ODp',
  teamId: 'oak-national-academy'
})
# Filter results client-side by SHA equality, not by `since` timestamp.
# (Per absorbed code-reviewer MINOR-4: a deployment that predates the
# session-open timestamp would be silently filtered out by `since`.)
```

**Dependency degradation**: if the Vercel MCP is unavailable, fall back
to `gh pr checks 87` for state and the GitHub commit-status API for the
deployment URL. The Vercel CLI is forbidden — see
`feedback_no_vercel_cli`.

**Acceptance**: deployment is `READY`; SHA matches branch head;
expected-release-name literal captured.

#### Task 1.2: MCP baseline endpoint probes

Probe the preview deployment URL (`<branch-alias>.vercel.thenational.academy`)
for the four baseline responses:

- `GET /healthz` → 200
- `GET /.well-known/oauth-protected-resource` → 200 with PRM JSON
- `GET /.well-known/oauth-authorization-server` → 200 with AS metadata
- `POST /mcp` (unauthenticated) → 401 with WWW-Authenticate

**Tool**: `curl` or `gh api` for unauthenticated probes; the MCP HTTP server
intentionally returns 401 for `/mcp` without auth — that IS the baseline
test, not a failure.

**Acceptance**: each endpoint returns the expected status + shape.

#### Phase 1 Acceptance Criteria

1. ✅ Deployment ID + SHA captured.
2. ✅ All four baseline probes pass.
3. ✅ Findings recorded under "Phase 1 findings" below before Phase 2.

### Phase 2: Sentry validation (~45 min)

**Foundation Check-In**: re-read `docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md`
for the §10 truth-table + the §3 environment-derivation rules.

#### Task 2.1: Confirm release event in Sentry

Use the project-scoped Sentry MCP (`mcp__sentry-ooc-mcp__find_releases`) to
find the release event that should have been registered when the preview
build deployed. **Expected release name** comes from Task 1.1's
session-open derivation, NOT a hard-coded literal (per absorbed
assumptions-reviewer MINOR-D — branch renames or re-deploys would
otherwise leave the literal stale silently).

Verify:

- Release exists in Sentry under the captured release name
- Release has the correct environment (`preview`)
- Release has Debug ID assets attached (source maps uploaded)
- Deploy event present + linked to this release

**Dependency degradation**: if the Sentry MCP is unavailable, fall back
to the Sentry web UI evidence for the same four facts. Capture
screenshots / record findings text-only; the validation can complete
without the MCP.

**Acceptance**: all four facts confirmed.

#### Task 2.2: Runtime → Sentry pipe verification

The bug fix proves *build-time* release-id resolution. It does NOT
prove the *runtime* event flow. Two evidence paths, in order of
preference:

**Passive evidence path (no owner authorisation required)** — the four
Phase 1 baseline probes (`/healthz`, `/.well-known/oauth-protected-resource`,
`/.well-known/oauth-authorization-server`, `POST /mcp` 401) generate
real request transactions Sentry SHOULD capture if the runtime pipe is
wired correctly. Look for:

- Transactions in Sentry tagged with the captured release name
- At least one auth-failure event from the unauthenticated `POST /mcp`
  probe (auth failures ARE useful telemetry per the absorbed
  assumptions-reviewer POSITIVE finding)

If passive evidence shows transactions: pipe is verified, test-error
not needed.

**Active evidence path (only if passive shows nothing AND owner
authorises)** — generate a deliberate test error. Mechanisms:

- A deliberate `/test-error` route already in the MCP server (preferred)
- A controlled curl against an authenticated-required path
- Skip if owner does not want test events polluting the release

This addresses the absorbed code-reviewer MAJOR-3 finding (no fallback
evidence path if owner is absent) without compromising the absorbed
assumptions-reviewer POSITIVE on test-error gating proportionality —
the active path is still owner-gated; the passive path is the
no-authorisation-required fallback.

**Acceptance**: passive evidence shows transactions tagged with the
release, OR active path generates an event that appears in Sentry
under the expected release within 5 minutes, OR owner authorises
skipping the active path with rationale.

#### Phase 2 Acceptance Criteria

1. ✅ Release attribution confirmed end-to-end.
2. ✅ Source maps uploaded (Debug IDs present).
3. ✅ Deploy event registered.
4. ✅ Findings recorded under "Phase 2 findings" below before Phase 3.

### Phase 3: CodeQL triage (~30 min)

**Foundation Check-In**: principles.md §Code Quality; the no-warning-
toleration rule applies — every alert needs a recorded outcome.

#### Task 3.1: Fetch all CodeQL alerts for the PR head

Per `read-diagnostic-artefacts-in-full`: fetch with explicit pagination
so a future net-new alert batch cannot land on page 2 silently
(absorbed code-reviewer MAJOR-1).

```bash
gh api --paginate \
  "repos/oaknational/oak-open-curriculum-ecosystem/code-scanning/alerts?per_page=100&ref=refs/pull/87/head" \
  --jq '.[] | {number, rule: .rule.id, severity: .rule.severity, file: .most_recent_instance.location.path, line: .most_recent_instance.location.start_line, state}'
```

Or via the GitHub MCP if available with equivalent pagination semantics.

**Dependency degradation**: if `gh api` rate-limits or the GitHub MCP
is unavailable, fall back to the GitHub web UI security tab; export
the alert list to JSON via the UI's API-link path. The pagination
discipline still applies.

#### Task 3.2: Classify and cross-reference

Produce a triage table:

| # | Rule | Severity | File:Line | State | Disposition vs PR-87 plan |
|---|---|---|---|---|---|
| 70 | (auth-rate-limit) | … | auth-routes.ts:187 | open | named in PR-87 §Task 0.1; real gap |
| 71 | (auth-rate-limit) | … | auth-routes.ts:193 | open | named in PR-87 §Task 0.1; real gap |
| 75 | (regex-DoS) | … | validate-root-application-version.mjs:7 | open | will close on push of `6485773f`–`f4bf2fa1` (semver pattern updated) |
| 76 | (untrusted-data-write) | … | schema-cache.ts:45 | open | named in PR-87 §Task 3.1; needs owner decision A/B |
| 77 | (untrusted-data-write) | … | schema-cache.ts:52 | open | same |
| 79 | (regex-DoS) | … | runtime-metadata.ts:14 | open | unchanged by today's commits; remains for PR-87 Phase 1 (semver consolidation) |
| 80 | (regex-DoS) | … | runtime-metadata.ts:17 | open | same |
| (any new) | … | … | … | … | TBD |

Highlight any net-new alerts not in the PR-87 plan body.

**Acceptance**: full table populated; new alerts (if any) flagged separately.

### Phase 4: SonarCloud triage (~45 min)

#### Task 4.1: Fetch all OPEN issues for the PR head

Project key: `oaknational_oak-open-curriculum-ecosystem`.

```text
mcp__sonarqube__search_sonar_issues_in_projects({
  projects: ['oaknational_oak-open-curriculum-ecosystem'],
  pullRequest: '87'
})
```

Plus security hotspots — **must include `pullRequest: '87'` to scope to
this PR** (absorbed code-reviewer MAJOR-2: an unscoped hotspot search
returns cross-branch noise that corrupts the drift table against the
PR-87 plan body's specific hotspot keys):

```text
mcp__sonarqube__search_security_hotspots({
  projects: ['oaknational_oak-open-curriculum-ecosystem'],
  pullRequest: '87'
})
```

**Dependency degradation**: if the SonarQube MCP is unavailable (e.g.,
the system reminder flagged "analyzers downloading" — a real
availability variable), fall back to the SonarCloud web UI's PR view
and export issues + hotspots to CSV. The same scoping discipline
applies; cross-branch results are not acceptable.

**Time-budget fallback** (absorbed assumptions-reviewer MAJOR-A): if
the combined CodeQL + Sonar triage budget is pressed, complete
CRITICAL + MAJOR tables fully first; flag the MINOR table as partial
with the explicit truncation rule recorded in Phase 4 findings — e.g.,
"first 30 by file path; remainder triaged next session." Sampling
without recording the truncation rule violates
`read-diagnostic-artefacts-in-full`.

#### Task 4.2: Classify and cross-reference

Produce two triage tables (one for issues, one for hotspots), each with the
same shape as Phase 3. Cross-reference against the PR-87 plan's per-rule
ACCEPT/DISABLE table (the post-MAJOR-C version: S7763 → ACCEPT, S7735 →
ACCEPT, DISABLE list = S6594, S6644, S7748).

Look for:

- Drift since the plan was authored (commit `d318b8bd`; current head several
  commits later).
- New rule families not yet in the plan.
- Issues that closed since the plan was authored (e.g., the semver-DoS
  hotspots if the bug-fix commits closed them on the next scan).

**Acceptance**: drift table populated; net-new rules surfaced.

### Phase 5: Blocker routing (~15 min)

#### Task 5.1: Update PR-87 plan body

For each Phase 3 / Phase 4 finding:

- Real correctness issue ⇒ ensure it has a Phase 1/2 task in PR-87
- Stylistic / accepted ⇒ ensure it's in PR-87 Phase 5 with a recorded
  outcome
- New / drifted ⇒ add to PR-87 with an owner-gate call-out

**Override gate (absorbed code-reviewer MINOR-5 + assumptions-reviewer
MAJOR-C)** — surface to owner for review BEFORE editing the PR-87 plan
body when ANY of the following apply:

- A finding currently dispositioned as `ACCEPT`, `DEFERRED`, or
  `dismissed-with-rationale` in PR-87 appears on the new scan as a
  higher-severity or new-category finding
- A net-new finding introduces a new task to PR-87 Phase 1 or Phase 2
  (correctness phases) — these warrant a fresh `assumptions-reviewer`
  dispatch on the PR-87 plan delta before commit, since PR-87's Phase 0
  close-gate effectively reopens for any added scope (PDR-015
  assumption-challenge gate)
- The drift count exceeds 10 net-new findings in any one severity tier
  (signals scope change beyond a routine re-scan)

Net-new Phase 5 (stylistic) findings without an existing disposition
do not require the override gate — they get added to the existing
per-rule table with the relevant ACCEPT/DISABLE recommendation.

**Acceptance**: every triage row has a recorded route into PR-87 OR an
explicit owner-gate item; any override-gate trigger is surfaced before
PR-87 plan-body edits land.

### Phase 6: Continuity refresh + handoff (~15 min)

- Refresh `observability-sentry-otel.next-session.md` Last Refreshed entry
- Refresh `repo-continuity.md` Current Session Focus
- Close session claim
- Commit + push as a single docs commit

**Hook discipline (absorbed assumptions-reviewer MINOR-E)**: if any
pre-commit hook fails, fix the underlying issue and create a NEW
commit. Never `--no-verify` without fresh per-commit owner
authorisation; the `feedback_no_verify_fresh_permission` rule is in
force regardless of how trivial the failing hook seems.

---

## Testing Strategy

This plan is validation + triage; no new tests are introduced. The smoke-
config fix landed separately as `f4bf2fa1`. If any Phase 3/4 finding
surfaces a missing test, it's surfaced as a Phase 5 routing item against
PR-87 (which owns the fix sequence + test additions).

---

## Success Criteria

### Phase 1

- ✅ Vercel preview is reachable and the MCP server responds.

### Phase 2

- ✅ Sentry observability is end-to-end functional under the new release
  attribution.

### Phase 3

- ✅ Full CodeQL triage table; net-new alerts surfaced.

### Phase 4

- ✅ Full Sonar triage table; drift table; net-new rules surfaced.

### Phase 5

- ✅ Every finding routed into PR-87 OR explicit owner-gate item.

### Phase 6

- ✅ Continuity surfaces refreshed; commit + push.

### Overall

- ✅ Sentry observability is provably working against the new preview.
- ✅ PR-87 plan reflects current CodeQL + Sonar evidence (not the snapshot
  from `d318b8bd`).
- ✅ Owner has visibility on any new blockers vs the plan's existing scope.

---

## Risk Assessment

| Risk | Severity | Mitigation |
|---|---|---|
| Sentry release event missing despite green build | MEDIUM | sentry-reviewer dispatch with the captured deployment ID + the resolveRelease output |
| Source maps missing despite build success | MEDIUM | check `dist/server.js.map` size; check Sentry release-files API; cross-reference Sentry CLI upload step in CI logs |
| CodeQL alert numbering changes between scans | LOW | use rule_id + file+line as the key, not alert number |
| Sonar rule disposition drifts mid-triage | LOW | snapshot the plan body's table at session start; compare at end |
| Net-new findings overwhelm Phase 5 routing | MEDIUM | surface to owner before mass-routing; default-to-defer if proportionality is unclear |
| Test-error generation pollutes Sentry | LOW | only run if owner authorises; use a clearly-named release tag if needed |

---

## Dependencies

**Blocking**:

- The Vercel preview must be `READY` for the current PR head (confirmed
  green at `dpl_FtjdEbwRN2qwM1m78hzoQoEDG95R` for commit `f4bf2fa1`'s
  predecessor; re-confirm at session start).

**Prerequisites**:

- Project-scoped Sentry MCP available (`mcp__sentry-ooc-mcp__*`).
- Project-scoped SonarQube MCP available (`mcp__sonarqube__*`).
- GitHub MCP or `gh` CLI for CodeQL alerts.

---

## Foundation Alignment

- **principles.md §Code Quality**: every gate failure is blocking; this
  plan produces evidence so dispositions are evidence-based.
- **principles.md §Strict and Complete**: triage tables are exhaustive,
  not sampled.
- **`read-diagnostic-artefacts-in-full`**: workspace-first; cross-check
  the live PR check list against any prior plan enumeration.

---

## Notes

### Why this matters (system-level thinking)

**Immediate value**: confirms the bug fix actually produces the intended
end-to-end state (Sentry receiving events under the right release), not
just that the build succeeds.

**System-level impact**: separates the validation cycle from the fix
cycle. PR-87's fix sequence assumes evidence about which findings are
real blockers. This plan produces that evidence so PR-87 can be executed
with confidence.

**Risk of not doing**: PR-87 fixes blindly against `d318b8bd`-snapshot
findings, which may have drifted. Real blockers surface late; non-blockers
get fixed before blockers.

---

## Adversarial Review

**Pre-execution**: none scheduled — this plan is read-and-route, not a
fix. Reviewers fire downstream when fixes land in PR-87.

**Post-execution**: if Phase 2 surfaces a Sentry wiring concern, the
sentry-reviewer takes it. If Phase 3 surfaces a real correctness risk in
auth-routes, the security-reviewer takes it. Both are Phase 1/2 work in
PR-87, not this plan.

---

## Phase 1 findings (populated during execution)

```text
[TODO populate during execution]
```

## Phase 2 findings (populated during execution)

```text
[TODO populate during execution]
```

## Phase 3 findings (populated during execution)

```text
[TODO populate during execution]
```

## Phase 4 findings (populated during execution)

```text
[TODO populate during execution]
```

---

## References

- Bug-fix commits: `6485773f`, `c2b1c1e5`, `27a7ae78`, `51e548e8`,
  `9bcc8ffc`, `f4bf2fa1` (today, 2026-04-25)
- PR #87: <https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/87>
- ADR-163: <docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md>
- Receiving plan for fixes: `.agent/plans/observability/current/pr-87-quality-finding-resolution.plan.md`
- Memory: `feedback_workspace_first_for_diagnostics`,
  `feedback_gh_pr_checks_over_brief`,
  `feedback_check_workspace_packages_before_proposing`
- Future enhancements: `.agent/plans/agentic-engineering-enhancements/future/recurrence-prevention-after-vercel-branch-url-bug.plan.md`

---

## Reviewer Dispositions (2026-04-25 pre-execution gates)

`code-reviewer` (id `ad038da1d3f9b1a44`, 2026-04-25) and
`assumptions-reviewer` (initial id `a83f379f8286fdfe8` exhausted credits;
retry id `a2e4f4a4f9023ff21`, 2026-04-25) ran on the plan body. Both
gates satisfied; findings absorbed into the plan revisions above.

| # | Reviewer | Severity | Finding | Disposition |
|---|---|---|---|---|
| 1 | code-reviewer | MAJOR | Task 3.1 CodeQL `gh api` not paginated | **Absorbed** — Task 3.1 now uses `--paginate` + `per_page=100` + ref-scoped query. |
| 2 | code-reviewer | MAJOR | Task 4.1 Sonar hotspot search missing `pullRequest: '87'` scope | **Absorbed** — added `pullRequest: '87'` to the hotspot call alongside the issues call. |
| 3 | code-reviewer | MAJOR | Phase 2 has no fallback evidence path if owner is absent | **Absorbed differently** — Task 2.2 reshaped: passive evidence path (Phase 1 probe transactions in Sentry, no auth needed) becomes the primary; active test-error path is owner-gated supplement. Honours both code-reviewer's "need a fallback" and assumptions-reviewer's POSITIVE on the test-error gating proportionality. |
| 4 | code-reviewer | MINOR | Task 1.1 `since` placeholder may filter target deployment | **Absorbed** — dropped `since` argument; SHA equality is the deterministic check. |
| 5 | code-reviewer | MINOR | Task 5.1 override threshold underspecified | **Absorbed** — Phase 5 §Override gate now names three explicit trigger conditions. |
| 6 | code-reviewer | NIT | `assumptions-reviewer` not named for net-new findings affecting PR-87 Phase 0 | **Absorbed** — Reviewer Scheduling now lists `assumptions-reviewer` re-dispatch after Phase 5 for net-new PR-87 Phase 1/2 scope additions. |
| 7 | assumptions-reviewer | MAJOR | "Exhaustive triage" assumption undertested for 75-min Phase 3+4 budget | **Absorbed** — Task 4.1 §Time-budget fallback now records explicit truncation rule (CRITICAL+MAJOR fully; MINOR partial with rule recorded). |
| 8 | assumptions-reviewer | MAJOR | Dependency assumptions lack explicit graceful-degradation paths | **Absorbed** — Task 1.1, 2.1, 3.1, 4.1 each now name a per-tool fallback (web UI, CLI, gh api). |
| 9 | assumptions-reviewer | MAJOR | Phase 5 routing-only boundary leaks; net-new PR-87 tasks need fresh assumption-challenge gate | **Absorbed** — Phase 5 §Override gate explicitly triggers `assumptions-reviewer` re-dispatch for net-new PR-87 Phase 1/2 tasks (merges with code-reviewer NIT-6). |
| 10 | assumptions-reviewer | MINOR | Task 2.1 release name hard-coded | **Absorbed** — Task 1.1 captures expected-release-name at session-open from Vercel branch-alias derivation; Task 2.1 references the captured value. (Also closes code-reviewer's MINOR-4 brittleness concern for the same task.) |
| 11 | assumptions-reviewer | MINOR | Phase 6 commit assumes hooks pass first time; no `--no-verify` reminder | **Absorbed** — Phase 6 §Hook discipline cites `feedback_no_verify_fresh_permission` explicitly. |
| 12 | assumptions-reviewer | POSITIVE | Test-error gating (Task 2.2) correctly proportionate | Acknowledged; preserved. The reshape under code-reviewer MAJOR-3 (item 3 above) keeps the gating; the passive evidence path is supplement, not substitute. |
| 13 | assumptions-reviewer | POSITIVE | Plan boundary between this plan and PR-87 is real | Acknowledged; preserved as the §Notes framing. |

**Open questions from assumptions-reviewer** (recorded for next-session
agent rather than blocking):

- Q1: Phase 4 truncation rule specifics — answered by absorbed item 7
  (CRITICAL+MAJOR fully; MINOR partial with rule).
- Q2: Phase 5 PR-87 plan-body edit triggers reviewer cycle? — answered
  by absorbed item 9 (assumptions-reviewer re-dispatch for PR-87 Phase
  1/2 net-new tasks; Phase 5 stylistic additions don't trigger).
- Q3: Derive expected release name at runtime? — answered by absorbed
  item 10 (yes, at session-open in Task 1.1).

---

## Learning Loop

After Phase 6 completes:

- Run `/jc-consolidate-docs` if any net-new pattern surfaced (e.g., a
  triage shape that should be reused for future PRs).
- Update the pending-graduations register with any candidates.
- If the validation reveals that the BuildEnvSchema's hostname-not-URL
  refinement caught a misconfiguration in the wild (i.e., the fix is
  load-bearing in production), graduate that as a pattern instance for
  the schema-anchored-bug-fix concept.
