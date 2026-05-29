import {
  forEachChild,
  isArrowFunction,
  isClassDeclaration,
  isClassExpression,
  isConstructorDeclaration,
  isEnumDeclaration,
  isExportAssignment,
  isExportDeclaration,
  isFunctionDeclaration,
  isFunctionExpression,
  isGetAccessorDeclaration,
  isIdentifier,
  isImportEqualsDeclaration,
  isMethodDeclaration,
  isModuleDeclaration,
  isNamespaceExport,
  isSetAccessorDeclaration,
  type ExportDeclaration,
  type ModuleName,
  type Node,
  type PropertyName,
} from 'typescript';

/**
 * AST classification for the `*.external-data.ts` contract: what counts as
 * forbidden *runtime logic* in a file that is excluded from duplication and
 * code-quality gates. The contract module (`external-data-contract.ts`)
 * consumes this to report violations and to decide that a variable initialiser
 * is logic rather than data.
 *
 * Type-position constructs (function types, method signatures, `export type …`)
 * are intentionally NOT logic — they erase at emit and carry no runtime.
 *
 * @packageDocumentation
 */

/** A forbidden runtime-logic construct: a human label plus a name when present. */
export interface LogicKind {
  readonly label: string;
  readonly name?: string;
}

function memberName(name: PropertyName): string | undefined {
  return isIdentifier(name) ? name.text : undefined;
}

function moduleName(name: ModuleName): string | undefined {
  return isIdentifier(name) ? name.text : undefined;
}

/**
 * Whether an `export … from` declaration re-exports runtime values (forbidden)
 * rather than being a fully type-only re-export (allowed — types erase at emit).
 * `export { x } from`, `export * from`, and `export * as ns from` are value
 * re-exports; `export type { T } from` and an all-`type` named list are not.
 */
function isValueReexport(node: ExportDeclaration): boolean {
  if (node.moduleSpecifier === undefined || node.isTypeOnly) {
    return false;
  }
  const clause = node.exportClause;
  if (clause === undefined || isNamespaceExport(clause)) {
    return true;
  }
  return clause.elements.some((element) => !element.isTypeOnly);
}

function classifyCallable(node: Node): LogicKind | undefined {
  if (isFunctionDeclaration(node)) {
    return { label: 'function', name: node.name?.text };
  }
  if (isFunctionExpression(node)) {
    return { label: 'function expression', name: node.name?.text };
  }
  if (isArrowFunction(node)) {
    return { label: 'arrow function' };
  }
  return undefined;
}

function classifyMember(node: Node): LogicKind | undefined {
  if (isMethodDeclaration(node)) {
    return { label: 'method', name: memberName(node.name) };
  }
  if (isGetAccessorDeclaration(node) || isSetAccessorDeclaration(node)) {
    return { label: 'accessor', name: memberName(node.name) };
  }
  if (isConstructorDeclaration(node)) {
    return { label: 'constructor' };
  }
  return undefined;
}

function classifyDeclaration(node: Node): LogicKind | undefined {
  if (isClassDeclaration(node) || isClassExpression(node)) {
    return { label: 'class', name: node.name?.text };
  }
  if (isEnumDeclaration(node)) {
    return { label: 'enum', name: node.name.text };
  }
  if (isModuleDeclaration(node)) {
    return { label: 'namespace', name: moduleName(node.name) };
  }
  if (isImportEqualsDeclaration(node)) {
    return { label: '`import =` assignment', name: node.name.text };
  }
  return undefined;
}

function classifyModuleConstruct(node: Node): LogicKind | undefined {
  if (isExportAssignment(node)) {
    return { label: '`export default` / `export =`' };
  }
  if (isExportDeclaration(node) && isValueReexport(node)) {
    return { label: 'value re-export' };
  }
  return undefined;
}

/**
 * Classify a node as a forbidden runtime-logic construct, or `undefined` when it
 * is not logic.
 */
export function classifyLogicNode(node: Node): LogicKind | undefined {
  return (
    classifyCallable(node) ??
    classifyMember(node) ??
    classifyDeclaration(node) ??
    classifyModuleConstruct(node)
  );
}

/**
 * Whether any node in the subtree is a forbidden runtime-logic construct. Used
 * to decide that a variable initialiser is logic (e.g. an arrow, or a function
 * nested inside an object literal) rather than data.
 */
export function containsLogicNode(node: Node): boolean {
  if (classifyLogicNode(node) !== undefined) {
    return true;
  }
  let found = false;
  const visit = (child: Node): void => {
    if (found) {
      return;
    }
    if (classifyLogicNode(child) !== undefined) {
      found = true;
      return;
    }
    forEachChild(child, visit);
  };
  forEachChild(node, visit);
  return found;
}
