import { describe, expect, it } from 'vitest';

import { resolveCurrentAppBuildIdentity } from './build-identity.js';

describe('resolveCurrentAppBuildIdentity', () => {
  it('fails fast when the generated app version sentinel reaches runtime', () => {
    const result = resolveCurrentAppBuildIdentity({
      generatedAppVersion: 'unknown',
      buildContext: 'local',
      targetEnvironment: 'development',
      branch: 'other',
    });

    expect(result).toEqual({
      ok: false,
      error: {
        kind: 'missing_app_build_identity',
        message:
          'App build identity is still "unknown". Run the build identity generation step before starting the app.',
      },
    });
  });

  it('resolves local development build identity without Sentry metadata', () => {
    const result = resolveCurrentAppBuildIdentity({
      generatedAppVersion: 'local-dev',
      buildContext: 'local',
      targetEnvironment: 'development',
      branch: 'other',
    });

    expect(result).toEqual({
      ok: true,
      value: {
        value: 'local-dev',
        buildContext: 'local',
        targetEnvironment: 'development',
        branch: 'other',
      },
    });
  });
});
