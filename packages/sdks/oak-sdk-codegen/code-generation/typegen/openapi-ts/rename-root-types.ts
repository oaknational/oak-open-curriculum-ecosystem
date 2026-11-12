/**
 * Renames openapi-typescript's lower-case root types to PascalCase.
 *
 * @remarks
 * openapi-typescript emits `paths`, `webhooks`, `components`, `$defs` and
 * `operations` as the document's root types and refers to them by those
 * names throughout (`components["schemas"]["X"]`, `operations["id"]`). The
 * estate names every type in PascalCase (`sonarjs/class-name`), so the
 * generator renames the declarations and every type reference to them, by
 * AST position, leaving property names, string literals and comments as they
 * were.
 */

import {
  ScriptKind,
  ScriptTarget,
  createSourceFile,
  forEachChild,
  isIdentifier,
  isInterfaceDeclaration,
  isTypeAliasDeclaration,
  isTypeReferenceNode,
} from 'typescript';
import type { Identifier, Node, SourceFile } from 'typescript';

import { applySourceEdits, type SourceEdit } from './source-edits.js';

/** The emitted root type names and the names the generated module exports. */
export const ROOT_TYPE_RENAMES: Readonly<Record<string, string>> = {
  paths: 'Paths',
  webhooks: 'Webhooks',
  components: 'Components',
  $defs: '$Defs',
  operations: 'Operations',
};

function renameFor(identifier: Identifier): string | undefined {
  return Object.hasOwn(ROOT_TYPE_RENAMES, identifier.text)
    ? ROOT_TYPE_RENAMES[identifier.text]
    : undefined;
}

function identifierToRename(node: Node, sourceFile: SourceFile): Identifier | undefined {
  if (
    (isInterfaceDeclaration(node) || isTypeAliasDeclaration(node)) &&
    node.parent === sourceFile
  ) {
    return node.name;
  }
  if (isTypeReferenceNode(node) && isIdentifier(node.typeName)) {
    return node.typeName;
  }
  return undefined;
}

/**
 * Renames the root type declarations and their type references.
 *
 * @param source - The openapi-typescript output
 * @returns The same source with the five root types in PascalCase
 */
export function renameRootTypes(source: string): string {
  const sourceFile = createSourceFile(
    'api-paths-types.ts',
    source,
    ScriptTarget.Latest,
    true,
    ScriptKind.TS,
  );
  const edits: SourceEdit[] = [];
  const visit = (node: Node): void => {
    const identifier = identifierToRename(node, sourceFile);
    const replacement = identifier === undefined ? undefined : renameFor(identifier);
    if (identifier !== undefined && replacement !== undefined) {
      edits.push({ start: identifier.getStart(sourceFile), end: identifier.getEnd(), replacement });
    }
    forEachChild(node, visit);
  };
  visit(sourceFile);
  return applySourceEdits(source, edits);
}
