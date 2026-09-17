import { describe, it, expect } from 'vitest';
import { HttpEnvSchema } from './env.js';

// Split from `env.unit.test.ts` when the MCP-143 Clerk-guard suites (Guards
// 1a, 1b, 3, and 1c) took that file over the 700-line file-size gate. This
// file carries the Clerk/deployment production-promotion guard behaviour;
// `env.unit.test.ts` keeps the general schema shape and the PostHog
// product-analytics selection suite.

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
        CANONICAL_HOST: 'mcp.thenational.academy',
      });

      expect(result.success).toBe(true);
    });

    it.each([
      ['a port', 'mcp.thenational.academy:8443'],
      ['a scheme', 'https://mcp.thenational.academy'],
      ['a path', 'mcp.thenational.academy/mcp'],
      ['userinfo', 'mcp.thenational.academy:443@evil.example'],
      ['a comma-joined pair', 'mcp.thenational.academy,evil.example'],
      ['whitespace', 'mcp.thenational.academy evil.example'],
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

  // Discriminating cases: the guard is a production ALLOWLIST (require
  // pk_live_/sk_live_), not merely a pk_test_/sk_test_ denylist. A key whose
  // prefix is neither test nor live — a malformed, staging, or wrong-realm
  // key — must ALSO fail closed. A denylist keyed on the test prefix would
  // have let these boot production against a non-live Clerk realm.
  it('rejects an unknown-prefix publishable key in production (allowlist, not a pk_test_ denylist)', () => {
    const result = HttpEnvSchema.safeParse({
      ...baseEnv,
      CLERK_PUBLISHABLE_KEY: 'pk_foobar_123',
      CLERK_SECRET_KEY: 'sk_live_123',
      VERCEL_ENV: 'production',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join('.'));
      expect(paths).toContain('CLERK_PUBLISHABLE_KEY');
    }
  });

  it('rejects an unknown-prefix secret key in production (allowlist, not an sk_test_ denylist)', () => {
    const result = HttpEnvSchema.safeParse({
      ...baseEnv,
      CLERK_PUBLISHABLE_KEY: 'pk_live_123',
      CLERK_SECRET_KEY: 'sk_staging_123',
      VERCEL_ENV: 'production',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join('.'));
      expect(paths).toContain('CLERK_SECRET_KEY');
    }
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
