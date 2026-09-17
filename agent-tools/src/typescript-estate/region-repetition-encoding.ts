import { createHash } from 'node:crypto';

import {
  EmitHint,
  LanguageVariant,
  NewLineKind,
  SyntaxKind,
  createPrinter,
  createScanner,
  forEachChild,
  isToken,
  type Node,
  type SourceFile,
} from 'typescript';

import type { SourceExtension } from './file-vocabulary.js';

const NUL = '\0';
const printer = createPrinter({ removeComments: true, newLine: NewLineKind.LineFeed });

export interface RegionEncodings {
  readonly exactFingerprint: string;
  readonly exactEncoding: string;
  readonly structuralFingerprint: string;
  readonly structuralEncoding: readonly string[];
}

export function countRegionNodes(node: Node): number {
  let count = 0;
  const visit = (current: Node): void => {
    if (!isToken(current)) {
      count += 1;
    }
    forEachChild(current, visit);
  };
  visit(node);
  return count;
}

export function countRegionTokens(
  node: Node,
  sourceFile: SourceFile,
  extension: SourceExtension,
): number {
  const text = sourceFile.text.slice(node.getStart(sourceFile, false), node.getEnd());
  const languageVariant = extension === '.tsx' ? LanguageVariant.JSX : LanguageVariant.Standard;
  const scanner = createScanner(sourceFile.languageVersion, true, languageVariant, text);
  let count = 0;
  for (let token = scanner.scan(); token !== SyntaxKind.EndOfFileToken; token = scanner.scan()) {
    count += 1;
  }
  return count;
}

export function encodeRegion(
  node: Node,
  sourceFile: SourceFile,
  exactEncodingVersion: string,
  structuralEncodingVersion: string,
): RegionEncodings {
  const kindName = syntaxKindName(node);
  const exactEncoding = printer.printNode(EmitHint.Unspecified, node, sourceFile);
  const exactFingerprint = createHash('sha256')
    .update(exactEncodingVersion, 'utf8')
    .update(NUL)
    .update(kindName, 'utf8')
    .update(NUL)
    .update(exactEncoding, 'utf8')
    .digest('hex');
  const structuralEncoding = structuralKindNames(node, sourceFile);
  const structuralFingerprint = createHash('sha256')
    .update(structuralEncodingVersion, 'utf8')
    .update(NUL)
    .update(structuralEncoding.join(','), 'utf8')
    .digest('hex');
  return {
    exactFingerprint,
    exactEncoding,
    structuralFingerprint,
    structuralEncoding,
  };
}

function structuralKindNames(node: Node, sourceFile: SourceFile): readonly string[] {
  const kinds: string[] = [];
  const visit = (current: Node): void => {
    kinds.push(syntaxKindName(current));
    for (const child of current.getChildren(sourceFile)) {
      visit(child);
    }
  };
  visit(node);
  return kinds;
}

function syntaxKindName(node: Node): string {
  return SyntaxKind[node.kind];
}
