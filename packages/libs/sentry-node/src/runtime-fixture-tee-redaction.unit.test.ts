import type { LogContext, OtelLogRecord } from '@oaknational/logger';
import { REDACTED_VALUE } from '@oaknational/observability';
import { describe, expect, it } from 'vitest';
import { createSentryConfig } from './config.js';
import { createFixtureSentryStore } from './fixture.js';
import { createFixtureLogSink } from './runtime-sinks.js';
import type { ParsedSentryConfig } from './types.js';

/**
 * RED-phase contract test for the WS2/WS3 fixture-as-tee invariant.
 *
 * @remarks ADR-160 §The Closure Property mandates that any sink observing
 * the SDK fan-out — live or fixture — see only post-redaction payloads.
 * Under the WS1 multi-sink + fixtures contract (plan body §D1 — fixtures
 * orthogonal switch, fixtures are a tee that observes post-redaction
 * events) the `FixtureSentryStore` (renamed `FixtureCaptureStore` in WS2)
 * is no longer an alternative to the live SDK; it is a TEE that observes
 * the same redacted payload the live sinks see when
 * `OBSERVABILITY_FIXTURES=true`.
 *
 * This file pins the END-STATE invariant ("the fixture store contains
 * only redacted captures") by writing a PII-bearing event through the
 * public fixture-sink surface and asserting the capture is redacted.
 * The WS2/WS3 implementation may achieve this via sink-internal
 * redaction, a wrapping decorator, or by re-routing the fixture sink to
 * subscribe AFTER the existing redaction hook on the live SDK fan-out
 * path — the test is agnostic to that choice and asserts the end state
 * only. Today the fixture sink emits raw payloads, so the test FAILS at
 * the runtime assertion ("expected raw PII to be redacted") — a "consumer
 * not yet wired" RED canary signal per WS1 §TDD discipline.
 *
 * The test addresses test-reviewer 2026-05-02 finding 2 by widening the
 * narrative from "post-redaction subscription path" to "redaction is
 * applied before the fixture store records the event"; the test does
 * not depend on the specific wiring choice.
 *
 * No `as` / `!` / `unknown` is introduced; the `OtelLogRecord` shape is
 * built from `@oaknational/logger`'s exported types verbatim. Extracted
 * to a sibling file (rather than appended to
 * `runtime-redaction-barrier.unit.test.ts`) to respect the package
 * `max-lines: 700` rule.
 *
 * @see ../../../../docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md
 * @see ../../../../.agent/plans/observability/current/observability-multi-sink-and-fixtures-shape.plan.md
 */

const SENSITIVE_BEARER = 'Bearer super-secret-abc123';
const SENSITIVE_LINE = `INFO request:1 -- payload Bearer super-secret-abc123 -- end`;

function createFixtureLogTestEvent(): {
  readonly level: 'INFO';
  readonly message: string;
  readonly context: LogContext;
  readonly otelRecord: OtelLogRecord;
  readonly line: string;
} {
  return {
    level: 'INFO',
    message: SENSITIVE_BEARER,
    context: {},
    otelRecord: {
      Timestamp: '2026-05-02T00:00:00.000Z',
      ObservedTimestamp: '2026-05-02T00:00:00.000Z',
      SeverityNumber: 9,
      SeverityText: 'INFO',
      Body: SENSITIVE_BEARER,
      Resource: {
        'service.name': 'sentry-node-runtime-redaction-barrier-test',
        'service.version': '1.0.0-test',
        'deployment.environment': 'development',
      },
      Attributes: {},
    },
    line: SENSITIVE_LINE,
  };
}

function createFixtureModeConfigForTee(): Extract<
  ParsedSentryConfig,
  { readonly mode: 'fixture' }
> {
  const config = createSentryConfig({
    APP_VERSION: '1.0.0-test',
    APP_VERSION_SOURCE: 'APP_VERSION_OVERRIDE',
    VERCEL_GIT_COMMIT_SHA: 'c8b666485ecb08b5dc27e428737b4077c0531f57',
    SENTRY_MODE: 'fixture',
    SENTRY_RELEASE_OVERRIDE: 'release-test',
    SENTRY_ENABLE_LOGS: 'true',
  });
  if (!config.ok) {
    throw new Error(`Expected ok fixture config: ${JSON.stringify(config.error)}`);
  }
  if (config.value.mode !== 'fixture') {
    throw new Error('Expected fixture-mode config');
  }
  return config.value;
}

// SKIP-UNTIL-WS2/WS3: Temporarily skipped to keep the trunk green during
// the multi-commit RED arc. The WS2/WS3 commit that wires fixture-tee
// post-redaction (per ADR-160 §The Closure Property) MUST unskip this
// describe block as part of its landing diff.
//
// COUPLED REWRITES (WS2/WS3 worker MUST do all three alongside the .skip
// flip, otherwise the test will stay RED for the WRONG reason — input-
// shape mismatch — instead of the intended fixture-tee-not-redacting
// signal):
//
//   (a) `createFixtureModeConfigForTee` (above) constructs the test
//       fixture via legacy `SENTRY_MODE: 'fixture'`. WS2 deletes
//       `SENTRY_MODE` from `SentryConfigEnvironment`. Replace the
//       input with `OBSERVABILITY_SINKS: []` + `OBSERVABILITY_FIXTURES:
//       true`.
//   (b) The helper's return type
//       `Extract<ParsedSentryConfig, { readonly mode: 'fixture' }>`
//       relies on the legacy `mode` discriminator. WS2 introduces the
//       new `kind` discriminator on `ParsedSentryConfig`. Replace with
//       `Extract<ParsedSentryConfig, { readonly kind: 'fixture-only' }>`
//       (or whichever `kind` WS2 lands).
//   (c) The `createFixtureSentryStore` import (line 5) — plan body §WS2
//       schedules the rename to `FixtureCaptureStore` /
//       `createFixtureCaptureStore`. The import and in-file references
//       must follow the rename.
//
// Tracking note in .agent/memory/active/napkin.md §RED-arc skip register
// entry 2 (which enumerates these three obligations as well).
describe.skip('Fixture tee observes only post-redaction events (WS1 RED contract)', () => {
  it('redacts the message before the fixture store captures the log event', () => {
    const config = createFixtureModeConfigForTee();
    const store = createFixtureSentryStore();
    const sink = createFixtureLogSink(config, store);
    if (!sink) {
      throw new Error('Expected a fixture log sink with logs enabled');
    }

    sink.write(createFixtureLogTestEvent());

    const capture = store.captures[0];
    expect(capture).toBeDefined();
    expect(capture?.kind).toBe('log');
    if (!capture || capture.kind !== 'log') {
      throw new Error(`Expected a 'log' capture; got ${capture?.kind ?? 'none'}`);
    }
    expect(capture.message).toBe(`Bearer ${REDACTED_VALUE}`);
  });

  it('redacts the line before the fixture store captures the log event', () => {
    const config = createFixtureModeConfigForTee();
    const store = createFixtureSentryStore();
    const sink = createFixtureLogSink(config, store);
    if (!sink) {
      throw new Error('Expected a fixture log sink with logs enabled');
    }

    sink.write(createFixtureLogTestEvent());

    const capture = store.captures[0];
    expect(capture).toBeDefined();
    expect(capture?.kind).toBe('log');
    if (!capture || capture.kind !== 'log') {
      throw new Error(`Expected a 'log' capture; got ${capture?.kind ?? 'none'}`);
    }
    expect(capture.line).not.toContain('super-secret-abc123');
    expect(capture.line).toContain(REDACTED_VALUE);
  });
});
