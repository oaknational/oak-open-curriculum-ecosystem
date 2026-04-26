import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  APP_PACKAGE_IMPORTS,
  LIB_PACKAGES,
  SDK_PACKAGE_IMPORTS,
  TOOLING_PACKAGE_IMPORTS,
} from '../packages/core/oak-eslint/src/rules/boundary.js';

const repoRoot = resolve(import.meta.dirname, '..');

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
    .sort((a, b) => a.localeCompare(b));
}

function assertEqual<T>(label: string, actual: readonly T[], expected: readonly T[]): void {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);

  if (actualJson === expectedJson) {
    return;
  }

  throw new Error(
    [
      `${label} is out of sync with the live workspace inventory.`,
      `Expected: ${expectedJson}`,
      `Actual: ${actualJson}`,
    ].join('\n'),
  );
}

function main(): void {
  const actualLibPackageNames = readWorkspacePackageNames('packages/libs');
  const declaredLibPackageNames = [...LIB_PACKAGES]
    .map((packageName) => `@oaknational/${packageName}`)
    .sort((a, b) => a.localeCompare(b));
  assertEqual('Library boundary inventory', declaredLibPackageNames, actualLibPackageNames);

  const actualAppPackageNames = readWorkspacePackageNames('apps');
  assertEqual(
    'App boundary inventory',
    [...APP_PACKAGE_IMPORTS].sort((a, b) => a.localeCompare(b)),
    actualAppPackageNames,
  );

  const actualSdkPackageNames = readWorkspacePackageNames('packages/sdks');
  assertEqual(
    'SDK boundary inventory',
    [...SDK_PACKAGE_IMPORTS].sort((a, b) => a.localeCompare(b)),
    actualSdkPackageNames,
  );

  const toolingPackagePath = resolve(repoRoot, 'agent-tools/package.json');
  assertEqual(
    'Tooling boundary inventory',
    [...TOOLING_PACKAGE_IMPORTS],
    [readPackageName(toolingPackagePath)],
  );
}

main();
