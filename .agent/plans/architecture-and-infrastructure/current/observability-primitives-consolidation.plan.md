---
name: "Observability Primitives Consolidation — Fold Redaction + Sanitisation into @oaknational/observability"
overview: >
  Repair an ADR-041 core→lib boundary violation surfaced during Wave 1
  L-12-prereq by consolidating value-level redaction primitives and JSON
  sanitisation primitives into @oaknational/observability. Eliminates a
  duplicate recursive JSON-safe type, removes a redundant indirection hop,
  relocates sanitisation primitives from @oaknational/logger (foundation
  lib) to @oaknational/observability (core). Blocks Wave 1 closure and
  Wave 4 widget Sentry (L-12) on this branch; must land atomically.
branch: "feat/otel_sentry_enhancements"
parent_plan: null
strategic_plan: "../../observability/high-level-observability-plan.md"
depends_on: []
blocks:
  - "observability/active/sentry-observability-maximisation-mcp.plan.md#L-12-prereq"
  - "observability/active/sentry-observability-maximisation-mcp.plan.md#L-12"
foundational_docs:
  - ".agent/directives/principles.md"
  - ".agent/directives/testing-strategy.md"
  - "docs/architecture/architectural-decisions/041-workspace-structure-option-a.md"
  - "docs/architecture/architectural-decisions/154-separate-framework-from-consumer.md"
  - "docs/architecture/architectural-decisions/155-decompose-at-the-tension.md"
  - "docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md"
  - "docs/architecture/architectural-decisions/162-observability-first.md"
todos:
  - id: ws1-observability-augmentation
    content: "WS1: add sanitisation primitives + value-level redaction wrappers + unified recursive JSON-safe type to @oaknational/observability. New exports: sanitiseForJson, sanitiseObject, isJsonValue, JsonValue, JsonObject (unified with TelemetryValue/TelemetryRecord — pick one canonical name). New wrapper exports: redactText, redactUnknownValue, redactJsonObject, redactStringRecord. Move json-sanitisation-internals.ts. Add structural no-node-only-imports.unit.test.ts guard."
    status: pending
    priority: next
  - id: ws2-logger-consumer-migration
    content: "WS2: @oaknational/logger consumes sanitisation from observability; removes its own copies of json-sanitisation.ts + internals + JsonValue/JsonObject types; removes the re-export surface (no backwards-compat shims per principles.md). Logger-internal imports (express-middleware.ts, context-merging.ts, error-normalisation-fields.ts, node.ts) point at @oaknational/observability."
    status: pending
  - id: ws3-other-consumer-migration
    content: "WS3: migrate all non-logger consumers of sanitiseForJson / sanitiseObject / JsonValue / JsonObject to import from @oaknational/observability. Known call-sites: apps/oak-search-cli (7 files), apps/oak-curriculum-mcp-streamable-http (2 files). Update to single canonical import path."
    status: pending
  - id: ws4-sentry-node-fold
    content: "WS4: @oaknational/sentry-node drops its dependency on @oaknational/telemetry-redaction-core; composes primitives directly from @oaknational/observability. Relocate describeUnknownError inline at its 2 call-sites in sentry-node (or to logger's error-helpers if that is cleaner per review). Preserve all 61 existing sentry-node tests green throughout as the behavioural safety net."
    status: pending
  - id: ws5-delete-telemetry-redaction-core-workspace
    content: "WS5: delete packages/core/telemetry-redaction-core/ entirely. Remove entry from pnpm-workspace.yaml. pnpm install to clean the lockfile. The scaffolded workspace was a correct starting instinct that Barney's simplification review resolved into a cleaner shape (fold-into-observability). The work done in the scaffold (type shape, primitive contracts, structural test design) is preserved by its absorption into observability."
    status: pending
  - id: ws6-type-gap-elimination
    content: "WS6: eliminate the requireJsonObject runtime-throw invariant (flagged by Barney). Tighten types so sanitiseObject(redactTelemetryObject(x)) has a provably non-null return given a JsonObject input. Requires type-reviewer at REFACTOR phase."
    status: pending
  - id: ws7-adr-160-amendment
    content: "WS7: amend ADR-160 §Closed Questions with a History entry dated landing day. Body: \"Runtime-agnostic redactor primitives folded into @oaknational/observability. New package (@oaknational/telemetry-redaction-core) was briefly scaffolded and then consolidated on simplification grounds — primitives were thin compositions over observability's existing redaction policy, and the candidate core workspace would have created a third copy of the recursive JSON-safe type already defined in both @oaknational/logger (JsonValue) and @oaknational/observability (TelemetryValue). Fold unifies the type, co-locates the primitives with the policy that composes them, and removes a redundant adapter→core→core indirection hop. Browser-safety invariant (zero @sentry/*) remains enforceable via the no-node-only-imports test now hosted in observability.\" Cite Barney's simplification-first review."
    status: pending
  - id: ws8-reviewer-matrix-at-close
    content: "WS8: dispatch reviewer matrix at GREEN close: code-reviewer (gateway), architecture-reviewer-fred (ADR-041 + ADR-160 amendment compliance), architecture-reviewer-barney (confirms simplification realised), architecture-reviewer-betty (long-term change-cost validation — Barney recommended for triangulation), type-reviewer (JsonValue/TelemetryValue unification + requireJsonObject elimination), test-reviewer (test migration + new structural guard), config-reviewer (workspace deletion + package.json shapes), docs-adr-reviewer (ADR-160 amendment + logger README + observability README), sentry-reviewer (ADR-160 closure property still holds post-fold), assumptions-reviewer (overall proportionality). Findings are action items unless explicitly rejected with written rationale."
    status: pending
  - id: ws9-landing-evidence
    content: "WS9: close with attempt / observed outcome / proven result evidence per maximisation plan §Lane Close Evidence Pattern. Attempt: primitives folded into observability; redaction-core workspace removed. Observed: pnpm check exit 0; sentry-node 61/61 tests still green; observability's new tests green; no-node-only-imports invariant green. Proven: the observability package owns both the redaction policy and the primitives that compose it; ADR-041 core boundary is intact with one fewer workspace; recursive JSON-safe type has a single canonical definition. Update .agent/plans/observability/what-the-system-emits-today.md §Update Log."
    status: pending
isProject: true
---

# Observability Primitives Consolidation

**Last Updated**: 2026-04-19
**Status**: 🟡 PLANNED — blocks Wave 1 closure; begin once owner authorises execution
**Scope**: Architectural repair across `@oaknational/observability`, `@oaknational/logger`, `@oaknational/sentry-node`, and removal of the transitional `packages/core/telemetry-redaction-core/` workspace.

---

## Why this plan exists

Wave 1 lane L-12-prereq attempted to extract a pure runtime-agnostic
redactor core from `@oaknational/sentry-node` into a new
`packages/core/telemetry-redaction-core/` workspace, per ADR-160
§Closed Questions (2026-04-17). The scaffolding attempt surfaced two
architectural truths that the ADR had not accounted for:

1. **The primitives needed JSON sanitisation helpers
   (`sanitiseForJson`, `sanitiseObject`, `JsonValue`, `JsonObject`)
   from `@oaknational/logger`** — a foundation lib. ADR-041 forbids
   core→lib imports. The scaffolded workspace cannot satisfy its own
   boundary without first relocating the sanitisation primitives.
2. **The workspace contained 139 LOC of pure composition, zero net
   primitive content**. Every export delegated to `@oaknational/observability`'s
   existing primitives with a thin wrapper. A standalone workspace for
   composition-only code does not meet core-tier's "atomic foundational
   primitive" spirit.

Architecture review (fred + barney, 2026-04-19) resolved the tension
toward **folding the primitives into `@oaknational/observability`**
rather than creating two separate core workspaces. Barney's reasoning:

- `JsonValue` (logger) and `TelemetryValue` (observability) are the
  same recursive JSON-safe shape with different names. Creating a
  third copy in a separate sanitisation workspace entrenches the
  duplication. Folding into observability forces canonicalisation.
- Every known non-logger consumer of `sanitiseForJson` is an
  observability/telemetry site (CLI observability, Sentry delegates,
  bootstrap helpers, indexing ops, zero-hit event deletion). No
  independent non-observability consumer justifies a separate
  workspace.
- The 139 LOC of composition is primitive-content inside the package
  that owns the redaction policy, not a separate workspace.
- The adapter dependency graph flattens: `sentry-node → observability`
  (direct) rather than `sentry-node → telemetry-redaction-core →
  observability` (hop with no added concept).

Owner direction (2026-04-19): architectural excellence always, in all
situations. Fold into observability; amend ADR-160; delete the
transitional workspace; ship atomically.

---

## Current state (starting disk state)

The scaffolded workspace exists on this branch's working tree as
staged work:

- `packages/core/telemetry-redaction-core/` — 13 files including
  `package.json`, tsconfig triplet, `eslint.config.ts`,
  `vitest.config.ts`, `tsup.config.ts`, `README.md`, plus
  `src/primitives.ts` (139 LOC — 5 thin redaction wrappers),
  `src/index.ts` (re-export), `src/primitives.unit.test.ts` (13 tests,
  green in isolation), `src/zero-sentry-imports.unit.test.ts`
  (structural guard).
- `packages/libs/sentry-node/` — rewired to import primitives from
  `@oaknational/telemetry-redaction-core`; `runtime-telemetry.ts`
  deleted; `runtime-redaction.ts`, `runtime-error.ts`, `runtime.ts`
  updated import paths; `package.json` gained
  `@oaknational/telemetry-redaction-core: workspace:*`.
- `pnpm-workspace.yaml` — lists the new workspace.
- `pnpm-lock.yaml` — reflects the added workspace.

**Lint fails** at the scaffolded workspace: `primitives.ts:24` imports
from `@oaknational/logger`, which is a foundation lib. Two ESLint
errors (`no-restricted-imports` + `import-x/no-restricted-paths`) under
`coreBoundaryRules`. Package.json `dependencies` also declares the
forbidden lib dependency at line 33.

The work done in the scaffold is real and will be preserved by
absorption — the primitive signatures, the TSDoc contracts, the
structural test patterns, and the browser-safety invariant all move
into `@oaknational/observability` in WS1.

---

## Target end state

### Dependency matrix after landing

| Workspace                    | Tier | Deps on core                            | Deps on libs |
| ---------------------------- | ---- | --------------------------------------- | ------------ |
| `@oaknational/observability` | core | type-helpers                            | —            |
| `@oaknational/logger`        | lib  | observability, type-helpers             | —            |
| `@oaknational/sentry-node`   | lib  | observability, logger, result, type-helpers | —        |

Zero new core workspaces. Two fewer than the two-workspace alternative.
The `packages/core/telemetry-redaction-core/` workspace is gone.

### Public surfaces after landing

**`@oaknational/observability`** gains:

- Redaction primitives: `redactText`, `redactUnknownValue`,
  `redactJsonObject`, `redactStringRecord` (moved from the
  scaffolded workspace's `primitives.ts`).
- JSON sanitisation: `sanitiseForJson`, `sanitiseObject`,
  `isJsonValue` (moved from `@oaknational/logger`).
- Unified recursive JSON-safe type: **one** canonical name for the
  shape currently duplicated as `JsonValue`/`JsonObject` in logger
  and `TelemetryValue`/`TelemetryRecord` in observability. Canonical
  name chosen at execution time per type-reviewer guidance; likely
  `JsonValue`/`JsonObject` (the shorter, more widely-recognised
  idiom), with the `Telemetry*` aliases kept as type aliases for
  internal observability use if needed.
- Structural guard: `src/no-node-only-imports.unit.test.ts` —
  asserts `src/**/*.ts` contains no `node:*` import specifier.

**`@oaknational/observability`** retains everything it owns today
(recursive redaction policy, OpenTelemetry span-context helpers).

**`@oaknational/logger`** loses:
- `json-sanitisation.ts` + `json-sanitisation-internals.ts` (moved).
- `JsonValue` / `JsonObject` type definitions (moved).
- `sanitiseForJson` / `sanitiseObject` / `isJsonValue` re-exports from
  its `index.ts` (removed per the no-backwards-compat principle).
- Any logger-internal imports pointing at its own copies — updated to
  import from `@oaknational/observability`.

**`@oaknational/sentry-node`** loses:
- Dependency on `@oaknational/telemetry-redaction-core` (workspace no
  longer exists).

**`@oaknational/sentry-node`** gains direct imports of the redaction
primitives from `@oaknational/observability`.

### Type-gap remediation

The `requireJsonObject` runtime invariant in the scaffolded
`primitives.ts:31` (a `throw` papering over a type gap where
`sanitiseObject(redactTelemetryObject(x))` was typed as possibly-null
despite the input already being a `JsonObject`) is eliminated by
tightening the signature of `redactTelemetryObject` so a
`JsonObject` input provably returns a `JsonObject`. This is covered
by WS6 with type-reviewer at REFACTOR.

### `describeUnknownError` placement

The scaffolded workspace exported `describeUnknownError` — a one-liner
`error instanceof Error ? error.message : String(error)`. Per Barney's
lens it does not meet workspace-public-export thresholds. Two call
sites in `sentry-node/src/runtime.ts`; WS4 inlines them or co-locates
the helper with `normalizeError` in `@oaknational/logger` (whichever
reviewer guidance prefers — docs-adr-reviewer at close).

---

## TDD shape

This is a refactor-extraction with a strong safety net. Per
`.agent/rules/tdd-for-refactoring.md`:

- **RED**: each workspace's test-call-sites update first. In WS1, add
  failing tests against observability's NEW public API
  (`sanitiseForJson`, etc.). TypeScript compile-fails until
  observability exports them. In WS4, sentry-node's imports point at
  observability; compile-fails until the primitives land there.
- **GREEN**: move files, add exports, satisfy imports. Throughout the
  lane, `pnpm --filter @oaknational/sentry-node test` must remain at
  61/61 green (behavioural-parity safety net from ADR-160 barrier
  tests). Tighter invariant: no single commit intermediate ever
  leaves the repo with `pnpm check` failing if that commit is
  intended to land; the atomic-commit shape satisfies this by
  landing WS1–WS9 together.
- **REFACTOR**: unify types, eliminate `requireJsonObject` throw,
  tighten TSDoc, update both workspace READMEs.

No new tests prove anything the existing tests do not already prove
about behaviour; new tests prove **structural invariants** (no
`@sentry/*` in observability, no `node:*` in observability — both are
browser-safety guards).

---

## Atomic commit constraint

Splits are forbidden in this lane. Any interim state either:

1. Leaves `packages/core/telemetry-redaction-core/` with a core→lib
   violation (current state persists), OR
2. Leaves sentry-node depending on a workspace that has lost its
   sanitisation primitives, OR
3. Leaves consumers split between two import paths (some from logger,
   some from observability) — which principles.md's
   no-backwards-compat-shims rule forbids.

All nine work streams (WS1–WS9) land as ONE commit. This matches the
repo's existing pattern for architecturally-atomic lane closures.

---

## Acceptance evidence pattern (§Lane Close)

### Attempt

- JSON sanitisation primitives relocated from `@oaknational/logger`
  (lib) to `@oaknational/observability` (core).
- Value-level redaction primitives absorbed from the scaffolded
  `packages/core/telemetry-redaction-core/` into `@oaknational/observability`.
- `packages/core/telemetry-redaction-core/` workspace deleted.
- Duplicate recursive JSON-safe type canonicalised.
- ADR-160 §Closed Questions amended with dated History entry.
- `describeUnknownError` relocated per reviewer guidance.
- Structural `no-node-only-imports` guard added to observability.

### Observed outcome

- `pnpm check` from repo root with no filter: exit 0.
- `pnpm --filter @oaknational/sentry-node test`: 61/61 green.
- `pnpm --filter @oaknational/observability test`: all new tests
  green including no-node-only-imports and no-sentry-imports.
- `pnpm --filter @oaknational/logger test`: all logger tests green
  after the sanitisation move.
- `ls packages/core/telemetry-redaction-core/ 2>&1`: "No such file or
  directory".
- `grep -r "@oaknational/telemetry-redaction-core" packages/ apps/
  | wc -l`: 0.
- Reviewer matrix passes (see WS8).

### Proven result

Stated as an invariant that would fail if the change were reverted:

1. **Boundary invariant**: `packages/core/**/src/**/*.ts` contains no
   import of `@oaknational/logger` or any other lib. Reverting would
   re-introduce the core→lib violation that triggered this plan.
2. **Canonical-type invariant**: the recursive JSON-safe shape has
   exactly one definition in the repo. Reverting would re-introduce
   the `JsonValue`/`TelemetryValue` duplication.
3. **Composition-free boundary invariant**: `@oaknational/observability`
   owns both redaction policy AND the primitives that compose it. No
   workspace sits between the Sentry adapter and observability.
   Reverting would re-introduce the intermediate workspace hop.
4. **Browser-safety invariant**: `@oaknational/observability/src/**/*.ts`
   contains no `@sentry/*` or `node:*` import. Reverting the
   `no-node-only-imports` test would hide regressions; reverting any
   primitive to use a Node-only API would fail the test.

---

## Reviewer matrix at close (WS8)

Per `.agent/rules/invoke-code-reviewers.md`:

| Reviewer                           | Lens                                                                                          |
| ---------------------------------- | --------------------------------------------------------------------------------------------- |
| `code-reviewer`                    | Gateway quality pass.                                                                         |
| `architecture-reviewer-fred`       | ADR-041 boundary compliance; ADR-160 amendment prose correctness; ADR-154 framework/consumer. |
| `architecture-reviewer-barney`     | Confirms the simplification Barney recommended is realised — one fewer workspace, unified type, flatter graph. |
| `architecture-reviewer-betty`      | Long-term change-cost validation; Barney flagged her as a triangulation check that the merge into observability raises no hidden coupling cost for logger. |
| `type-reviewer`                    | `JsonValue`/`TelemetryValue` unification correctness; elimination of `requireJsonObject` runtime throw via tightened types. |
| `test-reviewer`                    | Test migration discipline; new structural guard (`no-node-only-imports`) proves behaviour rather than configuration. |
| `config-reviewer`                  | `package.json` shapes of the three affected workspaces after move; `pnpm-workspace.yaml` consistency. |
| `docs-adr-reviewer`                | ADR-160 amendment citation graph; logger + observability README updates.                      |
| `sentry-reviewer`                  | ADR-160 closure property still holds post-fold for every fan-out hook wired in sentry-node.   |
| `assumptions-reviewer`             | Overall lane proportionality; triggers for 3+ reviewers and cross-workspace atomic commit are justified. |

Prompts must be self-contained, non-leading, scoped. Findings are
action items unless explicitly rejected with written rationale.

---

## Carried invariants (unchanged)

- `sendDefaultPii: false` (ADR-143) — not affected.
- Non-bypassable redaction barrier closure property (ADR-160) — the
  closure still holds; the per-consuming-workspace conformance tests
  still live in sentry-node's `runtime-redaction-barrier.unit.test.ts`
  (17 tests).
- Network-free PR-check CI boundary (ADR-161) — not affected.
- Five-axis observability + vendor-independence (ADR-162) — not
  affected.
- `Result<T, E>` on new/changed code; `{ cause }` on constructed
  errors in catch — not affected.
- `pnpm check` exit 0 is the merge criterion (PDR-025).
- Tests never touch `process.env` / `process.cwd()` / `.env` files;
  no skipped tests.
- Ask the owner before committing. Non-automated push.

---

## Hard invariants / non-goals

- **No browser adapter work in this lane**. L-12-prereq's original
  purpose (prepare for Wave 4 widget Sentry) is SATISFIED by the fold
  because `@oaknational/observability` is already browser-safe. Wave
  4 L-12 can compose from observability directly.
- **No Sentry Node event-shape changes**. The sentry-node adapter
  continues to own its own `@sentry/node`-typed event-shape
  redactors (`redactSentryEvent`, `redactSentryBreadcrumb`,
  `redactSentryTransaction`, `redactSentrySpan`, `redactSentryLog`)
  composing observability primitives at the field level.
- **No logger public-API expansion**. This plan subtracts from
  logger's public API; it does not add.
- **No new ADR**. ADR-160 is amended (§Closed Questions → History
  entry). The decision to place atomic primitives in core is an
  application of ADR-041 + ADR-155, not a new decision.

---

## Wiring to other plans

This plan is wired into:

- **`observability/active/sentry-observability-maximisation-mcp.plan.md` §L-12-prereq**:
  the L-12-prereq section is updated to name this plan as the
  **blocking prerequisite**. When this plan closes, L-12-prereq
  becomes a trivial confirmation step ("observability primitives
  composed by sentry-node; zero @sentry/* in observability; zero
  node:* in observability") that can either close in the same commit
  as this plan or in a follow-up nano-commit.
- **`observability/high-level-observability-plan.md` §Execution
  Waves**: Wave 1's close criteria gain this plan as a prerequisite.
- **`.agent/prompts/session-continuation.prompt.md` Live Continuity
  Contract**: the next session opens knowing this plan exists and
  either executes it or sequences around it.
- **`observability/what-the-system-emits-today.md` §Update Log**:
  receives an entry at lane close per the maximisation plan's §Lane
  Close Evidence Pattern.

The wiring edits are landed in a SEPARATE commit from this plan
authoring, because the live session that authored this plan should
not bundle cross-plan edits into the plan-creation commit when
parallel agents are concurrently editing those targets. The owner
coordinates the wiring edits next.

---

## Future strategic watchlist

- **Wave 4 L-12 (widget Sentry)** now composes `@oaknational/observability`
  directly. The browser adapter will be a new workspace (e.g.
  `@oaknational/sentry-browser` or integrated into a widget lib)
  depending on observability. No new prerequisite extraction is
  needed.
- **Event-shape decomposition**: the repo now has a clear precedent
  for "vendor adapters own their own event-shape redactors composing
  core primitives". When the browser adapter lands, it follows the
  sentry-node pattern.

---

## First action

Open this plan; dispatch the reviewer matrix at WS8 (or earlier if
owner wants intention-review before execution — several reviewers
can review the plan before code lands). Begin WS1 as the natural
first work stream once the reviewer matrix confirms the shape.

**Expected execution duration**: single focused session. The nine
work streams are mechanical given the reviewer-approved shape. The
type-gap elimination (WS6) is the only sub-task with design
uncertainty; type-reviewer advice before execution would de-risk it.

**No-landing session alternative**: this plan may also close as a
plan-only artefact in the current session if owner prefers to
schedule execution for a dedicated session. In that case the
session-continuation prompt flags the plan as queued and the next
forward-motion session opens it as its landing target.
