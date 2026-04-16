import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const APPLICATION_VERSION_PATTERN =
  /^(?<major>0|[1-9]\d*)\.(?<minor>0|[1-9]\d*)\.(?<patch>0|[1-9]\d*)(?:-(?<prerelease>[0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/u;

function trimToUndefined(value) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function parseSemanticVersion(value) {
  const match = APPLICATION_VERSION_PATTERN.exec(value);

  if (!match?.groups) {
    return undefined;
  }

  const prerelease = match.groups.prerelease?.split('.') ?? [];

  return {
    major: Number(match.groups.major),
    minor: Number(match.groups.minor),
    patch: Number(match.groups.patch),
    prerelease,
  };
}

function isNumericPrereleaseIdentifier(value) {
  return /^\d+$/u.test(value);
}

export function compareSemanticVersions(left, right) {
  const leftVersion = parseSemanticVersion(left);
  const rightVersion = parseSemanticVersion(right);

  if (!leftVersion || !rightVersion) {
    throw new Error(`Cannot compare invalid semantic versions "${left}" and "${right}".`);
  }

  for (const field of ['major', 'minor', 'patch']) {
    const difference = leftVersion[field] - rightVersion[field];

    if (difference !== 0) {
      return difference;
    }
  }

  if (leftVersion.prerelease.length === 0 && rightVersion.prerelease.length === 0) {
    return 0;
  }

  if (leftVersion.prerelease.length === 0) {
    return 1;
  }

  if (rightVersion.prerelease.length === 0) {
    return -1;
  }

  const maxLength = Math.max(leftVersion.prerelease.length, rightVersion.prerelease.length);

  for (let index = 0; index < maxLength; index += 1) {
    const leftIdentifier = leftVersion.prerelease[index];
    const rightIdentifier = rightVersion.prerelease[index];

    if (leftIdentifier === undefined) {
      return -1;
    }

    if (rightIdentifier === undefined) {
      return 1;
    }

    if (leftIdentifier === rightIdentifier) {
      continue;
    }

    const leftNumeric = isNumericPrereleaseIdentifier(leftIdentifier);
    const rightNumeric = isNumericPrereleaseIdentifier(rightIdentifier);

    if (leftNumeric && rightNumeric) {
      return Number(leftIdentifier) - Number(rightIdentifier);
    }

    if (leftNumeric) {
      return -1;
    }

    if (rightNumeric) {
      return 1;
    }

    return leftIdentifier.localeCompare(rightIdentifier);
  }

  return 0;
}

function readPackageVersion(packageJsonText, sourceLabel) {
  let parsedPackageJson;

  try {
    parsedPackageJson = JSON.parse(packageJsonText);
  } catch (error) {
    throw new Error(`${sourceLabel} package.json is not valid JSON.`, { cause: error });
  }

  const version = trimToUndefined(parsedPackageJson.version);

  if (!version) {
    throw new Error(`${sourceLabel} package.json does not contain a version string.`);
  }

  if (!parseSemanticVersion(version)) {
    throw new Error(
      `${sourceLabel} package.json version "${version}" is invalid. Expected a semantic version such as 1.5.0.`,
    );
  }

  return version;
}

function runGitCommand(args, cwd) {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function readPreviousRootPackageJson({
  repositoryRoot,
  previousSha,
  gitPath,
  executeGitCommand = runGitCommand,
}) {
  const objectSelector = `${previousSha}:${gitPath}`;

  try {
    return executeGitCommand(['show', objectSelector], repositoryRoot);
  } catch {
    executeGitCommand(['fetch', '--depth=1', 'origin', previousSha], repositoryRoot);
    return executeGitCommand(['show', objectSelector], repositoryRoot);
  }
}

export function runVercelIgnoreCommand(options) {
  const stdout = options.stdout ?? process.stdout;
  const stderr = options.stderr ?? process.stderr;
  const readFile = options.readFile ?? readFileSync;
  const executeGitCommand = options.executeGitCommand ?? runGitCommand;

  if (options.env.VERCEL_ENV !== 'production') {
    stdout.write('Ignoring production-release gate outside production; build will continue.\n');
    return { exitCode: 1 };
  }

  const rootPackageJsonPath = path.resolve(options.repositoryRoot, 'package.json');
  const currentPackageJsonText = readFile(rootPackageJsonPath, 'utf8');
  const currentVersion = readPackageVersion(currentPackageJsonText, 'Current root');
  const previousSha = trimToUndefined(options.env.VERCEL_GIT_PREVIOUS_SHA);

  if (!previousSha) {
    stdout.write(
      `No VERCEL_GIT_PREVIOUS_SHA is available for production build version ${currentVersion}; build will continue.\n`,
    );
    return { exitCode: 1 };
  }

  let previousVersion;

  try {
    const previousPackageJsonText = readPreviousRootPackageJson({
      repositoryRoot: options.repositoryRoot,
      previousSha,
      gitPath: 'package.json',
      executeGitCommand,
    });

    previousVersion = readPackageVersion(
      previousPackageJsonText,
      `Previous successful deployment ${previousSha}`,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    stderr.write(
      `Could not resolve the previous deployed root package version from ${previousSha}; allowing the build to continue. ${message}\n`,
    );
    return { exitCode: 1 };
  }

  if (compareSemanticVersions(currentVersion, previousVersion) <= 0) {
    stdout.write(
      `Cancelling production build because root package version ${currentVersion} did not advance beyond previous deployment version ${previousVersion} (${previousSha}).\n`,
    );
    return { exitCode: 0 };
  }

  stdout.write(
    `Continuing production build because root package version advanced from ${previousVersion} to ${currentVersion}.\n`,
  );
  return { exitCode: 1 };
}
