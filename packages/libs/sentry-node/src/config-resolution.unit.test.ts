import { describe, expect, it } from 'vitest';
import { resolveSentryEnvironment, resolveSentryRegistrationPolicy } from './config-resolution.js';
import type { SentryConfigEnvironment } from './types.js';

function input(overrides: Partial<SentryConfigEnvironment>): SentryConfigEnvironment {
  return { ...overrides };
}

describe('resolveSentryEnvironment (ADR-163 §3 environment identity)', () => {
  it.each([
    ['production', 'main', 'production', 'VERCEL_ENV'],
    ['production', 'feature/x', 'preview', 'VERCEL_ENV'],
    ['production', '', 'preview', 'VERCEL_ENV'],
    ['production', undefined, 'preview', 'VERCEL_ENV'],
    ['preview', 'anything', 'preview', 'VERCEL_ENV'],
    ['preview', 'main', 'preview', 'VERCEL_ENV'],
    ['development', 'anything', 'development', 'VERCEL_ENV'],
  ])(
    'VERCEL_ENV=%s VERCEL_GIT_COMMIT_REF=%s → environment=%s source=%s',
    (vercelEnv, ref, expectedValue, expectedSource) => {
      const resolved = resolveSentryEnvironment(
        input({ VERCEL_ENV: vercelEnv, VERCEL_GIT_COMMIT_REF: ref }),
      );

      expect(resolved).toEqual({ value: expectedValue, source: expectedSource });
    },
  );

  it('falls back to development with source=development when VERCEL_ENV is unset', () => {
    const resolved = resolveSentryEnvironment(input({ VERCEL_GIT_COMMIT_REF: 'main' }));

    expect(resolved).toEqual({ value: 'development', source: 'development' });
  });

  it('SENTRY_ENVIRONMENT_OVERRIDE wins over VERCEL_ENV for environment identity', () => {
    const resolved = resolveSentryEnvironment(
      input({
        SENTRY_ENVIRONMENT_OVERRIDE: 'staging',
        VERCEL_ENV: 'production',
        VERCEL_GIT_COMMIT_REF: 'main',
      }),
    );

    expect(resolved).toEqual({ value: 'staging', source: 'SENTRY_ENVIRONMENT_OVERRIDE' });
  });

  it('treats whitespace VERCEL_GIT_COMMIT_REF as unset (production → preview)', () => {
    const resolved = resolveSentryEnvironment(
      input({ VERCEL_ENV: 'production', VERCEL_GIT_COMMIT_REF: '   ' }),
    );

    expect(resolved).toEqual({ value: 'preview', source: 'VERCEL_ENV' });
  });
});

describe('resolveSentryRegistrationPolicy (ADR-163 §3 registration + warning)', () => {
  it.each([
    ['production', 'main', true, undefined],
    ['production', 'feature/x', true, 'production_env_with_non_main_branch'],
    ['production', '', true, 'production_env_with_missing_branch'],
    ['production', undefined, true, 'production_env_with_missing_branch'],
    ['preview', 'anything', true, undefined],
    ['development', 'anything', false, undefined],
  ])(
    'VERCEL_ENV=%s VERCEL_GIT_COMMIT_REF=%s → registerRelease=%s warning=%s',
    (vercelEnv, ref, expectedRegister, expectedWarning) => {
      const result = resolveSentryRegistrationPolicy(
        input({ VERCEL_ENV: vercelEnv, VERCEL_GIT_COMMIT_REF: ref }),
      );

      expect(result.ok).toBe(true);
      if (!result.ok) {
        return;
      }
      expect(result.value.registerRelease).toBe(expectedRegister);
      expect(result.value.warning).toBe(expectedWarning);
    },
  );

  it('unset VERCEL_ENV yields registerRelease=false with no warning', () => {
    const result = resolveSentryRegistrationPolicy(input({ VERCEL_GIT_COMMIT_REF: 'main' }));

    expect(result).toEqual({
      ok: true,
      value: { registerRelease: false },
    });
  });
});

describe('resolveSentryRegistrationPolicy override-pair validation (ADR-163 §4)', () => {
  it('enables registerRelease in development when both override envs are set', () => {
    const result = resolveSentryRegistrationPolicy(
      input({
        VERCEL_ENV: 'development',
        SENTRY_RELEASE_REGISTRATION_OVERRIDE: '1',
        SENTRY_RELEASE_OVERRIDE: 'uat-candidate',
      }),
    );

    expect(result).toEqual({
      ok: true,
      value: { registerRelease: true },
    });
  });

  it('fails with invalid_release_registration_override when only the flag is set', () => {
    const result = resolveSentryRegistrationPolicy(
      input({
        VERCEL_ENV: 'development',
        SENTRY_RELEASE_REGISTRATION_OVERRIDE: '1',
      }),
    );

    expect(result).toEqual({
      ok: false,
      error: { kind: 'invalid_release_registration_override' },
    });
  });

  it('fails with invalid_release_registration_override when only the value is set in development', () => {
    const result = resolveSentryRegistrationPolicy(
      input({
        VERCEL_ENV: 'development',
        SENTRY_RELEASE_OVERRIDE: 'uat-candidate',
      }),
    );

    expect(result).toEqual({
      ok: false,
      error: { kind: 'invalid_release_registration_override' },
    });
  });

  it('fails with invalid_release_registration_override when only the value is set and VERCEL_ENV is unset', () => {
    const result = resolveSentryRegistrationPolicy(
      input({ SENTRY_RELEASE_OVERRIDE: 'uat-candidate' }),
    );

    expect(result).toEqual({
      ok: false,
      error: { kind: 'invalid_release_registration_override' },
    });
  });

  it('accepts SENTRY_RELEASE_OVERRIDE alone in production (registerRelease=true already)', () => {
    const result = resolveSentryRegistrationPolicy(
      input({
        VERCEL_ENV: 'production',
        VERCEL_GIT_COMMIT_REF: 'main',
        SENTRY_RELEASE_OVERRIDE: 'hotfix-1',
      }),
    );

    expect(result).toEqual({
      ok: true,
      value: { registerRelease: true },
    });
  });

  it('accepts SENTRY_RELEASE_OVERRIDE alone in preview (registerRelease=true already)', () => {
    const result = resolveSentryRegistrationPolicy(
      input({
        VERCEL_ENV: 'preview',
        SENTRY_RELEASE_OVERRIDE: 'branch-build',
      }),
    );

    expect(result).toEqual({
      ok: true,
      value: { registerRelease: true },
    });
  });

  it.each(['true', 'TRUE', 'yes', 'on', '2', ''])(
    'treats SENTRY_RELEASE_REGISTRATION_OVERRIDE=%j as NOT enabling the override (only exact "1")',
    (rawValue) => {
      const result = resolveSentryRegistrationPolicy(
        input({
          VERCEL_ENV: 'development',
          SENTRY_RELEASE_REGISTRATION_OVERRIDE: rawValue,
          SENTRY_RELEASE_OVERRIDE: 'uat-candidate',
        }),
      );

      expect(result).toEqual({
        ok: false,
        error: { kind: 'invalid_release_registration_override' },
      });
    },
  );

  it('trims whitespace around SENTRY_RELEASE_REGISTRATION_OVERRIDE before matching "1"', () => {
    const result = resolveSentryRegistrationPolicy(
      input({
        VERCEL_ENV: 'development',
        SENTRY_RELEASE_REGISTRATION_OVERRIDE: '  1  ',
        SENTRY_RELEASE_OVERRIDE: 'uat-candidate',
      }),
    );

    expect(result).toEqual({
      ok: true,
      value: { registerRelease: true },
    });
  });
});

describe('resolveSentryEnvironment + resolveSentryRegistrationPolicy row-level coherence (ADR-163 §3)', () => {
  it.each([
    // ADR §3 prose: "production + non-main → environment=preview, register yes (as preview), warning=non_main"
    [
      { VERCEL_ENV: 'production', VERCEL_GIT_COMMIT_REF: 'feature/x' },
      {
        environment: 'preview',
        registerRelease: true,
        warning: 'production_env_with_non_main_branch',
      },
    ],
    // ADR §3 prose: "production + missing → environment=preview, register yes (as preview), warning=missing_branch"
    [
      { VERCEL_ENV: 'production', VERCEL_GIT_COMMIT_REF: undefined },
      {
        environment: 'preview',
        registerRelease: true,
        warning: 'production_env_with_missing_branch',
      },
    ],
    // ADR §3 prose: "production + main → environment=production, register yes, no warning"
    [
      { VERCEL_ENV: 'production', VERCEL_GIT_COMMIT_REF: 'main' },
      { environment: 'production', registerRelease: true, warning: undefined },
    ],
  ])('composed resolvers agree for %o', (rawInput, expected) => {
    const env = resolveSentryEnvironment(input(rawInput));
    const policy = resolveSentryRegistrationPolicy(input(rawInput));

    expect(env.value).toBe(expected.environment);
    expect(policy.ok).toBe(true);
    if (!policy.ok) {
      return;
    }
    expect(policy.value.registerRelease).toBe(expected.registerRelease);
    expect(policy.value.warning).toBe(expected.warning);
  });
});
