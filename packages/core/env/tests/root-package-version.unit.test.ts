import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { ROOT_PACKAGE_VERSION } from '../src/root-package-version.js';

function getRootPackageVersion(): string {
  const parsed: unknown = JSON.parse(
    readFileSync(new URL('../../../../package.json', import.meta.url), 'utf8'),
  );

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('version' in parsed) ||
    typeof parsed.version !== 'string'
  ) {
    throw new Error('Root package.json is missing a string version.');
  }

  return parsed.version;
}

describe('ROOT_PACKAGE_VERSION', () => {
  it('matches the authoritative root package.json version', () => {
    expect(ROOT_PACKAGE_VERSION).toBe(getRootPackageVersion());
  });
});
