import { describe, expect, it } from 'vitest';
import {
  DEPLOY_GATE_ENV_KEYS,
  filterDeployGateEnv,
  runDeployConfigValidation,
} from './validate-deploy-config.js';

/** The smallest environment the deployed server boots on (mirrors the dev-boot invariant). */
const minimalBootEnv = {
  OAK_API_KEY: 'test-oak-api-key',
  ELASTICSEARCH_URL: 'https://example-elasticsearch.test',
  ELASTICSEARCH_API_KEY: 'test-elasticsearch-api-key',
  DANGEROUSLY_DISABLE_AUTH: 'true',
  OAK_CURRICULUM_MCP_USE_STUB_TOOLS: 'true',
  APP_VERSION_OVERRIDE: '1.2.3-test',
} as const;

/** Live-shaped key material: the bytes that must never reach a build log. */
const liveShapedSecrets = {
  OAK_API_KEY: 'oak_live_9f8e7d6c5b4a3f2e1d0c',
  ELASTICSEARCH_API_KEY: 'ZXMtbGl2ZS1rZXktaWQ6ZXMtbGl2ZS1rZXktc2VjcmV0',
  CLERK_SECRET_KEY: 'sk_live_4eC39HqLyjWDarjtT1zdp7dc',
  CLERK_PUBLISHABLE_KEY: 'pk_live_Y2xlcmsubGl2ZS5leGFtcGxlJA',
  SENTRY_DSN: 'https://0a1b2c3d4e5f60718293a4b5c6d7e8f9@o4500000000.ingest.sentry.io/4500000000',
  POSTHOG_PROJECT_API_KEY: 'phc_LIVEprojectKEY0123456789abcdefghijklmnop',
} as const;

function runGate(processEnv: NodeJS.ProcessEnv): {
  readonly exitCode: 0 | 1;
  readonly out: readonly string[];
  readonly err: readonly string[];
} {
  const out: string[] = [];
  const err: string[] = [];
  const exitCode = runDeployConfigValidation({
    processEnv,
    writeOut: (line) => {
      out.push(line);
    },
    writeErr: (line) => {
      err.push(line);
    },
  });
  return { exitCode, out, err };
}

function expectNoSecretBytes(lines: readonly string[]): void {
  const output = lines.join('\n');
  for (const value of Object.values(liveShapedSecrets)) {
    expect(output).not.toContain(value);
  }
}

describe('deploy-config validation gate — the real loaders behind the entry seam', () => {
  it('skips with exit 0 outside Vercel builds, even on an environment that would not boot', () => {
    const { exitCode, out, err } = runGate({ SENTRY_MODE: 'sentry' });

    expect(exitCode).toBe(0);
    expect(out).toHaveLength(1);
    expect(out[0]).toContain('skipped');
    expect(err).toHaveLength(0);
  });

  it('passes a Vercel build whose environment boots the server', () => {
    const { exitCode, out, err } = runGate({ VERCEL: '1', ...minimalBootEnv });

    expect(exitCode).toBe(0);
    expect(out[0]).toContain('deploy configuration is valid');
    expect(err).toHaveLength(0);
  });

  it('fails a Vercel build that passes the env schema but not observability composition', () => {
    // Sentry mode without a DSN: the env schema accepts it, the Sentry
    // configuration parse refuses it, and the deployed handler would fail —
    // the boot-dead shape the gate exists to catch. Failures go to stderr.
    const { exitCode, out, err } = runGate({
      VERCEL: '1',
      ...minimalBootEnv,
      SENTRY_MODE: 'sentry',
    });

    expect(exitCode).toBe(1);
    expect(out).toHaveLength(0);
    expect(err[0]).toContain('deploy configuration is invalid');
    expect(err[0]).toMatch(/dsn/i);
  });

  it('fails a Vercel build whose environment fails the env schema, carrying the boundary message', () => {
    const { exitCode, err } = runGate({ VERCEL: '1' });

    expect(exitCode).toBe(1);
    expect(err[0]).toContain('deploy configuration is invalid');
  });
});

describe('deploy-config validation gate — filtered credentials', () => {
  it('sees only the validated variables, never build-only credentials', () => {
    const filtered = filterDeployGateEnv({
      OAK_API_KEY: 'k',
      SENTRY_AUTH_TOKEN: 'build-only',
      TURBO_TOKEN: 'build-only',
      VERCEL_OIDC_TOKEN: 'build-only',
    });

    expect(filtered).toEqual({ OAK_API_KEY: 'k' });
    expect(DEPLOY_GATE_ENV_KEYS).toContain('VERCEL');
    expect(DEPLOY_GATE_ENV_KEYS).not.toContain('SENTRY_AUTH_TOKEN');
  });
});

describe('deploy-config validation gate — output discipline', () => {
  it('prints no secret bytes on the pass path', () => {
    const { exitCode, out, err } = runGate({
      VERCEL: '1',
      ...minimalBootEnv,
      ...liveShapedSecrets,
    });

    expect(exitCode).toBe(0);
    expectNoSecretBytes([...out, ...err]);
  });

  it('prints no secret bytes when the env schema refuses', () => {
    // A test-realm publishable key on a production deployment: the schema's
    // key-locality guard refuses it, so the live secret key beside it must
    // not surface in the refusal.
    const { exitCode, out, err } = runGate({
      VERCEL: '1',
      VERCEL_ENV: 'production',
      ...minimalBootEnv,
      ...liveShapedSecrets,
      DANGEROUSLY_DISABLE_AUTH: 'false',
      CLERK_PUBLISHABLE_KEY: 'pk_test_dGVzdC5leGFtcGxlJA',
    });

    expect(exitCode).toBe(1);
    expectNoSecretBytes([...out, ...err]);
  });

  for (const field of [
    'SENTRY_TRACES_SAMPLE_RATE',
    'SENTRY_MODE',
    'OBSERVABILITY_SINKS',
  ] as const) {
    it(`prints no secret bytes when a credential is pasted into ${field}`, () => {
      // A value in the wrong field is refused by the schema or the Sentry
      // parser; both refusal paths would echo the value, so the gate
      // renders variable names and refusal kinds only.
      const pasted = 'sk_live_PASTED_INTO_THE_WRONG_FIELD_9f8e7d6c';
      // Sentry mode on with a DSN, so the Sentry parser reaches the sample
      // rate; the other two fields are refused by the env schema itself.
      const { exitCode, out, err } = runGate({
        VERCEL: '1',
        ...minimalBootEnv,
        SENTRY_MODE: 'sentry',
        SENTRY_DSN: liveShapedSecrets.SENTRY_DSN,
        [field]: pasted,
      });

      expect(exitCode).toBe(1);
      expect([...out, ...err].join('\n')).not.toContain(pasted);
      expect(err[0]).toMatch(field === 'OBSERVABILITY_SINKS' ? /OBSERVABILITY_SINKS/ : /sentry/i);
    });
  }

  it('names the variable, never the value, when a post-schema check refuses the version override', () => {
    const pasted = 'sk_live_NOT_A_VERSION_9f8e7d6c';
    const { exitCode, out, err } = runGate({
      VERCEL: '1',
      ...minimalBootEnv,
      APP_VERSION_OVERRIDE: pasted,
    });

    expect(exitCode).toBe(1);
    expect([...out, ...err].join('\n')).not.toContain(pasted);
    expect(err[0]).toContain('APP_VERSION_OVERRIDE');
  });

  it('names the variable family, never the value, when the pseudonym keyring fails its deep parse', () => {
    const pasted = 'sk_live_NOT_A_KEYRING_9f8e7d6c';
    // Schema-valid PostHog selection (the closed configuration the env
    // schema accepts: verified auth on, Sentry and PostHog both selected),
    // with a keyring entry whose key is not canonical key material: the
    // schema passes it as a string, the deep parse refuses it.
    const { exitCode, out, err } = runGate({
      VERCEL: '1',
      ...minimalBootEnv,
      DANGEROUSLY_DISABLE_AUTH: 'false',
      CLERK_PUBLISHABLE_KEY: 'pk_test_dGVzdC5leGFtcGxlJA',
      CLERK_SECRET_KEY: 'sk_test_0123456789abcdefghijklmnop',
      OBSERVABILITY_SINKS: '["sentry","posthog"]',
      SENTRY_MODE: 'sentry',
      SENTRY_DSN: liveShapedSecrets.SENTRY_DSN,
      POSTHOG_PROJECT_API_KEY: liveShapedSecrets.POSTHOG_PROJECT_API_KEY,
      POSTHOG_HOST: 'https://eu.i.posthog.com',
      POSTHOG_PSEUDONYM_ACTIVE_KEY_ID: 'k2026_01',
      POSTHOG_PSEUDONYM_KEYRING: JSON.stringify([{ id: 'k2026_01', key: pasted }]),
    });

    expect(exitCode).toBe(1);
    expect([...out, ...err].join('\n')).not.toContain(pasted);
    expect([...out, ...err].join('\n')).not.toContain(liveShapedSecrets.POSTHOG_PROJECT_API_KEY);
    expect(err[0]).toContain('POSTHOG_PSEUDONYM_KEYRING');
  });

  it('prints no secret bytes when observability composition refuses', () => {
    const { exitCode, out, err } = runGate({
      VERCEL: '1',
      ...minimalBootEnv,
      ...liveShapedSecrets,
      SENTRY_DSN: undefined,
      SENTRY_MODE: 'sentry',
    });

    expect(exitCode).toBe(1);
    expectNoSecretBytes([...out, ...err]);
  });
});
