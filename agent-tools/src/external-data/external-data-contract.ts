import {
  canHaveModifiers,
  createSourceFile,
  forEachChild,
  getModifiers,
  isIdentifier,
  isVariableStatement,
  ScriptKind,
  ScriptTarget,
  SyntaxKind,
  type BindingName,
  type Node,
  type SourceFile,
  type TypeNode,
  type VariableStatement,
} from 'typescript';

import { classifyLogicNode, containsLogicNode, type LogicKind } from './external-data-logic.js';

/**
 * Contract enforcement for the `*.external-data.ts` file convention (pure AST).
 *
 * The suffix excludes the **whole file** from Sonar's duplication detector (see
 * `docs/governance/sonar-disposition-policy.md` §Duplications) and from ESLint
 * code-quality rules. This module is the anti-abuse contract that keeps that
 * exclusion safe: a snapshot MUST export its data typed `unknown`, MUST carry a
 * provenance docstring, and MUST contain **no runtime logic anywhere** — no
 * function, class, enum, namespace/module, accessor, `import = require`,
 * `export default` / `export =`, or value re-export, whether exported or not,
 * top-level or nested inside the data literal (see `./external-data-logic.ts`).
 *
 * The invariant is deliberately **file-wide**, not export-scoped: because the
 * exclusion is file-level, any runtime logic in the file — including a
 * non-exported helper or a function-valued property nested in the data object —
 * ships its (duplicable) body past the gate. A faithful external snapshot is
 * serialisable data and carries no logic, so the file-wide rule has no
 * false-positive cost on a genuine snapshot. It is a tripwire against the common
 * mistake, not a guarantee against a committer who also edits this validator or
 * the Sonar config; that adversary cannot be stopped by any in-repo check.
 *
 * @packageDocumentation
 */

/** A specific clause of the external-data contract that a file can violate. */
type ExternalDataRule =
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

function hasDeclareModifier(node: Node): boolean {
  if (!canHaveModifiers(node)) {
    return false;
  }
  return (
    getModifiers(node)?.some((modifier) => modifier.kind === SyntaxKind.DeclareKeyword) ?? false
  );
}

function lineOf(source: SourceFile, node: Node): number {
  return source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
}

function declarationName(name: BindingName, source: SourceFile): string {
  return isIdentifier(name) ? name.text : name.getText(source);
}

function logicViolation(
  filePath: string,
  source: SourceFile,
  node: Node,
  kind: LogicKind,
): ExternalDataViolation {
  const named = kind.name === undefined ? '' : ` \`${kind.name}\``;
  return {
    path: filePath,
    rule: 'logic-export-forbidden',
    detail: `Runtime logic (${kind.label})${named} is forbidden in a \`*.external-data.ts\` file. The whole file is excluded from duplication and code-quality gates, so it must contain only data — move executable logic to a normal, checked source module.`,
    line: lineOf(source, node),
  };
}

/**
 * Walk the whole file and report every forbidden runtime-logic construct,
 * anywhere — top-level or nested, exported or not. Flagged nodes are not
 * descended into, so a class or namespace yields one violation, not one per
 * member.
 */
function collectLogicViolations(filePath: string, source: SourceFile): ExternalDataViolation[] {
  const violations: ExternalDataViolation[] = [];
  const visit = (node: Node): void => {
    // Ambient (`declare …`) constructs carry no runtime — they erase at emit and
    // cannot bypass the duplication gate — so skip the whole ambient subtree.
    if (hasDeclareModifier(node)) {
      return;
    }
    const kind = classifyLogicNode(node);
    if (kind !== undefined) {
      violations.push(logicViolation(filePath, source, node, kind));
      return;
    }
    forEachChild(node, visit);
  };
  forEachChild(source, visit);
  return violations;
}

/**
 * Validate an exported `const` statement's data bindings, returning whether a
 * compliant `: unknown` data export was seen. Logic-bearing initialisers are
 * left to {@link collectLogicViolations}; they are not data and are skipped here
 * to avoid double-reporting.
 */
function inspectVariableStatement(
  filePath: string,
  source: SourceFile,
  statement: VariableStatement,
  violations: ExternalDataViolation[],
): boolean {
  let dataExportSeen = false;
  for (const declaration of statement.declarationList.declarations) {
    const initializer = declaration.initializer;
    if (initializer !== undefined && containsLogicNode(initializer)) {
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

  for (const violation of collectLogicViolations(file.path, source)) {
    violations.push(violation);
  }

  let dataExportSeen = false;
  for (const statement of source.statements) {
    if (isVariableStatement(statement) && isExported(statement)) {
      if (inspectVariableStatement(file.path, source, statement, violations)) {
        dataExportSeen = true;
      }
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
