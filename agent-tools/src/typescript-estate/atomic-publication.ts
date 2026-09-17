import path from 'node:path';

import { err, isErr, ok, type Result } from '@oaknational/result';

export { canonicalJsonBytes, serialiseCanonicalJson } from './canonical-json.js';
import { serialiseCanonicalJson } from './canonical-json.js';
import {
  combineWriteAndClose,
  invokePublicationOperation as invoke,
} from './atomic-publication-result.js';
import type {
  AtomicPublicationPort,
  FinalPublicationTarget,
  PreparedPublicationTarget,
  PublicationFileKind,
  PublishedRawExtraction,
  PublishRawExtractionInput,
  TemporaryPublicationTarget,
} from './atomic-publication-model.js';
export type {
  AtomicPublicationPort,
  FinalPublicationTarget,
  PreparedPublicationTarget,
  PublicationFileKind,
  PublishedRawExtraction,
  PublishRawExtractionInput,
  TemporaryPublicationTarget,
} from './atomic-publication-model.js';
import { EstateReviewError } from './errors.js';

/** The sole file published by the TypeScript-estate extractor. */
export const RAW_EXTRACTION_FILE_NAME = 'raw-extraction.json';

/**
 * Validate, canonicalise once, and publish through an exclusive sibling temp.
 *
 * Validation and the exact-byte limit run before target preparation. After a
 * temp is created, every failure path removes only that temp; the final path is
 * changed only by the successful atomic rename.
 */
export function publishRawExtraction<Value, Handle>(
  input: PublishRawExtractionInput<Value, Handle>,
): Result<PublishedRawExtraction, EstateReviewError> {
  const validated = invoke(() => input.validate(input.value));
  if (isErr(validated)) {
    return err(
      new EstateReviewError('VALIDATION_FAILED', 'raw extraction failed validation', {
        cause: validated.error,
      }),
    );
  }
  const bytes = serialiseCanonicalJson(validated.value, input.maxSerializedOutputBytes);
  if (isErr(bytes)) {
    return bytes;
  }
  if (!/^[A-Za-z0-9._-]+$/u.test(input.tempToken)) {
    return err(
      new EstateReviewError('PUBLICATION_FAILED', 'temporary publication token is invalid'),
    );
  }
  const prepared = invoke(() =>
    input.publication.prepareContainedTarget(input.invokingGitRoot, input.outDirectory),
  );
  if (isErr(prepared)) {
    return publicationFailure('cannot prepare contained output directory', prepared.error);
  }
  return publishPrepared(input.publication, prepared.value, input.tempToken, bytes.value);
}

function publishPrepared<Handle>(
  publication: AtomicPublicationPort<Handle>,
  target: PreparedPublicationTarget,
  tempToken: string,
  bytes: Uint8Array,
): Result<PublishedRawExtraction, EstateReviewError> {
  const finalTarget: FinalPublicationTarget = {
    kind: 'final-publication-target',
    path: path.join(target.outDirectory, RAW_EXTRACTION_FILE_NAME),
  };
  const temporaryTarget: TemporaryPublicationTarget = {
    kind: 'temporary-publication-target',
    path: path.join(target.outDirectory, `.${RAW_EXTRACTION_FILE_NAME}.tmp-${tempToken}`),
  };
  const ready = prepareDirectoryAndTarget(publication, target, finalTarget);
  if (isErr(ready)) {
    return ready;
  }
  const created = invoke(() => publication.createExclusive(temporaryTarget));
  if (isErr(created)) {
    return publicationFailure('cannot exclusively create publication temp file', created.error);
  }
  return writeCloseAndRename(
    publication,
    target,
    created.value,
    temporaryTarget,
    finalTarget,
    bytes,
  );
}

function prepareDirectoryAndTarget<Handle>(
  publication: AtomicPublicationPort<Handle>,
  target: PreparedPublicationTarget,
  finalTarget: FinalPublicationTarget,
): Result<undefined, EstateReviewError> {
  const contained = invoke(() => publication.checkBeforeCreate(target));
  if (isErr(contained)) {
    return publicationFailure('output containment recheck failed', contained.error);
  }
  const materialised = invoke(() => publication.materialiseDirectory(target));
  if (isErr(materialised)) {
    return publicationFailure('cannot materialise contained output directory', materialised.error);
  }
  const materialisedContained = invoke(() => publication.checkBeforeCommit(target));
  if (isErr(materialisedContained)) {
    return publicationFailure(
      'materialised output directory failed the containment recheck',
      materialisedContained.error,
    );
  }
  return refuseSymlinkTarget(finalTarget, () => publication.inspectTargetBeforeCreate(finalTarget));
}

function writeCloseAndRename<Handle>(
  publication: AtomicPublicationPort<Handle>,
  target: PreparedPublicationTarget,
  handle: Handle,
  temporaryTarget: TemporaryPublicationTarget,
  finalTarget: FinalPublicationTarget,
  bytes: Uint8Array,
): Result<PublishedRawExtraction, EstateReviewError> {
  const written = invoke(() => publication.write(handle, bytes));
  const synced = isErr(written) ? written : invoke(() => publication.fsync(handle));
  const closed = invoke(() => publication.close(handle));
  const writeOutcome = combineWriteAndClose(synced, closed);
  if (isErr(writeOutcome)) {
    return cleanupFailure(
      publication,
      temporaryTarget,
      'publication temp write failed',
      writeOutcome.error,
    );
  }
  return commitWrittenTemp(publication, target, temporaryTarget, finalTarget, bytes);
}

function commitWrittenTemp<Handle>(
  publication: AtomicPublicationPort<Handle>,
  target: PreparedPublicationTarget,
  temporaryTarget: TemporaryPublicationTarget,
  finalTarget: FinalPublicationTarget,
  bytes: Uint8Array,
): Result<PublishedRawExtraction, EstateReviewError> {
  const contained = invoke(() => publication.checkBeforeCommit(target));
  if (isErr(contained)) {
    return cleanupFailure(
      publication,
      temporaryTarget,
      'pre-rename containment recheck failed',
      contained.error,
    );
  }
  const targetSafe = refuseSymlinkTarget(finalTarget, () =>
    publication.inspectTargetBeforeCommit(finalTarget),
  );
  if (isErr(targetSafe)) {
    return cleanupFailure(publication, temporaryTarget, targetSafe.error.message, targetSafe.error);
  }
  const renamed = invoke(() => publication.rename(temporaryTarget, finalTarget));
  if (isErr(renamed)) {
    return cleanupFailure(
      publication,
      temporaryTarget,
      'atomic publication rename failed',
      renamed.error,
    );
  }
  return ok({ outputPath: finalTarget.path, bytes });
}

function refuseSymlinkTarget(
  target: FinalPublicationTarget,
  inspect: () => Result<PublicationFileKind | undefined, Error>,
): Result<undefined, EstateReviewError> {
  const inspected = invoke(inspect);
  if (isErr(inspected)) {
    return publicationFailure('cannot inspect raw-extraction target', inspected.error);
  }
  return inspected.value === 'symlink'
    ? err(
        new EstateReviewError(
          'PUBLICATION_FAILED',
          `raw-extraction target '${target.path}' is a symlink; refusing`,
        ),
      )
    : ok(undefined);
}

function cleanupFailure<Handle>(
  publication: AtomicPublicationPort<Handle>,
  temporaryTarget: TemporaryPublicationTarget,
  message: string,
  cause: Error,
): Result<never, EstateReviewError> {
  const removed = invoke(() => publication.removeTemp(temporaryTarget));
  const combinedCause = isErr(removed)
    ? new AggregateError([cause, removed.error], `${message}; temp cleanup also failed`)
    : cause;
  return publicationFailure(message, combinedCause);
}

function publicationFailure(message: string, cause: Error): Result<never, EstateReviewError> {
  return err(new EstateReviewError('PUBLICATION_FAILED', message, { cause }));
}
