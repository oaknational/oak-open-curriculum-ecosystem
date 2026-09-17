import { err, isErr, ok, type Result } from '@oaknational/result';
import {
  forEachChild,
  isObjectLiteralExpression,
  isPropertyAssignment,
  isStringLiteral,
  parseJsonText,
  type Node,
} from 'typescript';
import { z } from 'zod';

import type { WorkspaceAttributionConfig } from './config-classification-model.js';
import { EstateReviewError } from './errors.js';
import { decodeUtf8 } from './git-snapshot-process.js';
import type { RepoPath, WorkspacePackageName } from './scalar-model.js';

const packageManifestSchema = z.looseObject({ name: z.string() });

export function compileWorkspacePackageNamePattern(
  config: WorkspaceAttributionConfig,
): Result<RegExp, EstateReviewError> {
  try {
    return ok(new RegExp(config.packageNamePattern, 'u'));
  } catch (cause: unknown) {
    return err(
      new EstateReviewError('CONFIG_INVALID', 'workspace package-name grammar is invalid', {
        cause,
      }),
    );
  }
}

export function parseWorkspacePackageName(
  path: RepoPath,
  bytes: Uint8Array,
  packageNamePattern: RegExp,
): Result<WorkspacePackageName, EstateReviewError> {
  const decoded = decodeUtf8(bytes, `workspace package manifest '${path}'`);
  if (isErr(decoded)) {
    return decoded;
  }
  const parsed = parseStrictJson(path, decoded.value);
  if (isErr(parsed)) {
    return parsed;
  }
  const sourceFile = parseJsonText(path, decoded.value);
  if (
    'parseDiagnostics' in sourceFile &&
    Array.isArray(sourceFile.parseDiagnostics) &&
    sourceFile.parseDiagnostics.length > 0
  ) {
    return invalidPackageManifest(path, 'TypeScript JSON parsing produced a diagnostic');
  }
  const duplicate = findDuplicateDecodedKey(sourceFile);
  if (duplicate !== null) {
    return invalidPackageManifest(path, `contains duplicate decoded key '${duplicate}'`);
  }
  return validatePackageName(path, parsed.value, packageNamePattern);
}

function validatePackageName(
  path: RepoPath,
  value: unknown,
  packageNamePattern: RegExp,
): Result<WorkspacePackageName, EstateReviewError> {
  const manifest = packageManifestSchema.safeParse(value);
  if (!manifest.success || !packageNamePattern.test(manifest.data.name)) {
    return invalidPackageManifest(path, 'has no valid top-level package name');
  }
  return ok(manifest.data.name);
}

function parseStrictJson(path: RepoPath, source: string): Result<unknown, EstateReviewError> {
  try {
    const value: unknown = JSON.parse(source);
    return ok(value);
  } catch (cause: unknown) {
    return err(
      new EstateReviewError('SNAPSHOT_INVALID', `workspace package manifest '${path}' is invalid`, {
        cause,
      }),
    );
  }
}

function findDuplicateDecodedKey(root: Node): string | null {
  let duplicate: string | null = null;
  const visit = (node: Node): void => {
    if (duplicate !== null) {
      return;
    }
    if (isObjectLiteralExpression(node)) {
      duplicate = duplicateInObject(node.properties);
    }
    if (duplicate === null) {
      forEachChild(node, visit);
    }
  };
  visit(root);
  return duplicate;
}

function duplicateInObject(properties: readonly Node[]): string | null {
  const names = new Set<string>();
  for (const property of properties) {
    if (isPropertyAssignment(property) && isStringLiteral(property.name)) {
      if (names.has(property.name.text)) {
        return property.name.text;
      }
      names.add(property.name.text);
    }
  }
  return null;
}

function invalidPackageManifest(path: RepoPath, message: string): Result<never, EstateReviewError> {
  return err(
    new EstateReviewError('SNAPSHOT_INVALID', `workspace package manifest '${path}' ${message}`),
  );
}
