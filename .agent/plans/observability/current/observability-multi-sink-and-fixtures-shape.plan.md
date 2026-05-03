---
name: "Observability Multi-Sink and Fixture Orthogonality"
overview: >
  Replace today's single `SENTRY_MODE = off | fixture | sentry` switch with two
  orthogonal axes — `OBSERVABILITY_SINKS` (typed list of external sink targets;
  stdout via `@oaknational/logger` is the always-implicit baseline) and
  `OBSERVABILITY_FIXTURES` (orthogonal fixture-as-tee boolean). The shape is the
  structural cure for the local-dev `pnpm dev` failure surface in
  `apps/oak-curriculum-mcp-streamable-http`, and the architectural seam
  ADR-162's three-sink topology, ADR-143's coherent fan-out, and ADR-160's
  redaction barrier all already presuppose. Atomic rename across six workspaces;
  no compatibility layer, no transitional alias, no cheap-fix path. Includes a
  new ADR-165 as the canonical decision record for the orthogonal-axes shape,
  amendments to ADR-116/143/162/163, and full documentation propagation across
  the root README, both app READMEs, governance and operations docs, and inline
  TSDoc.
status: current
isProject: true
todos:
  - id: ws0-promote-and-archive
    content: "WS0 (PRELUDE): copy this plan into .agent/plans/observability/current/observability-multi-sink-and-fixtures-shape.plan.md; archive the wrong-shaped predecessor (local-dev-sentry-boundary-regression-investigation) and the superseded future-plan (observability-config-coherence) to archive/superseded/ with single-line linking notes; update active-plans index."
    status: done
  - id: ws1-red-types-and-regression-guard
    content: "WS1 (RED): author OBSERVABILITY_SINKS / OBSERVABILITY_FIXTURES Zod schema + SinkRegistry type + fixture-as-tee fan-out + cross-field superRefine in @oaknational/observability and @oaknational/env. Author the outermost regression-guard E2E (`pnpm dev boots clean with no observability env vars`) and per-layer RED tests. Verify build-time orthogonality assumption by reading sentry-build-environment.ts end-to-end. All tests fail for the right reasons."
    status: done
  - id: ws2-green-sentry-node
    content: "WS2 (GREEN): rewrite @oaknational/sentry-node internals to consume SinkRegistry. Delete SentryMode type. Rename FixtureSentryStore → FixtureCaptureStore (vendor-neutral). Recompose ParsedSentryConfig discriminated union from cross-product of (sinks.includes('sentry'), fixtures). All sentry-node tests pass."
    status: pending
  - id: ws3-green-env-layer
    content: "WS3 (GREEN): delete SentryEnvSchema; ship ObservabilityEnvSchema with sinks + fixtures + locality+DSN superRefine. Add warnings field to resolveEnv Result. Hard error on legacy SENTRY_MODE with rename-replacement message. Fold MCP_LOGGER_FILE_* into the registry (file-sink as registry entry); old MCP_LOGGER_* env vars rejected. @oaknational/env tests pass."
    status: pending
  - id: ws4-green-http-app-atomic-rename
    content: "WS4 (GREEN): atomic rename across HTTP MCP server — env.ts, runtime-config.ts, observability/http-observability.ts, app/core-endpoints.ts, operations/development/http-dev-contract.ts (delete observe-noauth carve-out), build-scripts/sentry-build-environment.ts (verify or migrate), smoke-tests/modes/local-stub-env.ts, e2e-tests/helpers/test-config.ts, .env.example. Outermost regression-guard E2E goes GREEN here."
    status: pending
  - id: ws5-green-search-cli-atomic-rename
    content: "WS5 (GREEN): atomic rename across Search CLI — observability/cli-observability.ts, bin/oaksearch.ts, src/lib/env.ts (+ tests), src/lib/logger.ts (registerAdditionalSink path), .env.example."
    status: pending
  - id: ws6-green-server-instrumenter-port
    content: "WS6 (GREEN): introduce ServerInstrumenter port in @oaknational/observability; sentry-node implements it; HTTP MCP composition root consumes injected port (removes wrapMcpServerWithSentry + setupExpressErrorHandler direct vendor imports). ESLint no-vendor-observability-import allowlist narrows. ADR-162 §Open Question on direct vendor imports closed."
    status: pending
  - id: ws7-conformance-plan-body-update
    content: "WS7: edit body of multi-sink-vendor-independence-conformance.plan.md to reference OBSERVABILITY_SINKS=[] in place of SENTRY_MODE=off; update .agent/plans/observability/high-level-observability-plan.md substrate inventory."
    status: pending
  - id: ws8-refactor-docs-and-adrs
    content: "WS8 (REFACTOR — DOCS & ADRS): TSDoc on all new types and ports; READMEs (@oaknational/observability, @oaknational/sentry-node, @oaknational/logger, @oaknational/env, @oaknational/env-resolution) plus root README and both app READMEs (with cross-app distributed tracing forward-pointer in Search CLI README); docs/governance/logging-guidance.md update; docs/operations/sentry-deployment-runbook.md update; new ADR-165 (Observability Configuration Orthogonality); ADR-116, ADR-143, ADR-162, ADR-163 amendments."
    status: pending
  - id: ws9-quality-gates
    content: "WS9: full quality-gate chain (pnpm clean && sdk-codegen && build && type-check && doc-gen && format:root && markdownlint:root && lint:fix && subagents:check && portability:check && test:root-scripts && test && test:widget && test:e2e && test:ui && test:a11y && test:widget:ui && test:widget:a11y && smoke:dev:stub && practice:fitness:informational && practice:vocabulary). Exit 0."
    status: pending
  - id: ws10-adversarial-review
    content: "WS10: invoke specialist reviewers per matrix (assumptions-reviewer, sentry-reviewer, architecture-reviewer-fred + wilma + betty, type-reviewer, test-reviewer, config-reviewer, mcp-reviewer, security-reviewer, code-reviewer gateway, docs-adr-reviewer, onboarding-reviewer, release-readiness-reviewer). Implement findings unless rejected with rationale per principles.md."
    status: pending
  - id: ws11-doc-propagation-and-spawned-plans
    content: "WS11: cite existing future/cross-system-correlated-tracing.plan.md from the Search CLI README forward-pointer note (no new plan needed; existing plan covers MCP↔SDK↔upstream API↔ES correlation); spawn future/config-management-platform-evaluation.plan.md (carry-over from WS-E of the superseded future-plan); graduate the mandatory-always doc-and-onboarding reviewer doctrine to a permanent rule (per owner direction 2026-05-02); run /jc-consolidate-docs."
    status: pending
---

# Observability Multi-Sink and Fixture Orthogonality

**Last Updated**: 2026-05-03
**Status**: 🟡 IN PROGRESS — WS0 (`e1840631`) and WS1 RED phase
(`a3a0222a`) landed; WS2 (sentry-node `SinkRegistry` consumption) is the
next-session landing target
**Lifecycle target**: `current/` → `active/` on WS2 commit (deferred from
WS1; the RED-only WS1 was committed in `current/` because the executable
work is now multi-session and the `active/` move is more meaningful when
the first GREEN code lands)
**Branch**: `feat/eef_exploration` (RED arc landed on the existing branch
to stay aligned with the broader 2026-05-02 owner roadmap; future
considerations of a dedicated `feat/observability-multi-sink` branch
remain open per WS9 quality-gate breadth)
**Thread**: `observability-sentry-otel`

---

## Plan-File Promotion (WS0 — PRELUDE)

This plan file lives at the harness-mandated location while plan mode is
active. The first executed step on plan exit is to copy it into the repo
plan tree:

```bash
# WS0 — promotion path
cp /Users/jim/.claude/plans/please-create-a-plan-compressed-newt.md \
   .agent/plans/observability/current/observability-multi-sink-and-fixtures-shape.plan.md
```

The repo path becomes the canonical location; the harness copy is then
disposable.

## User Value

Operators get an observability config surface that matches the mental
model — *"which external sinks am I emitting to, and am I capturing
fixtures for tests?"* — instead of a single overloaded mode switch
that silently couples destination and isolation. Local development
boots cleanly without Sentry env vars by construction, not by an
env-var workaround. Future warehouse and PostHog sinks add to the
list as data, not as new mode values. The fixture surface is
vendor-neutral by name and shape, so non-Sentry sink-coverage tests
do not have to fight a Sentry-named type.

## Context

`pnpm dev` from `apps/oak-curriculum-mcp-streamable-http` currently fails
with *"Git SHA is required for Sentry release resolution but
VERCEL_GIT_COMMIT_SHA is not set"*. Root cause:

1. Default `SENTRY_MODE` when unset is `'off'` and short-circuits in
   `packages/libs/sentry-node/src/config.ts:46` before any release
   resolution.
2. Local `.env.local` files commonly set `SENTRY_MODE=sentry`; the dev
   server scrubs Vercel signals
   (`apps/oak-curriculum-mcp-streamable-http/operations/development/http-dev-contract.ts:151–155`)
   but does NOT override `SENTRY_MODE`.
3. Runtime then falls past the `off` short-circuit into
   `resolveSentryRelease` → `resolveGitSha` → `missing_git_sha` error
   (verbatim text emitted from
   `packages/libs/sentry-node/src/runtime-error.ts:74`).
4. The `observe-noauth` mode hard-codes `SENTRY_MODE: 'off'` at
   `http-dev-contract.ts:162`; `dev` mode does not. The asymmetry is
   the proximate symptom; the deeper issue is that `SENTRY_MODE`
   conflates **sink target selection** with **fixture-vs-live capture**
   into one switch.

The cheap cure ("set `SENTRY_MODE=off` in `.env.local`" or "hard-code
`SENTRY_MODE=off` in `dev` mode") is categorically excluded by
[`principles.md § Architectural Excellence Over Expediency`](../../../.agent/directives/principles.md#architectural-excellence-over-expediency)
(graduated 2026-05-02 from the rush-impulse-as-entropy-generator
napkin entry). The structural cure — orthogonal axes — is the only
path on the table.

This plan supersedes
[`future/observability-config-coherence.plan.md`](../future/observability-config-coherence.plan.md)
(strategic brief) and replaces
[`current/local-dev-sentry-boundary-regression-investigation.plan.md`](./local-dev-sentry-boundary-regression-investigation.plan.md)
(wrong-framed predecessor — diagnosed the bug correctly but framed the
cure too narrowly).

## Design Decisions

The seven design questions surfaced during planning are decided
inside this plan. The decisions are summarised here; reasoning lives
in the dispatched-plan-agent transcript and is preserved by reference
in WS1's design-record commit body.

| # | Question | Decision |
|---|---|---|
| D1 | Fixtures: orthogonal switch vs sink kind? | **Orthogonal switch.** Fixtures are a tee that observes post-redaction events bound for the configured sinks; they are not themselves a destination. Coding fixtures as a sink would force "fixture vs sentry" mutual exclusion or duplicate-fan-out. ADR-160 boundary semantics confirm: fixtures live downstream of redaction, upstream of nothing. |
| D2 | Naming: `OBSERVABILITY_SINKS` vs `OBSERVABILITY_EXTERNAL_SINKS`; stdout in list vs implicit? | **`OBSERVABILITY_SINKS`, stdout implicit.** ADR-162's vendor-independence clause makes stdout always-on. Operators cannot disable it; exposing it in the list would create a false config surface. The list is *additional external sinks on top of the always-on baseline*. Documented in TSDoc and ADR-162 amendment. |
| D3 | Migration sequencing across workspaces? | **Atomic rename per call-graph slice.** RED tests + outermost regression guard land in WS1 across the whole stack; per-package GREEN slices land WS2-WS6. Each commit individually passes `pnpm type-check` per `dont-break-build-without-fix-plan`. No transitional flag (per `replace-don't-bridge`). |
| D4 | Include WS-D (`ServerInstrumenter` port) in this plan? | **Yes.** Resolves ADR-162 §Open Question. Bundles the `wrapMcpServerWithSentry` + `setupExpressErrorHandler` direct-import gap. Architectural excellence at all layers in one coherent change. |
| D5 | Touch the conformance test plan? | **Yes — body edit.** `multi-sink-vendor-independence-conformance.plan.md` references `SENTRY_MODE=off`; rename it to `OBSERVABILITY_SINKS=[]` in the plan body. The conformance test *implementation* lands when that plan executes; this plan's responsibility is to update the contract pointer. |
| D6 | Disposition of wrong-shaped predecessor? | **Archive to `archive/superseded/`** with single-line linking note (`Superseded 2026-05-02 by observability-multi-sink-and-fixtures-shape — the cure is structural, not local-dev-specific`). Per `version with git, not with names`. |
| D7a | Build-time `sentry-build-plugin.ts` orthogonality? | **Verify at WS1 by reading `sentry-build-environment.ts` end-to-end.** If the build-time path consults `SENTRY_MODE`, scope expands to include build-time rename in WS4. If purely Vercel-signal + auth-token gated, it stays orthogonal. Decision rule: don't assume; the test is the read. |
| D7b | `observability-events-workspace` dependency? | **No dependency.** Schemas are orthogonal to sink selection. Conformance test (D5) depends on events workspace, but that's a downstream concern handled by the conformance plan body update only. |

Additional decisions (Plan-agent identified blind spots):

| # | Question | Decision |
|---|---|---|
| D8 | File-sink (`MCP_LOGGER_FILE_PATH`) folding into registry? | **Yes — fold.** Otherwise WS-A only renames *half* of the dual mechanism. `OBSERVABILITY_SINKS=['sentry','file']` is valid; old `MCP_LOGGER_FILE_*` env vars rejected with rename-replacement message. |
| D9 | Locality enforcement strength (preview/production with empty sinks)? | **Warn in preview, fail-closed in production.** Production with `OBSERVABILITY_SINKS=[]` is a misconfiguration ADR-162 should refuse to boot through. Preview with empty sinks is a deliberate dev-mode shape. Encoded in `superRefine` cross-field with `VERCEL_ENV`. |
| D10 | Warnings channel shape on `resolveEnv`? | **Sibling `warnings` field on success Result.** Additive; non-warning consumers compile-clean. Extends existing `Result<T, E>` pattern without breaking it. |
| D11 | Helper placement (`composeWithSinkConfiguration`)? | **Shared `@oaknational/env`.** Generic over mode discriminator. Sentry uses it; warehouse/PostHog will reuse the shape. Satisfies Context Specificity Gradient. |
| D12 | New ADR vs amendments only? | **New ADR-165 (`Observability Configuration Orthogonality`)** PLUS amendments to ADR-116/143/162/163. The orthogonal-axes shape is reusable across every future sink and capability per PDR-019; a single coherent decision record beats four scattered amendments. The amendments cite ADR-165 as canonical. |

## Disposition of Existing Plans

| Plan | Action | Path after WS0/WS11 |
|---|---|---|
| `future/observability-config-coherence.plan.md` | **Superseded** — its WS-A/B/C/D become this plan's WS-2…6 | `archive/superseded/observability-config-coherence.plan.pre-orthogonal-axes-2026-05-02.md` |
| `current/local-dev-sentry-boundary-regression-investigation.plan.md` | **Superseded** — wrong frame; replaced structurally | `archive/superseded/local-dev-sentry-boundary-regression-investigation.plan.pre-shape-fix-2026-05-02.md` |
| `current/multi-sink-vendor-independence-conformance.plan.md` | **Body update only** — `SENTRY_MODE=off` → `OBSERVABILITY_SINKS=[]` | unchanged path; status unchanged |
| `active/sentry-observability-maximisation-mcp.plan.md` | **No change** — consumes the registry but doesn't drive it | unchanged |
| `future/sentry-observability-maximisation.plan.md` | **No change** | unchanged |
| `high-level-observability-plan.md` | **Index update** — rename in substrate inventory | unchanged path |
| `future/cross-system-correlated-tracing.plan.md` | **CITED, NOT DUPLICATED** — existing plan already covers MCP↔SDK↔upstream API↔ES correlation; the Search CLI README forward-pointer references this plan | unchanged path |
| `future/config-management-platform-evaluation.plan.md` | **NEW STUB** — WS-E carry-over from superseded future-plan | new file, see WS11 |

## Workstream Structure

### WS0 — PRELUDE: Plan-file promotion and predecessor archiving

**Outcome**: This plan is at its canonical repo path; superseded plans
are archived; active-plans index reflects the change.

**Tasks**:

- Copy the harness-located plan into
  `.agent/plans/observability/current/observability-multi-sink-and-fixtures-shape.plan.md`
- Archive the two superseded plans to
  `.agent/plans/observability/archive/superseded/` with single-line
  linking notes
- Update `.agent/plans/observability/current/README.md` and
  `.agent/plans/observability/future/README.md` indices
- Update `.agent/memory/operational/threads/observability-sentry-otel.next-session.md`
  landing target

**Acceptance**: `git ls-files .agent/plans/observability/current/` shows
the new plan; `archive/superseded/` shows both predecessor plans;
indices are accurate.

### WS1 — RED: Types, schemas, and outermost regression guard

**Outcome**: Every test that should fail when the rename has not
landed is in place and failing for the right reason. The schemas and
types exist as production code (not test-only stubs); consumers
are stub'd to compile only.

**Tasks**:

- Read `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-build-environment.ts`
  end-to-end (verify D7a — build-time orthogonality assumption)
- Author `OBSERVABILITY_SINKS` Zod schema (array of literal `'sentry' | 'file'`,
  extensible for future `'warehouse' | 'posthog'`) in
  `packages/core/env/src/schemas/observability.ts`
- Author `OBSERVABILITY_FIXTURES` Zod schema (boolean) in same file
- Author `ObservabilityEnvSchema` composition with cross-field
  `superRefine`: enforces (i) DSN-required-when-sentry-in-sinks,
  (ii) production-without-remote-sink-is-error, (iii) preview-without-remote-sink-is-warning,
  (iv) legacy-`SENTRY_MODE`-or-`MCP_LOGGER_*`-set-is-rename-replacement-error,
  (v) file-sink-config-required-when-file-in-sinks
- Author `SinkRegistry` type and `ServerInstrumenter` port in
  `packages/core/observability/src/types.ts`
- Extend `resolveEnv` Result success path with `warnings: EnvWarning[]`
  in `packages/libs/env-resolution/src/resolve-env.ts`
- Author the outermost regression-guard E2E test
  `apps/oak-curriculum-mcp-streamable-http/e2e-tests/dev-server-boots-without-observability-config.e2e.test.ts`
  (asserts `pnpm dev` from a fresh-shell environment with no
  `OBSERVABILITY_*`, `SENTRY_*`, or `VERCEL_*` env vars boots cleanly
  within 30s and exits 0 on SIGTERM)
- Author per-layer RED unit tests:
  - `packages/core/env/src/schemas/observability.unit.test.ts` (env schema)
  - `packages/core/observability/src/sink-registry.unit.test.ts` (type shape)
  - `packages/libs/sentry-node/src/config.unit.test.ts` extensions
    (consume registry shape, not `SENTRY_MODE`)
  - `apps/oak-curriculum-mcp-streamable-http/src/observability/http-observability.unit.test.ts`
    (composition root)
  - `apps/oak-search-cli/src/observability/cli-observability.unit.test.ts`
    (composition root)
- Author redaction-barrier extension tests in
  `packages/libs/sentry-node/src/runtime-redaction-barrier.unit.test.ts`:
  fixture tee observes post-redaction events only

**TDD discipline**: Every test fails for the right reason (consumer
not yet wired, not "test syntax error" or "compile-only"). Run each
test; capture the failure message; commit the failures into the WS1
commit body for the design-record audit trail.

**Acceptance**:

- `pnpm test --filter @oaknational/env --filter @oaknational/observability`
  exits non-zero with expected failure messages
- `pnpm test:e2e --filter @oak-curriculum-mcp-streamable-http`
  exits non-zero with regression-guard failure
- `pnpm type-check` exits non-zero only on consumer-wiring gaps
  (canary signal — no other type breakage)

### WS2 — GREEN: `@oaknational/sentry-node` registry consumption

**Outcome**: sentry-node consumes `SinkRegistry`, no longer reads
`SENTRY_MODE`. Fixture types are vendor-neutral.

**Tasks**:

- Rewrite `packages/libs/sentry-node/src/config.ts` to derive its
  `ParsedSentryConfig` discriminated union from
  `(sinks.includes('sentry'), fixtures)` cross-product:
  - `sinks.includes('sentry') === false` → `kind: 'sentry-disabled'`
  - `sinks.includes('sentry') === true && fixtures === false` → `kind: 'sentry-live'`
  - `sinks.includes('sentry') === true && fixtures === true` → `kind: 'sentry-live-with-tee'`
  - `sinks.includes('sentry') === false && fixtures === true` → `kind: 'fixture-only'`
- Delete `SentryMode` type from `packages/libs/sentry-node/src/types.ts`
- Rename `FixtureSentryStore` → `FixtureCaptureStore` (vendor-neutral);
  `FixtureSentryCapture*` → `FixtureCaptureRecord*`; capture-record
  discriminated union becomes vendor-neutral with optional Sentry-shaped
  fields where the source vendor matters
- Rewrite `packages/libs/sentry-node/src/runtime.ts` mode dispatch to
  consume the new union
- Rewrite `packages/libs/sentry-node/src/runtime-sinks.ts` to wire the
  fixture tee separately from the live Sentry sink (both can fire
  for `kind: 'sentry-live-with-tee'`)
- Update all sentry-node unit + integration tests to use the new
  contract
- Run `pnpm test --filter @oaknational/sentry-node` exit 0

**Acceptance**: sentry-node test suite passes; type-check passes for
the package and its direct consumers; the package no longer references
`SENTRY_MODE` (`grep -r "SENTRY_MODE" packages/libs/sentry-node/`
returns zero matches).

### WS3 — GREEN: Env-resolution layer

**Outcome**: `@oaknational/env` ships `ObservabilityEnvSchema`;
`SentryEnvSchema` is deleted; warnings channel is in place; rename
errors are clear and actionable.

**Tasks**:

- Delete `packages/core/env/src/schemas/sentry.ts` (and re-export from
  index)
- Promote the schemas from WS1 to wired-into-`resolveEnv` status
- Author cross-field `superRefine` validators in `ObservabilityEnvSchema`:
  - DSN required when `'sentry'` in sinks
  - File path required when `'file'` in sinks
  - Production env with empty external sinks → hard error
  - Preview env with empty external sinks → warning
  - Legacy `SENTRY_MODE` set → hard error with message:
    `'SENTRY_MODE has been replaced by orthogonal axes. Set OBSERVABILITY_SINKS=["sentry"] OBSERVABILITY_FIXTURES=false to keep current behaviour, or OBSERVABILITY_SINKS=[] to disable. See ADR-165.'`
  - Legacy `MCP_LOGGER_FILE_PATH` / `MCP_LOGGER_FILE_APPEND` /
    `MCP_LOGGER_STDOUT` set → hard error with rename message
- Add `warnings: EnvWarning[]` to `resolveEnv` Result success path in
  `packages/libs/env-resolution/src/resolve-env.ts`
- Author `composeWithSinkConfiguration` generic helper in
  `packages/core/env/src/`
- Run `pnpm test --filter @oaknational/env --filter @oaknational/env-resolution`
  exit 0

**Acceptance**: env tests pass; `grep -r "SentryEnvSchema" packages/`
returns zero matches; rename-replacement error message is exercised by
test.

### WS4 — GREEN: HTTP MCP app atomic rename

**Outcome**: `apps/oak-curriculum-mcp-streamable-http` boots cleanly
with no observability env vars; the `observe-noauth` carve-out is
deleted; outermost regression-guard E2E goes GREEN.

**Tasks** (single-commit slice; intermediate commits OK if each passes
type-check):

- Update `apps/oak-curriculum-mcp-streamable-http/src/env.ts` to import
  `ObservabilityEnvSchema`; delete all `SENTRY_MODE` references
- Update `apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts`
  to expose registry + fixtures-flag fields
- Rewrite `apps/oak-curriculum-mcp-streamable-http/src/observability/http-observability.ts`
  to consume `SinkRegistry`; remove `additionalSinks` parallel mechanism
- Update `apps/oak-curriculum-mcp-streamable-http/src/app/core-endpoints.ts`
  to consume injected `ServerInstrumenter` (work bridges to WS6)
- Delete `apps/oak-curriculum-mcp-streamable-http/operations/development/http-dev-contract.ts:162`
  carve-out; both `dev` and `observe-noauth` modes share defaults
  (`OBSERVABILITY_SINKS=[]`, `OBSERVABILITY_FIXTURES=false`)
- Update `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-build-environment.ts`
  per WS1 D7a verification (orthogonal or migrated)
- Update `apps/oak-curriculum-mcp-streamable-http/smoke-tests/modes/local-stub-env.ts`
  and `local-stub-env.unit.test.ts` to assert new shape
- Update `apps/oak-curriculum-mcp-streamable-http/e2e-tests/helpers/test-config.ts`
- Update `.env.example` with the new contract and inline operator guidance
- Run `pnpm test --filter @oak-curriculum-mcp-streamable-http` exit 0
- Run the outermost regression-guard E2E — goes GREEN

**Acceptance**: HTTP MCP app test suite passes; outermost regression
guard is GREEN; `grep -r "SENTRY_MODE" apps/oak-curriculum-mcp-streamable-http/`
returns zero matches.

### WS5 — GREEN: Search CLI atomic rename

**Outcome**: Search CLI boots cleanly with the new contract; ready for
future Sentry emission expansion (WS11 forward-pointer plan).

**Tasks**:

- Update `apps/oak-search-cli/src/observability/cli-observability.ts`
  to consume `SinkRegistry`
- Update `apps/oak-search-cli/bin/oaksearch.ts` composition wiring
- Update `apps/oak-search-cli/src/lib/env.ts` and tests
- Update `apps/oak-search-cli/src/lib/logger.ts` (`registerAdditionalSink`
  path) to consume the registry's fan-out instead of registering
  separately
- Update `.env.example` with the new contract
- Run `pnpm test --filter @oak-search-cli` exit 0

**Acceptance**: Search CLI test suite passes; cross-app type-check
passes.

### WS6 — GREEN: `ServerInstrumenter` port + vendor-import narrowing

**Outcome**: ADR-162 §Open Question on direct vendor imports is closed;
`@sentry/node` direct imports outside the adapter library are removed.

**Tasks**:

- Author `ServerInstrumenter` port in `packages/core/observability/src/`
  (vendor-neutral interface for "wrap an MCP server instance with
  observability instrumentation" — covers `wrapMcpServerWithSentry`
  semantics) and "register Express error handler" semantics (covers
  `setupExpressErrorHandler`)
- Implement the port in `packages/libs/sentry-node/src/server-instrumenter.ts`
- Update HTTP MCP composition root to consume injected port:
  - `apps/oak-curriculum-mcp-streamable-http/src/index.ts` (delete
    `setupExpressErrorHandler` direct import; wire port)
  - `apps/oak-curriculum-mcp-streamable-http/src/server.ts` (similar)
  - `apps/oak-curriculum-mcp-streamable-http/src/app/core-endpoints.ts`
    (delete `wrapMcpServerWithSentry` direct import; wire port)
- Narrow ESLint `no-vendor-observability-import` allowlist: remove the
  three composition-root carve-out file entries
- Run conformance-relevant tests; rule still passes (allowlist narrowed
  by three entries; in-tree violations remain at zero)

**Acceptance**: ADR-162 §Open Question closed (cited in ADR-165);
ESLint rule passes with narrower allowlist; integration tests assert
port forwards correctly to vendor semantics.

### WS7 — Plan-body updates (downstream consumers)

**Outcome**: Plan estate references the new contract; no dangling
`SENTRY_MODE` pointers in plan bodies.

**Tasks**:

- Edit `.agent/plans/observability/current/multi-sink-vendor-independence-conformance.plan.md`:
  replace `SENTRY_MODE=off` with `OBSERVABILITY_SINKS=[]`; add
  reference to ADR-165
- Edit `.agent/plans/observability/high-level-observability-plan.md`
  substrate inventory to reference the landed registry
- Verify no other plan body references `SENTRY_MODE` outside historical
  / archive notes (`grep -r "SENTRY_MODE" .agent/plans/` excluding
  `archive/`)

**Acceptance**: plan bodies reference the new contract; no live
references to the deleted env var.

### WS8 — REFACTOR: Documentation propagation and ADR work

**Outcome**: Every documentation surface that mentioned `SENTRY_MODE`
or sink configuration reflects the orthogonal-axes shape. New ADR-165
is the canonical decision record. Cross-app distributed tracing
forward-pointer is in place.

#### WS8.1 — TSDoc

- TSDoc on `SinkRegistry`, `ServerInstrumenter`, `ObservabilityEnvSchema`,
  `OBSERVABILITY_SINKS`, `OBSERVABILITY_FIXTURES`, `FixtureCaptureStore`,
  `EnvWarning`, all derived types
- TSDoc on every renamed sentry-node export
- Run `pnpm doc-gen` exit 0

#### WS8.2 — Workspace READMEs

- `packages/core/observability/README.md` — usage of `SinkRegistry`,
  `ServerInstrumenter`, fixture-as-tee semantics
- `packages/libs/sentry-node/README.md` — adapter shape; how to use it
  via the registry
- `packages/libs/logger/README.md` — fan-out registry consumption;
  removal of `additionalSinks` parameter; file-sink as registry entry
- `packages/core/env/README.md` — `ObservabilityEnvSchema`, warnings
  channel, rename-replacement error messages
- `packages/libs/env-resolution/README.md` — warnings channel addition

#### WS8.3 — Root and app-level READMEs (operator-facing)

- `README.md` (root) — Quick Start updated; observability env-var
  contract documented at the right progressive-disclosure depth
- `apps/oak-curriculum-mcp-streamable-http/README.md` —
  - Operator usage guide for `OBSERVABILITY_SINKS` and
    `OBSERVABILITY_FIXTURES`
  - Local dev section explicitly states *"no observability env vars
    needed; defaults to stdout-only"*
  - Production deployment section names the required Vercel env vars
    for `OBSERVABILITY_SINKS=["sentry"]`
  - Migration note for operators who had `SENTRY_MODE` set
- `apps/oak-search-cli/README.md` —
  - Operator usage guide
  - **Forward-pointer note** (per owner reminder 2026-05-02):
    *"Search CLI ships with the same observability surface as the HTTP
    MCP server. Distributed-trace continuity between Search CLI, the
    HTTP MCP server, the upstream curriculum API, and Elasticsearch is
    owned by [`cross-system-correlated-tracing.plan.md`](../../.agent/plans/observability/future/cross-system-correlated-tracing.plan.md)
    — strategic brief; promotes when an incident or a Search CLI
    emission expansion exposes the gap. Operators running Search CLI
    alongside the HTTP MCP server can expect single-trace stitching
    across both systems once that plan executes."*

#### WS8.4 — Governance and operations docs

- `docs/governance/logging-guidance.md` — replace SENTRY_MODE three-mode
  guidance with the orthogonal-axes shape; cross-link to ADR-165
- `docs/operations/sentry-deployment-runbook.md` — update env tables
  (lines 59, 88, 275 per Explore findings); update disable-Sentry
  instructions to use `OBSERVABILITY_SINKS=[]`
- `docs/architecture/README.md` — refresh observability section
  reference to point at ADR-165 as canonical
- Any other doc referencing `SENTRY_MODE` (full grep sweep):
  `grep -rn "SENTRY_MODE" docs/ .agent/`

#### WS8.5 — `.env.example` files

- `apps/oak-curriculum-mcp-streamable-http/.env.example` —
  - Replace SENTRY_MODE block with `OBSERVABILITY_SINKS` +
    `OBSERVABILITY_FIXTURES` block
  - Inline guidance on each sink type, default values, and the
    fixture-tee semantics
- `apps/oak-search-cli/.env.example` — same
- (Add to root `.env.example` if any observability env vars belong
  there)

#### WS8.6 — ADR-165 (NEW): Observability Configuration Orthogonality

Author `docs/architecture/architectural-decisions/165-observability-configuration-orthogonality.md`
covering:

- **Context** — the architectural pressure that made the single-switch
  shape break (cite ADR-162's three-sink topology, ADR-143's coherent
  fan-out, ADR-160's redaction barrier, ADR-116's resolveEnv pipeline)
- **Decision** — orthogonal axes: typed sink list (data) +
  orthogonal fixture-tee boolean
- **Sink-list semantics** — additional external sinks layered onto the
  always-on stdout baseline; per-sink config validated cross-field
- **Fixture-tee semantics** — tee observes post-redaction events; lives
  downstream of ADR-160 barrier, upstream of nothing; vendor-neutral
  capture record shape
- **Locality enforcement** — production with empty external sinks is
  fail-closed; preview is warn-only; encoded in env-resolution
  `superRefine`
- **Consequences** — closes ADR-162 §Open Question on direct vendor
  imports; supersedes the implicit `SENTRY_MODE` contract; provides
  the foundation for warehouse and PostHog adapter additions as data
  changes only
- **Related** — ADR-116, ADR-143, ADR-154, ADR-160, ADR-161, ADR-162,
  ADR-163, PDR-019
- Status: Accepted on plan landing

#### WS8.7 — ADR amendments

- **ADR-116** (`resolveEnv` pipeline) — add §Amendment for the
  warnings channel addition; cite ADR-165
- **ADR-143** (coherent fan-out) — add §Amendment for the registry
  shape and fixture-as-tee semantics; cite ADR-165
- **ADR-162** (observability-first) — close §Open Question on
  `wrapMcpServerWithSentry`; clarify "Sink #1" language so stdout is
  unambiguously the baseline (not Sink #1); cite ADR-165
- **ADR-163** (Sentry release identifier) — add §Amendment clarifying
  that release resolution is build-time-only and orthogonal to runtime
  sink selection; cite ADR-165

**Acceptance**: `pnpm doc-gen` exit 0; `pnpm markdownlint:root` exit 0;
no live references to `SENTRY_MODE` in docs (excluding archived plans
and historical ADR §History entries).

### WS9 — Quality gates

Run the full chain. One at a time per
[`start-right-thorough.md § Quality Gates`](../../../.agent/skills/start-right-thorough/shared/start-right-thorough.md):

```bash
pnpm clean
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm doc-gen
pnpm format:root
pnpm markdownlint:root
pnpm lint:fix
pnpm subagents:check
pnpm portability:check
pnpm test:root-scripts
pnpm test
pnpm test:widget
pnpm test:e2e
pnpm test:ui
pnpm test:a11y
pnpm test:widget:ui
pnpm test:widget:a11y
pnpm smoke:dev:stub
pnpm practice:fitness:informational
pnpm practice:vocabulary
```

All exit 0. Outermost regression-guard E2E exit 0.

**Acceptance**: full quality-gate chain exit 0.

### WS10 — Adversarial review

Invoke specialist reviewers per the matrix below. Per
`principles.md`, *reviewer findings are action items by default*;
implement unless rejected with written rationale.

#### Mandatory-always reviewers for significant documentation or Practice changes

Per owner doctrine 2026-05-02 (*"for all significant documentation or
Practice changes — and this is always true — we need reviews from the
documentation reviewer and the onboarding reviewer"*), the following
reviewers fire automatically on EVERY plan that mutates documentation
or Practice surfaces. They are not optional; they are not gated on
plan size; they fire whether the change is one ADR amendment or a
full restructure.

| Reviewer | Trigger | What they challenge |
|---|---|---|
| `docs-adr-reviewer` | Any documentation or Practice mutation (always) | ADR/README/TSDoc accuracy and completeness; drift between behaviour and docs; ADR-amendment correctness; missing ADRs for significant decisions |
| `onboarding-reviewer` | Any documentation or Practice mutation (always) | Discoverability and first-success speed; both human and AI-agent onboarding paths; freshness (commands, scripts, env vars match reality) |

**Operationalisation**: WS11.4 graduates this doctrine to a permanent
rule (`.agent/rules/invoke-doc-and-onboarding-reviewers-on-significant-changes.md`
or amendment to `invoke-code-reviewers.md`) so future plans inherit
the trigger automatically. Until ratification, plans cite this
mandatory-always block by reference.

#### Plan-specific reviewer matrix

| Reviewer | Phase | What they challenge |
|---|---|---|
| `assumptions-reviewer` | **PRE-EXIT (plan phase)** | Proportionality, build-vs-buy attestation, blocking legitimacy of D1–D12 decisions |
| `architecture-reviewer-fred` | After WS3 GREEN | ADR compliance; layer separation; framework-vs-consumer placement of `SinkRegistry` |
| `architecture-reviewer-betty` | After WS6 GREEN | Long-term change-cost trade-offs; cohesion of the registry interface |
| `architecture-reviewer-wilma` | After WS6 GREEN | Adversarial: failure modes that bypass the registry (dynamic imports, re-exports, side-channel emissions) |
| `type-reviewer` | After each GREEN of WS2/WS3/WS6 | Type-shape correctness; absence of `as`/`!`/`any`/`unknown`; `superRefine` produces typed warnings |
| `test-reviewer` | After WS1 RED, after WS4/5 GREEN | RED-test discipline (each fails for the right reason); integration tests assert behaviour not implementation |
| `config-reviewer` | After WS3 GREEN | Env-var contract surface; rename-replacement error message clarity; `.env.example` docs |
| `mcp-reviewer` | After WS6 GREEN | `ServerInstrumenter` port composes correctly with MCP server lifecycle |
| `security-reviewer` | After WS3 + WS4 GREEN | Trust-boundary review; no new redaction-bypass paths; fixture-as-tee preserves ADR-160 barrier |
| `sentry-reviewer` | After WS6 GREEN | Vendor-port semantic equivalence with `wrapMcpServerWithSentry` |
| `code-reviewer` | Mid-cycle gateway | Routes to missing specialists; fires friction-ratchet if 3+ signals against registry shape accumulate |
| `docs-adr-reviewer` | **MANDATORY-ALWAYS** (see block above) — fires after WS8 close AND on each significant ADR amendment within WS8 | ADR-116/143/162/163 amendments + ADR-165 accurately reflect landed implementation |
| `onboarding-reviewer` | **MANDATORY-ALWAYS** (see block above) — fires after WS8 close | New contributor reading new `.env.example` + root README + both app READMEs understands orthogonal-axes model in <5 min; AI-agent onboarding path (AGENT.md links + ADR-165 discoverability) is fresh |
| `release-readiness-reviewer` | Close (WS9) | GO / GO-WITH-CONDITIONS / NO-GO across full quality-gate chain |

### WS11 — Documentation propagation, archives, spawned plans

#### WS11.1 — Spawn forward-pointing future-plans

**Existing**: [`future/cross-system-correlated-tracing.plan.md`](../future/cross-system-correlated-tracing.plan.md)
already covers MCP server ↔ curriculum SDK ↔ upstream API ↔
Elasticsearch trace correlation, including the Search CLI surface.
WS11 cites it from the Search CLI README forward-pointer note (per
WS8.3); no new plan stub is needed. Avoiding parallel-plan creation
follows `consolidate-at-third-consumer` and `replace-don't-bridge`
discipline.

**`future/config-management-platform-evaluation.plan.md`** (NEW)

WS-E carry-over from the superseded `observability-config-coherence.plan.md`.
Strategic brief: *"Evaluate Doppler / Infisical / 1Password Secrets /
Vercel Edge Config for managed env-var distribution. Trigger: operator
pressure for centralised secret rotation, OR a fourth distinct env-var
contract emerges."*

#### WS11.2 — Archives

- Move `future/observability-config-coherence.plan.md` →
  `archive/superseded/observability-config-coherence.plan.pre-orthogonal-axes-2026-05-02.md`
  with single-line linking note
- Move `current/local-dev-sentry-boundary-regression-investigation.plan.md` →
  `archive/superseded/local-dev-sentry-boundary-regression-investigation.plan.pre-shape-fix-2026-05-02.md`
  with single-line linking note

#### WS11.3 — Doctrine graduation: mandatory-always doc + onboarding review

Per owner direction 2026-05-02 (*"for all significant documentation
or Practice changes — and this is always true — we need reviews from
the documentation reviewer and the onboarding reviewer"*), graduate
the mandatory-always trigger to a permanent rule:

- Author or amend the canonical home — likely
  `.agent/rules/invoke-doc-and-onboarding-reviewers-on-significant-changes.md`
  (NEW) OR an amendment block in
  [`.agent/rules/invoke-code-reviewers.md`](../../../.agent/rules/invoke-code-reviewers.md)
  — that names the trigger ("any plan, change set, or commit that
  mutates documentation or Practice surfaces") and the two reviewers
  as mandatory-always
- Cite the source (this plan's WS10 mandatory-always block) and the
  owner direction date
- Update [`.agent/memory/active/distilled.md § Process`](../../../.agent/memory/active/distilled.md#process)
  with the graduation pointer (parallel to the
  rush-impulse-as-entropy-generator graduation entry from
  2026-05-02)
- Update [`.agent/memory/executive/invoke-code-reviewers.md`](../../../.agent/memory/executive/invoke-code-reviewers.md)
  matrix if the rule lives there

#### WS11.4 — Consolidation

- Run `/jc-consolidate-docs` per the standard close discipline
- Update `.agent/memory/operational/threads/observability-sentry-otel.next-session.md`
  with landing outcome
- Update active-plans index
- Update `.agent/memory/operational/repo-continuity.md` with the
  doctrine-graduation linkage (this plan is a worked instance of
  `principles.md § Architectural Excellence Over Expediency` graduated
  2026-05-02)

## Quality-Gate Checkpoints Between Workstreams

| After WS | Gate |
|---|---|
| WS0 | Plan file exists at canonical path; archives in place; indices updated |
| WS1 | All new tests fail for the right reason; `pnpm type-check` fails only on consumer-wiring gaps (canary signal) |
| WS2 | `pnpm test --filter @oaknational/sentry-node` exit 0; full-repo type-check still red on env layer |
| WS3 | `pnpm test --filter @oaknational/env --filter @oaknational/env-resolution` exit 0; rename-error tests exercised |
| WS4 | `pnpm test --filter @oak-curriculum-mcp-streamable-http` exit 0; outermost regression-guard E2E exit 0 |
| WS5 | `pnpm test --filter @oak-search-cli` exit 0; full-repo type-check exit 0 |
| WS6 | ESLint `no-vendor-observability-import` allowlist narrowed by 3 entries; rule passes |
| WS7 | No live `SENTRY_MODE` references in active plan bodies |
| WS8 | `pnpm doc-gen` exit 0; `pnpm markdownlint:root` exit 0; ADR-165 published |
| WS9 | Full quality-gate chain exit 0 |
| WS10 | All reviewer findings implemented or rejected with written rationale |
| WS11 | Archives in place; spawned plans exist; consolidation complete |

## Foundation Alignment

**Mandatory directives**:

- [`principles.md § Architectural Excellence Over Expediency`](../../../.agent/directives/principles.md#architectural-excellence-over-expediency) — the generator for this plan
- [`principles.md § Strict and Complete`](../../../.agent/directives/principles.md#strict-and-complete)
- [`principles.md § Owner Direction Beats Plan`](../../../.agent/directives/principles.md#owner-direction-beats-plan)
- [`principles.md § Separate Framework from Consumer`](../../../.agent/directives/principles.md#separate-framework-from-consumer)
- [`principles.md § Context Specificity Gradient`](../../../.agent/directives/principles.md#context-specificity-gradient)
- [`principles.md § Cardinal Rule`](../../../.agent/directives/principles.md#cardinal-rule-of-this-repository)
- [`testing-strategy.md`](../../../.agent/directives/testing-strategy.md)
- [`schema-first-execution.md`](../../../.agent/directives/schema-first-execution.md)

**Always-applied rules**:

- [`replace-dont-bridge`](../../../.agent/rules/replace-dont-bridge.md) — atomic rename; no transitional alias
- [`tdd-for-refactoring`](../../../.agent/rules/tdd-for-refactoring.md) — RED tests for every behaviour-preserving slice
- [`no-type-shortcuts`](../../../.agent/rules/no-type-shortcuts.md) — no `as`, `!`, `any` in new types
- [`unknown-is-type-destruction`](../../../.agent/rules/unknown-is-type-destruction.md) — typed registry; no `unknown` blobs
- [`use-result-pattern`](../../../.agent/rules/use-result-pattern.md) — env resolution Result with warnings channel
- [`documentation-hygiene`](../../../.agent/rules/documentation-hygiene.md) — TSDoc + README + ADR amendments
- [`lint-after-edit`](../../../.agent/rules/lint-after-edit.md)
- [`generator-first-mindset`](../../../.agent/rules/generator-first-mindset.md) — Zod-first; types flow from schema
- [`dont-break-build-without-fix-plan`](../../../.agent/rules/dont-break-build-without-fix-plan.md) — every commit type-checks individually
- [`apply-architectural-principles`](../../../.agent/rules/apply-architectural-principles.md)
- [`never-disable-checks`](../../../.agent/rules/never-disable-checks.md)
- [`no-warning-toleration`](../../../.agent/rules/no-warning-toleration.md)

**ADRs**:

- ADR-051 (OTel single-line JSON — emission baseline)
- ADR-078 (DI for testability — composition-root carve-out)
- ADR-116 (`resolveEnv` pipeline — warnings channel amendment)
- ADR-143 (coherent structured fan-out — registry shape amendment)
- ADR-154 (separate framework from consumer — sink registry placement)
- ADR-160 (non-bypassable redaction barrier — fixture-as-tee semantics)
- ADR-161 (network-free PR-check boundary — regression-guard placement)
- ADR-162 (observability-first — Open Question resolved)
- ADR-163 (Sentry release identifier — build-time scope clarified)
- ADR-164 (config load side-effects)
- ADR-165 **NEW** (observability configuration orthogonality — canonical)
- PDR-019 (ADR scope by reusability — justifies ADR-165)
- PDR-027 (threads, sessions, agent identity — session-discipline component)

## Critical Files To Modify

### Schema and type layer

- `packages/core/env/src/schemas/sentry.ts` — **DELETE**
- `packages/core/env/src/schemas/observability.ts` — **NEW**
- `packages/core/observability/src/types.ts` — `SinkRegistry`, `ServerInstrumenter` ports
- `packages/core/observability/src/sink-registry.ts` — **NEW**
- `packages/libs/env-resolution/src/resolve-env.ts` — `warnings` field
- `packages/libs/env-resolution/src/types.ts` — `EnvWarning` type

### Sentry adapter

- `packages/libs/sentry-node/src/config.ts` — registry consumption
- `packages/libs/sentry-node/src/types.ts` — delete `SentryMode`; rename fixture types
- `packages/libs/sentry-node/src/runtime.ts` — new mode dispatch
- `packages/libs/sentry-node/src/runtime-sinks.ts` — fan-out separation
- `packages/libs/sentry-node/src/fixture.ts` — vendor-neutral rename
- `packages/libs/sentry-node/src/types-fixture.ts` — vendor-neutral capture-record union
- `packages/libs/sentry-node/src/server-instrumenter.ts` — **NEW** (port impl)

### Logger fan-out

- `packages/libs/logger/src/sink-config.ts` — replace `LoggerSinkConfig` with registry-driven shape
- `packages/libs/logger/src/unified-logger.ts` — consume registry

### HTTP MCP server

- `apps/oak-curriculum-mcp-streamable-http/src/index.ts` — port wiring
- `apps/oak-curriculum-mcp-streamable-http/src/server.ts` — port wiring
- `apps/oak-curriculum-mcp-streamable-http/src/env.ts` — schema swap
- `apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts` — registry expose
- `apps/oak-curriculum-mcp-streamable-http/src/observability/http-observability.ts` — registry consumption
- `apps/oak-curriculum-mcp-streamable-http/src/app/core-endpoints.ts` — port consumption
- `apps/oak-curriculum-mcp-streamable-http/operations/development/http-dev-contract.ts` — delete carve-out
- `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-build-environment.ts` — verify or migrate
- `apps/oak-curriculum-mcp-streamable-http/smoke-tests/modes/local-stub-env.ts` — assertion update
- `apps/oak-curriculum-mcp-streamable-http/e2e-tests/helpers/test-config.ts` — config update
- `apps/oak-curriculum-mcp-streamable-http/e2e-tests/dev-server-boots-without-observability-config.e2e.test.ts` — **NEW** regression guard
- `apps/oak-curriculum-mcp-streamable-http/.env.example` — full rewrite of observability block
- `apps/oak-curriculum-mcp-streamable-http/README.md` — operator usage update

### Search CLI

- `apps/oak-search-cli/bin/oaksearch.ts` — composition wiring
- `apps/oak-search-cli/src/observability/cli-observability.ts` — registry consumption
- `apps/oak-search-cli/src/lib/env.ts` — schema swap
- `apps/oak-search-cli/src/lib/logger.ts` — registry consumption
- `apps/oak-search-cli/.env.example` — observability block update
- `apps/oak-search-cli/README.md` — operator usage + cross-app-tracing forward-pointer

### Documentation

- `README.md` (root) — Quick Start observability mention
- `docs/governance/logging-guidance.md`
- `docs/operations/sentry-deployment-runbook.md`
- `docs/architecture/architectural-decisions/116-...md` — amendment
- `docs/architecture/architectural-decisions/143-...md` — amendment
- `docs/architecture/architectural-decisions/162-observability-first.md` — Open Question close + amendment
- `docs/architecture/architectural-decisions/163-...md` — amendment
- `docs/architecture/architectural-decisions/165-observability-configuration-orthogonality.md` — **NEW**
- All workspace READMEs cited above

### Plan estate

- `.agent/plans/observability/current/multi-sink-vendor-independence-conformance.plan.md` — body update
- `.agent/plans/observability/high-level-observability-plan.md` — substrate inventory update
- `.agent/plans/observability/future/cross-app-distributed-tracing-mcp-and-search-cli.plan.md` — **NEW** stub
- `.agent/plans/observability/future/config-management-platform-evaluation.plan.md` — **NEW** stub

## Documentation Propagation Matrix (per owner reminder 2026-05-02)

| Surface | Update | Owner Workstream |
|---|---|---|
| Root `README.md` | Quick Start observability mention; pointer into ADR-165 | WS8.3 |
| `apps/oak-curriculum-mcp-streamable-http/README.md` | Operator usage; local-dev defaults; production env-var requirements; migration note | WS8.3 |
| `apps/oak-search-cli/README.md` | Operator usage; **cross-app distributed tracing forward-pointer note** | WS8.3 |
| Workspace READMEs (`@oaknational/observability`, `sentry-node`, `logger`, `env`, `env-resolution`) | API surface, registry consumption, warnings channel | WS8.2 |
| `docs/governance/logging-guidance.md` | Replace SENTRY_MODE three-mode guidance with orthogonal-axes shape | WS8.4 |
| `docs/operations/sentry-deployment-runbook.md` | Update env tables and disable-Sentry instructions | WS8.4 |
| `docs/architecture/README.md` | Refresh observability section reference | WS8.4 |
| TSDoc (every new/renamed type) | Inline doc; `pnpm doc-gen` exit 0 | WS8.1 |
| `.env.example` (HTTP MCP + Search CLI + root if relevant) | Full rewrite of observability block | WS8.5 |
| ADR-165 (new) | Canonical decision record for orthogonal-axes shape | WS8.6 |
| ADR-116 amendment | Warnings channel | WS8.7 |
| ADR-143 amendment | Registry shape, fixture-as-tee | WS8.7 |
| ADR-162 amendment | Open Question close; baseline-vs-numbered-sink language | WS8.7 |
| ADR-163 amendment | Build-time scope clarification | WS8.7 |
| `future/cross-app-distributed-tracing-mcp-and-search-cli.plan.md` | New strategic brief | WS11.1 |
| `future/config-management-platform-evaluation.plan.md` | New strategic brief | WS11.1 |

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Atomic rename breaks the build halfway through, leaving the repo unreleasable for the duration of the multi-session plan | High | High | Outermost regression-guard test pins the contract; until WS5 lands, the test stays RED. Use `worktrees` skill to isolate; do not merge to main until WS9 quality-gate exit 0. Per `dont-break-build-without-fix-plan`, every commit on the branch must individually pass `pnpm type-check`. |
| Fixture-as-tee semantics regress the redaction barrier (ADR-160 violation) | Medium | High (security-equivalent) | `security-reviewer` adversarial pass after WS3 GREEN. `runtime-redaction-barrier.unit.test.ts` extended in WS1 to assert tee'd fixtures observe post-redaction events only. |
| Build-time path (`sentry-build-plugin.ts`) was *not* orthogonal — D7a assumption falsified at WS1, scope expands mid-plan | Medium | Medium | WS1's first action is the verification read of `sentry-build-environment.ts`. If falsified, scope expands by one workstream (build-time rename); plan stays in-scope; ADR-163 amendment expands. The mitigation is to not assume; the test is the read. |
| `ServerInstrumenter` port for `wrapMcpServerWithSentry` semantics drifts from the vendor's behaviour, breaking MCP error capture invisibly | Medium | High (silent observability loss) | `mcp-reviewer` + `sentry-reviewer` adversarial passes after WS6 GREEN. Integration test extended to assert port forwards through to vendor `wrapMcpServerWithSentry` semantics. |
| The cross-field `superRefine` warning-channel shape requires changes to every existing `resolveEnv` callsite, blowing scope | Low | Medium | Type-driven migration: warnings field defaults to `[]` on success; callers ignoring it remain compile-clean. Only callsites that *consume* warnings need updates; in this plan, only the two app composition roots do. |
| `multi-sink-vendor-independence-conformance.plan.md` body update creates implicit pressure to land its execution in this plan | Medium | Low | This plan's responsibility ends at the body edit; the conformance test *implementation* is owned by the conformance plan. Document the boundary explicitly in WS7. |
| File-sink folding (D8) collides with `MCP_LOGGER_*` operator habits | Medium | Low | Rename-replacement error message names the migration path. Operator runbook (WS8.4) documents the change. |
| Spawned `cross-app-distributed-tracing-mcp-and-search-cli.plan.md` is treated as in-scope by reviewers | Low | Low | Document explicitly that the spawned plan is forward-pointing; this plan does NOT implement distributed tracing. |

## Outermost Regression-Guard Test

**File**: `apps/oak-curriculum-mcp-streamable-http/e2e-tests/dev-server-boots-without-observability-config.e2e.test.ts`
(NEW)

**Behaviour**:

- Spawns `pnpm dev` as a child process from a fresh-shell environment
  with **no** `OBSERVABILITY_*`, `SENTRY_*`, or `VERCEL_*` env vars set
- Asserts: process emits the *"server listening on port"* log line
  within 30 seconds AND does NOT emit any error containing the strings
  *"Sentry"*, *"Git SHA is required"*, or *"VERCEL_GIT_COMMIT_SHA"*
- Asserts: process exits with code 0 when sent `SIGTERM`
- Stays RED through WS1–WS3
- Goes GREEN at WS4 commit (the HTTP app rename slice)
- Stays GREEN through WS5–WS11

**Pipeline placement**: per ADR-161, this test is network-free (no
live network) and runs in PR-check via the `smoke:dev:stub` lane.

## Acceptance Summary

1. `OBSERVABILITY_SINKS` and `OBSERVABILITY_FIXTURES` are the only
   env vars governing observability config; `SENTRY_MODE` does not
   exist anywhere in repo (`grep -rn "SENTRY_MODE" .` returns zero
   matches outside `archive/` and historical ADR `§History` entries).
2. From a fresh checkout with no `OBSERVABILITY_*` env vars: `pnpm
   dev` from `apps/oak-curriculum-mcp-streamable-http` boots cleanly
   within 30 seconds, no Sentry release-resolution error,
   stdout-only emission visible.
3. From a fresh checkout with `OBSERVABILITY_SINKS=["sentry"]` and
   missing `SENTRY_DSN`: `pnpm dev` fails at env-resolution with a
   single specific message naming the conditional rule (NOT at
   runtime startup).
4. From a fresh checkout with `OBSERVABILITY_SINKS=[]` and
   `OBSERVABILITY_FIXTURES=true`: tests run with full isolation,
   fixture captures present.
5. From production-shaped env (`VERCEL_ENV=production`,
   `VERCEL_GIT_COMMIT_REF=main`) with `OBSERVABILITY_SINKS=[]`: env
   resolution fails closed with a clear "production must include a
   remote sink" error.
6. `pnpm test --filter @oak-curriculum-mcp-streamable-http` and
   `pnpm test --filter @oak-search-cli` both exit 0.
7. ESLint `no-vendor-observability-import` allowlist narrowed by 3
   entries; rule passes.
8. `multi-sink-vendor-independence-conformance.plan.md` body
   references `OBSERVABILITY_SINKS=[]` in place of `SENTRY_MODE=off`.
9. ADR-165 published; ADR-116/143/162/163 amendments landed.
10. Both app READMEs and the root README reflect the new operator
    surface; Search CLI README contains the cross-app-tracing
    forward-pointer note.
11. Two superseded plans archived to `archive/superseded/` with
    single-line linking notes.
12. Two new future-plans spawned (cross-app-tracing forward-pointer;
    config-management-platform carry-over).
13. Full quality-gate chain exit 0.
14. Outermost regression-guard E2E exit 0 in PR-check pipeline.

## Plan Exit — What Closes

**Closes** (verifiable on landing):

- ADR-162 §Open Question on `wrapMcpServerWithSentry` direct vendor import
- The four design questions in the superseded `observability-config-coherence.plan.md`
  (D8–D11 above answer them)
- The local-dev `pnpm dev` regression (D7-cured by D1+D2)
- The implicit dual sink-configuration mechanism (file-sink folded into
  registry per D8)

**Worked instance**: This plan IS the worked instance of
`principles.md § Architectural Excellence Over Expediency` (graduated
2026-05-02). The plan body cites the principle in Context; on landing,
add a pointer back from `distilled.md § Process` graduation entry to
this plan as the worked-instance evidence.

## Verification (post-landing)

```bash
# 1. No live SENTRY_MODE references
grep -rn "SENTRY_MODE" . \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  --exclude-dir=archive \
  --exclude-dir=dist
# expected: zero matches

# 2. Fresh-checkout dev boot
cd apps/oak-curriculum-mcp-streamable-http
unset $(env | grep -E '^(OBSERVABILITY_|SENTRY_|VERCEL_)' | cut -d= -f1)
timeout 30 pnpm dev
# expected: server listening; no Sentry errors

# 3. Quality-gate chain
cd /Users/jim/code/oak/oak-open-curriculum-ecosystem
pnpm clean && pnpm sdk-codegen && pnpm build && pnpm type-check && \
  pnpm doc-gen && pnpm format:root && pnpm markdownlint:root && \
  pnpm lint:fix && pnpm subagents:check && pnpm portability:check && \
  pnpm test:root-scripts && pnpm test && pnpm test:widget && \
  pnpm test:e2e && pnpm test:ui && pnpm test:a11y && \
  pnpm test:widget:ui && pnpm test:widget:a11y && pnpm smoke:dev:stub
# expected: all exit 0

# 4. Outermost regression-guard E2E
pnpm --filter @oak-curriculum-mcp-streamable-http test:e2e \
  --grep "dev-server-boots-without-observability-config"
# expected: exit 0
```

## Learning Loop

Per `.agent/commands/plan.md § Executable Plan Requirements`, this
plan ends with a consolidation pass:

- WS11.3 runs `/jc-consolidate-docs`
- Update `distilled.md § Process` graduation entry with worked-instance
  pointer
- If reviewer findings reveal a recurring pattern, capture as a
  `.agent/memory/active/patterns/<name>.md` candidate per ADR-150
- If owner direction during execution names a new doctrine, route to
  `.agent/memory/active/napkin.md` for cross-session graduation per
  the standard pending-graduations register flow
