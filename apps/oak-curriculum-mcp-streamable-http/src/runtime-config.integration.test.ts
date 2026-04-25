import { describe, expect, it } from 'vitest';

import type { Env } from './env.js';
import { createRuntimeConfigFromValidatedEnv } from './runtime-config-from-validated-env.js';

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
    const runtimeConfig = createRuntimeConfigFromValidatedEnv(localOffModeEnv);

    expect(runtimeConfig.ok).toBe(true);
    if (!runtimeConfig.ok) {
      return;
    }

    expect(runtimeConfig.value.gitSha).toBeUndefined();
    expect(runtimeConfig.value.env.VERCEL_GIT_COMMIT_SHA).toBeUndefined();
    expect(runtimeConfig.value.env.VERCEL_BRANCH_URL).toBeUndefined();
    expect(runtimeConfig.value.env.SENTRY_RELEASE_OVERRIDE).toBeUndefined();
    expect(runtimeConfig.value.version).toBe('1.2.3-test');
  });
});
