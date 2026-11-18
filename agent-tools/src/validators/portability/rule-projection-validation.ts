/**
 * The rule-projection leg of the portability validator: every canonical rule's declaration is
 * read from its frontmatter, the index and the three adapters are rendered from those
 * declarations, and the surfaces are compared byte for byte. `--fix` writes what is missing or
 * drifted and removes what no declaration renders; without it, every difference is an issue
 * naming the cure.
 *
 * The leg refuses, with one issue and no write, whenever it cannot vouch for its input: a
 * declaration that cannot be read (a projection set rendered from a partial declaration set
 * would omit that rule and read as green), a canonical rule, index or projection file that is
 * unreadable (a crash past the leg would leave no refusal on record; an unreadable index read
 * as absent would be written over), a canonical rules directory that is absent, unreadable or
 * empty (acting on "no rules" would delete every projection), a regular file on the canonical
 * surface that is not a rule, and a symlink or special entry on any surface, as the surface,
 * or as one of its ancestors (a mutation under a linked ancestor would land outside the
 * projection tree; a link at the leaf is refused, never written through or replaced). The
 * three adapter directories and the index are wholly generated outputs, so a regular file on
 * them that no declaration renders, whatever its extension, is stale and `--fix` removes it;
 * any other entry there is a refusal, never a removal.
 * A canonical rule whose name a code span, a table cell or a path cannot carry is refused at
 * this boundary (`rule-name.ts`), before any projection is rendered from it.
 *
 * The comparison is byte for byte after one normalisation: every read is LF-normalised
 * (`toLfText`), so a CRLF checkout compares its content, never its line endings, and the
 * rendered projections are LF. The file system is an injected port (`rule-projection-fs.ts`),
 * every read and every mutation a typed outcome, so the leg is proven over an in-memory tree.
 *
 * @packageDocumentation
 */

import path from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { readRuleDeclaration } from '../../rule-declarations/read-rule-declaration.js';
import { ruleNameRefusal } from '../../rule-declarations/rule-name.js';
import {
  renderRuleProjections,
  RULES_INDEX_PATH,
} from '../../rule-declarations/render-rule-projections.js';
import type { RuleDeclaration } from '../../rule-declarations/rule-declaration.js';

import { applyProjectionDrift, diffProjections } from './projection-drift.js';
import { driftIssues, filesOf, refusing, RULE_SUBJECT, textOf } from './projection-issues.js';
import type { RuleProjectionFs } from './rule-projection-fs.js';

/** The projection surfaces and the extension each carries. */
const PROJECTION_SURFACES = [
  { dir: '.cursor/rules', extension: '.mdc' },
  { dir: '.claude/rules', extension: '.md' },
  { dir: '.agents/rules', extension: '.md' },
] as const;

const CANONICAL_RULES_DIR = '.agent/rules';

const REFUSING = refusing(RULE_SUBJECT);

/** What the leg found and, in fix mode, did. */
export interface RuleProjectionValidation {
  readonly issues: readonly string[];
  readonly canonicalRuleCount: number;
  /** Repo-relative paths written in fix mode. */
  readonly written: readonly string[];
  /** Repo-relative stale paths removed in fix mode. */
  readonly removed: readonly string[];
}

/**
 * Validate (and in fix mode regenerate) the rule projections.
 *
 * @param fixMode - Whether to write missing and drifted projections and remove stale ones.
 * @param projectionFs - The file-system port over the repository.
 * @returns The issues found and the paths written or removed.
 */
export async function validateRuleProjections(
  fixMode: boolean,
  projectionFs: RuleProjectionFs,
): Promise<RuleProjectionValidation> {
  const canonical = await readDeclarations(projectionFs);
  const canonicalRuleCount = canonical.canonicalRuleCount;
  if (canonical.issues.length > 0) {
    return { issues: canonical.issues, canonicalRuleCount, written: [], removed: [] };
  }
  const surfaces = await readSurfaces(projectionFs);
  if (!surfaces.ok) {
    return { issues: [surfaces.error], canonicalRuleCount, written: [], removed: [] };
  }
  const expected = renderRuleProjections(canonical.declarations);
  const drift = diffProjections(expected, surfaces.value);
  if (!fixMode) {
    return {
      issues: driftIssues(drift, RULE_SUBJECT),
      canonicalRuleCount,
      written: [],
      removed: [],
    };
  }
  return { canonicalRuleCount, ...(await applyProjectionDrift(expected, drift, projectionFs)) };
}

interface CanonicalRules {
  readonly declarations: readonly RuleDeclaration[];
  readonly issues: readonly string[];
  readonly canonicalRuleCount: number;
}

async function readDeclarations(projectionFs: RuleProjectionFs): Promise<CanonicalRules> {
  const listing = await projectionFs.listDirectory(CANONICAL_RULES_DIR, '.md');
  const files = filesOf(CANONICAL_RULES_DIR, listing, 'canonical', RULE_SUBJECT);
  if (!files.ok) {
    return { declarations: [], issues: [files.error], canonicalRuleCount: 0 };
  }
  if (files.value.length === 0) {
    const issue = `${CANONICAL_RULES_DIR}: no canonical rules; ${REFUSING} from an empty set`;
    return { declarations: [], issues: [issue], canonicalRuleCount: 0 };
  }
  const declarations: RuleDeclaration[] = [];
  const issues: string[] = [];
  for (const ruleFile of files.value) {
    const declaration = await readOneDeclaration(ruleFile, projectionFs);
    if (declaration.ok) {
      declarations.push(declaration.value);
    } else {
      issues.push(declaration.error);
    }
  }
  return { declarations, issues, canonicalRuleCount: files.value.length };
}

/** One canonical rule's declaration: its name admitted, its text read, its block parsed. */
async function readOneDeclaration(
  ruleFile: string,
  projectionFs: RuleProjectionFs,
): Promise<Result<RuleDeclaration, string>> {
  const name = path.basename(ruleFile, '.md');
  const refusal = ruleNameRefusal(name);
  if (refusal !== undefined) {
    return err(`${ruleFile}: ${refusal}`);
  }
  const text = textOf(ruleFile, await projectionFs.readEntry(ruleFile), RULE_SUBJECT);
  if (!text.ok) {
    return text;
  }
  const declaration = readRuleDeclaration(name, text.value);
  return declaration.ok
    ? declaration
    : err(`${declaration.error} (declare it in the rule's frontmatter)`);
}

/** Every file currently on the projection surfaces, plus the index when present. */
async function readSurfaces(
  projectionFs: RuleProjectionFs,
): Promise<Result<ReadonlyMap<string, string>, string>> {
  const actual = new Map<string, string>();
  const index = await projectionFs.readEntry(RULES_INDEX_PATH);
  if (index.kind !== 'absent') {
    const text = textOf(RULES_INDEX_PATH, index, RULE_SUBJECT);
    if (!text.ok) {
      return text;
    }
    actual.set(RULES_INDEX_PATH, text.value);
  }
  for (const surface of PROJECTION_SURFACES) {
    const listing = await projectionFs.listDirectory(surface.dir, surface.extension);
    const files = filesOf(surface.dir, listing, 'projection', RULE_SUBJECT);
    if (!files.ok) {
      return files;
    }
    for (const file of files.value) {
      const text = textOf(file, await projectionFs.readEntry(file), RULE_SUBJECT);
      if (!text.ok) {
        return text;
      }
      actual.set(file, text.value);
    }
  }
  return ok(actual);
}
