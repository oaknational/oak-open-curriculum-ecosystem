import path from 'node:path';

import { err, isErr, ok, type Result } from '@oaknational/result';
import {
  ModuleKind,
  ScriptKind,
  ScriptTarget,
  SyntaxKind,
  createSourceFile,
  flattenDiagnosticMessageText,
  forEachChild,
  isCallExpression,
  isExportDeclaration,
  isImportDeclaration,
  isStringLiteralLike,
  transpileModule,
  type Node,
} from 'typescript';

import { EstateReviewError } from './errors.js';
import {
  classifyIdentitySpecifier,
  type IdentityResolutionRoots,
} from './identity-specifier-classification.js';
export type { IdentityResolutionRoots } from './identity-specifier-classification.js';

/** Parse one JavaScript member and resolve every local closure target. */
export function resolveIdentityImports(
  roots: IdentityResolutionRoots,
  importer: string,
  bytes: Uint8Array,
): Result<readonly string[], EstateReviewError> {
  const repoPath = toRepoPath(roots.checkout, importer);
  const decoded = decodeJavaScript(repoPath, bytes);
  if (isErr(decoded)) {
    return decoded;
  }
  const specifiers = parseModuleSpecifiers(repoPath, decoded.value);
  if (isErr(specifiers)) {
    return specifiers;
  }
  const targets: string[] = [];
  for (const specifier of specifiers.value) {
    const target = classifyIdentitySpecifier(roots, importer, specifier);
    if (isErr(target)) {
      return target;
    }
    if (target.value !== null) {
      targets.push(target.value);
    }
  }
  return ok(targets);
}

function parseModuleSpecifiers(
  repoPath: string,
  source: string,
): Result<readonly string[], EstateReviewError> {
  const diagnostics = transpileModule(source, {
    compilerOptions: { allowJs: true, module: ModuleKind.ESNext, target: ScriptTarget.Latest },
    fileName: repoPath,
    reportDiagnostics: true,
  }).diagnostics;
  if (diagnostics !== undefined && diagnostics.length > 0) {
    const detail = diagnostics
      .map((diagnostic) => flattenDiagnosticMessageText(diagnostic.messageText, ' '))
      .join('; ');
    return err(
      new EstateReviewError(
        'IDENTITY_INVALID',
        `invalid JavaScript identity member '${repoPath}': ${detail}`,
      ),
    );
  }
  const sourceFile = createSourceFile(repoPath, source, ScriptTarget.Latest, true, ScriptKind.JS);
  return collectSpecifiers(sourceFile, repoPath);
}

function collectSpecifiers(
  root: Node,
  repoPath: string,
): Result<readonly string[], EstateReviewError> {
  const specifiers: string[] = [];
  let failure: EstateReviewError | undefined;
  const visit = (node: Node): void => {
    if (failure !== undefined) {
      return;
    }
    const staticSpecifier = readStaticSpecifier(node);
    if (staticSpecifier !== undefined) {
      specifiers.push(staticSpecifier);
    }
    const dynamicSpecifier = readDynamicSpecifier(node, repoPath);
    if (isErr(dynamicSpecifier)) {
      failure = dynamicSpecifier.error;
      return;
    }
    if (dynamicSpecifier.value !== undefined) {
      specifiers.push(dynamicSpecifier.value);
    }
    forEachChild(node, visit);
  };
  visit(root);
  return failure === undefined ? ok(specifiers) : err(failure);
}

function readStaticSpecifier(node: Node): string | undefined {
  if (!isImportDeclaration(node) && !isExportDeclaration(node)) {
    return undefined;
  }
  return node.moduleSpecifier !== undefined && isStringLiteralLike(node.moduleSpecifier)
    ? node.moduleSpecifier.text
    : undefined;
}

function readDynamicSpecifier(
  node: Node,
  repoPath: string,
): Result<string | undefined, EstateReviewError> {
  if (!isCallExpression(node) || node.expression.kind !== SyntaxKind.ImportKeyword) {
    return ok(undefined);
  }
  const argument = node.arguments[0];
  return argument !== undefined && isStringLiteralLike(argument)
    ? ok(argument.text)
    : err(
        new EstateReviewError(
          'IDENTITY_INVALID',
          `non-literal dynamic import in identity member '${repoPath}'`,
        ),
      );
}

function decodeJavaScript(repoPath: string, bytes: Uint8Array): Result<string, EstateReviewError> {
  try {
    const decoded = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes);
    const roundTrip = new TextEncoder().encode(decoded);
    return bytesEqual(bytes, roundTrip)
      ? ok(decoded)
      : err(
          new EstateReviewError(
            'IDENTITY_INVALID',
            `identity member '${repoPath}' failed UTF-8 round trip`,
          ),
        );
  } catch (cause: unknown) {
    return err(
      new EstateReviewError(
        'IDENTITY_INVALID',
        `identity member '${repoPath}' is not valid UTF-8`,
        {
          cause,
        },
      ),
    );
  }
}

function toRepoPath(checkout: string, absolutePath: string): string {
  return toPosix(path.relative(checkout, absolutePath));
}

function toPosix(value: string): string {
  return value.split(path.sep).join('/');
}

function bytesEqual(left: Uint8Array, right: Uint8Array): boolean {
  return (
    left.byteLength === right.byteLength && left.every((value, index) => value === right[index])
  );
}
