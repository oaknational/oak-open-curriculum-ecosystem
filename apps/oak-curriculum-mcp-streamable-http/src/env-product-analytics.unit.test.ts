import { describe, it, expect } from 'vitest';
import { HttpEnvSchema } from './env.js';

const baseEnv = {
  OAK_API_KEY: 'test-key',
  ELASTICSEARCH_URL: 'http://localhost:9200',
  ELASTICSEARCH_API_KEY: 'test-api-key',
};

const withClerkKeys = {
  ...baseEnv,
  CLERK_PUBLISHABLE_KEY: 'pk_test_123',
  CLERK_SECRET_KEY: 'sk_test_123',
};

const ZERO_KEY = Buffer.alloc(32, 0).toString('base64url');
// A valid posthog-selected boot needs the PostHog inputs AND a live,
// log-emitting Sentry: SENTRY_MODE=sentry with a DSN and a traces sample
// rate, and SENTRY_ENABLE_LOGS not "false" (MCP-361, owner-strengthened).
// The live-Sentry invariant itself is exercised in env-live-sentry.unit.test.ts;
// here Sentry is kept valid so these tests isolate the PostHog field rules.
const validPostHogVars = {
  POSTHOG_PROJECT_API_KEY: 'phc_test_project_key',
  POSTHOG_HOST: 'https://eu.i.posthog.com',
  POSTHOG_PSEUDONYM_ACTIVE_KEY_ID: 'k2026_01',
  POSTHOG_PSEUDONYM_KEYRING: JSON.stringify([{ id: 'k2026_01', key: ZERO_KEY }]),
  SENTRY_MODE: 'sentry',
  SENTRY_DSN: 'https://public@example.ingest.sentry.io/123456',
  SENTRY_TRACES_SAMPLE_RATE: '0.1',
};

describe('PostHog product-analytics selection (OBSERVABILITY_SINKS)', () => {
  it('accepts a selection without posthog and requires no PostHog variables', () => {
    const result = HttpEnvSchema.safeParse({
      ...withClerkKeys,
      OBSERVABILITY_SINKS: '["sentry"]',
    });
    expect(result.success).toBe(true);
  });

  it('ignores PostHog variable content when posthog is not selected', () => {
    const result = HttpEnvSchema.safeParse({
      ...withClerkKeys,
      OBSERVABILITY_SINKS: '["sentry"]',
      POSTHOG_PROJECT_API_KEY: '',
      POSTHOG_HOST: 'https://us.i.posthog.com',
      POSTHOG_PSEUDONYM_KEYRING: 'not json',
    });
    expect(result.success).toBe(true);
  });

  it('accepts the complete closed configuration when posthog is selected', () => {
    const result = HttpEnvSchema.safeParse({
      ...withClerkKeys,
      OBSERVABILITY_SINKS: '["sentry","posthog"]',
      ...validPostHogVars,
    });
    expect(result.success).toBe(true);
  });

  it.each([
    'POSTHOG_PROJECT_API_KEY',
    'POSTHOG_HOST',
    'POSTHOG_PSEUDONYM_ACTIVE_KEY_ID',
    'POSTHOG_PSEUDONYM_KEYRING',
  ])('requires %s when posthog is selected', (missingKey) => {
    const result = HttpEnvSchema.safeParse({
      ...withClerkKeys,
      OBSERVABILITY_SINKS: '["sentry","posthog"]',
      ...validPostHogVars,
      [missingKey]: undefined,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join('.'));
      expect(paths).toContain(missingKey);
    }
  });

  it('rejects any POSTHOG_HOST other than the exact EU ingestion host', () => {
    const result = HttpEnvSchema.safeParse({
      ...withClerkKeys,
      OBSERVABILITY_SINKS: '["sentry","posthog"]',
      ...validPostHogVars,
      POSTHOG_HOST: 'https://us.i.posthog.com',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join('.'));
      expect(paths).toContain('POSTHOG_HOST');
    }
  });

  it('rejects selecting posthog while authentication is disabled', () => {
    const result = HttpEnvSchema.safeParse({
      ...baseEnv,
      DANGEROUSLY_DISABLE_AUTH: 'true',
      OBSERVABILITY_SINKS: '["sentry","posthog"]',
      ...validPostHogVars,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join('.'));
      expect(paths).toContain('OBSERVABILITY_SINKS');
    }
  });

  it('rejects a deployment-supplied POSTHOG_CAPTURE_MODE when posthog is selected', () => {
    const result = HttpEnvSchema.safeParse({
      ...withClerkKeys,
      OBSERVABILITY_SINKS: '["sentry","posthog"]',
      ...validPostHogVars,
      POSTHOG_CAPTURE_MODE: 'immediate',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join('.'));
      expect(paths).toContain('POSTHOG_CAPTURE_MODE');
    }
  });

  it('tolerates POSTHOG_CAPTURE_MODE content when posthog is not selected — deselection never fails boot', () => {
    const result = HttpEnvSchema.safeParse({
      ...withClerkKeys,
      OBSERVABILITY_SINKS: '["sentry"]',
      ...validPostHogVars,
      POSTHOG_CAPTURE_MODE: 'immediate',
    });
    expect(result.success).toBe(true);
  });

  it('treats an empty POSTHOG_CAPTURE_MODE as absent — a cleared variable never fails boot', () => {
    const result = HttpEnvSchema.safeParse({
      ...withClerkKeys,
      OBSERVABILITY_SINKS: '["sentry","posthog"]',
      ...validPostHogVars,
      POSTHOG_CAPTURE_MODE: '',
    });
    expect(result.success).toBe(true);
  });
});
