import { readFileSync } from 'node:fs';

const ROOT_PACKAGE_JSON_URL = new URL('../../../../package.json', import.meta.url);

interface RootPackageJson {
  readonly version?: string;
}

function isRootPackageJson(value: unknown): value is RootPackageJson {
  return typeof value === 'object' && value !== null && 'version' in value;
}

function readRootPackageJson(): RootPackageJson {
  const parsed: unknown = JSON.parse(readFileSync(ROOT_PACKAGE_JSON_URL, 'utf8'));

  if (!isRootPackageJson(parsed)) {
    throw new Error('Root package.json must be a JSON object.');
  }

  return parsed;
}

function resolveRootPackageVersion(): string {
  const version = readRootPackageJson().version?.trim();

  if (!version) {
    throw new Error('Root package.json is missing a version string.');
  }

  return version;
}

/**
 * Root repo application version read from the authoritative root `package.json`.
 */
export const ROOT_PACKAGE_VERSION = resolveRootPackageVersion();
