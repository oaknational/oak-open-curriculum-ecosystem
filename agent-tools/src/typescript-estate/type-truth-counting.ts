import {
  SyntaxKind,
  createScanner,
  forEachChild,
  isAsExpression,
  isCallExpression,
  isIdentifier,
  isNonNullExpression,
  isPropertyAccessExpression,
  isTypeAssertionExpression,
  isTypeNode,
  isTypeReferenceNode,
  type CallExpression,
  type Node,
  type PropertyAccessExpression,
  type SourceFile,
  type TypeNode,
} from 'typescript';

import type { TypeTruthCount } from './analysis-model.js';
import { TYPE_TRUTH_IDS, type TypeTruthId } from './file-vocabulary.js';

type SuppressionDirective = '@ts-expect-error' | '@ts-ignore' | '@ts-nocheck';

const TS_DIRECTIVE_PATTERN = /^@ts-(expect-error|ignore|nocheck)(?:\s|:|$)/;

/** Count the frozen type-truth boundary signals for one parsed source file. */
export function countTypeTruthSignals(sourceFile: SourceFile): readonly TypeTruthCount[] {
  const counts = new Map<TypeTruthId, number>(TYPE_TRUTH_IDS.map((id) => [id, 0]));
  const increment = (id: TypeTruthId): void => {
    counts.set(id, (counts.get(id) ?? 0) + 1);
  };

  const visit = (node: Node): void => {
    incrementWhen(isTypeAssertion(node), 'type-assertion', increment);
    incrementWhen(isTypeKeyword(node, SyntaxKind.AnyKeyword), 'any-keyword', increment);
    incrementWhen(isTypeKeyword(node, SyntaxKind.UnknownKeyword), 'unknown-keyword', increment);
    incrementWhen(isNonNullExpression(node), 'non-null-assertion', increment);
    incrementWhen(isRecordStringUnknown(node), 'record-string-unknown', increment);
    incrementWhen(isZodUnknownCall(node), 'zod-unknown', increment);
    forEachChild(node, visit);
  };
  visit(sourceFile);
  counts.set('typescript-suppression', countSuppressionDirectives(sourceFile));

  return TYPE_TRUTH_IDS.map((id) => ({ id, count: counts.get(id) ?? 0 }));
}

function incrementWhen(
  matches: boolean,
  id: TypeTruthId,
  increment: (id: TypeTruthId) => void,
): void {
  if (matches) {
    increment(id);
  }
}

function isTypeAssertion(node: Node): boolean {
  if (isTypeAssertionExpression(node)) {
    return true;
  }
  return isAsExpression(node) && !isConstAssertionType(node.type);
}

function isTypeKeyword(
  node: Node,
  kind: SyntaxKind.AnyKeyword | SyntaxKind.UnknownKeyword,
): boolean {
  return node.kind === kind && isTypeNode(node);
}

function isConstAssertionType(node: TypeNode): boolean {
  return (
    isTypeReferenceNode(node) &&
    isIdentifier(node.typeName) &&
    node.typeName.text === 'const' &&
    node.typeArguments === undefined
  );
}

function isRecordStringUnknown(node: Node): boolean {
  if (!isTypeReferenceNode(node)) {
    return false;
  }
  if (!isIdentifier(node.typeName)) {
    return false;
  }
  if (node.typeName.text !== 'Record') {
    return false;
  }
  if (node.typeArguments === undefined) {
    return false;
  }
  if (node.typeArguments.length !== 2) {
    return false;
  }
  const [key, value] = node.typeArguments;
  return key.kind === SyntaxKind.StringKeyword && value.kind === SyntaxKind.UnknownKeyword;
}

function isZodUnknownCall(node: Node): boolean {
  if (!isPlainZeroArgumentCall(node)) {
    return false;
  }
  const expression = node.expression;
  return (
    isPlainPropertyAccess(expression) &&
    isIdentifier(expression.expression) &&
    expression.expression.text === 'z' &&
    expression.name.text === 'unknown'
  );
}

function isPlainZeroArgumentCall(node: Node): node is CallExpression {
  return (
    isCallExpression(node) &&
    (node.typeArguments?.length ?? 0) === 0 &&
    node.arguments.length === 0 &&
    node.questionDotToken === undefined
  );
}

function isPlainPropertyAccess(node: Node): node is PropertyAccessExpression {
  return isPropertyAccessExpression(node) && node.questionDotToken === undefined;
}

function countSuppressionDirectives(sourceFile: SourceFile): number {
  const scanner = createScanner(
    sourceFile.languageVersion,
    false,
    sourceFile.languageVariant,
    sourceFile.text,
  );
  let count = 0;
  let seenNonTrivia = false;

  for (let token = scanner.scan(); token !== SyntaxKind.EndOfFileToken; token = scanner.scan()) {
    if (isCommentTrivia(token)) {
      count += suppressionCount(scanner.getTokenText(), token, seenNonTrivia);
      continue;
    }
    if (!isTrivia(token)) {
      seenNonTrivia = true;
    }
  }
  return count;
}

function isCommentTrivia(kind: SyntaxKind): boolean {
  return kind === SyntaxKind.SingleLineCommentTrivia || kind === SyntaxKind.MultiLineCommentTrivia;
}

function isTrivia(kind: SyntaxKind): boolean {
  return kind >= SyntaxKind.FirstTriviaToken && kind <= SyntaxKind.LastTriviaToken;
}

function suppressionCount(comment: string, kind: SyntaxKind, seenNonTrivia: boolean): number {
  const directive = suppressionDirective(comment, kind);
  if (directive === undefined) {
    return 0;
  }
  if (directive === '@ts-nocheck' && seenNonTrivia) {
    return 0;
  }
  return 1;
}

function suppressionDirective(comment: string, kind: SyntaxKind): SuppressionDirective | undefined {
  const body = commentBody(comment, kind);
  const name = TS_DIRECTIVE_PATTERN.exec(body)?.[1];
  if (name === 'expect-error') {
    return '@ts-expect-error';
  }
  if (name === 'ignore') {
    return '@ts-ignore';
  }
  return name === 'nocheck' ? '@ts-nocheck' : undefined;
}

function commentBody(comment: string, kind: SyntaxKind): string {
  const withoutOpeningMarker = comment.slice(2);
  const withoutMarkers =
    kind === SyntaxKind.MultiLineCommentTrivia && withoutOpeningMarker.endsWith('*/')
      ? withoutOpeningMarker.slice(0, -2)
      : withoutOpeningMarker;
  return withoutMarkers.trimStart();
}
