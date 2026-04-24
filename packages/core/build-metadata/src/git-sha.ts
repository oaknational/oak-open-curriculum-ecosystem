import { err, ok, type Result } from '@oaknational/result';

export type GitShaSource = 'GIT_SHA_OVERRIDE' | 'VERCEL_GIT_COMMIT_SHA';

export interface RuntimeMetadataError {
  readonly message: string;
  readonly diagnostics: readonly [];
}

export const NO_DIAGNOSTICS: [] = [];

const GIT_SHA_PATTERN = /^[0-9a-f]{7,40}$/iu;

export function trimToUndefined(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function isValidGitSha(value: string): boolean {
  return GIT_SHA_PATTERN.test(value);
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
