import { describe, expect, it } from 'vitest';

import { validatePackageManagerVersion } from '../../../runtime-only-scripts/validate-package-manager-version.mjs';

const PACKAGE_MANAGER = 'pnpm@99.1.2+sha512.fixture';

describe('validatePackageManagerVersion', () => {
  it('permits the pnpm version pinned by packageManager', () => {
    const result = validatePackageManagerVersion({
      packageManager: PACKAGE_MANAGER,
      userAgent: 'pnpm/99.1.2 npm/? node/v24.5.0 darwin arm64',
    });

    expect(result).toEqual({ exitCode: 0 });
  });

  it.each([
    {
      userAgent: 'pnpm/99.1.1 npm/? node/v24.5.0 darwin arm64',
      expectedProblem: 'running pnpm 99.1.1 does not match the pinned pnpm 99.1.2',
    },
    {
      userAgent: undefined,
      expectedProblem: 'could not determine the running pnpm version from npm_config_user_agent',
    },
  ])('blocks the install when $expectedProblem', ({ userAgent, expectedProblem }) => {
    const result = validatePackageManagerVersion({
      packageManager: PACKAGE_MANAGER,
      userAgent,
    });

    expect(result).toEqual({
      exitCode: 1,
      message: [
        `Blocked install: ${expectedProblem}.`,
        'Run `corepack enable`, then rerun `pnpm install` with the repository-pinned pnpm.',
      ].join('\n'),
    });
  });
});
