import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { err, isErr, ok, type Result } from '@oaknational/result';

import type { ExtractorIdentity } from './document-model.js';
import { EstateReviewError } from './errors.js';
import { identityFromMembers, type IdentityMember } from './identity-hashing.js';
import { resolveIdentityImports } from './identity-module-specifiers.js';
export type { IdentityReadPort } from './identity-secure-read.js';
import type { IdentityReadPort } from './identity-secure-read.js';

const IDENTITY_SUFFIX = path.join(
  'agent-tools',
  'dist',
  'src',
  'typescript-estate',
  'implementation-identity.js',
);
const DIST_RELATIVE_ROOT = path.join('agent-tools', 'dist');
const ENTRYPOINT_RELATIVE_PATH = path.join('agent-tools', 'dist', 'src', 'bin', 'agent-tools.js');
const SUPPORT_PATHS = [path.join('agent-tools', 'package.json'), 'pnpm-lock.yaml'];

export interface BuildExtractorIdentityInput {
  readonly identityModuleUrl: URL;
  readonly nodeVersion: string;
  readonly read: IdentityReadPort;
}

interface IdentityRoots {
  readonly checkout: string;
  readonly dist: string;
  readonly identityModule: string;
  readonly entrypoint: string;
}

/** Build the exact identity of the executing built extractor closure. */
export function buildExtractorIdentity(
  input: BuildExtractorIdentityInput,
): Result<ExtractorIdentity, EstateReviewError> {
  if (input.nodeVersion.length === 0) {
    return err(new EstateReviewError('IDENTITY_INVALID', 'Node version must be non-empty'));
  }
  const roots = deriveIdentityRoots(input.identityModuleUrl, input.read);
  if (isErr(roots)) {
    return roots;
  }
  const closure = discoverClosure(roots.value, input.read);
  if (isErr(closure)) {
    return closure;
  }
  const identityRepoPath = toRepoPath(roots.value.checkout, roots.value.identityModule);
  if (!closure.value.has(identityRepoPath)) {
    return err(
      new EstateReviewError(
        'IDENTITY_INVALID',
        'executing identity module is absent from the executable closure',
      ),
    );
  }
  const support = readSupportFiles(roots.value, input.read);
  if (isErr(support)) {
    return support;
  }
  return identityFromMembers([...closure.value.values(), ...support.value], input.nodeVersion);
}

function deriveIdentityRoots(
  moduleUrl: URL,
  read: IdentityReadPort,
): Result<IdentityRoots, EstateReviewError> {
  const modulePath = pathFromUrl(moduleUrl);
  if (isErr(modulePath)) {
    return modulePath;
  }
  const canonical = read.canonicalRealpath(modulePath.value);
  if (isErr(canonical)) {
    return err(
      new EstateReviewError('IDENTITY_INVALID', 'cannot canonicalise executing identity module', {
        cause: canonical.error,
      }),
    );
  }
  const suffix = `${path.sep}${IDENTITY_SUFFIX}`;
  if (!canonical.value.endsWith(suffix) || path.extname(canonical.value) !== '.js') {
    return err(
      new EstateReviewError(
        'IDENTITY_INVALID',
        `executing identity module must end exactly in '${IDENTITY_SUFFIX}'`,
      ),
    );
  }
  const checkout = canonical.value.slice(0, -suffix.length);
  return !path.isAbsolute(checkout) || checkout.length === 0
    ? err(new EstateReviewError('IDENTITY_INVALID', 'cannot derive executing checkout root'))
    : ok({
        checkout,
        dist: path.join(checkout, DIST_RELATIVE_ROOT),
        identityModule: canonical.value,
        entrypoint: path.join(checkout, ENTRYPOINT_RELATIVE_PATH),
      });
}

function pathFromUrl(moduleUrl: URL): Result<string, EstateReviewError> {
  try {
    return ok(fileURLToPath(moduleUrl));
  } catch (cause: unknown) {
    return err(
      new EstateReviewError('IDENTITY_INVALID', 'identity module URL is not a file URL', { cause }),
    );
  }
}

function discoverClosure(
  roots: IdentityRoots,
  read: IdentityReadPort,
): Result<Map<string, IdentityMember>, EstateReviewError> {
  const members = new Map<string, IdentityMember>();
  const pending = [roots.entrypoint];
  while (pending.length > 0) {
    const absolutePath = pending.pop();
    if (absolutePath === undefined) {
      continue;
    }
    const discovered = discoverMember(roots, read, members, absolutePath);
    if (isErr(discovered)) {
      return discovered;
    }
    pending.push(...discovered.value);
  }
  return ok(members);
}

function discoverMember(
  roots: IdentityRoots,
  read: IdentityReadPort,
  members: Map<string, IdentityMember>,
  absolutePath: string,
): Result<readonly string[], EstateReviewError> {
  const repoPath = toRepoPath(roots.checkout, absolutePath);
  if (members.has(repoPath)) {
    return ok([]);
  }
  const bytes = readIdentityMember(read, roots.checkout, roots.dist, absolutePath);
  if (isErr(bytes)) {
    return bytes;
  }
  members.set(repoPath, { absolutePath, repoPath, bytes: bytes.value });
  return absolutePath.endsWith('.js')
    ? resolveIdentityImports(roots, absolutePath, bytes.value)
    : ok([]);
}

function readSupportFiles(
  roots: IdentityRoots,
  read: IdentityReadPort,
): Result<readonly IdentityMember[], EstateReviewError> {
  const members: IdentityMember[] = [];
  for (const relativePath of SUPPORT_PATHS) {
    const absolutePath = path.join(roots.checkout, relativePath);
    const bytes = readIdentityMember(read, roots.checkout, roots.checkout, absolutePath);
    if (isErr(bytes)) {
      return bytes;
    }
    members.push({ absolutePath, repoPath: toPosix(relativePath), bytes: bytes.value });
  }
  return ok(members);
}

function readIdentityMember(
  read: IdentityReadPort,
  chainRoot: string,
  ownerRoot: string,
  absolutePath: string,
): Result<Uint8Array, EstateReviewError> {
  const result = read.readRegularFileNoFollow({ chainRoot, ownerRoot, path: absolutePath });
  return isErr(result)
    ? err(
        new EstateReviewError(
          'IDENTITY_INVALID',
          `cannot prove implementation member '${toRepoPath(chainRoot, absolutePath)}'`,
          { cause: result.error },
        ),
      )
    : result;
}

function toRepoPath(checkout: string, absolutePath: string): string {
  return toPosix(path.relative(checkout, absolutePath));
}

function toPosix(value: string): string {
  return value.split(path.sep).join('/');
}
