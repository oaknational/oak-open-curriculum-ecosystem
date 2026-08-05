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

// A minimal VALID production environment: live-realm keys (Guard 1a) plus a
// canonical host (Guard 3). Any fixture that asserts a production env is
// accepted must include both.
const withProdEnv = {
  ...withLiveClerkKeys,
  VERCEL_ENV: 'production' as const,
  CANONICAL_HOST: 'www.thenational.academy',
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

describe('Conditional Clerk keys (DANGEROUSLY_DISABLE_AUTH)', () => {
  it('accepts missing Clerk keys when DANGEROUSLY_DISABLE_AUTH=true', () => {
    const result = HttpEnvSchema.safeParse({
      ...baseEnv,
      DANGEROUSLY_DISABLE_AUTH: 'true',
    });

    expect(result.success).toBe(true);
  });

  it('rejects missing Clerk keys when auth enabled (no DANGEROUSLY_DISABLE_AUTH)', () => {
    const result = HttpEnvSchema.safeParse(baseEnv);
    expect(result.success).toBe(false);
  });

  it('rejects missing Clerk keys when DANGEROUSLY_DISABLE_AUTH=false', () => {
    const result = HttpEnvSchema.safeParse({
      ...baseEnv,
      DANGEROUSLY_DISABLE_AUTH: 'false',
    });

    expect(result.success).toBe(false);
  });

  it('accepts Clerk keys when auth enabled', () => {
    const result = HttpEnvSchema.safeParse(withClerkKeys);
    expect(result.success).toBe(true);
  });

  it('accepts Clerk keys even when DANGEROUSLY_DISABLE_AUTH=true', () => {
    const result = HttpEnvSchema.safeParse({
      ...withClerkKeys,
      DANGEROUSLY_DISABLE_AUTH: 'true',
    });

    expect(result.success).toBe(true);
  });

  it('rejects DANGEROUSLY_DISABLE_AUTH=true in production', () => {
    const result = HttpEnvSchema.safeParse({
      ...withClerkKeys,
      DANGEROUSLY_DISABLE_AUTH: 'true',
      VERCEL_ENV: 'production',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join('.'));
      expect(paths).toContain('DANGEROUSLY_DISABLE_AUTH');
    }
  });

  it('rejects DANGEROUSLY_DISABLE_AUTH=true in preview — a deployed, internet-reachable env', () => {
    const result = HttpEnvSchema.safeParse({
      ...baseEnv,
      DANGEROUSLY_DISABLE_AUTH: 'true',
      VERCEL_ENV: 'preview',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join('.'));
      expect(paths).toContain('DANGEROUSLY_DISABLE_AUTH');
    }
  });

  it('allows DANGEROUSLY_DISABLE_AUTH=true in development and when VERCEL_ENV is unset (local)', () => {
    const development = HttpEnvSchema.safeParse({
      ...baseEnv,
      DANGEROUSLY_DISABLE_AUTH: 'true',
      VERCEL_ENV: 'development',
    });
    expect(development.success).toBe(true);

    // Unset VERCEL_ENV = a local, non-Vercel run — the valve stays usable.
    const local = HttpEnvSchema.safeParse({
      ...baseEnv,
      DANGEROUSLY_DISABLE_AUTH: 'true',
    });
    expect(local.success).toBe(true);
  });

  describe('CANONICAL_HOST', () => {
    it('accepts an environment without it — per-request derivation is the default', () => {
      const result = HttpEnvSchema.safeParse(withClerkKeys);
      expect(result.success).toBe(true);
    });

    it('accepts a bare hostname', () => {
      const result = HttpEnvSchema.safeParse({
        ...withClerkKeys,
        CANONICAL_HOST: 'www.thenational.academy',
      });

      expect(result.success).toBe(true);
    });

    it.each([
      ['a port', 'www.thenational.academy:8443'],
      ['a scheme', 'https://www.thenational.academy'],
      ['a path', 'www.thenational.academy/mcp'],
      ['userinfo', 'www.thenational.academy:443@evil.example'],
      ['a comma-joined pair', 'www.thenational.academy,evil.example'],
      ['whitespace', 'www.thenational.academy evil.example'],
      ['an empty value', ''],
      ['a loopback name', 'localhost'],
    ])('rejects %s at startup rather than at request time', (_label, value) => {
      const result = HttpEnvSchema.safeParse({ ...withClerkKeys, CANONICAL_HOST: value });

      expect(result.success).toBe(false);
      if (!result.success) {
        const paths = result.error.issues.map((i) => i.path.join('.'));
        expect(paths).toContain('CANONICAL_HOST');
      }
    });
  });
});

describe('Clerk key-format locality (production)', () => {
  // Clerk key prefixes are canonical: pk_test_/pk_live_, sk_test_/sk_live_.
  // A production deployment holding development-realm (test) keys is the
  // confirmed live gap this guard closes (prod /oauth/authorize 307-ing to
  // the dev realm). See MCP-143 spec Guard 1a.

  it('rejects a pk_test_ publishable key in production, on the publishable-key path', () => {
    const result = HttpEnvSchema.safeParse({
      ...baseEnv,
      CLERK_PUBLISHABLE_KEY: 'pk_test_123',
      CLERK_SECRET_KEY: 'sk_live_123',
      VERCEL_ENV: 'production',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join('.'));
      expect(paths).toContain('CLERK_PUBLISHABLE_KEY');
    }
  });

  it('rejects an sk_test_ secret key in production, on the secret-key path', () => {
    const result = HttpEnvSchema.safeParse({
      ...baseEnv,
      CLERK_PUBLISHABLE_KEY: 'pk_live_123',
      CLERK_SECRET_KEY: 'sk_test_123',
      VERCEL_ENV: 'production',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join('.'));
      expect(paths).toContain('CLERK_SECRET_KEY');
    }
  });

  it('accepts a valid production environment (live keys + canonical host)', () => {
    const result = HttpEnvSchema.safeParse(withProdEnv);
    expect(result.success).toBe(true);
  });

  it('accepts test keys outside production — development, preview, and unset all pass', () => {
    for (const env of ['development', 'preview'] as const) {
      const result = HttpEnvSchema.safeParse({ ...withClerkKeys, VERCEL_ENV: env });
      expect(result.success).toBe(true);
    }
    // unset VERCEL_ENV (local, non-Vercel) also passes
    expect(HttpEnvSchema.safeParse(withClerkKeys).success).toBe(true);
  });
});

describe('CANONICAL_HOST required in production (Guard 3)', () => {
  // In production, CANONICAL_HOST is mandatory when auth is enabled: without
  // it, per-request Host derivation lets every Vercel alias mint its own OAuth
  // resource identifier. See MCP-143 spec Guard 3.
  it('rejects a production environment without CANONICAL_HOST when auth is enabled', () => {
    const result = HttpEnvSchema.safeParse({ ...withLiveClerkKeys, VERCEL_ENV: 'production' });

    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join('.'));
      expect(paths).toContain('CANONICAL_HOST');
    }
  });

  it('accepts a production environment with CANONICAL_HOST set', () => {
    const result = HttpEnvSchema.safeParse(withProdEnv);
    expect(result.success).toBe(true);
  });

  it('does not require CANONICAL_HOST outside production — preview, development, and unset pass', () => {
    expect(HttpEnvSchema.safeParse({ ...withClerkKeys, VERCEL_ENV: 'preview' }).success).toBe(true);
    expect(HttpEnvSchema.safeParse({ ...withClerkKeys, VERCEL_ENV: 'development' }).success).toBe(
      true,
    );
    expect(HttpEnvSchema.safeParse(withClerkKeys).success).toBe(true);
  });
});

describe('production-detection corroboration (VERCEL_ENV unset)', () => {
  // MCP-143 security-expert item 1: the production guard family must not
  // silently no-op if a genuine Vercel production deployment boots with
  // VERCEL_ENV unset. A Vercel deploy (VERCEL='1') carrying a canonical host
  // but missing VERCEL_ENV is treated as production; local (VERCEL unset) and
  // preview are not.
  it('rejects a test publishable key on a Vercel deploy missing VERCEL_ENV but carrying CANONICAL_HOST', () => {
    const result = HttpEnvSchema.safeParse({
      ...baseEnv,
      CLERK_PUBLISHABLE_KEY: 'pk_test_123',
      CLERK_SECRET_KEY: 'sk_live_123',
      VERCEL: '1',
      CANONICAL_HOST: 'www.thenational.academy',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join('.'));
      expect(paths).toContain('CLERK_PUBLISHABLE_KEY');
    }
  });

  it('permits test keys locally even with CANONICAL_HOST set — VERCEL unset is not production', () => {
    const result = HttpEnvSchema.safeParse({
      ...withClerkKeys,
      CANONICAL_HOST: 'www.thenational.academy',
    });
    expect(result.success).toBe(true);
  });

  it('does not treat preview as production even with VERCEL=1 and CANONICAL_HOST set', () => {
    const result = HttpEnvSchema.safeParse({
      ...withClerkKeys,
      VERCEL: '1',
      VERCEL_ENV: 'preview',
      CANONICAL_HOST: 'www.thenational.academy',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a test key on a Vercel deploy missing VERCEL_ENV even when CANONICAL_HOST is also absent', () => {
    // The residual the CANONICAL_HOST conjunct would have left open: a real
    // deploy that lost VERCEL_ENV and has no canonical host must still fail
    // closed rather than boot against the Clerk development realm.
    const result = HttpEnvSchema.safeParse({
      ...baseEnv,
      CLERK_PUBLISHABLE_KEY: 'pk_test_123',
      CLERK_SECRET_KEY: 'sk_live_123',
      VERCEL: '1',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join('.'));
      expect(paths).toContain('CLERK_PUBLISHABLE_KEY');
    }
  });

  it('rejects DANGEROUSLY_DISABLE_AUTH=true on a Vercel deploy missing VERCEL_ENV', () => {
    // Highest-severity: a deployment that lost VERCEL_ENV must not be able to
    // disable auth. isDeployedEnvironment treats VERCEL=1 + VERCEL_ENV-absent
    // as deployed, so the valve is blocked.
    const result = HttpEnvSchema.safeParse({
      ...baseEnv,
      DANGEROUSLY_DISABLE_AUTH: 'true',
      VERCEL: '1',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join('.'));
      expect(paths).toContain('DANGEROUSLY_DISABLE_AUTH');
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
          // VALID prod env under Guards 1a (live-realm keys) and 3
          // (CANONICAL_HOST required); both are also accepted in dev/preview.
          ...withLiveClerkKeys,
          CANONICAL_HOST: 'www.thenational.academy',
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

describe('CLERK_AUTHORIZED_PARTIES (session-token azp allowlist — Guard 1c)', () => {
  // The value is an origin allowlist Clerk validates against a SESSION token's
  // `azp` claim (subdomain-cookie-leak / CSRF hardening). Clerk matches each
  // entry byte-for-byte (`authorizedParties.includes(azp)`) with NO
  // normalisation — a trailing slash, a path, or a bare host would silently
  // fail to match. So the boundary rejects anything that is not an exact
  // scheme://host[:port] origin, making a misconfiguration a startup failure
  // rather than a security control that quietly never matches.

  it('accepts an environment without it — the option is simply omitted (allow-all)', () => {
    const result = HttpEnvSchema.safeParse(withClerkKeys);
    expect(result.success).toBe(true);
  });

  it('accepts a single canonical origin', () => {
    const result = HttpEnvSchema.safeParse({
      ...withClerkKeys,
      CLERK_AUTHORIZED_PARTIES: 'https://www.thenational.academy',
    });
    expect(result.success).toBe(true);
  });

  it('accepts a comma-separated list of origins with surrounding whitespace', () => {
    const result = HttpEnvSchema.safeParse({
      ...withClerkKeys,
      CLERK_AUTHORIZED_PARTIES: 'https://www.thenational.academy, https://labs.thenational.academy',
    });
    expect(result.success).toBe(true);
  });

  it.each([
    ['a trailing slash — would never match the azp claim', 'https://www.thenational.academy/'],
    ['a path', 'https://www.thenational.academy/mcp'],
    ['a bare host with no scheme', 'www.thenational.academy'],
    ['a non-http(s) scheme', 'ftp://www.thenational.academy'],
    ['one bad entry among good ones', 'https://www.thenational.academy,evil.example'],
    ['an empty value', ''],
  ])('rejects %s at startup', (_label, value) => {
    const result = HttpEnvSchema.safeParse({
      ...withClerkKeys,
      CLERK_AUTHORIZED_PARTIES: value,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join('.'));
      expect(paths).toContain('CLERK_AUTHORIZED_PARTIES');
    }
  });
});
