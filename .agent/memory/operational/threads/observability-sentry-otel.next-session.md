# Next-Session Record — `observability-sentry-otel` thread

**Migrated 2026-04-21 (Session 4 Task 4.5 of the staged doctrine-
consolidation plan)**: this file was moved from the legacy singular
path `.agent/memory/operational/next-session-opener.md` to the
canonical per-thread path
`.agent/memory/operational/threads/observability-sentry-otel.next-session.md`.
This closes the `observability-thread-legacy-singular-path`
pending-graduations register item and allows the Task 4.2.c sixth
audit check (active thread ↔ next-session record file
correspondence) to pass without special-casing.

**Authored**: 2026-04-21 session close after the §L-8 WS1+WS2+WS3.1
atomic landing (`f9d5b0d2 feat(mcp-http): §L-8 esbuild-native build
via @sentry/esbuild-plugin`). Three branches: 31 files changed, +1328
/-1376; tsup → raw esbuild + `@sentry/esbuild-plugin`; 953-line L-7
orchestrator + `upload-sourcemaps.sh` + `tsup.config.ts` deleted; 24
new tests pass; 639/639 total tests pass; type-check + lint + format
+ knip + depcruise + markdownlint clean.
**Consumed at**: next session that picks up the
`observability-sentry-otel` thread. The `memory-feedback` thread
was archived 2026-04-22 Session 8 at the close of the
eight-session staged doctrine-consolidation arc; this thread is
the next-active thread per
[`../repo-continuity.md` §Next safe step](../repo-continuity.md).
Per-thread-per-session landing commitment still applies per
PDR-026.
**Lifecycle**: delete on session close once its landing target has
been reported (per PDR-026); rewrite if the landing target needs
re-stating for a further session.

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
| `Pippin` | `cursor` | `claude-opus-4-7` | *`unknown`* | `diagnosis-and-correction` | 2026-04-22 | 2026-04-23 |

**Identity discipline**: per the additive-identity rule
([PDR-027](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md)),
sessions joining this thread add an identity row; they do not
overwrite or rename existing rows. The 2026-04-21 `Samwise` row is
retroactive attribution for the `f9d5b0d2` landing. **Thread-local
attribution-gap decision (owner-accepted, 2026-04-21)**: the
attribution gap for this thread's pre-2026-04-22 history (including
the `f9d5b0d2` landing) is accepted as-is — no further retroactive
attribution will be attempted; concrete identity attribution
discipline applies forward from 2026-04-22 onward. This decision is
thread-local (specific to the `observability-sentry-otel` thread's
own history) and intentionally not promoted to portable PDR-027
governance. The next session on this thread is the first session
expected to register a concrete identity on arrival per
[`.agent/rules/register-identity-on-thread-join.md`](../../../rules/register-identity-on-thread-join.md).

---

## Impact (metacognition lens)

§L-8 closed the *implementation* surface for esbuild-native Sentry
release/source-map/deploy linkage. The *operational* surface is
still unproven — the `@sentry/esbuild-plugin` configured by
`createSentryBuildPlugin` runs only when Vercel's build env exposes
`VERCEL_ENV` + `VERCEL_GIT_COMMIT_SHA` + `VERCEL_GIT_REPO_SLUG` AND
`SENTRY_AUTH_TOKEN` is wired into the Vercel project env. Until a
preview build proves the boundary read works end-to-end, §L-8's
contribution to "errors attributed to release, tool context, and
request state, with runtime health visible" remains blocked.

The bridge from action to impact is two short steps:

1. **§L-8 WS1 acceptance probe** (next-session target): push the
   landed branch to a Vercel preview, observe the build log for the
   `[esbuild.config] Sentry plugin enabled: release=… env=…` line,
   confirm Sentry UI surfaces the expected Artifact Bundle + release
   + commits + deploy event for that build.
2. **§L-8 WS4/WS5 rollout** (after probe passes): production deploy
   on the next `semantic-release` version-bump commit; smoke-test the
   live MCP server through the Sentry UI.

After WS5, public-alpha Sentry integration's release-attribution lane
is complete and Phase 3a (L-1 + L-2 + L-3) becomes the next forward
lane.

## Landing target (per PDR-026)

### Outcome of the previous session (2026-04-22, Pippin) — UNLANDED

Per [PDR-026 §Deferral-honesty discipline](../../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md#deferral-honesty-discipline):

- **What was attempted**: §L-8 WS1 acceptance probe — pushed
  `feat/otel_sentry_enhancements` to Vercel preview (deployment
  `dpl_8LJxuArqh68w4pon9MbfnriD5rre` @ commit `ff91cd1c`); read
  the build log; expected the
  `[esbuild.config] Sentry plugin enabled: release=… env=preview`
  line.
- **What prevented**: build exit 1. Observed log lines
  `Validated application version: 1.5.0` (pre-flight script
  resolved version from disk) IMMEDIATELY followed by
  `[esbuild.config] Sentry build-plugin intent error: { kind: 'missing_app_version' }`
  (composition root treated the resolver-side identity gap as
  fatal). Two distinct named constraints established by the build
  log:
    1. **Version-resolution drift** — the canonical resolver in
       `createSentryBuildPlugin` reads from a different boundary
       (`process.env`) than the validation script (`require('./package.json').version`);
       Vercel does not populate the env-var boundary at build time.
       Falsifiability: re-running the same Vercel build before any
       L-8 Correction work-item lands will reproduce the same
       error.
    2. **Fail-policy inversion** — vital identity (release name)
       and optional vendor configuration (`SENTRY_AUTH_TOKEN`)
       both halt the build. The standing decision was that vendor
       configuration should warn-and-continue. Falsifiability: a
       fork-preview branch without `SENTRY_AUTH_TOKEN` would also
       fail until work-item 4 lands.
- **Substance landed in lieu of the probe**: a binding L-8
  Correction subsection was authored at the end of
  [`sentry-observability-maximisation-mcp.plan.md`](../../../../plans/observability/active/sentry-observability-maximisation-mcp.plan.md)
  containing the corrected version-resolution strategy
  (production = root `package.json`; preview = branch + short SHA;
  development = short SHA), corrected fail-policy split (vendor
  config → warn; vital identity → throw), and an 8-item work-list
  (canonical resolver; persist to `dist/build-info.json`; refactor
  `createSentryBuildPlugin`; refactor `esbuild.config.ts` to
  branch on `IntentError.kind`; tighten the validation script;
  re-run probe; verify Sentry UI; amend ADR-163 §6/§7). PR #87
  title and description were rewritten by owner direction.
- **What next session re-attempts**: the 8-item L-8 Correction
  work-list, then the Vercel acceptance probe.

### Target for the next session

> **Target**: §L-8 WS1 acceptance probe complete — Vercel preview
> build of `feat/otel_sentry_enhancements` (rebased on the L-8
> Correction landing) produces the expected
> `[esbuild.config] Sentry plugin enabled: release=… env=preview`
> log line, AND the Sentry UI for `oak-open-curriculum-mcp` shows
> the resulting Artifact Bundle + release + commits + deploy event
> for that build. The L-8 Correction work-items (1–8 in the active
> plan's correction subsection) are the prerequisite — the probe
> is the acceptance gate at the end, not the only deliverable.

Evidence to capture in the napkin or `repo-continuity.md` once
landed:

- Vercel preview deployment URL with the post-correction commit
  SHA.
- The exact build-log line(s) from `esbuild.config.ts` (skipped or
  enabled, with release name + env).
- Sentry UI screenshot or `sentry-cli releases info <version>`
  output showing the registered release with `commit`, `deploy`,
  and Artifact Bundle for the preview release name (`preview-<branch-slug>-<short-sha>`,
  per the corrected strategy).
- Confirmation that `dist/**/*.js.map` was deleted post-upload (per
  the plugin's `filesToDeleteAfterUpload`); deployed `.js` carries
  no `sourceMappingURL` comment (Sentry "hidden source-map"
  posture).
- The persisted `dist/build-info.json` (or chosen file path)
  contents, demonstrating the canonical resolver wrote the same
  release name the plugin used.
- A fork-preview run (or simulated preview without
  `SENTRY_AUTH_TOKEN`) producing
  `[esbuild.config] Sentry plugin skipped: SENTRY_AUTH_TOKEN not provided — release will not be registered with Sentry`
  AND a successful build artefact — proving the fail-policy split.

## Session shape

The next session is shaped by the L-8 Correction subsection of the
active plan, NOT the original probe-only flow above. The
correction work-items must land before the probe is meaningful;
the probe at the end is the acceptance gate.

**Commit workflow tooling available** (added 2026-04-23 by Pippin):
the L-8 Correction work-list will produce ~8+ commits (one per
work-item plus a probe commit). To avoid the Shell-tool
stream-truncation pattern that bit Pippin's continuity-correction
commits on 2026-04-23, use the workflow standard documented in
[`AGENTS.md § Commit workflow helpers`](../../../../AGENTS.md):
`scripts/check-commit-message.sh` for pre-validation,
`git commit -F - >/tmp/commit.log 2>&1` for the commit itself,
`scripts/log-commit-attempt.sh` to append a TSV row to the
diagnostic log. Do NOT pre-prime the turbo cache via
`bash .husky/pre-commit`; the turbo cache primes itself in the
real commit and pre-priming wastes ~30s per commit.

1. **Ground First** per `start-right-quick` steps 1–6 (directives →
   start-here ADRs → active memory → operational memory → plans →
   branch state). Read in this order:
    - This file (in full — landing target above is the binding
      contract).
    - The L-8 Correction subsection at the END of
      [`sentry-observability-maximisation-mcp.plan.md`](../../../../plans/observability/active/sentry-observability-maximisation-mcp.plan.md)
      (work-items 1–8 are the binding execution list).
    - The 2026-04-22 napkin top entry (`Pippin` /
      `observability-sentry-otel`) capturing the 7th instance of
      `inherited-framing-without-first-principles-check` and the
      2nd instance of `passive-guidance-loses-to-artefact-gravity`.
2. **Author the canonical release-name resolver** (work-item 1).
   New module in `packages/libs/sentry-node/` (or a `release-identity`
   submodule). One function. Pure. Inputs: build context (env vars,
   branch, sha). Output: resolved release name. Vitest unit tests
   covering each of the three context rows (production / preview /
   development) exhaustively.
3. **Persist the resolved release name** (work-item 2). Write to
   `dist/build-info.json` (or owner-chosen path). Document the file
   shape in TSDoc on the resolver and in
   `docs/operations/sentry-deployment-runbook.md`.
4. **Refactor `createSentryBuildPlugin`** (work-item 3) to consume
   the persisted release name (or call the canonical resolver
   directly). Eliminate the second boundary read.
5. **Refactor `esbuild.config.ts`** (work-item 4) to branch on
   `IntentError.kind`: vendor-config-missing variants → log warn,
   omit plugin, continue the build; identity-missing variants →
   throw with the helpful message named in the L-8 Correction §Corrected
   fail-policy table.
6. **Tighten `validate-root-application-version.mjs`** (work-item
   5): either delete it in favour of the canonical resolver
   running at the same point in the build, or make it a thin
   wrapper that delegates to the resolver. Two scripts that
   independently parse `package.json` is the bug being corrected.
7. **Pre-flight**: confirm `SENTRY_AUTH_TOKEN` is set on the Vercel
   `poc-oak-open-curriculum-mcp` project for **all three**
   environments (production, preview, development). The probe
   needs it on preview; production deploy needs it for WS5;
   setting it once across the three is cheaper than touching the
   project twice. Authoritative location:
   <https://vercel.com/oak-national-academy/poc-oak-open-curriculum-mcp/settings/environment-variables>.
8. **Push the branch** (`feat/otel_sentry_enhancements`, with the
   correction commits) to the remote. Vercel auto-builds the
   preview.
9. **Watch the build log** for one of (work-item 6 — the probe):
    - `[esbuild.config] Sentry plugin enabled: release=preview-<branch-slug>-<short-sha> env=preview`
      → expected; continue. Note the release-name shape now
      reflects the corrected strategy (preview-derived, not root
      `package.json` version).
    - `[esbuild.config] Sentry plugin skipped: SENTRY_AUTH_TOKEN not provided — release will not be registered with Sentry`
      → expected on a fork preview without the secret; build still
      succeeds; this proves the fail-policy split. Owner can
      promote a non-fork preview to verify enabled-path coverage.
    - `[esbuild.config] Sentry build-plugin intent error: { kind: 'missing_app_version', … }`
      → REGRESSION; the canonical resolver did not run, or the
      branch-resolution rule did not fire. Inspect work-items 1–3
      before re-pushing.
    - `[esbuild.config] Sentry build-plugin intent error: { kind: '<other>', … }`
      → identity-missing variant other than version. Read the
      `kind` discriminant; the `IntentError` shape names what was
      missing.
10. **Verify Sentry UI state** (work-item 7) for the resulting
    preview release name:
    - **Project Settings → Source Maps → Artifact Bundles** lists the
      bundle for the build commit's Debug IDs.
    - **Releases → `<preview-release-name>`** shows `commits`
      linked to
      `oaknational/oak-open-curriculum-ecosystem@<sha>` and a
      `deploys` entry with `environment: preview`.
11. **Amend ADR-163 §6 / §7** (work-item 8) to record the
    version-resolution contract explicitly (currently the ADR
    states the *outcome* but not the *boundary discipline*; the
    omission is what allowed the drift). Same-commit-or-same-PR
    rule from WS3.1 still applies.
12. **Capture evidence** in the napkin (new entry under
    `2026-04-2x — L-8 Correction landed, probe passed`); update
    `repo-continuity.md § Next safe step` with the WS5 rollout
    trigger ("merge to `main` once the next semantic-release
    commit is ready").
13. **Delete this file** (PDR-026 landed-case discipline) ONLY
    once the probe has passed; if the probe fails again, the
    landing is unlanded and this file rewrites for the next
    attempt.

## Standing decisions (owner-beats-plan invariant protects these)

- **Build tool for the MCP app**: raw esbuild via
  `apps/oak-curriculum-mcp-streamable-http/esbuild.config.ts`
  (composition root) + `build-scripts/esbuild-config.ts` (pure
  factory). NOT tsup. NOT a bespoke wrapper. NOT an `.mjs` shape.
- **Plugin**: `@sentry/esbuild-plugin`, first-party, ADOPTED.
- **`vercel.json` `buildCommand` override**: REMOVED. Vercel runs
  the workspace's default `build` script.
- **L-7 bespoke orchestrator** (5 TS files + `upload-sourcemaps.sh`
  + `tsup.config.ts` + `apps/oak-search-cli/.sentryclirc`): DELETED
  by `f9d5b0d2`. Do NOT recreate.
- **`@sentry/cli` direct devDep**: DELETED from BOTH the MCP app
  AND `apps/oak-search-cli/`. The CLI now arrives only as a
  transitive dep of `@sentry/esbuild-plugin`; root
  `pnpm.onlyBuiltDependencies` allows its native build script under
  pnpm v10.
- **`packages/libs/sentry-node`**: re-exports `resolveGitSha` for
  the MCP-app composition root (added by `f9d5b0d2`).
- **ADR-163 §6 / §7**: amended 2026-04-21 from prescriptive CLI
  commands (HOW) to outcome statements (WHAT). The plugin is the
  mechanism; the §6.0–§6.6 outcomes are unchanged. Do NOT amend
  the ADR back to CLI prescriptions.

## Non-goals (do not re-open)

- Do NOT recreate the L-7 orchestrator, even if the probe surfaces a
  plugin behaviour gap. The vendor plugin is the canonical
  mechanism; gaps are vendor-issue work, not Oak-built workarounds.
- Do NOT add any `vercel.json` `buildCommand` override. Vercel's
  default `build` script invocation is load-bearing.
- Do NOT edit the unit tests authored in `f9d5b0d2` to assert vendor
  behaviour. Vendor proof lives in the Sentry UI screenshot from
  the probe, not in-process.
- Do NOT migrate any other workspace off tsup.
- Do NOT re-open the tsup-vs-esbuild decision.

## What's after this landing

- **§L-8 WS5 production rollout**: triggered automatically by the
  next `semantic-release` version-bump commit on `main` after the
  feature branch merges. The Vercel `ignoreCommand` ensures only
  version-bump commits run the production Build Command.
- **Phase 3a in parallel** (L-1, L-2, L-3): schema-independent;
  three small lanes that close public-alpha Sentry integration.
- **L-15 strategy close-out + L-EH final**: author
  `prefer-result-pattern` ESLint rule + first-tranche adoption.

## Pattern reminders

- `inherited-framing-without-first-principles-check` has now
  surfaced **seven times** across the 2026-04-21 / 2026-04-22
  window (4th–6th instances landed in the napkin on 2026-04-21;
  7th instance — the version-resolution drift between L-7 prose
  strategy and the WS2 implementation — landed in the 2026-04-22
  Pippin entry). The three-clause first-principles check
  (test-shape, file-naming-vs-landing-path, vendor-API-literals)
  is the documented countermeasure. **Extension prompted by the
  7th instance**: also check whether an inherited resolver shape
  (vendor or sibling-module) preserves any documented
  single-source-of-truth boundary discipline named in adjacent
  prose. Run all four clauses before authoring anything prescribed
  by a plan body or inherited from a vendor convention.
- `passive-guidance-loses-to-artefact-gravity` has now surfaced
  **twice** (1st: 2026-04-21 — the three-mechanism perturbation
  register did not fire on the 4th/5th/6th `inherited-framing`
  instances; 2nd: 2026-04-22 — the §Session shape standing
  decision in this file explicitly named the
  `[esbuild.config] Sentry build-plugin intent error: …` log line
  verbatim, but documented anticipation did not enforce the
  fail-policy split until Vercel produced the failure). At 2
  clean instances, this pattern crosses the typical ≥2 bar for
  general-pattern consideration — **the pattern file already
  exists** at
  [`.agent/memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md`](../../active/patterns/passive-guidance-loses-to-artefact-gravity.md);
  this is a fresh instance, not a new pattern. Active tripwires
  (rules / hooks / skills / pre-commit gates) are what actually
  prevent drift. Exploration queued for a later consolidation
  pass — do not pursue inline. See the 2026-04-21 + 2026-04-22
  napkin entries for the candidate-layer table and Heath brothers
  (Decisive ch. 9 / Switch ch. 8) framing.
- **First-session warning for the next agent**: the next session's
  *first* opportunity to re-instance both patterns is exactly the
  L-8 Correction work-list. Reading the work-list as a directly
  executable plan body without first-principles check (would the
  canonical resolver shape implement the documented
  single-source-of-truth discipline?) is the 8th instance waiting
  to happen. Reading the corrected fail-policy table and
  implementing it as fatal-on-vendor-missing is the 3rd instance
  of `passive-guidance-loses-to-artefact-gravity` waiting to
  happen.

## Lane state (absorbed from retired workstream brief, 2026-04-21 Session 5)

The `workstreams/observability-sentry-otel.md` brief was retired
in Session 5 of the `memory-feedback` thread as part of the
workstream-layer collapse (owner-ratified TIER-2 simplification;
see [PDR-027 §2026-04-21 Session 5 Amendment](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md#amendment-log)
and [`repo-continuity.md § Session 5 close summary`](../repo-continuity.md)).
Load-bearing content folded in here so the thread next-session
record carries the state previously split across two surfaces:

**Owning plans**:

- [`sentry-observability-maximisation-mcp.plan.md`](../../../../plans/observability/active/sentry-observability-maximisation-mcp.plan.md)
  — lane-level execution authority (ACTIVE).
- [`high-level-observability-plan.md`](../../../../plans/observability/high-level-observability-plan.md)
  — five-axis MVP framing + wave sequencing.
- [`sentry-otel-integration.execution.plan.md`](../../../../plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md)
  — foundation parent plan; credential/evidence authority.

**Test totals at handoff** (from the Session-4 landing gate):
observability 58/58, sentry-node 61/61, logger 140/140,
oak-search-sdk 262/262, oak-curriculum-mcp-streamable-http
615/615, search-cli 1006/1006, E2E 161/161 in isolation. `pnpm
check` exit 0 at session close.

**Post-§L-8 forward path** (from the 2026-04-20 re-sequencing):
after §L-8 closes, Phase 3a (L-1 free-signal + L-2 delegates
extraction + L-3 MCP request context) — all schema-independent —
can land in parallel before the events-workspace. That closes
the alpha gate. Events-workspace + L-4b metrics + Phase 4
siblings (security / accessibility) + Phase 5 close-out lanes
form the public-beta gate. See `§Alpha vs public-beta gates` in
the active plan for the authoritative split.

**Active tracks**: none at handoff. The stale OAC-labelled track
card carrying the L-8 handoff note was resolved and deleted
during the Session-4 handoff.

**Promotion watchlist** (carried from the retired brief):

- **`sunk-cost-framing-in-parked-rationale`** — the L-8 `dropped`
  rationale (2026-04-17) was itself a sunk-cost framing:
  "shell-script is simpler" was protecting the chosen shape, not
  measuring cost. Second instance; watch for a third.
- **`feature-workstream-template-guardrails-self-test`** — the
  L-8 section is the first self-test of the Build-vs-Buy
  Attestation + Reviewer Scheduling guardrails inside a live
  active plan body. Clean execution validates the template; any
  friction demands template amendment.

## Session-close discipline reminder (PDR-026)

Close by either:

- **Landed** (probe passed, evidence captured): record the
  preview-deployment URL + Sentry UI evidence link; delete this
  file; rewrite a fresh opener for §L-8 WS5 + Phase 3a.
- **Unlanded** (probe failed, env var missing, plugin gap, etc.):
  record attempted / prevented / next-session-re-attempts in
  `repo-continuity.md § Next safe step`; rewrite the Target block
  above for the next session with the specific failure mode named.
