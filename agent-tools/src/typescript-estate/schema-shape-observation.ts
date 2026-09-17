import {
  isCallExpression,
  isCallSignatureDeclaration,
  isComputedPropertyName,
  isConstructSignatureDeclaration,
  isGetAccessorDeclaration,
  isIdentifier,
  isIndexSignatureDeclaration,
  isInterfaceDeclaration,
  isMethodDeclaration,
  isMethodSignature,
  isNoSubstitutionTemplateLiteral,
  isNumericLiteral,
  isObjectLiteralExpression,
  isPropertyAccessExpression,
  isPropertyAssignment,
  isPropertySignature,
  isSetAccessorDeclaration,
  isShorthandPropertyAssignment,
  isSpreadAssignment,
  isStringLiteral,
  isTypeAliasDeclaration,
  isTypeLiteralNode,
  isVariableDeclaration,
  type CallExpression,
  type InterfaceDeclaration,
  type Node,
  type ObjectLiteralElementLike,
  type PropertyName,
  type SourceFile,
  type TypeElement,
  type TypeLiteralNode,
} from 'typescript';

import type { SchemaShapeKind, SchemaShapeUnsupportedReason } from './file-vocabulary.js';

export { SCHEMA_SHAPE_UNSUPPORTED_REASONS as UNSUPPORTED_REASONS } from './file-vocabulary.js';

export interface ShapeObservation {
  readonly kind: SchemaShapeKind;
  readonly node: Node;
  readonly name: string | null;
  readonly propertyNames: Set<string>;
  readonly unsupportedReasons: Set<SchemaShapeUnsupportedReason>;
}

export function observationForNode(
  node: Node,
  sourceFile: SourceFile,
): ShapeObservation | undefined {
  if (isInterfaceDeclaration(node)) {
    return interfaceObservation(node, sourceFile);
  }
  if (isTypeLiteralNode(node)) {
    return typeLiteralObservation(node, sourceFile);
  }
  if (isZodObjectCall(node)) {
    return zodObjectObservation(node, sourceFile);
  }
  return undefined;
}

function interfaceObservation(
  node: InterfaceDeclaration,
  sourceFile: SourceFile,
): ShapeObservation {
  const observation = newObservation('interface', node, node.name.text);
  if (node.heritageClauses !== undefined && node.heritageClauses.length > 0) {
    observation.unsupportedReasons.add('interface-heritage');
  }
  collectTypeMembers(node.members, observation, sourceFile);
  return observation;
}

function typeLiteralObservation(node: TypeLiteralNode, sourceFile: SourceFile): ShapeObservation {
  const parent = node.parent;
  const name = isTypeAliasDeclaration(parent) && parent.type === node ? parent.name.text : null;
  const observation = newObservation('type-literal', node, name);
  collectTypeMembers(node.members, observation, sourceFile);
  return observation;
}

function zodObjectObservation(node: CallExpression, sourceFile: SourceFile): ShapeObservation {
  const observation = newObservation('zod-object', node, directVariableName(node));
  if (node.arguments.length !== 1) {
    observation.unsupportedReasons.add('zod-argument-count');
    return observation;
  }
  const [argument] = node.arguments;
  if (argument === undefined || !isObjectLiteralExpression(argument)) {
    observation.unsupportedReasons.add('zod-non-object-argument');
    return observation;
  }
  collectObjectMembers(argument.properties, observation, sourceFile);
  return observation;
}

function newObservation(kind: SchemaShapeKind, node: Node, name: string | null): ShapeObservation {
  return {
    kind,
    node,
    name,
    propertyNames: new Set<string>(),
    unsupportedReasons: new Set<SchemaShapeUnsupportedReason>(),
  };
}

function collectTypeMembers(
  members: readonly TypeElement[],
  observation: ShapeObservation,
  sourceFile: SourceFile,
): void {
  for (const member of members) {
    if (isPropertySignature(member) || isMethodSignature(member)) {
      collectPropertyName(member.name, observation, sourceFile);
    } else {
      observation.unsupportedReasons.add(typeMemberReason(member));
    }
  }
}

function typeMemberReason(member: TypeElement): SchemaShapeUnsupportedReason {
  if (isIndexSignatureDeclaration(member)) {
    return 'index-signature';
  }
  if (isCallSignatureDeclaration(member)) {
    return 'call-signature';
  }
  if (isConstructSignatureDeclaration(member)) {
    return 'construct-signature';
  }
  return 'unsupported-member-kind';
}

function collectObjectMembers(
  members: readonly ObjectLiteralElementLike[],
  observation: ShapeObservation,
  sourceFile: SourceFile,
): void {
  for (const member of members) {
    if (isSpreadAssignment(member)) {
      observation.unsupportedReasons.add('spread-assignment');
      continue;
    }
    const name = supportedObjectMemberName(member);
    if (name === undefined) {
      observation.unsupportedReasons.add('unsupported-member-kind');
    } else {
      collectPropertyName(name, observation, sourceFile);
    }
  }
}

function supportedObjectMemberName(node: ObjectLiteralElementLike): PropertyName | undefined {
  if (isPropertyAssignment(node)) {
    return node.name;
  }
  if (isShorthandPropertyAssignment(node)) {
    return node.name;
  }
  if (isMethodDeclaration(node)) {
    return node.name;
  }
  if (isGetAccessorDeclaration(node)) {
    return node.name;
  }
  return isSetAccessorDeclaration(node) ? node.name : undefined;
}

function collectPropertyName(
  name: PropertyName,
  observation: ShapeObservation,
  sourceFile: SourceFile,
): void {
  if (isComputedPropertyName(name)) {
    observation.unsupportedReasons.add('computed-property-name');
    const computedName = staticComputedName(name.expression, sourceFile);
    if (computedName !== undefined) {
      observation.propertyNames.add(computedName);
    }
    return;
  }
  const propertyName = staticPropertyName(name, sourceFile);
  if (propertyName === undefined) {
    observation.unsupportedReasons.add('unsupported-member-kind');
  } else {
    observation.propertyNames.add(propertyName);
  }
}

function staticPropertyName(name: PropertyName, sourceFile: SourceFile): string | undefined {
  if (isIdentifier(name) || isStringLiteral(name)) {
    return name.text;
  }
  return isNumericLiteral(name) ? name.getText(sourceFile) : undefined;
}

function staticComputedName(node: Node, sourceFile: SourceFile): string | undefined {
  if (isStringLiteral(node) || isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  return isNumericLiteral(node) ? node.getText(sourceFile) : undefined;
}

function isZodObjectCall(node: Node): node is CallExpression {
  if (!isCallExpression(node) || node.questionDotToken !== undefined) {
    return false;
  }
  const expression = node.expression;
  if (!isPropertyAccessExpression(expression) || expression.questionDotToken !== undefined) {
    return false;
  }
  if (!isIdentifier(expression.expression)) {
    return false;
  }
  return expression.expression.text === 'z' && expression.name.text === 'object';
}

function directVariableName(node: CallExpression): string | null {
  const parent = node.parent;
  return isVariableDeclaration(parent) && parent.initializer === node && isIdentifier(parent.name)
    ? parent.name.text
    : null;
}
