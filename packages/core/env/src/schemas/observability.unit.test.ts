import { assert, describe, expect, it } from 'vitest';
import {
  OBSERVABILITY_FIXTURES_SCHEMA,
  OBSERVABILITY_SINKS_SCHEMA,
  ObservabilityEnvSchema,
} from './observability.js';

/**
 * Unit tests for the orthogonal-axes observability env contract.
 *
 * @remarks These tests cover the schema's own behaviour — they are GREEN
 * in WS1 (the schema is production code, not a stub). The RED tests for
 * the WS1 multi-sink-and-fixtures plan live at the consumer-wiring layer
 * (sentry-node config, app composition roots, outermost regression-guard
 * E2E) where post-WS2/3/4 contracts are asserted before the rename
 * lands.
 *
 * @see ../../../../../.agent/plans/observability/current/observability-multi-sink-and-fixtures-shape.plan.md
 */

const VALID_DSN = 'https://public@example.ingest.sentry.io/123';

interface ParseIssue {
  readonly message: string;
  readonly path: readonly PropertyKey[];
}

interface ParseError {
  readonly issues: readonly ParseIssue[];
}

interface SafeParser {
  safeParse(
    input: unknown,
  ):
    | { readonly success: true; readonly data: unknown }
    | { readonly success: false; readonly error: ParseError };
}

function parseFailure(parser: SafeParser, input: unknown): ParseError {
  const result = parser.safeParse(input);
  assert(!result.success, 'Expected schema parsing to fail');
  return result.error;
}

describe('OBSERVABILITY_SINKS_SCHEMA', () => {
  it('defaults to the empty array when the env var is undefined', () => {
    expect(OBSERVABILITY_SINKS_SCHEMA.parse(undefined)).toEqual([]);
  });

  it('parses a JSON-array string of one valid sink kind', () => {
    expect(OBSERVABILITY_SINKS_SCHEMA.parse('["sentry"]')).toEqual(['sentry']);
  });

  it('parses a JSON-array string of multiple valid sink kinds', () => {
    expect(OBSERVABILITY_SINKS_SCHEMA.parse('["sentry","file","posthog"]')).toEqual([
      'sentry',
      'file',
      'posthog',
    ]);
  });

  it('accepts PostHog as the product-analytics selection', () => {
    expect(OBSERVABILITY_SINKS_SCHEMA.parse('["posthog"]')).toEqual(['posthog']);
  });

  it('rejects a non-JSON value with an actionable message', () => {
    const error = parseFailure(OBSERVABILITY_SINKS_SCHEMA, 'sentry,file');
    expect(error.issues[0]?.message).toContain('JSON array literal');
  });

  it('rejects a JSON array with an unknown sink kind (no string widening)', () => {
    const error = parseFailure(OBSERVABILITY_SINKS_SCHEMA, '["warehouse"]');
    const message = error.issues[0]?.message ?? '';
    expect(message).toContain('JSON array of [');
    expect(message).toContain('sentry');
    expect(message).toContain('file');
    expect(message).toContain('posthog');
  });
});

describe('OBSERVABILITY_FIXTURES_SCHEMA', () => {
  it('defaults to false when the env var is undefined', () => {
    expect(OBSERVABILITY_FIXTURES_SCHEMA.parse(undefined)).toBe(false);
  });

  it('parses the literal "true" to boolean true', () => {
    expect(OBSERVABILITY_FIXTURES_SCHEMA.parse('true')).toBe(true);
  });

  it('parses the literal "false" to boolean false', () => {
    expect(OBSERVABILITY_FIXTURES_SCHEMA.parse('false')).toBe(false);
  });

  it('rejects ambiguous non-boolean strings', () => {
    expect(() => OBSERVABILITY_FIXTURES_SCHEMA.parse('1')).toThrow();
  });
});

describe('ObservabilityEnvSchema cross-field superRefine — six rules + negative-path acceptance', () => {
  describe('Branch 1: legacy SENTRY_MODE rejection', () => {
    it('rejects any non-empty SENTRY_MODE with the canonical rename-replacement message', () => {
      const error = parseFailure(ObservabilityEnvSchema, {
        OBSERVABILITY_SINKS: '["sentry"]',
        OBSERVABILITY_FIXTURES: 'false',
        SENTRY_DSN: VALID_DSN,
        SENTRY_MODE: 'sentry',
      });
      const message = error.issues.find((i) => i.path[0] === 'SENTRY_MODE')?.message;
      expect(message).toBeDefined();
      expect(message).toContain('SENTRY_MODE has been replaced by orthogonal axes');
      expect(message).toContain('SENTRY_MODE=off => OBSERVABILITY_SINKS=[]');
      expect(message).toContain('SENTRY_MODE=fixture');
      expect(message).toContain('OBSERVABILITY_FIXTURES=true');
      expect(message).toContain('SENTRY_MODE=sentry');
      expect(message).toContain('OBSERVABILITY_SINKS=["sentry"]');
      expect(message).toContain('SENTRY_DSN');
      expect(message).toContain('observability multi-sink + fixtures plan');
    });

    it('rejects SENTRY_MODE=off as a legacy value (rename, not retain)', () => {
      const error = parseFailure(ObservabilityEnvSchema, {
        OBSERVABILITY_SINKS: '[]',
        SENTRY_MODE: 'off',
      });
      const sentryModeIssue = error.issues.find((i) => i.path[0] === 'SENTRY_MODE');
      expect(sentryModeIssue).toBeDefined();
    });

    it('treats an empty-string SENTRY_MODE as absent (no false positive)', () => {
      const result = ObservabilityEnvSchema.safeParse({
        OBSERVABILITY_SINKS: '[]',
        SENTRY_MODE: '',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Branch 2: legacy MCP_LOGGER_* rejection', () => {
    it('rejects MCP_LOGGER_FILE_PATH with the rename-replacement message', () => {
      const error = parseFailure(ObservabilityEnvSchema, {
        OBSERVABILITY_SINKS: '[]',
        MCP_LOGGER_FILE_PATH: '/workspace/logs/mcp.log',
      });
      const issue = error.issues.find((i) => i.path[0] === 'MCP_LOGGER_FILE_PATH');
      expect(issue).toBeDefined();
      expect(issue?.message).toContain('OBSERVABILITY_SINKS=["file"]');
      expect(issue?.message).toContain('OBSERVABILITY_FILE_PATH');
      expect(issue?.message).toContain('observability multi-sink + fixtures plan');
    });

    it('rejects MCP_LOGGER_FILE_APPEND naming the removal-not-rename rationale', () => {
      const error = parseFailure(ObservabilityEnvSchema, {
        OBSERVABILITY_SINKS: '[]',
        MCP_LOGGER_FILE_APPEND: 'true',
      });
      const message = error.issues.find((i) => i.path[0] === 'MCP_LOGGER_FILE_APPEND')?.message;
      expect(message).toBeDefined();
      expect(message).toContain('appends unconditionally');
      expect(message).toContain('Remove this env var');
    });

    it('rejects MCP_LOGGER_STDOUT naming the always-on stdout baseline', () => {
      const error = parseFailure(ObservabilityEnvSchema, {
        OBSERVABILITY_SINKS: '[]',
        MCP_LOGGER_STDOUT: 'false',
      });
      const message = error.issues.find((i) => i.path[0] === 'MCP_LOGGER_STDOUT')?.message;
      expect(message).toBeDefined();
      expect(message).toContain('always-on baseline');
      expect(message).toContain('Remove this env var');
    });
  });

  describe('Branch 3: SENTRY_DSN required when "sentry" in sinks', () => {
    it('rejects sinks containing "sentry" without SENTRY_DSN', () => {
      const error = parseFailure(ObservabilityEnvSchema, {
        OBSERVABILITY_SINKS: '["sentry"]',
      });
      const dsnIssue = error.issues.find((i) => i.path[0] === 'SENTRY_DSN');
      expect(dsnIssue).toBeDefined();
      expect(dsnIssue?.message).toContain('SENTRY_DSN is required');
      expect(dsnIssue?.message).toContain('"sentry"');
    });

    it('accepts sinks containing "sentry" with a valid SENTRY_DSN', () => {
      const result = ObservabilityEnvSchema.safeParse({
        OBSERVABILITY_SINKS: '["sentry"]',
        SENTRY_DSN: VALID_DSN,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Branch 4: OBSERVABILITY_FILE_PATH required when "file" in sinks', () => {
    it('rejects sinks containing "file" without OBSERVABILITY_FILE_PATH', () => {
      const error = parseFailure(ObservabilityEnvSchema, {
        OBSERVABILITY_SINKS: '["file"]',
      });
      const fileIssue = error.issues.find((i) => i.path[0] === 'OBSERVABILITY_FILE_PATH');
      expect(fileIssue).toBeDefined();
      expect(fileIssue?.message).toContain('OBSERVABILITY_FILE_PATH is required');
      expect(fileIssue?.message).toContain('"file"');
    });

    it('accepts sinks containing "file" with a non-empty OBSERVABILITY_FILE_PATH', () => {
      const result = ObservabilityEnvSchema.safeParse({
        OBSERVABILITY_SINKS: '["file"]',
        OBSERVABILITY_FILE_PATH: '/workspace/logs/oak-mcp.log',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Branch 5: production without a diagnostic sink is fail-closed', () => {
    it('rejects VERCEL_ENV=production with OBSERVABILITY_SINKS=[]', () => {
      const error = parseFailure(ObservabilityEnvSchema, {
        VERCEL_ENV: 'production',
        OBSERVABILITY_SINKS: '[]',
      });
      const sinksIssue = error.issues.find((i) => i.path[0] === 'OBSERVABILITY_SINKS');
      expect(sinksIssue).toBeDefined();
      expect(sinksIssue?.message).toContain('production');
      expect(sinksIssue?.message).toContain('at least one diagnostic sink');
      expect(sinksIssue?.message).toContain('Inline fix examples');
      expect(sinksIssue?.message).toContain('OBSERVABILITY_SINKS=["sentry"]');
      expect(sinksIssue?.message).toContain('OBSERVABILITY_SINKS=["file"]');
    });

    it('rejects VERCEL_ENV=production with only the product-analytics sink', () => {
      const error = parseFailure(ObservabilityEnvSchema, {
        VERCEL_ENV: 'production',
        OBSERVABILITY_SINKS: '["posthog"]',
      });
      const sinksIssue = error.issues.find((i) => i.path[0] === 'OBSERVABILITY_SINKS');
      expect(sinksIssue?.message).toContain('at least one diagnostic sink');
      expect(sinksIssue?.message).toContain('PostHog');
    });

    it('accepts VERCEL_ENV=production with a diagnostic sink alongside PostHog', () => {
      const result = ObservabilityEnvSchema.safeParse({
        VERCEL_ENV: 'production',
        OBSERVABILITY_SINKS: '["sentry","posthog"]',
        SENTRY_DSN: VALID_DSN,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Branch 6: "posthog" requires "sentry" alongside in every environment (MCP-361)', () => {
    // Owner ruling 2026-07-29: "We do need to also use Sentry as a sink for
    // observability logs, that is non-negotiable." No environment may select
    // the posthog sink without sentry alongside — dev, preview, and production
    // alike. This is stricter than Branch 5 (which only mandates *some*
    // diagnostic sink, in production only): here the required sink is sentry
    // specifically, everywhere.
    const EVERY_ENVIRONMENT = ['development', 'preview', 'production'] as const;

    it.each(EVERY_ENVIRONMENT)(
      'rejects OBSERVABILITY_SINKS=["posthog"] without "sentry" in %s, citing the owner ruling',
      (vercelEnv) => {
        const error = parseFailure(ObservabilityEnvSchema, {
          VERCEL_ENV: vercelEnv,
          OBSERVABILITY_SINKS: '["posthog"]',
        });
        // Select this rule's issue specifically by its ruling citation — in
        // production Branch 5 also emits an OBSERVABILITY_SINKS issue whose
        // text mentions "sentry" and "posthog", so a looser predicate would
        // grab the wrong one.
        const issue = error.issues.find(
          (candidate) =>
            candidate.path[0] === 'OBSERVABILITY_SINKS' &&
            candidate.message.includes('non-negotiable'),
        );
        expect(issue, `expected a sentry-alongside issue in ${vercelEnv}`).toBeDefined();
        expect(issue?.message).toContain('"posthog"');
        expect(issue?.message).toContain('"sentry"');
        expect(issue?.message).toContain('every environment');
      },
    );

    it.each(EVERY_ENVIRONMENT)(
      'rejects OBSERVABILITY_SINKS=["file","posthog"] in %s — a diagnostic sink is not enough; sentry specifically is required',
      (vercelEnv) => {
        // "file" is a diagnostic sink, so this selection satisfies Branch 5
        // even in production; OBSERVABILITY_FILE_PATH is set so Branch 4 does
        // not fire either. The only rule left to reject it is Branch 6 — this
        // is the case that pins "sentry specifically", not "any diagnostic
        // sink". A weaker rule checking for any diagnostic sink would pass.
        const error = parseFailure(ObservabilityEnvSchema, {
          VERCEL_ENV: vercelEnv,
          OBSERVABILITY_SINKS: '["file","posthog"]',
          OBSERVABILITY_FILE_PATH: '/workspace/logs/oak-mcp.log',
        });
        const issue = error.issues.find(
          (candidate) =>
            candidate.path[0] === 'OBSERVABILITY_SINKS' &&
            candidate.message.includes('non-negotiable'),
        );
        expect(issue, `expected a sentry-alongside issue in ${vercelEnv}`).toBeDefined();
        expect(issue?.message).toContain('"sentry"');
      },
    );

    it.each(EVERY_ENVIRONMENT)(
      'accepts OBSERVABILITY_SINKS=["sentry","posthog"] with SENTRY_DSN in %s',
      (vercelEnv) => {
        const result = ObservabilityEnvSchema.safeParse({
          VERCEL_ENV: vercelEnv,
          OBSERVABILITY_SINKS: '["sentry","posthog"]',
          SENTRY_DSN: VALID_DSN,
        });
        expect(result.success).toBe(true);
      },
    );

    it('composes with Branch 3: ["sentry","posthog"] without SENTRY_DSN still fails on SENTRY_DSN only', () => {
      const error = parseFailure(ObservabilityEnvSchema, {
        OBSERVABILITY_SINKS: '["sentry","posthog"]',
      });
      const dsnIssue = error.issues.find((candidate) => candidate.path[0] === 'SENTRY_DSN');
      expect(dsnIssue).toBeDefined();
      expect(dsnIssue?.message).toContain('SENTRY_DSN is required');
      // sentry IS present, so the posthog-requires-sentry rule must NOT fire.
      const posthogIssue = error.issues.find(
        (candidate) =>
          candidate.path[0] === 'OBSERVABILITY_SINKS' &&
          candidate.message.includes('non-negotiable'),
      );
      expect(posthogIssue).toBeUndefined();
    });
  });

  describe('Negative-path acceptance: development / preview / unset VERCEL_ENV with empty sinks does not fail', () => {
    it('accepts VERCEL_ENV=development with empty sinks (local-dev path)', () => {
      const result = ObservabilityEnvSchema.safeParse({
        VERCEL_ENV: 'development',
        OBSERVABILITY_SINKS: '[]',
      });
      expect(result.success).toBe(true);
    });

    it('accepts VERCEL_ENV=preview with empty sinks (warning emitted via warnings channel, not addIssue)', () => {
      // The preview-with-empty-sinks warning is part of the resolveEnv warnings
      // channel addition (plan body §D10 + @oaknational/env-resolution's
      // EnvWarning discriminated union). It is intentionally NOT a hard error.
      const result = ObservabilityEnvSchema.safeParse({
        VERCEL_ENV: 'preview',
        OBSERVABILITY_SINKS: '[]',
      });
      expect(result.success).toBe(true);
    });

    it('accepts undefined VERCEL_ENV with empty sinks (fresh-checkout local-dev)', () => {
      const result = ObservabilityEnvSchema.safeParse({
        OBSERVABILITY_SINKS: '[]',
      });
      expect(result.success).toBe(true);
    });
  });
});
