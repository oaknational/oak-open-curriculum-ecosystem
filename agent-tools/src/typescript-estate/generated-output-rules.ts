import { err, ok, type Result } from '@oaknational/result';

import type { GeneratedOutputRule } from './config-classification-model.js';
import { EstateReviewError } from './errors.js';
import type { TrackedTreeEntry } from './git-snapshot-model.js';
import type { NonEmptyReadonlyArray, RepoPath } from './scalar-model.js';
import { compareUtf16 } from './utf16-order.js';

const RULE_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const REGULAR_MODES = new Set(['100644', '100755']);

/**
 * Validate the frozen generator-lineage rules against the complete pinned tree.
 *
 * Returned rules are defensive copies whose producer evidence is in canonical
 * UTF-16 order. No source content is read at this boundary.
 */
export function preflightGeneratedOutputRules(
  rules: readonly GeneratedOutputRule[],
  treeEntries: readonly TrackedTreeEntry[],
): Result<readonly GeneratedOutputRule[], EstateReviewError> {
  const ids = new Set<string>();
  const treeByPath = new Map(treeEntries.map((entry) => [entry.path, entry.treeEntry]));
  const prepared: GeneratedOutputRule[] = [];

  for (const rule of rules) {
    const invalid = validateRule(rule, ids, treeByPath);
    if (invalid !== undefined) {
      return err(invalid);
    }
    ids.add(rule.id);
    prepared.push({
      id: rule.id,
      pathPrefix: rule.pathPrefix,
      producerEvidence: sortedEvidence(rule.producerEvidence),
    });
  }

  const overlap = findOverlappingPrefixes(prepared);
  return overlap === undefined
    ? ok(prepared)
    : err(
        configInvalid(
          `generated-output prefixes '${overlap[0]}' and '${overlap[1]}' are equal or nested`,
        ),
      );
}

/** Find the sole preflighted rule whose exact prefix contains the path. */
export function findGeneratedOutputRule(
  rules: readonly GeneratedOutputRule[],
  path: RepoPath,
): GeneratedOutputRule | undefined {
  return rules.find((rule) => path.startsWith(rule.pathPrefix));
}

function validateRule(
  rule: GeneratedOutputRule,
  ids: ReadonlySet<string>,
  treeByPath: ReadonlyMap<RepoPath, TrackedTreeEntry['treeEntry']>,
): EstateReviewError | undefined {
  const identityError = validateRuleIdentity(rule, ids);
  if (identityError !== undefined) {
    return identityError;
  }
  return validateEvidence(rule, treeByPath);
}

function validateRuleIdentity(
  rule: GeneratedOutputRule,
  ids: ReadonlySet<string>,
): EstateReviewError | undefined {
  if (!RULE_ID.test(rule.id) || ids.has(rule.id)) {
    return configInvalid(`generated-output rule id '${rule.id}' is malformed or duplicated`);
  }
  if (!isNormalisedPrefix(rule.pathPrefix)) {
    return configInvalid(`generated-output prefix '${rule.pathPrefix}' is not normalised`);
  }
  return undefined;
}

function validateEvidence(
  rule: GeneratedOutputRule,
  treeByPath: ReadonlyMap<RepoPath, TrackedTreeEntry['treeEntry']>,
): EstateReviewError | undefined {
  if (rule.producerEvidence.length === 0) {
    return configInvalid(`generated-output rule '${rule.id}' has no producer evidence`);
  }

  const evidence = new Set<RepoPath>();
  for (const path of rule.producerEvidence) {
    const invalid = validateEvidencePath(rule.id, path, evidence, treeByPath);
    if (invalid !== undefined) {
      return invalid;
    }
    evidence.add(path);
  }
  return undefined;
}

function validateEvidencePath(
  ruleId: string,
  path: RepoPath,
  seen: ReadonlySet<RepoPath>,
  treeByPath: ReadonlyMap<RepoPath, TrackedTreeEntry['treeEntry']>,
): EstateReviewError | undefined {
  if (!isNormalisedFilePath(path) || seen.has(path)) {
    return configInvalid(
      `generated-output rule '${ruleId}' has malformed or duplicate evidence '${path}'`,
    );
  }
  return isRegularTreeEntry(treeByPath.get(path))
    ? undefined
    : configInvalid(`generated-output rule '${ruleId}' evidence '${path}' is absent or nonregular`);
}

function isRegularTreeEntry(entry: TrackedTreeEntry['treeEntry'] | undefined): boolean {
  return entry?.type === 'blob' && REGULAR_MODES.has(entry.mode) && entry.size !== null;
}

function findOverlappingPrefixes(
  rules: readonly GeneratedOutputRule[],
): readonly [RepoPath, RepoPath] | undefined {
  for (const [index, leftRule] of rules.entries()) {
    for (const rightRule of rules.slice(index + 1)) {
      if (prefixesOverlap(leftRule.pathPrefix, rightRule.pathPrefix)) {
        return [leftRule.pathPrefix, rightRule.pathPrefix];
      }
    }
  }
  return undefined;
}

function prefixesOverlap(left: RepoPath, right: RepoPath): boolean {
  return left.startsWith(right) || right.startsWith(left);
}

function sortedEvidence(values: NonEmptyReadonlyArray<RepoPath>): NonEmptyReadonlyArray<RepoPath> {
  const [first, ...remaining] = values;
  const sorted: [RepoPath, ...RepoPath[]] = [first, ...remaining];
  sorted.sort(compareUtf16);
  return sorted;
}

function isNormalisedPrefix(path: string): path is RepoPath {
  return path.endsWith('/') && isNormalisedSegments(path.slice(0, -1));
}

function isNormalisedFilePath(path: string): path is RepoPath {
  return !path.endsWith('/') && isNormalisedSegments(path);
}

function isNormalisedSegments(path: string): boolean {
  if (path.length === 0 || path.startsWith('/') || path.includes('\\') || path.includes('\0')) {
    return false;
  }
  return path.split('/').every((segment) => segment !== '' && segment !== '.' && segment !== '..');
}

function configInvalid(message: string): EstateReviewError {
  return new EstateReviewError('CONFIG_INVALID', message);
}
