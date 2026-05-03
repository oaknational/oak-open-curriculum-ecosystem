/**
 * Compile-anchor + runtime-constant tests for the vendor-neutral
 * sink-registry shape.
 *
 * @remarks Pin the contract that `@oaknational/env`,
 * `@oaknational/sentry-node`, and the app-layer composition roots will
 * bind to. The runtime check on `OBSERVABILITY_SINK_KINDS` (the only
 * data export in this module) is the primary behavioural assertion.
 * The remaining describe blocks construct minimal fakes solely to give
 * the TypeScript compiler a target for structural conformance — those
 * blocks are deliberately small so the file does not over-test the
 * compiler. Addresses test-reviewer 2026-05-02 finding 6 (reduce
 * tautological fake-vs-fake assertions; lean on the compiler).
 *
 * No `expectType<...>` — in line with the patterns the rest of this
 * package uses (see `primitives.unit.test.ts`).
 */

import { describe, expect, it } from 'vitest';

import {
  OBSERVABILITY_SINK_KINDS,
  type ObservabilitySink,
  type ObservabilitySinkKind,
  type ServerInstrumenter,
  type SinkRegistry,
} from './sink-registry.js';

describe('OBSERVABILITY_SINK_KINDS', () => {
  it('contains exactly the WS1 baseline sinks', () => {
    expect([...OBSERVABILITY_SINK_KINDS]).toStrictEqual(['sentry', 'file']);
  });

  it('is a readonly tuple — type-frozen via "as const"', () => {
    const kinds: readonly ObservabilitySinkKind[] = OBSERVABILITY_SINK_KINDS;
    expect(kinds.length).toBeGreaterThan(0);
  });
});

function createTestSink<K extends ObservabilitySinkKind>(kind: K): ObservabilitySink<K> {
  return {
    kind,
    captureException: () => undefined,
    captureMessage: () => undefined,
    flush: async () => true,
  };
}

describe('ObservabilitySink + SinkRegistry compile anchors', () => {
  it('a fully-populated registry conforms to SinkRegistry and exposes both kinds', () => {
    const registry = {
      sentry: createTestSink('sentry'),
      file: createTestSink('file'),
    } satisfies SinkRegistry;
    expect(registry.sentry.kind).toBe('sentry');
    expect(registry.file.kind).toBe('file');
  });

  it('an empty registry conforms to SinkRegistry (stdout-only baseline)', () => {
    const registry: SinkRegistry = {};
    expect(registry.sentry).toBeUndefined();
    expect(registry.file).toBeUndefined();
  });
});

interface TestMcpServer {
  readonly id: string;
  wrapped?: boolean;
}

interface TestExpressApp {
  errorHandlerRegistered: boolean;
}

describe('ServerInstrumenter compile anchor', () => {
  it('binds to caller-provided server and Express app types via generics', () => {
    const instrumenter: ServerInstrumenter<TestMcpServer, TestExpressApp> = {
      wrapServer: (server) => ({ ...server, wrapped: true }),
      setupExpressErrorHandler: (app) => {
        app.errorHandlerRegistered = true;
      },
    };

    const wrapped = instrumenter.wrapServer({ id: 'test' });
    expect(wrapped.wrapped).toBe(true);

    const app: TestExpressApp = { errorHandlerRegistered: false };
    instrumenter.setupExpressErrorHandler(app);
    expect(app.errorHandlerRegistered).toBe(true);
  });
});
