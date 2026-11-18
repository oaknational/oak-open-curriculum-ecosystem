/**
 * The sweep: derive every canonical rule's declaration from the hand-kept sources and write
 * it as the rule's frontmatter.
 *
 * Derivation is all-or-nothing: a rule name that is not a basename, an index row naming no
 * swept rule, a rule whose sources cannot be read or are missing, or a rule that has no index
 * row, refuses the whole sweep and nothing is written. Writing then proceeds file by file,
 * each write atomic (`sweep-fs.ts`), so an error part-way leaves whole rules written and the
 * rest untouched; git shows which, and a re-run finishes the rest because a rule that already
 * carries a frontmatter block is left as it is and reported, once its index row has been
 * read. A declared rule's projections are not read: they are generated outputs of
 * `portability:fix`, not sources (the #74 round-four finding, 2026-09-14; the reader has since
 * learned the block sequence the generated Claude adapter carries, which changes nothing here).
 * The same property lets the sweep run again for rules that arrive after the first pass. The
 * file system is an injected port so the sweep is proven over an in-memory tree.
 *
 * Every source is admitted by entry kind before it is read (`lstat` on the source path, so its
 * leaf entry is never followed; anything but a regular file refuses the sweep), and every write
 * targets a path the read admitted (the rule file itself, in place), so the read guard covers
 * the write path. The check-to-use window between them is accepted for a one-shot instrument
 * run by hand on a tracked tree; the fd-anchored reader in `skills-adapter-generate/` closes it.
 *
 * This is a transplant instrument as much as a one-off: any host that arrives with a
 * hand-kept rules index and hand-kept triggers runs the same sweep to mint its declarations.
 *
 * @packageDocumentation
 */

import path from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { FRONTMATTER_FENCE_LINE } from './frontmatter-lines.js';
import { parseRulesIndex, type RulesIndexRow } from './parse-rules-index.js';
import { readRuleDeclaration } from './read-rule-declaration.js';
import { reconcileRuleDeclaration, type Reconciliation } from './reconcile-rule-declaration.js';
import { prependRuleFrontmatter, renderRuleFrontmatter } from './render-rule-frontmatter.js';
import type { RuleDeclaration } from './rule-declaration.js';
import { refuseNonBasenames, refuseOrphanRows } from './rule-name.js';
import { readRuleProjections } from './rule-projections.js';
import { defaultSweepFs, readSource, type SweepFs } from './sweep-fs.js';

/** What to sweep. */
export interface SweepInput {
  /** Absolute path of the repository root. */
  readonly repoRoot: string;
  /**
   * Rule basenames without `.md`: every tracked file under `.agent/rules/`, which must be
   * exactly the set the rules index enumerates. Any other name shape, and any index row
   * naming no rule in this set, refuses the whole sweep before a rule path is built
   * (`rule-name.ts`).
   */
  readonly ruleNames: readonly string[];
  /** Write the blocks; `false` is a dry run that only reports. */
  readonly write: boolean;
}

/** What the sweep found and did. */
export interface SweepOutcome {
  readonly declarations: readonly RuleDeclaration[];
  readonly reconciliations: readonly Reconciliation[];
  /** Repo-relative rule files written, in order; empty on a dry run or a refusal. */
  readonly written: readonly string[];
  /** Repo-relative rule files left alone because they already carry a block. */
  readonly alreadyDeclared: readonly string[];
  /** Reasons the sweep refused; non-empty means nothing was written. */
  readonly refused: readonly string[];
}

const RULES_INDEX = 'RULES_INDEX.md';
const FRONTMATTER_OPENING = `${FRONTMATTER_FENCE_LINE}\n`;

/**
 * Run the sweep.
 *
 * @param input - The repository root, the rules to sweep, and whether to write.
 * @param sweepFs - File-system port; defaults to the real file system (`sweep-fs.ts`).
 * @returns The declarations, the reconciliations, what was written, and any refusals.
 */
export async function sweepRuleFrontmatter(
  input: SweepInput,
  sweepFs: SweepFs = defaultSweepFs,
): Promise<SweepOutcome> {
  const admitted = await admitSweep(input, sweepFs);
  if (!admitted.ok) {
    return refusal(admitted.error);
  }
  const derived = await deriveAll(input, admitted.value, sweepFs);
  if (derived.refused.length > 0 || !input.write) {
    return { ...derived, written: [] };
  }
  const written: string[] = [];
  for (const file of derived.files) {
    // POSIX joins throughout: every surface path is POSIX-relative, Node's fs accepts forward slashes
    // on Windows, and the fakes the tests inject key their trees by POSIX paths.
    await sweepFs.writeFile(path.posix.join(input.repoRoot, file.relativePath), file.text);
    written.push(file.relativePath);
  }
  return { ...derived, written };
}

/** An outcome that refused before deriving anything; nothing was derived or written. */
function refusal(refused: readonly string[]): SweepOutcome {
  return { declarations: [], reconciliations: [], written: [], alreadyDeclared: [], refused };
}

/**
 * The refusals that come before any rule is read, in order: a name that is not a basename,
 * an index that cannot be read, an index row that names no swept rule. Admission yields the
 * parsed index.
 */
async function admitSweep(
  input: SweepInput,
  sweepFs: SweepFs,
): Promise<Result<ReadonlyMap<string, RulesIndexRow>, readonly string[]>> {
  const badNames = refuseNonBasenames(input.ruleNames);
  if (badNames.length > 0) {
    return err(badNames);
  }
  const indexText = await readSource(input.repoRoot, RULES_INDEX, sweepFs);
  const index = indexText.ok ? parseRulesIndex(indexText.value) : indexText;
  if (!index.ok) {
    return err([index.error]);
  }
  const orphanRows = refuseOrphanRows(index.value, input.ruleNames, RULES_INDEX);
  return orphanRows.length > 0 ? err(orphanRows) : ok(index.value);
}

interface SweptFile {
  readonly relativePath: string;
  readonly text: string;
}

interface Derived {
  readonly declarations: readonly RuleDeclaration[];
  readonly reconciliations: readonly Reconciliation[];
  readonly alreadyDeclared: readonly string[];
  readonly refused: readonly string[];
  readonly files: readonly SweptFile[];
}

async function deriveAll(
  input: SweepInput,
  index: ReadonlyMap<string, RulesIndexRow>,
  sweepFs: SweepFs,
): Promise<Derived> {
  const declarations: RuleDeclaration[] = [];
  const reconciliations: Reconciliation[] = [];
  const alreadyDeclared: string[] = [];
  const refused: string[] = [];
  const files: SweptFile[] = [];
  for (const name of input.ruleNames) {
    const step = await sweepOne(input.repoRoot, name, index, sweepFs);
    if (step.kind === 'already-declared') {
      alreadyDeclared.push(step.rulePath);
    } else if (step.kind === 'refused') {
      refused.push(step.reason);
    } else {
      declarations.push(step.rule.declaration);
      reconciliations.push(...step.rule.reconciliations);
      files.push(step.rule.file);
    }
  }
  return { declarations, reconciliations, alreadyDeclared, refused, files };
}

type SweepStep =
  | { readonly kind: 'already-declared'; readonly rulePath: string }
  | { readonly kind: 'refused'; readonly reason: string }
  | { readonly kind: 'derived'; readonly rule: DerivedRule };

/**
 * Read one rule and classify it: already declared, refused, or derived. A leading frontmatter
 * block counts as a declaration only when it reads as one; any other block is refused, never
 * skipped, so a host whose rules carry unrelated frontmatter cannot pass as already swept. An
 * already-declared rule still needs its index row, so a rule the index has lost refuses the
 * sweep rather than passing as a clean one; its projections are the validator's to check.
 */
async function sweepOne(
  repoRoot: string,
  name: string,
  index: ReadonlyMap<string, RulesIndexRow>,
  sweepFs: SweepFs,
): Promise<SweepStep> {
  const rulePath = `.agent/rules/${name}.md`;
  const ruleText = await readSource(repoRoot, rulePath, sweepFs);
  if (!ruleText.ok) {
    return { kind: 'refused', reason: ruleText.error };
  }
  const row = index.get(name);
  if (row === undefined) {
    return { kind: 'refused', reason: `${rulePath}: no row in ${RULES_INDEX}` };
  }
  if (ruleText.value.startsWith(FRONTMATTER_OPENING)) {
    const existing = readRuleDeclaration(name, ruleText.value);
    if (!existing.ok) {
      return { kind: 'refused', reason: `${existing.error} (a block that is not a declaration)` };
    }
    return { kind: 'already-declared', rulePath };
  }
  const one = await deriveOne(repoRoot, name, row, ruleText.value, sweepFs);
  return one.ok ? { kind: 'derived', rule: one.value } : { kind: 'refused', reason: one.error };
}

interface DerivedRule {
  readonly declaration: RuleDeclaration;
  readonly reconciliations: readonly Reconciliation[];
  readonly file: SweptFile;
}

async function deriveOne(
  repoRoot: string,
  name: string,
  row: RulesIndexRow,
  ruleText: string,
  sweepFs: SweepFs,
): Promise<Result<DerivedRule, string>> {
  const sources = await readRuleProjections(repoRoot, name, sweepFs);
  if (!sources.ok) {
    return sources;
  }
  const reconciled = reconcileRuleDeclaration({
    name,
    index: row,
    cursor: sources.value.cursor,
    claudePaths: sources.value.claudePaths,
  });
  const rulePath = `.agent/rules/${name}.md`;
  const swept = prependRuleFrontmatter(ruleText, renderRuleFrontmatter(reconciled.declaration));
  if (!swept.ok) {
    return err(`${rulePath}: ${swept.error}`);
  }
  // The block is read back through the same reader the validator uses, so a value the
  // hand-kept sources carried but the declaration shape refuses (an inner backtick in a
  // trigger, a repeated glob) refuses the sweep here rather than the next check.
  const readBack = readRuleDeclaration(name, swept.value);
  if (!readBack.ok) {
    return err(`${readBack.error} (the derived declaration would not read back)`);
  }
  return ok({ ...reconciled, file: { relativePath: rulePath, text: swept.value } });
}
