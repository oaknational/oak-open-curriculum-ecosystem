---
name: "There Is No Time — Hashed Starfish (smoke-harness redesign + observability rename + push/preview/merge)"
overview: >
  Three-arc execution sequencer for the feat/eef_exploration branch.
  ARC A redesigns the smoke-test harness to a thin start-server + invoke-vitest +
  cleanup wrapper, retiring global process.env mutation and reclassifying the
  no-observability boot regression-guard out of e2e-tests. ARC B executes
  WS2-WS11 of the observability rename (existing plan body) with corrections
  to deletion timing, WS4→WS6 bridge language, and ESLint rule authoring.
  ARC C runs pre-merge divergence analysis, push, preview validation, and
  merge. ARCs D and E are sequenced separately under their thread records.
status: current
isProject: true
todos:
  - id: arc-a1-design-and-red
    content: "ARC A1: design canonical smoke harness; author RED tests for env-builder, boot-signal parser, lifecycle wrapper; vitest.smoke.config.ts; smoke-context.ts. Reviewer dispatch: test-reviewer, architecture-reviewer-fred, architecture-reviewer-betty, mcp-reviewer."
    status: pending
  - id: arc-a2-existing-modes-migration
    content: "ARC A2: convert local-stub, local-stub-auth, local-live, local-live-auth, remote to new harness; convert smoke-assertions/* to *.smoke.test.ts; retire helpers/environment.ts process.env mutation; every existing pnpm smoke:dev:* still passes."
    status: pending
  - id: arc-a3-no-observability-mode
    content: "ARC A3: add local-no-observability mode + dev-server-operational.smoke.test.ts; smoke:dev:no-observability script; delete the misclassified e2e-tests/dev-server-boots-without-observability-config.e2e.test.ts; stays RED through ARC B by harness boot-wait timeout."
    status: pending
  - id: arc-a4-docs-and-adr
    content: "ARC A4: ADR canonicalising smoke harness shape (number verified pre-author); testing-strategy.md amendment for *.smoke.test.ts as third vitest category; smoke-tests/README.md operator guide."
    status: pending
  - id: arc-b0-plan-body-corrections
    content: "ARC B0: edit observability-multi-sink-and-fixtures-shape.plan.md applying SentryEnvSchema deletion-timing correction (move to WS5 close), WS4→WS6 bridge removal, ESLint rule authoring as WS6 task, ADR number verification, six Moonlit Drifting Nebula amendments folded into WS slots."
    status: pending
  - id: arc-b1-sentry-node-registry
    content: "ARC B1 (=WS2): @oaknational/sentry-node atomic rename; SentryMode deleted; FixtureSentryStore→FixtureCaptureStore; ParsedSentryConfig cross-product discriminated union; WS1 RED-arc skip register entries unskip."
    status: pending
  - id: arc-b2-env-layer
    content: "ARC B2 (=WS3): ObservabilityEnvSchema; warnings channel in resolveEnv Result; @deprecated tag on SentryEnvSchema (NOT deleted); rename-replacement error messages with explicit OBSERVABILITY_FILE_PATH naming."
    status: pending
  - id: arc-b3-http-mcp-rename
    content: "ARC B3 (=WS4): HTTP MCP atomic rename (env, runtime-config, http-observability, observe-noauth carve-out deletion, sentry-build-environment type signature); logger additionalSinks migration explicit slot; pnpm smoke:dev:no-observability GREEN; core-endpoints.ts NOT touched (WS6 owns it)."
    status: pending
  - id: arc-b4-search-cli-rename
    content: "ARC B4 (=WS5): Search CLI atomic rename; FINAL deletion of packages/core/env/src/schemas/sentry.ts plus orphaned test file."
    status: pending
  - id: arc-b5-server-instrumenter-port
    content: "ARC B5 (=WS6): ServerInstrumenter port + sentry-node implementation; HTTP MCP composition root vendor-import removal (index.ts, server.ts, core-endpoints.ts, scripts/server-harness.ts); AUTHOR no-vendor-observability-import ESLint rule + RuleTester unit tests + plugin registration."
    status: pending
  - id: arc-b6-plan-body-downstream
    content: "ARC B6 (=WS7): conformance plan body update; high-level-observability-plan substrate inventory."
    status: pending
  - id: arc-b7-docs-adrs
    content: "ARC B7 (=WS8): TSDoc; workspace READMEs; root + app READMEs with cross-app-tracing forward-pointer; governance/operations docs; .env.example files; ADR canonicalising orthogonal-axes; ADR-116/143/162/163 amendments."
    status: pending
  - id: arc-b8-quality-gates
    content: "ARC B8 (=WS9): full quality-gate chain exit 0 including pnpm smoke:dev:no-observability."
    status: pending
  - id: arc-b9-adversarial-review
    content: "ARC B9 (=WS10): full reviewer matrix; release-readiness GO/GO-WITH-CONDITIONS/NO-GO."
    status: pending
  - id: arc-b10-doctrine-graduation
    content: "ARC B10 (=WS11): future-plan citations; archives; mandatory-always doc-and-onboarding-reviewer doctrine graduation; /jc-consolidate-docs."
    status: pending
  - id: arc-c1-pre-merge-divergence
    content: "ARC C1: pre-merge divergence analysis vs origin/main; complex-merge skill; type-check on resolved tree; release-readiness GO."
    status: pending
  - id: arc-c2-push-preview-validation
    content: "ARC C2: push branch; PR opened; Vercel preview validated via Sentry MCP plus Vercel MCP; functional smoke against threads, search, tools, OAuth; release-readiness GO."
    status: pending
  - id: arc-c3-merge-to-main
    content: "ARC C3: owner-authorised merge; post-merge gates; unitOrder SDK alignment lands on main for other working trees."
    status: pending
---

# There Is No Time — Hashed Starfish

**Branch**: `feat/eef_exploration` (30 commits ahead of `origin/main`)
**Owner**: Jim Cresswell
**Authoring session**: Pelagic Washing Anchor (claude-code, claude-opus-4-7-1m, `f730bd…`)
**Status**: APPROVED 2026-05-03 — execution begins ARC A1; coordinating with Misty Ebbing Pier via comms log

---

## Context

The branch carries three converging arcs: an EEF graph-foundation plan estate (committed, awaiting promotion), a Practice-Core portability sweep (landed today, `a471b66c`), and an observability rename from a single-mode `SENTRY_MODE` switch to two orthogonal axes — `OBSERVABILITY_SINKS` (typed list) + `OBSERVABILITY_FIXTURES` (boolean tee). WS0 (plan promotion) and WS1 RED (`a3a0222a`) of the rename have landed.

Three corrections from this session reshape what comes next:

1. **The smoke-test harness is the wrong shape.** Owner direction: the harness should be a simple wrapper that starts the appropriate server, invokes Vitest, then cleans up. The existing tsx-script harness conflates server lifecycle with assertion logic, mutates global `process.env` (debt acknowledged at `apps/oak-curriculum-mcp-streamable-http/smoke-tests/helpers/environment.ts:75-80`), and forces every smoke claim into ad-hoc scripts. Fix the surface, not the symptom.

2. **The failing `dev-server-boots-without-observability-config.e2e.test.ts` is a smoke test, not an E2E test.** It spawns `pnpm dev` and asserts on stdout/stderr — that is smoke by behaviour shape (PDR-039: classify by behaviour, not filename). Its current placement violates testing-strategy.md §"E2E tests MUST NOT spawn additional processes." Reclassification rides on top of (1).

3. **Architecture-reviewer-betty surfaced three structural breaks in the existing observability plan body**: WS3 deletes `SentryEnvSchema` before WS4/WS5 migrate consumers (breaks `dont-break-build-without-fix-plan`); WS4's "work bridges to WS6" language is itself a `replace-don't-bridge` violation; the `no-vendor-observability-import` ESLint rule that WS6 plans to "narrow" does not exist. All three must be repaired before execution.

**Owner load-bearing constraints for this arc:**

- Architectural excellence is absolute (`principles.md § Architectural Excellence Over Expediency`, graduated 2026-05-02). No cheap-cure third option.
- Nothing is deferred, only sequenced. Every "next planning pass" item from the prior session is folded into the right workstream slot.
- The arc spans multiple sessions but it WILL complete. No half-finished implementations.
- Sub-agent reviewers fire throughout to keep the work on the correct path.
- I am the only agent on the repo; stale claims are ignored.

**Intended outcome**: a canonical smoke harness; a vendor-neutral observability config surface; `pnpm dev` boots cleanly with no observability env vars; the upstream `unitOrder` SDK alignment (`9e657ad3`) reaches main; WS2-WS11 land cleanly with reviewer matrix complete; preview build validated; branch merged.

---

## Foundational Corrections (apply throughout)

These corrections are not workstreams — they reshape how every workstream is sequenced and reviewed.

| Correction | Source | Application |
|---|---|---|
| Architectural excellence is absolute | `principles.md` (graduated 2026-05-02) | No "cheap path" surfaced as option; vocabulary trip-list active at output time (*defer*, *next session*, *fast path*, *for later*, *informational not actioned*, *light pass exempts*, *bootstrap fast-path*, *land it then refactor*) |
| Smoke harness is wrong shape | Owner direction this session | ARC A precedes everything else; the existing tsx-script harness is replaced, not extended |
| `replace-don't-bridge` applied to plan language | `architecture-reviewer-betty` finding Q3 | "Work bridges to WS6" language deleted from WS4; WS6 owns composition-root vendor-import removal in full |
| `dont-break-build-without-fix-plan` applied to schema deletion | `architecture-reviewer-betty` finding Q2 | `SentryEnvSchema` deletion withheld until both app consumers migrate; deletion is the FINAL act of WS5, not the FIRST act of WS3 |
| ESLint rule authoring is execution, not narrowing | `architecture-reviewer-betty` finding Q4 | WS6 authors `no-vendor-observability-import` rule itself; the conformance plan body update in WS7 cites the rule as landed, not planned |
| Pre-merge divergence analysis is a named step | `architecture-reviewer-betty` finding Q5 + `.agent/rules/pre-merge-divergence-analysis.md` | ARC C Phase 1 runs the `complex-merge` skill against `main` before push, captures conflict surface, type-checks immediately on resolution |
| Mandatory-always reviewers on Practice changes | Owner doctrine 2026-05-02 (queued for graduation WS11.3) | `docs-adr-reviewer` + `onboarding-reviewer` fire on every workstream that mutates documentation or Practice surfaces |
| Behaviour-shape classification (PDR-039) | testing-strategy.md §E2E test | The smoke regression-guard cannot live in `e2e-tests/` regardless of filename suffix; behaviour is smoke, home is smoke |

---

## Arc Map (sequenced, no deferrals)

```text
ARC A — Smoke-harness redesign            (this branch, this session-arc)
   ↓
ARC B — Observability rename WS2–WS11     (this branch, this session-arc)
   ↓
ARC C — Pre-merge analysis + push + preview validation + merge
   ↓
ARC D — Graph-thread continuation         (separate sessions; thread record `eef.next-session.md`)
ARC E — Practice debt slice               (separate sessions; thread record `agentic-engineering-enhancements.next-session.md`)
```

ARCs D and E are explicitly sequenced as separate session-arcs with their own landing commitments; they are NOT deferred. The thread records are the live continuity surfaces.

---

## ARC A — Smoke-Harness Redesign

**Outcome**: A canonical smoke-test harness that starts the appropriate server, invokes Vitest, and cleans up. Smoke tests become first-class `*.smoke.test.ts` vitest files. Global `process.env` mutation retires. The `dev-server-boots-without-observability-config` regression-guard moves home and stays RED through WS1–WS3 by virtue of the harness's boot-wait timeout. ADR-178 (NEW) records the canonical shape; testing-strategy.md is amended to canonicalise the third vitest category.

**Branch posture**: lands on `feat/eef_exploration` as a coherent prefix of the broader arc.

### A1 — Design and RED

**Tasks**:

- Read existing modes in full: `apps/oak-curriculum-mcp-streamable-http/smoke-tests/{smoke-suite.ts, helpers/environment.ts, helpers/local-server.ts, helpers/server-lifecycle.ts, modes/local-stub.ts, modes/local-stub-env.ts, modes/local-live.ts, modes/local-stub-auth.ts, modes/local-live-auth.ts, modes/remote.ts}`. Capture every assertion the existing tsx-scripted harness makes.
- Author the canonical harness shape at `apps/oak-curriculum-mcp-streamable-http/smoke-tests/harness/run-smoke.ts` (NEW): single function `runSmokeMode(modeConfig)` that (a) composes a hermetic child env via the mode's pure env-builder, (b) spawns the dev server (or in-process app, depending on mode), (c) waits for "listening on port" with mode-specific timeout, (d) injects the bound URL into the vitest invocation env (`SMOKE_BASE_URL`), (e) spawns vitest pointing at the mode's `*.smoke.test.ts` file set, (f) on vitest exit (success or failure) sends SIGTERM and awaits clean exit, (g) returns the vitest exit code as the script exit code.
- Author `vitest.smoke.config.ts` at workspace root: extends `vitest.e2e.config.base.ts`, `include: ['smoke-tests/**/*.smoke.test.ts']`, `exclude: ['**/*.e2e.test.ts', '**/*.unit.test.ts', '**/*.integration.test.ts']`. ADR-amendment scheduled in A4.
- RED tests for the harness itself: `apps/oak-curriculum-mcp-streamable-http/smoke-tests/harness/run-smoke.unit.test.ts` (test the pure env-builder + the boot-signal parser); `apps/oak-curriculum-mcp-streamable-http/smoke-tests/harness/run-smoke.integration.test.ts` (test the lifecycle wrapper with a stub server using simple DI fakes per ADR-078). Both stay RED until A2 GREEN.
- Add `SMOKE_BASE_URL` consumption helper at `smoke-tests/test-helpers/smoke-context.ts` for the new vitest tests to read.

**Reviewer dispatch (post-RED, pre-GREEN)**: `test-reviewer` (test shape), `architecture-reviewer-fred` (boundary discipline: harness vs vitest vs mode-config separation), `architecture-reviewer-betty` (long-term cohesion: does the shape generalise to every existing mode?), `mcp-reviewer` (MCP server boot lifecycle correctness).

**Acceptance**:

- `pnpm exec vitest run smoke-tests/harness/` exits non-zero with expected RED messages
- New harness module exports compile under `pnpm type-check`
- No edits to existing modes yet (A2 owns those)
- Reviewer findings either implemented or rejected with written rationale

### A2 — GREEN: Existing-modes migration

**Tasks** (one mode at a time, each commit individually type-checks):

- Convert `local-stub` mode: extract env-builder to a pure function, delete the `process.env` mutation, route through `runSmokeMode`, convert `smoke-assertions/{health, tools, validation, synonyms, accept-header, handshake, tool-call}` to `*.smoke.test.ts` vitest tests under `smoke-tests/local-stub/`. Each test reads `SMOKE_BASE_URL` and uses standard fetch/Supertest assertions.
- Convert `local-stub-auth` mode: same shape; OAuth helpers in `smoke-tests/auth/` become test-helper imports for the `*.smoke.test.ts` files.
- Convert `local-live` mode (live upstream API; on-demand only).
- Convert `local-live-auth` mode.
- Convert `remote` mode (client-side; the harness invokes vitest pointed at remote URL with no spawn).
- Update `apps/oak-curriculum-mcp-streamable-http/package.json` scripts: each `smoke:dev:*` script invokes `pnpm exec tsx smoke-tests/harness/cli.ts <mode-name>`. Repo-root `package.json` scripts unchanged in shape (still `LOG_LEVEL=debug turbo run smoke:dev:*`).
- Address ADR-078 debt at `smoke-tests/helpers/local-server.ts:32`: `loadRuntimeConfig` receives the mode-built env directly, no `process.env` read. The `restoreEnv`/`captureEnvSnapshot` pattern in `helpers/environment.ts` is deleted as obsolete.

**Reviewer dispatch (per-mode and post-arc)**: `test-reviewer` (every mode), `architecture-reviewer-fred` (boundary: env-builder pure functions, no global state), `code-reviewer` gateway (routes findings).

**Acceptance**:

- Every existing `pnpm smoke:dev:*` script returns the same exit code as before (green when conditions are met)
- `grep -rn "process.env\." apps/oak-curriculum-mcp-streamable-http/smoke-tests/ | grep -v "from package types\|from harness composition root"` returns ZERO matches in test files (the only permitted reads live at the harness composition root per testing-strategy.md §"Smoke composition roots may read ambient env")
- `pnpm type-check` exit 0
- Reviewer findings either implemented or rejected

### A3 — Add the no-observability mode + reclassify the regression-guard

**Tasks**:

- New mode at `apps/oak-curriculum-mcp-streamable-http/smoke-tests/modes/local-no-observability.ts`: hermetic env-builder that excludes ALL `OBSERVABILITY_*`, `SENTRY_*`, `VERCEL_*` keys; injects non-observability dummies (`OAK_API_KEY`, `ELASTICSEARCH_URL`, `ELASTICSEARCH_API_KEY`, `OAK_CURRICULUM_MCP_USE_STUB_TOOLS=true`, `DANGEROUSLY_DISABLE_AUTH=true`, `PORT=0`, `NODE_ENV=development`). The harness's boot-wait timeout enforces "no Sentry / Git SHA / VERCEL_GIT_COMMIT_SHA error" by failing on timeout when those errors fire.
- New `*.smoke.test.ts` at `apps/oak-curriculum-mcp-streamable-http/smoke-tests/local-no-observability/dev-server-operational.smoke.test.ts`: minimal vitest assertions against the running server (`GET /healthz` returns 200 with the canonical `{status: 'ok', mode: 'streamable-http', auth: 'required-for-post'}` body; `GET /healthz` is the universal boot proof per the existing harness pattern). The boot success itself is the load-bearing assertion; vitest's job is to confirm the server is operational once up.
- New pnpm script `smoke:dev:no-observability`: `pnpm exec tsx smoke-tests/harness/cli.ts local-no-observability`.
- Repo-root `package.json` adds `smoke:dev:no-observability` to the turbo dispatch.
- DELETE `apps/oak-curriculum-mcp-streamable-http/e2e-tests/dev-server-boots-without-observability-config.e2e.test.ts` (the test file the owner identified as misclassified).
- Update napkin §RED-arc skip register entry naming the regression-guard's new home (the WS1→WS2 trip-wire shifts: it stays the boot-failure of `pnpm dev` under the legacy `SENTRY_MODE` flow; the harness reports the failure).

**Reviewer dispatch**: `test-reviewer` (validate the mode + smoke test shape against testing-strategy + PDR-039), `mcp-reviewer` (boot-path semantics), `code-reviewer` gateway, **mandatory-always** `docs-adr-reviewer` + `onboarding-reviewer` (testing infrastructure is Practice surface).

**RED state**: `pnpm smoke:dev:no-observability` fails. The harness's boot-wait times out because `pnpm dev` errors with the legacy `SENTRY_MODE`-driven release-resolution failure. This is the WS1→ARC B trip-wire — preserved.

**Acceptance**:

- New mode + smoke test exist
- E2E test file deleted
- `pnpm smoke:dev:no-observability` exits non-zero with the boot-failure signal
- Reviewer findings either implemented or rejected

### A4 — Documentation, ADR, testing-strategy amendment

**Tasks**:

- New ADR at `docs/architecture/architectural-decisions/178-canonical-smoke-test-harness-shape.md` (NUMBER VERIFIED — see verification below) documenting: harness responsibilities (server lifecycle, vitest invocation, cleanup); mode-config shape (pure env-builder + `*.smoke.test.ts` set); env-mutation prohibition; ADR-078 application; relationship to ADR-161 (network-free PR-check vs full-IO smoke).
- Amend `.agent/directives/testing-strategy.md`: canonicalise smoke as the third vitest category; add "Smoke harness invocation IS the composition root" clarification to the §"Smoke composition roots ... may read ambient env" block; add `*.smoke.test.ts` to Canonical Vitest Configuration §Workspaces.
- Author `apps/oak-curriculum-mcp-streamable-http/smoke-tests/README.md`: operator and contributor guide for the harness, mode contract, adding a new mode, the env-mutation prohibition.
- Update `.agent/memory/operational/threads/observability-sentry-otel.next-session.md`: ARC A landing outcome.
- Update `.agent/memory/operational/pending-graduations.md`: graduate the testing-strategy `*.smoke.test.ts` canonicalisation entry.

**ADR number verification before authoring**: `ls docs/architecture/architectural-decisions/ | sort -n | tail -5` to confirm next available number. The pre-existing pending-graduation entry naming "ADR-165 collision" applies to the observability-orthogonality ADR in ARC B; ARC A's ADR is independent. Number prediction is 178 but verify before writing.

**Reviewer dispatch**: **mandatory-always** `docs-adr-reviewer` + `onboarding-reviewer`; `assumptions-reviewer` (reviewers blocking-legitimacy of the harness shape being canonicalised).

**Acceptance**:

- ADR published; testing-strategy.md amended; smoke-tests README written
- `pnpm doc-gen` exit 0; `pnpm markdownlint:root` exit 0
- Thread record + pending-graduations updated
- Reviewer findings either implemented or rejected

---

## ARC B — Observability Rename (WS2–WS11, corrected)

**Outcome**: vendor-neutral observability config surface lands across both apps; the regression-guard `pnpm smoke:dev:no-observability` goes GREEN at WS4 (HTTP atomic rename); ADR-NNN (number verified pre-authoring) is the canonical record for orthogonal-axes; the `no-vendor-observability-import` ESLint rule is real and enforces the vendor-port boundary.

The plan body at `.agent/plans/observability/current/observability-multi-sink-and-fixtures-shape.plan.md` is the source of truth; this section captures the corrections that must be applied before execution and the workstream-level reviewer matrix.

### B0 — Pre-WS2 corrections to the plan body

**Tasks** (single commit, plan body edits only):

- Verify next-available ADR number for observability-orthogonality (the prior plan body said 165; that's taken). Predict 179 but verify with `ls docs/architecture/architectural-decisions/ | sort -n | tail -5` after ARC A4 lands.
- Edit plan body §WS3: tasks include adding `@deprecated` JSDoc to `SentryEnvSchema` BEFORE deletion; deletion is moved out of WS3 entirely and into WS5 close (the FINAL act of the rename arc, after both apps migrate).
- Edit plan body §WS3 to name `OBSERVABILITY_FILE_PATH` env var explicitly in the `superRefine` cross-field rules (file-sink-config-required-when-file-in-sinks).
- Edit plan body §WS3 to ratify `packages/core/observability/src/sink-registry.ts` placement (deviation from the originally-planned `types.ts` location; the deviation is sound — placement supports tree-shaking and clean export surface).
- Edit plan body §WS4: DELETE the line "Update `apps/oak-curriculum-mcp-streamable-http/src/app/core-endpoints.ts` to consume injected `ServerInstrumenter` (work bridges to WS6)". WS4 does NOT touch `core-endpoints.ts`. WS6 owns composition-root vendor-import removal in full.
- Edit plan body §WS4: add `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-build-environment.ts` type-signature update (drop `SENTRY_MODE` from inherited `SentryConfigEnvironment` shape per D7a verification; the field is read at line 23 today as pass-through).
- Edit plan body §WS4: add an explicit logger workstream slot for the `additionalSinks` migration in `packages/libs/logger/src/sink-config.ts` and `packages/libs/logger/src/unified-logger.ts` (currently appears in critical-files list with no completion gate).
- Edit plan body §WS5: deletion of `packages/core/env/src/schemas/sentry.ts` AND deletion of `packages/core/env/tests/schemas/sentry.unit.test.ts` (orphaned by the rename) is the FINAL task of WS5.
- Edit plan body §WS6: tasks include AUTHORING the `no-vendor-observability-import` ESLint rule at `packages/core/oak-eslint/src/rules/no-vendor-observability-import.ts`, plus rule registration in `packages/core/oak-eslint/src/plugin.ts`, plus RuleTester unit tests, plus root ESLint config wire-up. The rule fires on any direct `@sentry/node` / `@sentry/*` import outside the allowlisted file `packages/libs/sentry-node/src/server-instrumenter.ts`.
- Edit plan body §WS7: change "narrows allowlist by 3 entries" to "rule lands; allowlist contains only the sentry-node adapter implementation file".
- Edit plan body §WS7 conformance plan body update: cite `no-vendor-observability-import` as LANDED (not planned).
- Edit plan body §WS8.5: add `docs/operations/environment-variables.md` propagation entry.
- Edit plan body §WS8: add `packages/core/observability/README.md` exports listing.
- Add new §WS9.5 — Pre-merge divergence analysis (see ARC C below; named here so WS sequencing is complete).

**Reviewer dispatch**: `assumptions-reviewer` on the corrections (does the corrected shape carry through cleanly?); **mandatory-always** `docs-adr-reviewer` + `onboarding-reviewer`.

**Acceptance**:

- Plan body reflects all corrections
- `pnpm markdownlint:root` exit 0
- Reviewer findings either implemented or rejected

### B1 (= WS2) — `@oaknational/sentry-node` registry consumption

Per existing plan body §WS2. Atomic rename: delete `SentryMode` type; rewrite `config.ts`, `runtime.ts`, `runtime-sinks.ts` to consume `SinkRegistry`; rename `FixtureSentryStore` → `FixtureCaptureStore`, `FixtureSentryCapture*` → `FixtureCaptureRecord*`; recompose `ParsedSentryConfig` discriminated union from `(sinks.includes('sentry'), fixtures)` cross-product into `{ kind: 'sentry-disabled' | 'sentry-live' | 'sentry-live-with-tee' | 'fixture-only' }`. WS1 RED-arc skip register entries 1 and 2 unskip in this commit.

**Reviewer dispatch**: `type-reviewer` (discriminated-union cross-product correctness; no `as`/`!`/`unknown`), `sentry-reviewer` (vendor semantics preserved; redaction barrier intact), `test-reviewer` (RED→GREEN signal; mocks remain simple), `code-reviewer` gateway, **mandatory-always** `docs-adr-reviewer` + `onboarding-reviewer` (TSDoc on every renamed export).

**Acceptance**: `pnpm test --filter @oaknational/sentry-node` exit 0; `grep -rn "SENTRY_MODE\|SentryMode" packages/libs/sentry-node/` returns zero matches; reviewer findings absorbed.

### B2 (= WS3) — Env-resolution layer (corrected)

Per existing plan body §WS3, with corrections from B0 applied: `SentryEnvSchema` GAINS a `@deprecated` tag but is NOT deleted; `ObservabilityEnvSchema` ships alongside; `superRefine` cross-field rules including the explicit `OBSERVABILITY_FILE_PATH` requirement; warnings-channel addition wired into `resolveEnv` Result.

**Reviewer dispatch**: `type-reviewer` (Zod schema flow; warnings-channel discriminated union), `assumptions-reviewer` (warning-channel design legitimacy), `config-reviewer` (env-var contract surface; rename-replacement error message clarity), `test-reviewer`, `code-reviewer` gateway, **mandatory-always** `docs-adr-reviewer` + `onboarding-reviewer`.

**Acceptance**: `pnpm test --filter @oaknational/env --filter @oaknational/env-resolution` exit 0; `SentryEnvSchema` still type-checks (deprecated but live); both apps still build (consumers unchanged).

### B3 (= WS4) — HTTP MCP atomic rename (corrected, no bridge to WS6)

Per existing plan body §WS4, with B0 corrections: WS4 does NOT touch `core-endpoints.ts`; the build-time `sentry-build-environment.ts` type signature drops `SENTRY_MODE`; the `observe-noauth` carve-out at `operations/development/http-dev-contract.ts:162` is deleted. The `additionalSinks` parallel mechanism in `http-observability.ts` and the logger fan-out workstream both land in this slice.

The smoke regression-guard `pnpm smoke:dev:no-observability` GOES GREEN here.

**Reviewer dispatch**: `architecture-reviewer-fred` (boundary discipline; framework-vs-consumer placement), `architecture-reviewer-wilma` (failure modes: empty registry in production fail-closed; warnings-channel propagation; locality-enforcement edge cases), `sentry-reviewer` (no Sentry-init paths regress), `test-reviewer`, `code-reviewer` gateway, **mandatory-always** `docs-adr-reviewer` + `onboarding-reviewer`.

**Acceptance**: `pnpm test --filter @oak-curriculum-mcp-streamable-http` exit 0; `pnpm smoke:dev:no-observability` exit 0; `grep -rn "SENTRY_MODE" apps/oak-curriculum-mcp-streamable-http/` returns zero matches; reviewer findings absorbed.

### B4 (= WS5) — Search CLI atomic rename + final SentryEnvSchema deletion

Per existing plan body §WS5, with B0 corrections: deletion of `packages/core/env/src/schemas/sentry.ts` and the orphaned test file `packages/core/env/tests/schemas/sentry.unit.test.ts` is the FINAL task of WS5, after the Search CLI's `env.ts` migrates.

**Reviewer dispatch**: `type-reviewer`, `architecture-reviewer-fred`, `test-reviewer`, `code-reviewer` gateway, **mandatory-always** `docs-adr-reviewer` + `onboarding-reviewer`.

**Acceptance**: `pnpm test --filter @oak-search-cli` exit 0; `grep -rn "SentryEnvSchema\|SentryMode" packages/` returns zero matches across the entire monorepo; reviewer findings absorbed.

### B5 (= WS6) — `ServerInstrumenter` port + `no-vendor-observability-import` rule

Per existing plan body §WS6, with B0 corrections: WS6 OWNS composition-root vendor-import removal in full (`apps/oak-curriculum-mcp-streamable-http/src/index.ts`, `src/server.ts`, `src/app/core-endpoints.ts`, `scripts/server-harness.ts`). WS6 also AUTHORS the `no-vendor-observability-import` ESLint rule + RuleTester unit tests + plugin registration + root ESLint config wire-up. Rule allowlist contains exactly one entry: `packages/libs/sentry-node/src/server-instrumenter.ts`.

**Reviewer dispatch**: `architecture-reviewer-fred` (port boundary), `architecture-reviewer-betty` (long-term cohesion of the port shape), `architecture-reviewer-wilma` (failure modes: dynamic imports, side-channel emissions), `type-reviewer`, `mcp-reviewer` (`ServerInstrumenter` composes correctly with MCP server lifecycle), `sentry-reviewer` (vendor-port semantic equivalence with `wrapMcpServerWithSentry`), `config-reviewer` (ESLint rule + plugin registration), `test-reviewer` (RuleTester cases), `code-reviewer` gateway, **mandatory-always** `docs-adr-reviewer` + `onboarding-reviewer`.

**Acceptance**: `pnpm lint` exit 0 with the new rule active; `grep -rn "from '@sentry/" apps/` returns zero matches outside the allowlisted adapter; ADR-162 §Open Question on direct vendor imports closed; reviewer findings absorbed.

### B6 (= WS7) — Plan-body downstream updates

Per existing plan body §WS7. Citing the new rule as landed; `multi-sink-vendor-independence-conformance.plan.md` body update; `high-level-observability-plan.md` substrate inventory update. Reviewer: `docs-adr-reviewer` (mandatory-always).

### B7 (= WS8) — Documentation propagation + ADRs

Per existing plan body §WS8 (8.1 TSDoc, 8.2 workspace READMEs, 8.3 root + app READMEs with cross-app-tracing forward-pointer, 8.4 governance/operations docs, 8.5 .env.example files + `docs/operations/environment-variables.md`, 8.6 ADR-NNN authoring, 8.7 ADR-116/143/162/163 amendments). ADR number verified against repo state pre-authoring per B0.

**Reviewer dispatch**: **mandatory-always** `docs-adr-reviewer` + `onboarding-reviewer` (full audit pass on documentation surfaces); `assumptions-reviewer` (ADR claims hold against landed implementation).

### B8 (= WS9) — Quality gates

Per existing plan body §WS9. Full chain `pnpm clean && sdk-codegen && build && type-check && doc-gen && format:root && markdownlint:root && lint:fix && subagents:check && portability:check && test:root-scripts && test && test:widget && test:e2e && test:ui && test:a11y && test:widget:ui && test:widget:a11y && smoke:dev:stub && smoke:dev:no-observability && practice:fitness:informational && practice:vocabulary` — all exit 0.

### B9 (= WS10) — Adversarial review matrix

Per existing plan body §WS10 reviewer matrix. Plus the WS-by-WS reviewer dispatches above; this gate is the consolidated cross-WS review of the whole arc.

**Mandatory-always reviewers**: `docs-adr-reviewer`, `onboarding-reviewer`.

**Plan-specific matrix** (full pass at this point): `assumptions-reviewer`, `architecture-reviewer-fred`, `architecture-reviewer-betty`, `architecture-reviewer-wilma`, `type-reviewer`, `test-reviewer`, `config-reviewer`, `mcp-reviewer`, `security-reviewer`, `sentry-reviewer`, `code-reviewer`, `release-readiness-reviewer`.

### B10 (= WS11) — Documentation propagation, archives, doctrine graduation

Per existing plan body §WS11 (11.1 spawned plans citing the existing `cross-system-correlated-tracing.plan.md` for forward-pointing; 11.2 archives; 11.3 mandatory-always doc-and-onboarding-reviewer doctrine graduation to `.agent/rules/invoke-doc-and-onboarding-reviewers-on-significant-changes.md` + `distilled.md § Process` pointer + `invoke-code-reviewers.md` matrix update; 11.4 `/jc-consolidate-docs`).

---

## ARC C — Pre-merge analysis, push, preview validation, merge

### C1 — Pre-merge divergence analysis

**Tasks**:

- Apply `.agent/rules/pre-merge-divergence-analysis.md` end-to-end against `feat/eef_exploration` vs `main`.
- Run `complex-merge` skill to capture conflict surface; resolve any conflicts in working tree (no commit yet); type-check immediately after resolution to catch silent post-merge type breaks Git cannot detect.
- Capture finding list: file-by-file conflict report; resolution decisions; any latent breakage.
- Write merge-prep report to `.agent/memory/operational/threads/observability-sentry-otel.next-session.md` for audit trail.

**Reviewer dispatch**: `architecture-reviewer-fred` (boundary integrity post-merge), `code-reviewer` gateway, `release-readiness-reviewer`.

**Acceptance**: zero unresolved conflicts; `pnpm type-check` exit 0 on the merged tree; reviewer GO or GO-WITH-CONDITIONS.

### C2 — Push and preview validation

**Tasks**:

- Push branch to `origin/feat/eef_exploration` (force push allowed only with explicit owner authorisation per the recent destructive-action incident; otherwise standard push).
- Open PR if not already; description references this plan and the reviewer matrix.
- Vercel preview build kicks off automatically.
- Validate preview per the Sharded Stroustrup / Vining Ripening Leaf pattern: Sentry MCP confirms release rows (`poc-oak-open-curriculum-mcp-git-feat-eef-exploration` or current alias); Vercel MCP confirms build READY; MCP HTTP endpoints respond; `GET /healthz` returns operational; trace correlation working.
- Test preview against owner-named functionality: threads endpoint with new `unitOrder`-removed schema; search functionality; tool catalogue; OAuth flow if scoped; rate-limiting headers.

**Reviewer dispatch**: `release-readiness-reviewer` (preview validation evidence sufficient for merge gate); `security-reviewer` (no new exposed surfaces); `mcp-reviewer` (protocol compliance).

**Acceptance**: preview build green; functional smoke complete; reviewer GO.

### C3 — Merge to main

**Tasks**:

- Owner-authorised merge of PR.
- Confirm post-merge gates green on `main`.
- The upstream `unitOrder` SDK alignment (commit `9e657ad3`) lands on main as part of the merge bundle, becoming available to other working trees.

**Acceptance**: `main` HEAD reflects the merge; CI green; PR closed; thread record updated.

---

## ARC D and E — Sequenced separately

These ARCs are explicitly out-of-scope for the present session-arc but are sequenced as concrete continuations. They are NOT deferred — they have named landing commitments in their thread records.

### ARC D — Graph-thread continuation (separate sessions)

Owner: `eef.next-session.md`. Sequenced steps:

1. Increment 1 (graph-query-layer) promotes to ACTIVE: tracer matrix sign-off (17 of 21 cells); plan-body first-principles check on tracer shapes; Increment 2 ready for parallel start.
2. Producer-output-not-immutable doctrine ratification (pending-graduations 2026-05-01): amendment to `principles.md § Cardinal Rule` extending single-source discipline to generator-emitted *structure*; sibling `@oaknational/graph-tools` workspace sketched in `future/graph-tools-workspace.plan.md`.
3. Increment 2 (eef-evidence-corpus) ACTIVE on Increment 1 ACTIVE + fresh upstream EEF data check + conservation map sign-off.
4. Increment 3 (cross-source-journeys) CURRENT on real teacher question evidence.

### ARC E — Practice debt slice (separate sessions)

Owner: `agentic-engineering-enhancements.next-session.md`. Sequenced steps (NOT exhaustive of the pending-graduations register; these are the load-bearing blockers):

1. `apply-don't-ask` reformulation under empirical-answerability framing (quarantined; owner-authorised reformulation owed).
2. `stop inventing optionality` decomposition into three rules (decision / design / outcome optionality) with distinct impacts.
3. CLI ergonomics plan promotion `future/` → `current/`: `agent-coordination-cli-ergonomics-and-request-correlation.plan.md` (third + fourth-instance evidence landed).
4. Markdown shared-state collision-safety design (routes to `collaboration-state-domain-model-and-comms-reliability.plan.md`).
5. Mandatory-always doc-and-onboarding-reviewer rule (graduates IN ARC B10 / WS11.3 — sequenced inside this arc, not separate).

---

## Critical Files

### ARC A (smoke-harness redesign)

- `apps/oak-curriculum-mcp-streamable-http/smoke-tests/harness/run-smoke.ts` — NEW (canonical harness)
- `apps/oak-curriculum-mcp-streamable-http/smoke-tests/harness/cli.ts` — NEW (mode-name dispatcher)
- `apps/oak-curriculum-mcp-streamable-http/smoke-tests/harness/run-smoke.unit.test.ts` — NEW (RED → GREEN A1/A2)
- `apps/oak-curriculum-mcp-streamable-http/smoke-tests/harness/run-smoke.integration.test.ts` — NEW
- `apps/oak-curriculum-mcp-streamable-http/vitest.smoke.config.ts` — NEW
- `apps/oak-curriculum-mcp-streamable-http/smoke-tests/modes/local-no-observability.ts` — NEW (A3)
- `apps/oak-curriculum-mcp-streamable-http/smoke-tests/local-no-observability/dev-server-operational.smoke.test.ts` — NEW (A3)
- `apps/oak-curriculum-mcp-streamable-http/smoke-tests/local-stub/{health,tools,validation,...}.smoke.test.ts` — NEW (A2 conversion targets)
- `apps/oak-curriculum-mcp-streamable-http/smoke-tests/README.md` — NEW (A4)
- `apps/oak-curriculum-mcp-streamable-http/e2e-tests/dev-server-boots-without-observability-config.e2e.test.ts` — DELETE (A3)
- `apps/oak-curriculum-mcp-streamable-http/smoke-tests/helpers/environment.ts` — DELETE or rewrite (A2; remove env-mutation pattern)
- `apps/oak-curriculum-mcp-streamable-http/smoke-tests/smoke-suite.ts` — REWRITE or DELETE (A2; superseded by harness)
- `apps/oak-curriculum-mcp-streamable-http/smoke-tests/{smoke-dev-stub.ts, smoke-dev-auth.ts, smoke-dev-live.ts, smoke-dev-live-auth.ts, smoke-remote.ts}` — REWRITE (delegate to harness CLI)
- `apps/oak-curriculum-mcp-streamable-http/package.json` — script updates
- `package.json` (root) — `smoke:dev:no-observability` script + turbo dispatch
- `docs/architecture/architectural-decisions/178-canonical-smoke-test-harness-shape.md` (NUMBER VERIFY) — NEW (A4)
- `.agent/directives/testing-strategy.md` — amend (A4)

### ARC B (per existing plan body §Critical Files To Modify, with B0 corrections)

See `.agent/plans/observability/current/observability-multi-sink-and-fixtures-shape.plan.md §Critical Files To Modify` for the complete list. Corrections per B0:

- `packages/core/env/src/schemas/sentry.ts` — DELETE moves from WS3 to **WS5 close**
- `packages/core/env/tests/schemas/sentry.unit.test.ts` — DELETE at **WS5 close** (orphaned)
- `apps/oak-curriculum-mcp-streamable-http/src/app/core-endpoints.ts` — moves from WS4 to **WS6**
- `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-build-environment.ts` — type-signature update added to **WS4**
- `packages/libs/logger/src/sink-config.ts` + `packages/libs/logger/src/unified-logger.ts` — explicit slot in **WS4**
- `packages/core/oak-eslint/src/rules/no-vendor-observability-import.ts` — NEW in **WS6** (rule authoring)
- `packages/core/oak-eslint/src/rules/no-vendor-observability-import.unit.test.ts` — NEW in **WS6**
- `packages/core/oak-eslint/src/plugin.ts` — rule registration in **WS6**

### ARC C (merge prep + merge)

- `.agent/memory/operational/threads/observability-sentry-otel.next-session.md` — landing-outcome update
- `.agent/memory/operational/repo-continuity.md` — refresh
- `.agent/memory/operational/pending-graduations.md` — ARC A doctrine entry; ARC B WS11.3 graduation marker

---

## Verification (post-landing)

```bash
# 1. Smoke harness shape (ARC A)
pnpm exec vitest run apps/oak-curriculum-mcp-streamable-http/smoke-tests/harness/
# expected: exit 0
pnpm smoke:dev:stub                  # existing modes still pass under new harness
pnpm smoke:dev:no-observability      # new mode passes after WS4
# expected: both exit 0

# 2. No observability legacy references (ARC B close)
grep -rn "SENTRY_MODE\|SentryMode\|SentryEnvSchema\|FixtureSentryStore" . \
  --exclude-dir=node_modules --exclude-dir=.git \
  --exclude-dir=archive --exclude-dir=dist
# expected: zero matches outside historical ADR §History entries

# 3. Vendor-import boundary (ARC B WS6)
grep -rn "from '@sentry/" apps/ packages/
# expected: zero matches outside packages/libs/sentry-node/src/server-instrumenter.ts

# 4. Fresh-checkout dev boot (ARC B WS4 GREEN)
cd apps/oak-curriculum-mcp-streamable-http
unset $(env | grep -E '^(OBSERVABILITY_|SENTRY_|VERCEL_)' | cut -d= -f1)
timeout 30 pnpm dev
# expected: server listening; no Sentry errors

# 5. Full quality-gate chain (ARC B WS9)
pnpm clean && pnpm sdk-codegen && pnpm build && pnpm type-check && \
  pnpm doc-gen && pnpm format:root && pnpm markdownlint:root && \
  pnpm lint:fix && pnpm subagents:check && pnpm portability:check && \
  pnpm test:root-scripts && pnpm test && pnpm test:widget && \
  pnpm test:e2e && pnpm test:ui && pnpm test:a11y && \
  pnpm test:widget:ui && pnpm test:widget:a11y && \
  pnpm smoke:dev:stub && pnpm smoke:dev:no-observability && \
  pnpm practice:fitness:informational && pnpm practice:vocabulary
# expected: all exit 0

# 6. Pre-merge divergence analysis (ARC C1)
git fetch origin main
git merge --no-commit --no-ff origin/main || true   # surface conflicts without committing
pnpm type-check                                     # post-resolution
git merge --abort                                   # reset for the actual PR merge
# expected: known conflicts resolved with type-check exit 0

# 7. Preview validation (ARC C2)
# Use Sentry MCP + Vercel MCP to confirm release rows + build READY + healthz operational
```

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| ARC A harness redesign reveals deeper coupling in existing modes (e.g. shared state in `local-server.ts`) | Medium | Medium | A1 reviewer dispatch includes `architecture-reviewer-fred` to surface coupling early; A2 mode-by-mode conversion isolates fallout |
| WS3 schema deletion timing creates type-check break (architecture-reviewer-betty Q2) | High → Mitigated | High | B0 correction moves deletion to WS5 close; per-commit type-check survives |
| WS4 attempts to inject port that doesn't exist (architecture-reviewer-betty Q3) | High → Mitigated | High | B0 correction strips composition-root work from WS4; WS6 owns full vendor-import removal |
| `no-vendor-observability-import` rule does not exist; WS6 narrows nothing (architecture-reviewer-betty Q4) | High → Mitigated | High | B0 correction makes WS6 author the rule; conformance plan body cites it as landed |
| 30-commit divergence at merge produces silent post-merge breaks (architecture-reviewer-betty Q5) | Medium | High | ARC C1 named pre-merge divergence analysis; type-check on resolved tree; release-readiness-reviewer GO required |
| ADR number collision (165 already taken; predicted 178/179 may also be taken) | Low | Low | B0 + A4 require number verification with `ls docs/architecture/architectural-decisions/ \| sort -n \| tail -5` immediately before authoring |
| Smoke harness redesign retires the existing `smoke:dev:stub` lane mid-arc, breaking CI | Low | High | A2 mode-by-mode conversion preserves green for each mode at every commit; root-script `smoke:dev:stub` continues to work because the underlying CLI path is preserved by the new harness |
| Logger `additionalSinks` migration was a critical-files-list-only mention with no completion gate (architecture-reviewer-betty Q6) | Mitigated | Medium | B0 correction adds explicit slot in WS4 with reviewer dispatch |
| Practice surfaces touched without mandatory-always reviewers firing | Mitigated | High | Mandatory-always reviewer pair (`docs-adr-reviewer` + `onboarding-reviewer`) named in EVERY workstream that mutates docs or Practice |
| Owner correction mid-arc invalidates a workstream's framing (rush-impulse anti-pattern surfacing) | Medium | Medium | Vocabulary trip-list at output time; `assumptions-reviewer` periodic dispatch; first-principles re-check at every WS boundary |
| Quarantined doctrines (`apply-don't-ask`, `stop inventing optionality`) accidentally re-applied | Medium | High | Both quarantined; ARC E owns reformulation; reviewers dispatch with full quarantine note in briefs |

---

## Reviewer Matrix (overall)

| Reviewer | Where it fires | What it judges |
|---|---|---|
| `assumptions-reviewer` | ARC A1, B0, B7, B9 | Proportionality; build-vs-buy attestation; blocking legitimacy |
| `architecture-reviewer-fred` | ARC A1, A2, B3, B5, C1 | ADR compliance; layer separation; framework-vs-consumer placement |
| `architecture-reviewer-betty` | ARC A1, B5 | Long-term cohesion; change-cost trade-offs |
| `architecture-reviewer-wilma` | ARC B3, B5 | Adversarial: failure modes that bypass the rename |
| `type-reviewer` | ARC B1, B2, B5 | Discriminated-union shapes; no `as`/`!`/`unknown`; warnings-channel typing |
| `test-reviewer` | ARC A1, A2, A3, B1, B3, B4, B5 | TDD discipline; no skipped tests; mock simplicity; behaviour-shape classification |
| `config-reviewer` | ARC B2, B5 | Env-var contract; ESLint rule; rename-replacement message clarity |
| `mcp-reviewer` | ARC A1, A3, B5 | MCP server boot lifecycle; `ServerInstrumenter` composition |
| `security-reviewer` | ARC B2, B3, C2 | Trust-boundary; redaction-bypass paths; preview surface exposure |
| `sentry-reviewer` | ARC B1, B3, B5 | Vendor semantics; redaction barrier; port equivalence |
| `code-reviewer` | every WS | Gateway; routes to specialists; friction-ratchet |
| `docs-adr-reviewer` | **MANDATORY-ALWAYS** every WS that touches docs or Practice | ADR/README/TSDoc accuracy and completeness |
| `onboarding-reviewer` | **MANDATORY-ALWAYS** every WS that touches docs or Practice | Discoverability; first-success speed; freshness |
| `release-readiness-reviewer` | ARC B9, C1, C2 | GO / GO-WITH-CONDITIONS / NO-GO across full quality-gate chain |

---

## Hand-off Substance (updated continuously throughout the arc)

These surfaces are touched at workstream boundaries to keep the arc continuity-preserving across sessions:

- `.agent/memory/operational/threads/observability-sentry-otel.next-session.md` — landing target updates after each ARC closure; identity row maintained per PDR-027 additive rule.
- `.agent/memory/operational/pending-graduations.md` — ARC A queues a graduation entry for testing-strategy `*.smoke.test.ts` canonicalisation; ARC B11.3 graduates the mandatory-always doc-and-onboarding-reviewer doctrine.
- `.agent/memory/operational/repo-continuity.md` — refresh per session-handoff convention.
- `.agent/memory/active/napkin.md` — surprise capture; this plan's authoring is itself a worked instance of the new architectural-excellence absolute principle (graduated 2026-05-02).
- `.agent/state/collaboration/active-claims.json` — claim opened at start of each execution session, closed at session-handoff.

---

## Plan Exit — What Closes

**On ARC C3 merge**:

- ADR-162 §Open Question on `wrapMcpServerWithSentry` direct vendor import (closes via WS6)
- The implicit dual sink-configuration mechanism (file-sink folded into registry per D8)
- The local-dev `pnpm dev` regression (closes via WS4)
- The smoke-harness shape question (closes via ARC A)
- Two pending-graduation entries: testing-strategy `*.smoke.test.ts` canonicalisation; mandatory-always doc-and-onboarding-reviewer rule

**Worked instance**: this plan is the worked instance of `principles.md § Architectural Excellence Over Expediency` (graduated 2026-05-02) AND of the smoke-harness-shape correction owner-named in this session. On landing, add a pointer back from `distilled.md § Process` graduation entries to this plan as the worked-instance evidence.

**Out of scope for this plan** (sequenced separately, not deferred):

- Producer-output-not-immutable doctrine (ARC D)
- `apply-don't-ask` reformulation (ARC E)
- `stop inventing optionality` decomposition (ARC E)
- CLI ergonomics plan promotion (ARC E)
- Markdown shared-state collision safety design (ARC E)
- Producer-output graph-tools workspace (ARC D)

These each have a thread record naming them; their landing commitments are explicit in those records.
