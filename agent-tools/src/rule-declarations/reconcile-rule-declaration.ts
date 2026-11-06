/**
 * Derive one rule declaration from the hand-kept sources, reconciling where they disagree.
 *
 * Three surfaces spoke for each rule before the declaration existed: the rules index row
 * (classification and trigger), the Cursor trigger (description, `alwaysApply`, globs) and
 * the Claude adapter (`paths`). Where they agree the declaration simply reads them. Where
 * they disagree, the most specific declaration wins (Director ruling, 2026-09-13):
 *
 * - a bare `alwaysApply: true` on a rule the index calls situational is less specific than
 *   the index's named trigger, so the index wins;
 * - hand-kept path scoping (Cursor globs, Claude paths) on a rule the index calls core is
 *   more specific than the index's bare column, so the rule becomes situational with a
 *   trigger derived from the globs and the globs kept;
 * - Cursor globs and Claude paths that disagree with each other are unioned.
 *
 * Every reconciliation is returned beside the declaration so it can be listed with both
 * prior values; nothing is reconciled silently. A Claude `paths` of `**\/*` names every file
 * and is read as no scoping at all.
 *
 * @packageDocumentation
 */

import type { RulesIndexRow } from './parse-rules-index.js';
import type { CursorTrigger } from './parse-cursor-trigger.js';
import type {
  CoreRuleDeclaration,
  RuleClassification,
  RuleDeclaration,
  SituationalRuleDeclaration,
} from './rule-declaration.js';

/** The three hand-kept sources for one rule. */
export interface RuleSources {
  readonly name: string;
  readonly index: RulesIndexRow;
  readonly cursor: CursorTrigger;
  readonly claudePaths: readonly string[];
}

/** One reconciliation: the rule, what disagreed, both prior values, and the outcome. */
export interface Reconciliation {
  readonly rule: string;
  /** The closed set of ways the sources can disagree, each with a fixed resolution. */
  readonly kind:
    | 'core-with-scope-becomes-situational'
    | 'always-apply-true-on-situational'
    | 'always-apply-false-on-core'
    | 'always-apply-absent'
    | 'claude-paths-and-cursor-globs-unioned';
  readonly indexClassification: RuleClassification;
  readonly indexTrigger: string | undefined;
  readonly cursorAlwaysApply: boolean | undefined;
  readonly cursorGlobs: readonly string[];
  readonly claudePaths: readonly string[];
  readonly outcome: string;
}

/** The declaration and every reconciliation made to reach it. */
export interface ReconciledRuleDeclaration {
  readonly declaration: RuleDeclaration;
  readonly reconciliations: readonly Reconciliation[];
}

const EVERY_FILE = '**/*';

/**
 * Reconcile the sources for one rule into its declaration.
 *
 * @param sources - The index row, Cursor trigger and Claude paths for the rule.
 * @returns The declaration and the list of reconciliations, empty when the sources agreed.
 */
export function reconcileRuleDeclaration(sources: RuleSources): ReconciledRuleDeclaration {
  const reconciliations: Reconciliation[] = [];
  const note = (kind: Reconciliation['kind'], outcome: string): void => {
    reconciliations.push({
      rule: sources.name,
      kind,
      indexClassification: sources.index.classification,
      indexTrigger: sources.index.classification === 'core' ? undefined : sources.index.trigger,
      cursorAlwaysApply: sources.cursor.alwaysApply,
      cursorGlobs: sources.cursor.globs,
      claudePaths: sources.claudePaths,
      outcome,
    });
  };
  const scope = unionScope(sources, note);
  const declaration = declare(sources, scope, note);
  noteAlwaysApply(sources, declaration.classification, note);
  return { declaration, reconciliations };
}

type Note = (kind: Reconciliation['kind'], outcome: string) => void;

function unionScope(sources: RuleSources, note: Note): readonly string[] {
  const claudeScope = isEveryFile(sources.claudePaths) ? [] : sources.claudePaths;
  const scope = [...sources.cursor.globs];
  for (const claudePath of claudeScope) {
    if (!scope.includes(claudePath)) {
      scope.push(claudePath);
    }
  }
  const differ =
    sources.cursor.globs.length > 0 &&
    claudeScope.length > 0 &&
    !sameMembers(sources.cursor.globs, claudeScope);
  if (differ) {
    note('claude-paths-and-cursor-globs-unioned', `globs unioned: ${scope.join(',')}`);
  }
  return scope;
}

function declare(sources: RuleSources, scope: readonly string[], note: Note): RuleDeclaration {
  const { index } = sources;
  if (index.classification === 'core' && scope.length > 0) {
    const trigger = `surface:${scope.join(',')}`;
    note('core-with-scope-becomes-situational', `situational; trigger ${trigger}; globs kept`);
    return declareSituational(sources, trigger, scope);
  }
  if (index.classification === 'core') {
    return declareCore(sources);
  }
  return declareSituational(sources, index.trigger, scope);
}

function declareCore(sources: RuleSources): CoreRuleDeclaration {
  return { name: sources.name, classification: 'core', description: sources.cursor.description };
}

function declareSituational(
  sources: RuleSources,
  trigger: string,
  globs: readonly string[],
): SituationalRuleDeclaration {
  return {
    name: sources.name,
    classification: 'situational',
    description: sources.cursor.description,
    trigger,
    globs,
  };
}

function noteAlwaysApply(
  sources: RuleSources,
  classification: RuleClassification,
  note: Note,
): void {
  const { alwaysApply } = sources.cursor;
  if (alwaysApply === undefined) {
    note(
      'always-apply-absent',
      `${classification}; the Cursor trigger gains an explicit alwaysApply`,
    );
  } else if (alwaysApply && classification === 'situational') {
    note(
      'always-apply-true-on-situational',
      'situational; the Cursor trigger becomes alwaysApply false',
    );
  } else if (!alwaysApply && classification === 'core') {
    note('always-apply-false-on-core', 'core; the Cursor trigger becomes alwaysApply true');
  }
}

function isEveryFile(paths: readonly string[]): boolean {
  return paths.length === 1 && paths[0] === EVERY_FILE;
}

function sameMembers(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((member) => right.includes(member));
}
