import { OBSERVABILITY_SINK_KINDS } from '@oaknational/observability';
import { describe, expect, it } from 'vitest';
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

describe('OBSERVABILITY_SINKS_SCHEMA', () => {
  it('defaults to the empty array when the env var is undefined', () => {
    const result = OBSERVABILITY_SINKS_SCHEMA.safeParse(undefined);
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }
    expect(result.data).toEqual([]);
  });

  it('parses a JSON-array string of one valid sink kind', () => {
    const result = OBSERVABILITY_SINKS_SCHEMA.safeParse('["sentry"]');
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }
    expect(result.data).toEqual(['sentry']);
  });

  it('parses a JSON-array string of multiple valid sink kinds', () => {
    const result = OBSERVABILITY_SINKS_SCHEMA.safeParse('["sentry","file"]');
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }
    expect(result.data).toEqual(['sentry', 'file']);
  });

  it('rejects a non-JSON value with an actionable message', () => {
    const result = OBSERVABILITY_SINKS_SCHEMA.safeParse('sentry,file');
    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }
    expect(result.error.issues[0]?.message).toContain('JSON array literal');
  });

  it('rejects a JSON array with an unknown sink kind (no string widening)', () => {
    const result = OBSERVABILITY_SINKS_SCHEMA.safeParse('["warehouse"]');
    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }
    const message = result.error.issues[0]?.message ?? '';
    expect(message).toContain('JSON array of [');
    for (const validKind of OBSERVABILITY_SINK_KINDS) {
      expect(message).toContain(validKind);
    }
  });
});

describe('OBSERVABILITY_FIXTURES_SCHEMA', () => {
  it('defaults to false when the env var is undefined', () => {
    const result = OBSERVABILITY_FIXTURES_SCHEMA.safeParse(undefined);
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }
    expect(result.data).toBe(false);
  });

  it('parses the literal "true" to boolean true', () => {
    const result = OBSERVABILITY_FIXTURES_SCHEMA.safeParse('true');
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }
    expect(result.data).toBe(true);
  });

  it('parses the literal "false" to boolean false', () => {
    const result = OBSERVABILITY_FIXTURES_SCHEMA.safeParse('false');
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }
    expect(result.data).toBe(false);
  });

  it('rejects ambiguous non-boolean strings', () => {
    const result = OBSERVABILITY_FIXTURES_SCHEMA.safeParse('1');
    expect(result.success).toBe(false);
  });
});

describe('ObservabilityEnvSchema cross-field superRefine — five rules + negative-path acceptance', () => {
  describe('Branch 1: legacy SENTRY_MODE rejection', () => {
    it('rejects any non-empty SENTRY_MODE with the canonical rename-replacement message', () => {
      const result = ObservabilityEnvSchema.safeParse({
        OBSERVABILITY_SINKS: '["sentry"]',
        OBSERVABILITY_FIXTURES: 'false',
        SENTRY_DSN: VALID_DSN,
        SENTRY_MODE: 'sentry',
      });
      expect(result.success).toBe(false);
      if (result.success) {
        return;
      }
      const message = result.error.issues.find((i) => i.path[0] === 'SENTRY_MODE')?.message;
      expect(message).toBeDefined();
      const expectedSubstrings = [
        'SENTRY_MODE has been replaced by orthogonal axes',
        'SENTRY_MODE=off => OBSERVABILITY_SINKS=[]',
        'SENTRY_MODE=fixture',
        'OBSERVABILITY_FIXTURES=true',
        'SENTRY_MODE=sentry',
        'OBSERVABILITY_SINKS=["sentry"]',
        'SENTRY_DSN',
        'observability multi-sink + fixtures plan',
      ];
      for (const substring of expectedSubstrings) {
        expect(message).toContain(substring);
      }
    });

    it('rejects SENTRY_MODE=off as a legacy value (rename, not retain)', () => {
      const result = ObservabilityEnvSchema.safeParse({
        OBSERVABILITY_SINKS: '[]',
        SENTRY_MODE: 'off',
      });
      expect(result.success).toBe(false);
      if (result.success) {
        return;
      }
      const sentryModeIssue = result.error.issues.find((i) => i.path[0] === 'SENTRY_MODE');
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
      const result = ObservabilityEnvSchema.safeParse({
        OBSERVABILITY_SINKS: '[]',
        MCP_LOGGER_FILE_PATH: '/workspace/logs/mcp.log',
      });
      expect(result.success).toBe(false);
      if (result.success) {
        return;
      }
      const issue = result.error.issues.find((i) => i.path[0] === 'MCP_LOGGER_FILE_PATH');
      expect(issue).toBeDefined();
      expect(issue?.message).toContain('OBSERVABILITY_SINKS=["file"]');
      expect(issue?.message).toContain('OBSERVABILITY_FILE_PATH');
      expect(issue?.message).toContain('observability multi-sink + fixtures plan');
    });

    it('rejects MCP_LOGGER_FILE_APPEND naming the removal-not-rename rationale', () => {
      const result = ObservabilityEnvSchema.safeParse({
        OBSERVABILITY_SINKS: '[]',
        MCP_LOGGER_FILE_APPEND: 'true',
      });
      expect(result.success).toBe(false);
      if (result.success) {
        return;
      }
      const message = result.error.issues.find(
        (i) => i.path[0] === 'MCP_LOGGER_FILE_APPEND',
      )?.message;
      expect(message).toBeDefined();
      expect(message).toContain('appends unconditionally');
      expect(message).toContain('Remove this env var');
    });

    it('rejects MCP_LOGGER_STDOUT naming the always-on stdout baseline', () => {
      const result = ObservabilityEnvSchema.safeParse({
        OBSERVABILITY_SINKS: '[]',
        MCP_LOGGER_STDOUT: 'false',
      });
      expect(result.success).toBe(false);
      if (result.success) {
        return;
      }
      const message = result.error.issues.find((i) => i.path[0] === 'MCP_LOGGER_STDOUT')?.message;
      expect(message).toBeDefined();
      expect(message).toContain('always-on baseline');
      expect(message).toContain('Remove this env var');
    });
  });

  describe('Branch 3: SENTRY_DSN required when "sentry" in sinks', () => {
    it('rejects sinks containing "sentry" without SENTRY_DSN', () => {
      const result = ObservabilityEnvSchema.safeParse({
        OBSERVABILITY_SINKS: '["sentry"]',
      });
      expect(result.success).toBe(false);
      if (result.success) {
        return;
      }
      const dsnIssue = result.error.issues.find((i) => i.path[0] === 'SENTRY_DSN');
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
      const result = ObservabilityEnvSchema.safeParse({
        OBSERVABILITY_SINKS: '["file"]',
      });
      expect(result.success).toBe(false);
      if (result.success) {
        return;
      }
      const fileIssue = result.error.issues.find((i) => i.path[0] === 'OBSERVABILITY_FILE_PATH');
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

  describe('Branch 5: production with empty sinks is fail-closed', () => {
    it('rejects VERCEL_ENV=production with OBSERVABILITY_SINKS=[]', () => {
      const result = ObservabilityEnvSchema.safeParse({
        VERCEL_ENV: 'production',
        OBSERVABILITY_SINKS: '[]',
      });
      expect(result.success).toBe(false);
      if (result.success) {
        return;
      }
      const sinksIssue = result.error.issues.find((i) => i.path[0] === 'OBSERVABILITY_SINKS');
      expect(sinksIssue).toBeDefined();
      expect(sinksIssue?.message).toContain('production');
      expect(sinksIssue?.message).toContain('at least one external sink');
      expect(sinksIssue?.message).toContain('Inline fix examples');
      expect(sinksIssue?.message).toContain('OBSERVABILITY_SINKS=["sentry"]');
      expect(sinksIssue?.message).toContain('OBSERVABILITY_SINKS=["file"]');
    });

    it('accepts VERCEL_ENV=production with at least one external sink', () => {
      const result = ObservabilityEnvSchema.safeParse({
        VERCEL_ENV: 'production',
        OBSERVABILITY_SINKS: '["sentry"]',
        SENTRY_DSN: VALID_DSN,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Branch 6: development / preview / unset VERCEL_ENV with empty sinks does not fail', () => {
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
