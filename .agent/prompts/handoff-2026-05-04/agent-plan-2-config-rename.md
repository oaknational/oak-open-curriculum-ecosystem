# Agent prompt — Plan 2 (atomic config rename)

You are picking up the multi-sink rename: replace
`SENTRY_MODE = off | fixture | sentry` with
`OBSERVABILITY_SINKS` × `OBSERVABILITY_FIXTURES` orthogonal axes.
The new types already exist in `packages/core/env` and
`packages/core/observability` (landed at WS1, commit `a3a0222a`);
the old shape is still consumed by sentry-node + both apps. This
plan finishes the migration as a single atomic landing.

## Plan

[`.agent/plans/observability/current/replace-sentry-mode-with-observability-sinks.plan.md`](../../plans/observability/current/replace-sentry-mode-with-observability-sinks.plan.md)

Three cycles. Cycle 1 is the atomic rename (~30 files); cycles 2 + 3
are doc-only and parallel-safe with cycle 1.

## Why one atomic landing

Per Tidal Flowing Reef's cascade analysis (comms event
`claude-f879e0-tidal-step-back-and-cascade-finding`, 2026-05-03):
producer-first sequencing (rewrite sentry-node first, then env, then
each app) leaves ~10–15 app tests RED across multiple commits because
the apps' typed fixtures still build `SENTRY_MODE: 'sentry'`-driven
`RuntimeConfig`. That is the multi-commit-TDD-skip-register pattern
owner deleted on 2026-05-03 in commit `60b9ff4c`.
`replace-don't-bridge` (principles.md §Refactoring) forbids the
transitional shims that would let sentry-node land independently.
Therefore: one atomic landing of producer + consumers + tests.

## Session-open

1. Run `/jc-start-right-quick`.
2. Read [`.agent/memory/active/napkin.md`](../../memory/active/napkin.md)
   from line ~315 onward (Salty + Tidal 2026-05-03 entries —
   especially Tidal's WS2 cascade finding and framing-trap recognition).
3. Read [`.agent/prompts/agentic-engineering/collaboration/experiments/E1/closure.md`](../agentic-engineering/collaboration/experiments/E1/closure.md).
4. Read the plan end-to-end.
5. Verify the file list against the current tree:
   `grep -rln "SENTRY_MODE\|SentryMode\|SentryEnvSchema" packages/ apps/
   --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=archive`
   gives you the consumer surface.
6. PDR-027 identity preflight; open a claim covering the file list
   you intend to touch (close to ~30 files; keep the claim's `areas`
   honest).
7. Post a session-open comms event with your landing target stated
   plainly.

## Landing target — cycle 1

Single commit. All four workspaces' renames + all tests + the four
currently-skipped WS1 RED tests unskipped and greened — together.
Tree green at the end.

Substance:

- `packages/libs/sentry-node/`: delete `SentryMode`; recompose
  `ParsedSentryConfig` as four-kind discriminated union
  (`sentry-disabled` / `sentry-live` / `sentry-live-with-tee` /
  `fixture-only`) derived from
  `(sinks.includes('sentry'), fixtures)` cross-product. Rename
  `FixtureSentryStore` → `FixtureCaptureStore`,
  `FixtureSentryCapture*` → `FixtureCaptureRecord*`. Rewrite
  `config.ts`, `runtime.ts`, `runtime-sinks.ts`. Unskip
  `config-from-registry.unit.test.ts` and
  `runtime-fixture-tee-redaction.unit.test.ts`.
- `packages/core/env/`: `SentryEnvSchema` gains `@deprecated` tag and
  is DELETED at the end of the same commit. Tests for the deprecated
  schema deleted as orphaned. Apps' env types extend
  `ObservabilityEnvSchema` instead.
- `apps/oak-curriculum-mcp-streamable-http/`: `src/env.ts` switches;
  `src/observability/http-observability.ts` consumes the new kind
  discriminator; unskip `http-observability.unit.test.ts`;
  `build-scripts/sentry-build-environment.ts` drops `SENTRY_MODE`;
  `e2e-tests/helpers/test-config.ts` `createMockRuntimeConfig`
  migrates inputs.
- `apps/oak-search-cli/`: same pattern in `cli-observability.ts`,
  `src/lib/env.ts`, `src/lib/logger.ts`. Unskip
  `cli-observability.unit.test.ts`.

After the commit:

- `pnpm test` and `pnpm test:e2e` exit 0.
- `grep -rn "SENTRY_MODE\|SentryMode\|SentryEnvSchema" packages/ apps/
  --exclude-dir=archive --exclude-dir=node_modules --exclude-dir=dist`
  returns zero.
- `grep -rn "FixtureSentryStore\|FixtureSentryCapture" packages/ apps/
  --exclude-dir=archive --exclude-dir=node_modules --exclude-dir=dist`
  returns zero.

## Cycles 2 + 3 (parallel-safe with cycle 1)

- **Cycle 2**: ADR-171 (orthogonal-axes canonical decision record).
  Re-verify number `171` is still next-available
  immediately before authoring. If cycle 1's commit SHA isn't
  available yet, leave a `<!-- TODO: insert cycle-1 SHA -->`
  placeholder and fill it in a follow-on commit after cycle 1 lands.
- **Cycle 3**: `.env.example` + READMEs across both apps and the
  three relevant packages. Doc-only.

A second agent CAN take cycles 2 + 3 in parallel with you working
cycle 1.

## Soft cross-plan dependency on plan 1

Cycle 1's "boot with `OBSERVABILITY_SINKS=['sentry']` and valid DSN"
acceptance criterion exercises a code path (release resolution) that
plan 1 fixes. With default `OBSERVABILITY_SINKS=[]`, this plan can
land independently; with the sentry sink enabled, plan 1's
`local-dev` fall-through is required. If plan 1 hasn't landed yet,
verify the sentry-enabled boot acceptance after plan 1 lands. The
default-empty boot acceptance is independent.

## Reviewer dispatch

- `type-reviewer` (discriminated-union cross-product correctness;
  no `as`/`!`/`unknown`; warnings-channel typing).
- `sentry-reviewer` (vendor semantics preserved; redaction barrier
  intact across the rename).
- `test-reviewer` (TDD-as-pairs cycle; the 4 RED tests unskip in the
  same commit as their product code).
- `architecture-reviewer-fred` (boundary discipline; framework vs
  consumer placement; no cross-package leakage of vendor shapes).
- `code-reviewer` gateway.
- `docs-adr-reviewer` + `onboarding-reviewer` for cycle 2 + 3.

## Session-close

- Close your claim.
- Update thread record identity row.
- Post a comms event noting cycle 1 landed (or a session-paused
  event if you didn't land it, with explicit reasons).

## Hard rules in scope

- We never use git to remove work.
  (`.agent/rules/never-use-git-to-remove-work.md`)
- No transitional shims (`replace-don't-bridge`).
- TDD-as-pairs: test + product code land together; tree green at the
  end of every commit.
- Strict-and-complete: one config contract, rigorously typed, no
  dual-shape consumers.
