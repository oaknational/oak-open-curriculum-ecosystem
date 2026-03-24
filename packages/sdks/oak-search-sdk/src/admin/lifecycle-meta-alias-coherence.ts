import { ok, err, type Result } from '@oaknational/result';
import { typeSafeValues } from '@oaknational/type-helpers';
import type { AdminError } from '../types/admin-types.js';
import type { AliasTargetMap } from '../types/index-lifecycle-types.js';
import { extractVersionFromIndexName } from './lifecycle-version-identity.js';

/** Extract the version, returning a Result error if not parseable. */
function extractVersionOrError(indexName: string): Result<string, AdminError> {
  const version = extractVersionFromIndexName(indexName);
  if (version === null) {
    return err({
      type: 'validation_error',
      message: `Alias target "${indexName}" is not a versioned index name`,
    });
  }
  return ok(version);
}

function resolveAliasVersion(targets: AliasTargetMap): Result<string | null, AdminError> {
  const versions = new Set<string>();
  let sawNullTarget = false;

  for (const targetInfo of typeSafeValues(targets)) {
    if (targetInfo.targetIndex === null) {
      sawNullTarget = true;
      continue;
    }

    const versionResult = extractVersionOrError(targetInfo.targetIndex);
    if (!versionResult.ok) {
      return versionResult;
    }
    versions.add(versionResult.value);
  }

  if (versions.size > 1) {
    return err({
      type: 'validation_error',
      message: `Alias targets are incoherent: found multiple live versions (${Array.from(versions).join(', ')})`,
    });
  }

  if (versions.size === 1 && sawNullTarget) {
    return err({
      type: 'validation_error',
      message: 'Alias targets are incoherent: mix of unbound aliases and versioned targets',
    });
  }

  const onlyVersion = versions.values().next().value;
  return ok(onlyVersion ?? null);
}

/**
 * Enforce metadata/alias coherence before lifecycle mutations.
 */
export function enforceMetadataAliasCoherence(
  metaVersion: string | null,
  targets: AliasTargetMap,
  operation: 'promote' | 'versioned-ingest' | 'rollback',
): Result<void, AdminError> {
  const aliasVersionResult = resolveAliasVersion(targets);
  if (!aliasVersionResult.ok) {
    return handleAliasVersionResolutionError(aliasVersionResult.error);
  }
  return compareMetaAliasVersions(metaVersion, aliasVersionResult.value, operation);
}

function handleAliasVersionResolutionError(
  aliasVersionError: AdminError,
): Result<void, AdminError> {
  return err(aliasVersionError);
}

function compareMetaAliasVersions(
  metaVersion: string | null,
  aliasVersion: string | null,
  operation: 'promote' | 'versioned-ingest' | 'rollback',
): Result<void, AdminError> {
  if (aliasVersion === null && (operation === 'promote' || operation === 'versioned-ingest')) {
    return ok(undefined);
  }
  if (metaVersion === aliasVersion) {
    return ok(undefined);
  }

  return err({
    type: 'validation_error',
    message:
      `Metadata/alias coherence precondition failed before ${operation}. ` +
      `oak_meta.version=${metaVersion ?? 'null'}, liveAliasVersion=${aliasVersion ?? 'null'}. ` +
      'Run validate-aliases and metadata triage before retrying.',
  });
}
