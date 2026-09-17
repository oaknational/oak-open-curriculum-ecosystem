import { err, ok, type Result } from '@oaknational/result';
import {
  SyntaxKind,
  forEachChild,
  isClassDeclaration,
  isConstructorDeclaration,
  isFunctionDeclaration,
  isFunctionExpression,
  isGetAccessorDeclaration,
  isIdentifier,
  isInterfaceDeclaration,
  isMethodDeclaration,
  isNumericLiteral,
  isSetAccessorDeclaration,
  isStringLiteral,
  isTypeAliasDeclaration,
  type ClassDeclaration,
  type FunctionDeclaration,
  type FunctionExpression,
  type GetAccessorDeclaration,
  type InterfaceDeclaration,
  type MethodDeclaration,
  type Node,
  type SetAccessorDeclaration,
  type SourceFile,
  type TypeAliasDeclaration,
} from 'typescript';

import type { CloneMember } from './analysis-model.js';
import { EstateReviewError } from './errors.js';
import type { RepetitionRegionKind } from './file-vocabulary.js';
import { countRegionNodes, countRegionTokens, encodeRegion } from './region-repetition-encoding.js';
import type {
  EncodedRegionObservation,
  ExecutableRepetitionConfig,
  RepetitionSource,
} from './region-repetition-model.js';

export type {
  EncodedRegionObservation,
  ExecutableRepetitionConfig,
  RepetitionSource,
} from './region-repetition-model.js';

type NamedRegionNode =
  | FunctionDeclaration
  | FunctionExpression
  | MethodDeclaration
  | GetAccessorDeclaration
  | SetAccessorDeclaration
  | ClassDeclaration
  | InterfaceDeclaration
  | TypeAliasDeclaration;

const REGION_KIND_BY_SYNTAX_KIND = new Map<SyntaxKind, RepetitionRegionKind>([
  [SyntaxKind.FunctionDeclaration, 'FunctionDeclaration'],
  [SyntaxKind.FunctionExpression, 'FunctionExpression'],
  [SyntaxKind.ArrowFunction, 'ArrowFunction'],
  [SyntaxKind.MethodDeclaration, 'MethodDeclaration'],
  [SyntaxKind.GetAccessor, 'GetAccessor'],
  [SyntaxKind.SetAccessor, 'SetAccessor'],
  [SyntaxKind.Constructor, 'Constructor'],
  [SyntaxKind.ClassDeclaration, 'ClassDeclaration'],
  [SyntaxKind.InterfaceDeclaration, 'InterfaceDeclaration'],
  [SyntaxKind.TypeAliasDeclaration, 'TypeAliasDeclaration'],
  [SyntaxKind.TypeLiteral, 'TypeLiteral'],
  [SyntaxKind.ObjectLiteralExpression, 'ObjectLiteralExpression'],
]);

/** Enumerate and encode every configured region that meets both frozen floors. */
export function extractRegionObservations(
  sources: readonly RepetitionSource[],
  config: ExecutableRepetitionConfig,
): Result<readonly EncodedRegionObservation[], EstateReviewError> {
  const configuredKinds = new Set<RepetitionRegionKind>(config.regionAstKinds);
  const occurrenceKeys = new Set<string>();
  const observations: EncodedRegionObservation[] = [];
  let analysedRegions = 0;
  let failure: EstateReviewError | undefined;

  for (const source of sources) {
    const visit = (node: Node): void => {
      if (failure !== undefined) {
        return;
      }
      const kind = repetitionRegionKind(node);
      if (kind !== undefined && configuredKinds.has(kind)) {
        analysedRegions += 1;
        failure = limitFailure(analysedRegions, config.maxAnalysedRegions);
        if (failure !== undefined) {
          return;
        }
        const observation = observeRegion(source, node, kind, config, occurrenceKeys);
        if (observation instanceof EstateReviewError) {
          failure = observation;
          return;
        }
        if (observation !== undefined) {
          observations.push(observation);
        }
      }
      forEachChild(node, visit);
    };
    visit(source.sourceFile);
    if (failure !== undefined) {
      return err(failure);
    }
  }
  return ok(observations);
}

function observeRegion(
  source: RepetitionSource,
  node: Node,
  kind: RepetitionRegionKind,
  config: ExecutableRepetitionConfig,
  occurrenceKeys: Set<string>,
): EncodedRegionObservation | EstateReviewError | undefined {
  const startOffset = node.getStart(source.sourceFile, false);
  const endOffset = node.getEnd();
  const occurrenceKey = JSON.stringify([source.path, startOffset, endOffset, kind]);
  if (occurrenceKeys.has(occurrenceKey)) {
    return new EstateReviewError(
      'VALIDATION_FAILED',
      `repetition occurrence collision at '${source.path}:${startOffset}-${endOffset}:${kind}'`,
    );
  }
  occurrenceKeys.add(occurrenceKey);

  const nodeCount = countRegionNodes(node);
  const tokenCount = countRegionTokens(node, source.sourceFile, source.extension);
  if (nodeCount < config.minimumAstNodes || tokenCount < config.minimumTokens) {
    return undefined;
  }
  const encodings = encodeRegion(
    node,
    source.sourceFile,
    config.exactEncodingVersion,
    config.structuralEncodingVersion,
  );
  return {
    member: cloneMember(source, node, kind, startOffset, endOffset, nodeCount, tokenCount),
    verificationOnly: source.verificationOnly,
    ...encodings,
  };
}

function cloneMember(
  source: RepetitionSource,
  node: Node,
  kind: RepetitionRegionKind,
  startOffset: number,
  endOffset: number,
  nodeCount: number,
  tokenCount: number,
): CloneMember {
  const endPosition = Math.max(startOffset, endOffset - 1);
  return {
    path: source.path,
    kind,
    startOffset,
    endOffset,
    startLine: source.sourceFile.getLineAndCharacterOfPosition(startOffset).line + 1,
    endLine: source.sourceFile.getLineAndCharacterOfPosition(endPosition).line + 1,
    name: declaredRegionName(node, source.sourceFile),
    nodeCount,
    tokenCount,
  };
}

function limitFailure(count: number, maximum: number): EstateReviewError | undefined {
  return count > maximum
    ? new EstateReviewError(
        'RESOURCE_LIMIT',
        `maxAnalysedRegions exceeded: observed ${count}, maximum ${maximum}`,
      )
    : undefined;
}

function declaredRegionName(node: Node, sourceFile: SourceFile): string | null {
  if (isConstructorDeclaration(node)) {
    return 'constructor';
  }
  if (isNamedRegion(node)) {
    return staticName(node.name, sourceFile);
  }
  return null;
}

function isNamedRegion(node: Node): node is NamedRegionNode {
  return (
    isFunctionDeclaration(node) ||
    isFunctionExpression(node) ||
    isMethodDeclaration(node) ||
    isGetAccessorDeclaration(node) ||
    isSetAccessorDeclaration(node) ||
    isClassDeclaration(node) ||
    isInterfaceDeclaration(node) ||
    isTypeAliasDeclaration(node)
  );
}

function staticName(node: Node | undefined, sourceFile: SourceFile): string | null {
  if (node === undefined) {
    return null;
  }
  if (isIdentifier(node) || isStringLiteral(node)) {
    return node.text;
  }
  return isNumericLiteral(node) ? node.getText(sourceFile) : null;
}

function repetitionRegionKind(node: Node): RepetitionRegionKind | undefined {
  return REGION_KIND_BY_SYNTAX_KIND.get(node.kind);
}
