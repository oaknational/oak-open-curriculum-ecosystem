# Next-Session Record — `observability-sentry-otel` thread

**Last refreshed**: 2026-04-25 (Keen Dahl / claude-code /
claude-opus-4-7-1m — Phase 0 walk + assumptions-reviewer close.
Eight unpushed commits (`b0c565b4 … 2484066b`) pushed at session
open; remote moved `d318b8bd..b0c565b4` after pre-push hook
ran clean (84 tasks, all green; one local cache miss on
Playwright browsers fixed mid-flight). PR #87's CI test job is
re-running against new HEAD; CodeQL combined and SonarCloud
Quality Gate still fail until Phase 1+ work lands. Phase 0
findings populated for all four tasks: 0.1 OAuth metadata
rate-limit (REAL GAP — fix in Phase 3 Task 3.2 via route-level
attach); 0.2 stylistic-rule policy (per-rule ACCEPT/DISABLE
table; owner gate now at Phase 0 close per assumptions-reviewer
MAJOR-B; default-to-ACCEPT fallback); 0.3 semver extraction
home (`packages/core/build-metadata/src/semver.ts` using **npm
`semver` package** per assumptions-reviewer MAJOR-A — sibling
`release-internals.ts:14` already imports from npm `semver`;
two inline copies retained with a parity-test anti-drift gate);
0.4 Vercel PATH safety (ACCEPT-with-rationale; date-stamped
docs citation per MINOR-B). `assumptions-reviewer` ran 18:53Z
post-Task-0.4: three MAJOR + one MINOR + one POSITIVE absorbed
into a new Reviewer Dispositions table in the plan body. Both
Phase 0 close gates (`code-reviewer` 2026-04-25 commit `0c04e7d5`,
`assumptions-reviewer` 2026-04-25 this session) satisfied.
**Phase 1 entry is unblocked subject to two owner-gate items**:
DISABLE-list confirmation for S6594/S6644/S7748 (default-to-ACCEPT
applies if owner is async-only); Phase 1's RED→GREEN sequencing
landing the parity test alongside the canonical module + two
inline `@see` pointer edits. Coordination with parallel agent
Fresh Prince on the `agentic-engineering-enhancements` thread
(register-promotion pass): clean parallel-proceed via embryo-log
ping at 18:46Z and ack at 18:54Z; I dropped `repo-continuity.md`
from my touch-set to avoid whole-file collision; my session
summary is captured here in the next-session record instead.
This session is plan-edit + reviewer-dispatch only — no
observability runtime code moved.)

**Prior refresh**: 2026-04-25 (Codex / codex / GPT-5 — session handoff after
reviewer-finding reintegration packaged as `d9cb54e8` and owner push.
Branch is in sync with origin at `cc71507b`; the pushed history includes WS3
release cancellation `2822e525`
(`fix(mcp): relocate production cancellation gate`). Lane B startup/release
boundary implementation landed as `9ea3ccd8`
(`fix(observability): decouple local startup from sentry release`). Reviewer
findings are now folded back into code/docs; focused tests, `pnpm type-check`,
`pnpm lint`, `pnpm knip`, `pnpm test`, `pnpm build`, targeted markdownlint,
`pnpm portability:check`, `pnpm markdownlint-check:root`, and
`git diff --check` passed before final handoff edits. Full `pnpm check` was
not rerun after those final doc-only edits. No staged WS3 residue is expected.
Next Sentry-focused session should collect deployed-state evidence for the
pushed branch.)

**Prior refresh**: 2026-04-25 (Codex / cursor / GPT-5.5 — session handoff
after completing
[`gate-recovery-cadence.plan.md`](../../../plans/observability/active/gate-recovery-cadence.plan.md)
for the current branch state and beginning startup-boundary Phase 2 GREEN.
Missing-symbol REDs now have typed production-owned seams; Sentry off mode no
longer resolves/carries release identity; app-version header/meta consumers and
local dev/smoke deploy-metadata stripping are wired. Focused tests, build,
type-check, knip, and depcruise are green. `pnpm lint` and
`pnpm markdownlint-check:root` still fail only on the staged WS3 lane.)

**Prior refresh**: 2026-04-25 (Codex / cursor / GPT-5.5 — session handoff
after moving
[`gate-recovery-cadence.plan.md`](../../../plans/observability/active/gate-recovery-cadence.plan.md)
into the repo and marking it as the blocking next step before startup-boundary
Phase 2 GREEN. Owner direction: full non-test gates must stay green during
TDD; current RED import/type/build fallout must be classified and repaired
before implementation claims resume.)

**Prior refresh**: 2026-04-25 (Jazzy / claude-code / claude-sonnet-4-6
— WS3 of
[`sentry-release-identifier-single-source-of-truth.plan.md`](../../../plans/observability/current/sentry-release-identifier-single-source-of-truth.plan.md)
**PAUSED**, owner-directed, to resume in next session. WS3 substance
(15-item amendment, script relocation, semver rewrite, 8-test rewrite)
is **fully drafted, reviewer-gated at §3.0, and applied to the working
tree** (8 files staged with `git mv` rename detection preserved + 1
unstaged `knip.config.ts` mjs-glob fix). HEAD unchanged at `015ac99b`;
no commit landed. Pre-commit `knip` blocked on a parallel-track
unresolved import (`apps/oak-curriculum-mcp-streamable-http/smoke-tests/modes/local-stub-env.unit.test.ts:3`
→ `./local-stub-env.js`, owned by the parallel
`mcp-local-startup-release-boundary.plan.md` Phase 2 GREEN agent).
**§3.0 reviewer gate caught two BLOCKING enumeration gaps**
(`assumptions-reviewer` Disposition #6 + `architecture-reviewer-fred`
Disposition #3 / positive-note #4 sub-clauses); enumeration expanded
**13 → 15 items**; MAJORs and MINORs absorbed before staging.
Resume instructions, exact pause-time `git status`, drafted commit
message, and post-commit hash-fill follow-up are recorded in
[`sentry-release-identifier-ws3-resume.evidence.md`](../../../plans/observability/active/sentry-release-identifier-ws3-resume.evidence.md).

**Prior refresh**: 2026-04-24 (Codex / cursor / GPT-5.5 — completed Phase 1
RED tests for
[`mcp-local-startup-release-boundary.plan.md`](../../../plans/observability/active/mcp-local-startup-release-boundary.plan.md)
after promoting it to active and completing Phase 0 inventory evidence. Phase 2
GREEN is next; no runtime code has changed yet.

**Prior refresh**: 2026-04-24 (Frodo / claude-code / claude-opus-4-7-1m
— fresh 1M-context session continuing Frodo identity per PDR-027
additive rule). **WS2 §2.1-§2.7 landed as a single atomic commit
`f5a009ab`** (29 files, +1341/-930): unified `resolveRelease` in
`@oaknational/build-metadata`, `@oaknational/sentry-node` thin
adapter via `SentryConfigEnvironment extends ReleaseInput`,
`ResolvedRelease` drops `gitSha` field, `preview_branch_sha` deleted,
preview derivation now uses `VERCEL_BRANCH_URL` host via `new URL()`
with IP-literal rejection, production semver validation via
`semver.valid()` + pre-release rejection, `isValidReleaseName`
matches Sentry docs denylist exactly, `slugifyBranch` deleted,
`RuntimeMetadataError` gains discriminated `kind`, all test
fixtures rewritten with no old-shape regression guards retained,
`esbuild.config.ts` snapshots env field-by-field per §2.7, lockfile
refreshed for new `semver` + `@types/semver` + `@oaknational/build-
metadata ← sentry-node` edges. All gates green: build, type-check,
lint, depcruise (1954 modules / 0 violations), full repo test
suite (36 tasks). **Voluntary-stop prediction from Frodo's prior
session confirmed held** — the fresh-session atomic landing worked
as predicted. **WS3 is next**: cancellation-script rewrite +
relocation into the consuming app workspace + ADR-163 §10 second
amendment, as a separate commit boundary per plan discipline.

**Prior refresh**: 2026-04-24 (Frodo / claude-code / claude-opus-4-7-1m
— earlier session in the same day). Landed two commits against the
release-identifier plan: `9a0f9ebc` (docs(plans) landing of Pippin's
plan-revision substance plus observability thread carry-forward) and
`a4e8facb` (WS2 §2.0 BLOCKING fix: `resolveGitSha` split from
`runtime-metadata.ts` into a new `git-sha.ts` module decoupled from
`@oaknational/env` + structural fitness test). WS2 §2.1-§2.7 deferred
to a fresh session at owner direction; this later session
(above) consumed that deferral. Session opened with
`/jc-start-right-thorough` wrapping `/jc-metacognition` and a long
directive payload; the metacognition artefact in Claude Code's
user-local plan storage was approved before execution and captured
the payload's behavioural-containment shape (derived from Pippin's
spiral-session experience file).

**Prior refresh**: 2026-04-24 (Pippin / cursor / claude-opus-4-7)
after a planning + reviewer-cycle session that did not land code.
The session opened on WS1 RED but pivoted into a structural
collapse decision (two resolvers → one, accepted by owner), then
Tier 1 review (Fred + Betty + Barney + assumptions-reviewer),
plan revision, Tier 2 review (Wilma + 2 docs-adr-reviewer
rounds), full plan revision addressing all findings, and a
3-layer pre-flight WS1 audit (string-pattern `rg`, import-site
`rg` including dynamic imports, `pnpm knip` + `pnpm depcruise`).
The plan body grew from ~700 → ~1700 lines of substantive,
review-driven, code-shaping revisions. Plan changes remain
**uncommitted** in the working tree (12 staged files, see
§Current state for the full set inherited from prior sessions
plus this session's revisions). Next session opens with the plan
in a substantially more robust state and proceeds directly to
WS2 GREEN execution; WS1 RED has been folded into WS2's TDD
discipline (see §Current state). Owner intervention mid-session
broke a review-cascade spiral and surfaced a meta-pattern
captured in [`napkin.md`](../../active/napkin.md) and
[`experience/2026-04-24-pippin-the-spiral-i-could-not-see.md`](../../../experience/2026-04-24-pippin-the-spiral-i-could-not-see.md).

**Prior refresh** (2026-04-24, same day): captured the small
intra-session test-relocation micro-lane that landed in
`6764457d`; before that, captured the cross-cutting meta-session
sweep at `ffec98b0` which folded this thread's previously-
uncommitted plan-body refinement into a larger commit alongside
practice/process restructuring, vendor-skills expansion, and
three new parallel plans.

**Repo-wide changes the next session must know about** (landed in
`ffec98b0`, may affect grounding reads at session start):

1. **Practice surface relocation** — `continuity-practice.md` moved
   from `docs/governance/` to
   [`.agent/directives/continuity-practice.md`](../../../directives/continuity-practice.md).
   Any directive-grounding read should hit the new location. The
   `docs/governance/` README and `.agent/directives/principles.md`
   were updated alongside.
2. **Napkin rotated** — the prior session's pattern-instance entry
   (WS3-as-verify framing surprise; second instance of
   `inherited-framing-without-first-principles-check`) is preserved
   in
   [`archive/napkin-2026-04-22b.md`](../../active/archive/napkin-2026-04-22b.md)
   and contributes to the permanent pattern file at
   [`patterns/inherited-framing-without-first-principles-check.md`](../../active/patterns/inherited-framing-without-first-principles-check.md).
   The PDR-015-amendment candidate (assumption-challenge gate per
   architectural-review output) remains in the pending-graduations
   register at
   [`repo-continuity.md § Deep consolidation status`](../repo-continuity.md#deep-consolidation-status)
   — trigger condition (i) is met, awaiting (ii) or (iii).
3. **Three new parallel plans** are active alongside this thread —
   none block release-identifier work, but the next session should
   know they exist so cross-plan coordination is deliberate:
   - [`agent-infrastructure-portability-remediation.plan.md`](../../../plans/agentic-engineering-enhancements/current/agent-infrastructure-portability-remediation.plan.md)
     — three-layer artefact-model audit + remediation. Touches
     `.agents/skills/`, `.claude/skills/`, ADR-125, vendor skill
     installations. **Coordination flag**: this plan's Phase 1
     canonicalisation pass already removed `.claude-plugin/plugin.json`
     shells across `.agents/skills/clerk-*/`. Future vendor-skill
     installs touched by observability work should read its current
     state before installing.
   - [`practice-and-process-structural-improvements.plan.md`](../../../plans/agentic-engineering-enhancements/current/practice-and-process-structural-improvements.plan.md)
     — fills structural gaps in the Practice (behavioural directive,
     planning skill, portability PDR/ADR). **Coordination flag**:
     when this plan lands `.agent/directives/collaboration.md`, the
     directive-grounding read at session start changes shape.
   - [`aggregated-tool-result-type-remediation.plan.md`](../../../plans/sdk-and-mcp-enhancements/aggregated-tool-result-type-remediation.plan.md)
     — composed-tool result-type pipeline. Eventually meets the MCP
     HTTP runtime work this thread covers; not blocking now.

Otherwise nothing about the release-identifier plan changed: WS0
remains landed at `06bf25d7`; WS1 RED (cross-resolver contract +
branch-URL precedence + cancellation wiring integration check) is
the next workstream; WS2 GREEN includes the resolver rewrite plus
the small `isValidReleaseName` denylist correction; WS3 is the
cancellation-script rewrite (~50 lines, canonical `semver` package,
branch gate added, asymmetric current/previous handling) + unit-test
rewrite + ADR-163 §10 re-amendment.

Owner-direction rules captured in the plan body's §Owner Direction
block (settled, not re-opened):

1. **Release identifier scheme**: production = root `package.json`
   semver at build time; preview = `VERCEL_BRANCH_URL` host (e.g.
   `poc-oak-open-curriculum-mcp-git-feat-otelsentryenhancements`).
   Build-time AND runtime resolvers must produce the SAME string per
   environment — single source of truth, no divergence.
2. **Production build cancellation**: builds on `main` cancelled
   unless the commit advances the root `package.json` semver beyond
   the previously-deployed version. Merge commits don't trigger
   production builds; only semantic-release commits do.

Discovery during the post-WS0 design discussion: the cancellation
script at
`packages/core/build-metadata/build-scripts/vercel-ignore-production-non-release-build.mjs`
(~205 lines, six unit-test branches) is over-built and missing the
branch-gate that ADR §1's truth table requires. The wiring (via
`apps/oak-curriculum-mcp-streamable-http/vercel.json`'s `ignoreCommand`)
is correct and stays unchanged. WS3 in the plan is now a **rewrite**
(~50 lines using the canonical `semver` npm package, branch gate
added, asymmetric current-vs-previous handling) + unit-test rewrite +
ADR-163 §10 re-amendment. Wiring integration check (originally WS3
work) folds into WS1.4 as planned.

The release-identifier work IS new code: WS1/WS2 rewrite
`resolvePreviewRelease` (build-time) and extend `resolveSentryRelease`
(runtime) to consume `VERCEL_BRANCH_URL` host; deletes the obsolete
`preview-<slug>-<sha>` shape and the `slugifyBranch` helper; lands a
cross-resolver contract test as the structural anti-drift gate.

The relevant plan surfaces are now:

- [`sentry-release-identifier-single-source-of-truth.plan.md`](../../../plans/observability/current/sentry-release-identifier-single-source-of-truth.plan.md)
  — **next-session pickup**; the release-identifier alignment plan.
- [`mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`](../../../plans/observability/archive/completed/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md)
  — archived closure record for the completed repo-owned corrective
  lane.
- [`sentry-observability-maximisation-mcp.plan.md`](../../../plans/observability/active/sentry-observability-maximisation-mcp.plan.md)
  — parent context; the L-8 lane that landed the diverging
  build-time resolver this plan corrects.
- [`mcp-http-runtime-canonicalisation.plan.md`](../../../plans/observability/future/mcp-http-runtime-canonicalisation.plan.md)
  — separate future home for broader runtime simplification once
  owner-run validation is complete.
- [`synthetic-monitoring.plan.owner-externalised-2026-04-23.md`](../../../plans/observability/archive/superseded/synthetic-monitoring.plan.owner-externalised-2026-04-23.md)
  — closed note confirming monitor creation/operation are owner-external.

Underlying branch evidence still in force:
L-8 Correction WI 1-5 remain landed in `fb047f86`; the dedicated
`dist/server.js` deploy boundary is the verified deploy shape; the
shared Step 4 foundation work and the former
`oak-search-sdk` / `sdk-codegen` / `search-cli` backlog are retired as
authoritative history after the green repo-root rerun and the later
strict corrective pass.

**Consumed at**: WS0 ADR-163 amendment lands (done — `06bf25d7`).
Subsequent header rewrites refresh as workstreams land.
**Lifecycle**: rewrite as the plan moves through workstreams; delete
when the plan completes (WS7 doc propagation done, both rules proven
via Sentry MCP `find_releases` + the cancellation rule's existing
unit-test evidence + a captured cancellation event or controlled
rehearsal).

---

## Thread identity

- **Thread**: `observability-sentry-otel`
- **Thread purpose**: product-grade Sentry / OTel observability for
  the MCP HTTP server on Vercel, including release attribution,
  deploy proof, and request-context diagnostics.
- **Branch**: `feat/otel_sentry_enhancements` (branch-primary)

## Participating agent identities

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| *`unattributed`* | *`unknown`* | *`unknown`* | *`unknown`* | `executor` | 2026-04-21 | 2026-04-21 |
| `Samwise` | `claude-code` | `claude-opus-4-7-1m` | *`unknown`* | `migration-maintenance` | 2026-04-21 | 2026-04-21 |
| `Merry` | `cursor` | `claude-opus-4-7` | *`unknown`* | `cleanup-only` | 2026-04-22 | 2026-04-22 |
| `Pippin` | `cursor` | `claude-opus-4-7` | *`unknown`* | `diagnosis-correction-implementation-doctrine-landing-plan-rewrite-release-identifier-plan-queueing-WS0-amendment-landing-post-WS0-WS3-cancellation-rewrite-design-into-plan-body-and-meta-session-sweep-commit-then-tier1-collapse-then-tier2-revisions-then-WS1-pre-flight-audit-no-code-landed` | 2026-04-22 | 2026-04-24 |
| `Codex` | `codex` | *`unknown`* | *`unknown`* | `repo-owned-repair-closeout-and-doc-consolidation` | 2026-04-23 | 2026-04-23 |
| `Codex` | `codex` | `GPT-5` | *`unknown`* | `startup-boundary-plan-author; startup-boundary-gate-green-committer; reviewer-finding-reintegration; pushed-handoff` | 2026-04-24 | 2026-04-25 |
| `Codex` | `cursor` | `GPT-5.5` | *`unknown`* | `session-handoff-closeout; startup-boundary-phase0-executor; startup-boundary-red-and-gate-recovery-planning; gate-recovery-executor; startup-boundary-phase2-partial-green` | 2026-04-24 | 2026-04-25 |
| `Frodo` | `claude-code` | `claude-opus-4-7-1m` | *`unknown`* | `commit-owner-pre-staged-plan-body-tightening-incidental-to-primary-session-work-on-plugin-capture-surface-wiring-and-sonarjs-plan; then-release-identifier-plan-revision-landing-and-WS2-§2.0-module-split-with-structural-fitness-test-and-§2.1-§2.7-deferred-to-fresh-session-by-owner-direction` | 2026-04-24 | 2026-04-24 |
| `Jazzy` | `claude-code` | `claude-sonnet-4-6` | *`unknown`* | `release-identifier-WS3-drafting-§3.0-reviewer-gate-amendment-application-paused-at-pre-commit-knip-gate-on-parallel-track-coupling-staged-not-committed` | 2026-04-25 | 2026-04-25 |
| `Jiggly Pebble` | `claude-code` | `claude-opus-4-7-1m` | *`unknown`* | `pr-87-comment-analysis; pr-87-quality-finding-resolution-plan-authored` | 2026-04-25 | 2026-04-25 |
| `Keen Dahl` | `claude-code` | `claude-opus-4-7-1m` | *`unknown`* | `pr-87-phase-0-walk-and-assumptions-reviewer-close` | 2026-04-25 | 2026-04-25 |

Identity discipline remains additive per
[PDR-027](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md):
new sessions add rows; they do not rewrite older attribution.

---

## Landing Target (per PDR-026)

**This session (2026-04-25 Codex / codex / GPT-5 — gate-green and commit
packaging)**: opener was owner direction to "fix the gates first, update the
plan, then start committing in sensible chunks." Outcome:

- **Full gate green**: `pnpm check` exits 0 on
  `feat/otel_sentry_enhancements` after the startup-boundary fixes and plan
  update. The broad check includes secrets scan, clean, root script tests,
  turbo build/type-check/lint/test/UI/a11y/smoke gates, shell lint,
  subagent/portability checks, knip, depcruise, markdownlint, and Prettier.
- **WS3 chunk committed**: `2822e525`
  (`fix(mcp): relocate production cancellation gate`) landed the production
  cancellation script relocation, semver rewrite, ADR-163 second amendment,
  dependency/knip follow-through, and WS3 resume evidence.
- **Lane B implementation committed**: `9ea3ccd8`
  (`fix(observability): decouple local startup from sentry release`) landed
  build-identity extraction, Sentry off-mode release removal, live
  `SENTRY_MODE=sentry` strictness, local gate `SENTRY_MODE=off` launch
  boundaries, app-version header/meta consumers, CLI off-mode test correction,
  and focused tests.
- **Architectural decision carried forward**: `RuntimeConfig.buildIdentity`
  remains intentionally deferred for the smallest gate-green slice. Build
  identity is still the canonical app build/release fact; Sentry release is a
  projection from build identity plus Sentry context.
- **Reviewer reintegration now active**: owner authorised sub-agent dispatch.
  Reviewers reported concrete blockers; this session is folding those findings
  into code/docs and rerunning gates. `RuntimeConfig.buildIdentity` remains an
  intentional future-canonicalisation deferral, not forgotten scope.
- **Reviewer reintegration landed and pushed**: `d9cb54e8`
  (`fix(observability): close startup-boundary reviewer findings`) packaged the
  reviewer fixes, Search CLI inclusion, docs/ADR updates, Sentry build-env
  helper, and MD040 rule sidecar. Owner pushed the branch; local
  `feat/otel_sentry_enhancements` is in sync with origin at `cc71507b`.
  Full `pnpm check` was not rerun after the final handoff-only docs.

**Prior session (2026-04-25 Codex / cursor / GPT-5.5 — gate recovery +
startup-boundary Phase 2 partial GREEN, paused for owner-requested context
compression)**: opener was owner direction to resume the observability thread on
`feat/otel_sentry_enhancements`, first priority
[`gate-recovery-cadence.plan.md`](../../../plans/observability/active/gate-recovery-cadence.plan.md),
with explicit boundaries not to touch the parallel WS3 lane. **Landed in the
working tree, not committed**:

- **Gate recovery completed**: current failures classified into startup-boundary
  lane vs staged WS3 residuals; missing-symbol REDs converted to typed
  production-owned seams; cadence guard added to the active plan.
- **Partial Phase 2 GREEN implemented**:
  - off-mode Sentry config no longer resolves or exposes release identity;
  - HTTP/search observability tolerate off-mode config without release;
  - Express Sentry error-handler registration requires explicit live
    `SENTRY_MODE=sentry`;
  - `resolveRelease` accepts validated build identity as Sentry projection input
    while deriving effective environment from Sentry context;
  - app-version headers and landing-page metadata consume `RuntimeConfig.version`;
  - local dev and local stub env paths strip inherited deploy release metadata.
- **Validation green**:
  - `pnpm --filter @oaknational/sentry-node test` (8 files / 105 tests);
  - `pnpm --filter @oaknational/build-metadata test` (4 files / 41 tests);
  - focused streamable-http command over 7 startup-boundary files (12 tests);
  - `pnpm type-check`;
  - `pnpm knip`;
  - `pnpm build`;
  - `pnpm depcruise` (1967 modules / 4253 dependencies / 0 violations).
- **Residual gates**: `pnpm lint` and `pnpm markdownlint-check:root` fail only
  on the staged WS3 lane. The startup-boundary lane does not own those files.

**What prevented closure**: owner explicitly requested this deep continuity
refresh plus `/jc-session-handoff`, then manual context compression before
continuing. This is a named owner-directed context-management pause, not a
technical blocker. Falsifiability: after compression, a continuing agent should
be able to read this record plus the two active plans, rerun the focused green
commands above, and resume from the unresolved Phase 2 decision rather than
rediscovering gate state.

**Next session re-attempts**: resume Lane B in
[`mcp-local-startup-release-boundary.plan.md`](../../../plans/observability/active/mcp-local-startup-release-boundary.plan.md)
Phase 2. First decide whether `RuntimeConfig` should carry a first-class
`AppBuildIdentity` value now; then rerun reviewers against the latest
reviewer-driven fixes; then run `smoke:dev:stub`, `test:ui`, and `test:a11y`.

**This session (2026-04-25 Jazzy — WS3 PAUSED at pre-commit
knip-gate)**: opener was the owner-authored payload inside
`/jc-start-right-thorough` directing pickup of the queued
release-identifier plan starting from "WS2 §2.0 PREREQUISITE
BLOCKING fix" → WS2 §2.1-§2.7 atomic landing. **Payload was
substantively stale** — `a4e8facb` had already landed §2.0 and
`f5a009ab` had already landed §2.1-§2.7. Owner confirmed via
AskUserQuestion that the actual intended lane was **WS3** (the next
commit boundary on the same plan, recorded in the payload as "a
separate commit boundary AFTER WS2 GREEN"). Deferral-honesty
discipline (per PDR-026):

- **What was attempted**: full WS3 sequence — draft §3.4 amendment,
  §3.0 reviewer gate dispatch, §3.1 relocate, §3.2 rewrite, §3.3
  unit-test rewrite, §3.4 amendment application, single atomic
  commit, quality gates.
- **What landed in the working tree (staged, NOT committed; HEAD
  still at `015ac99b`)**:
  - 8 staged files preserving `git mv` rename detection: script +
    unit-test moved from `packages/core/build-metadata/build-scripts/`
    into `apps/oak-curriculum-mcp-streamable-http/build-scripts/`;
    in-app shim replaced in-place; `.d.ts` companion deleted (was
    untracked under `**/*.d.ts`); `semver@^7.7.4` +
    `@types/semver@^7.7.1` added as app devDeps; lockfile refreshed;
    script body rewritten (~205 → ~127 lines after Prettier; ~50
    lines of decision logic) using canonical `semver` with
    `VERCEL_GIT_COMMIT_REF === 'main'` branch gate + asymmetric
    current/previous handling; 8-test rewrite covering all 5
    truth-table rows + 2 fetch-fallback variants (8/8 green at pause
    time); 15-item second amendment to ADR-163 §1 + §10 + Enforcement
    and Reviewer Dispositions (renamed first-amendment block + new
    second-amendment block); ADR index entry updated.
  - 1 unstaged WS3 dependency: `knip.config.ts` (added
    `'build-scripts/**/*.mjs'` to the streamable-http workspace's
    `entry` + `project` globs so knip detects the new devDeps as
    used). Must fold into the WS3 commit on resume.
- **What landed in the §3.0 reviewer gate**: `docs-adr-reviewer` +
  `assumptions-reviewer` dispatched on the drafted amendment.
  **Both reported two BLOCKING findings** in the original 13-item
  enumeration: `assumptions-reviewer` Disposition #6 (primary
  anti-drift gate claim) and `architecture-reviewer-fred`
  Disposition #3 (devDep edge for the contract test) +
  positive-note #4 sub-clauses (boundary discipline for the
  cross-resolver and wiring integration test placements). All
  reference surfaces being retracted by Items 10 (§1 process-gap
  paragraph) and 11 (top-level Enforcement §5). Enumeration
  expanded **13 → 15 items** to retract them with note. MAJORs
  (Item 1 line range narrowing to preserve the
  `**Cancellation truth table**:` label; Item 10 line range
  narrowing to preserve the trailing blockquote separator) and
  MINORs (Item 11 retract-with-note framing per assumptions-reviewer
  I1; Item 7 final bullet-order note; Item 9 grep-friendly commit-hash
  placeholder later filled with `2822e525`; Item 2 phrasing
  softened per assumptions-reviewer I3) all absorbed before the
  staged diff was finalised. Full disposition record is in the
  ADR's `## Reviewer Dispositions (2026-04-24 second amendment)`
  block (staged).
- **What prevented the WS3 commit**: pre-commit `knip` gate failed
  on a **parallel-track unresolved import** — owner-tracked
  parallel session's
  `apps/oak-curriculum-mcp-streamable-http/smoke-tests/modes/local-stub-env.unit.test.ts:3`
  imports `./local-stub-env.js` which the parallel agent has not yet
  landed. Per `.agent/rules/no-verify-requires-fresh-authorisation.md`,
  hook bypass requires per-commit owner authorisation (no
  carry-forward). Owner directed pause to next session. This is
  the second cross-session instance of the
  parallel-track-pre-commit-coupling pattern Frodo recorded
  2026-04-24 (parallel agent's `validate-portability.mjs`
  triggered the equivalent pre-commit `prettier --check` block).
  Behaviour change held: don't fix or bypass the parallel track,
  pause and surface to owner.
- **Falsifiability**: a future session opens, verifies HEAD at
  `015ac99b` (or advanced cleanly by parallel agent), confirms
  parallel agent has landed `local-stub-env.js`, runs `git add
  knip.config.ts` to fold the unstaged WS3 dependency, retries the
  drafted commit (validated against commitlint at pause time —
  zero errors, one cosmetic `footer-leading-blank` warning). If
  the commit lands cleanly, the pause discipline held; if it
  surfaces a fresh defect not caused by the parallel-track
  coupling, the pause was misjudged.
- **What next session re-attempts**: WS3 commit + post-commit
  hash-fill + WS5 quality gates. Resume instructions are recorded
  in
  [`sentry-release-identifier-ws3-resume.evidence.md`](../../../plans/observability/active/sentry-release-identifier-ws3-resume.evidence.md).

**Behavioural carry-forward** (informed by Pippin's spiral 2026-04-24
and Frodo's voluntary-stop discipline 2026-04-24): the §3.0 reviewer
gate did the job it exists to do — caught two BLOCKING enumeration
gaps before the amendment landed, exactly the failure mode the gate
was installed to prevent (incomplete first-amendment enumeration was
the precipitating drift this entire plan exists to repair). The
mid-cycle BLOCKING findings were absorbed into the amendment
substance (Items 14, 15a, 15b) — NOT into the plan body — preserving
the "do not re-plan the plan" discipline. The pause at the
pre-commit gate is the inverse move to Pippin's spiral applied at a
different scale: when an external blocker surfaces (parallel-track
coupling), name it, document the pause-state precisely, hand off.

---

**Prior session (2026-04-24 Frodo — release-identifier plan landing
and WS2 §2.0 BLOCKING fix, WS2 §2.1-§2.7 deferred)**: opener was the
owner-authored payload inside `/jc-start-right-thorough`: (1) commit
the plan-revision substance as a single `docs(plans)` landing; (2)
WS2 §2.0 split of `resolveGitSha` decoupled from
`ROOT_PACKAGE_VERSION` as a single commit; (3) WS2 §2.1-§2.7 unified
`resolveRelease` + sentry-node adapter + validator + caller-discipline.
**Landed 1 and 2; 3 deferred.** Deferral-honesty discipline (per
PDR-026):

- **What was attempted**: full payload sequence 1 → 2 → 3.
- **What landed**:
  - `9a0f9ebc` — `docs(plans): land release-identifier plan
    revisions + observability thread carry-forward`. 5 files,
    +1723/-627. Release-identifier substance only; practice-
    enhancement staged files (agentic-engineering-enhancements
    plan set, AGENT.md collaboration-reference, untracked
    collaboration directive + rule files) were left staged/
    untracked by explicit pathspec commit, not unstaged, per the
    "do not interfere with the parallel track's staging state"
    discipline the owner's mid-session note sharpened.
  - `a4e8facb` — `refactor(build-metadata): split resolveGitSha
    into git-sha.ts, decouple from @oaknational/env`. 6 files,
    +129/-111. WS2 §2.0 prerequisite: `resolveGitSha`,
    `GitShaSource`, `trimToUndefined`, `RuntimeMetadataError`,
    and `NO_DIAGNOSTICS` moved to
    `packages/core/build-metadata/src/git-sha.ts`;
    `runtime-metadata.ts` imports shared helpers back from
    `git-sha.ts`; `build-time-release.ts:15` re-points import;
    `index.ts` re-exports re-pointed. 3 `resolveGitSha` unit
    tests moved to new `tests/git-sha.unit.test.ts` alongside
    the new structural fitness test (asserts `git-sha.ts`
    source contains no reference to `@oaknational/env`).
    External app consumers (`oak-search-cli`,
    `oak-curriculum-mcp-streamable-http`) unchanged — they
    import via the package public API. 45 build-metadata tests
    pass; full pre-commit gates green (format, markdownlint,
    knip, depcruise clean at 1954 modules / 0 violations, 74
    turbo tasks).
- **What prevented WS2 §2.1-§2.7**: named priority trade-off —
  *single-atomic-commit discipline vs session context depth*.
  The plan explicitly mandates WS2 §2.1-§2.7 as one atomic
  commit (WS2 overall is one commit per the plan's stated
  discipline; §2.0 was split off by the payload as a separate
  commit because it is structurally independent). The remaining
  §2.1-§2.7 scope: type rename cascade (`BuildTimeRelease*` →
  `Release*` across types file, build-info.ts, index.ts,
  esbuild.config.ts, sentry-build-plugin.ts), shape change
  (`ResolvedRelease` drops the `gitSha` field), new
  `resolveRelease` implementation with `new URL()` preview
  parsing, sentry-node thin-adapter (dep add + types extends
  `ReleaseInput` + config-resolution delegation), atomic
  replacement (delete `slugifyBranch`, rewrite `preview-<slug>-<sha>`
  fixtures in `build-time-release.unit.test.ts` and
  `sentry-configured-build-gate.unit.test.ts`),
  `isValidReleaseName` rewrite per Sentry's documented denylist,
  caller-discipline snapshot at ~5 call sites. Scope estimate:
  3 packages × ~15 files with cascading type renames + test-
  fixture updates. Session at the decision point was ~60+
  turns deep with accumulated context from metacognition,
  reflective reading, and two substantive commits. Direct
  recommendation to owner: hand off to fresh session rather
  than push through under attention/context pressure; owner
  accepted (*"we will continue in a fresh session, run the
  session handoff process please"*).
- **Falsifiability**: a future agent opens a fresh session,
  reads the plan's WS2 §2.1-§2.7 sections, and lands the single
  atomic commit with all gates green. If that fresh session
  encounters material blockers not foreseen in the plan body
  (true unknown-unknowns, not cascading type-rename mechanics),
  the trade-off is refuted — a fresh session wasn't the missing
  ingredient. If they land cleanly in one commit, the trade-off
  held.
- **What next session re-attempts**: WS2 §2.1-§2.7 as a single
  atomic commit per the plan body, starting from branch HEAD
  `a4e8facb`. Plan authority is durable; `git-sha.ts` is
  stable; type shape changes now cascade from a known clean
  foundation. See §Next safe step for the step-by-step
  sequence.

**Behavioural note**: the session-opening metacognition artefact
(reviewed and approved before execution began) was the load-
bearing scaffold that held the payload's discipline. Reading
Pippin's `experience/2026-04-24-pippin-the-spiral-i-could-not-
see.md` as a felt-sense signal (not as intellectual history)
prevented the opening impulse to survey the plan or confirm
the WS1 supersession claim. The pause-and-handoff decision at
the WS2 §2.0/§2.1 boundary was an instance of the same
restraint applied at a different scale — recognising that
attempting a large atomic refactor under accumulating session
context is a variant of the Pippin spiral shape, and
volunteering the hand-off earned the clean commit boundary.
Captured in napkin + (possibly) an experience file at session
close.

---

**Prior session (planning + reviewer cycle, no code landed)**:
opener was *"WS1 RED contract tests, separate commit / turn
boundary"*. **Unlanded.** What was attempted, what prevented,
what next session re-attempts (per PDR-026 §Deferral-honesty
discipline):

- **What was attempted**: WS1 RED contract tests on the
  release-identifier plan.
- **What prevented**: a named owner trade-off, not a clock or
  budget excuse. The owner explicitly directed the sequence
  Tier 1 review → revise → Tier 2 review → fix all → audit
  before any code execution (selections recorded in transcript
  `4c46c2fc-2f86-493b-8049-30c9a318fd7e`:
  `tier1_then_review`, `revise_then_tier2`, `fix_all_then_go`).
  Mid-cycle the architectural-collapse decision (two resolvers
  → one core, sentry-node delegates) was accepted, which made
  the WS1 RED tests as originally specified obsolete (the
  cross-resolver contract test no longer makes sense once the
  resolvers structurally cannot diverge — `SentryConfigEnvironment
  extends ReleaseInput` makes shape divergence impossible by
  construction).   Tier 2 review then surfaced 1 BLOCKING
  (eager `readFileSync` at module init via `ROOT_PACKAGE_VERSION`
  → resolved via new WS2 §2.0 module-split prerequisite),
  plus 7 MAJOR/MINOR Wilma findings, plus 3 BLOCKING / 8 MAJOR /
  5 MINOR/NIT docs-adr-reviewer findings that materially reshaped
  WS1, WS2, WS3, WS3.4 (ADR-163 §10 second amendment), and the
  Documentation Propagation table. WS1 audit (3 layers,
  read-only) confirmed no architectural surprises blocking WS2.
- **Falsifiability**: the owner's explicit selections are
  preserved in the agent transcript; the plan diff
  (`git diff --cached .agent/plans/observability/current/sentry-release-identifier-single-source-of-truth.plan.md`,
  ~+994 lines) is the artefact of the cycle; the WS1 audit
  outputs are reproducible by re-running the three audit layers
  named in the plan body's WS1 section. A future agent can
  verify whether the trade-off held (deeper plan robustness for
  one session of zero-code) by checking whether WS2's first
  commit advances the plan to GREEN with materially fewer
  in-flight reviewer cycles than would have been needed without
  this session's work.
- **What next session re-attempts**: WS2 GREEN — the resolver
  collapse implementation. WS1 RED as originally specified is
  superseded; per the revised plan, RED tests are now folded
  into WS2 step-by-step under TDD discipline (see
  [§Next safe step](#next-safe-step) below).

**Prior session (meta-session sweep — preserved for audit)**: the
previously-uncommitted plan refinement landed inside the
cross-cutting meta-session sweep at commit `ffec98b0` (80 files,
+12732/-3970), per explicit owner direction "commit all files
including from other threads". That
sweep also landed practice/process restructuring (continuity-practice
directive relocation, principles update, napkin rotation, history
archive split), vendor-skills expansion (Clerk backend API,
custom-ui core-2/core-3, orgs references), three new parallel plans
(portability remediation, practice/process structural improvements,
aggregated-tool result-type remediation), and engineering-doc
updates (ADR-078, build-system, testing-patterns, typescript-gotchas).

Pre-commit gates passed in 104s; HEAD = `ffec98b0`; working tree
clean. The commit-choice complexity flagged in the prior handoff
("Option A standalone vs Option B fold into WS1 RED") is resolved by
this sweep — WS1 RED now lands as a clean separate commit with no
plan-authority debt to settle first.

**Prior session (post-WS0 plan-body refinement — preserved for
audit)**: refined the plan body to encode the agreed WS3
cancellation-script rewrite (~50 lines, canonical `semver` package,
branch gate, asymmetric current/previous handling) + folded the
validator denylist correction into WS2. Landing was deferred at
owner direction to a session-handoff; the deferred commit folded
into the meta-session sweep above.

**Prior session (WS0 amendment landing — preserved for audit)**: WS0
of
[`sentry-release-identifier-single-source-of-truth.plan.md`](../../../plans/observability/current/sentry-release-identifier-single-source-of-truth.plan.md)
in commit `06bf25d7`:

- ADR-163 §1 rewritten with the per-environment release-identifier
  truth table (production = root `package.json` semver;
  preview/non-main-production = `VERCEL_BRANCH_URL` host's leftmost
  label; development = `dev-<shortSha>`; `SENTRY_RELEASE_OVERRIDE`
  always wins; both build-time and runtime resolvers must produce the
  SAME string per environment).
- ADR-163 §10 added: production-build cancellation rule formalised,
  including its truth table, the canonical script path
  (`packages/core/build-metadata/build-scripts/vercel-ignore-production-non-release-build.mjs`),
  the workspace shim, the `vercel.json` `ignoreCommand` wiring, and
  the fail-open trade-off when previous-version resolution fails.
- §3 and §5 cross-linked to §1's per-environment grain so the "one
  release → many deploys" model now operates per-environment, not
  across the preview→production boundary.
- Process-gap finding: cross-resolver contract test named as the
  structural anti-drift gate (not procedural review discipline),
  with the new `libs ← core` devDependency edge documented.
- Four new Alternatives Considered entries (#11–#14) and two new
  Enforcement items (#5 cross-resolver contract; #6 cancellation
  wiring integration).
- Reviewer Dispositions block records the WS0.2 reviewer pass:
  `assumptions-reviewer`, `sentry-reviewer`,
  `architecture-reviewer-fred` — all BLOCKING + IMPORTANT findings
  ACCEPTED and applied (notably: qualifying `VERCEL_BRANCH_URL` as
  an Oak operational assumption rather than a Vercel guarantee;
  noting Oak's `SENTRY_RELEASE_NAME_PATTERN` diverges from Sentry's
  documented rules; reframing the impact as "split-release
  pollution" of Sentry release-health metrics).

Evidence:

- ADR amendment + plan file landed in `06bf25d7` (single commit, all
  pre-commit gates passed including dep-cruise + 74-task turbo cache);
- `feat/otel_sentry_enhancements` branch advanced;
- WS1 is the next workstream and lands as a separate commit per the
  user's turn-boundary instruction.

---

## Lane State

### Owning plan(s)

- **Focused local-startup follow-up**:
  [`mcp-local-startup-release-boundary.plan.md`](../../../plans/observability/active/mcp-local-startup-release-boundary.plan.md)
  — active record; all phases completed and packaged in `d9cb54e8`.
  [`phase-0-evidence`](../../../plans/observability/active/mcp-local-startup-release-boundary.phase-0-evidence.md)
  names the source-of-truth matrix, local gate preconditions, test
  classification, ADR-163 decision, and Phase 1 RED targets.
  [`phase-1-red-evidence`](../../../plans/observability/active/mcp-local-startup-release-boundary.phase-1-red-evidence.md)
  records the focused failing tests and reviewer clearance for GREEN.
- **Completed gate-recovery precondition**:
  [`gate-recovery-cadence.plan.md`](../../../plans/observability/active/gate-recovery-cadence.plan.md)
  — complete for the current branch state. It owns the failure ledger,
  non-test gate restoration, RED reshaping into buildable seams, and
  full-gate cadence guard.
- **Next-session pickup**:
  [`sentry-release-identifier-single-source-of-truth.plan.md`](../../../plans/observability/current/sentry-release-identifier-single-source-of-truth.plan.md)
  — release-identifier alignment + ADR-163 amendment + cancellation
  ADR linkage. Next Sentry-focused work is deployed-state / WS6 evidence,
  with full `pnpm check` only if aggregate repo health is to be claimed.
- **Next-session pickup (PR #87 unblock)**:
  [`pr-87-quality-finding-resolution.plan.md`](../../../plans/observability/current/pr-87-quality-finding-resolution.plan.md)
  — clear the three failing PR checks (CodeQL combined, SonarCloud
  Quality Gate, CI test) by phased remediation of CodeQL alerts +
  Sonar findings + Security Hotspots. Phase 0 surfaces three
  decisions for owner (rate-limit verification, stylistic-rule
  policy, semver extraction home) before Phase 1 mechanical work
  starts. Local commit `2484066b` (CI/Vercel fix, unpushed) is a
  precondition; push first to observe baseline state.
- **Repo-owned corrective lane closure record**:
  [`mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`](../../../plans/observability/archive/completed/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md)
- **Parent context**:
  [`sentry-observability-maximisation-mcp.plan.md`](../../../plans/observability/active/sentry-observability-maximisation-mcp.plan.md)
- **Separate future work**:
  [`mcp-http-runtime-canonicalisation.plan.md`](../../../plans/observability/future/mcp-http-runtime-canonicalisation.plan.md)
- **Closed repo monitoring lane**:
  [`synthetic-monitoring.plan.owner-externalised-2026-04-23.md`](../../../plans/observability/archive/superseded/synthetic-monitoring.plan.owner-externalised-2026-04-23.md)

### Current objective

Reviewer-finding reintegration is implemented, committed, and pushed. WS3 is
landed (`2822e525`), Lane B is landed (`9ea3ccd8`), and the reviewer package is
landed (`d9cb54e8`). No staged WS3 residue is expected.

**Two non-conflicting next-session paths**:

1. **PR #87 quality-gate clearance** (recommended next; blocks merge):
   execute
   [`pr-87-quality-finding-resolution.plan.md`](../../../plans/observability/current/pr-87-quality-finding-resolution.plan.md).
   Push `2484066b` first to observe baseline; then walk Phase 0
   (decisions) → Phase 1 (semver DRY) → Phase 2+ in order.
2. **Deployed-state validation** for the pushed branch (deferred until
   PR is mergeable): collect Sentry UI evidence (release + commits +
   deploy event for the preview build), run manual MCP HTTP smoke
   against the preview URL, run manual Search CLI smoke against the
   preview Elastic.

Either path preserves any unrelated WIP if it reappears.

### Current state

- **Latest Codex/codex closeout (2026-04-25)**: reviewer reintegration landed
  as `d9cb54e8` and was pushed by the owner. The branch is in sync with origin
  at `cc71507b`; the latest pushed commit is a user/local Codex-network config
  commit, while `d9cb54e8` is the observability payload. Package contents:
  `createSentryBuildEnvironment(processEnv)`, runtime
  `VERCEL_GIT_COMMIT_REF` schema inclusion, local no-auth env scrubbing, Search
  CLI ingest-harness test inclusion, docs/ADR refresh, Sentry build-env tests,
  and MD040 markdown-code-block sidecar. Gates run before final handoff edits:
  focused HTTP tests/UI/a11y/smoke, Search CLI tests, `pnpm type-check`,
  `pnpm lint`, `pnpm knip`, `pnpm test`, `pnpm build`,
  `pnpm markdownlint-check:root`, `pnpm portability:check`, and
  `git diff --check`. Commit hook also passed Prettier, markdownlint, knip,
  depcruise, and cached Turbo type-check/lint/test. Full `pnpm check` was not
  rerun after final doc-only handoff edits.
- **Latest session (2026-04-24, Frodo / claude-code / claude-opus-4-7-1m,
  WS2 §2.1-§2.7 atomic landing)**: single commit `f5a009ab` on
  `feat/otel_sentry_enhancements` (29 files, +1341/-930). Landed
  the architectural collapse: unified `resolveRelease` in
  `@oaknational/build-metadata` (new files `release.ts`,
  `release-types.ts`, `release-internals.ts`, `release-branch-url.ts`;
  deleted `build-time-release.ts`, `build-time-release-types.ts`,
  `build-time-release-internals.ts`); `@oaknational/sentry-node`
  `resolveSentryRelease` delegates via pure total error/result
  mappers; `SentryConfigEnvironment extends ReleaseInput`;
  `ResolvedRelease` drops `gitSha` field (composed separately into
  `BuildInfo` from `resolveGitSha` at the composition root);
  `ObservabilityConfigError` extended with
  `invalid_release_override`, `missing_branch_url_in_preview`,
  `missing_git_sha` kinds; `RuntimeMetadataError` becomes
  discriminated union with `kind`. Tests rewritten to new shape
  (no old-shape regression guards). Lockfile refreshed: `semver`
  `^7.7.4` + `@types/semver` `^7.7.1` added to build-metadata;
  `@oaknational/build-metadata` added as workspace dep of
  sentry-node. All gates green: build, type-check, lint,
  depcruise (1954 modules / 0 violations), `pnpm test` (36
  tasks — 997 + 651 + other workspace tests all pass). Parallel-
  track `.agent/` and `docs/engineering/testing-patterns.md`
  modifications left unstaged (owner/parallel-agent surface).
- **Latest Cursor/GPT-5.5 touch (2026-04-25)**: gate recovery and partial
  Phase 2 GREEN are applied in the working tree, uncommitted. The focused
  startup-boundary plan was promoted to active, Phase 0 and Phase 1 evidence
  were recorded, and
  [`gate-recovery-cadence.plan.md`](../../../plans/observability/active/gate-recovery-cadence.plan.md)
  was completed after owner correction that missing-symbol REDs are not
  acceptable TDD. The branch now has typed production-owned seams for app build
  identity, local-stub env preparation, app-version headers, and validated-env
  runtime config construction. Reviewer follow-up drove actual runtime wiring:
  `SENTRY_MODE=off` no longer resolves or exposes Sentry release identity;
  HTTP/search observability tolerate off mode without a release field; Sentry
  Express error-handler registration requires explicit live `SENTRY_MODE=sentry`;
  app-version response headers and landing-page meta tags consume
  `RuntimeConfig.version`; local dev and local stub env planning strip inherited
  deploy release metadata. The focused startup-boundary command now passes
  7 files / 12 tests, `@oaknational/sentry-node` passes 8 files / 105 tests,
  `@oaknational/build-metadata` passes 4 files / 41 tests, and `pnpm
  type-check`, `pnpm knip`, `pnpm build`, and `pnpm depcruise` pass.
  `pnpm lint` and `pnpm markdownlint-check:root` still fail only on the staged
  WS3 lane; they must not be fixed under Lane B unless owner redirects.
- **Prior session (2026-04-24, Frodo, earlier)**: two commits
  landed — `9a0f9ebc` (plan-revision landing as `docs(plans)`,
  5 files, +1723/-627) and `a4e8facb` (WS2 §2.0 split of
  `resolveGitSha` into new `packages/core/build-metadata/src/git-sha.ts`,
  6 files, +129/-111). Codex subsequently landed a parallel-track
  practice-remediation commit sequence (`b40bc994`, `d2acdefb`,
  `991c552c`, `f6fd524e`, `69fd4f8c`) on top of the observability
  commits. The practice-track commits do NOT modify observability
  substance — they add collaboration directive + rules,
  canonicalise portable skill adapters, land plan coordination,
  etc. Working tree retains the practice-enhancement parallel
  track's staged/unstaged state untouched — `.agent/directives/
  AGENT.md` (staged collaboration-reference), the
  `.agent/plans/agentic-engineering-enhancements/` staged set,
  untracked `collaboration.md` + `follow-collaboration-practice.*`
  files, plus a wide set of unstaged modifications under
  `.agents/skills/` and adjacent surfaces (parallel-track WIP).
  **Architectural state post-§2.0**: `resolveGitSha` no longer
  transitively imports `@oaknational/env`; structural fitness test
  is the durable regression guard. `runtime-metadata.ts` keeps
  `resolveApplicationVersion` + `getDisplayHostname` and imports
  `trimToUndefined` / `RuntimeMetadataError` / `NO_DIAGNOSTICS`
  back from `git-sha.ts` (edge runtime-metadata → git-sha is
  clean; the env-dep'd module imports from the non-env-dep'd
  module, no cycle). External app consumers (`oak-search-cli`,
  `oak-curriculum-mcp-streamable-http`) import
  `resolveGitSha` via the package public API and needed no
  changes. `@oaknational/sentry-node`'s internal `resolveGitSha`
  (in `config-resolution.ts:174`) remains unchanged — it is
  defensive validation of structured inputs (not a parallel
  implementation of the same resolver), per Pippin's audit
  note.
- **WS2 §2.1-§2.7 is LANDED** as `f5a009ab` (see above for
  highlights). **WS3 (cancellation-script rewrite + relocate +
  ADR-163 §10 second amendment) is the next commit boundary.**
  See §Next safe step for the concrete WS3 sequence.
- **Prior session (2026-04-24, Pippin, planning + reviewer cycle)**:
  no commits landed; the working tree carried 12 staged files
  including ~+994 lines of substantive plan revision to
  [`sentry-release-identifier-single-source-of-truth.plan.md`](../../../plans/observability/current/sentry-release-identifier-single-source-of-truth.plan.md).
  Architectural shape changed materially: **two resolvers
  collapsed to one** (`resolveRelease` in
  `@oaknational/build-metadata`; `@oaknational/sentry-node`
  becomes a thin adapter — `SentryConfigEnvironment extends
  ReleaseInput`). New types added to plan: `ReleaseInput`,
  `ReleaseSource`, `ReleaseEnvironment`, `ResolvedRelease`,
  `ReleaseError`. WS3.4 ADR-163 §10 second-amendment
  enumeration grew to 13 items (covers §1 retraction of the
  cross-resolver-contract-test framing, top-level Enforcement §5
  retraction, History entry preserve-and-add discipline, ADR
  index update per ADR-053 precedent, Disposition #4 retraction).
  New WS3.0 step adds a pre-landing reviewer dispatch on the
  amendment text. 1 BLOCKING (eager `readFileSync` at module
  init via `@oaknational/env`'s `ROOT_PACKAGE_VERSION`) resolved
  by new WS2 §2.0 prerequisite: split `resolveGitSha` into a
  module that does NOT import `ROOT_PACKAGE_VERSION` + add a
  structural fitness test. WS2 §2.7 added: caller-discipline
  rule (snapshot env at boundary, never mutate). WS5 quality
  gates updated to include `pnpm knip && pnpm depcruise`.
  Documentation Propagation table corrected (3 wrong paths
  fixed; 5 missing rows added; ADR index row added; CLI usage
  doc row added). `sentry-build-plugin.ts` path corrected
  (lives at `apps/oak-curriculum-mcp-streamable-http/build-scripts/`,
  not `packages/libs/sentry-node/src/`).
- **Pre-flight WS1 audit completed (this session, read-only,
  no commits)**: 3 layers — string-pattern `rg`, import-site `rg`
  (incl. `await import()` patterns), `pnpm knip` + `pnpm depcruise`.
  Knip + depcruise both clean (1952 modules, 4232 deps, 0
  violations). Audit "surprises" investigated and dissolved:
  `oak-search-cli` consumes `resolveGitSha` (already in WS3
  propagation scope by virtue of being in the import graph);
  `runtime-config-support.ts` files in both apps re-export
  `resolveGitSha` (handled by re-export rename mechanics);
  `@oaknational/sentry-node`'s `resolveGitSha` (config-resolution.ts:174)
  is **defensive validation of structured inputs**, not duplicate
  resolution — misleading naming, not architectural drift, the
  rename can be deferred to a future hygiene sweep without
  blocking WS2; `esbuild.config.ts` imports `ResolvedBuildTimeRelease`
  type which is handled by WS2's type-rename mechanics.
- **Intra-session micro-lane (prior 2026-04-24 session, `6764457d`)**:
  deleted
  `apps/oak-curriculum-mcp-streamable-http/e2e-tests/tool-examples-metadata.e2e.test.ts`
  and added
  `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch/flat-zod-schema.integration.test.ts`
  to relocate the only assertion in the deleted file not already
  covered at integration level (aggregated-`fetch` `id` examples).
  Triggered by a 60s timeout on `pnpm test:e2e` under pre-push
  concurrency; deeper analysis showed the test violated the
  testing-strategy directive on three counts (testing upstream
  libraries, duplicating existing proofs, asserting content at
  E2E level). E2E suite now 22 files / 155 tests (was 23 / 159);
  no functional code changed.
- WS0 landed: ADR-163 amendment + plan file in `06bf25d7`; continuity
  refresh in `7b4de7a4`.
- Plan body refined to encode the WS3 cancellation-script rewrite +
  WS2 validator denylist correction; **landed in the meta-session
  sweep at `ffec98b0`** alongside cross-cutting practice/portability/
  sdk-mcp work. Plan authority is now durable; next session opens
  the plan, reads the current WS3 + WS2.5 sections as authoritative,
  and proceeds straight to WS1 RED.
- Cancellation script at
  `packages/core/build-metadata/build-scripts/vercel-ignore-production-non-release-build.mjs`
  is over-built (~205 lines, hand-rolled semver parser/comparator,
  missing the `VERCEL_GIT_COMMIT_REF === 'main'` branch gate that ADR
  §1's truth table requires). WS3 in the plan is now a **rewrite**
  (~50 lines using the canonical `semver` npm package) + unit-test
  rewrite + ADR-163 §10 re-amendment to match the simpler shape.
  Wiring (via `apps/oak-curriculum-mcp-streamable-http/vercel.json`'s
  `ignoreCommand`) is correct and stays unchanged; the wiring
  integration check folds into WS1.4.
- `semver` is NOT yet a workspace dependency; WS3.1 adds it to
  `packages/core/build-metadata/package.json`.
- Build-time `resolvePreviewRelease` still emits
  `preview-<slug>-<sha>` (the divergent shape); runtime
  `resolveSentryRelease` still emits semver everywhere. WS1 RED
  tests pin the new contract, WS2 GREEN rewrites both resolvers to
  consume `VERCEL_BRANCH_URL` host's leftmost label, AND corrects
  `isValidReleaseName` to mirror Sentry's documented denylist (accept
  `latest`, reject `/`).
- `VERCEL_BRANCH_URL` is already in the env schema
  (`apps/oak-curriculum-mcp-streamable-http/src/env.ts`) and used in
  `runtime-config.ts` for hostname allowlisting; no schema change
  needed for the resolver work.
- The bounded repo-owned corrective lane remains complete and
  archived; `fb047f86` still supplies L-8 Correction WI 1-5; the
  `dist/server.js` deploy boundary is the verified deploy shape.
- No active repo-owned blocker beyond the plan's WS sequence.

### Blockers / low-confidence areas

- Deployed-state evidence has not been collected in this session. The pushed
  branch should have triggered Vercel; the next agent must verify the actual
  deployment before making Sentry release/readiness claims.
- Full `pnpm check` was green earlier after WS3/Lane B commits, but was not
  rerun after reviewer reintegration and final handoff-only doc edits. Do not
  claim aggregate repo health until it is rerun.
- The runtime shape is intentionally only partially canonical:
  `RuntimeConfig.version` feeds app-version consumers and Sentry projection
  inputs, but `RuntimeConfig` does not yet carry a first-class
  `AppBuildIdentity` value. That remains routed to
  `mcp-http-runtime-canonicalisation.plan.md`.
- Current uncommitted changes after this handoff are continuity-only. Preserve
  any unrelated WIP if it reappears; do not reset or restage broadly.

### Standing decisions

- This was **one bounded repo-owned follow-through lane**, not an
  ongoing stream of repo monitoring work.
- There is **no repo-owned monitor setup lane**. Repo scope stops at a
  clean handoff into owner-handled validation; monitor setup remains
  outside the repo.
- There are **no follow-up placeholders**. Future work either has a
  real home or is deleted.
- Canonicalisation remains valuable, but it is explicitly separate
  from the deploy-boundary repair.
- The local runner stack stays unless the verified deploy contract
  proves a smaller change is required.
- No child-process proof in tests. Production-only branches are covered
  by DI-friendly code tests plus a realistic production-build gate
  under representative env.
- A green repo-root rerun retires the old consumer backlog, but it does
  not replace a correctness review against the repository rules.
- No fallbacks, no wrappers, no JS-specific override paths, no
  compatibility layers.
- One fixed ESM-only export-surface contract across internal
  workspaces; no CJS support and no per-workspace improvisation.
- No further repo coding session is queued on this lane unless
  owner-run validation surfaces a fresh repo defect.

### Next safe step

Start the next Sentry-focused session from deployed-state validation:

1. Preserve unrelated/parallel changes if they reappear.
2. Confirm the pushed branch state (`origin/feat/otel_sentry_enhancements` at
   `cc71507b`, with observability payload `d9cb54e8`) and identify the Vercel
   deployment it triggered.
3. Collect WS6 evidence against that deployment: resolved release name,
   environment, deploy linkage, `git.commit.sha`, source maps / Debug IDs, and
   representative Sentry events. Record evidence in the release-identifier plan
   or a linked evidence file.
4. If aggregate repo health must be claimed, rerun full `pnpm check`; otherwise
   preserve the explicit caveat that it was not rerun after final handoff edits.
5. Keep first-class `RuntimeConfig.buildIdentity`, public
   `HttpObservability.release` removal/rename, and remaining smoke
   composition-root global mutation cleanup routed to
   [`mcp-http-runtime-canonicalisation.plan.md`](../../../plans/observability/future/mcp-http-runtime-canonicalisation.plan.md)
   unless owner explicitly broadens this slice.

If deployed-state validation surfaces a fresh repo defect, open the smallest
targeted repair lane that names that defect explicitly.

### Active track links

- None. `.agent/memory/operational/tracks/` contains only
  `.gitkeep` and `README.md`.

### Promotion watchlist

- PDR-015 candidate for an assumption-challenge gate on
  architectural-review outputs if the pattern recurs.
- ADR-163 amendment candidate widened this session: its gate-mapping
  table now also needs to cover the realistic production-build gate for
  env-gated Sentry esbuild-plugin paths once child-process proof is
  rejected by testing doctrine.
- Future promotion of
  [`mcp-http-runtime-canonicalisation.plan.md`](../../../plans/observability/future/mcp-http-runtime-canonicalisation.plan.md)
  only after owner-run validation is complete and there is real
  appetite for runtime simplification.

---

## Earlier Landed Substance Still In Force

- **Warnings are not deferrable**. Build warnings from vendor tooling
  are treated as blocking failures, not "verify later" notes.
- **The root cause of the failing preview is known**:
  `dist/index.js` was the deployed artefact, and its export shape did
  not honour Vercel's Express adapter contract.
- **Preview proof is gated on Step 4 honesty**. A green build or an app-
  local green test run is not sufficient while the repo still has
  hidden strictness/test-doctrine gaps.
- **L-8 is still the parent engineering lane** in
  [`sentry-observability-maximisation-mcp.plan.md`](../../../plans/observability/active/sentry-observability-maximisation-mcp.plan.md);
  the archived corrective-lane closure record now captures the repo
  work that previously sat between L-8 and owner-run validation.

The abandoned canonical-layout attempt still matters only as input to
the separate canonicalisation brief. It is no longer the binding shape
for this branch.

---

## Guardrails

Do **not**:

- pre-empt the contract with a guessed export shape;
- reopen broader canonicalisation work;
- recreate a repo monitoring lane;
- invent a new repo-owned repair cycle without a fresh defect from
  owner-run validation;
- treat monitor setup as in-repo acceptance work.
