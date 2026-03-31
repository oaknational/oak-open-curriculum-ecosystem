import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  APP_PACKAGE_IMPORTS,
  LIB_PACKAGES,
  SDK_PACKAGE_IMPORTS,
  TOOLING_PACKAGE_IMPORTS,
} from './boundary.js';

const thisDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(thisDir, '../../../../..');

function readPackageName(packageJsonPath: string): string {
  const packageJson: unknown = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

  if (
    typeof packageJson !== 'object' ||
    packageJson === null ||
    !('name' in packageJson) ||
    typeof packageJson.name !== 'string'
  ) {
    throw new Error(`Expected ${packageJsonPath} to contain a string package name`);
  }

  return packageJson.name;
}

function readWorkspacePackageNames(relativeDir: string): string[] {
  const workspaceDir = resolve(repoRoot, relativeDir);

  return readdirSync(workspaceDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => resolve(workspaceDir, entry.name, 'package.json'))
    .filter((packageJsonPath) => existsSync(packageJsonPath))
    .map((packageJsonPath) => readPackageName(packageJsonPath))
    .sort();
}

describe('boundary workspace inventories', () => {
  it('keeps the library inventory aligned with packages/libs', () => {
    const actualLibPackageNames = readWorkspacePackageNames('packages/libs');
    const declaredLibPackageNames = [...LIB_PACKAGES]
      .map((packageName) => `@oaknational/${packageName}`)
      .sort();

    expect(declaredLibPackageNames).toEqual(actualLibPackageNames);
  });

  it('keeps the app inventory aligned with apps/', () => {
    const actualAppPackageNames = readWorkspacePackageNames('apps');

    expect([...APP_PACKAGE_IMPORTS].sort()).toEqual(actualAppPackageNames);
  });

  it('keeps the sdk inventory aligned with packages/sdks', () => {
    const actualSdkPackageNames = readWorkspacePackageNames('packages/sdks');

    expect([...SDK_PACKAGE_IMPORTS].sort()).toEqual(actualSdkPackageNames);
  });

  it('keeps the tooling inventory aligned with agent-tools', () => {
    const toolingPackagePath = resolve(repoRoot, 'agent-tools/package.json');

    expect([...TOOLING_PACKAGE_IMPORTS]).toEqual([readPackageName(toolingPackagePath)]);
  });
});
