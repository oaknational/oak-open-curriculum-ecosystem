import { unwrap } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import type { Env } from './env.js';
import {
  composeLoadedRuntimeFromValidatedEnv,
  createRuntimeConfigFromValidatedEnv,
} from './runtime-config-from-validated-env.js';

const localOffModeEnv = {
  OAK_API_KEY: 'test-api-key',
  ELASTICSEARCH_URL: 'https://example-elasticsearch.test',
  ELASTICSEARCH_API_KEY: 'test-es-key',
  DANGEROUSLY_DISABLE_AUTH: 'true',
  LOG_LEVEL: 'info',
  SENTRY_MODE: 'off',
  APP_VERSION_OVERRIDE: '1.2.3-test',
} satisfies Env;

describe('createRuntimeConfigFromValidatedEnv', () => {
  it('builds off-mode observability without env-file IO or deploy release metadata', () => {
    const runtimeConfig = unwrap(createRuntimeConfigFromValidatedEnv(localOffModeEnv));

    expect(runtimeConfig.gitSha).toBeUndefined();
    expect(runtimeConfig.env.VERCEL_GIT_COMMIT_SHA).toBeUndefined();
    expect(runtimeConfig.env.VERCEL_BRANCH_URL).toBeUndefined();
    expect(runtimeConfig.env.SENTRY_RELEASE_OVERRIDE).toBeUndefined();
    expect(runtimeConfig.version).toBe('1.2.3-test');
  });

  it('defaults the observability selection to the empty array in off mode', () => {
    const runtimeConfig = unwrap(createRuntimeConfigFromValidatedEnv(localOffModeEnv));

    expect(runtimeConfig.env.OBSERVABILITY_SINKS).toEqual([]);
  });

  describe('with posthog selected', () => {
    const zeroKey = Buffer.alloc(32, 0).toString('base64url');
    const selectedEnv = {
      OAK_API_KEY: 'test-api-key',
      ELASTICSEARCH_URL: 'https://example-elasticsearch.test',
      ELASTICSEARCH_API_KEY: 'test-es-key',
      CLERK_PUBLISHABLE_KEY: 'pk_test_123',
      CLERK_SECRET_KEY: 'sk_test_123',
      LOG_LEVEL: 'info',
      // posthog is selected, so Sentry must be actively delivering and
      // logging, not merely marked (MCP-361, owner-strengthened):
      // SENTRY_MODE=sentry + DSN + traces sample rate (SENTRY_ENABLE_LOGS
      // defaults to true when unset).
      SENTRY_MODE: 'sentry',
      SENTRY_DSN: 'https://public@example.ingest.sentry.io/123456',
      SENTRY_TRACES_SAMPLE_RATE: '0.1',
      APP_VERSION_OVERRIDE: '1.2.3-test',
      OBSERVABILITY_SINKS: '["sentry","posthog"]',
      POSTHOG_PROJECT_API_KEY: 'phc_test_project_key',
      POSTHOG_HOST: 'https://eu.i.posthog.com',
      POSTHOG_PSEUDONYM_ACTIVE_KEY_ID: 'k2026_01',
      POSTHOG_PSEUDONYM_KEYRING: JSON.stringify([{ id: 'k2026_01', key: zeroKey }]),
    } satisfies Env;

    it('strips every PostHog input from the handler-facing env — including any future one', () => {
      const runtimeConfig = unwrap(createRuntimeConfigFromValidatedEnv(selectedEnv));

      // The prefix filter catches a sixth POSTHOG_* input added to the
      // schema without a matching strip, with no test edit needed.
      const posthogKeys = Object.keys(runtimeConfig.env).filter((key) =>
        key.startsWith('POSTHOG_'),
      );
      expect(posthogKeys).toEqual([]);
    });

    it('exposes no secret through the serialisable runtime config', () => {
      const runtimeConfig = unwrap(createRuntimeConfigFromValidatedEnv(selectedEnv));

      const serialised = JSON.stringify(runtimeConfig);
      expect(serialised).not.toContain('phc_test_project_key');
      expect(serialised).not.toContain(zeroKey);
      expect(serialised).not.toContain('k2026_01');
    });

    it('keeps the parsed observability selection available to the composition root', () => {
      const runtimeConfig = unwrap(createRuntimeConfigFromValidatedEnv(selectedEnv));

      expect(runtimeConfig.env.OBSERVABILITY_SINKS).toEqual(['sentry', 'posthog']);
    });

    it('strips stale PostHog values in off mode too — deselection never leaks them onward', () => {
      const runtimeConfig = unwrap(
        createRuntimeConfigFromValidatedEnv({
          ...selectedEnv,
          OBSERVABILITY_SINKS: '["sentry"]',
          // Tolerated in off mode by the selection-gated rule — and still
          // stripped: no PostHog input of any kind reaches handlers.
          POSTHOG_CAPTURE_MODE: 'immediate',
        }),
      );

      const posthogKeys = Object.keys(runtimeConfig.env).filter((key) =>
        key.startsWith('POSTHOG_'),
      );
      expect(posthogKeys).toEqual([]);
      expect(JSON.stringify(runtimeConfig)).not.toContain(zeroKey);
    });

    it('echoes no supplied PostHog value through an env-layer validation failure', () => {
      const result = createRuntimeConfigFromValidatedEnv({
        ...selectedEnv,
        POSTHOG_HOST: 'https://us.i.posthog.com',
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        const serialised = JSON.stringify(result.error);
        expect(serialised).not.toContain('phc_test_project_key');
        expect(serialised).not.toContain(zeroKey);
      }
    });

    describe('composeLoadedRuntimeFromValidatedEnv (the composition-root seam)', () => {
      it('resolves the selected bootstrap alongside the stripped runtime config', () => {
        const loaded = unwrap(composeLoadedRuntimeFromValidatedEnv(selectedEnv));

        expect(loaded.productAnalytics.selected).toBe(true);
        const posthogKeys = Object.keys(loaded.runtimeConfig.env).filter((key) =>
          key.startsWith('POSTHOG_'),
        );
        expect(posthogKeys).toEqual([]);
      });

      it('fails boot when the selected keyring is deep-invalid', () => {
        const result = composeLoadedRuntimeFromValidatedEnv({
          ...selectedEnv,
          POSTHOG_PSEUDONYM_KEYRING: JSON.stringify([
            { id: 'k2026_01', key: Buffer.alloc(31, 0).toString('base64url') },
          ]),
        });

        expect(result.ok).toBe(false);
        if (!result.ok) {
          expect(result.error.message).toContain('pseudonym keyring failed strict validation');
          expect(JSON.stringify(result.error)).not.toContain(zeroKey);
        }
      });

      it('returns the unselected bootstrap in off mode', () => {
        const loaded = unwrap(
          composeLoadedRuntimeFromValidatedEnv({
            ...selectedEnv,
            OBSERVABILITY_SINKS: '["sentry"]',
          }),
        );

        expect(loaded.productAnalytics).toEqual({ selected: false });
      });
    });
  });
});
