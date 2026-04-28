---
name: PR-87 Architectural Cleanup
overview: >
  Drive PR-87 to green via cluster-by-architectural-root-cause resolution
  of CodeQL alerts and SonarCloud issues. Findings are diagnostic signals,
  not work items. Every cluster is evaluated against four owner-authored
  architectural lenses; each disposition re-derives from principles.md at
  the site. Supersedes pr-87-quality-finding-resolution.plan.md. Re-grounded
  execution scheduling lives at /Users/jim/.claude/plans/composed-petting-hejlsberg.md
  (Tidal Rolling Lighthouse, 2026-04-28); that plan owns 12-phase
  sequencing, fresh-evidence verification, and the absolute prohibition on
  check disables / `accept` / `false_positive` dispositions across all
  remaining clusters.
status: active
last_updated: 2026-04-28
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
    content: "Cluster Q (NEW): host-validation-error regex anchoring (5 CodeQL alerts #82-86 + 1 Sonar hotspot). Phase 0.5 sink probe complete: production regex IS anchored. Disposition: dismiss-with-rationale all 5 + Sonar `accept` on hotspot. No code changes."
    status: pending
  - id: phase-1b-delete-dormant-rule
    content: "Phase 1B: Delete dormant `no-problem-hiding-patterns` rule cleanly (rule.ts, .unit.test.ts, plugin.ts registration). Single commit. Then write reinstate stub plan in observability/future/."
    status: pending
  - id: cluster-a-rate-limiting
    content: "Cluster A: DI-opacity on route registration (5 CodeQL js/missing-rate-limiting alerts). Re-grounded plan §Phase 2: type narrowing through RateLimitRequestHandler end-to-end (factory return, DI param types, registration sites, test fake). Pre-phase security review of bypass paths. No fallback dispositions."
    status: pending
  - id: cluster-b-runGitCommand-lockdown
    content: "Cluster B (Phase 1, TOP PRIORITY): runGitCommand chain lockdown. **COMPLETE** as of 2026-04-28 (Luminous Dancing Quasar, claude-code, claude-opus-4-7-1m, two commits on PR-87). 9b2b2ed7 landed the architectural cure (validateGitSha at trust boundary, named gitShowFileAtSha+gitFetchShallow capabilities, scrubbedGitEnv, defence-in-depth on filePath, symmetric stderr diagnostics). 84571ccf finished the env-scrub (absolute /usr/bin/git, scrubbedGitEnv no longer reads PATH, eager check unwound, S3776 cognitive-complexity refactor via attemptShowAfterShallowFetch + readPackageJsonText helpers, removed /tmp/evil S5443 fixtures). All 5 reviewers absorbed (code/security/fred/test/wilma). Sonar hotspot AZ3D3iflrIk5eL0ceU__ closed; new_security_hotspots_reviewed flipped 90.9% → 100% OK; 0 TO_REVIEW. MUST-FIX argv-injection class closed. The cluster's two file-scoped Sonar issues (S5843 + S6644) carry forward to Phase 4 per plan."
    status: completed
  - id: cluster-b-vercel-runner
    content: "Cluster B (legacy id, kept for cross-reference): scope is fully captured under cluster-b-runGitCommand-lockdown above. Treat the WIP id as authoritative."
    status: completed
  - id: cluster-c-schema-cache
    content: "Cluster C: Schema-cache write boundary (CodeQL #76, #77). Per-site investigation; likely dismiss-with-rationale citing validate-then-cache + ADR-029."
    status: pending
  - id: cluster-h-semver
    content: "Cluster H: Semver pattern complexity (S5843 ×3). Decompose into named sub-patterns OR accept-with-rationale per-site citing semver.org §2 + parity test."
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
    content: "Cluster D: Generated-code duplication (5.4% QG). Per-template generator-inefficiency vs generator-semantic analysis. Owner-authorised cpd.exclusions if generator-semantic."
    status: pending
  - id: phase-9-verify
    content: "Phase 9: Push; re-fetch QG, hotspots, CodeQL alerts; update PR description with cluster resolutions and rationale citations."
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
2. **Decision 2A** — execute the full 11-cluster plan on PR-87 (Q + A + B + C + D + H + I + J + K + L + M + N + O). Holistic cleanup; PR-87 ships with `new_violations=0`, `new_security_hotspots_reviewed=100%`, and 0 OPEN CodeQL alerts (or each remaining alert dismissed-with-rationale).
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

### Cluster A: DI-opacity on route registration (5 CodeQL alerts)

**Findings**: CodeQL #69, #70, #71, #72, #81.

**Architectural shape**: Express route handlers registered inside factory functions where the rate-limit middleware is passed as a structurally-typed `RequestHandler` parameter. CodeQL's static analysis can't trace the limiter's lineage through the DI seam, so it flags every route-registration site as missing rate-limit middleware. The dismissal-with-rationale path treats the symptom; the architectural cure is to make the limiter's presence *legible to static analysis* — either by surface shape (a `withRateLimit(limiter, handler)` wrapper at the registration site, where the relationship is structurally apparent) or by route-factory shape (a `createRateLimitedRoute({ limiter, method, path, handler })` helper that holds the contract internally).

**Sink-trace findings (Session 2, Opalescent Gliding Prism)**:

- The widening from `RateLimitRequestHandler` (the type `express-rate-limit`'s `rateLimit()` returns) to `RequestHandler` happens at `apps/oak-curriculum-mcp-streamable-http/src/rate-limiting/rate-limiter-factory.ts:73-80`: `createDefaultRateLimiterFactory` returns `(options) => RequestHandler`, dropping the rate-limiter type signal at the factory boundary. The widening is inherited by `RateLimiterFactory` (line 44).
- The test fake at `test-helpers/rate-limiter-fakes.ts:33-39` returns a plain `(req, res, next) => next()` typed as `RequestHandler` — it does not satisfy the `RateLimitRequestHandler` interface (missing `getKey`, `resetKey`, etc.).
- CodeQL's `js/missing-rate-limiting` rule recognises specific rate-limiter packages including `express-rate-limit`. Recognition would propagate IF the type chain preserves `RateLimitRequestHandler` from factory to registration site.
- A simple curry wrapper (`withRateLimit(limiter, handler)` returning `[limiter, handler]`) does NOT change the dataflow; CodeQL would see the same `RequestHandler[]` shape. Curry alone is unlikely to be recognised.
- The genuine structural cure requires narrowing the type chain end-to-end: factory return type → DI parameter types in auth-routes/oauth-proxy-routes/bootstrap-helpers, plus extending the test fake to satisfy the narrowed type (stub `getKey` / `resetKey` etc.). This is a multi-file change touching ~6 files, requiring TDD on the fake and reviewer dispatch on the parameter-type narrowing.

**Owner lens applied**: lens 4 (DI must inject a capability, not raw structural shape). The current `RequestHandler` parameter is too generic — a route-factory caller can pass anything. The seam needs to be a *capability*: "register this handler under this rate-limit policy."

**Owner lens applied**: lens 4 (DI must inject a capability, not raw structural shape). The current `RequestHandler` parameter is too generic — a route-factory caller can pass anything. The seam needs to be a *capability*: "register this handler under this rate-limit policy."

**Resolution path** (to be confirmed per-site before code changes):

1. Read each flagged site at the file:line. Note the actual signature, the limiter source, and the route's handler.
2. Sketch a `withRateLimit(limiter, handler)` curry. Verify CodeQL recognises it (CodeQL has a known set of rate-limiter recognisers; check `gh api /repos/.../code-scanning/alerts/N` for what the rule expects).
3. If `withRateLimit` is recognised, apply at all five sites in one commit (TDD: existing E2E rate-limit tests are the safety net; add an integration test if a site lacks coverage). One commit, one cluster.
4. If `withRateLimit` is NOT recognised, fall back to a `createRateLimitedRoute` helper or to dismissal-with-rationale citing `b1a4cd79`'s in-code TSDoc evidence — but only after the structural option has been ruled out, not before.

**Reviewers to dispatch**: `code-reviewer` (gateway), `architecture-reviewer-fred` (DI rule compliance), `architecture-reviewer-wilma` (rate-limit failure modes), `security-reviewer` (auth/limiter boundary), `mcp-reviewer` (MCP route shape), `test-reviewer` (rate-limit test coverage). Run in parallel.

**ADR alignment**: ADR-024 (DI), ADR-078 (DI for testability), ADR-158 (rate limiting), ADR-154 (separate framework from consumer).

### Cluster B: Generic command-runners with no consumer-visible capability surface

**Findings**: hotspot `AZ3D3iflrIk5eL0ceU__` (S4036 at `vercel-ignore-production-non-release-build.mjs:151`); the owner's comments at lines 150 and 188 are the architectural-direction signal.

**Architectural shape**: scripts and helpers that accept arbitrary command arrays and forward to `execFileSync` (or equivalent). The consumer surface is too wide; only `git show` and `git fetch` are actually used. The hotspot fires on PATH env reading inside `execFileSync`, but the *cause* is the generality — locking down the capability removes both the hotspot and a class of future drift.

**Owner lens applied**: lens 3 + lens 4.

**Resolution path** (TDD):

1. RED: write integration tests for `gitShowFileAtSha(sha, path)` and `gitFetchShallow(sha)` in the build-scripts module. Tests inject a fake executor and assert the exact args passed.
2. GREEN: replace `runGitCommand(args, cwd)` with the two purpose-specific helpers. Update `runVercelIgnoreCommand` DI surface from `executeGitCommand` to `gitShowFileAtSha` + `gitFetchShallow`. Verify the two consumers in `safeReadPreviousVersion` migrate cleanly.
3. REFACTOR: TSDoc the new capabilities; cite ADR-024 (DI as capability); link the parity test (`semver-parity.test.ts`) for the pre-install constraint.
4. After the refactor, the hotspot at line 151 may no longer apply (PATH access is no longer in a generic-runner; it's in a purpose-specific helper, evaluated on its own merits). If it still fires, REVIEW with rationale citing the new shape — no suppression.

**Sweep**: search the repo for other generic command-runners with the same shape (`execFileSync`, `execSync`, `spawn` with args-array DI). Each instance is a candidate for the same cure.

**Reviewers**: `code-reviewer`, `architecture-reviewer-fred`, `security-reviewer` (subprocess boundary), `test-reviewer`.

**ADR alignment**: ADR-024, ADR-154, ADR-155 (decompose at tension).

### Cluster C: Codegen schema-cache write boundary (2 CodeQL alerts)

**Findings**: CodeQL #76, #77 in `packages/sdks/oak-sdk-codegen/code-generation/schema-cache.ts:99,106`.

**Architectural shape**: `writeSchemaCacheIfChanged` writes upstream OpenAPI schema bytes to disk during sdk-codegen. CodeQL flags this as `js/http-to-file-access` (network data → file), conservatively assuming the upstream is untrusted. The build-time context is genuinely defence-in-depth — the schema is fetched, validated, then cached — so the architectural answer may be "this is correctly modelled; the static rule's assumption doesn't apply at build time." The owner has reaffirmed (per Briny-session notes, taken here only as data) that the defence-in-depth shape is correct: validate-then-cache.

**Owner lens applied**: lens 1 (replace, don't bridge — no compatibility shim around the cache; if the validation is the cure, it's already there).

**Resolution path**: this is the cluster most likely to resolve via dismiss-with-rationale rather than refactor — but only after per-site investigation confirms the architectural answer. The dismissal MUST cite (a) the validate-then-cache flow with file:line evidence, (b) the build-time-not-runtime context, (c) ADR-029 (schema is the source of truth; cache is build-time materialisation).

**Reviewers**: `code-reviewer`, `architecture-reviewer-fred`, `security-reviewer`, `type-reviewer`.

**ADR alignment**: ADR-029 (cardinal rule), ADR-031 (generation-time extraction).

### Cluster D: Generated-code Sonar findings (cardinal-rule territory)

**Findings**: any Sonar issue or duplication block whose path matches `packages/sdks/oak-sdk-codegen/src/types/generated/**` or `packages/sdks/oak-curriculum-sdk/src/types/generated/**`. The 5.4% new-code duplication in the QG is dominated by these files.

**Architectural shape**: generated code; fix MUST be in the generator template, not in the generated output. Per ADR-029 cardinal rule. The 84.7% duplication density on `api-schema-base.ts` and similar files is structural to the codegen — different OpenAPI paths produce similar TypeScript shapes. The duplication is *real* in the file but is *intent* of the generator, not accident of authoring.

**Owner lens applied**: lens 2 (single source of truth at codegen time).

**Resolution path**:

1. Per-file: identify the generator that produced it (`code-generation/typegen/...`).
2. For each duplication block, ask: is this a generator inefficiency (could template emit a shared utility once?) or generator semantics (each path genuinely needs its own shape)?
3. For generator inefficiency: refactor the template to emit a shared module + per-path re-references. Re-run `pnpm sdk-codegen`. Verify the duplication density drops.
4. For generator semantics: cluster D becomes a *Sonar exclusion* candidate (Sonar's CPD applied to generated code is a category error). Use Sonar UI / `sonar-project.properties` `sonar.cpd.exclusions` for the generated paths. **This is NOT a "disable a rule" suppression** — it's "tell Sonar that generated code paths are not authored code, which is true." Owner authorisation required before applying any Sonar config change.

**Reviewers**: `architecture-reviewer-fred` (cardinal rule compliance), `architecture-reviewer-betty` (generator/consumer cohesion), `code-reviewer`.

**ADR alignment**: ADR-029, ADR-031, ADR-035, ADR-036, ADR-038, ADR-043.

### Cluster H: Semver pattern complexity (S5843 ×3 — canonical pattern at three sites)

**Findings**: `semver.ts:31`, `semver-parity.test.ts:34`, `validate-root-application-version.mjs:21` (and the same pattern at `vercel-ignore.mjs:21` is in Cluster B). Complexity score 32 vs threshold 20.

**Architectural shape**: this is the canonical npm-semver regex from semver.org §2 — its complexity is *intrinsic* to the spec it implements. The pattern is referenced by parity tests; rewriting it to lower the complexity score risks losing semver-spec fidelity. The legitimate options are: (a) decompose the pattern into smaller named sub-patterns composed at use-time (preserves spec fidelity, lowers per-pattern complexity score), (b) accept-with-rationale citing semver.org §2 + the parity test as the genuine source-of-truth gate (a *Sonar exclusion at a single line* is a category-error claim that the pattern is mis-modelled — Sonar's complexity heuristic doesn't model "this is a literal external spec").

**Owner lens applied**: lens 2 (single source of truth at codegen time — but here the source is the semver spec). Decomposing into sub-patterns is the structural cure if it doesn't introduce drift between the pieces.

**Resolution path**:

1. Read `semver.ts:31` and the parity test. Sketch a decomposition: `MAJOR_MINOR_PATCH = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/`, `PRERELEASE_SEGMENT = /[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*/`, etc. Compose at use-time. Verify Sonar's complexity drops below 20 per sub-pattern.
2. If decomposition is clean: apply at canonical (`semver.ts`) AND at the parity test (which must mirror canonical, not the components). The parity test continues to assert byte-equivalence between the composed result and the inline copies — this preserves the anti-drift gate.
3. If decomposition causes drift risk or readability loss: accept-with-rationale via Sonar MCP, citing semver.org §2 + the parity test as the architectural gate. **Each site individually**, not a multicriteria block. The `accept` action in Sonar MCP is per-issue, with rationale text.
4. The inlined copies at `validate-root-application-version.mjs` and `vercel-ignore.mjs` follow the canonical's disposition; they're parity-tested.

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

**Architectural shape**: per-site read; if the negation reads less clearly than the positive form, refactor. If the negation is genuinely more idiomatic (e.g. early-return guard), document the intent and accept. One commit either way.

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

> **Discipline**: At every cluster boundary, re-read `principles.md` (per the napkin's `feedback_never_ignore_signals` and the drift-pattern lesson). Re-derive disposition from first principles, not from this plan's table — this plan is a *map*, not a disposition table.

### Phase 0: Re-grounding and live re-harvest (no code changes)

Re-pull the live signals (gates may have shifted) and confirm the cluster table:

1. `gh pr view 87 --json statusCheckRollup,reviewDecision` — confirm RED gates unchanged.
2. `gh pr view 87 --comments` and `gh api .../pulls/87/comments --paginate` — capture any new human review comments since 12:45Z.
3. `mcp__sonarqube__get_project_quality_gate_status` for PR 87 — confirm conditions and values.
4. `mcp__sonarqube__search_sonar_issues_in_projects` paginated to exhaustion (the 100-issue cap in the prior pull is suspicious).
5. `mcp__sonarqube__search_security_hotspots` — confirm the one TO_REVIEW.
6. `gh api /repos/.../code-scanning/alerts?ref=refs/pull/87/head&state=open --paginate` — confirm 7 OPEN.

Update Cluster table if the live state differs. Surface any divergence in chat before continuing.

### Phase 1: Owner's working-tree edits

The four unstaged edits are the architectural exemplars. Convert them to commits with the right semantic boundary:

1. `auth-routes.ts` `export deriveSelfOrigin` removal: find the consumer that depends on the bridge; either fix the consumer's import (preferred) or confirm the export is genuinely orphaned. One commit per file with a TSDoc note explaining the lens.
2. `universal-tools.integration.test.ts` consolidation: keep the consolidation; the TODO comment about `getToolFromToolName` at codegen time becomes a separate work-item linked to the SDK codegen plan (do not solve in this PR — surface the lens, defer the implementation).
3. `vercel-ignore.mjs` comments: these become the design spec for Cluster B. The comments themselves should land as TSDoc once the refactor is in (or be deleted if the refactor renders them obvious).

### Phase 2: Cluster A (DI-opacity / rate-limiting) — highest CI value

5 of 7 CodeQL OPEN alerts close together via one structural change. Highest gate impact per unit of work, and the most architecturally interesting cluster. Reviewer dispatch in parallel; absorb findings; one cluster commit.

### Phase 3: Cluster B (generic command-runner) — owner's named direction

The hotspot resolves and the script gains capability-shaped DI. One TDD cycle: tests for the two helpers first, then the refactor.

### Phase 4: Cluster C (schema-cache write) — likely dismiss-with-rationale

After Cluster A and B's work is in, reviewer dispatch on the cache write site. If reviewers confirm the validate-then-cache shape is the correct architectural answer, dismiss-with-rationale citing the flow. If reviewers identify a cleaner structural shape, refactor.

### Phase 5: Cluster H (semver pattern complexity) — design decision

Read the canonical `semver.ts:31`. Sketch decomposition. If it preserves spec fidelity and lowers the score, apply at canonical + parity test + inlined copies. If not, accept-with-rationale per-site via Sonar MCP citing semver.org §2 + parity test gate. No multicriteria.

### Phase 6: Clusters I + J (regex modernisations) — mechanical with TDD safety net

Health-probe one-line fix; build-output-contract three-site migration. Each is a small commit; tests are the safety net.

### Phase 7: Clusters K + L + M + N + O (per-site investigations)

Per-site investigation, per-site disposition. No per-rule sweeps. Commit messages name architectural shape, not rule key.

### Phase 8: Cluster D (generated-code duplication) — the 5.4% question

After the new_violations gate is closing in on 0 (clusters A–F applied), evaluate whether the 5.4% new-duplication is dominantly generated-code structural duplication. If yes, owner-authorisation conversation: do we (a) refactor templates to emit shared utilities, (b) add Sonar `cpd.exclusions` for generated paths citing ADR-029 (with rationale, not as suppression), or (c) accept that this PR's duplication threshold doesn't reflect authored-code quality and discuss the threshold itself?

This phase is intentionally last because it requires the cleaner authored-code state from prior phases to make the generated-code signal legible.

### Phase 9: Re-verify on live state

1. Push.
2. Wait for fresh CI run.
3. Re-fetch QG status, hotspot states, CodeQL alerts.
4. PR description: enumerate the cluster resolutions, per-cluster commit refs, dismissed-with-rationale citations (if any) so reviewers see the architecture without a Sonar/Sonar-MCP login.
5. If any gate remains RED: open a fresh metacognition pass before deciding the next move. Do NOT dispose by suppression.

## Files likely to be modified

- `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts` (Cluster A + Phase 1)
- `apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-routes.ts` (Cluster A)
- `apps/oak-curriculum-mcp-streamable-http/src/app/bootstrap-helpers.ts` (Cluster A)
- New: a `withRateLimit` curry or `createRateLimitedRoute` helper, location TBD per the architectural reviewer's verdict. Candidate workspace: `apps/oak-curriculum-mcp-streamable-http/src/auth-routes/` (app-local) or `packages/libs/...` (if cross-app).
- `apps/oak-curriculum-mcp-streamable-http/build-scripts/vercel-ignore-production-non-release-build.mjs` (Cluster B + Phase 1)
- New tests for the two purpose-specific git helpers.
- `packages/sdks/oak-sdk-codegen/code-generation/schema-cache.ts` (Cluster C — read-and-decide before any change)
- `scripts/check-commit-message.sh` (Cluster F)
- 15+ sites for Cluster E across `agent-tools/`, `packages/core/build-metadata/`, `packages/core/oak-eslint/`, `packages/libs/sentry-node/`, `packages/core/observability/` — to be enumerated at session-open re-harvest.
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.integration.test.ts` (Phase 1 — keep owner's consolidation; defer the TODO).
- Possibly `code-generation/typegen/...` templates for Cluster D if owner authorises.
- Possibly `sonar-project.properties` for Cluster D `cpd.exclusions` if owner authorises (with explicit rationale comment, not as a suppression).

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
| Cluster A's `withRateLimit` curry is not recognised by CodeQL → 5 alerts remain OPEN | Sketch and probe in a small commit first; if not recognised, fall back to dismiss-with-rationale citing in-code TSDoc evidence (commit `b1a4cd79`). Decide the fallback path before sinking effort. |
| Cluster D requires owner-authorisation for Sonar config changes; owner pause may stall the QG green | Sequence Cluster D last; have clusters A, B, C, E, F drive `new_violations` to 0 first so that Cluster D is the only remaining QG condition to negotiate. |
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
- Sonar QG status via MCP; confirm `new_violations=0` (or owner-accepted explanation), `new_security_hotspots_reviewed=100%`, `new_duplicated_lines_density≤3%` (or owner-authorised generated-path treatment).
- CodeQL combined check via `gh pr checks 87`; confirm GREEN or all remaining alerts have explicit dismiss-with-rationale citing architectural evidence.

## Lifecycle

- This plan body lives at `/Users/jim/.claude/plans/1-those-were-my-composed-key.md` during planning.
- On promotion (post-approval), copy to `.agent/plans/observability/active/pr-87-architectural-cleanup.plan.md` with a YAML frontmatter for executable plans (id, status, todos), and supersede the previous `pr-87-quality-finding-resolution.plan.md`.
- Close the previous Briny Ebbing Lagoon claim (`331bce87`) at session start before opening a new claim covering this plan's pathspecs.
- At session close, run `/jc-session-handoff` and update the `observability-sentry-otel.next-session.md` thread record with cluster-by-cluster outcome.

## Open questions for the owner

(Not blocking the plan — flagged for the execution session.)

1. For Cluster D, is owner-authorisation pre-conditional to *any* Sonar config change, or are we authorised to add `sonar.cpd.exclusions` for `**/types/generated/**` paths if the architectural reviewer confirms the duplication is generator-semantic rather than generator-inefficiency?
2. For Cluster A, do we have a preference between the `withRateLimit(limiter, handler)` curry shape and the `createRateLimitedRoute({ ... })` factory shape if both are recognised by CodeQL?
3. For the `getToolFromToolName`-at-codegen-time TODO, is there an existing plan for codegen tool-registry decomposition we should link to, or does this need to be a new strategic plan in `.agent/plans/.../future/`?

---

## Phase-1-style approval gate

Plan ready for review. Before exiting plan mode, owner may:

- Approve the plan as-written → execution session opens with Phase 0 re-harvest.
- Request a plan revision → return to design.
- Request an `assumptions-reviewer` stress-test before approval.
