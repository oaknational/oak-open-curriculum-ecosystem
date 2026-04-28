---
name: PR-87 Architectural Cleanup
overview: >
  Drive PR-87 to green via cluster-by-architectural-root-cause resolution
  of CodeQL alerts and SonarCloud issues. Findings are diagnostic signals,
  not work items. Every cluster is evaluated against four owner-authored
  architectural lenses; each disposition re-derives from principles.md at
  the site. Supersedes pr-87-quality-finding-resolution.plan.md. Re-grounded
  12-phase execution sequencing, §Stance non-negotiables, and per-phase
  verification gates are inlined below. Supersedes any prior plan body that
  allowed dismissal / accept / false_positive / cpd-exclusion language as a
  fallback disposition.
status: active
last_updated: 2026-04-28T12:35Z
todos:
  - id: phase-0-re-harvest
    content: "Phase 0: Live re-harvest of PR-87 signals (Sonar MCP, CodeQL alerts API, PR comments). Cluster table refresh."
    status: completed
  - id: phase-1-owner-exemplars
    content: "Phase 1: Land owner's working-tree edits as architectural exemplars (auth-routes re-export removal, universal-tools test consolidation, vercel-ignore.mjs comments)."
    status: completed
  - id: phase-2-session-2-reground
    content: "Phase 2 (Session 2 18:21Z): Re-derive verified live state, replace stale plan-body assertions, probe Cluster Q sink. Decisions 1B+2A+3A confirmed."
    status: in_progress
  - id: cluster-q-host-validation
    content: "Cluster Q (complete): host-validation-error regex anchoring (5 CodeQL alerts #82-86 + 1 Sonar hotspot). Phase 0.5 sink probe proved the production regex is anchored; fixture-level true-non-issue dispositions landed with no production code changes."
    status: completed
  - id: phase-1b-delete-dormant-rule
    content: "Phase 1B: Delete dormant `no-problem-hiding-patterns` rule cleanly (rule.ts, .unit.test.ts, plugin.ts registration). Single commit. Then write reinstate stub plan in observability/future/."
    status: pending
  - id: cluster-a-security-review
    content: "Phase 2.1 pre-phase adversarial security review: COMPLETE 2026-04-28T11:54Z. Findings: 2 MUST-FIX (FIND-001/002 X-Forwarded-For spoofing on Vercel bypasses every rate limiter), 2 SHOULD-FIX (FIND-003 OAuth single-bucket sharing, FIND-004 /healthz unlimited), 4 HARDENING (FIND-005..009). Evidence at .agent/plans/observability/active/pr-87-cluster-a-security-review.md. Reviewer recommendation: keyGenerator cure BEFORE brand narrowing."
    status: completed
  - id: cluster-a-keygenerator-cure
    content: "Phase 2.0.5 (FIND-001/002, MUST-FIX): centralise Vercel-aware keyGenerator in rate-limiter-factory.ts — read x-vercel-forwarded-for first (split on comma, take first), fall back to req.ip only when absent, pass through ipKeyGenerator(ip, 56). RED+GREEN+REFACTOR with rotating-XFF integration test. Lands BEFORE Phase 2.1 brand work; spoofing bypass is exploitable today."
    status: pending
  - id: cluster-a-rate-limiting
    content: "Phase 2.1 (Cluster A): DI-opacity on route registration (5 CodeQL js/missing-rate-limiting alerts). Type narrowing through RateLimitRequestHandler end-to-end (factory return, DI param types, registration sites, test fake). Closes 4 of 5 alerts; #69 disposition follows the (A)/(B)/(C) ladder in the cluster section. No fallback dispositions."
    status: pending
  - id: cluster-a-oauth-bucket-split
    content: "Phase 2.2 (FIND-003, SHOULD-FIX): split OAuth proxy single-bucket sharing across /oauth/register + /oauth/authorize + /oauth/token + /test-error. Either four independent limiter instances from OAUTH_RATE_LIMIT or a separate /test-error profile."
    status: pending
  - id: cluster-a-healthz-limiter
    content: "Phase 2.3 (FIND-004, SHOULD-FIX): add HEALTH_RATE_LIMIT profile (e.g. 600/min/IP) and apply in addHealthEndpoints so /healthz is no longer unbounded at the application layer."
    status: pending
  - id: cluster-a-hardening-adr-158
    content: "Phase 2.4 (FIND-005/006/007/009, HARDENING): ADR-158 amendment recording (a) cold-start counter reset acceptance OR shared-store decision; (b) per-instance counter divergence and explicit profile-units restatement; (c) removal of cosmetic /.well-known/openid-configuration Clerk skip-path; (d) optional GLOBAL_BASELINE_RATE_LIMIT decision."
    status: pending
  - id: cluster-a-getkey-resetkey-guard
    content: "Phase 2.5 (FIND-008, HARDENING): repo-wide static check (lint rule or unit test) asserting .resetKey, .resetAll, .getKey symbols never appear outside rate-limiting/. Lands with brand-preservation work since the brand expansion is what motivates it."
    status: pending
  - id: cluster-b-runGitCommand-lockdown
    content: "Cluster B (Phase 1, TOP PRIORITY): runGitCommand chain lockdown. **COMPLETE** as of 2026-04-28 (Luminous Dancing Quasar, claude-code, claude-opus-4-7-1m, two commits on PR-87). 9b2b2ed7 landed the architectural cure (validateGitSha at trust boundary, named gitShowFileAtSha+gitFetchShallow capabilities, scrubbedGitEnv, defence-in-depth on filePath, symmetric stderr diagnostics). 84571ccf finished the env-scrub (absolute /usr/bin/git, scrubbedGitEnv no longer reads PATH, eager check unwound, S3776 cognitive-complexity refactor via attemptShowAfterShallowFetch + readPackageJsonText helpers, removed /tmp/evil S5443 fixtures). All 5 reviewers absorbed (code/security/fred/test/wilma). Sonar hotspot AZ3D3iflrIk5eL0ceU__ closed; new_security_hotspots_reviewed flipped 90.9% → 100% OK; 0 TO_REVIEW. MUST-FIX argv-injection class closed. The cluster's two file-scoped Sonar issues (S5843 + S6644) carry forward to Phase 4 per plan."
    status: completed
  - id: cluster-b-vercel-runner
    content: "Cluster B (legacy id, kept for cross-reference): scope is fully captured under cluster-b-runGitCommand-lockdown above. Treat the WIP id as authoritative."
    status: completed
  - id: cluster-c-schema-cache
    content: "Cluster C: Schema-cache write boundary (CodeQL #76, #77). Introduce SchemaCache typed capability so validated OpenAPIObject, path, size, symlink, tempfile, and rename constraints are encoded at the capability boundary. No dismiss-with-rationale fallback."
    status: pending
  - id: cluster-h-semver
    content: "Cluster H: Semver pattern complexity (S5843 ×3). Decompose canonical semver pattern into named sub-patterns, remove the unnecessary validate-root-application-version copy, and preserve only the Vercel ignore-command inline exception through parity tests. No accept-with-rationale fallback."
    status: pending
  - id: cluster-i-health-probe
    content: "Cluster I: Health-probe regex modernisation (one regex, 4 findings on line 101)."
    status: pending
  - id: cluster-j-build-out
    content: "Cluster J: build-output-contract.ts .match() → .exec() migration (S6594 ×3 in one file)."
    status: pending
  - id: cluster-k-cmd-queue
    content: "Cluster K: agent-tools commit-queue micro-cluster (S7785 + S2310 + S7781 ×2). Per-site."
    status: pending
  - id: cluster-l-derive
    content: "Cluster L: agent-identity derive.ts replaceAll (S7781 ×3)."
    status: pending
  - id: cluster-m-runtime-sdk
    content: "Cluster M: sentry-node runtime-sdk.ts negated conditions (S7735 ×2)."
    status: pending
  - id: cluster-n-fitness
    content: "Cluster N: validate-practice-fitness.mjs negated conditions (S7735 ×2)."
    status: pending
  - id: cluster-o-singletons
    content: "Cluster O: Singleton micro-findings (4 isolated, per-site investigation)."
    status: pending
  - id: cluster-d-generated
    content: "Cluster D: Generated-code duplication (5.4% QG). Read templates, group duplication by source template, and refactor generator templates to emit shared shapes once. No cpd.exclusions, path exclusions, threshold renegotiation, or accept dispositions."
    status: pending
  - id: phase-9-verify
    content: "Phase 12: Push; re-fetch QG, hotspots, CodeQL alerts; update PR description with cluster resolutions and evidence citations."
    status: pending
---

# PR-87 Architectural Cleanup — Plan

**Plan id**: `pr-87-architectural-cleanup`
**Branch**: `feat/otel_sentry_enhancements`
**PR**: [#87](https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/87)
**Mode**: read live signals → cluster by architectural root cause → resolve clusters with structural changes → re-verify against live state.
**Final plan file location** when promoted: `.agent/plans/observability/active/pr-87-architectural-cleanup.plan.md` (replaces the previous `pr-87-quality-finding-resolution.plan.md` plan body, which the owner has indicated should not be inherited).

---

## Session history (verified live state)

### Session 1 (Pelagic Flowing Dock, 2026-04-27 ~14:05Z–17:25Z)

Phase 1 of this plan landed and pushed. Closed under owner-directed metacognitive correction after reproducing the morning's named drift pattern three times during enforcement-rule authoring.

**Commits pushed** (verified `git rev-parse HEAD == origin/feat/otel_sentry_enhancements == 0b8af81f`):

```text
0b8af81f docs(continuity): correct false 'all pushed' assertion; capture late-session drift
3c6a3958 docs(practice): record metacognitive lesson; new dormant void/_ rule; close session
9da90650 refactor(test): apply new void-and-underscore ban; build malformed fixtures positively
d1f5226b docs(principles): ban void <unused> and underscore-prefix as problem-hiding patterns
0d2d4dc8 chore(test): consolidate universal-tools test helpers; surface codegen TODO
3d4a0925 refactor(auth-routes): remove single-test re-export bridge
0e68aa87 chore(state): close Briny claim; promote PR-87 architectural cleanup plan
```

**Push status (verified Session 2 open)**: PUSHED. Branch is 0/0 ahead/behind origin; PR-87 head matches local HEAD. The Pelagic session-close header asserted "branch 6 ahead, NOT pushed"; the owner pushed between session-close and Session 2 opening. Replacing that stale assertion is the first job of this plan body.

### Session-1 outputs that survived close

- `.agent/directives/principles.md` — §"Don't hide problems — fix them or delete them" added (final strict form, no exemptions).
- `.agent/memory/active/napkin.md`, `distilled.md`, `repo-continuity.md` — drift-pattern lessons captured.
- `packages/core/oak-eslint/src/rules/no-problem-hiding-patterns.{ts,unit.test.ts}` + `plugin.ts` registration — **dormant rule**, **15 unit test cases** (8 valid + 7 invalid; verified by direct file read). Not enabled in any config tier (`recommended.ts`, `strict.ts`, `next.ts`, `react.ts`).
- The codegen sweep (~17 files) was reverted at session-close per owner direction.

### Session 2 (Opalescent Gliding Prism, 2026-04-27 18:21Z) — re-grounded execution

Independent verification at session-open found that several Session-1 status assertions had become stale by handoff time. **Verified live state catalogue** (with verification commands):

| Stale assertion | Source | Verified live (this session) |
| --- | --- | --- |
| "branch is 6 ahead of origin, NOT pushed" | Session-1 `§"Session 1"` body, thread record session-close header, comms-log session-close, Explore-agent inventory | **0/0 ahead/behind. Pushed.** `git rev-parse HEAD == origin == 0b8af81f`; PR head matches |
| "origin at `8cd49fe1` (owner pre-session discard)" | Session-1 `§"Session 1"` body | origin at `0b8af81f` |
| "7 OPEN CodeQL alerts on PR scope" | Session-1 `§"Live signal state"`, Explore report | **12 OPEN alerts** (5 new on `host-validation-error.unit.test.ts`) |
| "5.4% new_duplicated_lines_density" | Session-1 `§"Sonar QG conditions"` | **5.7%** |
| "1 TO_REVIEW hotspot, 90% reviewed" | Session-1 `§"Hotspots"` | **2 TO_REVIEW, 81.8% reviewed** (11 hotspots total) |
| "8 unit tests on the dormant rule" | Session-1 `§"Files committed at session-close"`, Explore report | **15 cases** (8 valid + 7 invalid) |
| "120 unit tests pass on the rule" | `.remember/today-2026-04-27.md` buffer | **15 cases** |
| auth-routes.ts alert 70 line 155, alert 81 line 108 | Session-1 `§"CodeQL alerts table"` | alert 70 at line **151**; alert 81 at line **106** (file changed via `3d4a0925`) |

### Owner direction at planning time (2026-04-27 18:00Z)

Decisions on the three forks named by the assumptions-reviewer:

1. **Decision 1B** — delete the dormant `no-problem-hiding-patterns` rule cleanly. Open a follow-up plan at `.agent/plans/observability/future/no-problem-hiding-patterns-rule-reinstatement.plan.md` to re-author enforcement under clean-conditions authorship later. The principle in `principles.md` stays; the violations remain in the codebase as a known remediation backlog addressed by the follow-up plan.
2. **Decision 2A** — execute the full 12-phase plan on PR-87 (Q + A + B + C + D + H + I + J + K + L + M + N + O). Holistic cleanup; PR-87 ships with `new_violations=0`, `new_security_hotspots_reviewed=100%`, and 0 OPEN CodeQL alerts unless a true non-issue has reproducible evidence or an owner-escalated blocker remains open with file:line evidence.
3. **Decision 3A** — Cluster Q first via Phase 0.5 sink probe.

### Phase 0.5 sink-probe outcome — Cluster Q is fixture-level dismiss-with-rationale

The regex sink behind CodeQL alerts #82–#86 is at `apps/.../src/host-header-validation.ts:6`:

```typescript
const regexPattern = '^' + pattern.replace(/\./g, '\\.').replace(/\*/g, '[a-z0-9.-]*') + '$';
return new RegExp(regexPattern);
```

The regex IS anchored (`^...$`). The other static regexes in the same file (lines 44, 48, 60) are also anchored. The CodeQL dataflow source at `host-validation-error.unit.test.ts:30/40/75/89` flows into a properly-anchored production regex; the alert message "may match anywhere" doesn't apply. Furthermore, several of the test-file source lines pass inputs that are rejected by `hasForbiddenHostCharacters` *before* reaching any regex (e.g. line 89's `'example.com:443@evil.com'` contains `@`, immediately rejected by `isValidHostHeader`).

**Disposition for Cluster Q**: dismiss all 5 CodeQL alerts (#82–#86) via the alerts-dismissal API with category `false_positive` and rationale citing the production-regex anchoring at `host-header-validation.ts:6`. Plus the new TO_REVIEW Sonar hotspot at `host-validation-error.unit.test.ts:70` (S5332 "http protocol insecure" — the test asserts `value: 'http://[::1]:3333'` for the documented ipv6 loopback semantics) — `accept`-with-rationale via Sonar MCP. **No production code changes for Cluster Q.**

### Session 2 outcomes (so far)

- **Phase 0 plan-body re-grounding**: committed at `882d1f2c docs(observability): re-ground PR-87 plan to verified live state`. Stale §"Session 1" + §"Live signal state" sections replaced with verified data.
- **Phase 1 dormant rule deletion**: committed at `cadc26eb chore(eslint): delete drift-authored no-problem-hiding-patterns rule`. -226 lines. Reinstate stub at `.agent/plans/observability/future/no-problem-hiding-patterns-rule-reinstatement.plan.md`.
- **Cluster Q dispositions**: 5 CodeQL alerts (#82–#86) dismissed as `false_positive` via `gh api` PATCH; 1 Sonar hotspot `AZ3PzDg2qR2lgcKGwtUx` `accept`-ed as SAFE via Sonar MCP. CodeQL OPEN alert count: 12 → 7. No production code changes.
- **Sentry-preview-validation re-scope**: `.agent/plans/observability/current/sentry-preview-validation-and-quality-triage.plan.md` frontmatter receiving-body updated to point at the active plan; Phases 3-5 marked superseded.
- **Cluster A sink-trace**: completed analysis (see Cluster A's "Sink-trace findings (Session 2)" sub-section). The structural cure requires multi-file type narrowing across rate-limiter-factory + 3 route-registration files + the test fake. This is fresh-session work — not landed in Session 2.
- **Push state at session-2 close**: HEAD = origin = `cadc26eb`; PR-87 head matches; 2 commits pushed this session (882d1f2c, cadc26eb).
- **Remaining work**: Cluster A (5 CodeQL alerts, structural cure), Cluster B + hotspot (1 Sonar hotspot + S5843 + S6644), Cluster C (2 CodeQL alerts), Clusters H/I/J/K/L/M/N/O/D (16 Sonar issues + 5.7% duplication QG).

---

## Context

PR-87 has been open for several weeks across multiple agent sessions. It is currently OPEN and MERGEABLE but two CI gates remain RED:

- **SonarCloud Code Analysis**: QG ERROR — `new_violations=27` (threshold ≤0), `new_duplicated_lines_density=5.4%` (threshold ≤3%), `new_security_hotspots_reviewed=90%` (threshold ≥100%, i.e. one unreviewed hotspot).
- **CodeQL combined**: 7 OPEN alerts on PR head — five `js/missing-rate-limiting` on auth/oauth/bootstrap route registrations, two `js/http-to-file-access` on the codegen schema-cache writer.

The previous session attempted to drive these gates green via per-rule disposition labelling and per-site mechanical sweeps. The owner has explicitly directed that this approach was wrong and that the previous session's notes are to be disregarded as guidance (they may still be consulted as raw data on which sites are flagged, but the framings — ACCEPT/DISABLE tables, "stylistic per-rule" suppressions, "out of scope per master plan" labelling — are rejected).

The new direction, demonstrated through four unstaged owner edits on the working tree, is that **findings are diagnostic signals, not work items**. Every signal is to be evaluated as *does this reveal a missing architectural constraint, or a structural bridge that shouldn't exist?*. Resolution must be a structural change that drops the finding count holistically and improves the codebase irrespective of the gate. Suppression, multicriteria-ignore, and per-rule disposition tables are forbidden (`principles.md` "NEVER disable any quality gates"; `feedback_never_ignore_signals` memory; `replace-dont-bridge` rule).

**Outcome target**: PR-87 green via disciplined architectural fixes that drive holistic quality up.

## Stance: long-term architectural excellence, no check disables

This plan is anchored on three non-negotiables:

1. **We are fully responsible for every line of code in this repository,
   including generated code.** Generated artefacts are not exempt from
   architectural standards; if a generator emits duplicated or non-compliant
   code, the generator is the work item.
2. **We do not disable checks.** Not at config level (`sonar-project.properties`
   exclusions, `eslint-disable`, ignore-files, `cpd.exclusions`, multicriteria
   blocks), and not at issue level via Sonar `accept` or CodeQL
   `false_positive` / `won't fix` dismissals that exist to make a finding go
   away. The only legitimate dismissal is one that records a true non-issue
   with reproducible evidence; Cluster Q met that bar because the production
   regex sink is anchored. That bar does not generalise to the remaining work.
3. **For every cluster, ask what long-term architectural excellence looks like
   at this site, and what, if anything, is stopping us achieving it.** If
   something blocks the cure, the blocker is the work item and is surfaced to
   the owner with evidence. We never present disable / accept / dismiss as a
   fallback option.

If a phase appears to offer optionality between an architectural cure and a
check-side disposition, that is a drafting failure to correct, not a design
choice.

Drift-trigger vocabulary that forces re-derivation at the site: "stylistic",
"false-positive", "out of scope", "convention", "language idiom",
"well-known name", "canonical TS idiom", "all done", "all pushed",
"all clean", "per the brief", "per the handoff", "per the prior session",
"fall back to", "if recognition does not propagate", "the TSDoc already
explains it", and "post-PR consolidation".

## The owner's architectural lens (load-bearing)

Four unstaged edits on the working tree at session open, each one a structural exemplar:

1. `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts` — removes `export { deriveSelfOrigin };`. **Lens: replace, don't bridge.** A re-export that exists to make a single consumer's import resolve is a structural bridge; cure is to fix the consumer's import.
2. `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.integration.test.ts` — consolidates inline helpers; adds a TODO comment "Replace this hack with the actual `getToolFromToolName` function, which should be defined at CodeGen time, ONCE." **Lens: single source of truth at codegen time.** Tests hand-rolling a registry stand-in says the codegen surface is missing a primitive that should be emitted once.
3. `apps/oak-curriculum-mcp-streamable-http/build-scripts/vercel-ignore-production-non-release-build.mjs:150` — comment "This is too generic, what commands do we use in this script, we need to lock this down." **Lens: purpose-specific capabilities, not generic runners.** `runGitCommand(args, cwd)` accepts arbitrary args; the script only uses `git show` and `git fetch`. The S4036 hotspot is the diagnostic; generality with no consumer is the cause.
4. `apps/oak-curriculum-mcp-streamable-http/build-scripts/vercel-ignore-production-non-release-build.mjs:188` — comment "Are we really taking an external runnable command and just running it?" **Lens: DI must inject a capability, not shell access.** Even with DI, forwarding a generic command-runner exposes too much surface. The seam should be `getPackageJsonAtSha(sha)`, not `executeGitCommand(args)`.

Every cluster in this plan is evaluated against these four lenses before any code changes.

## Live signal state (verified Session 2 open, 2026-04-27T18:21Z)

> Captured via Sonar MCP, GitHub CodeQL alerts API, and `gh pr view`/`gh api` against PR-87 head `0b8af81f`. The Session-1 snapshot was at head `8cd49fe1`; deltas in §"Session 2" verified-state catalogue above. The PR-scoped Sonar search returns exactly 27 issues, matching the QG `new_violations=27`.

### CI / quality gates

| Check | State | Notes |
| --- | --- | --- |
| `test` | IN_PROGRESS at session 2 open | Fresh run started 16:34:16Z (triggered by Session 1's pushes) |
| `Analyze (javascript-typescript)` ×2 | SUCCESS | Per-language CodeQL analyses pass |
| `Analyze (actions)` | SUCCESS | |
| `Cursor Bugbot` | SUCCESS | |
| Vercel preview | SUCCESS | |
| **`CodeQL` (combined)** | **FAILURE** | **12 OPEN alerts** on PR scope (was 7 in Session 1; 5 new on host-validation-error.unit.test.ts) |
| **`SonarCloud Code Analysis`** | **FAILURE** | QG ERROR on three conditions |

### Sonar QG conditions failing

| Metric | Threshold | Actual | Driver |
| --- | --- | --- | --- |
| `new_violations` | ≤0 | 27 | New-feature workstream code (commit-queue, agent-identity, build-metadata, observability, sentry-node, shell scripts) |
| `new_duplicated_lines_density` | ≤3% | **5.7%** | Generated SDK artefacts (api-schema-base.ts, response-map.ts, path-parameters.ts, curriculumZodSchemas.ts, etc.) — ADR-029 cardinal rule territory |
| `new_security_hotspots_reviewed` | ≥100% | **81.8%** | **2 TO_REVIEW hotspots**: `vercel-ignore-production-non-release-build.mjs:152` (S4036 PATH; Cluster B owner-flagged) and `host-validation-error.unit.test.ts:70` (S5332 http protocol; legacy hotspot re-surfaced by latest scan, fixture-level cure via Sonar MCP `accept`) |

### CodeQL OPEN alerts (12)

| # | Rule | Path | Line | Architectural shape |
| --- | --- | --- | --- | --- |
| 86 | js/regex/missing-regexp-anchor | `apps/.../host-validation-error.unit.test.ts` | 89 | **Cluster Q** — dataflow source; sink is anchored regex at `host-header-validation.ts:6` |
| 85 | js/regex/missing-regexp-anchor | `apps/.../host-validation-error.unit.test.ts` | 75 | **Cluster Q** — same |
| 84 | js/regex/missing-regexp-anchor | `apps/.../host-validation-error.unit.test.ts` | 40 | **Cluster Q** — same |
| 83 | js/regex/missing-regexp-anchor | `apps/.../host-validation-error.unit.test.ts` | 30 | **Cluster Q** — same |
| 82 | js/incomplete-hostname-regexp | `apps/.../host-validation-error.unit.test.ts` | 75 | **Cluster Q** — same |
| 81 | js/missing-rate-limiting | `apps/.../auth-routes.ts` | 106 | Function-block flag on `registerAuthenticatedRoutes` factory |
| 71 | js/missing-rate-limiting | `apps/.../auth-routes.ts` | 153 | `app.post(...)` inside the factory; CodeQL can't trace `RequestHandler`-typed limiter through DI |
| 70 | js/missing-rate-limiting | `apps/.../auth-routes.ts` | 151 | `app.get(...)` inside the factory; same shape |
| 72 | js/missing-rate-limiting | `apps/.../oauth-proxy/oauth-proxy-routes.ts` | 87 | `createOAuthProxyRoutes` factory with options-object DI |
| 69 | js/missing-rate-limiting | `apps/.../app/bootstrap-helpers.ts` | 151 | DI-shaped helper; bootstrap factory line, not a route registration |
| 76 | js/http-to-file-access | `packages/sdks/oak-sdk-codegen/code-generation/schema-cache.ts` | 99 | Codegen schema-cache write |
| 77 | js/http-to-file-access | `packages/sdks/oak-sdk-codegen/code-generation/schema-cache.ts` | 106 | Same file, second write site |

### Sonar PR-scoped issue inventory (27 total, full enumeration)

| Cluster | Rule | Count | Sites | Architectural shape |
|---|---|---|---|---|
| **B-vercel** | `javascript:S5843` | 1 | `vercel-ignore-production-non-release-build.mjs:21` | Semver regex complexity 32 vs 20 in pre-install-constrained script |
| **B-vercel** | `javascript:S6644` | 1 | `vercel-ignore-production-non-release-build.mjs:117` | Conditional default expression `value ? value : undefined` |
| **B-vercel hotspot** | `javascript:S4036` | 1 (TO_REVIEW) | `vercel-ignore-production-non-release-build.mjs:151` | PATH env access in generic `runGitCommand`; owner-flagged for capability-shaped DI |
| **H-semver** | `typescript:S5843` | 2 | `semver.ts:31`, `semver-parity.test.ts:34` | Same regex pattern, complexity 32 vs 20 — **canonical site of the truth** |
| **H-semver** | `javascript:S5843` | 1 | `validate-root-application-version.mjs:21` | Same pattern, inlined for pre-install constraint |
| **I-health-probe** | `typescript:S6594` | 1 | `health-probe-continuity-state.ts:101` | One regex; `.match()` → `.exec()` |
| **I-health-probe** | `typescript:S6353` | 3 | `health-probe-continuity-state.ts:101` ×3 | Same line; `[0-9]` → `\d` (3 character classes in one regex) |
| **J-build-out** | `typescript:S6594` | 3 | `build-output-contract.ts:35,42,80` | `.match()` → `.exec()` migration in same file |
| **K-cmd-queue** | `typescript:S7785` | 1 | `commit-queue.ts:13` | Top-level await over promise chain |
| **K-cmd-queue** | `typescript:S2310` | 1 | `commit-queue/args.ts:28` | Loop var reassign |
| **K-cmd-queue** | `typescript:S7781` | 2 | `commit-queue/core.ts:159` ×2 | `.replace()` → `.replaceAll()` |
| **L-derive** | `typescript:S7781` | 3 | `agent-identity/derive.ts:140,174,175` | `.replace()` → `.replaceAll()` in adjacent lines |
| **M-runtime-sdk** | `typescript:S7735` | 2 | `sentry-node/runtime-sdk.ts:140,141` | Adjacent negated conditions |
| **N-fitness** | `javascript:S7735` | 2 | `validate-practice-fitness.mjs:533,541` | Negated conditions in same script |
| **O-singletons** | `typescript:S6644` | 1 | `git-sha.ts:51` | Conditional default — per-site |
| **O-singletons** | `typescript:S6644` | 1 | `sentry-build-plugin.ts:139` | Conditional default — per-site |
| **O-singletons** | `javascript:S6644` | 1 | `validate-root-application-version.mjs:25` | Conditional default — per-site |
| **O-singletons** | `javascript:S7735` | 1 | `server-harness.js:174` | Negated condition — per-site |
| **Total** | | **27** | | |

> **Cluster size discipline**: a cluster groups findings only when one architectural shape resolves them all. K, L, M, N each have an in-file repeat. O is *not* a cluster — it's four unrelated singletons grouped only for tracking; each is a per-site investigation. Cluster H spans three files because the pattern is the *same byte sequence* — the canonical at `semver.ts` plus the parity-tested copy in `validate-root-application-version.mjs` plus the parity test itself.

### Hotspots (11; 2 TO_REVIEW)

- `vercel-ignore-production-non-release-build.mjs:152` (S4036 PATH) — TO_REVIEW. **Owner's two comments at lines 150 and 188 are the architectural cure direction**: replace generic `runGitCommand` with purpose-specific helpers; DI should inject `getPackageJsonAtSha`, not `executeGitCommand`. Cluster B target.
- `host-validation-error.unit.test.ts:70` (S5332 "http protocol insecure") — TO_REVIEW. NEW since Session 1 — re-surfaced legacy hotspot (created 2026-03-02, updated 2026-04-27T16:34:19Z). Test asserts `value: 'http://[::1]:3333'` for documented ipv6 loopback semantics; legitimate test fixture. **Disposition: `accept`-with-rationale via Sonar MCP. Single MCP call.**
- 9 others REVIEWED → SAFE in Session 1; do not re-touch.

### Review comments

- All inline review comments are bot-generated (CodeQL inline annotations + Sentry-review-bot "PR too large" + Vercel preview link). No human comments to address. Bot comments map 1:1 to the CodeQL alerts above; resolving the alerts resolves the comments.

## Architectural clusters

> Clusters are *root-cause groupings*, not rule groupings. A cluster spans multiple Sonar/CodeQL findings if and only if they share an architectural shape that one structural change resolves. Per-site investigation precedes cluster assignment; if a single rule-key fires for two different architectural reasons, it spans two clusters.

### Cluster Q: host-validation-error regex anchoring (5 CodeQL alerts + 1 Sonar hotspot — fixture-level)

**Findings**: CodeQL #82, #83, #84, #85, #86 + Sonar hotspot `AZ3PzDg2qR2lgcKGwtUx`.

**Architectural shape (from Phase 0.5 sink-probe)**: the actual regex sink is at `apps/oak-curriculum-mcp-streamable-http/src/host-header-validation.ts:6`, which builds an anchored (`^...$`) regex from a wildcard-host pattern. The static regexes at lines 44, 48, 60 are also anchored. CodeQL is locating the alerts at the dataflow source (the test file lines that pass strings into `deriveSelfOrigin`), but the sink the alerts are actually about is properly anchored. Furthermore, several of the test-file source lines pass inputs that are rejected by `hasForbiddenHostCharacters` *before* reaching any regex.

**Owner lens applied**: lens 1 (replace, don't bridge — no compatibility shim around the regex; the production code is correct).

**Resolution path**: dismiss-with-rationale on all 5 CodeQL alerts via the alerts-dismissal API with category `false_positive`; rationale cites the production-regex anchoring at `host-header-validation.ts:6`. Plus `accept`-with-rationale on Sonar hotspot `AZ3PzDg2qR2lgcKGwtUx` via Sonar MCP citing legitimate ipv6-loopback test-fixture context. **No production code changes.** All 6 dispositions land in one batch.

**Reviewers**: `code-reviewer` (gateway), `security-reviewer` (host-validation boundary), `test-reviewer` (the test fixtures themselves).

**ADR alignment**: `replace-dont-bridge` rule.

### Cluster A: rate-limit type narrowing through RateLimitRequestHandler (5 CodeQL alerts)

**Findings**: CodeQL #69, #70, #71, #72, #81 (all rule
`js/missing-rate-limiting`).

**Architectural intent**: the type system preserves `RateLimitRequestHandler`
(the brand from `express-rate-limit`'s public API: `RequestHandler & { resetKey,
getKey, resetAll? }`) end-to-end: factory return type, DI parameter types, and
registration-site argument types. No widening to `RequestHandler` anywhere on
the path from `rateLimit()` to `app.post(...)`.

This is the cure for the owner-named problem: making rate limiting visible to
analysis. A future route-registration registry may be valuable, but it is a
different architectural question; PR-87's current cure is brand preservation.

**Architectural debt to remove**: three production TSDoc blocks currently
attest that CodeQL cannot trace the limiter through `RequestHandler`-typed
parameters and that dismissals cite this attestation. Those blocks are
dismissal-with-rationale architecture and must be replaced by
brand-preservation TSDoc:

- `auth-routes.ts:23-29`;
- `auth-routes.ts:124-135`;
- `oauth-proxy-routes.ts:41-49`.

**What is stopping us today** (from Session-2 sink trace, preserved):

- `createDefaultRateLimiterFactory` returns `(options) => RequestHandler` at
  `rate-limiter-factory.ts:73-80`, dropping the `RateLimitRequestHandler` brand
  at the factory boundary. The widening is inherited by `RateLimiterFactory`.
- The widening propagates through `create-rate-limiters.ts`, `auth-routes.ts`,
  `oauth-proxy-routes.ts`, and into `app/bootstrap-helpers.ts` indirectly via
  the cross-cutting middleware chain.
- The test fake at `test-helpers/rate-limiter-fakes.ts:33-39` returns a plain
  handler and does not satisfy `RateLimitRequestHandler` (`getKey`, `resetKey`,
  etc.).
- CodeQL recognises specific rate-limiter packages including
  `express-rate-limit`; recognition propagates only if the type chain preserves
  the library type from factory to registration site.

**Alert #69 is structurally different**: `bootstrap-helpers.ts:151` is
`app.use(createRequestLogger(...))` inside `setupBaseMiddleware`, not an
authorising route registration. Default route: proceed with the
brand-preservation cure, observe post-push, and if #69 remains open, escalate
to the owner with file:line evidence. Do not dismiss it and do not preserve the
existing "misclassification" TSDoc as a substitute for the cure.

**Pre-phase adversarial security review**: completed 2026-04-28T11:54Z by
`security-reviewer` (claude-opus). Findings landed at
[`pr-87-cluster-a-security-review.md`](pr-87-cluster-a-security-review.md):
**2 MUST-FIX, 2 SHOULD-FIX, 4 HARDENING**. The headline (FIND-001/FIND-002):
`app.set('trust proxy', 1)` (`bootstrap-helpers.ts:246`) plus default
`keyGenerator` (no override at `rate-limiter-factory.ts:71-80`) means a single
attacker can rotate `X-Forwarded-For` to bypass *every* rate limiter. The
CodeQL `js/missing-rate-limiting` alerts point at a real exploitable problem,
not a recogniser limitation. **Brand preservation alone does not fix this.**

**Phase 2 sequencing (revised post-review)**: Phase 2.0.5 (FIND-001/002
keyGenerator cure) lands BEFORE the brand-preservation type narrowing. The
spoofing bypass is exploitable today; the brand work is structural. RED tests
for the keyGenerator do not depend on the brand chain.

### Phase 2.0.5 — Custom keyGenerator (FIND-001 / FIND-002 cure, MUST-FIX, BEFORE brand work)

Centralise a Vercel-aware `keyGenerator` in
`apps/oak-curriculum-mcp-streamable-http/src/rate-limiting/rate-limiter-factory.ts`
so every limiter created by `createDefaultRateLimiterFactory` uses the same
key extraction:

- Read `req.headers['x-vercel-forwarded-for']` first (single value, set by
  Vercel's edge from the TCP connection; not client-injectable through
  `x-forwarded-for` because Vercel writes it server-side). Split on comma,
  take the first entry (real client).
- Fall back to `req.ip` only when `x-vercel-forwarded-for` is absent (e.g.
  non-Vercel local development / smoke tests).
- Pass the chosen IP through `ipKeyGenerator(ip, 56)` (imported from
  `express-rate-limit`) for IPv6 subnet collapsing — `express-rate-limit`
  warns at `node_modules/express-rate-limit/dist/index.mjs:612-616` if a
  custom `keyGenerator` references `request.ip` without it.

Trust **only** `x-vercel-forwarded-for`. Do **not** consult `X-Real-IP`,
`Forwarded`, `True-Client-IP`, or `CF-Connecting-IP` — see FIND-003 in the
review evidence.

Sequence:

1. **RED**: in `rate-limiter-factory.unit.test.ts`, add tests asserting the
   keyGenerator returns the first comma-split entry of
   `x-vercel-forwarded-for` and falls back to `req.ip` only when the header
   is absent. Add an integration-level RED test (one limiter, mock
   `getKey`-equivalent observation) sending 200 requests with rotating
   `X-Forwarded-For` and asserting 429 after the configured limit.
2. **GREEN**: extend `RateLimiterOptions` -> the `rateLimit()` call in
   `createDefaultRateLimiterFactory` to pass `keyGenerator`. The
   keyGenerator is exported separately for testability (pure function on
   `Request -> string`).
3. **REFACTOR**: update TSDoc on `rate-limiter-factory.ts` to name the
   Vercel-aware key strategy as the architectural contract; cite
   ADR-078 + ADR-126 (HMAC pattern for asset routes shows the same trust
   discipline at boundaries) + the security-review findings file.
4. **Push and observe**: CodeQL alerts may not change immediately (recogniser
   is brand-shape-based, see Phase 2.1 below); the closure depends on Phase
   2.1 brand preservation. The keyGenerator cure is independent and is its
   own commit.

This phase is a **Cluster A scope expansion** because FIND-001/002 surfaced
during the pre-phase review and are MUST-FIX. The original Phase 2 brand
narrowing (now Phase 2.1 below) is structurally unchanged.

### Phase 2.1 — Brand-preservation type narrowing (original Cluster A plan)

**Sequence**:

1. RED: add a compile-time brand test with `@ts-expect-error` proving a
   deliberately widened `(opts) => RequestHandler` factory cannot satisfy
   `RateLimiterFactory`; add negative tests for each registration callsite that
   must reject a plain `RequestHandler`.
2. RED: add or extend fake tests proving the test fake satisfies the brand with
   observable `getKey` and `resetKey` behaviour.
3. GREEN: narrow `RateLimiterFactory`, all `RateLimiters` fields, route DI
   parameters, OAuth proxy options, and any composition-root widening site to
   `RateLimitRequestHandler`.
4. GREEN: extend `test-helpers/rate-limiter-fakes.ts` to satisfy the upstream
   interface. Any brand-construction cast is confined to that test helper and
   documented inline.
5. REFACTOR: replace stale TSDoc attestation blocks and grep for obsolete
   phrasing: `dismissals cite this attestation`, `cannot trace the limiter`,
   and `static analysis cannot trace`.
6. Push and verify. CodeQL must close the four route-registration alerts. If
   #69 remains open, escalate with evidence; alerts stay open until the
   architectural answer is found.

**Reviewers to dispatch**: `code-reviewer`, `type-reviewer`,
`architecture-reviewer-fred`, `architecture-reviewer-wilma`, `security-reviewer`
(pre- and post-implementation), `mcp-reviewer`, and `test-reviewer`.

**ADR alignment**: ADR-024 (DI), ADR-038 (compile-time types), ADR-078 (DI for
testability), ADR-158 (rate limiting), ADR-154 (separate framework from
consumer).

### Cluster B: Generic command-runners with no consumer-visible capability surface

**Findings**: hotspot `AZ3D3iflrIk5eL0ceU__` (S4036 at `vercel-ignore-production-non-release-build.mjs:151`); the owner's comments at lines 150 and 188 are the architectural-direction signal.

**Architectural shape**: scripts and helpers that accept arbitrary command arrays and forward to `execFileSync` (or equivalent). The consumer surface is too wide; only `git show` and `git fetch` are actually used. The hotspot fires on PATH env reading inside `execFileSync`, but the *cause* is the generality — locking down the capability removes both the hotspot and a class of future drift.

**Owner lens applied**: lens 3 + lens 4.

**Status**: COMPLETE as of 2026-04-28. Phase 1 and Phase 1.1 landed as:

- `9b2b2ed7` — architectural cure: `validateGitSha` at the trust boundary,
  named `gitShowFileAtSha` + `gitFetchShallow` capabilities, scrubbed git env,
  file-path defence-in-depth, and symmetric stderr diagnostics;
- `5d6622d0` — surgical fix for parallel-session seed-env rename drift;
- `84571ccf` — absolute `/usr/bin/git`, no PATH inheritance from scrubbed env,
  cognitive-complexity refactor, and removal of `/tmp/evil` fixtures.

**Outcome on PR-87 head `84571ccf`**: `new_security_hotspots_reviewed` flipped
90.9% → 100% OK; Sonar hotspot `AZ3D3iflrIk5eL0ceU__` closed via data-flow
change; 0 TO_REVIEW hotspots; MUST-FIX argv-injection class closed. CodeQL's 7
open alerts are unchanged and remain Cluster A + Cluster C targets. The script's
remaining S5843 semver-regex inline copy and S6644 conditional default carry to
Phase 4 / Phase 10 under the 12-phase sequence.

**Sweep finding**: the owner-mandated sibling generic-runner sweep found
`agent-tools/src/core/runtime.ts:130` and
`agent-tools/src/commit-queue/git.ts:16` as architectural-alignment candidates
with different threat models. They are follow-up candidates, not PR-87 security
fixes.

**Reviewers**: `code-reviewer`, `architecture-reviewer-fred`, `security-reviewer` (subprocess boundary), `test-reviewer`.

**ADR alignment**: ADR-024, ADR-154, ADR-155 (decompose at tension).

### Cluster C: Codegen schema-cache write boundary (2 CodeQL alerts)

**Findings**: CodeQL #76, #77 in `packages/sdks/oak-sdk-codegen/code-generation/schema-cache.ts:99,106`.

**Architectural shape**: `writeSchemaCacheIfChanged` writes upstream OpenAPI
schema bytes to disk during sdk-codegen. CodeQL flags this as
`js/http-to-file-access` because network-origin data flows to a file write. The
right cure is not to explain the existing runtime validation; it is to encode
the constraints in a capability interface so the write boundary itself is
architecturally narrow.

**Owner lens applied**: lens 1 (replace, don't bridge — no compatibility shim around the cache; if the validation is the cure, it's already there).

**Resolution path**: introduce a `SchemaCache` capability that exposes only
`read(): Promise<OpenAPIObject | null>` and `write(validated:
OpenAPIObject): Promise<boolean>`. The implementation owns path resolution,
symlink rejection, size budget, JSON serialisation, tempfile-and-rename
atomicity, and changed/unchanged detection. Codegen consumes the interface; it
does not see `cachePath` or `writeFile`. Pre-phase `security-reviewer` probes
upstream-bytes-to-disk attack scenarios before RED tests fix the contract.

**No dismiss-with-rationale fallback**: if CodeQL remains open, the dataflow is
still too wide and the remaining widening site is the next work item.

**Reviewers**: `code-reviewer`, `architecture-reviewer-fred`, `security-reviewer`, `type-reviewer`.

**ADR alignment**: ADR-029 (cardinal rule), ADR-031 (generation-time extraction).

### Cluster D: Generated-code Sonar findings (cardinal-rule territory)

**Findings**: any Sonar issue or duplication block whose path matches `packages/sdks/oak-sdk-codegen/src/types/generated/**` or `packages/sdks/oak-curriculum-sdk/src/types/generated/**`. The 5.4% new-code duplication in the QG is dominated by these files.

**Architectural shape**: generated code; fix MUST be in the generator template,
not in the generated output. Per ADR-029, generated artefacts are still our
responsibility. If the generator emits duplication, the generator is the work
item.

**Owner lens applied**: lens 2 (single source of truth at codegen time).

**Resolution path**:

1. Read the `code-generation/typegen/...` templates in full and confirm which
   template emits each duplicated block.
2. Pull Sonar duplication blocks and group by source template, not destination
   file.
3. Refactor templates to emit shared shapes into one canonical generated module;
   per-path emissions import or reference that shape instead of re-emitting it.
4. Re-run `pnpm sdk-codegen`; measure duplication density against the generated
   output.
5. If templates prove the shapes are not extractable for structural reasons,
   update the plan and escalate to the owner with per-block divergence evidence
   before any commit lands.

**No `cpd.exclusions`, path exclusions, QG-threshold renegotiation, or
issue-side accept dispositions.** Generated code is our code.

**Reviewers**: `architecture-reviewer-fred` (cardinal rule compliance), `architecture-reviewer-betty` (generator/consumer cohesion), `code-reviewer`.

**ADR alignment**: ADR-029, ADR-031, ADR-035, ADR-036, ADR-038, ADR-043.

### Cluster H: Semver pattern complexity (S5843 ×3 — canonical pattern at three sites)

**Findings**: `semver.ts:31`, `semver-parity.test.ts:34`, `validate-root-application-version.mjs:21` (and the same pattern at `vercel-ignore.mjs:21` is in Cluster B). Complexity score 32 vs threshold 20.

**Architectural shape**: this is the canonical npm-semver regex from
semver.org §2. The cure is to preserve spec fidelity while decomposing the
canonical recogniser into named sub-patterns whose composition is parity-tested.
Only one inline copy has a legitimate reason to remain:
`vercel-ignore-production-non-release-build.mjs` runs as Vercel's
`ignoreCommand` before `pnpm install`.

**Owner lens applied**: lens 2 (single source of truth at codegen time — but here the source is the semver spec). Decomposing into sub-patterns is the structural cure if it doesn't introduce drift between the pieces.

**Resolution path**:

1. Read `semver.ts:31`, the parity test, and both inline copies.
2. Decompose the canonical pattern into named sub-patterns such as
   `MAJOR_MINOR_PATCH`, `PRERELEASE_SEGMENT`, and `BUILD_METADATA`; verify each
   named sub-pattern stays below the complexity threshold.
3. Replace `scripts/validate-root-application-version.mjs`'s inline regex and
   parse helper with imports from `@oaknational/build-metadata`.
4. Apply the same decomposition at the only legitimate inline site
   (`vercel-ignore-production-non-release-build.mjs`).
5. Update the parity test so it preserves byte-equivalence for the Vercel inline
   exception only.

**No accept-with-rationale fallback**: if clean decomposition is impossible,
escalate the specific blocker to the owner with drift evidence.

**Reviewers**: `code-reviewer`, `type-reviewer`, `architecture-reviewer-fred`, `architecture-reviewer-betty`, `security-reviewer` (regex security context).

**ADR alignment**: ADR-031 (generation-time extraction), ADR-153 (constant-type-predicate).

### Cluster I: Health-probe regex modernisation (one line, four findings)

**Findings**: `agent-tools/src/core/health-probe-continuity-state.ts:101` — a single regex emits S6594 ×1 (`.match()` → `.exec()`) and S6353 ×3 (`[0-9]` → `\d` for three character classes).

**Architectural shape**: trivial mechanical modernisation; one regex, four findings drop together. No structural concern beyond the modernisation itself.

**Resolution path**: read the regex, read its consumer pattern, apply both modernisations together. RED: existing tests are the safety net; if the regex has no test coverage, add one for the parsed shape before the change. One commit.

**Reviewers**: `code-reviewer`.

### Cluster J: build-output-contract.ts RegExp.exec migration (S6594 ×3)

**Findings**: `build-output-contract.ts:35,42,80`. Same file, same rule, three sites.

**Architectural shape**: `.match()` returns `string[] | null`; `.exec()` returns `RegExpExecArray | null` and is preferred for capture-group extraction. Sonar prefers `.exec()` consistently. Per-site read confirms the migration shape; one commit if uniform.

**Resolution path**: read each site's surrounding code; identify whether `.match()` was used for boolean-test or capture-extraction. Migrate accordingly. RED: existing tests; ensure capture-group consumers don't shift index semantics.

**Reviewers**: `code-reviewer`, `type-reviewer`.

### Cluster K: agent-tools commit-queue micro-cluster

**Findings** (4 issues, recently arrived from Prismatic's queue migration): `commit-queue.ts:13` (S7785 top-level await), `commit-queue/args.ts:28` (S2310 loop-var reassign), `commit-queue/core.ts:159` ×2 (S7781 replaceAll).

**Architectural shape**: per-site investigation. The S2310 (loop-var reassign) is a real correctness signal; the others are convention. The S7781 ×2 on the same line suggests one expression with two `.replace` calls; a single edit may resolve both.

**Resolution path**: per-site reads; commit each substantive change separately or grouped only by file.

**Reviewers**: `code-reviewer`, `type-reviewer`, `test-reviewer`.

### Cluster L: derive.ts replaceAll (S7781 ×3)

**Findings**: `agent-identity/derive.ts:140,174,175`. Three `.replace()` calls in adjacent code.

**Architectural shape**: per-site read; if all three are global-replace patterns (e.g. `/[a-z]/g`), `.replaceAll()` is the correct semantic match. One commit.

**Reviewers**: `code-reviewer`.

### Cluster M: sentry-node runtime-sdk.ts negated conditions (S7735 ×2)

**Findings**: `sentry-node/runtime-sdk.ts:140,141`. Adjacent lines.

**Architectural shape**: per-site read; if the negation reads less clearly than
the positive form, refactor. If the negation is genuinely more idiomatic (e.g.
early-return guard), document the intent and escalate the residual signal to the
owner; do not silence it in Sonar and do not cosmetically refactor only for the
rule key.

**Reviewers**: `code-reviewer`, `sentry-reviewer` (since this is the Sentry runtime SDK).

### Cluster N: validate-practice-fitness.mjs negated conditions (S7735 ×2)

**Findings**: `validate-practice-fitness.mjs:533,541`. Same script, similar lines.

**Architectural shape**: per-site read; same disposition logic as M.

**Reviewers**: `code-reviewer`.

### Cluster O: Singleton micro-findings (NOT a cluster — tracked together for visibility)

**Findings**: `git-sha.ts:51` (S6644), `sentry-build-plugin.ts:139` (S6644), `validate-root-application-version.mjs:25` (S6644), `server-harness.js:174` (S7735). Four findings across four unrelated files.

**Architectural shape**: each is a per-site investigation. They are tracked under one task only because they don't fit any other cluster — each commits independently or with a directly-related neighbour.

**Resolution path**: read each at the site; classify and commit separately. The discipline: **commit messages must name the architectural shape, not the rule key**. A commit titled `refactor(sort): apply localeCompare comparator` (per the previous-session pattern) is the cluster discipline slipping.

**Reviewers**: `code-reviewer` per site.

## Execution sequencing

> **Discipline**: at every phase boundary, re-read `principles.md` §"Don't hide
> problems" and this plan's §Stance. Record the re-derivation in the plan,
> commit body, or reviewer dispositions. This plan is a map, not a disposition
> table.
>
> **Per-phase verification gate**: every phase ends with the relevant focused
> tests plus the repo-root gate sequence where the phase touches broad code:
> `pnpm sdk-codegen`, `pnpm build`, `pnpm type-check`, `pnpm lint:fix`,
> `pnpm test`, `pnpm test:root-scripts`, `pnpm markdownlint:root`,
> `pnpm format:root`, one at a time.
>
> **Reviewer stop-rule**: launch reviewers after substantive work and before
> the cluster commit. Every finding is absorbed inline or deferred with written
> rationale and owner-visible follow-up. Phases 1, 2, and 3 also open with a
> pre-phase adversarial `security-reviewer` pass.

### Phase 0: Re-grounding and live re-harvest

Re-pull PR-87 live signals before code changes: GitHub check rollup, human
review comments, Sonar QG, Sonar issues and hotspots, and CodeQL open alerts.
Update the cluster table if reality has shifted.

### Phase 1: Cluster B — git capability lockdown (DONE)

Cluster B is complete via `9b2b2ed7`, `5d6622d0`, and `84571ccf`. The remaining
work in the Vercel script flows into Phase 4 (semver inline copy) and Phase 10
(conditional default).

### Phase 2: Cluster A — rate-limit type narrowing

Run the pre-phase security review, add the negative compile-time brand tests,
narrow `RateLimiterFactory` and all route DI surfaces to
`RateLimitRequestHandler`, replace dismissal-style TSDoc, and push to observe
CodeQL recognition. Alert #69 follows the evidence ladder in Cluster A.

### Phase 3: Cluster C — SchemaCache typed capability

Run the pre-phase security review, then replace cache-path / unknown-value
write calls with a `SchemaCache` capability whose type signature encodes the
validated `OpenAPIObject` boundary and whose implementation owns file-system
constraints.

### Phase 4: Cluster H — semver decomposition and inline-copy removal

Decompose the canonical semver recogniser into named sub-patterns, remove the
unnecessary `validate-root-application-version.mjs` copy, preserve only the
Vercel pre-install inline exception, and prove parity.

### Phase 5: Clusters I + J — regex modernisations

Apply the health-probe and build-output-contract regex migrations with existing
tests or new focused tests where coverage is missing.

### Phase 6: Cluster K — commit-queue micro-sites

Treat K as three investigations, not a rule sweep: lifecycle shape at
`commit-queue.ts`, loop mutation correctness in `commit-queue/args.ts`, and
string transformation semantics in `commit-queue/core.ts`.

### Phase 7: Cluster L — agent-identity replaceAll sites

Read the adjacent transformations and either name the composed operation or
apply `.replaceAll()` only where it is the semantic match.

### Phase 8: Cluster M — sentry-node negated conditions

Read each Sentry runtime condition in context. Refactor only if the positive
form is actually clearer; otherwise escalate the residual signal to the owner
without issue-side suppression.

### Phase 9: Cluster N — practice-fitness negated conditions

Apply the same per-site investigation discipline to `validate-practice-fitness`
without inheriting Phase 8's outcome.

### Phase 10: Cluster O — singletons

Four unrelated sites, four investigations. `validate-root-application-version`
drops out if Phase 4 removes its inline semver parser.

### Phase 11: Cluster D — generated-code duplication

Read templates first, group duplication by source template, refactor generator
templates to emit shared shapes once, regenerate, and measure. If templates are
not extractable for structural reasons, escalate with per-block evidence.

### Phase 12: Push, re-verify, and update PR description

Push, wait for CI, re-fetch QG/hotspot/CodeQL state, and update the PR
description with per-cluster commit refs and evidence. If any gate remains red,
run a fresh metacognition pass before choosing the next architectural move.

## Files likely to be modified

- `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts` (Cluster A + Phase 1)
- `apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-routes.ts` (Cluster A)
- `apps/oak-curriculum-mcp-streamable-http/src/app/bootstrap-helpers.ts` (Cluster A)
- `apps/oak-curriculum-mcp-streamable-http/src/rate-limiting/create-rate-limiters.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/rate-limiting/test-helpers/rate-limiter-fakes.ts`
- New compile-time brand test for `RateLimitRequestHandler` propagation.
- `apps/oak-curriculum-mcp-streamable-http/build-scripts/vercel-ignore-production-non-release-build.mjs` (Cluster B + Phase 1)
- New tests for the two purpose-specific git helpers.
- `packages/sdks/oak-sdk-codegen/code-generation/schema-cache.ts` (Cluster C — read-and-decide before any change)
- `scripts/check-commit-message.sh` (Cluster F)
- 15+ sites for Cluster E across `agent-tools/`, `packages/core/build-metadata/`, `packages/core/oak-eslint/`, `packages/libs/sentry-node/`, `packages/core/observability/` — to be enumerated at session-open re-harvest.
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.integration.test.ts` (Phase 1 — keep owner's consolidation; defer the TODO).
- Possibly `code-generation/typegen/...` templates for Cluster D if owner authorises.
- Codegen templates under `packages/sdks/oak-sdk-codegen/code-generation/typegen/...`
  for Cluster D; generated artefacts update only through `pnpm sdk-codegen`.

## Existing infrastructure to reuse (non-exhaustive)

- `packages/core/build-metadata` — already owns `SEMVER_PATTERN`, `parseSemver`, `isLessThanOrEqual`. Cluster B's helpers may live alongside if cross-script reuse emerges, otherwise local to the consuming script per `consolidate-at-third-consumer`.
- `packages/core/oak-eslint` — could host a future custom rule enforcing route-registration shape (out of scope for this PR; flag as follow-up if it would be the natural enforcement vehicle for Cluster A's pattern).
- `@oaknational/result` — for Cluster E refactors that should `return Result<T, E>` rather than throw.
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/` — the codegen exit-point that the test-file TODO is about. Out of scope for this PR; surface as follow-up.
- `.agent/memory/active/patterns/` — `explicit-di-over-ambient-state.md`, `consolidate-at-third-consumer.md`, `const-map-as-type-guard.md`, `narrow-re-exports.md`, `fix-at-source.md`, `generator-first-mindset.md`. Cite per-cluster.

## ADR alignment

- **Cardinal rule** (ADR-029, ADR-030, ADR-031): generated code's source of truth is the template. Cluster D and the test-file TODO are both governed by this.
- **DI doctrine** (ADR-024, ADR-078): Cluster A and Cluster B both turn on DI-as-capability vs DI-as-shell-forwarding.
- **Constant-Type-Predicate** (ADR-153): the semver pattern is already an instance; Cluster D's analysis may surface other extension points.
- **Decompose at the tension** (ADR-155 / principles.md): every cluster boundary is a tension boundary.
- **Schema-first execution** (`schema-first-execution.md`): the schema-cache cluster (C) sits inside this directive.

## Reviewer dispatch matrix

Per-cluster, in parallel where possible, after the substantive work but before the next cluster begins (per `invoke-code-reviewers` rule):

| Cluster | Code | Type | Test | Security | Sentry | MCP | Arch-Fred | Arch-Betty | Arch-Wilma | Assumptions |
|---|---|---|---|---|---|---|---|---|---|---|
| A | ✓ | ✓ | ✓ | ✓ |  | ✓ | ✓ |  | ✓ |  |
| B | ✓ | ✓ | ✓ | ✓ |  |  | ✓ |  | ✓ |  |
| C | ✓ | ✓ |  | ✓ |  |  | ✓ |  |  |  |
| D | ✓ | ✓ |  |  |  |  | ✓ | ✓ |  |  |
| E | ✓ | ✓ | ✓ |  |  |  |  | ✓ | ✓ |  |
| F | ✓ |  | ✓ |  |  |  | ✓ |  |  |  |
| Phase 9 |  |  |  |  |  |  |  |  |  | ✓ |

Findings are action items by default (`principles.md` §Compiler Time Types). Absorbed in a follow-up commit if scoped within the cluster; deferred only with written rationale.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Cluster A brand preservation does not close all 5 CodeQL alerts | Locate the remaining widening site. If #69 remains structurally different, escalate with file:line evidence; do not dismiss. |
| Cluster D template refactor is materially larger than expected | Split by source template. If templates are not extractable for structural reasons, escalate with per-block evidence; do not add path exclusions. |
| Live re-harvest reveals the picture has shifted significantly (new commits, new alerts) | Phase 0 captures the divergence and the plan re-clusters before code changes. Surface in chat. |
| Drift from investigation-mode to disposition-mode under context pressure (the named recurring risk) | Re-read `principles.md` at every cluster boundary. Trigger words: "stylistic", "false-positive", "out of scope", "owner direction needed without analysis". If those words appear in my own output, stop, re-derive at the site. |
| Per-rule sweeps creep back in | Each commit must name an architectural shape, not a rule key, in its message. If a commit message reads `refactor(sort): apply localeCompare comparator`, the cluster discipline has slipped. |
| Reviewer dispatch on every cluster bloats context | Clusters that touch low-impact micro-rules can absorb their reviews into the cluster commit if reviewers return clean PASS verdicts. |

## Non-goals

- Re-validating the previous session's per-rule disposition table. The previous notes are not inherited.
- Mechanical "fix every site" sweeps without per-site investigation.
- `sonar.issue.ignore.multicriteria` blocks. (Already reverted at `dba01e7c`; do not reintroduce.)
- Underscore-rename of unused symbols (`feedback_no_underscore_rename_unused`).
- Disabling lint rules, type checks, or tests (`principles.md` §Code Quality).
- Bridges between old and new shapes during refactor (`principles.md` §Code Design "No shims, no hacks, no workarounds").
- Solving the `getToolFromToolName`-at-codegen-time TODO surfaced in Phase 1. That's a follow-up plan; surface and defer.
- Solving the unknown-source `vercel-ignore.mjs:21` regex edit (mentioned in prior session notes). Confirm with owner whether it persists; if it does, treat as a fresh per-site investigation, not as a previous-session inheritance.

## Verification

- Local: `pnpm sdk-codegen && pnpm build && pnpm type-check && pnpm lint:fix && pnpm test && pnpm test:root-scripts && pnpm markdownlint:root` after each cluster (one gate at a time per `start-right-thorough`).
- CI re-run after push at Phase 9.
- Sonar QG status via MCP; confirm `new_violations=0`,
  `new_security_hotspots_reviewed=100%`, and
  `new_duplicated_lines_density≤3%` or record the owner-escalated blocker with
  per-block evidence.
- CodeQL combined check via `gh pr checks 87`; confirm GREEN or record the
  owner-escalated blocker with file:line evidence.

## Lifecycle

- This in-repo plan is the single source of truth for PR-87 architectural
  cleanup. Personal platform plans are evidence only; do not consult them for
  execution guidance unless this file explicitly links to an extracted section.
- New evidence, owner direction, or phase deltas land here with `last_updated`
  refreshed and a session-history entry.
- At session close, run `/jc-session-handoff` and update the `observability-sentry-otel.next-session.md` thread record with cluster-by-cluster outcome.

## Open questions for the owner

(Not blocking the plan — flagged for the execution session.)

1. If Cluster A closes the four route-registration alerts but #69 remains open,
   does the owner want a global baseline limiter in `setupBaseMiddleware`, or a
   separate follow-up that treats cross-cutting middleware as a different
   architectural problem?
2. For the `getToolFromToolName`-at-codegen-time TODO, is there an existing plan
   for codegen tool-registry decomposition we should link to, or does this need
   a new strategic plan?

---

## Phase-1-style approval gate

Plan ready for review. Before exiting plan mode, owner may:

- Approve the plan as-written → execution session opens with Phase 0 re-harvest.
- Request a plan revision → return to design.
- Request an `assumptions-reviewer` stress-test before approval.
