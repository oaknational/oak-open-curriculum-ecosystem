/**
 * Type-shape witness for the additive warnings channel on `resolveEnv`'s
 * success Result.
 *
 * @remarks Pins the WS1 contract (plan body §D10): success Result carries
 * a sibling `warnings: readonly EnvWarning[]` array. The default is an
 * empty array — actual warning population (preview-with-empty-sinks)
 * lands in WS3 once `ObservabilityEnvSchema` flows through `resolveEnv`.
 *
 * **This is a type-shape witness, not a runtime behaviour test** —
 * addresses test-expert 2026-05-02 finding 5 by stating the intent
 * explicitly. Each `it` block constructs a literal of the exported type
 * (`EnvResolveOk`, `EnvResolveErr`, `EnvResolveResult`, `EnvWarning`)
 * and the `runtime` assertions exist solely to provide a frame for the
 * TypeScript compiler's structural check. The compiler is the proof
 * surface; the runtime expectations document the shape for human readers
 * and guard against accidental runtime regressions (e.g. a literal that
 * happens to compile but produces an unexpected runtime structure).
 *
 * Population behaviour — `resolveEnv` actually placing
 * `ObservabilitySinksEmptyInPreviewWarning` instances on the channel —
 * is exercised by the `@oaknational/env` schema unit tests + the WS3
 * wiring tests once the `ObservabilityEnvSchema` flows through
 * `resolveEnv`. The carrier is reserved here; the population mechanism
 * is WS3's responsibility.
 *
 * @see ../../../../.agent/plans/observability/current/observability-multi-sink-and-fixtures-shape.plan.md
 */

import { describe, expect, it } from 'vitest';
import type {
  EnvResolveErr,
  EnvResolveOk,
  EnvResolveResult,
  EnvWarning,
  ObservabilitySinksEmptyInPreviewWarning,
} from '../src/types.js';

interface FixtureEnv {
  readonly FOO: string;
}

describe('EnvResolveOk shape', () => {
  it('carries `value`, `warnings`, and `ok: true`', () => {
    const ok: EnvResolveOk<FixtureEnv> = {
      ok: true,
      value: { FOO: 'present' },
      warnings: [],
    };
    expect(ok.ok).toBe(true);
    expect(ok.value.FOO).toBe('present');
    expect(Array.isArray(ok.warnings)).toBe(true);
    expect(ok.warnings.length).toBe(0);
  });

  it('accepts a populated warnings array (forward-compatible with WS3 wiring)', () => {
    const warning: ObservabilitySinksEmptyInPreviewWarning = {
      kind: 'observability_sinks_empty_in_preview',
      message: 'preview environment without external sinks',
    };
    const ok: EnvResolveOk<FixtureEnv> = {
      ok: true,
      value: { FOO: 'value' },
      warnings: [warning],
    };
    expect(ok.warnings.length).toBe(1);
    expect(ok.warnings[0]?.kind).toBe('observability_sinks_empty_in_preview');
  });
});

describe('EnvResolveErr shape', () => {
  it('carries `error`, `ok: false`, and NO `warnings` field', () => {
    const err: EnvResolveErr = {
      ok: false,
      error: {
        message: 'FOO is required',
        diagnostics: [],
        zodIssues: [],
      },
    };
    expect(err.ok).toBe(false);
    expect(err.error.message).toBe('FOO is required');
    expect('warnings' in err).toBe(false);
  });
});

describe('EnvResolveResult discriminated union', () => {
  it('narrows on `ok` to `EnvResolveOk` (with warnings) or `EnvResolveErr`', () => {
    const okResult: EnvResolveResult<FixtureEnv> = {
      ok: true,
      value: { FOO: 'value' },
      warnings: [],
    };
    const errResult: EnvResolveResult<FixtureEnv> = {
      ok: false,
      error: { message: 'fail', diagnostics: [], zodIssues: [] },
    };
    if (okResult.ok) {
      expect(okResult.value.FOO).toBe('value');
      expect(okResult.warnings).toEqual([]);
    } else {
      throw new Error('expected ok variant');
    }
    if (errResult.ok) {
      throw new Error('expected err variant');
    }
    expect(errResult.error.message).toBe('fail');
    expect('warnings' in errResult).toBe(false);
  });
});

describe('EnvWarning discriminated union', () => {
  it('narrows on the `kind` discriminator to a specific variant', () => {
    const warning: EnvWarning = {
      kind: 'observability_sinks_empty_in_preview',
      message: 'preview environment without external sinks',
    };
    if (warning.kind === 'observability_sinks_empty_in_preview') {
      expect(warning.message).toContain('preview');
    } else {
      throw new Error('expected observability_sinks_empty_in_preview variant');
    }
  });
});
