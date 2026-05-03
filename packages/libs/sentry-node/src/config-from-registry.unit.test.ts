/**
 * RED-phase **design-pinning** contract for the WS2 SinkRegistry-consumption
 * rewrite of `createSentryConfig`.
 *
 * @remarks This file does NOT provide the WS1 type-check canary signal —
 * its assertion bodies live inside block-comment placeholders (per the
 * SKIP-UNTIL-WS2 header below) and so are not type-checked today. The
 * WS1 type-check canary is provided instead by sibling
 * `runtime-fixture-tee-redaction.unit.test.ts` (`describe.skip` with a
 * full body that compiles against today's `SENTRY_MODE: 'fixture'`
 * shape; deletion of `SENTRY_MODE` from `SentryConfigEnvironment` at
 * WS2 makes that file type-fail deterministically — see plan body §WS1
 * acceptance criteria + napkin §RED-arc skip register entry 2 at
 * `.agent/memory/active/napkin.md`).
 *
 * The role of THIS file is design-pinning: it captures the post-WS2
 * input contract AND output `kind` discriminator on `ParsedSentryConfig`
 * in a copy-paste-uncomment-able shape so WS2 has an unambiguous target.
 * The new input shape adds two orthogonal keys:
 *
 * - `OBSERVABILITY_SINKS: readonly ObservabilitySinkKind[]` — typed list
 *   of external sinks (replaces `SENTRY_MODE`'s sink-selection role)
 * - `OBSERVABILITY_FIXTURES: boolean` — fixture-as-tee toggle (replaces
 *   `SENTRY_MODE='fixture'`'s tee-on role)
 *
 * The new output `kind` discriminator covers four cross-product cases —
 * `sentry-disabled`, `sentry-live`, `sentry-live-with-tee`, and
 * `fixture-only` — per the multi-sink-and-fixtures plan body §WS2.
 *
 * **Cleanup gate** — `it.todo()` is NOT type-system-enforced when the
 * underlying API changes shape. The cleanup gate for this file is a
 * *header audit*: WS2's landing diff MUST grep for the `SKIP-UNTIL-WS2`
 * token below and uncomment all four block-comment-wrapped bodies,
 * replacing the `it.todo(...)` placeholders. The napkin §RED-arc skip
 * register names this future-plan generator: a CI structural-enforcement
 * scanner that fails when an `it.todo` paired with a `SKIP-UNTIL-WSn`
 * header outlives the named workstream's landing commit.
 *
 * Each cross-product case has DISTINCT inputs — fixing the
 * test-reviewer 2026-05-02 finding 1 (identical inputs across
 * `sentry-live` and `sentry-live-with-tee`).
 *
 * @see ./runtime-fixture-tee-redaction.unit.test.ts — WS1 type-check
 *   canary file (described above).
 * @see ../../../../.agent/memory/active/napkin.md — §RED-arc skip
 *   register entry 1 (this file) and entry 2 (canary file).
 * @see ../../../../.agent/plans/observability/current/observability-multi-sink-and-fixtures-shape.plan.md
 */

import { describe, it } from 'vitest';

// SKIP-UNTIL-WS2: Temporarily marked as `it.todo(...)` to keep the
// trunk green during the multi-commit RED arc. The original Round-3
// attempt used `describe.skip` + four TypeScript-suppression
// directives to land the full bodies compile-clean against today's
// narrower `SentryConfigEnvironment`; the project's no-suppression
// ESLint rule bans all such directives, so the shape was changed to
// `it.todo(...)` placeholders backed by inlined commented-out bodies
// (one `/* ... */` block per case immediately above each
// `it.todo(...)`). The WS2 commit that widens
// `SentryConfigEnvironment` to add `OBSERVABILITY_SINKS` /
// `OBSERVABILITY_FIXTURES` and emits the four `kind` discriminators
// on `ParsedSentryConfig` MUST:
//
//   1. Reintroduce the test-data imports immediately below this block:
//        import type { ObservabilitySinkKind } from '@oaknational/observability';
//        import { createSentryConfig } from './config.js';
//        const FULL_SHA = 'c8b666485ecb08b5dc27e428737b4077c0531f57';
//        const VALID_DSN = 'https://public@example.ingest.sentry.io/123';
//        const SINKS_NONE: readonly ObservabilitySinkKind[] = [];
//        const SINKS_SENTRY: readonly ObservabilitySinkKind[] = ['sentry'];
//      (also: `expect` from 'vitest' alongside the existing `describe, it` import)
//   2. Replace each `it.todo(...)` below with the corresponding `it(...)`
//      body by uncommenting the adjacent `/* ... */` block.
//   3. Verify all four cross-product cases pass against the WS2-widened
//      types and the WS2 `kind`-discriminator emission.
//
// Tracking note in .agent/memory/active/napkin.md §RED-arc skip register.
describe('createSentryConfig — WS2 SinkRegistry consumption (RED)', () => {
  /*
  it('emits kind:"sentry-disabled" for sinks=[] + fixtures=false (cross-product 1/4)', () => {
    const result = createSentryConfig({
      APP_VERSION: '1.0.0-test',
      APP_VERSION_SOURCE: 'APP_VERSION_OVERRIDE',
      VERCEL_GIT_COMMIT_SHA: FULL_SHA,
      OBSERVABILITY_SINKS: SINKS_NONE,
      OBSERVABILITY_FIXTURES: false,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(JSON.stringify(result.value)).toContain('"kind":"sentry-disabled"');
  });
  */
  it.todo('emits kind:"sentry-disabled" for sinks=[] + fixtures=false (cross-product 1/4)');

  /*
  it('emits kind:"sentry-live" for sinks=[sentry] + fixtures=false (cross-product 2/4)', () => {
    const result = createSentryConfig({
      APP_VERSION: '1.0.0-test',
      APP_VERSION_SOURCE: 'APP_VERSION_OVERRIDE',
      VERCEL_GIT_COMMIT_SHA: FULL_SHA,
      SENTRY_DSN: VALID_DSN,
      SENTRY_TRACES_SAMPLE_RATE: '0.5',
      SENTRY_RELEASE_OVERRIDE: 'release-live',
      OBSERVABILITY_SINKS: SINKS_SENTRY,
      OBSERVABILITY_FIXTURES: false,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    const serialised = JSON.stringify(result.value);
    expect(serialised).toContain('"kind":"sentry-live"');
    // Tighten against false-positive substring match: 'sentry-live' is a
    // prefix of 'sentry-live-with-tee', so both kinds satisfy the
    // .toContain check above. Excluding the tee discriminator keeps the
    // assertion specific to this cross-product case
    // (docs-adr-reviewer 2026-05-02 finding 8).
    expect(serialised).not.toContain('"kind":"sentry-live-with-tee"');
  });
  */
  it.todo('emits kind:"sentry-live" for sinks=[sentry] + fixtures=false (cross-product 2/4)');

  /*
  it('emits kind:"sentry-live-with-tee" for sinks=[sentry] + fixtures=true (cross-product 3/4)', () => {
    const result = createSentryConfig({
      APP_VERSION: '1.0.0-test',
      APP_VERSION_SOURCE: 'APP_VERSION_OVERRIDE',
      VERCEL_GIT_COMMIT_SHA: FULL_SHA,
      SENTRY_DSN: VALID_DSN,
      SENTRY_TRACES_SAMPLE_RATE: '0.5',
      SENTRY_RELEASE_OVERRIDE: 'release-tee',
      OBSERVABILITY_SINKS: SINKS_SENTRY,
      OBSERVABILITY_FIXTURES: true,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(JSON.stringify(result.value)).toContain('"kind":"sentry-live-with-tee"');
  });
  */
  it.todo(
    'emits kind:"sentry-live-with-tee" for sinks=[sentry] + fixtures=true (cross-product 3/4)',
  );

  /*
  it('emits kind:"fixture-only" for sinks=[] + fixtures=true (cross-product 4/4)', () => {
    const result = createSentryConfig({
      APP_VERSION: '1.0.0-test',
      APP_VERSION_SOURCE: 'APP_VERSION_OVERRIDE',
      VERCEL_GIT_COMMIT_SHA: FULL_SHA,
      SENTRY_RELEASE_OVERRIDE: 'release-fixture',
      OBSERVABILITY_SINKS: SINKS_NONE,
      OBSERVABILITY_FIXTURES: true,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(JSON.stringify(result.value)).toContain('"kind":"fixture-only"');
  });
  */
  it.todo('emits kind:"fixture-only" for sinks=[] + fixtures=true (cross-product 4/4)');
});
