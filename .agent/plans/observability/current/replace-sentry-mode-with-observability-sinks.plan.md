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
status: current
isProject: true
todos:
  - id: cycle-1-atomic-rename
    content: "ONE COMMIT (atomic rename, all tests green at end): sentry-node + env package + HTTP MCP app + Search CLI app + tests. Delete SentryMode type. Recompose ParsedSentryConfig as four-kind discriminated union (sentry-disabled / sentry-live / sentry-live-with-tee / fixture-only) derived from (sinks.includes('sentry'), fixtures) cross-product. Rename FixtureSentryStore → FixtureCaptureStore + FixtureSentryCapture* → FixtureCaptureRecord*. SentryEnvSchema gains @deprecated tag, NOT deleted (deletion is the final hunk of this same commit, after both apps' env shapes flip). Apps' env types extend ObservabilityEnvSchema instead of SentryEnvSchema. HTTP MCP http-observability.ts and Search CLI cli-observability.ts consume the new ParsedSentryConfig kind discriminator. e2e-tests/helpers/test-config.ts createMockRuntimeConfig migrates to OBSERVABILITY_SINKS / OBSERVABILITY_FIXTURES inputs. The 4 currently-skipped WS1 RED tests (config-from-registry.unit.test.ts; runtime-fixture-tee-redaction.unit.test.ts; http-observability.unit.test.ts; cli-observability.unit.test.ts) are unskipped and greened in this commit. Acceptance: tree green at end (full pnpm test + pnpm test:e2e); grep -rn 'SENTRY_MODE\\|SentryMode\\|SentryEnvSchema' packages/ apps/ --exclude-dir=archive returns zero matches outside historical doc references."
    status: pending
  - id: cycle-2-adr-171
    content: "ONE COMMIT (parallel-safe with cycle 1): author docs/architecture/architectural-decisions/171-observability-configuration-orthogonality.md as the canonical decision record for the orthogonal-axes shape. Re-verify the number 171 is still next-available with `ls docs/architecture/architectural-decisions/ | sort -n | tail -3` immediately before authoring. If cycle 1's commit SHA is not yet available at authoring time, leave a `<!-- TODO: insert cycle-1 SHA -->` placeholder in §History and fill it in a follow-on commit AFTER cycle 1 lands; the cycle is not blocked on cycle 1's commit."
    status: pending
  - id: cycle-3-readmes-and-env-example
    content: "ONE COMMIT (parallel-safe with cycle 1): update apps/oak-curriculum-mcp-streamable-http/.env.example + apps/oak-search-cli/.env.example (replace SENTRY_MODE block with OBSERVABILITY_SINKS / OBSERVABILITY_FIXTURES block); update packages/libs/sentry-node/README.md + packages/core/env/README.md + packages/core/observability/README.md exports listing; update apps/oak-curriculum-mcp-streamable-http/README.md + apps/oak-search-cli/README.md observability sections."
    status: pending
---

# Replace SENTRY_MODE with OBSERVABILITY_SINKS

**Last Updated**: 2026-05-03
**Status**: 🔴 NOT STARTED

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

Plus 4 RED tests pinning the future cycles:

- `packages/libs/sentry-node/src/config-from-registry.unit.test.ts`
  (4 `it.todo`).
- `packages/libs/sentry-node/src/runtime-fixture-tee-redaction.unit.test.ts`
  (`describe.skip`).
- `apps/oak-curriculum-mcp-streamable-http/src/observability/http-observability.unit.test.ts`
  (`describe.skip`).
- `apps/oak-search-cli/src/observability/cli-observability.unit.test.ts`
  (`describe.skip`).

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
  `runtime-error.ts` (drop `missing_git_sha` from sentry-node-side
  surface — it lives in build-metadata still, but sentry-node no longer
  raises it because release resolution doesn't fire when sinks is `[]`),
  `index.ts` (export updates), plus 6 test files including unskipping
  `config-from-registry.unit.test.ts` and `runtime-fixture-tee-redaction.unit.test.ts`.
  Rename `FixtureSentryStore` → `FixtureCaptureStore`,
  `FixtureSentryCapture*` → `FixtureCaptureRecord*`.
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
  (unskip `describe.skip`), `src/observability/http-observability.integration.test.ts`,
  `build-scripts/sentry-build-environment.ts` (drop `SENTRY_MODE` from
  the inherited `SentryConfigEnvironment` type), `e2e-tests/helpers/test-config.ts`
  (`createMockRuntimeConfig` migrates inputs).
- **`apps/oak-search-cli`** (~5 files): `src/observability/cli-observability.ts`
  - `cli-observability.unit.test.ts` (unskip), `src/lib/env.ts` + tests,
  `src/lib/logger.ts` (`registerAdditionalSink` path).

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
  cleanly **provided plan 1 has landed** — the sentry-enabled boot
  path still routes through `resolveDevelopmentRelease`, which fails on
  missing `VERCEL_GIT_COMMIT_SHA` until plan 1 introduces the
  `local-dev` fall-through. If plan 1 has not landed yet, this
  acceptance criterion is conditional and the verification is deferred
  to whichever ordering is chosen at execution time. (See §Independence
  for cross-plan ordering options.)

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

This plan is **file-level** independent of plan 1 (dev-boot bug fix)
and plan 3 (smoke-test retirement). It does not touch
`packages/core/build-metadata/` (plan 1) or `apps/.../smoke-tests/` /
`apps/.../e2e-tests/dev-server-boots-*.test.ts` (plan 3).

**Soft cross-plan dependency on plan 1**: cycle 1's "boot with
`OBSERVABILITY_SINKS=["sentry"]` and valid DSN" acceptance criterion
exercises a code path (release resolution) that plan 1 fixes. With
default `OBSERVABILITY_SINKS=[]`, this plan can land independently;
with the sentry sink enabled, plan 1's `local-dev` fall-through is
required. Either land plan 1 first, or accept that plan 2's
sentry-enabled-boot acceptance is verified after plan 1 lands.

**No direct file conflict with plan 3**: even though plan 3 deletes
`smoke-tests/modes/local-stub-env.ts`, this plan's cycle 1 does not
touch `smoke-tests/`. The file lists explicitly exclude it.

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
