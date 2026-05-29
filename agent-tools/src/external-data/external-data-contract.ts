import {
  canHaveModifiers,
  createSourceFile,
  getModifiers,
  isArrowFunction,
  isClassDeclaration,
  isClassExpression,
  isEnumDeclaration,
  isExportAssignment,
  isFunctionDeclaration,
  isFunctionExpression,
  isIdentifier,
  isVariableStatement,
  ScriptKind,
  ScriptTarget,
  SyntaxKind,
  type BindingName,
  type Expression,
  type Node,
  type SourceFile,
  type Statement,
  type TypeNode,
  type VariableStatement,
} from 'typescript';

/**
 * Contract enforcement for the `*.external-data.ts` file convention (pure AST).
 *
 * The suffix excludes a file from Sonar's duplication detector (see
 * `docs/governance/sonar-disposition-policy.md` §Duplications); this module is
 * the anti-abuse contract: a snapshot MUST export its data typed `unknown`, MUST
 * carry a provenance docstring, and MUST NOT export logic (function/class/enum).
 *
 * @packageDocumentation
 */

/** A specific clause of the external-data contract that a file can violate. */
export type ExternalDataRule =
  | 'missing-provenance-docstring'
  | 'no-unknown-data-export'
  | 'data-export-must-be-unknown'
  | 'logic-export-forbidden';

/** A single contract violation found in one `*.external-data.ts` file. */
export interface ExternalDataViolation {
  readonly path: string;
  readonly rule: ExternalDataRule;
  readonly detail: string;
  /** 1-based line number of the offending node, when one is locatable. */
  readonly line?: number;
}

/** An in-memory file fed to {@link findExternalDataViolations}. */
export interface ScannedFile {
  readonly path: string;
  readonly content: string;
}

/**
 * Whether the source carries a block comment documenting provenance (restricted
 * to block comments so a string-literal occurrence in the data does not count).
 */
export function hasProvenanceDocstring(content: string): boolean {
  const blockComments = content.match(/\/\*[\s\S]*?\*\//g) ?? [];
  return blockComments.some((comment) => /provenance/i.test(comment));
}

function isExported(node: Node): boolean {
  if (!canHaveModifiers(node)) {
    return false;
  }
  return (
    getModifiers(node)?.some((modifier) => modifier.kind === SyntaxKind.ExportKeyword) ?? false
  );
}

function isUnknownType(typeNode: TypeNode | undefined): boolean {
  return typeNode !== undefined && typeNode.kind === SyntaxKind.UnknownKeyword;
}

function isFunctionLike(node: Expression): boolean {
  return isArrowFunction(node) || isFunctionExpression(node) || isClassExpression(node);
}

function lineOf(source: SourceFile, node: Node): number {
  return source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
}

function declarationName(name: BindingName, source: SourceFile): string {
  return isIdentifier(name) ? name.text : name.getText(source);
}

interface ExportedLogic {
  readonly kind: string;
  readonly name?: string;
  readonly node: Node;
}

function exportedDeclarationLogic(statement: Statement): ExportedLogic | undefined {
  if (!isExported(statement)) {
    return undefined;
  }
  if (isFunctionDeclaration(statement)) {
    return { kind: 'function', name: statement.name?.text, node: statement };
  }
  if (isClassDeclaration(statement)) {
    return { kind: 'class', name: statement.name?.text, node: statement };
  }
  if (isEnumDeclaration(statement)) {
    return { kind: 'enum', name: statement.name.text, node: statement };
  }
  return undefined;
}

function exportedLogic(statement: Statement): ExportedLogic | undefined {
  const declaration = exportedDeclarationLogic(statement);
  if (declaration !== undefined) {
    return declaration;
  }
  if (isExportAssignment(statement) && isFunctionLike(statement.expression)) {
    return { kind: 'default', node: statement };
  }
  return undefined;
}

function logicViolation(
  filePath: string,
  source: SourceFile,
  logic: ExportedLogic,
): ExternalDataViolation {
  const named = logic.name === undefined ? '' : ` \`${logic.name}\``;
  return {
    path: filePath,
    rule: 'logic-export-forbidden',
    detail: `Exported ${logic.kind}${named} is logic. An external-data file must export only data; move executable logic to a normal, checked source module.`,
    line: lineOf(source, logic.node),
  };
}

function inspectVariableStatement(
  filePath: string,
  source: SourceFile,
  statement: VariableStatement,
  violations: ExternalDataViolation[],
): boolean {
  let dataExportSeen = false;
  for (const declaration of statement.declarationList.declarations) {
    const initializer = declaration.initializer;
    if (initializer !== undefined && isFunctionLike(initializer)) {
      violations.push(
        logicViolation(filePath, source, {
          kind: 'function',
          name: declarationName(declaration.name, source),
          node: declaration,
        }),
      );
      continue;
    }
    dataExportSeen = true;
    if (isUnknownType(declaration.type)) {
      continue;
    }
    const found =
      declaration.type === undefined
        ? 'no type annotation'
        : `\`: ${declaration.type.getText(source)}\``;
    violations.push({
      path: filePath,
      rule: 'data-export-must-be-unknown',
      detail: `Exported data binding \`${declarationName(declaration.name, source)}\` must be typed \`: unknown\` so it is validated at a loader boundary; found ${found}.`,
      line: lineOf(source, declaration),
    });
  }
  return dataExportSeen;
}

function inspectStatement(
  filePath: string,
  source: SourceFile,
  statement: Statement,
  violations: ExternalDataViolation[],
): boolean {
  const logic = exportedLogic(statement);
  if (logic !== undefined) {
    violations.push(logicViolation(filePath, source, logic));
    return false;
  }
  if (isVariableStatement(statement) && isExported(statement)) {
    return inspectVariableStatement(filePath, source, statement, violations);
  }
  return false;
}

function inspectFile(file: ScannedFile): ExternalDataViolation[] {
  const violations: ExternalDataViolation[] = [];
  const source = createSourceFile(
    file.path,
    file.content,
    ScriptTarget.Latest,
    /* setParentNodes */ true,
    ScriptKind.TS,
  );

  if (!hasProvenanceDocstring(file.content)) {
    violations.push({
      path: file.path,
      rule: 'missing-provenance-docstring',
      detail:
        'No block comment documenting provenance was found. An external-data file must document the source of its snapshot.',
    });
  }

  let dataExportSeen = false;
  for (const statement of source.statements) {
    if (inspectStatement(file.path, source, statement, violations)) {
      dataExportSeen = true;
    }
  }

  if (!dataExportSeen) {
    violations.push({
      path: file.path,
      rule: 'no-unknown-data-export',
      detail:
        'No exported `: unknown` data binding found. An external-data file must export its snapshot data typed `unknown`.',
    });
  }

  return violations;
}

/**
 * Check each `*.external-data.ts` file's content against the contract; returns
 * every violation in file then declaration order, empty when all comply.
 */
export function findExternalDataViolations(
  files: readonly ScannedFile[],
): readonly ExternalDataViolation[] {
  return files.flatMap((file) => inspectFile(file));
}

/** Render violations as an indented, one-per-line report block. */
export function formatExternalDataViolations(violations: readonly ExternalDataViolation[]): string {
  return violations
    .map(
      (violation) =>
        `  ${violation.path}${violation.line === undefined ? '' : `:${violation.line}`}  [${violation.rule}] ${violation.detail}`,
    )
    .join('\n');
}
