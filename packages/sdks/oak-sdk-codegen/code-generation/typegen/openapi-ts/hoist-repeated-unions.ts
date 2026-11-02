/**
 * Hoists the union types openapi-typescript repeats inline into module-level
 * type aliases.
 *
 * @remarks
 * The upstream schema declares its enumerations inline, so openapi-typescript
 * emits the same union (`"ks1" | "ks2" | "ks3" | "ks4"`) at every site that
 * uses it. A union of three or more members that recurs three or more times
 * outside a type alias is declared once at the top of the module and
 * referenced by name at each site, which is what `sonarjs/use-type-alias`
 * asks of any TypeScript module. Nullable unions (one member plus `null` or
 * `undefined`) and unions already inside a type alias are left alone, as the
 * rule leaves them. Names come from `union-alias-name.ts`, which names a
 * union after the property most of its sites share.
 */

import {
  ScriptKind,
  ScriptTarget,
  SyntaxKind,
  createSourceFile,
  forEachChild,
  isInterfaceDeclaration,
  isLiteralTypeNode,
  isParenthesizedTypeNode,
  isTypeAliasDeclaration,
  isUnionTypeNode,
} from 'typescript';
import type { Node, SourceFile, UnionTypeNode } from 'typescript';

import { applySourceEdits, editedSlice, type SourceEdit } from './source-edits.js';
import { uniqueUnionAliasName } from './union-alias-name.js';

/** Unions with more members than this are candidates. */
const MEMBER_THRESHOLD = 2;
/** Unions occurring more often than this are hoisted. */
const OCCURRENCE_THRESHOLD = 2;

interface UnionGroup {
  readonly occurrences: UnionTypeNode[];
}

function isNullableUnion(union: UnionTypeNode): boolean {
  const valueMembers = union.types.filter(
    (member) =>
      !(isLiteralTypeNode(member) && member.literal.kind === SyntaxKind.NullKeyword) &&
      member.kind !== SyntaxKind.UndefinedKeyword,
  );
  return valueMembers.length === 1;
}

function isInsideTypeAlias(node: Node): boolean {
  for (let current = node.parent; current !== undefined; current = current.parent) {
    if (isTypeAliasDeclaration(current)) {
      return true;
    }
  }
  return false;
}

/** The rule's identity for a union: its members' text, sorted. */
function unionKey(union: UnionTypeNode, sourceFile: SourceFile): string {
  return union.types
    .map((member) => member.getText(sourceFile))
    .sort((a, b) => a.localeCompare(b))
    .join('|');
}

function collectCandidateUnions(sourceFile: SourceFile): Map<string, UnionGroup> {
  const groups = new Map<string, UnionGroup>();
  const visit = (node: Node): void => {
    if (
      isUnionTypeNode(node) &&
      node.types.length > MEMBER_THRESHOLD &&
      !isNullableUnion(node) &&
      !isInsideTypeAlias(node)
    ) {
      const key = unionKey(node, sourceFile);
      const group = groups.get(key) ?? { occurrences: [] };
      group.occurrences.push(node);
      groups.set(key, group);
    }
    forEachChild(node, visit);
  };
  visit(sourceFile);
  return groups;
}

/** The range an occurrence's reference replaces: its parentheses too, when it has them. */
function replacedNode(union: UnionTypeNode): Node {
  return isParenthesizedTypeNode(union.parent) ? union.parent : union;
}

function declaredTopLevelNames(sourceFile: SourceFile): Set<string> {
  const names = new Set<string>();
  for (const statement of sourceFile.statements) {
    if (isInterfaceDeclaration(statement) || isTypeAliasDeclaration(statement)) {
      names.add(statement.name.text);
    }
  }
  return names;
}

interface HoistedAlias {
  readonly name: string;
  readonly first: UnionTypeNode;
}

function planAliases(
  groups: Map<string, UnionGroup>,
  sourceFile: SourceFile,
): { readonly aliases: HoistedAlias[]; readonly edits: SourceEdit[] } {
  const taken = declaredTopLevelNames(sourceFile);
  const aliases: HoistedAlias[] = [];
  const edits: SourceEdit[] = [];
  for (const group of groups.values()) {
    if (group.occurrences.length <= OCCURRENCE_THRESHOLD) {
      continue;
    }
    const [first, ...rest] = group.occurrences;
    if (first === undefined) {
      continue;
    }
    const name = uniqueUnionAliasName([first, ...rest], taken);
    taken.add(name);
    aliases.push({ name, first });
    for (const occurrence of group.occurrences) {
      const target = replacedNode(occurrence);
      edits.push({ start: target.getStart(sourceFile), end: target.getEnd(), replacement: name });
    }
  }
  return { aliases, edits };
}

function renderAliasBlock(
  aliases: readonly HoistedAlias[],
  source: string,
  sourceFile: SourceFile,
  edits: readonly SourceEdit[],
): string {
  const declarations = aliases.map(({ name, first }) => {
    const body = editedSlice(source, first.getStart(sourceFile), first.getEnd(), edits);
    return `type ${name} = ${body};`;
  });
  return [
    '/**',
    ' * Union types the schema declares inline at three or more sites, each',
    ' * declared once here and referenced by name where openapi-typescript',
    ' * emitted it (sonarjs/use-type-alias).',
    ' */',
    ...declarations,
    '',
  ].join('\n');
}

/**
 * Declares each repeated union once and references it by name at every site.
 *
 * @param source - The openapi-typescript output, root types already renamed
 * @returns The source with the alias block prepended and the sites replaced
 */
export function hoistRepeatedUnions(source: string): string {
  const sourceFile = createSourceFile(
    'api-paths-types.ts',
    source,
    ScriptTarget.Latest,
    true,
    ScriptKind.TS,
  );
  const { aliases, edits } = planAliases(collectCandidateUnions(sourceFile), sourceFile);
  if (aliases.length === 0) {
    return source;
  }
  const firstStatement = sourceFile.statements[0];
  const insertAt = firstStatement === undefined ? 0 : firstStatement.getStart(sourceFile);
  const aliasBlock = renderAliasBlock(aliases, source, sourceFile, edits);
  return applySourceEdits(source, [
    ...edits,
    { start: insertAt, end: insertAt, replacement: aliasBlock },
  ]);
}
