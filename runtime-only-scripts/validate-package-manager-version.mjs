import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE_MANAGER_PATTERN = /^pnpm@([^+\s]+)(?:\+\S+)?$/u;
const PNPM_USER_AGENT_PATTERN = /^pnpm\/([^\s]+)(?:\s|$)/u;
const SCRIPT_PATH = fileURLToPath(import.meta.url);
const REPOSITORY_ROOT = join(dirname(SCRIPT_PATH), '..');

function blockedInstall(problem) {
  return {
    exitCode: 1,
    message: [
      `Blocked install: ${problem}.`,
      'Run `corepack enable`, then rerun `pnpm install` with the repository-pinned pnpm.',
    ].join('\n'),
  };
}

function pinnedPnpmVersion(packageManager) {
  if (typeof packageManager !== 'string') {
    return undefined;
  }
  return PACKAGE_MANAGER_PATTERN.exec(packageManager)?.[1];
}

function runningPnpmVersion(userAgent) {
  if (userAgent === undefined) {
    return undefined;
  }
  return PNPM_USER_AGENT_PATTERN.exec(userAgent)?.[1];
}

/** Validate the pnpm process version against a package-manager pin. */
export function validatePackageManagerVersion(input) {
  const pinnedVersion = pinnedPnpmVersion(input.packageManager);
  if (pinnedVersion === undefined) {
    return blockedInstall('the root packageManager field must pin pnpm as `pnpm@<version>`');
  }

  const runningVersion = runningPnpmVersion(input.userAgent);
  if (runningVersion === undefined) {
    return blockedInstall(
      'could not determine the running pnpm version from npm_config_user_agent',
    );
  }

  if (runningVersion !== pinnedVersion) {
    return blockedInstall(
      `running pnpm ${runningVersion} does not match the pinned pnpm ${pinnedVersion}`,
    );
  }

  return { exitCode: 0 };
}

/** Run the dependency-free validation at the pre-install process boundary. */
export function runPackageManagerVersionGuard() {
  let packageManager;
  try {
    packageManager = JSON.parse(
      readFileSync(join(REPOSITORY_ROOT, 'package.json'), 'utf8'),
    ).packageManager;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const result = blockedInstall(`could not read the root packageManager pin: ${message}`);
    console.error(result.message);
    return result;
  }

  const result = validatePackageManagerVersion({
    packageManager,
    userAgent: process.env.npm_config_user_agent,
  });
  if (result.exitCode === 1) {
    console.error(result.message);
  }
  return result;
}

if (process.argv[1] === SCRIPT_PATH) {
  process.exitCode = runPackageManagerVersionGuard().exitCode;
}
