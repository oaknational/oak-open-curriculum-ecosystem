# Next-Session Record — `observability-sentry-otel` thread

**Authored**: 2026-04-23 session close, after the L-8 Correction
WI 1-5 atomic landing (`fb047f86 chore: land L-8 Correction WI 1-5
and home AGENTS.md/CLAUDE.md drift to canonical surfaces`). The
landing covers the canonical `resolveBuildTimeRelease` resolver in
`@oaknational/build-metadata`, persistence to
`dist/build-info.json`, the typed `SentryBuildPluginIntent`
discriminated union (disabled / skipped / configured) replacing
the prior fail-fast `Result.error` shape, the
`esbuild.config.ts` four-arm switch, and removal of the
`validate-root-application-version.mjs` pre-flight from the MCP
HTTP build script (search-cli left on tsup with the pre-flight
intact per scope discipline). Same commit folded the
session-scoped continuity work: `AGENTS.md` + `CLAUDE.md` +
`GEMINI.md` all now contain ONLY a heading + a single-line
pointer to `.agent/directives/AGENT.md`; new
`.agent/commands/ephemeral-to-permanent-homing.md` shared
methodology partial; `session-handoff` step 6d added (entry-point
drift sweep); `consolidate-docs` step 3 retargeted at the homing
partial; `tsdoc-and-documentation-hygiene` rule renamed to
`documentation-hygiene` across canonical + Cursor + Claude
adapters with the body restructured into three sections
(misleading-doc detection, attribution on adoption, TSDoc
presence and quality); 7 incoming references rewired;
distilled-memory user-preferences extended (env-mirror,
scope-discipline, attribution); workspace-local docs added the
homed AGENTS.md facts (widget HTML production-runtime nuance in
the MCP HTTP README; deployment context in `observability.md`;
Sentry DSN public-identifier note in
`docs/operations/sentry-deployment-runbook.md`). Pre-commit
chain ran twice red (prettier + circular-dependency between
`build-time-release.ts` and `build-time-release-internals.ts`)
before landing; the cycle was broken by extracting shared types
to `build-time-release-types.ts`.

**Consumed at**: next session that picks up this thread.
**Lifecycle**: per
[PDR-026 §Lifecycle](../../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md):
delete on session close once the WS1 acceptance probe (work
items 6-7 below) lands on Vercel preview; rewrite if it fails
again.

---

## Thread identity

- **Thread**: `observability-sentry-otel`
- **Thread purpose**: Product — Sentry/OTel public-alpha
  integration; release-attribution lane for the HTTP MCP server;
  diagnostic-grade observability on Vercel runtime.
- **Branch**: `feat/otel_sentry_enhancements` (branch-primary).

## Participating agent identities

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| *`unattributed`* | *`unknown`* | *`unknown`* | *`unknown`* | `executor` | 2026-04-21 | 2026-04-21 |
| `Samwise` | `claude-code` | `claude-opus-4-7-1m` | *`unknown`* | `migration-maintenance` | 2026-04-21 | 2026-04-21 |
| `Merry` | `cursor` | `claude-opus-4-7` | *`unknown`* | `cleanup-only` | 2026-04-22 | 2026-04-22 |
| `Pippin` | `cursor` | `claude-opus-4-7` | *`unknown`* | `diagnosis-correction-and-implementation` | 2026-04-22 | 2026-04-23 |

**Identity discipline**: per the additive-identity rule
([PDR-027](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md)),
sessions joining this thread add an identity row; they do not
overwrite or rename existing rows. The Pippin row's `role` was
extended this session from `diagnosis-and-correction` to
`diagnosis-correction-and-implementation` to reflect the WI 1-5
implementation landing in `fb047f86` (additive within the same
identity row, not a new row — same agent_name + platform +
model). The thread-local attribution-gap decision recorded
2026-04-21 still applies to pre-2026-04-22 history; concrete
identity attribution discipline applies forward.

---

## Impact (metacognition lens)

The L-8 Correction WI 1-5 landing closed the *implementation*
surface for the canonical-resolver + persisted-build-info +
fail-policy split design. The *operational* surface remains
unproven: until a Vercel preview build proves the boundary read
works end-to-end and the Sentry UI surfaces the resulting
release + commits + deploy event, §L-8's contribution to "errors
attributed to release, tool context, and request state, with
runtime health visible" remains blocked by the same gate the
2026-04-22 probe failed at.

The bridge from action to impact is now exactly two short steps:

1. **§L-8 WS1 acceptance probe** (next-session target): push the
   landed branch to a Vercel preview, observe the build log for
   `[esbuild.config] Sentry plugin enabled: release=preview-<branch-slug>-<short-sha> env=preview`,
   confirm Sentry UI surfaces the expected Artifact Bundle +
   release + commits + deploy event. The `disabled` /
   `skipped` / `configured` three-branch dry build was verified
   locally before landing; the unknown is the live Vercel boundary.
2. **§L-8 WS5 production rollout** (after probe passes):
   production deploy on the next `semantic-release` version-bump
   commit; smoke-test the live MCP server through the Sentry UI.

After WS5, public-alpha Sentry integration's release-attribution
lane is complete and Phase 3a (L-1 + L-2 + L-3) becomes the next
forward lane.

## Landing target (per PDR-026)

### Outcome of the previous session (2026-04-23, Pippin) — PARTIAL

Per [PDR-026 §Deferral-honesty discipline](../../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md#deferral-honesty-discipline):

- **What landed (WI 1-5 of L-8 Correction, atomic in
  `fb047f86`)**:
    - **WI-1** Canonical `resolveBuildTimeRelease` in
      `@oaknational/build-metadata`. 44/44 tests green.
      Production = root `package.json` `version`; preview =
      `preview-<branch-slug>-<short-sha>`; development =
      short SHA. `SENTRY_RELEASE_OVERRIDE` always wins
      regardless of context. Internals split to
      `build-time-release-internals.ts` (max-lines budget);
      shared types extracted to `build-time-release-types.ts`
      (depcruise circular-dependency break, surfaced by the
      pre-commit gate not by code review).
    - **WI-2** `buildBuildInfo` + `serialiseBuildInfo` helpers
      added; `dist/build-info.json` persisted exactly once per
      build by the composition root.
    - **WI-3** `createSentryBuildPlugin` returns a typed
      `SentryBuildPluginIntent` discriminated union (`disabled`
      / `skipped` / `configured`); the previous fail-fast
      `Result.error` shape gone. Unit tests rewritten to cover
      both fail-policy halves.
    - **WI-4** `esbuild.config.ts` switches on
      `intent.value.kind`; `disabled` → log + omit + continue,
      `skipped` → log skip-reason + omit + continue (vendor-
      config-missing posture), `configured` → register plugin +
      write `dist/build-info.json` + continue.
      Three-branch dry build verified locally.
    - **WI-5** (corrected scope) `&& node ../../scripts/validate-root-application-version.mjs`
      removed from the MCP HTTP build script only;
      `oak-search-cli` still on tsup with the pre-flight call
      intact; the script itself preserved. Three deferred
      follow-ons captured in the active plan's L-8 Correction
      §Deferred follow-on subsection (search-cli → esbuild +
      canonical resolver; converge remaining deployable
      workspaces; delete the script when no consumer remains).
- **What did NOT land (WI 6-8)**:
    - **WI-6** Vercel preview acceptance probe — the branch
      was not pushed to remote this session. Named constraint:
      session was scoped to local landing + same-commit
      session-scoped continuity work; the owner-stated cadence
      *"pick up the pace, one commit"* covered both lanes in
      `fb047f86` but did not include the push step.
      Falsifiability: a future agent can verify the branch
      tip locally vs. remote with
      `git rev-parse HEAD` and `git ls-remote origin feat/otel_sentry_enhancements`;
      they should differ.
    - **WI-7** Sentry UI verification — gated on WI-6.
    - **WI-8** ADR-163 §6/§7 amendment recording the
      version-resolution boundary discipline contract — held
      back deliberately until WI 6-7 confirm the contract works
      operationally; amending an ADR before its mechanism is
      proven is an instance of the documentation-hygiene rule's
      "misleading-doc detection" failure mode (would record an
      outcome the system has not yet demonstrated).
- **Substance landed in lieu of the probe**: the L-8 Correction
  subsection in
  [`sentry-observability-maximisation-mcp.plan.md`](../../../../plans/observability/active/sentry-observability-maximisation-mcp.plan.md)
  carries a new "Local landing record (2026-04-23, commit
  `fb047f86`)" sub-block enumerating WI 1-5 deliverables and
  the gates run; the L-8 frontmatter `note` field updated to
  reflect partial completion.
- **What next session re-attempts**: WI 6-8 (push branch →
  Vercel preview probe → Sentry UI verification → ADR-163
  amendment).

### Target for the next session

> **Target**: §L-8 WS1 acceptance probe complete — Vercel preview
> build of `feat/otel_sentry_enhancements` (HEAD = `fb047f86` or
> later if rebased on `main`) produces the expected
> `[esbuild.config] Sentry plugin enabled: release=preview-<branch-slug>-<short-sha> env=preview`
> log line, AND the Sentry UI for `oak-open-curriculum-mcp` shows
> the resulting Artifact Bundle + release + commits + deploy
> event for that build. ADR-163 §6/§7 amendment lands in the
> same PR (work item 8) capturing the version-resolution
> boundary discipline.

Evidence to capture in the napkin or `repo-continuity.md` once
landed:

- Vercel preview deployment URL with the post-correction commit
  SHA.
- The exact build-log line(s) from `esbuild.config.ts` (skipped
  or enabled, with release name + env).
- Sentry UI screenshot or `sentry-cli releases info <version>`
  output showing the registered release with `commit`, `deploy`,
  and Artifact Bundle for the preview release name
  (`preview-<branch-slug>-<short-sha>`, per the corrected
  strategy).
- Confirmation that `dist/**/*.js.map` was deleted post-upload
  (per the plugin's `filesToDeleteAfterUpload`); deployed `.js`
  carries no `sourceMappingURL` comment (Sentry "hidden
  source-map" posture).
- The persisted `dist/build-info.json` contents from the
  Vercel build (downloadable from the build artefacts) showing
  the canonical resolver wrote the same release name the plugin
  used.
- A fork-preview run (or simulated preview without
  `SENTRY_AUTH_TOKEN`) producing
  `[esbuild.config] Sentry plugin skipped: SENTRY_AUTH_TOKEN not provided — release will not be registered with Sentry`
  AND a successful build artefact — proving the fail-policy
  split.

## Session shape

The next session is **shorter** than the previous two. The
implementation surface is closed; what remains is a push, an
observation, a UI verification, and an ADR amendment.

**Pre-flight**:

- Run `git status --short` — expect a clean tree (the trailing
  `.agent/memory/operational/diagnostics/commit-attempts.log`
  row from this session's session-handoff commit is the
  designed bounded self-referential drift; fold it into the
  WI-8 ADR-amendment commit).
- Confirm `SENTRY_AUTH_TOKEN` is set on the Vercel
  `poc-oak-open-curriculum-mcp` project for **all three**
  environments (production, preview, development) at
  <https://vercel.com/oak-national-academy/poc-oak-open-curriculum-mcp/settings/environment-variables>.
  The probe needs it on preview; production deploy needs it for
  WS5; setting it once across the three is cheaper than touching
  the project twice.

**Identity registration**: per
[`.agent/rules/register-identity-on-thread-join.md`](../../../rules/register-identity-on-thread-join.md),
add or update an identity row at session open BEFORE substantive
work. If you are `cursor` / `claude-opus-4-7` continuing as
Pippin, update the existing Pippin row's `last_session`; if you
are a different platform / model / agent_name, ADD a new
identity row (additive-identity rule per PDR-027).

**Commit workflow**: refined into the always-active `commit`
skill at
[`.agent/skills/commit/SKILL.md`](../../../skills/commit/SKILL.md).
WI 6-8 produce ~2-3 commits (push doesn't commit; Sentry UI
verification likely a single evidence-capture commit; ADR-163
amendment one commit). The skill covers live commitlint
constraints, pre-`git commit` validation via
`scripts/check-commit-message.sh`, the Cursor-Shell-tool
stream-truncation workaround, and post-commit logging via
`scripts/log-commit-attempt.sh` into the diagnostic substrate at
[`diagnostics/commit-attempts.log`](../diagnostics/commit-attempts.log).

1. **Ground first** per `start-right-quick`. Read in this order:
    - This file (in full — landing target above is the binding
      contract; the previous-session "what landed" enumeration
      shapes the starting state).
    - The L-8 Correction subsection at the end of
      [`sentry-observability-maximisation-mcp.plan.md`](../../../../plans/observability/active/sentry-observability-maximisation-mcp.plan.md),
      especially the Local landing record (2026-04-23, commit
      `fb047f86`) sub-block which enumerates what is already on
      disk.
    - The 2026-04-23 napkin top entries (graph-memory observation
      + L-8 Correction WI 1-5 landing entry + the same-session
      session-handoff continuation entry this handoff adds).
2. **Push the branch** (`feat/otel_sentry_enhancements`, HEAD
   `fb047f86` or later if rebased on `main`) to the remote.
   Vercel auto-builds the preview (work item 6 begins).
3. **Watch the build log** for one of:
    - `[esbuild.config] Sentry plugin enabled: release=preview-<branch-slug>-<short-sha> env=preview`
      → expected; continue. Note the release-name shape now
      reflects the corrected strategy (preview-derived, not root
      `package.json` version).
    - `[esbuild.config] Sentry plugin skipped: SENTRY_AUTH_TOKEN not provided — release will not be registered with Sentry`
      → expected on a fork preview without the secret; build
      still succeeds; this proves the fail-policy split. Owner
      can promote a non-fork preview to verify enabled-path
      coverage.
    - `[esbuild.config] Sentry build-plugin intent error: { kind: 'missing_app_version', … }`
      → REGRESSION; the canonical resolver did not run, or the
      branch-resolution rule did not fire. Inspect the resolver
      module + `esbuild.config.ts` switch; this would be a
      direct contradiction of the local three-branch dry-build
      evidence, so reproduce locally first to triangulate.
    - `[esbuild.config] Sentry build-plugin intent error: { kind: '<other>', … }`
      → identity-missing variant other than version. Read the
      `kind` discriminant on the printed `BuildTimeReleaseError`
      shape; the union spells out exactly what was missing.
4. **Verify Sentry UI state** (work item 7) for the resulting
   preview release name:
    - **Project Settings → Source Maps → Artifact Bundles** lists the
      bundle for the build commit's Debug IDs.
    - **Releases → `<preview-release-name>`** shows `commits`
      linked to
      `oaknational/oak-open-curriculum-ecosystem@<sha>` and a
      `deploys` entry with `environment: preview`.
5. **Amend ADR-163 §6 / §7** (work item 8) to record the
   version-resolution contract explicitly. The ADR currently
   states the *outcome* but not the *boundary discipline*; the
   omission is what allowed the original drift between the
   validation script and the resolver. Same-commit-or-same-PR
   rule from WS3.1 still applies.
6. **Capture evidence** in the napkin (new entry under
   `2026-04-2x — L-8 Correction landed, probe passed`); update
   `repo-continuity.md § Next safe step` with the WS5 rollout
   trigger ("merge to `main` once the next semantic-release
   commit is ready").
7. **Delete this file** (PDR-026 landed-case discipline) ONLY
   once the probe has passed AND the ADR amendment has landed;
   if the probe fails again, the landing is unlanded and this
   file rewrites for the next attempt.

### Sub-agent review cadence (binding for this session)

Three readonly review touchpoints, each with a named gate. Per
the cadence-during-long-work refinement on
[`AGENT.md § Use Sub-agents`](../../../directives/AGENT.md):
do not all-at-the-end batch these. Each touchpoint catches a
class of error the next touchpoint cannot recover from cheaply.

1. **Before pushing the branch (between Session-shape steps 2
   and 3)** — invoke
   [`architecture-reviewer-fred`](../../../../.claude/agents/architecture-reviewer-fred.md)
   readonly on the `fb047f86` diff plus the staged
   diagnostics-log row. Gate: the boundary-discipline contract
   (single canonical resolver, single boundary read of root
   `package.json`, fail-policy split via `SentryBuildPluginIntent`)
   is consistently applied across `@oaknational/build-metadata`,
   `createSentryBuildPlugin`, and `esbuild.config.ts`. Last
   cheap chance to catch a contract violation before it bakes
   into the deploy event in Sentry.
2. **After the build log shows enabled/skipped, before opening
   the Sentry UI (between Session-shape steps 3 and 4)** —
   invoke
   [`sentry-reviewer`](../../../../.claude/agents/sentry-reviewer.md)
   readonly on the Vercel build log plus the new
   `dist/build-info.json` artefact. Gate: the release name,
   commits ref, and environment values are exactly what Sentry
   will index. Catches mis-ingestion before it becomes a "why
   does the UI look wrong" debugging detour.
3. **Before authoring the ADR-163 amendment (between
   Session-shape steps 4 and 5)** — invoke
   [`architecture-reviewer-betty`](../../../../.claude/agents/architecture-reviewer-betty.md)
   readonly on the proposed amendment text. Gate: the
   boundary-discipline contract has cohesion (does it actually
   constrain future drift?) and bounded change-cost (will the
   next maintainer understand the constraint without re-deriving
   it?). ADRs are write-once-mostly artefacts; amendment quality
   matters more than landing speed. Pair with a
   [`code-reviewer`](../../../../.claude/agents/code-reviewer.md)
   readonly pass on the same draft text — ADR amendments are
   high-risk for boundary-discipline drift because they
   retroactively define what the implementation was supposed to
   be doing.

If any of the three reviewers raises a blocking concern,
**stop and address it before continuing the work-item walk** —
do not bank the review for "after the next commit". The whole
point of the cadence is that each review's evidence base is
fresh enough to act on cheaply.

## Standing decisions (owner-beats-plan invariant protects these)

- **Build tool for the MCP app**: raw esbuild via
  `apps/oak-curriculum-mcp-streamable-http/esbuild.config.ts`
  (composition root) + `build-scripts/esbuild-config.ts` (pure
  factory). NOT tsup. NOT a bespoke wrapper. NOT an `.mjs` shape.
- **Plugin**: `@sentry/esbuild-plugin`, first-party, ADOPTED.
- **`vercel.json` `buildCommand` override**: REMOVED. Vercel runs
  the workspace's default `build` script.
- **L-7 bespoke orchestrator** (5 TS files + `upload-sourcemaps.sh`
  + `tsup.config.ts` + `apps/oak-search-cli/.sentryclirc`):
  DELETED by `f9d5b0d2`. Do NOT recreate.
- **`@sentry/cli` direct devDep**: DELETED from BOTH the MCP app
  AND `apps/oak-search-cli/`. The CLI now arrives only as a
  transitive dep of `@sentry/esbuild-plugin`; root
  `pnpm.onlyBuiltDependencies` allows its native build script
  under pnpm v10.
- **`packages/libs/sentry-node`**: re-exports `resolveGitSha` for
  the MCP-app composition root (added by `f9d5b0d2`).
- **`@oaknational/build-metadata`**: NEW workspace package
  authored 2026-04-23 in `fb047f86`. Owns
  `resolveBuildTimeRelease` (canonical release-name resolver) +
  `BuildInfo` + `buildBuildInfo` + `serialiseBuildInfo`. The
  single source of truth for build identity. Internal layout:
  `build-time-release.ts` (public surface), `…-internals.ts`
  (helpers), `…-types.ts` (shared types extracted to break a
  cycle). Do NOT add a second boundary read of root
  `package.json` anywhere; route through this resolver.
- **`SentryBuildPluginIntent` shape**: discriminated union
  (`disabled` / `skipped` / `configured`). The previous
  fail-fast `Result.error` shape is gone; do NOT re-introduce
  it. The `esbuild.config.ts` switch on `intent.value.kind` is
  the structural enforcement of the fail-policy split.
- **ADR-163 §6 / §7**: amended 2026-04-21 from prescriptive CLI
  commands (HOW) to outcome statements (WHAT). The plugin is the
  mechanism; the §6.0–§6.6 outcomes are unchanged. The 2026-04-23
  WI-8 amendment will add the version-resolution boundary-
  discipline contract on top, NOT revert the HOW→WHAT shift.
- **Platform-specific entry points** (`AGENTS.md`, `CLAUDE.md`,
  `GEMINI.md`): pure pointers to `.agent/directives/AGENT.md`.
  Anything else is drift and gets caught by `session-handoff`
  step 6d. Per the homing partial: *all content must be moved
  to permanent homes or, if not useful, removed* — silent
  deletion without homing is not the default.

## Non-goals (do not re-open)

- Do NOT recreate the L-7 orchestrator, even if the probe
  surfaces a plugin behaviour gap. The vendor plugin is the
  canonical mechanism; gaps are vendor-issue work, not Oak-
  built workarounds.
- Do NOT add any `vercel.json` `buildCommand` override. Vercel's
  default `build` script invocation is load-bearing.
- Do NOT edit the unit tests authored in `f9d5b0d2` or
  `fb047f86` to assert vendor behaviour. Vendor proof lives in
  the Sentry UI screenshot from the probe, not in-process.
- Do NOT migrate `oak-search-cli` to esbuild on this lane. The
  L-8 Correction's owner-confirmed scope is MCP HTTP only;
  search-cli migration is a deferred follow-on with its own
  lane.
- Do NOT re-open the tsup-vs-esbuild decision.
- Do NOT add a second boundary read of root `package.json` in
  the build pipeline. Route everything through
  `resolveBuildTimeRelease`.

## What's after this landing

- **§L-8 WS5 production rollout**: triggered automatically by
  the next `semantic-release` version-bump commit on `main`
  after the feature branch merges. The Vercel `ignoreCommand`
  ensures only version-bump commits run the production Build
  Command.
- **Phase 3a in parallel** (L-1, L-2, L-3): schema-independent;
  three small lanes that close public-alpha Sentry integration.
- **L-15 strategy close-out + L-EH final**: author
  `prefer-result-pattern` ESLint rule + first-tranche adoption.

## Pattern reminders

- `inherited-framing-without-first-principles-check` — 7
  cross-session instances captured to date (4th–6th in the
  2026-04-21 napkin window; 7th in the 2026-04-22 Pippin entry
  on the version-resolution drift; 8th potential instance
  *avoided* this session by the WI-3 + WI-4 implementation
  taking the discriminated-union route rather than accepting
  the "Result.error treated as fatal everywhere" inherited
  shape). The four-clause check (test-shape, file-naming-vs-
  landing-path, vendor-API-literals, single-source-of-truth-
  boundary-discipline) is the documented countermeasure. Re-run
  all four clauses before authoring anything prescribed by the
  ADR-163 amendment in WI-8.
- `passive-guidance-loses-to-artefact-gravity` — 2
  cross-session instances captured to date. The same-commit
  birth of `session-handoff` step 6d + the
  `ephemeral-to-permanent-homing` partial is an explicit
  artefact-side countermeasure: the entry-point sweep is now
  ritual, not advice. Falsifiability: if the next session
  re-introduces drift in `AGENTS.md` / `CLAUDE.md` / `GEMINI.md`
  while documented anticipation already exists, that is the 3rd
  instance and triggers a third tripwire layer review.
- **First-session warning for the next agent**: WI-8 (ADR-163
  amendment) is the next opportunity to re-instance
  `passive-guidance-loses-to-artefact-gravity`. Writing the
  amendment as descriptive prose ("the resolver should…") is
  passive guidance that future agents will read, recite, and
  not honour. Writing it as named binding constraints with
  named falsifiability checks is the artefact-gravity
  countermeasure. Use the documentation-hygiene rule's
  "misleading-doc detection" framing as a reviewer prompt
  during ADR drafting.

## Lane state (carried from prior thread record)

**Owning plans**:

- [`sentry-observability-maximisation-mcp.plan.md`](../../../../plans/observability/active/sentry-observability-maximisation-mcp.plan.md)
  — lane-level execution authority (ACTIVE).
- [`high-level-observability-plan.md`](../../../../plans/observability/high-level-observability-plan.md)
  — five-axis MVP framing + wave sequencing.
- [`sentry-otel-integration.execution.plan.md`](../../../../plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md)
  — foundation parent plan; credential/evidence authority.

**Test totals at handoff** (filter-runs across touched
workspaces this session): build-metadata 44/44,
oak-curriculum-mcp-streamable-http 646/646 unit + 3-branch dry
build, sentry-node 101/101, observability 58/58, oak-search-sdk
unchanged, oak-search-cli build sanity green. Pre-commit gates
green at `fb047f86`.

**Post-§L-8 forward path** (from the 2026-04-20 re-sequencing,
unchanged): after §L-8 closes, Phase 3a (L-1 free-signal + L-2
delegates extraction + L-3 MCP request context) — all
schema-independent — can land in parallel before the
events-workspace. That closes the alpha gate. Events-workspace
+ L-4b metrics + Phase 4 siblings (security / accessibility) +
Phase 5 close-out lanes form the public-beta gate. See
`§Alpha vs public-beta gates` in the active plan for the
authoritative split.

**Active tracks**: none at handoff.

**Promotion watchlist** (carried from prior record):

- **`sunk-cost-framing-in-parked-rationale`** — the L-8
  `dropped` rationale (2026-04-17) was itself a sunk-cost
  framing: "shell-script is simpler" was protecting the chosen
  shape, not measuring cost. Second instance; watch for a third.
- **`feature-workstream-template-guardrails-self-test`** — the
  L-8 section is the first self-test of the Build-vs-Buy
  Attestation + Reviewer Scheduling guardrails inside a live
  active plan body. Clean execution validates the template; any
  friction demands template amendment.
- **NEW 2026-04-23**: `entry-point-drift-as-cross-platform-blindspot`
  — `AGENTS.md` carrying load-bearing facts that `CLAUDE.md` did
  not, and vice versa, was the proximate cause of the
  session-handoff entry-point-sweep step birth. The pattern is
  a structural one (every platform reads only its own entry
  point first); the `session-handoff` step 6d + the homing
  partial are the installed countermeasure. Watch for second
  instance to confirm the countermeasure works (no second
  drift recurrence) or demands amendment (drift recurs despite
  the sweep).

## Session-close discipline reminder (PDR-026)

Close by either:

- **Landed** (probe passed, Sentry UI verified, ADR-163
  amendment landed): record the preview-deployment URL +
  Sentry UI evidence link; delete this file; rewrite a fresh
  opener for §L-8 WS5 + Phase 3a.
- **Unlanded** (probe failed, env var missing, plugin gap,
  etc.): record attempted / prevented / next-session-re-attempts
  in `repo-continuity.md § Next safe step`; rewrite the Target
  block above for the next session with the specific failure
  mode named.
