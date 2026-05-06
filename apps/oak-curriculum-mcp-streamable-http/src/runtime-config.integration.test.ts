import { unwrap } from '@oaknational/result';
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
    const runtimeConfig = unwrap(createRuntimeConfigFromValidatedEnv(localOffModeEnv));

    expect(runtimeConfig.gitSha).toBeUndefined();
    expect(runtimeConfig.env.VERCEL_GIT_COMMIT_SHA).toBeUndefined();
    expect(runtimeConfig.env.VERCEL_BRANCH_URL).toBeUndefined();
    expect(runtimeConfig.env.SENTRY_RELEASE_OVERRIDE).toBeUndefined();
    expect(runtimeConfig.version).toBe('1.2.3-test');
  });
});
