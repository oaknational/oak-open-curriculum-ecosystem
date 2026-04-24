import { err, ok, type Result } from '@oaknational/result';

export type GitShaSource = 'GIT_SHA_OVERRIDE' | 'VERCEL_GIT_COMMIT_SHA';

/**
 * Errors returned by the runtime-metadata resolvers (`resolveGitSha`
 * and `resolveApplicationVersion`).
 *
 * @remarks Discriminated union — each failure mode has its own `kind`
 * so consumers can pattern-match instead of parsing `message` prose.
 * The `diagnostics` channel is reserved for rich compositional errors;
 * today it's always the empty tuple.
 */
export type RuntimeMetadataError =
  | {
      readonly kind: 'invalid_git_sha';
      readonly message: string;
      readonly diagnostics: readonly [];
    }
  | {
      readonly kind: 'missing_application_version';
      readonly message: string;
      readonly diagnostics: readonly [];
    }
  | {
      readonly kind: 'invalid_application_version';
      readonly message: string;
      readonly diagnostics: readonly [];
    };

/**
 * Narrow env-input shape consumed by {@link resolveGitSha}.
 *
 * @remarks Structurally-typed subset — callers pass a typed
 * projection of `process.env` (or a field-by-field snapshot). The
 * interface omits the open `[key: string]: string | undefined`
 * signature so excess-property checking surfaces typos as compile
 * errors.
 */
export interface ResolveGitShaInput {
  readonly GIT_SHA_OVERRIDE?: string;
  readonly VERCEL_GIT_COMMIT_SHA?: string;
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
  processEnv: ResolveGitShaInput,
): Result<
  { readonly value: string; readonly source: GitShaSource } | undefined,
  RuntimeMetadataError
> {
  const override = trimToUndefined(processEnv.GIT_SHA_OVERRIDE);

  if (override) {
    if (!isValidGitSha(override)) {
      return err({
        kind: 'invalid_git_sha',
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
      kind: 'invalid_git_sha',
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
