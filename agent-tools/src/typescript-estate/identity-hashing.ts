import { Buffer } from 'node:buffer';
import { createHash, type Hash } from 'node:crypto';

import { err, isErr, ok, type Result } from '@oaknational/result';
import { version as typescriptVersion } from 'typescript';

import type { ExtractorIdentity, ImplementationFile } from './document-model.js';
import { EstateReviewError } from './errors.js';
import { lengthFrame } from './length-framing.js';

const HASH_DOMAIN = Buffer.from('typescript-estate-implementation-v1\0');

export interface IdentityMember {
  readonly absolutePath: string;
  readonly repoPath: string;
  readonly bytes: Uint8Array;
}

export function identityFromMembers(
  members: readonly IdentityMember[],
  nodeVersion: string,
): Result<ExtractorIdentity, EstateReviewError> {
  const ordered = [...members].sort((left, right) => compareUtf8(left.repoPath, right.repoPath));
  const aggregate = createHash('sha256').update(HASH_DOMAIN);
  const paths = new Set<string>();
  const implementationFiles: ImplementationFile[] = [];
  for (const member of ordered) {
    if (paths.has(member.repoPath)) {
      return err(
        new EstateReviewError(
          'IDENTITY_INVALID',
          `duplicate implementation member '${member.repoPath}'`,
        ),
      );
    }
    const appended = appendMember(aggregate, member);
    if (isErr(appended)) {
      return appended;
    }
    paths.add(member.repoPath);
    implementationFiles.push({
      path: member.repoPath,
      byteCount: member.bytes.byteLength,
      sha256: createHash('sha256').update(member.bytes).digest('hex'),
    });
  }
  const [first, ...rest] = implementationFiles;
  return first === undefined
    ? err(new EstateReviewError('IDENTITY_INVALID', 'implementation closure is empty'))
    : ok({
        implementationVersion: '2.0.0',
        implementationSha256: aggregate.digest('hex'),
        implementationFiles: [first, ...rest],
        nodeVersion,
        typescriptVersion,
        canonicalJsonVersion: 'lexicographic-object-keys-v1',
      });
}

function appendMember(
  aggregate: Hash,
  member: IdentityMember,
): Result<undefined, EstateReviewError> {
  const pathFrame = lengthFrame(Buffer.from(member.repoPath, 'utf8'));
  if (isErr(pathFrame)) {
    return framingFailure(pathFrame.error);
  }
  const contentFrame = lengthFrame(member.bytes);
  if (isErr(contentFrame)) {
    return framingFailure(contentFrame.error);
  }
  aggregate.update(pathFrame.value.length);
  aggregate.update(pathFrame.value.bytes);
  aggregate.update(contentFrame.value.length);
  aggregate.update(contentFrame.value.bytes);
  return ok(undefined);
}

function framingFailure(cause: Error): Result<never, EstateReviewError> {
  return err(
    new EstateReviewError('IDENTITY_INVALID', 'cannot length-frame implementation member', {
      cause,
    }),
  );
}

function compareUtf8(left: string, right: string): number {
  return Buffer.compare(Buffer.from(left, 'utf8'), Buffer.from(right, 'utf8'));
}
