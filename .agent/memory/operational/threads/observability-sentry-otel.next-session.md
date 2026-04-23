# Next-Session Record — `observability-sentry-otel` thread

**Authored**: 2026-04-23 session close (Pippin / cursor /
`claude-opus-4-7`) after the WI-7 lambda boot crash diagnosis +
warnings-doctrine landing + `mcp-canonical-deploy-shape-and-
warnings-doctrine.plan.md` authoring. WI-6 (Vercel preview probe
for L-8 Correction) was attempted: the branch was pushed; the
preview build went green with the `enabled`-arm Sentry plugin
output; the runtime lambda crashed with `FUNCTION_INVOCATION_FAILED`
on every request. Root cause established (full Vercel runtime
log exfiltrated by the owner; the table-mode `get_runtime_logs`
MCP tool truncates the `Body` column behind `SpanId`): the
`oak-curriculum-mcp-streamable-http` entry point
(`apps/.../src/index.ts`) does not honour Vercel's documented
Express adapter contract. Two esbuild build-time warnings
(`Import "default" will always be undefined …
[import-is-undefined]`) named the contract violation at build
time and were acknowledged-and-deferred to WI-7 — the named
pattern `acknowledged-warnings-deferred-to-the-stage-they-explode-in`
recorded its first hard cross-session instance. Architecture-
reviewer convergence (`fred` + `betty`) ran in parallel and
agreed on every material finding (canonical Vercel layout
`server.ts` / `main.ts` / `sentry-init.ts`; delete `bootstrap-
app.ts` + `server-runtime.ts` + the combined `index.ts`; build
self-assertion via esbuild metafile + warnings-as-errors;
unblock the existing Sentry Uptime Monitoring lane which scopes
synthetic monitoring under its predates-Sentry-taxonomy file
name `synthetic-monitoring.plan.md`).

**This commit lands**:

- `.agent/rules/no-warning-toleration.md` (full operational
  doctrine; `alwaysApply: true` via `.cursor/rules/...mdc`).
- `.agent/directives/principles.md` §Code Quality — new bullet
  "No warning toleration, anywhere" with rule cross-reference.
- `.agent/plans/observability/current/mcp-canonical-deploy-
  shape-and-warnings-doctrine.plan.md` (nine phases + phase-
  aligned reviewer cadence at three anchors per phase + build-
  vs-buy attestation tables).
- Napkin entry §"2026-04-23 — warnings-are-not-deferrable
  codified + first hard instance" with the resolution turn
  appended (doctrine landing + plan authoring + Sentry Uptime
  Monitoring research result + scope-overlap discovery vs the
  existing `synthetic-monitoring.plan.md`).
- This thread record refresh.

**Consumed at**: next session that picks up this thread.
**Lifecycle**: per
[PDR-026 §Lifecycle](../../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md):
delete on session close once the canonical-deploy-shape plan's
Phase 1+ phases close (Phase 0 doctrine is already closed by
this commit); rewrite if a phase fails.

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
| `Pippin` | `cursor` | `claude-opus-4-7` | *`unknown`* | `diagnosis-correction-implementation-and-doctrine-landing` | 2026-04-22 | 2026-04-23 |

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

### Outcome of the most recent session (2026-04-23 close — WI-7 lambda crash diagnosis + warnings-doctrine landing + new execution plan) — PARTIAL

Per [PDR-026 §Deferral-honesty discipline](../../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md#deferral-honesty-discipline):

- **What landed this session**:
  - **Warnings doctrine elevated to repo level**:
    `.agent/rules/no-warning-toleration.md` (full operational
    rule: build / lint / type-check / test / dependency
    graph / runtime / monitoring), `.cursor/rules/no-warning-
    toleration.mdc` (`alwaysApply: true`),
    `.agent/directives/principles.md` §Code Quality bullet
    "No warning toleration, anywhere" with rule reference.
  - **Architecture-reviewer convergence captured**:
    `architecture-reviewer-fred` (boundary discipline) and
    `architecture-reviewer-betty` (long-term cohesion) ran in
    parallel on the WI-7 lambda crash; converged on every
    material finding. Recorded in the napkin §"Architecture-
    reviewer convergence" subsection.
  - **Execution plan authored**:
    `.agent/plans/observability/current/mcp-canonical-deploy-
    shape-and-warnings-doctrine.plan.md` — nine phases (Phase
    0 doctrine landing closed by this commit; Phase 1 build
    self-assertion through Phase 9 consolidation pending).
    Phase-aligned reviewer cadence at three anchors per phase
    (during planning, after each significant change, before
    session close). Build-vs-buy attestation tables for both
    the build-artefact gate (esbuild metafile assertion) and
    the Sentry Uptime Monitoring lane unblock.
  - **Sentry Uptime Monitoring research recorded**: docs at
    <https://docs.sentry.io/product/monitors-and-alerts/monitors/uptime-monitoring/>;
    basic 2xx-status probes are GA, response-body Verification
    is Early Adopter; Sentry Cron Monitors are the candidate
    for the working-probe layer. Owner correction recorded
    verbatim: *"synthetics is the wrong term in the Sentry
    world, we want uptime monitoring"*. The existing
    `synthetic-monitoring.plan.md` keeps its file name in this
    commit (rename deferred to a separate documentation pass).
  - **Pattern instance #1 recorded** for `acknowledged-
    warnings-deferred-to-the-stage-they-explode-in` — the
    WI-7 build warnings to runtime crash chain. Falsifiability
    check named for instance #2.
  - **Napkin lint baseline cleaned** as the doctrine's first
    enforcement (5 markdownlint warnings cleared, including
    4 pre-existing).
- **What did NOT land (now reframed as the new plan's phases)**:
  - **L-8 WI-7 (Sentry UI verification)** and **WI-8 (ADR-163
    §6/§7 amendment)** are absorbed into the new plan as
    Phase 6 (Vercel preview probe rerun once the canonical
    layout lands) and Phase 7 (ADR amendment folding three
    lessons together — version-resolution boundary,
    vendor-config passthrough, entry-point boundary, plus
    warnings doctrine).
  - **Canonical Vercel Express layout** (`server.ts`,
    `main.ts`, `sentry-init.ts`) NOT yet built; the home-spun
    runtime layer (`bootstrap-app.ts`, `server-runtime.ts`,
    the combined `index.ts`) NOT yet deleted. That is Phase 2
    of the new plan (≈−272 LoC removed, ≈+60 LoC added across
    the three new files).
  - **Build self-assertion** (esbuild metafile and warnings-
    as-errors) NOT yet wired into `esbuild.config.ts`. Phase
    1 of the new plan.
- **Named constraint preventing landing of Phases 1-9 in this
  session**: time and scope. The owner's instruction was *to
  write a new plan to address ALL of the reviewer findings,
  take this straight to repo doctrine/principle/rule level,
  and report back on Sentry's support for the synthetic-probe
  use case*. The session honoured that scope precisely;
  executing the plan's nine phases inside the same session
  would have inverted the planning/execution boundary the
  cadence-discipline rule and the assumptions-reviewer protect
  against. Falsifiability: a future agent can verify by
  checking that the new plan's Phase 0 frontmatter todo is
  `in_progress` and Phases 1-9 are `pending`, with a matching
  `pnpm check` baseline against `feat/otel_sentry_enhancements`
  HEAD.

### Earlier landed substance still in force (2026-04-21 / 22 / 23)

Carried unchanged from prior thread record refreshes; these are
the standing baseline the new plan builds on top of:

- **L-8 Correction WI 1-5** atomically landed in commit
  `fb047f86`: canonical `resolveBuildTimeRelease` in new
  `@oaknational/build-metadata` workspace; `dist/build-info.json`
  persistence; `SentryBuildPluginIntent` discriminated union
  (`disabled` / `skipped` / `configured`); `esbuild.config.ts`
  four-arm switch; validate-script removal from MCP HTTP build
  only (search-cli kept on tsup with the script intact per
  scope discipline).
- **Vendor-config passthrough fix** (small earlier edit this
  session window): `turbo.json` `globalPassThroughEnv` now
  carries `SENTRY_AUTH_TOKEN` / `SENTRY_DSN` / `SENTRY_MODE` /
  `SENTRY_TRACES_SAMPLE_RATE`. Without this the Sentry plugin
  stayed in `skipped` arm on Vercel preview.
- **Prettier ignore extension** (small earlier edit): `.prettierignore`
  now ignores `**/.widget-build/` (gitignored build artefact
  the pre-commit hook was scanning).
- **Entry-point sweep ritual** (`session-handoff` step 6d +
  `ephemeral-to-permanent-homing` shared partial) and
  `documentation-hygiene` rule rename — landed in `fb047f86`
  alongside the WI 1-5 atomic commit.

#### Original §Outcome subsection retained for evidence parity (collapse later)

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
  - **WI-2** `buildBuildInfo` and `serialiseBuildInfo`
    helpers added; `dist/build-info.json` persisted exactly
    once per build by the composition root.
  - **WI-3** `createSentryBuildPlugin` returns a typed
    `SentryBuildPluginIntent` discriminated union (`disabled`
    / `skipped` / `configured`); the previous fail-fast
    `Result.error` shape gone. Unit tests rewritten to cover
    both fail-policy halves.
  - **WI-4** `esbuild.config.ts` switches on
    `intent.value.kind`; `disabled` → log, omit, continue;
    `skipped` → log skip-reason, omit, continue (vendor-
    config-missing posture); `configured` → register plugin,
    write `dist/build-info.json`, continue. Three-branch dry
    build verified locally.
  - **WI-5** (corrected scope) `&& node ../../scripts/validate-root-application-version.mjs`
    removed from the MCP HTTP build script only;
    `oak-search-cli` still on tsup with the pre-flight call
    intact; the script itself preserved. Three deferred
    follow-ons captured in the active plan's L-8 Correction
    §Deferred follow-on subsection (search-cli → esbuild
    plus canonical resolver; converge remaining deployable
    workspaces; delete the script when no consumer remains).
- **What did NOT land (WI 6-8)**:
  - **WI-6** Vercel preview acceptance probe — the branch
    was not pushed to remote this session. Named constraint:
    session was scoped to local landing plus same-commit
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

> **Target**: Phase 1 of
> [`mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`](../../../plans/observability/current/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md)
> lands — `apps/oak-curriculum-mcp-streamable-http/esbuild.config.ts`
> writes the esbuild metafile, gates on
> `result.warnings.length === 0` (per the just-landed `no-
> warning-toleration` rule), AND asserts that the deployed
> entry point bundle exports `default` (Vercel Express adapter
> contract). Both new gates fail the build today (the warnings
> the doctrine names + the missing `default` export are
> measurable on `feat/otel_sentry_enhancements` HEAD), so Phase
> 1 is correctly RED on entry. Phase 2 (canonical layout
> refactor) is a stretch goal for the same session if Phase 1
> closes early — but Phase 1 is the binding landing target.

The plan's nine phases close (in order) the WI-7 lambda crash,
the WI-8 ADR amendment, the Sentry Uptime Monitoring lane
unblock, and the release-readiness review. Read its §Next
Session Entry Point subsection FIRST.

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

The next session opens against the new execution plan
[`mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`](../../../plans/observability/current/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md).
Its §Next Session Entry Point subsection enumerates the read
order, the resume action (Phase 1 build self-assertion), and
the three-anchor reviewer cadence (during planning / after
each significant change / before session close) per phase.

The §Session shape walk below is **retained for historical
context** — it describes what Pippin's previous session
expected to do (push → observe → verify → amend ADR). That
walk was overtaken by the WI-7 lambda crash diagnosis: the
push happened; the build went green; the runtime crashed; the
reviewer convergence + new plan + warnings doctrine landed in
its place. Treat the walk below as evidence of the inherited
framing, not as instructions for the next session.

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
    - The 2026-04-23 napkin top entries (graph-memory observation,
      L-8 Correction WI 1-5 landing entry, and the same-session
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

### Sub-agent review cadence (superseded by the new plan's per-phase table)

> **Superseded 2026-04-23 close**: this three-touchpoint cadence
> was authored for the WI-6 / 7 / 8 walk that the WI-7 lambda
> crash diagnosis overtook. The new plan's
> [§Reviewer Scheduling (phase-aligned, three anchors)](../../../plans/observability/current/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md#reviewer-scheduling-phase-aligned-three-anchors)
> table is the binding cadence for the next session — three
> anchors per phase (during planning, after each significant
> change, before session close), with the relevant specialist
> named at each anchor for each phase. Read that table FIRST.

The original three touchpoints are retained below as historical
context; they remain valid templates for any follow-up
work-item inside Phase 6 of the new plan (the rerun of WI-6 +
WI-7 once the canonical layout lands).

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

**New 2026-04-23 close (warnings + canonical Vercel layout)**:

- **Warnings are not deferrable, anywhere**: rule
  [`.agent/rules/no-warning-toleration.md`](../../../rules/no-warning-toleration.md)
  binds every system the repo influences (build / lint /
  type-check / test / dependency graph / runtime / monitoring).
  Cross-referenced from `principles.md §Code Quality`. Each
  build / quality-gate / monitoring config that emits warnings
  must escalate them to errors in the same commit, OR fix the
  root cause in the same commit. No "we'll fix it later".
- **Canonical Vercel Express layout for HTTP MCP servers**:
  three files — `src/server.ts` (default-exports the configured
  Express app — Vercel adapter contract), `src/main.ts` (local
  Node.js listener), `src/sentry-init.ts` (Sentry preload via
  `--import`). The `bootstrap-app.ts` + `server-runtime.ts` +
  combined `src/index.ts` shape is anti-pattern; Phase 2 of the
  canonical-deploy-shape plan deletes them. Do NOT re-introduce
  any of them.
- **Build self-assertion is mandatory** for any deployable
  workspace: esbuild metafile with a `default`-export contract
  check on the deployed entry-point output, `result.warnings.
  length > 0` → throw. Encoded in `esbuild.config.ts`. Phase 1
  of the canonical-deploy-shape plan installs this for the MCP
  HTTP workspace.
- **Vendor-config passthrough discipline** (folded into ADR-163
  amendment in Phase 7): any vendor SDK config envvar bound to
  build-time behaviour MUST appear in `turbo.json`
  `globalPassThroughEnv` (Sentry case proven 2026-04-23).
  Falsifiability: a CI-enforced grep over all built workspaces'
  vendor-init code finds every `process.env.VENDOR_*` reference
  matched in `globalPassThroughEnv`.
- **Sentry Uptime Monitoring is the chosen tool** for the
  uptime layer of the existing `synthetic-monitoring.plan.md`
  lane; **Sentry Cron Monitors are the candidate** for the
  working-probe layer (final pick in that plan's WS2). Phase
  5 of the canonical-deploy-shape plan records this in that
  plan and removes its `blocked_on:` entry. Verification
  (response-body assertions) is currently Sentry Early
  Adopter — opt the org into Early Adopter to use it, or land
  the basic 2xx-status probe first.
- **The owner phrase recorded verbatim**: *"synthetics is the
  wrong term in the Sentry world, we want uptime monitoring"*.
  The on-disk `synthetic-monitoring.plan.md` keeps its file
  name in this commit; rename to a Sentry-taxonomy-aligned
  name is deferred to a separate documentation pass to avoid
  cross-reference churn during an in-flight unblock.

**Pre-existing standing decisions (carried unchanged)**:

- **Build tool for the MCP app**: raw esbuild via
  `apps/oak-curriculum-mcp-streamable-http/esbuild.config.ts`
  (composition root) + `build-scripts/esbuild-config.ts` (pure
  factory). NOT tsup. NOT a bespoke wrapper. NOT an `.mjs` shape.
- **Plugin**: `@sentry/esbuild-plugin`, first-party, ADOPTED.
- **`vercel.json` `buildCommand` override**: REMOVED. Vercel runs
  the workspace's default `build` script.
- **L-7 bespoke orchestrator** (5 TS files, `upload-sourcemaps.sh`,
  `tsup.config.ts`, `apps/oak-search-cli/.sentryclirc`): DELETED
  by `f9d5b0d2`. Do NOT recreate.
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
unchanged): after §L-8 closes, Phase 3a (L-1 free-signal, L-2
delegates extraction, and L-3 MCP request context) — all
schema-independent — can land in parallel before the
events-workspace. That closes the alpha gate. Events-workspace,
L-4b metrics, Phase 4 siblings (security / accessibility), and
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
