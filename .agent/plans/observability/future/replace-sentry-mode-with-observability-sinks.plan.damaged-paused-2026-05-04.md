---
name: "Replace SENTRY_MODE single-axis config with OBSERVABILITY_SINKS × OBSERVABILITY_FIXTURES orthogonal axes"
overview: >
  Single atomic landing of the producer (sentry-node) and all consumers
  (env package, HTTP MCP app, Search CLI app) that finishes the
  half-landed multi-sink rename started at WS1 (commit a3a0222a). All
  callsites move from SENTRY_MODE consumption to SinkRegistry
  consumption in one commit; tree green at end. Docs and ADRs land
  alongside as separate commits; they are parallel-safe with the
  rename commit.
status: paused
isProject: true
todos:
  - id: cycle-1-atomic-rename
    content: "ONE COMMIT (atomic rename, all tests green at end): sentry-node + env package + HTTP MCP app + Search CLI app + tests. Delete SentryMode type. Recompose ParsedSentryConfig as four-kind discriminated union (sentry-disabled / sentry-live / sentry-live-with-tee / fixture-only) derived from (sinks.includes('sentry'), fixtures) cross-product. Rename FixtureSentryStore → FixtureCaptureStore + FixtureSentryCapture* → FixtureCaptureRecord*. SentryEnvSchema gains @deprecated tag, NOT deleted (deletion is the final hunk of this same commit, after both apps' env shapes flip). Apps' env types extend ObservabilityEnvSchema instead of SentryEnvSchema. HTTP MCP http-observability.ts and Search CLI cli-observability.ts consume the new ParsedSentryConfig kind discriminator. e2e-tests/helpers/test-config.ts createMockRuntimeConfig migrates to OBSERVABILITY_SINKS / OBSERVABILITY_FIXTURES inputs. New TDD test+code pairs (per testing-strategy §When Behaviour Changes) cover the four-kind cross-product (sinks=[]+fixtures=false→sentry-disabled; sinks=[sentry]+fixtures=false→sentry-live; sinks=[sentry]+fixtures=true→sentry-live-with-tee; sinks=[]+fixtures=true→fixture-only) and the WS4/WS5 SinkRegistry-construction obligations on http-observability and cli-observability composition roots. Acceptance: tree green at end (full pnpm test + pnpm test:e2e); grep -rn 'SENTRY_MODE\\|SentryMode\\|SentryEnvSchema' packages/ apps/ --exclude-dir=archive returns zero matches outside historical doc references."
    status: pending
  - id: cycle-2-adr-171
    content: "ONE COMMIT (parallel-safe with cycle 1): author docs/architecture/architectural-decisions/171-observability-configuration-orthogonality.md as the canonical decision record for the orthogonal-axes shape. Re-verify the number 171 is still next-available with `ls docs/architecture/architectural-decisions/ | sort -n | tail -3` immediately before authoring. If cycle 1's commit SHA is not yet available at authoring time, leave a `<!-- TODO: insert cycle-1 SHA -->` placeholder in §History and fill it in a follow-on commit AFTER cycle 1 lands; the cycle is not blocked on cycle 1's commit."
    status: pending
  - id: cycle-3-readmes-and-env-example
    content: "ONE COMMIT (parallel-safe with cycle 1): update apps/oak-curriculum-mcp-streamable-http/.env.example + apps/oak-search-cli/.env.example (replace SENTRY_MODE block with OBSERVABILITY_SINKS / OBSERVABILITY_FIXTURES block); update packages/libs/sentry-node/README.md + packages/core/env/README.md + packages/core/observability/README.md exports listing; update apps/oak-curriculum-mcp-streamable-http/README.md + apps/oak-search-cli/README.md observability sections."
    status: pending
---

# Replace SENTRY_MODE with OBSERVABILITY_SINKS — DAMAGED, PAUSED, SUPERSEDED

**Last Updated**: 2026-05-04
**Status**: 🛑 DAMAGED — PAUSED — SUPERSEDED. Owner-directed pause and descope from `feat/eef_exploration` merge-readiness arc.

## Owner Direction (2026-05-04, Fronded Climbing Thicket)

> *close plan 2, it keeps causing issues, clearly there is some foundational
> tension in it that has not yet been named, move it to paused and move it to
> a future folder.*
>
> *create a new plan to finish the remaining actual work, keep it simple,
> linear, straightforward and comprehensive. mark the old plan as damaged and
> superseded.*

**Superseded for the current branch arc by**:
[`current/eef-branch-merge-readiness.plan.md`](../current/eef-branch-merge-readiness.plan.md)
— covers what was actually needed to ship `feat/eef_exploration`: green
gates, dev-server boot probe, MCP tool exercise, merge readiness.

## Why this plan is damaged-paused

This plan repeatedly created friction during execution attempts and the
underlying cause is **foundational and unnamed**:

- Multi-commit landings raced foreign-stage absorption (peer agents
  committed before the rename's atomic landing could complete).
- The "atomic, not parallelisable" framing got conflated with
  "single commit", which over-constrained the decomposition options
  available; smaller TDD-correct cycles each landing green were always
  permissible per `tdd-as-design.md` but were not visible from the plan
  body's framing.
- The rename mixes two structurally-different changes — a
  cosmetic-shaped rename (`mode` → `kind`, `FixtureSentryStore` →
  `FixtureCaptureStore`) and a substantive type-shape change (3-kind
  union → 4-kind discriminated union) — and these have different
  sequencing characteristics that the plan body did not separate.
- WS1's already-landed schemas + sink-registry types coexist in tree
  with the legacy `SENTRY_MODE` consumer flow without a forcing
  function; the dev server functions either way, so the rename has
  no functional gate driving it forward.

The substance — moving from `SENTRY_MODE` to
`OBSERVABILITY_SINKS × OBSERVABILITY_FIXTURES` orthogonal axes — is
real future work. The framing in this plan body is not yet ready for
a clean re-attempt; resuming it would inherit the same friction.

**Do not pick this plan up as-is.** Before resuming the rename concept,
the foundational tension must be named (likely as a PDR or an ADR
amendment) and the plan body must be re-shaped accordingly. The four
suspected-but-unnamed candidates above are starting points, not
conclusions.

## Resumption preconditions

1. The foundational tension is named in a durable artefact (PDR, ADR,
   or pattern record).
2. The rename is re-decomposed into clean TDD cycles, each landing
   green, with the cosmetic-vs-structural-change axis separated.
3. The current branch (`feat/eef_exploration`) is merged so the rename
   doesn't race other branch closure work.
4. Owner explicitly re-opens the work.

## Original Plan Body (preserved below for the substance content)

The remainder of this file is the original plan body as it was authored
2026-05-03 and lightly refreshed 2026-05-04. Field shapes, file
inventories, design choices in §Cycles are still substantively useful
when the rename is resumed; the framing is what's damaged, not the
detailed substance.

---

## Context

WS1 of the multi-sink rename landed at commit `a3a0222a`. It introduced
the new types in `core/`:

- `packages/core/env/src/schemas/observability{,-axes,-base,-refinements}.ts`
  — `OBSERVABILITY_SINKS` array Zod schema + `OBSERVABILITY_FIXTURES`
  boolean + cross-field `superRefine` rules.
- `packages/core/observability/src/sink-registry.ts` —
  `ObservabilitySinkKind` literal union + typed `SinkRegistry` map.
- `packages/libs/env-resolution/src/types.ts` — `EnvWarning` discriminated
  union for the warnings channel.

The four `describe.skip` / `it.todo` "RED-arc" placeholders that WS1
authored to pin future cycles were deleted upstream (commit `2a2d1b05`,
plan 1 §Cycle 1 step 7) under the binary `no-skipped-tests` rule. The
obligations they encoded (sentry-node four-kind cross-product,
fixture-tee closure-property, HTTP/CLI SinkRegistry construction) are
re-spec'd as proper TDD test+code pairs in this cycle.

Plan 1 (`archive/completed/fix-dev-boot-release-resolution.plan.md`)
landed at commit `2a2d1b05`: `resolveDevelopmentRelease` falls through
to `local-dev` in development when no Vercel attribution is available.
This means the `OBSERVABILITY_SINKS=["sentry"]` boot path (acceptance
criterion below) no longer carries a cross-plan dependency.

Old `SENTRY_MODE` shape is still consumed everywhere: `sentry-node`'s
`config.ts` / `runtime.ts` / `runtime-sinks.ts`, both apps' env types
(`Env = z.input<typeof BaseEnvSchema>` extends `SentryEnvSchema.shape`),
both apps' `http-observability.ts` / `cli-observability.ts` consumers
of `ParsedSentryConfig.mode`, and the e2e test helper
`createMockRuntimeConfig` builds typed `RuntimeConfig` fixtures with
`SENTRY_MODE: 'sentry'`.

Per Tidal Flowing Reef's cascade analysis (2026-05-03 napkin):
producer-first sequencing (WS2 sentry-node → WS3 env → WS4 HTTP MCP →
WS5 Search CLI) leaves ~10–15 app tests RED across multiple commits.
That is the multi-commit-TDD-skip-register shape owner deleted in
commit `60b9ff4c`. `replace-don't-bridge` (principles.md §Refactoring)
forbids transitional shims that would let WS2 land independently. The
architecturally-correct shape is one atomic landing of producer +
consumers + tests together.

## Foundation Alignment

- **principles.md §Strict and Complete**: one config contract,
  rigorously typed. No transitional dual-shape consumers.
- **principles.md §Refactoring → NEVER create compatibility layers**:
  no bridge between SENTRY_MODE and OBSERVABILITY_SINKS.
- **principles.md §Architectural Excellence Over Expediency**: the
  rename touches ~30 files across 4 workspaces because the contract
  spans them; landing them separately is the rush-impulse shape.
- **testing-strategy.md §TDD-as-pairs**: one atomic cycle landing all
  tests + all product code together. Tree green at end.
- **principles.md §Cardinal Rule**: types flow from schema; the new
  `ObservabilityEnvSchema` is the single source of truth, generated
  through normal Zod inference.

## Cycles

### Cycle 1 — Atomic rename (~30 files, single commit)

**Atomic, NOT parallelisable**: this cycle cannot be decomposed into
independent sub-cycles. The producer's contract change breaks consumer
type-checks the moment it lands; the cure is in the consumers; the
type system enforces lockstep across packages. Per Tidal's analysis,
splitting the cycle reintroduces the multi-commit-TDD-skip-register
pattern.

**Files touched** (canonical list — re-verify with grep before
authoring; the count is approximate):

- **`packages/libs/sentry-node`** (~10 files): `types.ts` (delete
  `SentryMode`, recompose `ParsedSentryConfig` as four-kind discriminated
  union), `types-fixture.ts`, `fixture.ts`, `config.ts` (rewrite
  `parseMode` and dispatch), `runtime.ts`, `runtime-sinks.ts`,
  `index.ts` (export updates), plus existing test files updated for the
  new shape and new TDD test+code pairs added for the four-kind cross-
  product. (`runtime-error.ts` already lost the `missing_git_sha` branch
  in `fix-dev-boot-release-resolution.plan.md`.) Rename
  `FixtureSentryStore` → `FixtureCaptureStore`, `FixtureSentryCapture*`
  → `FixtureCaptureRecord*`.
- **`packages/core/env`** (~5 files): `src/schemas/sentry.ts` gains
  `@deprecated` JSDoc and is DELETED at the end of this same commit
  (after both apps flip); `src/schemas/index.ts` removes the
  `SentryEnvSchema` re-export; `src/index.ts` replaces it with
  `ObservabilityEnvSchema`; `tests/schemas/sentry.unit.test.ts` is
  DELETED (orphaned).
- **`packages/libs/env-resolution`** (1 file if needed): warnings
  channel propagation in `resolveEnv` Result so the legacy-rename
  warnings the schemas emit reach consumers.
- **`apps/oak-curriculum-mcp-streamable-http`** (~10 files): `src/env.ts`
  (replace `SentryEnvSchema.shape` with `ObservabilityEnvSchema.shape`),
  `src/runtime-config.ts` / `src/runtime-config-from-validated-env.ts`
  (consume new shape), `src/observability/http-observability.ts` (kind
  discriminator switch), `src/observability/http-observability.unit.test.ts`
  (new test+code pairs covering SinkRegistry construction from
  `OBSERVABILITY_SINKS`), `src/observability/http-observability.integration.test.ts`,
  `build-scripts/sentry-build-environment.ts` (drop `SENTRY_MODE` from
  the inherited `SentryConfigEnvironment` type), `e2e-tests/helpers/test-config.ts`
  (`createMockRuntimeConfig` migrates inputs).
- **`apps/oak-search-cli`** (~5 files): `src/observability/cli-observability.ts`
  - `cli-observability.unit.test.ts` (new test+code pairs covering
  SinkRegistry construction from `OBSERVABILITY_SINKS`), `src/lib/env.ts`
  - tests, `src/lib/logger.ts` (`registerAdditionalSink` path).

**Acceptance criteria**:

- `pnpm test` (all workspaces) exit 0; zero skipped tests in
  observability surfaces.
- `pnpm test:e2e` exit 0.
- `pnpm type-check` exit 0.
- `pnpm lint:fix` exit 0.
- `pnpm build` exit 0.
- `grep -rn "SENTRY_MODE\\|SentryMode\\|SentryEnvSchema" packages/ apps/
  --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=archive`
  returns zero matches.
- `grep -rn "FixtureSentryStore\\|FixtureSentryCapture" packages/ apps/
  --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=archive`
  returns zero matches.
- `pnpm dev` boots in HTTP MCP and Search CLI workspaces with
  `OBSERVABILITY_SINKS=[]` (default).
- `pnpm dev` with `OBSERVABILITY_SINKS=["sentry"]` and valid DSN boots
  cleanly. Plan 1 (`local-dev` release fall-through) has landed in
  commit `2a2d1b05`, so the sentry-enabled dev-boot path no longer
  carries an external blocker; verification is unconditional.

**Validation**:

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint
pnpm test
pnpm test:e2e
grep -rn "SENTRY_MODE\|SentryMode\|SentryEnvSchema" packages/ apps/ \
  --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=archive
# expect: zero matches
grep -rn "FixtureSentryStore\|FixtureSentryCapture" packages/ apps/ \
  --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=archive
# expect: zero matches
```

### Cycle 2 — ADR-171 (parallel-safe with cycle 1)

**Parallel-safe**: yes. Different file (`docs/architecture/architectural-decisions/171-...`),
no code dependencies. Can be drafted concurrently with cycle 1; should
land in same PR but as a separate commit referencing cycle 1's SHA.

Author the canonical decision record for the orthogonal-axes shape.
Re-verify ADR number `171` is still next-available with
`ls docs/architecture/architectural-decisions/ | sort -n | tail -3`
immediately before authoring. Cite cycle 1's commit SHA in the §History
block.

**Acceptance criteria**:

- `pnpm doc-gen` exit 0.
- `pnpm markdownlint:root` exit 0.

### Cycle 3 — READMEs + .env.example (parallel-safe with cycle 1)

**Parallel-safe**: yes. Different files, no code dependencies. Can be
drafted concurrently with cycle 1.

Update:

- `apps/oak-curriculum-mcp-streamable-http/.env.example` + `apps/oak-search-cli/.env.example`:
  replace SENTRY_MODE block with `OBSERVABILITY_SINKS` /
  `OBSERVABILITY_FIXTURES` block.
- `packages/libs/sentry-node/README.md`, `packages/core/env/README.md`,
  `packages/core/observability/README.md` exports listing.
- `apps/oak-curriculum-mcp-streamable-http/README.md` + `apps/oak-search-cli/README.md`
  observability sections.

**Acceptance criteria**:

- `pnpm markdownlint:root` exit 0.

## Quality Gates

After cycle 1 close (the atomic rename is the load-bearing gate):

```bash
pnpm clean
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm doc-gen
pnpm format:root
pnpm markdownlint:root
pnpm lint:fix
pnpm test
pnpm test:e2e
pnpm test:ui
pnpm test:a11y
pnpm portability:check
pnpm subagents:check
pnpm test:root-scripts
pnpm practice:fitness:informational
```

All exit 0.

## Non-Goals

- **NOT** fixing the dev-boot bug. That is plan 1. (Independent — the
  bug fix in `release-internals.ts` is in `core/build-metadata` which
  this plan does not touch.)
- **NOT** retiring smoke tests. That is plan 3. (Independent — smoke-tests
  is not touched by this plan.)
- **NOT** introducing the `ServerInstrumenter` port or the
  `no-vendor-observability-import` ESLint rule. Those were WS6 of the
  superseded multi-sink plan; they are a separate architectural concern
  (vendor-import boundary), not part of the config rename. They can be
  planned separately on their own merits later.
- **NOT** authoring ADR-116 / ADR-143 / ADR-162 / ADR-163 amendments.
  ADR-171 is sufficient as the canonical record for the new shape; any
  amendment to older ADRs is deferred until shown to be necessary by a
  consumer-side question.

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Cycle 1's atomic landing is too large to review safely | Medium | High | The cycle is structurally one logical change (atomic rename); reviewers can read the diff package-by-package. The parallel-safe cycles 2 and 3 land separately to keep code-vs-doc reviewer scope clean |
| WS1's RED tests pinned obligations that turn out to be wrong | Low | Medium | The tests are unskipped and greened in cycle 1; if the obligations are wrong, the test edits live in the same commit and are reviewer-visible |
| `SentryEnvSchema` is consumed somewhere we missed | Mitigated | High | `grep` validation against the entire monorepo as the cycle's exit gate |
| Mid-flight peer agent claim collision (Tidal Flowing Reef holds claim 99717aca on sentry-node) | Mitigated | Low | Tidal explicitly paused execution pending owner direction (comms event 2026-05-03T19:13Z); when this plan is dispatched, Tidal's claim closes or transfers. Coordination via the comms log |

## Reviewer Dispatch

- **`type-reviewer`** (discriminated-union cross-product correctness;
  no `as`/`!`/`unknown`; warnings-channel typing).
- **`sentry-reviewer`** (vendor semantics preserved; redaction barrier
  intact across the rename).
- **`test-reviewer`** (TDD-as-pairs cycle; the 4 RED tests unskip in
  the same commit as their product code).
- **`architecture-reviewer-fred`** (boundary discipline: framework vs
  consumer placement; no cross-package leakage of vendor shapes).
- **`code-reviewer`** gateway.
- **`docs-adr-reviewer`** + **`onboarding-reviewer`** for cycle 2 + 3.

## Plan Exit

- Cycle 1 commit landed.
- Cycle 2 (ADR-171) landed.
- Cycle 3 (READMEs + .env.example) landed.
- Quality gates green.

## Consolidation

After plan close, run `/jc-consolidate-docs`.

## Independence

This plan is **file-level** independent of plan 3 (smoke-test
retirement). It does not touch `apps/.../smoke-tests/`. Plan 1
(`archive/completed/fix-dev-boot-release-resolution.plan.md`) has
landed in commit `2a2d1b05`; the previously-soft dependency on plan 1
is now historical, and the `OBSERVABILITY_SINKS=["sentry"]` boot
acceptance criterion can be verified directly.

**No direct file conflict with plan 3**: although plan 3 deletes
`smoke-tests/modes/local-stub-env.{ts,unit.test.ts}` (which currently
references `SENTRY_MODE`), this plan's cycle 1 does not touch
`smoke-tests/`. If plan 3 lands first, those files vanish and this
plan's file list shrinks; if this plan lands first, the renamed file
is then deleted by plan 3. Either order is safe.

## Supersession

This plan replaces:

- `.agent/plans/observability/current/observability-multi-sink-and-fixtures-shape.plan.md`
  (full multi-WS sequencing — superseded by atomic landing per Tidal's
  cascade finding).
- `.agent/plans/observability/current/there-is-no-time-hashed-starfish.plan.md`
  ARCs B0 + B1–B10 (the parts about the multi-sink rename — ARC A
  smoke-harness scaffolding is plan 3's concern, ARC C push/preview/
  merge stays as standalone post-rename work).

Both superseded plans should be moved to `archive/superseded/` with
single-line linking notes pointing at this plan as the replacement.
