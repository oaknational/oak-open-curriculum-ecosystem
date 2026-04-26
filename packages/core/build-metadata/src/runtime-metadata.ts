import { ROOT_PACKAGE_VERSION } from '@oaknational/env';
import { err, ok, type Result } from '@oaknational/result';

import { NO_DIAGNOSTICS, trimToUndefined, type RuntimeMetadataError } from './git-sha.js';
import { isValidSemver } from './semver.js';

export type ApplicationVersionSource = 'APP_VERSION_OVERRIDE' | 'root_package_json';

export interface VercelDisplayHostnameEnvironment {
  readonly VERCEL_ENV?: string;
  readonly VERCEL_URL?: string;
  readonly VERCEL_PROJECT_PRODUCTION_URL?: string;
}

function resolveOverrideApplicationVersion(
  override: string,
): Result<
  { readonly value: string; readonly source: ApplicationVersionSource },
  RuntimeMetadataError
> {
  if (!isValidSemver(override)) {
    return err({
      kind: 'invalid_application_version',
      message:
        `Invalid APP_VERSION_OVERRIDE value "${override}". ` +
        'Expected a semantic version such as 1.5.0.',
      diagnostics: NO_DIAGNOSTICS,
    });
  }

  return ok({ value: override, source: 'APP_VERSION_OVERRIDE' });
}

function resolveRootPackageApplicationVersion(): Result<
  { readonly value: string; readonly source: ApplicationVersionSource },
  RuntimeMetadataError
> {
  const rootVersion = trimToUndefined(ROOT_PACKAGE_VERSION);

  if (!rootVersion) {
    return err({
      kind: 'missing_application_version',
      message:
        'Root package.json is missing a version. ' +
        'Set APP_VERSION_OVERRIDE or restore package.json version.',
      diagnostics: NO_DIAGNOSTICS,
    });
  }

  if (!isValidSemver(rootVersion)) {
    return err({
      kind: 'invalid_application_version',
      message:
        `Root package.json version "${rootVersion}" is invalid. ` +
        'Set APP_VERSION_OVERRIDE or fix the root package.json version.',
      diagnostics: NO_DIAGNOSTICS,
    });
  }

  return ok({ value: rootVersion, source: 'root_package_json' });
}

export function resolveApplicationVersion(
  processEnv: Readonly<Record<string, string | undefined>>,
): Result<
  { readonly value: string; readonly source: ApplicationVersionSource },
  RuntimeMetadataError
> {
  const override = trimToUndefined(processEnv.APP_VERSION_OVERRIDE);

  if (override) {
    return resolveOverrideApplicationVersion(override);
  }

  return resolveRootPackageApplicationVersion();
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
