import { err, ok, type Result } from '@oaknational/result';
import { typeSafeEntries } from '@oaknational/type-helpers';
import {
  SyntaxKind,
  forEachChild,
  isCallExpression,
  isIdentifier,
  isNewExpression,
  isPropertyAccessExpression,
  isTypeReferenceNode,
  type Node,
  type SourceFile,
} from 'typescript';

import type { AlgorithmDefinition, DataStructureDefinition } from './config-analysis-model.js';
import type { ConstructCount } from './analysis-model.js';
import { EstateReviewError } from './errors.js';
import { compareUtf16 } from './utf16-order.js';

export interface ConstructCountingConfig {
  readonly runtimeValueStructures: readonly DataStructureDefinition[];
  readonly typeModelStructures: readonly DataStructureDefinition[];
  readonly algorithms: readonly AlgorithmDefinition[];
}

interface CompiledDefinition {
  readonly id: string;
  readonly kinds: ReadonlySet<number>;
  readonly namedReferences: ReadonlySet<string>;
  readonly callNames: ReadonlySet<string>;
}

interface DefinitionToCompile {
  readonly id: string;
  readonly astKinds: readonly string[];
  readonly namedReferences: readonly string[];
  readonly callNames: readonly string[];
}

const SYNTAX_KINDS_BY_NAME = syntaxKindsByName();

/** Count the frozen syntax-level construct universe for one parsed source file. */
export function countConstructs(
  sourceFile: SourceFile,
  config: ConstructCountingConfig,
): Result<readonly ConstructCount[], EstateReviewError> {
  const compiled = compileDefinitions(config);
  if (compiled instanceof EstateReviewError) {
    return err(compiled);
  }

  const counts = new Map(compiled.map((definition) => [definition.id, 0]));
  const visit = (node: Node): void => {
    for (const definition of compiled) {
      if (matchesDefinition(node, definition)) {
        counts.set(definition.id, (counts.get(definition.id) ?? 0) + 1);
      }
    }
    forEachChild(node, visit);
  };
  visit(sourceFile);

  return ok(
    compiled.map(({ id }) => ({
      id,
      count: counts.get(id) ?? 0,
    })),
  );
}

function compileDefinitions(
  config: ConstructCountingConfig,
): readonly CompiledDefinition[] | EstateReviewError {
  const definitions = definitionsToCompile(config);
  const ids = new Set<string>();
  const compiled: CompiledDefinition[] = [];

  for (const definition of definitions) {
    if (ids.has(definition.id)) {
      return new EstateReviewError(
        'VALIDATION_FAILED',
        `construct id '${definition.id}' is configured more than once`,
      );
    }
    ids.add(definition.id);

    const kinds = new Set<number>();
    for (const kindName of definition.astKinds) {
      const kind = SYNTAX_KINDS_BY_NAME.get(kindName);
      if (kind === undefined) {
        return new EstateReviewError(
          'VALIDATION_FAILED',
          `construct '${definition.id}' names unknown SyntaxKind '${kindName}'`,
        );
      }
      kinds.add(kind);
    }
    compiled.push({
      id: definition.id,
      kinds,
      namedReferences: new Set(definition.namedReferences),
      callNames: new Set(definition.callNames),
    });
  }
  return compiled;
}

function definitionsToCompile(config: ConstructCountingConfig): readonly DefinitionToCompile[] {
  const definitions: DefinitionToCompile[] = [];
  for (const definition of [...config.algorithms].sort(compareDefinitionIds)) {
    definitions.push({ ...definition, namedReferences: [] });
  }
  for (const definition of [...config.runtimeValueStructures].sort(compareDefinitionIds)) {
    definitions.push({ ...definition, callNames: [] });
  }
  for (const definition of [...config.typeModelStructures].sort(compareDefinitionIds)) {
    definitions.push({ ...definition, callNames: [] });
  }
  return definitions;
}

function compareDefinitionIds(
  left: DataStructureDefinition | AlgorithmDefinition,
  right: DataStructureDefinition | AlgorithmDefinition,
): number {
  return compareUtf16(left.id, right.id);
}

function syntaxKindsByName(): ReadonlyMap<string, number> {
  const kinds = new Map<string, number>();
  for (const [name, value] of typeSafeEntries(SyntaxKind)) {
    if (typeof value === 'number') {
      kinds.set(name, value);
    }
  }
  return kinds;
}

function matchesDefinition(node: Node, definition: CompiledDefinition): boolean {
  const kindMatches = definition.kinds.has(node.kind);
  const referenceMatches =
    definition.namedReferences.size > 0 &&
    kindMatches &&
    matchesNamedReference(node, definition.namedReferences);
  const syntaxMatches = kindMatches && definition.namedReferences.size === 0;
  const callMatches =
    definition.callNames.size > 0 &&
    isCallExpression(node) &&
    matchesTerminalCallName(node.expression, definition.callNames);

  return syntaxMatches || referenceMatches || callMatches;
}

function matchesNamedReference(node: Node, names: ReadonlySet<string>): boolean {
  if (isTypeReferenceNode(node)) {
    return isIdentifier(node.typeName) && names.has(node.typeName.text);
  }
  if (isNewExpression(node)) {
    return isIdentifier(node.expression) && names.has(node.expression.text);
  }
  if (isCallExpression(node)) {
    if (node.questionDotToken !== undefined) {
      return false;
    }
    const name = propertyAccessName(node.expression);
    return name !== undefined && names.has(name);
  }
  return false;
}

function matchesTerminalCallName(node: Node, names: ReadonlySet<string>): boolean {
  if (isIdentifier(node)) {
    return names.has(node.text);
  }
  return isPropertyAccessExpression(node) && names.has(node.name.text);
}

function propertyAccessName(node: Node): string | undefined {
  if (!isPropertyAccessExpression(node) || node.questionDotToken !== undefined) {
    return undefined;
  }
  if (!isIdentifier(node.expression)) {
    return undefined;
  }
  return `${node.expression.text}.${node.name.text}`;
}
