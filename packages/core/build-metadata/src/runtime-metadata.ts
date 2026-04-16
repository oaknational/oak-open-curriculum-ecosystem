import { ROOT_PACKAGE_VERSION } from '@oaknational/env';
import { err, ok, type Result } from '@oaknational/result';

export type ApplicationVersionSource = 'APP_VERSION_OVERRIDE' | 'root_package_json';
export type GitShaSource = 'GIT_SHA_OVERRIDE' | 'VERCEL_GIT_COMMIT_SHA';

export interface RuntimeMetadataError {
  readonly message: string;
  readonly diagnostics: readonly [];
}

export interface VercelDisplayHostnameEnvironment {
  readonly VERCEL_ENV?: string;
  readonly VERCEL_URL?: string;
  readonly VERCEL_PROJECT_PRODUCTION_URL?: string;
}

const NO_DIAGNOSTICS: [] = [];
const APPLICATION_VERSION_PATTERN = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)*$/u;
const GIT_SHA_PATTERN = /^[0-9a-f]{7,40}$/iu;

function trimToUndefined(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function isValidApplicationVersion(value: string): boolean {
  return APPLICATION_VERSION_PATTERN.test(value);
}

function isValidGitSha(value: string): boolean {
  return GIT_SHA_PATTERN.test(value);
}

export function resolveApplicationVersion(
  processEnv: Readonly<Record<string, string | undefined>>,
): Result<
  { readonly value: string; readonly source: ApplicationVersionSource },
  RuntimeMetadataError
> {
  const override = trimToUndefined(processEnv.APP_VERSION_OVERRIDE);

  if (override) {
    if (!isValidApplicationVersion(override)) {
      return err({
        message:
          `Invalid APP_VERSION_OVERRIDE value "${override}". ` +
          'Expected a semantic version such as 1.5.0.',
        diagnostics: NO_DIAGNOSTICS,
      });
    }

    return ok({
      value: override,
      source: 'APP_VERSION_OVERRIDE',
    });
  }

  const rootVersion = trimToUndefined(ROOT_PACKAGE_VERSION);

  if (!rootVersion) {
    return err({
      message:
        'Root package.json is missing a version. ' +
        'Set APP_VERSION_OVERRIDE or restore package.json version.',
      diagnostics: NO_DIAGNOSTICS,
    });
  }

  if (!isValidApplicationVersion(rootVersion)) {
    return err({
      message:
        `Root package.json version "${rootVersion}" is invalid. ` +
        'Set APP_VERSION_OVERRIDE or fix the root package.json version.',
      diagnostics: NO_DIAGNOSTICS,
    });
  }

  return ok({
    value: rootVersion,
    source: 'root_package_json',
  });
}

export function resolveGitSha(
  processEnv: Readonly<Record<string, string | undefined>>,
): Result<
  { readonly value: string; readonly source: GitShaSource } | undefined,
  RuntimeMetadataError
> {
  const override = trimToUndefined(processEnv.GIT_SHA_OVERRIDE);

  if (override) {
    if (!isValidGitSha(override)) {
      return err({
        message:
          `Invalid GIT_SHA_OVERRIDE value "${override}". ` +
          'Expected a 7-40 character hexadecimal git SHA.',
        diagnostics: NO_DIAGNOSTICS,
      });
    }

    return ok({
      value: override,
      source: 'GIT_SHA_OVERRIDE',
    });
  }

  const vercelGitSha = trimToUndefined(processEnv.VERCEL_GIT_COMMIT_SHA);

  if (!vercelGitSha) {
    return ok(undefined);
  }

  if (!isValidGitSha(vercelGitSha)) {
    return err({
      message:
        `Invalid VERCEL_GIT_COMMIT_SHA value "${vercelGitSha}". ` +
        'Expected a 7-40 character hexadecimal git SHA.',
      diagnostics: NO_DIAGNOSTICS,
    });
  }

  return ok({
    value: vercelGitSha,
    source: 'VERCEL_GIT_COMMIT_SHA',
  });
}

export function getDisplayHostname(env: VercelDisplayHostnameEnvironment): string | undefined {
  if (env.VERCEL_ENV === 'production' && env.VERCEL_PROJECT_PRODUCTION_URL) {
    return env.VERCEL_PROJECT_PRODUCTION_URL.toLowerCase();
  }

  if (env.VERCEL_URL) {
    return env.VERCEL_URL.toLowerCase();
  }

  return undefined;
}
