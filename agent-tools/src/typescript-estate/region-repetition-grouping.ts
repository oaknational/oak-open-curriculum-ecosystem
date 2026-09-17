import { err, isErr, ok, type Result } from '@oaknational/result';

import type { CloneAnalysis, CloneGroup, CloneMember } from './analysis-model.js';
import { EstateReviewError } from './errors.js';
import type {
  EncodedRegionObservation,
  ExecutableRepetitionConfig,
} from './region-repetition-model.js';
import { compareUtf16 } from './utf16-order.js';

export type CloneAnalysesTuple = readonly [
  Extract<CloneAnalysis, { readonly detectorId: 'exact-region-clone' }>,
  Extract<CloneAnalysis, { readonly detectorId: 'structural-region-similarity' }>,
];

interface DetectorProjection {
  readonly fingerprint: (observation: EncodedRegionObservation) => string;
  readonly encoding: (observation: EncodedRegionObservation) => string;
}

interface FingerprintBucket {
  readonly encoding: string;
  readonly observations: EncodedRegionObservation[];
}

/** Build the exact-first, structural-second clone-analysis tuple. */
export function buildCloneAnalyses(
  observations: readonly EncodedRegionObservation[],
  config: ExecutableRepetitionConfig,
): Result<CloneAnalysesTuple, EstateReviewError> {
  const occurrenceFailure = validateOccurrenceIdentity(observations);
  if (occurrenceFailure !== undefined) {
    return err(occurrenceFailure);
  }
  const exactGroups = buildGroups(observations, config.minimumFiles, {
    fingerprint: (observation) => observation.exactFingerprint,
    encoding: (observation) => observation.exactEncoding,
  });
  if (isErr(exactGroups)) {
    return exactGroups;
  }
  const structuralGroups = buildGroups(observations, config.minimumFiles, {
    fingerprint: (observation) => observation.structuralFingerprint,
    encoding: (observation) => JSON.stringify(observation.structuralEncoding),
  });
  if (isErr(structuralGroups)) {
    return structuralGroups;
  }
  return ok([
    {
      detectorId: 'exact-region-clone',
      encodingVersion: config.exactEncodingVersion,
      groups: exactGroups.value,
    },
    {
      detectorId: 'structural-region-similarity',
      encodingVersion: config.structuralEncodingVersion,
      groups: structuralGroups.value,
    },
  ]);
}

function validateOccurrenceIdentity(
  observations: readonly EncodedRegionObservation[],
): EstateReviewError | undefined {
  const identities = new Set<string>();
  for (const { member } of observations) {
    const identity = JSON.stringify([
      member.path,
      member.startOffset,
      member.endOffset,
      member.kind,
    ]);
    if (identities.has(identity)) {
      return new EstateReviewError(
        'VALIDATION_FAILED',
        `repetition occurrence collision at '${member.path}:${member.startOffset}-${member.endOffset}:${member.kind}'`,
      );
    }
    identities.add(identity);
  }
  return undefined;
}

function buildGroups(
  observations: readonly EncodedRegionObservation[],
  minimumFiles: number,
  projection: DetectorProjection,
): Result<readonly CloneGroup[], EstateReviewError> {
  const buckets = bucketByFingerprint(observations, projection);
  if (isErr(buckets)) {
    return buckets;
  }
  return groupsFromBuckets(buckets.value, minimumFiles);
}

function bucketByFingerprint(
  observations: readonly EncodedRegionObservation[],
  projection: DetectorProjection,
): Result<ReadonlyMap<string, FingerprintBucket>, EstateReviewError> {
  const buckets = new Map<string, FingerprintBucket>();
  for (const observation of observations) {
    const fingerprint = projection.fingerprint(observation);
    const encoding = projection.encoding(observation);
    const bucket = buckets.get(fingerprint);
    if (bucket !== undefined && bucket.encoding !== encoding) {
      return err(
        new EstateReviewError(
          'VALIDATION_FAILED',
          `repetition fingerprint collision for '${fingerprint}'`,
        ),
      );
    }
    if (bucket === undefined) {
      buckets.set(fingerprint, { encoding, observations: [observation] });
    } else {
      bucket.observations.push(observation);
    }
  }
  return ok(buckets);
}

function groupsFromBuckets(
  buckets: ReadonlyMap<string, FingerprintBucket>,
  minimumFiles: number,
): Result<readonly CloneGroup[], EstateReviewError> {
  const groups: CloneGroup[] = [];
  for (const [fingerprint, bucket] of buckets) {
    const group = cloneGroup(fingerprint, bucket, minimumFiles);
    if (isErr(group)) {
      return group;
    }
    if (group.value !== undefined) {
      groups.push(group.value);
    }
  }
  return ok(groups.toSorted((left, right) => compareUtf16(left.fingerprint, right.fingerprint)));
}

function cloneGroup(
  fingerprint: string,
  bucket: FingerprintBucket,
  minimumFiles: number,
): Result<CloneGroup | undefined, EstateReviewError> {
  if (distinctPathCount(bucket.observations) < minimumFiles) {
    return ok(undefined);
  }
  const members = bucket.observations.map(({ member }) => member).sort(compareCloneMembers);
  const [first, second, ...rest] = members;
  if (first === undefined || second === undefined) {
    return err(
      new EstateReviewError(
        'VALIDATION_FAILED',
        `clone group '${fingerprint}' has fewer than two members`,
      ),
    );
  }
  return ok({
    fingerprint,
    candidateEligibility: bucket.observations.every(
      ({ verificationOnly }) => verificationOnly === 'absent',
    )
      ? 'candidate-eligible'
      : 'verification-observation-only',
    members: [first, second, ...rest],
  });
}

function distinctPathCount(observations: readonly EncodedRegionObservation[]): number {
  return new Set(observations.map(({ member }) => member.path)).size;
}

function compareCloneMembers(left: CloneMember, right: CloneMember): number {
  return (
    compareUtf16(left.path, right.path) ||
    left.startOffset - right.startOffset ||
    left.endOffset - right.endOffset ||
    compareUtf16(left.kind, right.kind) ||
    compareNullableUtf16(left.name, right.name)
  );
}

function compareNullableUtf16(left: string | null, right: string | null): number {
  if (left === null) {
    return right === null ? 0 : -1;
  }
  return right === null ? 1 : compareUtf16(left, right);
}
