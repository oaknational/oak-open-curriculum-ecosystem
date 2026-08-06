import { describe, it, expect } from 'vitest';
import { HttpEnvSchema } from './env.js';

const withClerkKeys = {
  OAK_API_KEY: 'test-key',
  ELASTICSEARCH_URL: 'http://localhost:9200',
  ELASTICSEARCH_API_KEY: 'test-api-key',
  CLERK_PUBLISHABLE_KEY: 'pk_test_123',
  CLERK_SECRET_KEY: 'sk_test_123',
};

const ZERO_KEY = Buffer.alloc(32, 0).toString('base64url');
// A valid posthog-selected boot needs the PostHog inputs AND a live,
// log-emitting Sentry: the "sentry" sink is only a selection marker, so
// SENTRY_MODE must be "sentry" (not the default "off") with a DSN and a
// traces sample rate (live Sentry mode parses it at boot and rejects an
// absent value), and SENTRY_ENABLE_LOGS must not be "false" (which turns
// the Sentry log sink off) (MCP-361, owner-strengthened). SENTRY_ENABLE_LOGS
// is left unset here — it defaults to true in the live config.
const validPostHogVars = {
  POSTHOG_PROJECT_API_KEY: 'phc_test_project_key',
  POSTHOG_HOST: 'https://eu.i.posthog.com',
  POSTHOG_PSEUDONYM_ACTIVE_KEY_ID: 'k2026_01',
  POSTHOG_PSEUDONYM_KEYRING: JSON.stringify([{ id: 'k2026_01', key: ZERO_KEY }]),
  SENTRY_MODE: 'sentry',
  SENTRY_DSN: 'https://public@example.ingest.sentry.io/123456',
  SENTRY_TRACES_SAMPLE_RATE: '0.1',
};

describe('PostHog requires a live, log-emitting Sentry in every environment (MCP-361)', () => {
  // Owner ruling 2026-07-29 (strengthened 2026-08-04): Sentry-as-a-sink is
  // non-negotiable. The app boots from HttpEnvSchema, so the invariant is
  // enforced here (refineProductAnalyticsEnv), not only in the library
  // ObservabilityEnvSchema. Stronger than the previous production-only "any
  // diagnostic sink" rule: the required companion is "sentry" specifically,
  // actively delivering and logging, and it holds in development and preview too.
  const EVERY_ENVIRONMENT = ['development', 'preview', 'production'] as const;

  it.each(EVERY_ENVIRONMENT)(
    'rejects OBSERVABILITY_SINKS=["posthog"] without "sentry" in %s',
    (vercelEnv) => {
      const result = HttpEnvSchema.safeParse({
        ...withClerkKeys,
        VERCEL_ENV: vercelEnv,
        OBSERVABILITY_SINKS: '["posthog"]',
        ...validPostHogVars,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const sinksIssue = result.error.issues.find(
          (issue) => issue.path.join('.') === 'OBSERVABILITY_SINKS',
        );
        expect(sinksIssue?.message).toContain('sentry');
        expect(sinksIssue?.message).toContain('every environment');
      }
    },
  );

  it.each(EVERY_ENVIRONMENT)(
    'rejects OBSERVABILITY_SINKS=["file","posthog"] in %s — a diagnostic sink is not enough; sentry specifically is required',
    (vercelEnv) => {
      const result = HttpEnvSchema.safeParse({
        ...withClerkKeys,
        VERCEL_ENV: vercelEnv,
        OBSERVABILITY_SINKS: '["file","posthog"]',
        ...validPostHogVars,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const paths = result.error.issues.map((issue) => issue.path.join('.'));
        expect(paths).toContain('OBSERVABILITY_SINKS');
      }
    },
  );

  it.each(EVERY_ENVIRONMENT)(
    'accepts OBSERVABILITY_SINKS=["sentry","posthog"] with the full PostHog + live-Sentry config in %s',
    (vercelEnv) => {
      const result = HttpEnvSchema.safeParse({
        ...withClerkKeys,
        VERCEL_ENV: vercelEnv,
        OBSERVABILITY_SINKS: '["sentry","posthog"]',
        ...validPostHogVars,
      });
      expect(result.success).toBe(true);
    },
  );

  // The sink marker alone is not enough: SENTRY_MODE gates real delivery,
  // so SENTRY_MODE=off (the default) boots the sink dark — the exact
  // "false marker" an operator hits when they set only the sink.
  it.each(EVERY_ENVIRONMENT)(
    'rejects a posthog selection with SENTRY_MODE=off (Sentry dark) in %s',
    (vercelEnv) => {
      const result = HttpEnvSchema.safeParse({
        ...withClerkKeys,
        VERCEL_ENV: vercelEnv,
        OBSERVABILITY_SINKS: '["sentry","posthog"]',
        ...validPostHogVars,
        SENTRY_MODE: 'off',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find((i) => i.path.join('.') === 'SENTRY_MODE');
        expect(issue?.message).toContain('posthog');
        expect(issue?.message).toContain('false marker');
      }
    },
  );

  it.each(EVERY_ENVIRONMENT)(
    'rejects a posthog selection with SENTRY_MODE=sentry but no SENTRY_DSN in %s — Sentry cannot deliver',
    (vercelEnv) => {
      const result = HttpEnvSchema.safeParse({
        ...withClerkKeys,
        VERCEL_ENV: vercelEnv,
        OBSERVABILITY_SINKS: '["sentry","posthog"]',
        ...validPostHogVars,
        SENTRY_DSN: undefined,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const paths = result.error.issues.map((i) => i.path.join('.'));
        expect(paths).toContain('SENTRY_DSN');
      }
    },
  );

  // Live Sentry mode parses SENTRY_TRACES_SAMPLE_RATE at boot and rejects an
  // absent value, so an accepted selection without it passes the schema but
  // fails the real boot — validation-vs-boot mismatch (MCP-361).
  it.each(EVERY_ENVIRONMENT)(
    'rejects a posthog selection with no SENTRY_TRACES_SAMPLE_RATE in %s',
    (vercelEnv) => {
      const result = HttpEnvSchema.safeParse({
        ...withClerkKeys,
        VERCEL_ENV: vercelEnv,
        OBSERVABILITY_SINKS: '["sentry","posthog"]',
        ...validPostHogVars,
        SENTRY_TRACES_SAMPLE_RATE: undefined,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const paths = result.error.issues.map((i) => i.path.join('.'));
        expect(paths).toContain('SENTRY_TRACES_SAMPLE_RATE');
      }
    },
  );

  // SENTRY_ENABLE_LOGS=false turns the Sentry log sink off (createLiveLogSink
  // returns null), so posthog would ship with Sentry logs dark — the exact
  // state the ruling forbids. Unset is safe (defaults to true).
  it.each(EVERY_ENVIRONMENT)(
    'rejects a posthog selection with SENTRY_ENABLE_LOGS=false in %s',
    (vercelEnv) => {
      const result = HttpEnvSchema.safeParse({
        ...withClerkKeys,
        VERCEL_ENV: vercelEnv,
        OBSERVABILITY_SINKS: '["sentry","posthog"]',
        ...validPostHogVars,
        SENTRY_ENABLE_LOGS: 'false',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find((i) => i.path.join('.') === 'SENTRY_ENABLE_LOGS');
        expect(issue?.message).toContain('posthog');
        expect(issue?.message).toContain('logs');
      }
    },
  );

  it('accepts a posthog selection with SENTRY_ENABLE_LOGS explicitly "true"', () => {
    const result = HttpEnvSchema.safeParse({
      ...withClerkKeys,
      OBSERVABILITY_SINKS: '["sentry","posthog"]',
      ...validPostHogVars,
      SENTRY_ENABLE_LOGS: 'true',
    });
    expect(result.success).toBe(true);
  });

  it('reports every missing live-Sentry requirement at once', () => {
    // The rule accumulates rather than stopping at the first gap, so an
    // operator sees the whole picture. ["posthog"] with no live-Sentry
    // config at all must surface all of them.
    const result = HttpEnvSchema.safeParse({
      ...withClerkKeys,
      OBSERVABILITY_SINKS: '["posthog"]',
      ...validPostHogVars,
      SENTRY_MODE: 'off',
      SENTRY_DSN: undefined,
      SENTRY_TRACES_SAMPLE_RATE: undefined,
      SENTRY_ENABLE_LOGS: 'false',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join('.'));
      expect(paths).toContain('OBSERVABILITY_SINKS');
      expect(paths).toContain('SENTRY_MODE');
      expect(paths).toContain('SENTRY_DSN');
      expect(paths).toContain('SENTRY_TRACES_SAMPLE_RATE');
      expect(paths).toContain('SENTRY_ENABLE_LOGS');
    }
  });
});
