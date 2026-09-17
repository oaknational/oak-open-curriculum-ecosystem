import { err, ok, type Result } from '@oaknational/result';
import {
  SyntaxKind,
  canHaveModifiers,
  getModifiers,
  isExportAssignment,
  isExportDeclaration,
  type SourceFile,
} from 'typescript';

import type { RoleRule, RoleSelectorRule } from './config-classification-model.js';
import { EstateReviewError } from './errors.js';
import { ROLE_VALUES, type FileRole, type Provenance } from './file-vocabulary.js';
import type { NonEmptyReadonlyArray, RepoPath } from './scalar-model.js';
import { compareUtf16 } from './utf16-order.js';

export interface RoleClassificationInput {
  readonly path: RepoPath;
  readonly provenance: Provenance;
  /** Parsed source, including parsed-with-diagnostics, or null when unreadable. */
  readonly sourceFile: SourceFile | null;
}

export interface RoleClassifier {
  classify(input: RoleClassificationInput): NonEmptyReadonlyArray<FileRole>;
}

interface CompiledSelectorRule {
  readonly role: RoleSelectorRule['role'];
  readonly pathRegexes: readonly RegExp[];
  readonly provenanceValues: ReadonlySet<Provenance> | undefined;
  readonly sourcePredicates: ReadonlySet<'contains-export-declaration'> | undefined;
}

/** Validate and compile every frozen role selector once. */
export function createRoleClassifier(
  rules: readonly RoleRule[],
): Result<RoleClassifier, EstateReviewError> {
  const compiled = compileRules(rules);
  if (compiled instanceof EstateReviewError) {
    return err(compiled);
  }
  return ok({
    classify(input) {
      const roles: FileRole[] = compiled
        .filter((rule) => selectorMatches(rule, input))
        .map(({ role }) => role);
      const fallback: FileRole = input.sourceFile === null ? 'unknown' : 'implementation-source';
      return sortedRoleOutput(roles, fallback);
    },
  });
}

function compileRules(
  rules: readonly RoleRule[],
): readonly CompiledSelectorRule[] | EstateReviewError {
  const roles = new Set<FileRole>();
  const compiled: CompiledSelectorRule[] = [];

  for (const rule of rules) {
    if (roles.has(rule.role)) {
      return configInvalid(`role '${rule.role}' is configured more than once`);
    }
    roles.add(rule.role);
    if ('fallback' in rule) {
      continue;
    }
    const selector = compileSelector(rule);
    if (selector instanceof EstateReviewError) {
      return selector;
    }
    compiled.push(selector);
  }

  const missing = ROLE_VALUES.find((role) => !roles.has(role));
  return missing === undefined
    ? compiled
    : configInvalid(`role '${missing}' does not have exactly one configured rule`);
}

function compileSelector(rule: RoleSelectorRule): CompiledSelectorRule | EstateReviewError {
  const pathRegexes = compilePathRegexes(rule);
  if (pathRegexes instanceof EstateReviewError) {
    return pathRegexes;
  }
  return {
    role: rule.role,
    pathRegexes,
    provenanceValues: optionalSet(rule.provenanceValues),
    sourcePredicates: optionalSet(rule.sourcePredicates),
  };
}

function compilePathRegexes(rule: RoleSelectorRule): readonly RegExp[] | EstateReviewError {
  try {
    return (rule.pathRegexes ?? []).map((source) => new RegExp(source, 'u'));
  } catch (cause: unknown) {
    return new EstateReviewError(
      'CONFIG_INVALID',
      `role '${rule.role}' has an invalid path regex`,
      {
        cause,
      },
    );
  }
}

function optionalSet<T>(values: readonly T[] | undefined): ReadonlySet<T> | undefined {
  return values === undefined ? undefined : new Set(values);
}

function selectorMatches(rule: CompiledSelectorRule, input: RoleClassificationInput): boolean {
  const pathMatches =
    rule.pathRegexes.length === 0 || rule.pathRegexes.some((pattern) => pattern.test(input.path));
  const provenanceMatches =
    rule.provenanceValues === undefined || rule.provenanceValues.has(input.provenance);
  const sourceFile = input.sourceFile;
  const sourceMatches =
    rule.sourcePredicates === undefined ||
    (sourceFile !== null &&
      [...rule.sourcePredicates].some((predicate) =>
        sourcePredicateMatches(predicate, sourceFile),
      ));
  return pathMatches && provenanceMatches && sourceMatches;
}

function sortedRoleOutput(
  roles: readonly FileRole[],
  fallback: FileRole,
): NonEmptyReadonlyArray<FileRole> {
  const sorted = [...new Set(roles.length === 0 ? [fallback] : roles)].sort(compareUtf16);
  const [first, ...remaining] = sorted;
  return first === undefined ? [fallback] : [first, ...remaining];
}

function sourcePredicateMatches(
  predicate: 'contains-export-declaration',
  sourceFile: SourceFile,
): boolean {
  return predicate === 'contains-export-declaration' && containsTopLevelExport(sourceFile);
}

function containsTopLevelExport(sourceFile: SourceFile): boolean {
  return sourceFile.statements.some((statement) => {
    if (isExportDeclaration(statement) || isExportAssignment(statement)) {
      return true;
    }
    if (!canHaveModifiers(statement)) {
      return false;
    }
    return (getModifiers(statement) ?? []).some(
      ({ kind }) => kind === SyntaxKind.ExportKeyword || kind === SyntaxKind.DefaultKeyword,
    );
  });
}

function configInvalid(message: string): EstateReviewError {
  return new EstateReviewError('CONFIG_INVALID', message);
}
