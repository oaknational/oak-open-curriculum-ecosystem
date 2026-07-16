/**
 * Project-root, path-policy, and symbolic-link confinement for review paths.
 *
 * @packageDocumentation
 */

import { isAbsolute, join, relative, resolve, sep } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { isExcludedReviewPath } from './path-policy.js';
import { type HookChange } from './types.js';

/** Filesystem entry classes returned by the injected lstat boundary. */
export type ReviewPathEntryKind = 'file' | 'directory' | 'symbolic-link' | 'missing' | 'other';

/** Filesystem seam used to inspect paths without hidden I/O in policy code. */
export interface ReviewPathInspection {
  readonly lstat: (absolutePath: string) => Promise<Result<ReviewPathEntryKind, Error>>;
}

/** Inputs needed to validate and normalise a hook-supplied source path. */
export interface ResolveReviewPathInput {
  readonly projectRoot: string;
  readonly filePath: string;
  readonly tool: HookChange['tool'];
}

interface LexicalReviewPath {
  readonly root: string;
  readonly absolutePath: string;
  readonly relativePath: string;
  readonly portablePath: string;
}

/** Validate a source path and return its portable project-relative form. */
export async function resolveReviewPath(
  input: ResolveReviewPathInput,
  inspection: ReviewPathInspection,
): Promise<Result<string, Error>> {
  const lexicalPath = resolveLexicalPath(input);
  if (!lexicalPath.ok) {
    return lexicalPath;
  }
  const inspected = await inspectPath(lexicalPath.value, input.tool, inspection);
  if (!inspected.ok) {
    return inspected;
  }
  return ok(lexicalPath.value.portablePath);
}

function resolveLexicalPath(input: ResolveReviewPathInput): Result<LexicalReviewPath, Error> {
  const validInput = validatePathStrings(input.projectRoot, input.filePath);
  if (!validInput.ok) {
    return validInput;
  }
  const root = resolve(input.projectRoot);
  const absolutePath = resolve(input.filePath);
  const relativePath = relative(root, absolutePath);
  return validateRelativePath({ root, absolutePath, relativePath });
}

function validatePathStrings(projectRoot: string, filePath: string): Result<void, Error> {
  if (!isAbsolute(projectRoot)) {
    return err(new Error('Project root must be an absolute path'));
  }
  if (projectRoot.includes('\u0000') || filePath.includes('\u0000')) {
    return err(new Error('Review path must not contain a null byte'));
  }
  if (filePath.trim().length === 0) {
    return err(new Error('Review path must be non-blank'));
  }
  if (!isAbsolute(filePath)) {
    return err(new Error('Review path must be an absolute path'));
  }
  if (hasParentTraversalSegment(filePath)) {
    return err(new Error('Review path must not contain a parent traversal segment'));
  }
  return ok(undefined);
}

function hasParentTraversalSegment(filePath: string): boolean {
  return filePath.split(/[/\\]/u).some((segment) => segment === '..');
}

function validateRelativePath(
  path: Omit<LexicalReviewPath, 'portablePath'>,
): Result<LexicalReviewPath, Error> {
  if (path.relativePath.length === 0) {
    return err(new Error('Review path must identify a file below the project root'));
  }
  if (isOutsideRoot(path.relativePath)) {
    return err(new Error('Review path must resolve to a file inside the project root'));
  }
  const portablePath = path.relativePath.split(sep).join('/');
  if (isExcludedReviewPath(portablePath)) {
    return err(new Error('Review path is excluded from model review'));
  }
  return ok({ ...path, portablePath });
}

function isOutsideRoot(relativePath: string): boolean {
  return relativePath === '..' || relativePath.startsWith(`..${sep}`) || isAbsolute(relativePath);
}

async function inspectPath(
  path: LexicalReviewPath,
  tool: HookChange['tool'],
  inspection: ReviewPathInspection,
): Promise<Result<void, Error>> {
  const segments = path.relativePath.split(sep);
  let currentPath = path.root;
  for (const [index, segment] of segments.entries()) {
    currentPath = join(currentPath, segment);
    const entry = await inspection.lstat(currentPath);
    if (!entry.ok) {
      return entry;
    }
    const validEntry = validateEntry(entry.value, index === segments.length - 1, tool);
    if (!validEntry.ok) {
      return validEntry;
    }
  }
  return ok(undefined);
}

function validateEntry(
  kind: ReviewPathEntryKind,
  isTarget: boolean,
  tool: HookChange['tool'],
): Result<void, Error> {
  if (kind === 'symbolic-link') {
    return err(new Error('Review path must not contain a symbolic link'));
  }
  if (kind === 'missing') {
    return validateMissingEntry(isTarget, tool);
  }
  return isTarget ? validateTargetEntry(kind) : validateAncestorEntry(kind);
}

function validateMissingEntry(isTarget: boolean, tool: HookChange['tool']): Result<void, Error> {
  if (!isTarget) {
    return err(new Error('Review path ancestor must already exist'));
  }
  if (tool === 'Edit') {
    return err(new Error('Edit review path must already exist'));
  }
  return ok(undefined);
}

function validateAncestorEntry(kind: ReviewPathEntryKind): Result<void, Error> {
  if (kind !== 'directory') {
    return err(new Error('Review path ancestor must be a directory'));
  }
  return ok(undefined);
}

function validateTargetEntry(kind: ReviewPathEntryKind): Result<void, Error> {
  if (kind !== 'file') {
    return err(new Error('Review path target must be a regular file'));
  }
  return ok(undefined);
}
