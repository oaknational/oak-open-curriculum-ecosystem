---
name: "no-throw-statement Result migration"
overview: "Drive the 1000 ESLint warnings (999 @oaknational/no-throw-statement + 1 no-real-io-in-tests) to zero by migrating every throw to the Result pattern (ADR-088) at root cause — no exemptions, no eslint-disable, no rule weakening — then promote the rule warn->error. Test-throws are value-assessed per testing-strategy before any conversion."
status: "SUPERSEDED (2026-06-19) by no-throw-remediation.plan.md — the owner reopened the convert-all framing (distrust of the per-site analysis; tests-first priority; reassess-gate). This plan + its 92KB worklist are now a DATED INPUT the remediation plan's WS0 survey validates or replaces. D6 (convert-every-throw) is REOPENED, decided at the remediation plan's WS4 gate. Do not execute this plan's WS0-WS9 directly; start from no-throw-remediation.plan.md."
superseded_by: ./no-throw-remediation.plan.md
created: 2026-06-19
collection: architecture-and-infrastructure
lane: current
worklist: ./no-throw-statement-result-migration.worklist.json
todos:
  - id: ws0-result-primitives
    content: "DONE (landed 1556b9191 on docs/planning-and-validation). assertNeverResult(value: never, makeError: (unexpected: string) => E): Err<E> in @oaknational/result. REFINEMENT (reviewer-validated, applies to all WS4): NO standalone unit test — exhaustiveness is a compile-time guarantee proven by tsc at each use site, and the repo's type-assertion ban makes any runtime test type-forging; the helper lands ATOMICALLY WITH its first WS4 consumer. The error-factory shape is required because noUnusedParameters forbids an unused never param and no-underscore-rename bars _value. Reviewed: type-expert (ship-as-is), test-expert (land-with-consumer), code-expert (PASS)."
    status: done
  - id: ws1-generator-result
    content: "Migrate the 10 oak-sdk-codegen templates that emit throws to emit Result; regenerate; thread Result through the generated MCP-tool runtime contract and its consumers (~185 generated throws)."
    status: pending
    depends_on: [ws0-result-primitives]
  - id: ws2-source-result-return
    content: "Convert the result-return source throws to return err(...); dependency-ordered leaf->consumer per the DERIVED import DAG (NOT assumed core->sdk->app; see thread record). DONE in 1556b9191: build-metadata + graph-core term-reconstruction position-throws. NEXT leaves: env-resolution, observability, env, logger. RECONCILE off-main counts drifted (agent-tools 213, sentry-node 24, no-real-io 3); re-derive per workspace."
    status: in_progress
  - id: ws3-boundary-translate
    content: "Convert the 91 boundary-translate throws to Result-at-the-edge (incl. moving commander argParser validation into Result-returning validators)."
    status: pending
  - id: ws4-invariant-unreachable
    content: "Convert the invariant/exhaustiveness/narrowing throws using assertNeverResult. STARTED in 1556b9191 (graph-core term-reconstruction's 4 default arms — the WS4 template; follow that commit). Remaining graph-core (16) + the rest estate-wide."
    status: in_progress
    depends_on: [ws0-result-primitives]
  - id: ws5-rethrow-in-catch
    content: "Convert the 46 catch-block re-throws to Result translation (attach {cause}); fatal-process cases use process.exitCode/typed-fatal, never throw."
    status: pending
  - id: ws6-cli-exit
    content: "Convert the 8 cli-exit throws: main() returns Result, the entrypoint sets process.exitCode."
    status: pending
  - id: ws7-test-value-assessment
    content: "Per-test value triage of the 323 test-throws (the four questions) BEFORE conversion: delete useless/test-of-test/test-of-types, reshape implementation-constraining, push down a level, or convert narrowing to whole-Result assertions."
    status: pending
  - id: ws8-no-real-io
    content: "Fix the 1 no-real-io-in-tests warning (agent-tools state-integrity.integration.test.ts imports node:fs/promises) via injected fake (ADR-078)."
    status: pending
  - id: ws9-promote-rule
    content: "ENHANCEMENT / acceptance gate: promote @oaknational/no-throw-statement warn->error in recommended.ts once pnpm lint shows zero; verify pnpm check green."
    status: pending
    depends_on: [ws1-generator-result, ws2-source-result-return, ws3-boundary-translate, ws4-invariant-unreachable, ws5-rethrow-in-catch, ws6-cli-exit, ws7-test-value-assessment, ws8-no-real-io]
---

# no-throw-statement Result Migration

**Status**: DECISION-COMPLETE — execution mechanics fully designed and reviewed
(assumptions-expert, test-expert; findings verified first-hand and folded in). The
pivotal decision D6 (the no-throw rule vs ADR-088 §"Keep Exceptions For") is
**owner-ruled: increase strictness, convert every throw, and amend ADR-088 to
match** (the owner authors the ADRs). D1 and D2 follow from it; D3 (coordination
with Siren guards Reef), D4 (branch), and D5 (per-deletion nods) are operational.
**Created**: 2026-06-19
**Authoring session**: Vanilla weaves Undergrowth (8fc36b)
**Worklist**: [`no-throw-statement-result-migration.worklist.json`](./no-throw-statement-result-migration.worklist.json)
— per-file site classification (334 files, 811 sites) plus the generator emission
spec, so execution does not re-run the 2.24M-token classification.

## Problem

A configuration change activated `@oaknational/no-throw-statement` across the
estate, surfacing **1000 ESLint warnings, 0 errors**:

- **999** `@oaknational/no-throw-statement` — every `throw` statement (the rule
  reports every `ThrowStatement`).
- **1** `@oaknational/no-real-io-in-tests` — a test importing `node:fs/promises`.

Every other rule is at zero. This is not a thousand independent problems; it is a
single **Result-pattern migration** (ADR-088 / `use-result-pattern`): errors must
flow as `Result<T, E>` in the type signature, never as invisible throws.

The rule sits at `warn` per the `no-warning-toleration` rule-authoring nuance
(the migration lane is designed here). Per `no-warning-toleration`, warnings are
equally blocking as errors; the end state is **zero warnings and the rule
promoted to `error`** (WS9).

## End goal · Mechanism · Means

- **End goal**: zero `no-throw-statement` and `no-real-io-in-tests` warnings,
  achieved by fixing root causes in code, and the rule promoted to `error` so
  the diagnostic cannot regress. Strict, everywhere, all the time.
- **Mechanism**: every throw becomes either a `Result` return (the function
  carries its failure in the type signature) or — for genuine external-boundary
  edges — a translation to `Result` at that single edge. The compiler then forces
  every caller to handle both arms, which is the property a throw destroys.
- **Means**: nine workstreams (WS0–WS9) below, grounded in the per-site
  classification, executed as TDD cycles in dependency order.

## Non-negotiable doctrine (owner-directed this session)

1. **No exemptions. Every throw is migrated.** No `eslint-disable` (even
   documented), no rule weakening, no gate narrowing. "This can't be fixed" is a
   tripwire to apply the system-change lens, not an escape hatch.
2. **Strict, everywhere, all the time.** The rule is promoted to `error` at zero.
3. **Long-term architectural excellence over expediency.** No sed sweeps for
   behaviour changes; every conversion is a TDD cycle (test + product code, one
   landing). At every decision: *could it be simpler without compromising quality?*
   and *would it be simpler if the system changed?*
4. **Test-throws are a test-quality signal, not a conversion target.** For every
   test-throw, first ask (testing-strategy.md): what does it prove about
   product/agent-tooling code; does it constrain implementation or configuration;
   could it be proven at a lower level; should it exist at all? Then
   delete / reshape / push-down / convert — never mechanically de-throw a test
   that should not exist.
5. **Every throw converts.** There is no exemption set and no false-positive set.
   The owner ruled to increase strictness (D6), so the patterns that read as
   "legitimate" — exhaustiveness `never` guards, boundary throws, the `unwrap`
   escape hatch — convert too, and ADR-088 is amended to match (WS9).

## Verified inventory

Provenance: canonical `pnpm lint` capture this session (turbo cache replay,
verified against per-workspace `✖` summaries and one fresh per-workspace run);
classification by a 20-agent workflow, each finding first-hand-verified by the
author; counts reconciled to exactly 1000.

### By fix-approach bucket (path-derived, totals 1000)

| Bucket | Warnings | Files | Fix approach | Workstream |
| --- | --- | --- | --- | --- |
| Hand-written source | 426 | 182 | `return err(...)` from Result-typed fns | WS2 |
| Test files | 323 | 127 | value-triage then delete/reshape/push-down/convert | WS7 |
| Generated output | 189 (185 mapped to templates) | 32 | fix 10 codegen templates | WS1 |
| Generator source | 55 | 22 | Result migration in codegen logic | WS2/WS3/WS5 |
| Scripts | 7 | 3 | Result + exitCode / Result-return | WS6/WS2 |

### By subcategory (811 classified non-generated sites)

| Subcategory | Count | Notes |
| --- | --- | --- |
| result-return | 264 | the core migration; only 2 flagged FP |
| test-setup-guard | 200 | WS7 value-triage |
| invariant-unreachable | 100 | WS4 assertNever helper |
| test-fake-or-mock | 98 | WS7 value-triage |
| boundary-translate | 91 | WS3 |
| rethrow-in-catch | 46 | WS5 |
| cli-exit | 8 | WS6 |
| test-tothrow-arrow | 3 | WS7 — assert err, not .toThrow |
| other | 1 | inspect individually |

The classification agents flagged **400/811 as false-positive candidates**.
First-hand verification surfaced a real conflict: **ADR-088 §"Keep Exceptions For"
(Accepted) lists kept throws — programming errors, corrupted invariants /
unrecoverable states, configuration-missing-at-startup — and ADR-088's own
exhaustiveness example throws.** The 73 `invariant-unreachable` arms (e.g.
`sentry-node/src/runtime-error.ts:62`) are verbatim that pattern. The **owner has
ruled** (D6): increase strictness — **convert every throw** (exhaustiveness arms
included, via a Result-returning `assertNever`; commander argParser → Result-returning
validators; fatal-propagation → `process.exitCode`; test-fakes → `err()`; cli main →
Result) and **amend ADR-088** to match. Convert-all is now owner-ratified doctrine,
not an agent override; the worklist's per-site classification notes are the raw
input, superseded wherever they read a throw as legitimate.

### By workspace (gate counts, totals 1000)

| Workspace | Warnings | Coordination |
| --- | --- | --- |
| oak-sdk-codegen | 270 | mine — incl. ~185 generated (WS1) + generator-source |
| agent-tools | 214 | **Tulip's PDR-105 boundary — coordinate (D3)** |
| oak-search-cli | 162 | mine |
| oak-curriculum-mcp-streamable-http | 144 | mine — main MCP consumer of the generated runtime |
| oak-curriculum-sdk | 77 | mine |
| oak-search-sdk | 37 | mine |
| graph-core | 26 | mine |
| sentry-node | 21 | mine |
| logger | 13 | mine |
| graph-corpus-sdk | 9 | mine |
| design-tokens-core / oak-design-tokens | 7 / 6 | mine |
| env-resolution / observability / env | 4 / 4 / 3 | mine |
| build-metadata | 2 | **DONE — proven exemplar** |
| result | 1 | `unwrap` — §Decisions D1 |

## Proven exemplar (this session)

`packages/core/build-metadata` is fully converted and green (the reference
pattern for WS2): `isLessThanOrEqual` now returns
`Result<boolean, InvalidSemverError>` (`return err(...)` replaces the two
throws), both test files assert the Result (`toEqual(ok(true))`; the former
`.toThrow()` is now a stronger `err(...)` assertion proving *our* validation),
zero consumers broke (the function was test-only-consumed). Gate: **0 lint
warnings, type-check passes, 93 tests pass.**

Captured lessons for execution:

- **TSDoc with `err({...})` examples must escape braces** (`\{ \}`) or
  `tsdoc/syntax` errors. (Caught by the gate this session.)
- **Verify consumers before converting** — a function with no production
  consumers converts in full isolation; one with consumers cascades and the
  cascade is fixed in the same cycle.
- **Pre-existing test-doctrine smells the migration will surface** (test-expert):
  the exemplar's `parseSemver` tests use `if (parsed === null) return;` narrowing
  guards (fix: whole-object `expect(parseSemver(x)).toEqual(...)`, no guard), and
  `semver-parity.test.ts` should be `*.unit.test.ts`. Neither is a gate failure;
  both are WS7 worked examples — fix when WS7 reaches build-metadata.

## Workstreams

Each workstream is a sequence of TDD cycles. A cycle converts one function (or
one template) plus all its callers plus its tests, lands in one commit, and ends
with the workspace gate green. The worklist gives the per-file, per-line targets
and subcategory for every site.

### WS0 — Result primitives (prerequisite)

Add a Result-returning exhaustiveness helper to `@oaknational/result` (e.g.
`assertNeverResult(x: never, e: E): Err<E>`) so WS4 exhaustiveness throws and
test-narrowing convert without a throw. Confirm narrowing ergonomics
(`isOk`/`isErr` already exist) for the whole-Result test-assertion pattern.
Small, blocking for WS4. TDD: unit test for the helper + the helper.

### WS1 — Generator Result-ification (~185 generated throws)

Per `generator-first-mindset`, the 32 generated files are NEVER edited; fix the
**10 templates** (full spec in the worklist `generatorEmissionSpec`):

- `generate-execute-file.ts` (74) — emit `return err({ kind, ... })` / `return ok(...)`;
  change emitted return type to `Promise<Result<..., ToolCallError>>`; define
  `ToolCallError` once in the runtime contract; propagate through
  `invokeToolByName`/`callTool`/`callToolWithValidation`.
- `emit-index.ts` (92) — per-call `invoke` returns Result (`input-validation`,
  `invalid-method`, `undocumented-response`); `UndocumentedResponseError` becomes
  an error *value* in `err()`, not thrown; update `tool-descriptor.contract.ts`.
- `emit-response-validators.ts` (5), `operation-generators.ts` (4),
  `generate-definitions-file.ts` (3), `build-response-descriptor-helpers.ts` (1),
  `generate-url-helpers.ts` (2), ground-truths `type-emitter.ts` (2),
  `generate-zero-hit-fixtures.ts` (1), `generate-search-fixtures.ts` (1) — same
  pattern: Result-returning emitted helpers.

Then `pnpm sdk-codegen` + `pnpm build`, and thread Result through the **consumers**
of the generated MCP-tool runtime (streamable-http etc.). Largest blast radius;
e2e tests (`*.e2e.test.ts`) prove the runtime still behaves. The load-time
module-init throws over generated data convert too (D6).

### WS2 — Source result-return (264)

Convert per the exemplar, **dependency-ordered leaf → consumer**: core/libs
(env, observability, env-resolution, graph-core, logger, sentry-node, design-*) →
sdks (oak-curriculum-sdk, oak-search-sdk, graph-corpus-sdk, oak-sdk-codegen
generator-source) → apps (oak-search-cli, streamable-http). build-metadata DONE.
agent-tools sites deferred to D3. Each cycle: change signature to `Result`,
`return err(...)`, update callers + tests, gate green. **Before starting, derive the
real workspace import DAG** (`pnpm ls` / the turbo graph) and pin the conversion
order to it — the core→sdk→app tiering above is an assumption, not yet derived
(assumptions-expert); a cross-tier or cyclic edge would break the gate-green-per-cycle
invariant mid-cascade.

### WS3 — Boundary-translate (91)

Wrap each external edge (3rd-party lib, `JSON.parse`, fs/network/Node API) and
translate to `Result` at that single edge (attach `{ cause }` when re-expressing,
per `preserve-caught-error`). Commander `InvalidArgumentError` argParser callbacks:
move validation into `Result`-returning validators the command layer calls; the
argParser stops throwing.

### WS4 — Invariant / exhaustiveness / narrowing (100)

Replace `default: { const x: never; throw }` and "should never happen" guards
with the WS0 `assertNeverResult` helper (or a `Result`-returning invariant).
Narrowing-after-assertion throws collapse into the same helper or a whole-Result
assertion.

### WS5 — Rethrow-in-catch (46)

Convert `catch` blocks to `Result` translation. Fatal-by-construction
propagation (e.g. the watcher-timeout supervisor crash) uses `process.exitCode`
and an explicit return / typed fatal result, never a throw.

### WS6 — CLI-exit (8)

`main()` returns `Result`; the module entrypoint pattern-matches and sets
`process.exitCode`. No throw as control flow.

### WS7 — Test value-assessment (323)

The judgment-heavy workstream. For **each** test-throw apply the four questions
(testing-strategy.md), then act:

- **Narrowing `if (result.isError) throw 'unreachable'`** → assert the whole
  Result (`expect(result).toEqual(ok(x))`); removes the throw *and* the
  no-conditional-tests branch.
- **`expect(() => fn()).toThrow()`** → the code-under-test returns `Result`, so
  assert `err(...)`; fix the product contract.
- **Test fake throwing `'not implemented'`** → if it signals a complex mock /
  un-testable seam, simplify the product code (ADR-078) or return `err()` to
  match a Result-typed interface; if it tests the mock, **delete** the test.
- **Setup-guard / fixture throw** → if it proves test-scaffolding not product
  behaviour, delete; if data-anchoring, fix at the fixture.

Two screens precede the four questions (test-expert review, folded in):

- **Conditional-test screen**: any `if (cond) { return; }` OR `if (cond) { throw }`
  that gates later assertions is a no-conditional-tests smell — fix by asserting the
  whole value (`expect(result).toEqual(ok(x))` for Result-returning fns; a single
  `expect(x).toEqual(...)` with no narrowing guard for `T | null` fns). Throw-guards
  used purely for TypeScript narrowing in a test are NOT production throws and are
  out of scope for the no-throw conversion.
- **Falsifiability screen**: "if the function under test were replaced by a stub
  returning the asserted value, would this test still fail?" If no, it has no
  discriminating power — delete.

A test is deleted as external-library / type-only **only when it still passes with
the raw library call substituted for our wrapper**. By that criterion the semver
§11.4 battery stays — it exercises our validation gate and Result shape (raw
`semver.lte` returns `boolean`, not `ok(boolean)`). Each surviving test sits at the
lowest level that proves the behaviour.

### WS8 — no-real-io (1)

`agent-tools/tests/collaboration-state/state-integrity.integration.test.ts`
imports `node:fs/promises` directly. Inject a fake fs from a `test-helpers/`
surface (ADR-078). On Tulip's boundary — sequence with D3.

### WS9 — Amend doctrine + promote rule (final acceptance gate)

Two paired changes, **coordinated with Siren guards Reef** (doctrine surfaces on
their active claim `b01b303e`, D3):

1. **Amend ADR-088** (owner ruling, D6): remove/tighten §"Keep Exceptions For" and
   update its exhaustiveness example to the Result-returning `assertNever`; align
   `.agent/rules/use-result-pattern.md` and `principles.md` to the tightened policy.
   The amended ADR and the rule then agree.
2. **Promote the rule**: when `pnpm lint` shows zero `no-throw-statement` and
   `no-real-io-in-tests` warnings, change `recommended.ts:189` to `'error'` and run
   `pnpm check`. The structural reciprocation that prevents regression
   (`no-warning-toleration`).

## Decisions

All decisions are made. D6 is owner-ruled; D1–D2 follow from it; D3–D5 are decided
here from the evidence.

- **D6 — strictness vs ADR-088 §"Keep Exceptions For" (owner-ruled).** ADR-088
  (Accepted) lists kept throws (programming errors, corrupted invariants /
  unrecoverable states, startup-config, exhaustiveness `never` guards). The owner,
  author of the ADRs, ruled: increase strictness, convert every throw, and update
  ADR-088 (and `use-result-pattern.md` / `principles.md`) to record the tightened
  policy. WS9 carries it. The rule and the amended ADR then agree.
- **D1 — `@oaknational/result` `unwrap`.** Convert: enumerate callers, migrate to
  `match`/`unwrapOr`/`isOk` narrowing, retire the throwing `unwrap`.
- **D2 — load-time module-init throws over generated data.** Convert to Result with
  the per-request paths.
- **D3 — agent-tools (214 sites) and the WS9 doctrine edits execute last.** Both the
  agent-tools no-throw sites and the WS9 ADR-088 / `use-result-pattern.md` /
  `principles.md` edits sit on Siren guards Reef's active claim `b01b303e`. Open a
  coordinating claim with Siren and execute once it is visible. `agent-tools/` is a
  separate top-level tree from `packages/` and `apps/`, so the other 786 sites
  proceed independently of Siren.
- **D4 — branch: `docs/planning-and-validation` (OWNER-RULED 2026-06-19).** The
  migration executes on this branch — the intended branch all along. (Merlin briefly
  used a worktree off `main`; the owner corrected it as an unnecessary complication —
  multiple agents coexist on this branch via claims + explicit-pathspec commits, which
  is the protocol. The stale `feat/no-throw-result-migration` worktree/branch awaits
  tidy-up.) The branch is unpushed; **the owner controls the push.**
- **D5 — test deletions.** WS7 deletes a test only when it fails BOTH the
  falsifiability screen and the raw-library screen, logging the rationale per
  deletion. The semver §11.4 battery passes both screens — it stays.

## Prerequisites

- **Blocking**: WS0 before WS4. WS1 templates before regenerating the SDK. Owner
  ratification of D1–D5 before the affected sites execute.
- **Beneficial**: Tulip coordination (D3) before agent-tools; the minimum
  shippable shape without it is every non-agent-tools workspace (786 of 1000 sites).

## Non-goals

- No `eslint-disable`, rule exemptions, gate narrowing, or `--no-verify`.
- Not changing the `no-throw-statement` rule's matching logic (it correctly flags
  every throw); the only rule change is the WS9 severity promotion.
- Not the broader `eslint-disable-remediation` lane (separate active plan; that
  rule currently shows zero warnings).
- Not touching `.agent/` doctrine surfaces or `agent-tools` without D3.

## Risk assessment

| Risk | Mitigation |
| --- | --- |
| Cross-workspace cascade from signature changes | Dependency-ordered (leaf→consumer); gate green per cycle; never leave a half-migrated tree |
| Generator change breaks MCP consumers | Thread Result through the runtime contract + consumers in the same WS; e2e tests prove the runtime |
| Test value-triage over-deletes coverage | Surface every deletion for owner review (D5); keep behaviour proofs |
| Collision with Tulip on agent-tools | Coordinate (D3); sequence agent-tools last; claim the commit window |
| Shared-branch commit contention | Singleton commit window; explicit-pathspec commits; owner controls push |

## Foundation alignment

- ADR-088 (`use-result-pattern`) — the migration target.
- ADR-078 (dependency injection for testability) — WS8 and test-fake fixes.
- `testing-strategy.md` / `tdd-as-design.md` — WS7 value-triage and the
  test+product-code atomic-landing invariant for every cycle.
- `no-warning-toleration` — zero warnings, promote to error (WS9).
- `generator-first-mindset` (ADR-029/030/031) — WS1 fixes templates, not output.
- `schema-first-execution.md` — generated runtime stays schema-driven; only the
  emitted error-handling shape changes.

## Plan-body first-principles check

- **Shape**: per `plan-body-first-principles-check`, the worklist counts are
  derivation-anchored to this session's lint capture; re-run `pnpm lint` at
  execution start and reconcile any per-file count (the tree advances between sessions).
- **Landing path**: each cycle lands test+product code together; no cycle commits
  product code ahead of its test or vice versa.
- **Vendor-literal**: the commander `InvalidArgumentError` and Result API shapes
  are verified against the live packages this session; re-verify at author time
  if the deps bump.

## Quality gates

Per cycle: `pnpm --filter <workspace> lint type-check test`. Per workspace
completion: the workspace's full gate. Final (WS9): `pnpm check` plus
`pnpm lint` showing zero. Reference
`../../templates/components/quality-gates.md`.

## Proof contract

- **AC1** (per WS2–WS8 site): `pnpm lint` for the touched workspace shows the
  converted sites gone; the converted function's tests assert `Result`
  (`unit`/`integration` proof).
- **AC2** (WS1): `pnpm sdk-codegen && pnpm build` regenerate with zero throws in
  output; streamable-http `*.e2e.test.ts` green (`e2e` proof).
- **AC3** (WS7): every surviving test names what it proves about product/
  agent-tooling code; deletions logged with rationale (`non-code` proof —
  disposition ledger).
- **AC4** (WS9, completion): `pnpm lint` = 0 `no-throw-statement` and
  `no-real-io-in-tests` warnings; rule at `error`; `pnpm check` green.

## Readiness reviewers

Before execution: `assumptions-expert` (proportionality / blocking legitimacy of
this plan), `test-expert` (WS7 value-triage rubric), `config-expert` (WS9 rule
promotion), `type-expert` (the generated `ToolCallError` discriminated union and
Result threading in WS1). Per-cycle during execution: `code-expert` gateway, with
specialists by surface.

## Learning loop / lifecycle triggers

On completion run `oak-consolidate-docs`: graduate the migration patterns (the
exemplar, the TSDoc-brace lesson, the test-value rubric) and retire this plan per
ADR-117. Reference `../../templates/components/lifecycle-triggers.md`.
