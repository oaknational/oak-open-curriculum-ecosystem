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

// Production-realm keys. Required whenever a fixture sets
// VERCEL_ENV: 'production', since the Guard 1a key-locality refinement
// rejects pk_test_/sk_test_ keys in production.
const withLiveClerkKeys = {
  ...baseEnv,
  CLERK_PUBLISHABLE_KEY: 'pk_live_123',
  CLERK_SECRET_KEY: 'sk_live_123',
};

describe('Environment Schema', () => {
  it('requires CLERK_PUBLISHABLE_KEY when auth enabled', () => {
    const result = HttpEnvSchema.safeParse(baseEnv);
    expect(result.success).toBe(false);
  });

  it('requires CLERK_SECRET_KEY when auth enabled', () => {
    const result = HttpEnvSchema.safeParse({
      ...baseEnv,
      CLERK_PUBLISHABLE_KEY: 'pk_test_123',
    });
    expect(result.success).toBe(false);
  });

  it('strips unknown fields like ENABLE_LOCAL_AS', () => {
    const result = HttpEnvSchema.safeParse({
      ...withClerkKeys,
      ENABLE_LOCAL_AS: 'true',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect('ENABLE_LOCAL_AS' in result.data).toBe(false);
    }
  });

  it('requires ELASTICSEARCH_URL', () => {
    const result = HttpEnvSchema.safeParse({
      OAK_API_KEY: 'test-key',
      CLERK_PUBLISHABLE_KEY: 'pk_test_123',
      CLERK_SECRET_KEY: 'sk_test_123',
      ELASTICSEARCH_API_KEY: 'test-api-key',
    });
    expect(result.success).toBe(false);
  });

  it('requires ELASTICSEARCH_API_KEY', () => {
    const result = HttpEnvSchema.safeParse({
      OAK_API_KEY: 'test-key',
      CLERK_PUBLISHABLE_KEY: 'pk_test_123',
      CLERK_SECRET_KEY: 'sk_test_123',
      ELASTICSEARCH_URL: 'http://localhost:9200',
    });
    expect(result.success).toBe(false);
  });

  it('accepts valid configuration with Clerk keys', () => {
    const result = HttpEnvSchema.safeParse(withClerkKeys);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.CLERK_PUBLISHABLE_KEY).toBe('pk_test_123');
      expect(result.data.CLERK_SECRET_KEY).toBe('sk_test_123');
    }
  });

  it('does not include CORS_MODE or ALLOWED_ORIGINS in the schema', () => {
    const result = HttpEnvSchema.safeParse({
      ...withClerkKeys,
      CORS_MODE: 'automatic',
      ALLOWED_ORIGINS: 'http://localhost:3000',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect('CORS_MODE' in result.data).toBe(false);
      expect('ALLOWED_ORIGINS' in result.data).toBe(false);
    }
  });
});

describe('PostHog product-analytics selection (OBSERVABILITY_SINKS)', () => {
  const ZERO_KEY = Buffer.alloc(32, 0).toString('base64url');
  // A valid posthog-selected boot needs the PostHog inputs AND live Sentry:
  // the "sentry" sink is only a selection marker, so SENTRY_MODE must be
  // "sentry" (not the default "off") with a DSN for the diagnostic sink to
  // actually deliver (MCP-361, owner-strengthened).
  const validPostHogVars = {
    POSTHOG_PROJECT_API_KEY: 'phc_test_project_key',
    POSTHOG_HOST: 'https://eu.i.posthog.com',
    POSTHOG_PSEUDONYM_ACTIVE_KEY_ID: 'k2026_01',
    POSTHOG_PSEUDONYM_KEYRING: JSON.stringify([{ id: 'k2026_01', key: ZERO_KEY }]),
    SENTRY_MODE: 'sentry',
    SENTRY_DSN: 'https://public@example.ingest.sentry.io/123456',
  };

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

  describe('requires "sentry" alongside "posthog" in every environment (MCP-361)', () => {
    // Owner ruling 2026-07-29: Sentry-as-an-observability-sink is
    // non-negotiable. The app boots from HttpEnvSchema, so the invariant is
    // enforced here (refineProductAnalyticsEnv), not only in the library
    // ObservabilityEnvSchema. Stronger than the previous production-only
    // "any diagnostic sink" rule: the required companion is "sentry"
    // specifically, and it holds in development and preview too.
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
          // Live keys + canonical host so the `production` iteration is a
          // VALID prod env across the MCP-143 guard cascade: Guard 1a requires
          // live-realm keys in production, and Guard 3 requires CANONICAL_HOST
          // there. Guard 3 arrives with PR-3, so on branches before that this
          // fixture is forward-compatible with it rather than exercising it —
          // do not read the mention as evidence the control is already live.
          // Both values are also accepted in dev/preview.
          ...withLiveClerkKeys,
          CANONICAL_HOST: 'mcp.thenational.academy',
          VERCEL_ENV: vercelEnv,
          OBSERVABILITY_SINKS: '["sentry","posthog"]',
          ...validPostHogVars,
        });
        expect(result.success).toBe(true);
      },
    );

    // The sink marker alone is not enough: SENTRY_MODE gates real delivery,
    // so SENTRY_MODE=off (the default) boots the sink dark — the exact
    // "false marker" an operator hits when they set only the sink. PostHog
    // must never ship without Sentry actually active (owner-strengthened,
    // MCP-361).
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

    it('reports every missing Sentry requirement at once (sink, SENTRY_MODE, DSN)', () => {
      // The rule accumulates rather than stopping at the first gap, so an
      // operator sees the whole picture. ["posthog"] alone with no Sentry
      // config at all must surface all three paths.
      const result = HttpEnvSchema.safeParse({
        ...withClerkKeys,
        OBSERVABILITY_SINKS: '["posthog"]',
        ...validPostHogVars,
        SENTRY_MODE: 'off',
        SENTRY_DSN: undefined,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const paths = result.error.issues.map((i) => i.path.join('.'));
        expect(paths).toContain('OBSERVABILITY_SINKS');
        expect(paths).toContain('SENTRY_MODE');
        expect(paths).toContain('SENTRY_DSN');
      }
    });
  });
});
