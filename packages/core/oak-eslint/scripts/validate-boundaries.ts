import { existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  APP_PACKAGE_IMPORTS,
  DESIGN_PACKAGE_IMPORTS,
  LIB_PACKAGES,
  SDK_PACKAGE_IMPORTS,
  TOOLING_PACKAGE_IMPORTS,
} from '../src/rules/boundary.js';
import {
  TIER_PATH,
  checkIdentityPackTier,
  diffInventory,
} from '../src/rules/boundary-inventory.js';
import { readIdentityPackTier, type TierFileSystem } from '../src/rules/boundary-tier-reader.js';

const repoRoot = resolve(import.meta.dirname, '../../../..');

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

/**
 * Names every workspace directly under relativeDir that carries a
 * package.json. Directories without one (the identity-pack tier at
 * packages/design/identities) are invisible to this scan by construction —
 * such tiers need their own leg below, or they are silently unguarded.
 */
function readWorkspacePackageNames(relativeDir: string): string[] {
  const workspaceDir = resolve(repoRoot, relativeDir);

  return readdirSync(workspaceDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => resolve(workspaceDir, entry.name, 'package.json'))
    .filter((packageJsonPath) => existsSync(packageJsonPath))
    .map((packageJsonPath) => readPackageName(packageJsonPath));
}

/** The real filesystem behind the injected reader surface: `readDir`
 *  carries unfollowed-link Dirent semantics, so symbolic links are
 *  classified as themselves and never dereferenced by the walk. */
const nodeTierFileSystem: TierFileSystem = {
  classifyPath: (path) => {
    const stats = lstatSync(path, { throwIfNoEntry: false });
    if (stats === undefined) {
      return 'absent';
    }
    if (stats.isSymbolicLink()) {
      return 'symlink';
    }
    return stats.isDirectory() ? 'directory' : 'file';
  },
  readDir: (path) =>
    readdirSync(path, { withFileTypes: true }).map((entry) => ({
      name: entry.name,
      isDirectory: entry.isDirectory(),
      isFile: entry.isFile(),
      isSymbolicLink: entry.isSymbolicLink(),
    })),
  readTextFile: (path) => readFileSync(path, 'utf8'),
};

function main(): void {
  const inventoryLegs: readonly (readonly string[])[] = [
    diffInventory(
      'Library boundary inventory',
      [...LIB_PACKAGES].map((packageName) => `@oaknational/${packageName}`),
      readWorkspacePackageNames('packages/libs'),
    ),
    diffInventory('App boundary inventory', APP_PACKAGE_IMPORTS, readWorkspacePackageNames('apps')),
    diffInventory(
      'SDK boundary inventory',
      SDK_PACKAGE_IMPORTS,
      readWorkspacePackageNames('packages/sdks'),
    ),
    diffInventory(
      'Design boundary inventory',
      DESIGN_PACKAGE_IMPORTS,
      readWorkspacePackageNames('packages/design'),
    ),
    diffInventory('Tooling boundary inventory', TOOLING_PACKAGE_IMPORTS, [
      readPackageName(resolve(repoRoot, 'agent-tools/package.json')),
    ]),
  ];

  const tierReading = readIdentityPackTier(nodeTierFileSystem, resolve(repoRoot, TIER_PATH));
  const failures: readonly string[] = [
    ...inventoryLegs.flat(),
    ...checkIdentityPackTier(tierReading),
  ];

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(failure);
    }
    process.exitCode = 1;

    return;
  }

  console.log(
    `validate-boundaries: OK (${String(inventoryLegs.length)} inventories in sync; ` +
      `identity-pack tier: ${String(tierReading.entries.length)} pack(s) well-shaped).`,
  );
}

main();
