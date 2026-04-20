---
name: "Sentry Esbuild Plugin Migration"
overview: "Replace the bespoke Sentry release/commits/deploy orchestrator with @sentry/esbuild-plugin; switch the MCP app build to register the plugin inside tsup's esbuild pipeline; amend ADR-163 §6 to state outcome not HOW."
todos:
  - id: ws0-plan-time-review
    content: "WS0 (PLAN-TIME, PRE-ExitPlanMode): dispatch assumptions-reviewer + sentry-reviewer for solution-class challenge of this plan. Record findings here. Amend plan if reviewers reject or refine the shape."
    status: pending
  - id: ws1-red
    content: "WS1 (RED): write failing tests that assert: (a) tsup-produced dist bundles carry Debug IDs; (b) build output logs confirm release + sourcemap upload under SENTRY_AUTH_TOKEN=<fake>; (c) resolveSentryEnvironment + resolveSentryRegistrationPolicy are invoked once during the build to derive release/env/deploy metadata."
    status: pending
  - id: ws2-green
    content: "WS2 (GREEN): extend createAppConfig to accept esbuildPlugins; register @sentry/esbuild-plugin with release + sourcemaps.filesToDeleteAfterUpload + deploy config derived from resolveSentryEnvironment + resolveSentryRegistrationPolicy; delete 5 bespoke build-scripts files + integration test; revert vercel.json.buildCommand; delete package.json build:vercel + @sentry/cli; remove eslint.config.ts process.env exception for build-scripts/sentry-release-and-deploy-cli.ts."
    status: pending
  - id: ws3-refactor
    content: "WS3 (REFACTOR): amend ADR-163 §6 to state the Sentry UI outcome (release + commits + deploy-per-env) without prescribing CLI argv; update sentry-deployment-runbook + observability.md + sentry-cli-usage.md; delete upload-sourcemaps.sh; update L-7/L-8 section body in sentry-observability-maximisation-mcp.plan.md to reflect landed migration; TSDoc on the two policy functions stays canonical."
    status: pending
  - id: ws4-quality-gates
    content: "WS4: full quality gate chain from repo root (pnpm check). Vercel preview deployment green; Sentry UI shows release registered + commits attached + deploy recorded under correct environment."
    status: pending
  - id: ws5-adversarial-review
    content: "WS5: mid-cycle + close reviewers per Reviewer Scheduling section. Verify canonical Sentry plugin idiom (sentry-reviewer), boundary discipline (architecture-reviewer-fred), plan-to-code doc coherence (docs-adr-reviewer), release readiness (release-readiness-reviewer)."
    status: pending
  - id: ws6-doc-propagation
    content: "WS6: update ADR-163 History; amend maximisation plan L-7 status -> completed(migrated); amend L-8 status -> completed; propagate to documentation-sync-log.md; archive upload-sourcemaps.sh to archive/."
    status: pending
isProject: false
---

# Sentry Esbuild Plugin Migration

**Last Updated**: 2026-04-20
**Status**: 🟡 PLANNING (pre-ExitPlanMode; assumptions-reviewer + sentry-reviewer pass required before execution per Reviewer Scheduling)
**Scope**: Replace the ~900-line bespoke Sentry release/commits/deploy orchestrator with the vendor's first-party bundler plugin.

> **Plan Density Invariant note** (2026-04-20): the observability
> directory's
> [Plan Density Invariant](../README.md#plan-density-invariant) says no
> new plan lands in this tree without an existing plan archiving in the
> same pass, until Wave 2 opens. This plan is a new standalone file.
> Two proportionate resolutions: **(a)** fold this body into
> `active/sentry-observability-maximisation-mcp.plan.md`'s §L-8 section
> (treat the template structure as a sub-plan within that section),
> **(b)** retain as a standalone file and pair with an archive in the
> same commit. Owner decides. Default recommendation: (a), because the
> maximisation plan is already L-8's authoritative lane and the
> template-structured body reads naturally as an expanded §L-8. If (a),
> this file is deleted before merge; its substance lands inside
> maximisation §L-8.

---

## Context

### Current State

L-7 of the Sentry Observability Maximisation lane landed a bespoke
release/commits/deploy orchestrator during 2026-04-19/20 across three
commits:

- `7f3b17e9` — sentry-node resolver split + `git.commit.sha` tag rename
- `6f5acd17` — four-file TypeScript orchestrator + integration tests
- `ecee9801` — `build:vercel` custom script + `vercel.json.buildCommand`
  override + ADR-163 §6 amendment

The orchestrator lives at:

- `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-release-and-deploy.ts` (157 lines)
- `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-release-and-deploy-cli.ts` (153 lines)
- `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-release-and-deploy-preflight.ts` (201 lines)
- `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-release-and-deploy-types.ts` (41 lines)
- `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-release-and-deploy.integration.test.ts` (401 lines, 22 test cases)

Total: **953 lines across 5 files**, plus:

- `apps/oak-curriculum-mcp-streamable-http/package.json` — `build:vercel`
  script invoking `tsx build-scripts/sentry-release-and-deploy-cli.ts`
- `apps/oak-curriculum-mcp-streamable-http/vercel.json` — `buildCommand`
  override pointing at `build:vercel`
- `apps/oak-curriculum-mcp-streamable-http/eslint.config.ts` (line 137)
  — carved-out `process.env` allowance for the CLI entry point
- `@sentry/cli` as a devDependency (3.3.5)
- ADR-163 §6 — six-step `sentry-cli` command sequence
- `apps/oak-curriculum-mcp-streamable-http/scripts/upload-sourcemaps.sh`
  — legacy shell-script fallback

### Problem Statement

The vendor's first-party `@sentry/esbuild-plugin` handles release
registration, commit attribution, source-map upload with Debug IDs, and
deploy-event emission as a standard bundler plugin. The bespoke
orchestrator was authored without evaluating the plugin option. Once
landed, five ratchets fired against the bespoke shape (file-splits,
type-import cycle, §6.0 probe amendment, ADR amendment, eslint-config
exception) — each individually principled, aggregate signal that the
shape was wrong. See napkin entry `2026-04-20 — L-7 bespoke
orchestrator built then pivoted + guardrails installed` and commit
`4bccba71` guardrail installation.

### Existing Capabilities (retained)

- **`resolveSentryEnvironment`** and **`resolveSentryRegistrationPolicy`**
  in `packages/libs/sentry-node/src/` — both are pure vendor-agnostic
  policy functions (environment derivation from Vercel env pairs;
  registration-override policy for local-dev). These are reused by the
  plugin config; they do not change.
- **`@sentry/sentry-node`** is already a devDependency; `@sentry/esbuild-plugin`
  installs into the same package family.
- **`tsup`** is the build tool; `tsup` is itself an esbuild wrapper. The
  plugin registers through `tsup`'s esbuild plugin mechanism.
- **`.github/workflows/release.yml`** (semantic-release) and
  **`apps/oak-curriculum-mcp-streamable-http/build-scripts/vercel-ignore-production-non-release-build.mjs`**
  (version-bump gate) — both stay. They enforce the "one version-bump
  commit per production build" invariant the plugin can trust.

---

## Design Principles

1. **Vendor plugin owns the Sentry lifecycle** — release registration,
   commit attribution, source-map upload, deploy events. Local code
   does not reimplement any of these.
2. **Local code owns policy, not mechanism** — `resolveSentryEnvironment`
   + `resolveSentryRegistrationPolicy` remain because they encode Oak's
   Vercel env-pair truth table (ADR-163 §3), which is Oak policy, not a
   Sentry mechanism. They are pure functions with no `@sentry/*`
   imports.
3. **Delete aggressively, preserve nothing of the bespoke shape** —
   no compatibility layer, no shell-script fallback, no parallel path.
   Per `principles.md`: "replace old approaches with new approaches,
   never create compatibility layers".
4. **ADRs state WHAT, not HOW** — ADR-163 §6 currently lists six
   specific `sentry-cli` invocations. Task WS3 rewrites §6 to state the
   Sentry UI state Sentry must reach (release registered, commits
   attached, deploy recorded per env) and lets the plugin configuration
   live in the realising plan (this one) and in code.

### Non-Goals (YAGNI)

- **Do NOT replace tsup with raw esbuild.** tsup wraps esbuild and
  already exposes the plugin registration surface; replacing tsup would
  be the toolchain swap the prior L-8 `dropped` rationale wrongly
  claimed was required. The migration is additive at the tsup config
  level.
- **Do NOT preserve `@sentry/cli` as a devDependency.** The plugin is
  the sole mechanism. If a diagnostic path is ever needed, install the
  CLI temporarily; don't carry it as a permanent dev surface.
- **Do NOT retain `upload-sourcemaps.sh` as a fallback.** Delete.
- **Do NOT defer the ADR-163 §6 rewrite.** The HOW-vs-WHAT calcification
  IS the lesson installed by `4bccba71`; leaving the bespoke CLI
  sequence documented as authoritative re-enables the calcification
  this plan exists to resolve.

---

## Build-vs-Buy Attestation (REQUIRED before ExitPlanMode)

**Vendor**: Sentry

**First-party integrations surveyed**:

| Integration shipped by vendor | Evaluated? | Adopted / ruled out + reason |
|---|---|---|
| `@sentry/esbuild-plugin` | yes | **ADOPTED**. Canonical first-party bundler plugin for esbuild-based builds. tsup wraps esbuild and exposes plugin registration. Plugin handles release, commits, sourcemaps with Debug IDs, and deploy events as a standard unit. |
| `@sentry/webpack-plugin` | yes | N/A. Not applicable — the MCP app does not use webpack. |
| `@sentry/vite-plugin` | yes | N/A. Not applicable — the MCP app does not use Vite. |
| `@sentry/rollup-plugin` | yes | N/A. Not applicable — the MCP app does not use rollup. |
| `@sentry/cli` invoked from a bespoke orchestrator | yes | **RULED OUT**. The orchestrator has already been written and landed; the shape produced 953 lines of bespoke code + build-config overrides + an eslint-config exception + an ADR HOW-prescription. Vendor-plugin is the canonical path. "Sunk cost of the bespoke code" is explicitly not a valid retention reason per commit `4bccba71` guardrails. |
| Sentry-hosted release finalizer API | yes | N/A. The plugin handles finalization; no separate path needed. |
| Sentry GitHub App for commits attribution | yes | **RULED OUT for this lane**. Oak's commit attribution already runs through semantic-release + Vercel env pairs (ADR-163 §3 truth table). The plugin reads `VERCEL_GIT_COMMIT_SHA` directly; no GitHub App wiring needed. May be revisited separately if cross-repo attribution surfaces. |

**Bespoke wrapper retention**: NONE. The bespoke orchestrator is
deleted in WS2. The only local code that remains is `resolveSentryEnvironment`
and `resolveSentryRegistrationPolicy`, which are vendor-agnostic policy
functions — not a wrapper around Sentry behaviour.

**Reviewer**: `assumptions-reviewer` MUST run against this attestation
pre-ExitPlanMode. See Reviewer Scheduling below. `sentry-reviewer` MUST
also run to verify the plugin configuration matches the canonical
idiom published in current Sentry documentation.

---

## Reviewer Scheduling (phase-aligned)

### Plan-phase (PRE-ExitPlanMode) — challenges solution-class

Dispatch before WS1 begins. Reviewer findings feed back into this plan
before execution starts; phase-misalignment if run mid-WS2.

- **`assumptions-reviewer`** — challenge: is the plugin genuinely the
  right shape, or is the owner's "we know exactly how to proceed"
  signal itself a frame that closes off alternatives? Expected
  finding: plugin direction holds; this attestation is complete.
- **`sentry-reviewer`** — verify `@sentry/esbuild-plugin` is the
  canonical idiom for esbuild-based builds per current official
  Sentry docs. Verify that release + sourcemaps + commits + deploy
  all fall under the plugin's standard config (no split between
  plugin and CLI).

### Mid-cycle (DURING execution) — challenges solution-execution

- **`test-reviewer`** — after WS1 RED; challenge whether the tests
  prove product behaviour (build output carries Debug IDs) rather than
  asserting plugin internals.
- **`type-reviewer`** — after WS2 tsup config change; challenge any
  type widening at the plugin config boundary.
- **`architecture-reviewer-fred`** — after WS2 file deletions;
  challenge boundary discipline around `@oaknational/sentry-node` now
  that the policy functions are the sole remaining Oak contribution.
- **`code-reviewer`** — gateway after WS2; triggers friction-ratchet
  counter if 3+ independent friction signals accumulate against the
  new shape.

### Close (POST-execution) — verifies coherence

- **`docs-adr-reviewer`** — verify ADR-163 §6 rewrite states WHAT not
  HOW; verify runbook + observability.md + sentry-cli-usage.md are
  internally consistent with the landed code.
- **`release-readiness-reviewer`** — GO / GO-WITH-CONDITIONS / NO-GO
  before merge, with evidence that a Vercel preview deployment
  produced the expected Sentry UI state (release + commits + deploy).

---

## WS0 — Plan-Time Review (PRE-ExitPlanMode)

Dispatch `assumptions-reviewer` and `sentry-reviewer` against this plan
file. Record findings in-plan (append a "WS0 Findings" subsection
below). Amend plan in response to findings before proceeding to WS1.

**Acceptance Criteria**:

1. `assumptions-reviewer` returns without rejecting the solution-class
   or returns a refined shape that this plan adopts.
2. `sentry-reviewer` confirms `@sentry/esbuild-plugin` wiring is the
   canonical idiom per current Sentry docs.
3. Build-vs-Buy Attestation rows are all concrete (no sunk-cost
   reasoning, no undefined "X unavailable" hand-waves).

### WS0 Findings

_(populated after reviewer dispatch)_

---

## WS1 — Test Specification (RED)

All tests MUST FAIL at the end of WS1.

### 1.1: Build-output tests

**Tests**:

- `apps/oak-curriculum-mcp-streamable-http/build-scripts/plugin-build-output.integration.test.ts`
  — asserts that `pnpm build` with `SENTRY_AUTH_TOKEN=<fake>` and the
  other ADR-163 §3 env pair inputs produces dist bundles that carry
  Debug IDs (scannable in the bundle); asserts that the build logs the
  plugin's release-registration + sourcemap-upload + deploy-event
  emission calls.
- `packages/libs/sentry-node/src/policy-invocation.integration.test.ts`
  — asserts that `resolveSentryEnvironment` and
  `resolveSentryRegistrationPolicy` are both invoked exactly once per
  build and that their outputs are passed to the plugin config (via
  whatever module boundary the WS2 wiring chooses).

**Acceptance Criteria**:

1. Tests compile and run.
2. All new tests fail for the expected reason (no plugin wired yet).
3. No existing tests broken.

---

## WS2 — Implementation (GREEN)

All tests MUST PASS at the end of WS2.

### 2.1: Extend `createAppConfig` to accept plugins

**File**: `tsup.config.base.ts`

**Changes**:

- Add `esbuildPlugins?: unknown[]` to `AppConfigOverrides` (type sourced
  from `esbuild` package, not widened to `unknown` at the boundary — use
  `Plugin[]` from `esbuild`).
- Forward `esbuildPlugins` to `defineConfig` as
  `esbuildPlugins: overrides?.esbuildPlugins ?? []`.

**Code Sketch**:

```typescript
// tsup.config.base.ts (append to AppConfigOverrides)
import type { Plugin as EsbuildPlugin } from 'esbuild';

interface AppConfigOverrides {
  readonly banner?: { readonly js: string };
  readonly target?: string;
  /** Additional esbuild plugins to register (e.g. @sentry/esbuild-plugin). */
  readonly esbuildPlugins?: readonly EsbuildPlugin[];
}

// In createAppConfig body, inside defineConfig object:
esbuildPlugins: overrides?.esbuildPlugins ? [...overrides.esbuildPlugins] : undefined,
```

**Deterministic Validation**:

```bash
pnpm --filter @oaknational/tsup-config type-check
# Expected: exit 0; type surface extended without widening
```

### 2.2: Register `@sentry/esbuild-plugin` in MCP app tsup config

**File**: `apps/oak-curriculum-mcp-streamable-http/tsup.config.ts`

**Changes**:

- Add `@sentry/esbuild-plugin` as a devDependency.
- Import the plugin; import `resolveSentryEnvironment` +
  `resolveSentryRegistrationPolicy` from `@oaknational/sentry-node`.
- Call the policy functions at config-construction time to derive the
  plugin's `release.name`, `release.deploy.env`, and
  `release.finalize` inputs.
- Register the plugin via `esbuildPlugins: [sentryEsbuildPlugin(...)]`.

**Code Sketch**:

```typescript
import { createAppConfig } from '../../tsup.config.base.ts';
import { sentryEsbuildPlugin } from '@sentry/esbuild-plugin';
import {
  resolveSentryEnvironment,
  resolveSentryRegistrationPolicy,
} from '@oaknational/sentry-node';

const env = resolveSentryEnvironment(process.env);
const policy = resolveSentryRegistrationPolicy(process.env);

export default createAppConfig(
  {
    index: 'src/index.ts',
    application: 'src/application.ts',
  },
  {
    esbuildPlugins: policy.shouldRegister
      ? [
          sentryEsbuildPlugin({
            org: 'oak-national-academy',
            project: 'oak-curriculum-mcp',
            authToken: process.env.SENTRY_AUTH_TOKEN,
            release: {
              name: env.release,
              deploy: { env: env.deployEnv },
              setCommits: { auto: false, commit: env.commitSha, repo: env.repo },
              finalize: true,
            },
            sourcemaps: { filesToDeleteAfterUpload: ['**/*.js.map'] },
          }),
        ]
      : [],
  },
);
```

> The `process.env` reads inside `tsup.config.ts` are legitimate: tsup
> config is a build-time composition root, not runtime product code.
> ADR-078's "no `process.env` in product code" rule does not cover
> build-config composition roots, which is why `createAppConfig` itself
> is allowed to receive Vercel-injected env through this path.

**Deterministic Validation**:

```bash
SENTRY_AUTH_TOKEN=fake VERCEL_ENV=preview VERCEL_GIT_COMMIT_SHA=abc123 \
  pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http run build
# Expected: build exits 0; dist contains sourcemaps with Debug IDs;
# plugin logs confirm release-registration + upload + deploy-event emission.
```

### 2.3: Delete bespoke orchestrator and its wiring

**Files deleted**:

- `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-release-and-deploy.ts`
- `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-release-and-deploy-cli.ts`
- `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-release-and-deploy-preflight.ts`
- `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-release-and-deploy-types.ts`
- `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-release-and-deploy.integration.test.ts`

**Files amended**:

- `apps/oak-curriculum-mcp-streamable-http/package.json` — delete
  `build:vercel` script; delete `@sentry/cli` devDependency; delete
  `tsx` devDependency (only used by the bespoke CLI) if no other
  consumers.
- `apps/oak-curriculum-mcp-streamable-http/vercel.json` — remove
  `buildCommand` override (Vercel falls back to the workspace's `build`
  script, which is `tsup`).
- `apps/oak-curriculum-mcp-streamable-http/eslint.config.ts` — remove
  the `build-scripts/sentry-release-and-deploy-cli.ts` exception block
  (lines ≈ 130–149 based on 2026-04-20 HEAD; line numbers drift — check
  fresh before edit).

**Deterministic Validation**:

```bash
rg -n "sentry-release-and-deploy|build:vercel|@sentry/cli" apps/oak-curriculum-mcp-streamable-http/
# Expected: 0 matches.
ls apps/oak-curriculum-mcp-streamable-http/build-scripts/
# Expected: only vercel-ignore-production-non-release-build.mjs + .d.ts remain.
```

---

## WS3 — Documentation and Polish (REFACTOR)

### 3.1: Amend ADR-163 §6 to state outcome, not HOW

**File**: `docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md`

**Change**: Replace §6's six-step `sentry-cli` invocation prescription
with a single outcome statement: **"For each successful production or
preview build, the Sentry UI MUST reflect (a) a release keyed by the
root package.json semver, (b) the build commit attached to that
release, (c) a deploy event recorded under the appropriate environment.
The mechanism is the vendor's first-party bundler plugin; the specific
plugin configuration is maintained in
`apps/oak-curriculum-mcp-streamable-http/tsup.config.ts`."**

Add a History entry recording the 2026-04-20 plugin migration and the
supersession of the bespoke-CLI prose.

### 3.2: Update operational docs

- `docs/operations/sentry-deployment-runbook.md` — replace any
  bespoke-orchestrator references with plugin-based guidance;
  troubleshooting steps reference plugin logs.
- `docs/operations/sentry-cli-usage.md` — delete or archive; the CLI
  is no longer an operational surface. If retained, front-matter with
  "historical reference only" marker.
- `apps/oak-curriculum-mcp-streamable-http/docs/observability.md` —
  update the release-attribution section to reference the plugin.
- `apps/oak-curriculum-mcp-streamable-http/scripts/upload-sourcemaps.sh`
  — delete.
- `packages/libs/sentry-node/README.md` — note that
  `resolveSentryEnvironment` and `resolveSentryRegistrationPolicy` are
  consumed by the app's tsup config at build time.

### 3.3: Update companion plans

- `.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md`
  — L-7 todo status `completed` (bespoke landed) → amend note to
  record "migrated to plugin via sentry-esbuild-plugin-migration.plan.md
  (landed YYYY-MM-DD)"; L-8 todo status `pending` → `completed`.
- L-7 body section supersession note → point at this plan's landed
  commit.

### 3.4: TSDoc

- `resolveSentryEnvironment` + `resolveSentryRegistrationPolicy` —
  update `@remarks` to note the plugin is now the sole consumer.

---

## WS4 — Quality Gates

```bash
pnpm clean && pnpm sdk-codegen && pnpm build && pnpm type-check && \
pnpm format:root && pnpm markdownlint:root && pnpm lint:fix && \
pnpm test && pnpm test:ui && pnpm test:e2e && pnpm smoke:dev:stub
```

**Additional release-state verification** (not a gate, but a blocker
for WS5's `release-readiness-reviewer`):

- Push branch to GitHub; Vercel preview deployment completes green.
- Sentry UI shows the preview-env release registered with commits
  attached and a deploy event.

---

## WS5 — Adversarial Review

Invoke reviewers per the Reviewer Scheduling section. Record findings
in-plan. Any BLOCKER finding halts the lane; FIX-BEFORE-MERGE findings
land inside this plan's commits.

---

## Risk Assessment

| Risk | Mitigation |
|---|---|
| `@sentry/esbuild-plugin` does not expose one of the behaviours the bespoke orchestrator encoded (e.g. precise deploy-event env mapping) | WS0 `sentry-reviewer` pass confirms the canonical plugin idiom covers all four bespoke behaviours. If a gap surfaces, attestation amends before execution starts. |
| Vercel preview deployment fails on first build after `vercel.json.buildCommand` removed | Preview failures are cheap; a fresh branch re-run with the override restored is one commit. Production is gated by `vercel-ignore-production-non-release-build.mjs` + the version-bump invariant. |
| Plugin version upgrade later breaks the build | Pin `@sentry/esbuild-plugin` version explicitly; document the upgrade path in the README. |
| `createAppConfig` `esbuildPlugins` extension weakens the base config contract for other apps | Type the new override as `readonly EsbuildPlugin[]` from the official esbuild types; do not widen. Default is empty, so no behaviour change for other apps. |
| ADR-163 §6 rewrite is perceived as rewriting history | History entry records the 2026-04-20 supersession and the reason (HOW-vs-WHAT calcification lesson from `4bccba71`). Prior §6 prose stays as a versioned historical entry in the ADR itself. |

---

## Foundation Alignment

Before WS1 starts and at each phase boundary:

1. Re-read `.agent/directives/principles.md` — "No compatibility
   layers"; "Version with git, not with names"; "Fix the boundary, not
   duplicate across it".
2. Re-read `.agent/directives/testing-strategy.md` — tests prove
   product behaviour, not plugin internals.
3. Re-read `.agent/directives/schema-first-execution.md` — the plugin
   config is schema-adjacent (it maps policy outputs to vendor inputs);
   use vendor types from `@sentry/esbuild-plugin`, do not widen.
4. Re-ask the first question: could it be simpler without compromising
   quality?

---

## Documentation Propagation

- ADR-163 (amended in WS3.1; History entry)
- ADR index (update §Observability entry)
- `docs/operations/sentry-deployment-runbook.md`
- `docs/operations/sentry-cli-usage.md` (archive or delete)
- `apps/oak-curriculum-mcp-streamable-http/docs/observability.md`
- `packages/libs/sentry-node/README.md`
- `.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md`
  (L-7 + L-8 status + section bodies)
- `.agent/plans/observability/documentation-sync-log.md`

---

## Consolidation

After WS6 lands and quality gates pass, run `/jc-consolidate-docs` to
graduate settled patterns from this lane (e.g. any refinements to the
build-vs-buy attestation template, reviewer-phase evidence).

---

## Dependencies

**Blocking**:

- L-7 bespoke orchestrator landed (DONE: `7f3b17e9` + `6f5acd17` +
  `ecee9801`). The migration deletes it; it must exist to be deleted.
- OAC Phase 2 scaffolding landed (DONE: `ffcad2aa`). This plan is
  authored against the decomposed state surfaces, not the overloaded
  session-continuation prompt.

**Related Plans**:

- `.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md`
  — source lane. L-7 status reconciled; L-8 un-dropped (see
  commit `1fb4ac66`). This plan is L-8's execution.
- `.agent/plans/agentic-engineering-enhancements/active/operational-awareness-and-continuity-surface-separation.plan.md`
  — parallel lane. OAC Phase 3 pilot may use this plan's
  workstream brief as one of the pilot scenarios.

---

## Self-Test of Installed Guardrails

This plan is the deliberate self-test of the six metacognition lessons
installed in commit `4bccba71`:

- **Build-vs-Buy Attestation** (above) — is it a concrete vendor
  survey, or does it hand-wave? Audit: every row names a concrete
  integration and a concrete adopted / ruled-out reason; no row cites
  sunk cost.
- **Reviewer Scheduling** (above) — are plan-time reviewers scheduled
  BEFORE ExitPlanMode? Audit: `assumptions-reviewer` + `sentry-reviewer`
  are WS0, blocking execution start. Not last-in-the-matrix.
- **Friction-ratchet counter** — if 3+ friction signals accumulate
  against the chosen shape during execution, `code-reviewer` escalates
  to `assumptions-reviewer` rather than a tactical fix. Watch-list.
- **Sunk-cost phrase detector** — the L-8 un-dropping note in commit
  `1fb4ac66` already documented this lane's prior sunk-cost framing;
  no new instances expected.
- **ADRs state WHAT, not HOW** — WS3.1 rewrites ADR-163 §6 from HOW to
  WHAT. Audit via `docs-adr-reviewer` close review.
- **Solution-class challenge at dispatch frame** — WS0 framing asks
  "should the plugin shape exist?" not "is the plugin wiring
  well-structured?". If reviewers answer the latter instead, that IS
  phase-misalignment.

A graduation signal for the guardrails is: if this plan authors
cleanly, reviewers accept, and execution lands without re-activating
the build-vs-buy debate, the guardrails work as designed. If the
guardrails are discovered to be under-specified, the remediations land
inside this plan's consolidation step.
