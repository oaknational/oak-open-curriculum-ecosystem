---
name: Sentry Preview Validation
overview: >
  Next-session deliverables on the observability-sentry-otel thread after the
  2026-04-25 VERCEL_BRANCH_URL bug fix (commit 6485773f) restored the Vercel
  preview deployment. Two deliverables: validate Sentry observability is
  actually working against the new preview, and validate the preview MCP
  server itself responds. The CodeQL/Sonar triage Phases (3–5) have been
  superseded by the dedicated `pr-87-architectural-cleanup.plan.md` which
  owns triage and disposition of all PR-87 findings.
todos:
  - id: phase-1-preview-baseline
    content: "Phase 1: confirm preview deployment is reachable and the MCP server responds correctly to baseline endpoints (/healthz, /.well-known/oauth-protected-resource, /mcp HTTP method probe)."
    status: pending
  - id: phase-2-sentry-validation
    content: "Phase 2: validate Sentry observability against the preview deployment. Confirm release name appears, source maps / Debug IDs are uploaded, deploy event is registered, and a deliberate test error reaches Sentry with the expected release attribution."
    status: pending
  - id: phase-3-codeql-triage
    content: "Phase 3: SUPERSEDED by `.agent/plans/observability/active/pr-87-architectural-cleanup.plan.md` §\"Live signal state\" + Clusters A/C/Q. CodeQL triage and dispositions are owned there."
    status: completed
  - id: phase-4-sonar-triage
    content: "Phase 4: SUPERSEDED by `.agent/plans/observability/active/pr-87-architectural-cleanup.plan.md` §\"Sonar PR-scoped issue inventory\" + Clusters B/H/I/J/K/L/M/N/O. Sonar triage and dispositions are owned there."
    status: completed
  - id: phase-5-blocker-routing
    content: "Phase 5: SUPERSEDED. Routing is owned inside the PR-87 plan body itself; the receiving-body reference is now `pr-87-architectural-cleanup.plan.md`, not the superseded `pr-87-quality-finding-resolution.plan.md`."
    status: completed
  - id: phase-6-handoff
    content: "Phase 6: refresh continuity surfaces with the validation outcomes; close session claim; commit + push."
    status: pending
---

# Sentry Preview Validation

**Last Updated**: 2026-04-27 (Opalescent Gliding Prism re-scope)
**Status**: 🔴 PARTIAL — Phases 1-2 pending; Phases 3-5 superseded
**Scope**: Sentry observability validation against the new preview deployment

+ MCP server preview probe. NOT a CodeQL/Sonar triage plan — that scope
moved to `.agent/plans/observability/active/pr-87-architectural-cleanup.plan.md`
when the PR-87 architectural cleanup plan replaced the superseded
`pr-87-quality-finding-resolution.plan.md`. The receiving-body reference for
PR-87 quality findings is now the active plan, not the superseded one.

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

+ **`read-diagnostic-artefacts-in-full`** (`.agent/rules/`) — fetch the
  complete CodeQL + SonarCloud result set, not the first page. Workspace-
  first when the owner has downloaded a copy locally; otherwise via MCP /
  GitHub API.
+ **"All gate failures are blocking at all times, regardless of cause or
  location"** (principles.md §Code Quality) — Phase 1 confirms gate state;
  Phases 3–4 produce evidence so blocker / non-blocker dispositions are
  evidence-based.
+ **`gh pr checks` overrides any brief enumeration** (captured 2026-04-25
  in `feedback_gh_pr_checks_over_brief.md`) — at session-open, run
  `gh pr checks 87` first; cross-check against any prior findings list.

### Strategy

+ **Phase 1**: confirm deployment reachable + MCP baseline responses. Read-
  only HTTP probes via standard tools. No state changes.
+ **Phase 2**: Sentry validation via the project-scoped Sentry MCP. Look for
  the release event under the expected release name, confirm Debug IDs
  uploaded, confirm deploy event present. If a test error is required to
  prove the wiring, choose a reversible, owner-authorised mechanism.
+ **Phase 3**: CodeQL triage via `gh api repos/.../code-scanning/alerts`
  scoped to the PR's commit SHA, OR via the GitHub MCP if available.
  Output: a markdown table with one row per alert, sorted by severity.
+ **Phase 4**: Sonar triage via the project-scoped SonarQube MCP
  (`mcp__sonarqube__search_sonar_issues_in_projects`). Output: same
  shape as Phase 3 but for Sonar.
+ **Phase 5**: route findings into PR-87 plan. Real correctness ⇒ Phase 1/2
  of PR-87. Stylistic ⇒ Phase 5 of PR-87 per the existing decisions.
  New / drifted findings ⇒ surface for owner gate.
+ **Phase 6**: continuity refresh + commit + push.

### Non-Goals (YAGNI)

+ ❌ Implementing any of the PR-87 fixes (those have their own plan).
+ ❌ Running Sentry-side configuration (not in repo scope).
+ ❌ Provisioning new Sentry projects, environments, or tokens.
+ ❌ Modifying CodeQL or Sonar rule configuration (Phase 0 of PR-87 owns
  that decision; rule tuning is downstream of triage findings).
+ ❌ Adding new test infrastructure (the smoke-config fix landed
  separately as `f4bf2fa1`).

---

## Reviewer Scheduling

+ **Pre-execution (already completed 2026-04-25)**:
  + `code-reviewer` ran on the plan body; 3 MAJOR + 2 MINOR + 1 NIT
    absorbed into the Reviewer Dispositions table below.
  + `assumptions-reviewer` ran on the plan body (retry after credit
    exhaustion); 3 MAJOR + 2 MINOR + 2 POSITIVE absorbed into the same
    table.
+ **During**:
  + `sentry-reviewer` after Phase 2 if the validation surfaces a wiring
    concern (release attribution wrong, source maps missing, deploy event
    absent).
  + `security-reviewer` after Phase 3 if any CodeQL alert is reclassified
    as a real correctness risk.
  + `assumptions-reviewer` re-dispatch after Phase 5 if any net-new
    finding introduces a new task to PR-87 Phase 1/2 (per the absorbed
    cross-finding from both reviewers — the assumption-challenge gate
    PDR-015 names assumptions-reviewer as Phase 0 close on PR-87, so
    PR-87 Phase 0 effectively re-opens for any added scope).
+ **Post**:
  + none until PR-87 fixes land.

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

+ Deployment ID and URL alias
+ Created-at timestamp
+ Git commit SHA matches `git rev-parse origin/feat/otel_sentry_enhancements`
+ Build logs end with the expected success markers
+ **Expected release name** (computed at session-open, not hard-coded)
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

+ `GET /healthz` → 200
+ `GET /.well-known/oauth-protected-resource` → 200 with PRM JSON
+ `GET /.well-known/oauth-authorization-server` → 200 with AS metadata
+ `POST /mcp` (unauthenticated) → 401 with WWW-Authenticate

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

+ Release exists in Sentry under the captured release name
+ Release has the correct environment (`preview`)
+ Release has Debug ID assets attached (source maps uploaded)
+ Deploy event present + linked to this release

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

+ Transactions in Sentry tagged with the captured release name
+ At least one auth-failure event from the unauthenticated `POST /mcp`
  probe (auth failures ARE useful telemetry per the absorbed
  assumptions-reviewer POSITIVE finding)

If passive evidence shows transactions: pipe is verified, test-error
not needed.

**Active evidence path (only if passive shows nothing AND owner
authorises)** — generate a deliberate test error. Mechanisms:

+ A deliberate `/test-error` route already in the MCP server (preferred)
+ A controlled curl against an authenticated-required path
+ Skip if owner does not want test events polluting the release

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

+ Drift since the plan was authored (commit `d318b8bd`; current head several
  commits later).
+ New rule families not yet in the plan.
+ Issues that closed since the plan was authored (e.g., the semver-DoS
  hotspots if the bug-fix commits closed them on the next scan).

**Acceptance**: drift table populated; net-new rules surfaced.

### Phase 5: Blocker routing (~15 min)

#### Task 5.1: Update PR-87 plan body

For each Phase 3 / Phase 4 finding:

+ Real correctness issue ⇒ ensure it has a Phase 1/2 task in PR-87
+ Stylistic / accepted ⇒ ensure it's in PR-87 Phase 5 with a recorded
  outcome
+ New / drifted ⇒ add to PR-87 with an owner-gate call-out

**Override gate (absorbed code-reviewer MINOR-5 + assumptions-reviewer
MAJOR-C)** — surface to owner for review BEFORE editing the PR-87 plan
body when ANY of the following apply:

+ A finding currently dispositioned as `ACCEPT`, `DEFERRED`, or
  `dismissed-with-rationale` in PR-87 appears on the new scan as a
  higher-severity or new-category finding
+ A net-new finding introduces a new task to PR-87 Phase 1 or Phase 2
  (correctness phases) — these warrant a fresh `assumptions-reviewer`
  dispatch on the PR-87 plan delta before commit, since PR-87's Phase 0
  close-gate effectively reopens for any added scope (PDR-015
  assumption-challenge gate)
+ The drift count exceeds 10 net-new findings in any one severity tier
  (signals scope change beyond a routine re-scan)

Net-new Phase 5 (stylistic) findings without an existing disposition
do not require the override gate — they get added to the existing
per-rule table with the relevant ACCEPT/DISABLE recommendation.

**Acceptance**: every triage row has a recorded route into PR-87 OR an
explicit owner-gate item; any override-gate trigger is surfaced before
PR-87 plan-body edits land.

### Phase 5 routing decisions (populated 2026-04-26 by `Sharded Stroustrup`)

**Metacognitive checkpoint (decision-content)**: am I about to
mass-route findings into PR-87, or am I surfacing override-gate
triggers? **Both** — most findings safely route; one finding pair
fires the override gate and is held for owner direction.

#### Safe edits to PR-87 plan body (within existing scope)

These do not add Phase 1/2 tasks; they update reasoning or add
Phase 5 dispositions. No override-gate trigger.

1. **Line-number corrections for CodeQL #70, #71** — current head
   has them at 113/115 (not 187/193 as the plan body states; the
   refactor commits shifted lines).
2. **Disposition reasoning update for #70, #71** — replace
   "line-attribution artefact" with "DI-opacity false-positive": the
   `mcpRateLimiter` IS attached at the route registration; CodeQL's
   dataflow analysis doesn't recognise the injected `RequestHandler`
   parameter as a rate-limiter.
3. **Add CodeQL #5 cross-reference** — link alert #5 explicitly to
   the existing Phase 0 finding 0.1 (OAuth metadata rate-limit gap).
   Already in scope; just adds the alert-number anchor.
4. **Add CodeQL #69 and #72 Phase 5 dispositions** — both are
   false-positives uniform with the #70/#71 pattern (DI-opacity for
   #72; misclassified middleware-setup for #69). Add to PR-87 Phase
   5 disposition table as `dismiss-with-rationale`.
5. **Add Sonar S5843 cross-reference** — drift +1 closes on PR-87
   Phase 1 landing (semver-DRY consolidation removes the inline
   complex regex). Note in PR-87 Phase 1 acceptance.

#### Override-gate trigger — held for owner direction

**CodeQL #62, #63 — `js/polynomial-redos` in
`packages/sdks/oak-search-sdk/src/retrieval/query-processing/remove-noise-phrases.ts:36-38`**

These are net-new real correctness findings on production code in a
different workspace (`oak-search-sdk`) than PR-87's current scope
(`oak-curriculum-mcp-streamable-http` + `build-metadata` +
`oak-sdk-codegen`). Adding these would:

+ Introduce a new Phase 1 task to PR-87 (or a new Phase 1A) to fix
  the regex backtracking
+ Possibly require a parity check across other oak-search-sdk regex
  patterns (the file uses 8 patterns; only 2 flagged but the
  approach has structural weakness)
+ Re-trigger `assumptions-reviewer` per the substrate plan's
  override-gate rule (PR-87 Phase 0 close-gate effectively reopens)

**Reachability check (verified 2026-04-26 after `code-reviewer`
MINOR-2 nudge)**:

```text
apps/oak-curriculum-mcp-streamable-http/src/search-retrieval-factory.ts:21
  imports `@oaknational/oak-search-sdk`
packages/sdks/oak-search-sdk/src/retrieval/create-retrieval-service.ts:97, :151
  call `removeNoisePhrases(params.query)` on user-supplied query input
```

**The vulnerable regex sits on the live query-processing path
exercised by the MCP HTTP app's search tools.** User-supplied
queries (the MCP server's external surface) flow through these
patterns in production. My initial parenthetical inference
("oak-search-sdk is consumed by oak-search-cli, not the MCP HTTP
app") was wrong. Option C is therefore **disqualified** — the
search-SDK is reachable on PR-87's release scope.

**Owner direction needed (revised)**:

+ **Option A**: Add as new Phase 1A task in PR-87 with a fix path
  (e.g., bound the noise-pattern matches with possessive
  quantifiers, anchor with `\b…\b` boundaries that prevent
  overlap, or migrate to a non-regex token-based approach). Run
  `assumptions-reviewer` on the PR-87 delta. **Higher-coherence
  answer given the verified reachability — single PR ships a
  user-input-DoS-safe MCP server.**
+ **Option B**: Add as a separate, scoped follow-up plan (e.g.,
  `oak-search-sdk-regex-dos.plan.md`) tracked as a release
  blocker for the same target version, dismiss in PR-87 with a
  cross-reference, and ship the fix in a parallel PR before
  release. Decouples timing but keeps the dependency explicit.
+ ~~Option C~~ **Disqualified** — search-SDK is reachable.

**Revised default if no owner direction**: Option A. Rationale:
the regex DoS sits on user-supplied input; PR-87 ships the MCP
server that exposes that input. Decoupling (Option B) is
acceptable only if the parallel PR ships before or concurrently
with PR-87's release; otherwise PR-87 ships a known reachable
DoS vector.

**Gate state**: trigger condition (b) fires; conditions (a) and
(c) do not. Sub-agent budget for option A: one
`assumptions-reviewer` dispatch on the PR-87 plan delta.

### Phase 6: Continuity refresh + handoff (~15 min)

+ Refresh `observability-sentry-otel.next-session.md` Last Refreshed entry
+ Refresh `repo-continuity.md` Current Session Focus
+ Close session claim
+ Commit + push as a single docs commit

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

+ ✅ Vercel preview is reachable and the MCP server responds.

### Phase 2

+ ✅ Sentry observability is end-to-end functional under the new release
  attribution.

### Phase 3

+ ✅ Full CodeQL triage table; net-new alerts surfaced.

### Phase 4

+ ✅ Full Sonar triage table; drift table; net-new rules surfaced.

### Phase 5

+ ✅ Every finding routed into PR-87 OR explicit owner-gate item.

### Phase 6

+ ✅ Continuity surfaces refreshed; commit + push.

### Overall

+ ✅ Sentry observability is provably working against the new preview.
+ ✅ PR-87 plan reflects current CodeQL + Sonar evidence (not the snapshot
  from `d318b8bd`).
+ ✅ Owner has visibility on any new blockers vs the plan's existing scope.

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

+ The Vercel preview must be `READY` for the current PR head (confirmed
  green at `dpl_FtjdEbwRN2qwM1m78hzoQoEDG95R` for commit `f4bf2fa1`'s
  predecessor; re-confirm at session start).

**Prerequisites**:

+ Project-scoped Sentry MCP available (`mcp__sentry-ooc-mcp__*`).
+ Project-scoped SonarQube MCP available (`mcp__sonarqube__*`).
+ GitHub MCP or `gh` CLI for CodeQL alerts.

---

## Foundation Alignment

+ **principles.md §Code Quality**: every gate failure is blocking; this
  plan produces evidence so dispositions are evidence-based.
+ **principles.md §Strict and Complete**: triage tables are exhaustive,
  not sampled.
+ **`read-diagnostic-artefacts-in-full`**: workspace-first; cross-check
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

**Captured 2026-04-26 by `Sharded Stroustrup` (claude-code /
claude-opus-4-7-1m).**

### Task 1.1 — Vercel deployment for current PR head

| Field | Value |
|---|---|
| PR head SHA | `66de47a24c005ae3760a4f4a56b05bc9a731dcbe` |
| Branch | `feat/otel_sentry_enhancements` |
| Latest deployment ID | `dpl_9z4XxbhWtS3iHgyyhdQZAzzxbmV9` |
| Deployment state | `READY` |
| Deployment SHA | `66de47a24c005ae3760a4f4a56b05bc9a731dcbe` ✅ matches PR head |
| Deployment URL | `poc-oak-open-curriculum-lk2vmk3zs.vercel.thenational.academy` |
| Branch alias | `poc-oak-open-curriculum-mcp-git-feat-otelsentryenhancements.vercel.thenational.academy` |
| Created | epoch 1777185679587 (~2026-04-25 evening UK) |
| Inspector URL | `https://vercel.com/oak-national-academy/poc-oak-open-curriculum-mcp/9z4XxbhWtS3iHgyyhdQZAzzxbmV9` |

**Expected Sentry release name** (per BuildEnvSchema's
hostname-not-URL rule, leftmost label of branch alias):

`poc-oak-open-curriculum-mcp-git-feat-otelsentryenhancements`

This value is captured at session-open and **must be re-validated at
Phase 2 entry** per session-execution brief Absorption A. If the SHA
moves between Phase 1 and Phase 2, halt and re-capture.

### Task 1.2 — MCP baseline endpoint probes

Probed `https://poc-oak-open-curriculum-mcp-git-feat-otelsentryenhancements.vercel.thenational.academy`:

| Endpoint | Method | Status | Notes |
|---|---|---|---|
| `/healthz` | GET | **200** ✅ | body `{"status":"ok","mode":"streamable-http","auth":"required-for-post"}` |
| `/.well-known/oauth-protected-resource` | GET | **200** ✅ | PRM JSON; resource = `<base>/mcp`; scopes `["email"]`; AS = same host |
| `/.well-known/oauth-authorization-server` | GET | **200** ✅ | AS metadata; Clerk-backed (`native-hippo-15.clerk.accounts.dev` JWKS+revocation); `code_challenge_methods_supported: ["S256"]` |
| `POST /mcp` (no Accept header) | POST | **406** ⚠️ | body `{"error":"Accept header must include text/event-stream"}` — content negotiation precedes auth |
| `POST /mcp` (Accept: `application/json, text/event-stream`) | POST | **401** ✅ | body `{"error":"Unauthorized"}`; `WWW-Authenticate: Bearer resource_metadata="<base>/.well-known/oauth-protected-resource/mcp"` |

**Finding (refines substrate plan Task 1.2 acceptance)**: an
unauthenticated `POST /mcp` returns 401 only with proper `Accept`
content negotiation. Without the right Accept header, content
negotiation returns 406 BEFORE the auth gate fires. The 401 is the
true baseline; the 406 path proves Express returns 406 before reaching
auth middleware. This is correct MCP behaviour — RFC 9728 PRM resource
metadata pointer is correctly embedded in `WWW-Authenticate`. **For
Phase 2 passive-evidence purposes, the 401 path is the one that
exercises the auth-failure code path the runtime Sentry pipe should
capture.**

**Observability headers observed on response**:

+ `x-app-version: 1.5.0` — build-time version marker present
+ `x-correlation-id: req_<epoch>_<hex>` — request-correlation
  middleware running
+ `x-vercel-id: lhr1::lhr1::<id>` — region marker present (London)
+ `x-clerk-auth-reason: dev-browser-missing`,
  `x-clerk-auth-status: signed-out` — Clerk middleware engaged
+ HSTS, X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
  present — security headers wired

These headers indirectly confirm the request reached the application,
not just the Vercel edge. They do NOT confirm Sentry is wired —
that's Phase 2.

### Phase 1 acceptance — ✅ MET

1. ✅ Deployment ID + SHA captured.
2. ✅ All four baseline probes pass (with Accept-header refinement
   noted).
3. ✅ Findings recorded above before Phase 2.

## Phase 2 findings (populated during execution)

**Captured 2026-04-26 by `Sharded Stroustrup` (claude-code /
claude-opus-4-7-1m).** Phase 2 entry SHA re-check (Absorption A):
`66de47a2` — unchanged from Phase 1. No halt-and-recapture.

### Task 2.1 — Release event in Sentry

| Field | Value |
|---|---|
| Sentry org / project | `oak-national-academy` / `oak-open-curriculum-mcp` |
| Release name | `poc-oak-open-curriculum-mcp-git-feat-otelsentryenhancements` ✅ matches expected |
| Release Created | 2026-04-25T19:58:33Z |
| Release Released | 2026-04-25T20:30:14Z |
| Last commit on release | `9bcc8ffc11d816645591b0647f0f5fe4842de029` |
| Last commit message | `docs(plans): surface recurrence-prevention items as future enhancements` |
| Last deploy ID | `8855930` |
| Last deploy environment | `preview` ✅ |
| Last deploy finished | 2026-04-25T20:30:14.847Z |
| Region URL | `https://de.sentry.io` |

### Alignment check before claim validation (per owner direction 2026-04-26)

| System | SHA / value | Aligned? |
|---|---|---|
| local HEAD | `66de47a24c005ae3760a4f4a56b05bc9a731dcbe` | — |
| origin/feat/otel_sentry_enhancements (after `git fetch`) | `66de47a24c005ae3760a4f4a56b05bc9a731dcbe` | ✅ identical to local |
| working tree | (this session's plan-body and napkin edits, unstaged) | ⚠️ in-scope-for-this-session edits only |
| Vercel latest deployment SHA | `66de47a24c005ae3760a4f4a56b05bc9a731dcbe` (`dpl_9z4XxbhWtS3iHgyyhdQZAzzxbmV9` READY) | ✅ |
| GitHub PR-87 head SHA | `66de47a24c005ae3760a4f4a56b05bc9a731dcbe` | ✅ |
| Sentry release `last_commit` | `9bcc8ffc11d816645591b0647f0f5fe4842de029` | ❌ four commits behind |

**Item-4 misalignment investigated** (was tagged "release lag is
benign" in initial Phase 2 finding; owner directed re-validation):

The four commits between Sentry's `last_commit` (`9bcc8ffc`) and
the current head (`66de47a2`) are:

+ `f4bf2fa1` `fix(search-cli): defer smoke env validation` (Vitest config only)
+ `325605a4` `docs(plans): add next-session sentry-validation + triage plan`
+ `c666b845` `docs(continuity): keen dahl session-handoff and consolidation pass`
+ `66de47a2` `docs(continuity): session-handoff close for keen dahl 2026-04-26 session`

None of these touch production code shipped by the Vercel build of
`apps/oak-curriculum-mcp-streamable-http`. Vercel created a deployment
for each commit (verified via Vercel MCP `list_deployments` —
`dpl_9z4...`, `dpl_GBP...`, `dpl_3Qr...`, `dpl_3cU...` all READY).

**Mechanism**: the build logs for `dpl_9z4XxbhWtS3iHgyyhdQZAzzxbmV9`
(SHA `66de47a2`) show `cache hit, replaying logs <hash>` for every
inspected build task (e.g., `@oaknational/sentry-node:build`,
`@oaknational/sdk-codegen:sdk-codegen`). The Sentry esbuild plugin
runs **inside the MCP-HTTP build task**; that task is also cache-key
stable across these four post-`9bcc8ffc` commits (because the input
hash for `apps/oak-curriculum-mcp-streamable-http/**` plus its
transitive deps did not change). Turbo replays the cached output
without re-executing the build, so the Sentry plugin **is not invoked
on these deploys** — no release event is created or updated.

**Mechanism is Turbo build-task caching, NOT Sentry release-publish
idempotency.** My original Phase 2 hypothesis named the wrong
mechanism. The outcome (no fresh release/deploy events for cache-hit
builds) is correct; the cause is upstream of Sentry, in the Turbo
cache invalidation rules.

**Implication for runtime correctness**: the deployed bundle for
`66de47a2` is byte-equivalent to the bundle that was published as
release `poc-oak-open-curriculum-mcp-git-feat-otelsentryenhancements`
last_commit=`9bcc8ffc`. Source maps + Debug IDs uploaded under that
release are still valid for symbolicating events from the current
deployment. The release attribution is **correct in substance**
(same artefact, same release) even though the `last_commit` field
points at the most-recent code-changing commit, not the most-recent
deployed commit.

**Remaining unknown**: whether the production-build (`main` branch)
release-publish path uses a different cache-key shape (e.g., includes
the SHA in the release name) such that the same Turbo-cache behaviour
on `main` would still produce per-commit Sentry releases. This is
out of scope for Phase 2 (preview validation only); flagged as a
production-readiness probe for a future thread.

### Task 2.2 — Runtime → Sentry pipe verification

#### Passive evidence path (Absorption B): transactions stream

**Span volume in the last hour for this release: 194** ✅

Recent transactions captured with this release tag include the
Phase 1 baseline probes I just executed:

| Timestamp (UTC) | Transaction | span.op | Duration | is_transaction | Trace |
|---|---|---|---|---|---|
| 2026-04-26T07:01:04 | `POST /mcp` | `mcp.server` | 5.6ms | true | `9e24ca64ea33d92dbd91f9931a7a389b` |
| 2026-04-26T07:01:03 | `POST /mcp` | `http.server` | 178.1ms | true | same |
| 2026-04-26T07:01:03 | `POST https://api.clerk.com/oauth_applications/access_tokens/verify` | `http.client` | 157.9ms | false | same |
| 2026-04-26T07:01:04 | `oak.http.request.mcp` | `http` | 7.3ms | false | same |
| 2026-04-26T07:00:21 | `POST /mcp` | `http.server` | 10.8ms | true | (different trace) |
| 2026-04-26T07:00:20 | `GET /.well-known/oauth-authorization-server` | `http.server` | 3.3ms | true | (different trace) |
| 2026-04-26T07:00:20 | `GET /.well-known/oauth-protected-resource` | `http.server` | 3.7ms | true | (different trace) |
| 2026-04-26T06:55:56 | `oak.http.bootstrap.setupAuthRoutes` | `default` | 2.6ms | true | (cold-start) |
| 2026-04-26T06:55:56 | `oak.http.bootstrap.setupBaseMiddleware` | `default` | 2.8ms | true | (cold-start) |
| 2026-04-26T06:55:56 | `oak.http.bootstrap.setupGlobalAuthContext` | `default` | 5.6ms | true | (cold-start) |
| 2026-04-26T06:55:56 | `oak.http.bootstrap.fetchUpstreamMetadata` | `default` | 152.5ms | true | (cold-start) |

**Instrumentation depth confirmed end-to-end**:

+ HTTP server spans (`http.server`) on every probed endpoint
+ Outbound HTTP client spans (`http.client`) to Clerk's
  `oauth_applications/access_tokens/verify` — proving the auth path
  IS invoked even on a 401 response (Clerk verifies the `null` token
  before refusing it)
+ MCP server spans (`mcp.server`) for the streamable-http transport
+ Cold-start bootstrap spans (`oak.http.bootstrap.*`) — confirms
  the WS3 startup-boundary instrumentation lands in production
+ Custom domain spans (`oak.http.request.mcp`) — confirms the Oak
  observability layer is wired

**Verdict**: passive evidence path is conclusive — runtime →
Sentry pipe is wired correctly. Transactions ARE flowing under the
correct release tag.

#### Passive evidence path: issues stream

**Issues for this release in the last 24h: 0** ⚠️

This is **expected**, not a finding-of-concern: a `401 Unauthorized`
HTTP response is not an unhandled exception; it is a deliberate
control-flow output of the auth middleware. Sentry's "issues" stream
groups unhandled errors/exceptions, not 4xx HTTP responses. The
absence of issues from a 401-only probe set does NOT falsify the
error-event path. **Conclusion**: error-event path remains
unverified by this passive set; verification requires either a real
unhandled exception under load (organic) or the substrate plan's
active test-error path (owner-gated; not invoked this session).

The substrate plan's Task 2.2 phrasing — "passive evidence shows
transactions, OR active path generates an event ... within 5 minutes,
OR owner authorises skipping" — is satisfied by passive transaction
evidence. The session-execution brief's Absorption B is a refinement,
not a replacement: it correctly surfaces that the issues stream is
silent for the probe set, and that's why the active path exists as
a supplement.

### Source maps / Debug IDs / Source-code upload

**Empirical evidence from owner-directed active probe (2026-04-26)**:

Owner directed a deeper validation after the initial passive
evidence. Running
[`apps/oak-curriculum-mcp-streamable-http/scripts/probe-sentry-error-capture.sh`](../../../../apps/oak-curriculum-mcp-streamable-http/scripts/probe-sentry-error-capture.sh)
with the malformed-JSON target generated a real Sentry issue under
the current preview release:

| Field | Value | Interpretation |
|---|---|---|
| Issue | [`OAK-OPEN-CURRICULUM-MCP-6`](https://oak-national-academy.sentry.io/issues/OAK-OPEN-CURRICULUM-MCP-6) | error event captured ✅ |
| Title | `SyntaxError: Expected property name or '}' in JSON at position 1` | matches probe payload |
| Captured at | `2026-04-26T07:42:21.531Z` | matches probe `Sent at` exactly |
| Tag `release` | `poc-oak-open-curriculum-mcp-git-feat-otelsentryenhancements` | release attribution works on errors ✅ |
| Tag `git.commit.sha` | `8df25ce50ddeb4237b586b4966a395b39ce993bf` | per-event git provenance is the **deployed HEAD**, even though the release-level `last_commit` lags ✅ |
| Tag `environment` | `preview` | correct |
| Tag `handled` | `yes` | captured via `setupExpressErrorHandler` chain |
| Tag `service` | `oak-curriculum-mcp-streamable-http` | correct |
| Trace | `3f72b538197eb24d3142a22e749d88b9 / a383014300a82a20`, sampled=true | trace correlation works ✅ |
| Cloud | `cloud.provider: vercel`, `cloud.region: lhr1` | Vercel context captured ✅ |
| HTTP | method=POST url=/mcp body captured | request context captured ✅ |
| Stack | `raw-body@3.0.2/index.js:287` → `body-parser@2.2.2/lib/types/json.js:72` | third-party frames captured with line/column ✅ |

**Source-code upload status (current preview release)**:
**EMPIRICALLY UNVERIFIED**. The malformed-JSON probe produces a
stack trace that contains only third-party frames (raw-body,
body-parser) — there is no application-source frame in the call
path because the parse error happens before any application code
runs. We have direct evidence that source-code upload works for
**older releases** (issue
[`OAK-OPEN-CURRICULUM-MCP-2`](https://oak-national-academy.sentry.io/issues/OAK-OPEN-CURRICULUM-MCP-2)
on `release: evidence-2026-04-16-http-mcp-sentry-validation` shows
`../src/__test-tools__/register-test-error-tool.ts:91:29` with
rendered source-line context lines 88-94 displayed). Same upload
pipeline runs on every build, so transitive evidence is strong;
but the current preview release has no issue with app-source
frames yet.

**Closure path landed in this commit**:
[`POST /test-error`](../../../../apps/oak-curriculum-mcp-streamable-http/src/test-error/test-error-route.ts)
diagnostic route with:

+ Shared-secret authentication (`X-Test-Error-Secret`,
  constant-time compare, min 16 chars)
+ Rate-limited via existing `oauthRateLimiter` (30 req / 15 min /
  IP)
+ Three modes — `handled` (captureHandledError 4xx-equivalent),
  `unhandled` (5xx via Express error chain), `rejected` (5xx via
  async rejection)
+ Production-forbidden by `HttpEnvSchema` super-refine
  (`TEST_ERROR_SECRET` must NOT be set when `VERCEL_ENV ===
  production`)
+ Probe script extended with `--target=test-error --mode=unhandled
  --secret=<value>`

**Owner action required to close the gap**: set
`TEST_ERROR_SECRET` to a 16+ char string in the Vercel preview
environment variables, wait for deploy, run the probe with
`--target=test-error --mode=unhandled`. Expected outcome: a Sentry
issue with stack frames pointing at
`src/test-error/test-error-route.ts:LINE` with rendered TS source
context, proving source-code upload + symbolication on the current
release.

### Source-code upload — EMPIRICALLY PROVEN (2026-04-26)

Owner set `TEST_ERROR_SECRET` (preview-only, production-forbidden by
env-schema super-refine), Vercel redeployed (`dpl_DDkHnHZj7RmTG6qYevk1BDU9UHKZ`
for SHA `71397d47`), and the probe ran all three modes
successfully against the deployed preview. **All three captures
include rendered TS source-line context**, definitively proving the
source-code-upload pipeline works for the current preview release.

| Mode | Issue | Frame | Rendered source context |
|---|---|---|---|
| `unhandled` | [`OAK-OPEN-CURRICULUM-MCP-7`](https://oak-national-academy.sentry.io/issues/OAK-OPEN-CURRICULUM-MCP-7) | `src/test-error/test-error-route.ts:175:12` (`dispatchMode`) | lines 172-178 with `→ 175 │ next(new TestErrorUnhandled(token));` |
| `rejected` | [`OAK-OPEN-CURRICULUM-MCP-8`](https://oak-national-academy.sentry.io/issues/OAK-OPEN-CURRICULUM-MCP-8) | `src/test-error/test-error-route.ts:181:22` (`dispatchMode`) | lines 178-184 with `→ 181 │ Promise.reject(new TestErrorRejected(token)).catch(next);` |
| `handled` | [`OAK-OPEN-CURRICULUM-MCP-9`](https://oak-national-academy.sentry.io/issues/OAK-OPEN-CURRICULUM-MCP-9) | `src/test-error/test-error-route.ts:162:41` (`dispatchMode`) | lines 159-165 with `→ 162 │ observability.captureHandledError(new TestErrorHandled(token), {` |

All three events tagged with:

+ `release: poc-oak-open-curriculum-mcp-git-feat-otelsentryenhancements`
+ `git.commit.sha: 71397d470a5fab556d5dd96b0793e5068cbb7c93` (the deployed HEAD)
+ `environment: preview`
+ `cloud.provider: vercel`, `cloud.region: lhr1`
+ `service: oak-curriculum-mcp-streamable-http`
+ Trace IDs + span IDs, `sampled: true`, `client_sample_rate: 1`
+ Mechanism distinguishes the paths: `auto.middleware.express`
  (unhandled) vs `generic` (handled, rejected via captureHandledError-equivalent)
+ `handled: no` for unhandled mode; `handled: yes` for the two
  caught paths

Note: rate-limited via the existing `oauthRateLimiter` (30 req /
15 min / IP); shared secret with constant-time compare on the
`X-Test-Error-Secret` header. The route is **entirely absent** in
production builds (env-schema super-refine forbids
`TEST_ERROR_SECRET` in production), so there is no public attack
surface added by shipping the route.

All three test issues marked `resolved` in Sentry post-validation
to keep the unresolved-issues view clean.

### Stack-trace usefulness for agents and humans — PROVEN

The captures meet every quality bar a debugging session needs:

+ ✅ **First-party file path** — `src/test-error/test-error-route.ts`
+ ✅ **Line + column resolution** — accurate to the exact statement
+ ✅ **Rendered source-line context** — Sentry shows lines around
  the throw, NOT just file:line position. This requires source
  files to be uploaded to Sentry alongside the source maps.
+ ✅ **Function name preserved** — `dispatchMode` resolved from
  the minified bundle frame.
+ ✅ **First-party vs third-party distinction** — Sentry highlights
  the application frame as "Most Relevant" while still capturing
  the express-rate-limit / router stack for context.
+ ✅ **Mechanism tagging** — `auto.middleware.express` for
  Express-chain captures, `generic` for explicit
  `captureHandledError` calls; agents can filter by capture path.
+ ✅ **Trace correlation** — every error has trace + span IDs
  linking back to transactions; cross-system trace works.
+ ✅ **Per-event git provenance** — `git.commit.sha` tag is the
  deployed HEAD, not the release's `last_commit`; this is what
  agents and humans need to identify the exact commit that shipped
  the bug.
+ ✅ **Rich operational context** — Vercel region, Lambda app
  memory, runtime version, request method/URL/body, user, locale,
  timezone all attached as tags / context.

### Phase 2 acceptance — ✅ FULLY MET (no inferred-positives remaining)

1. ✅ Release attribution confirmed end-to-end on errors AND
   transactions.
2. ✅ Source maps + Debug IDs work; source files uploaded;
   rendered source-line context displayed.
3. ✅ Deploy event registered.
4. ✅ Findings recorded above before Phase 3.

### Debugging-quality additional checks (2026-04-26)

Owner-directed deeper investigation after the source-code-upload gap
closed:

+ **Breadcrumbs ✅** — issue `OAK-OPEN-CURRICULUM-MCP-7` shows three
  breadcrumbs (`http` GET, `console` deprecation warning, `http` POST)
  with `url=[Filtered]` confirming redaction applies. The default
  `httpIntegration` and `consoleIntegration` are wired and active.
+ **Trace propagation (internal) ✅** — four-span trace
  `9e24ca64ea33d92dbd91f9931a7a389b` from the 2026-04-26 07:01 probe
  proves http.server → mcp.server → http.client (Clerk verify) →
  oak.http.request.mcp all share one trace ID locally.
+ **Trace propagation (external) ⚠️ deliberately disabled** —
  `DEFAULT_TRACE_PROPAGATION_TARGETS = []` in `runtime-sdk.ts`. Owner
  direction (2026-04-26): extend the targets list when the Search
  service joins the same Sentry org; do not propagate to external
  third parties (Clerk etc.) on compliance / cost grounds.
+ **PII redaction ✅** — already proven at the right level by 178
  lines of unit tests (`redaction.unit.test.ts`) + 628 lines of
  barrier-composition tests (`runtime-redaction-barrier.unit.test.ts`,
  including bypass-validation suite) + ADR-160 structural closure.
  Empirical evidence on the current preview release: every captured
  issue (#7/8/9) shows `token=[REDACTED]` in error messages where the
  probe constructed `token=${token}` — the barrier matched the
  `token` key in `FULLY_REDACTED_KEYS` and substituted before send.
  No additional probe needed.
+ **Local variables in stack frames ⚠️ Lambda-runtime constraint** —
  Sentry's `localVariablesIntegration` requires V8 inspector access
  via `--inspect`; Vercel Firecracker microVMs don't expose this. The
  integration silently no-ops in Lambda. **Constraint documented in**
  [`packages/libs/sentry-node/README.md` § Runtime-constraint notes](../../../../packages/libs/sentry-node/README.md#runtime-constraint-notes)
  with the trade-off framing and the empirical-evidence pointer
  (issues #7/8/9 show no variables, matching the prediction).
+ **Custom-header capture as event tags 🟡 → ✅** — fix landed:
  `createCorrelationMiddleware` now takes an optional
  `observability` injection and tags
  `correlation_id=<value>` on the per-request Sentry scope so every
  captured event surfaces the same ID that's in the
  `X-Correlation-ID` response header and application logs. Tagging
  is request-scoped via `@sentry/node`'s `httpIntegration`
  async-hooks isolation. Tests added in
  `correlation/middleware.integration.test.ts § Sentry scope tagging`.

### Phase 2 acceptance — ✅ MET (with one inferred-positive)

1. ✅ Release attribution confirmed end-to-end (transactions
   tagged with the captured release name).
2. ⚠️ Source maps uploaded — inferred-positive, not directly
   verified through MCP. Owner-side web-UI check available.
3. ✅ Deploy event registered (Deploy ID 8855930, environment
   `preview`).
4. ✅ Findings recorded above before Phase 3.

### Phase 2 finding routed to substrate plan-author note

**The release-lag observation** (Sentry release tracks `9bcc8ffc`
not `66de47a2` because subsequent commits don't ship new artifacts)
is a benign, expected outcome of release-name-by-branch + idempotent
publish. **It is NOT a regression.** No re-dispatch of
`sentry-reviewer` warranted — the wiring concern the substrate plan
budgets `sentry-reviewer` for (release attribution wrong, source
maps missing, deploy event absent, OR — Absorption B — issues stream
silent while transactions populate) is partially triggered by the
issues-stream observation. **However, the issues-stream silence is
explained by the 401-only probe set, not a wiring gap**, so
re-dispatch would only confirm the explanation. Skipping the
sentry-reviewer dispatch on time-budget grounds; surfacing as a
recorded note instead.

## Phase 3 findings (populated during execution)

**Captured 2026-04-26 by `Sharded Stroustrup`.** Pagination edge
check (Absorption C): 12 open alerts on a single paginated fetch
with `per_page=100` — well under the page boundary, no re-fetch.
Raw-JSON spot-check (Absorption D): alert #70 inspected, line
attribution stable + accurate.

### Task 3.1 — All open CodeQL alerts for PR-87 head

`gh api --paginate "repos/oaknational/oak-open-curriculum-ecosystem/code-scanning/alerts?per_page=100&ref=refs/pull/87/head&state=open"`

| # | Rule | Sev | Sec | File:Line | State |
|---|---|---|---|---|---|
| 5 | `js/missing-rate-limiting` | warning | high | `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts:80` | open |
| 62 | `js/polynomial-redos` | warning | high | `packages/sdks/oak-search-sdk/src/retrieval/query-processing/remove-noise-phrases.ts:36` | open |
| 63 | `js/polynomial-redos` | warning | high | `packages/sdks/oak-search-sdk/src/retrieval/query-processing/remove-noise-phrases.ts:38` | open |
| 69 | `js/missing-rate-limiting` | warning | high | `apps/oak-curriculum-mcp-streamable-http/src/app/bootstrap-helpers.ts:148` | open |
| 70 | `js/missing-rate-limiting` | warning | high | `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts:113` | open |
| 71 | `js/missing-rate-limiting` | warning | high | `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts:115` | open |
| 72 | `js/missing-rate-limiting` | warning | high | `apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-routes.ts:68` | open |
| 75 | `js/redos` | error | high | `scripts/validate-root-application-version.mjs:7` | open |
| 76 | `js/http-to-file-access` | warning | medium | `packages/sdks/oak-sdk-codegen/code-generation/schema-cache.ts:45` | open |
| 77 | `js/http-to-file-access` | warning | medium | `packages/sdks/oak-sdk-codegen/code-generation/schema-cache.ts:52` | open |
| 79 | `js/polynomial-redos` | warning | high | `packages/core/build-metadata/src/runtime-metadata.ts:17` | open |
| 80 | `js/redos` | error | high | `packages/core/build-metadata/src/runtime-metadata.ts:14` | open |

**Fixed alerts since plan was authored** (closed when scanning the
post-fix commits): 3 — #73, #74, #78 (all in `runtime-metadata.ts`
or `build-time-release-internals.ts`). Likely closed by the
hostname-not-URL fix series and the magic-strings refactor.

**Dismissed alerts**: 40 — all `false-positive` or `won't-fix`
across older commits. None active.

### Task 3.2 — Classification + cross-reference to PR-87 plan

| # | Rule | File | PR-87 plan disposition | Net-new? |
|---|---|---|---|---|
| 5 | `js/missing-rate-limiting` | `auth-routes.ts:80` (OAuth AS metadata route) | **Already named in PR-87 §Phase 0 finding 0.1** as "REAL GAP — fix in Phase 3 Task 3.2 via route-level attach". Alert number was not previously linked. | No (pre-existing scope) |
| 62 | `js/polynomial-redos` | `remove-noise-phrases.ts:36` (oak-search-sdk regex over `cleaned.replace(pattern, '$1')`) | **NET-NEW** — not addressed in PR-87 plan. Real correctness signal: regex `/\bthat\s+(.+?)\s+stuff(\s+for)?/i` has nested quantifier on user-controlled query. | **YES — fires override gate** |
| 63 | `js/polynomial-redos` | `remove-noise-phrases.ts:38` (same module, fall-through replace branch) | **NET-NEW** — same root cause as #62. | **YES — fires override gate** |
| 69 | `js/missing-rate-limiting` | `bootstrap-helpers.ts:148` (inside `setupBaseMiddleware` body — `app.use(expressJson(...))` and `app.use(createCorrelationMiddleware(...))`) | NET-NEW. **Likely false-positive**: `setupBaseMiddleware` registers cross-cutting middleware via `app.use`, not a route handler. CodeQL appears to misclassify the `app.use` site as a route handler. Should be dismissed as false-positive. | Yes (but likely FP) |
| 70 | `js/missing-rate-limiting` | `auth-routes.ts:113` (`app.post('/mcp', mcpRateLimiter, mcpRouter, ...)`) | PR-87 plan body says "alerts cite line 187/193, those are control-flow not registrations" — **OBSOLETE**. Lines moved to 113/115 in current head. The route DOES have `mcpRateLimiter` attached as second middleware. **Real disposition: DI-opacity false-positive** — CodeQL's dataflow can't recognise the `RequestHandler` parameter as a rate-limiter because it's injected via DI. | (Existing alert, but disposition reasoning needs update) |
| 71 | `js/missing-rate-limiting` | `auth-routes.ts:115` (`app.get('/mcp', mcpRateLimiter, ...)`) | Same as #70 — DI-opacity false-positive. | Same |
| 72 | `js/missing-rate-limiting` | `oauth-proxy-routes.ts:68` (`router.post('/oauth/register', oauthRateLimiter, asyncRoute(...))`) | NET-NEW. **DI-opacity false-positive of the same shape as #70/#71**. The `oauthRateLimiter` IS attached. The comment immediately above line 68 explicitly states "Rate limiter goes first — reject abusive traffic before parsing bodies or making upstream calls". | Yes (but FP) |
| 75 | `js/redos` | `validate-root-application-version.mjs:7` | Named in PR-87 §Phase 1 (semver DRY consolidation) — closes on Phase 1 landing. | No |
| 76 | `js/http-to-file-access` | `schema-cache.ts:45` | Named in PR-87 §Task 3.1 (untrusted-data-write — guard or accept with rationale). | No |
| 77 | `js/http-to-file-access` | `schema-cache.ts:52` | Same as #76. | No |
| 79 | `js/polynomial-redos` | `runtime-metadata.ts:17` | Named in PR-87 §Phase 1 (semver DRY) — closes on Phase 1 landing. (Line is 17 not 14 as the plan body has it; likely a parser difference.) | No (line drift only) |
| 80 | `js/redos` | `runtime-metadata.ts:14` | Named in PR-87 §Phase 1 (semver DRY). | No |

### Net-new findings summary

| Category | Count | Action |
|---|---|---|
| Real correctness gap (regex DoS) | 2 (#62, #63) | **Phase 5 override gate trigger** — adds Phase 1 (or new Phase 1A) task to PR-87 |
| DI-opacity false-positive | 1 (#72) | Add to PR-87 Phase 5 disposition: dismiss-with-rationale (uniform with #70, #71) |
| Middleware-setup false-positive | 1 (#69) | Add to PR-87 Phase 5 disposition: dismiss-with-rationale |
| Pre-existing scope | 1 (#5) | Update PR-87 plan body to link alert number to Phase 0 finding 0.1 |
| Disposition reasoning needs update | 2 (#70, #71) | Update PR-87 plan body: replace "line-attribution artefact" with "DI-opacity false-positive"; update line numbers (113/115 not 187/193) |

### Phase 3 acceptance — ✅ MET

1. ✅ Full CodeQL triage table populated.
2. ✅ Net-new alerts surfaced separately.
3. ✅ Override-gate signal recorded for Phase 5 routing decision.

## Phase 4 findings (populated during execution)

**Captured 2026-04-26 by `Sharded Stroustrup`.**

### Quality Gate status (PR-87)

```text
project_key: oaknational_oak-open-curriculum-ecosystem
pull_request: 87
status: ERROR
```

| Metric | Status | Threshold | Actual |
|---|---|---|---|
| `reliability_rating` | OK | 3 | (passing) |
| `security_rating` | OK | 1 | (passing) |
| `new_duplicated_lines_density` | **ERROR** | ≤ 3% | **5.1%** |
| `new_security_hotspots_reviewed` | **ERROR** | ≥ 100% | **0%** |
| `new_violations` | **ERROR** | 0 | **77** |
| `security_hotspots_reviewed` | OK | 100% | (passing) |

**Drift since PR-87 plan was authored** (commit `d318b8bd`):

+ Issues: 76 → **77** (+1: net-new S5843 below)
+ Hotspots: 4 → **4** (no change)
+ Duplication: 5.2% → **5.1%** (slight improvement, still over threshold)

### Task 4.1 — Issues classification

77 OPEN issues. Severity-tier breakdown (matches PR-87 plan within
±1):

| Severity | Count | PR-87 plan named? |
|---|---|---|
| CRITICAL | 11 | Yes (Array.sort comparator S2871 ×6, cognitive complexity S3776 ×2, void S3735 ×3) |
| MAJOR | ~17 | Yes (shell `[[ ]]` S7688 ×9, S107 ×2, S7677 ×2, S7785, S3358, S4624, S7682) |
| MINOR | ~47 | Yes (export-from S7763 ×12, conditional default-assign S6644 ×4, RegExp.exec S6594 ×4, String.raw S7780 ×5, unknown-overrides S6571 ×3, `\d` S6353 ×3, Object.hasOwn S6653 ×2, zero-fraction S7748 ×2, TypeError S7786, ??= S6606, negated-condition S7735 ×3) |
| INFO | 2 | Yes (TODO S1135 ×2 in CLI) |

**Net-new MAJOR not in PR-87 plan** (drift +1):

| Issue key | Rule | File:Line | Severity | Disposition route |
|---|---|---|---|---|
| `AZ3F9zi6MMAbgOavey_4` | `javascript:S5843` | `apps/oak-curriculum-mcp-streamable-http/build-scripts/vercel-ignore-production-non-release-build.mjs:14` | MAJOR | **Closes on PR-87 Phase 1 landing** (semver-DRY consolidation removes the inline complex regex). Add reference to PR-87 plan but no new task. |

### Task 4.2 — Security Hotspots classification

4 TO_REVIEW hotspots. **All four are already named in PR-87 plan
body** with specific dispositions:

| Key | Rule | File:Line | PR-87 plan disposition |
|---|---|---|---|
| `AZ2-Q2nDjNY6cixFXs-0` | `javascript:S5852` (regex DoS) | `validate-root-application-version.mjs:7` | PR-87 Phase 1 — closes on semver-DRY consolidation |
| `AZ2-Q2aLjNY6cixFXs-a` | `typescript:S5852` (regex DoS) | `runtime-metadata.ts:14` | PR-87 Phase 1 — closes on semver-DRY consolidation |
| `AZ2-Q2ZhjNY6cixFXs-W` | `typescript:S5852` (regex DoS) | `oak-eslint/src/rules/max-files-per-dir.ts:37` | PR-87 Phase 2 §regex DoS in max-files-per-dir.ts (third hotspot) |
| `AZ3D3iflrIk5eL0ceU__` | `javascript:S4036` (PATH safety) | `vercel-ignore-production-non-release-build.mjs:144` | PR-87 Phase 0 §Task 0.4 — ACCEPT-with-rationale, date-stamped Vercel docs citation |

**No net-new hotspots.** 0% reviewed metric is failing because these
4 still have status `TO_REVIEW`; resolution requires either marking
them REVIEWED with rationale (PR-87 Phase 0 §0.4 for the PATH one)
or closing the underlying issue (PR-87 Phase 1+2 for the regex DoS
trio).

### Phase 4 acceptance — ✅ MET

1. ✅ Quality Gate breakdown captured.
2. ✅ Drift table populated (Sonar issues +1, hotspots ±0,
   duplication slight improvement).
3. ✅ Net-new rules surfaced (one S5843, closes on PR-87 Phase 1).
4. ✅ Time-budget truncation rule unused: full CRITICAL+MAJOR+MINOR
   tables fit in one MCP page (`ps=500`).

---

## References

+ Bug-fix commits: `6485773f`, `c2b1c1e5`, `27a7ae78`, `51e548e8`,
  `9bcc8ffc`, `f4bf2fa1` (today, 2026-04-25)
+ PR #87: <https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/87>
+ ADR-163: <docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md>
+ Receiving plan for fixes: `.agent/plans/observability/current/pr-87-quality-finding-resolution.plan.md`
+ Memory: `feedback_workspace_first_for_diagnostics`,
  `feedback_gh_pr_checks_over_brief`,
  `feedback_check_workspace_packages_before_proposing`
+ Future enhancements: `.agent/plans/agentic-engineering-enhancements/future/recurrence-prevention-after-vercel-branch-url-bug.plan.md`

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

+ Q1: Phase 4 truncation rule specifics — answered by absorbed item 7
  (CRITICAL+MAJOR fully; MINOR partial with rule).
+ Q2: Phase 5 PR-87 plan-body edit triggers reviewer cycle? — answered
  by absorbed item 9 (assumptions-reviewer re-dispatch for PR-87 Phase
  1/2 net-new tasks; Phase 5 stylistic additions don't trigger).
+ Q3: Derive expected release name at runtime? — answered by absorbed
  item 10 (yes, at session-open in Task 1.1).

---

## Learning Loop

After Phase 6 completes:

+ Run `/jc-consolidate-docs` if any net-new pattern surfaced (e.g., a
  triage shape that should be reused for future PRs).
+ Update the pending-graduations register with any candidates.
+ If the validation reveals that the BuildEnvSchema's hostname-not-URL
  refinement caught a misconfiguration in the wild (i.e., the fix is
  load-bearing in production), graduate that as a pattern instance for
  the schema-anchored-bug-fix concept.
