import { describe, expect, it } from 'vitest';

import { createLocalStubProcessEnv } from './local-stub-env.js';

describe('createLocalStubProcessEnv', () => {
  it('prepares local stub env without synthesising deploy release metadata', () => {
    const preparedEnv = createLocalStubProcessEnv({
      parentEnv: {
        PATH: '/usr/bin',
        VERCEL_GIT_COMMIT_SHA: 'c8b666485ecb08b5dc27e428737b4077c0531f57',
        VERCEL_BRANCH_URL: 'feature.example.vercel.app',
        SENTRY_RELEASE_OVERRIDE: 'inherited-release',
        SENTRY_MODE: 'sentry',
      },
      port: 3333,
    });

    expect(preparedEnv.OAK_CURRICULUM_MCP_USE_STUB_TOOLS).toBe('true');
    expect(preparedEnv.DANGEROUSLY_DISABLE_AUTH).toBe('true');
    expect(preparedEnv.VERCEL_GIT_COMMIT_SHA).toBeUndefined();
    expect(preparedEnv.VERCEL_BRANCH_URL).toBeUndefined();
    expect(preparedEnv.SENTRY_RELEASE_OVERRIDE).toBeUndefined();
    expect(preparedEnv.SENTRY_MODE).toBe('off');
  });
});
