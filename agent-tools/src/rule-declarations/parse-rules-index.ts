/**
 * Read the rule rows of `RULES_INDEX.md`.
 *
 * The index is a markdown table whose rule rows carry the canonical path, the classification
 * and the trigger text. This parser reads exactly those rows and refuses anything it cannot
 * read: a rule row it cannot parse, a classification outside the closed set, a situational
 * rule without a trigger, a core rule with one, or a rule listed twice. Prose and the table
 * header are ignored. The trigger `—` (an em dash) means none.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';

import { isRuleClassification, RULE_CLASSIFICATIONS } from './rule-declaration.js';

/** What one index row says about a rule: core rows carry no trigger, situational rows must. */
export type RulesIndexRow =
  | { readonly classification: 'core' }
  | { readonly classification: 'situational'; readonly trigger: string };

const RULE_ROW_START = /^\|\s*`\.agent\/rules\//u;
const RULE_PATH_PREFIX = '`.agent/rules/';
const RULE_PATH_SUFFIX = '.md`';
const NO_TRIGGER = '—';

/**
 * Parse the rule rows of the rules index.
 *
 * @param text - The full text of `RULES_INDEX.md`.
 * @returns The rows keyed by rule name, or the first reason a row could not be read.
 *
 * @example
 * ```ts
 * const rows = parseRulesIndex(await readFile('RULES_INDEX.md', 'utf8'));
 * if (rows.ok) {
 *   rows.value.get('compute-dont-hope'); // { classification: 'core' }
 * }
 * ```
 */
export function parseRulesIndex(text: string): Result<ReadonlyMap<string, RulesIndexRow>, string> {
  const rows = new Map<string, RulesIndexRow>();
  for (const line of text.split('\n')) {
    if (!RULE_ROW_START.test(line)) {
      continue;
    }
    const parsed = parseRuleRow(line);
    if (!parsed.ok) {
      return parsed;
    }
    if (rows.has(parsed.value.name)) {
      return err(`.agent/rules/${parsed.value.name}.md: listed twice in the index`);
    }
    rows.set(parsed.value.name, parsed.value.row);
  }
  return ok(rows);
}

interface ParsedRuleRow {
  readonly name: string;
  readonly row: RulesIndexRow;
}

function parseRuleRow(line: string): Result<ParsedRuleRow, string> {
  const cells = splitRowCells(line);
  const [pathCell = '', classification = '', rawTrigger = ''] = cells;
  const name = ruleNameOfCell(pathCell);
  if (cells.length !== 3 || name === undefined) {
    return err(`unparseable rules-index row: ${line}`);
  }
  const row = readRow(`.agent/rules/${name}.md`, classification, stripCodeSpan(rawTrigger));
  return row.ok ? ok({ name, row: row.value }) : row;
}

/** The cells between a row's leading and trailing pipes, trimmed; no cells when the row lacks either pipe. */
function splitRowCells(line: string): readonly string[] {
  const trimmed = line.trim();
  if (trimmed.length < 2 || !trimmed.startsWith('|') || !trimmed.endsWith('|')) {
    return [];
  }
  return trimmed
    .slice(1, -1)
    .split('|')
    .map((cell) => cell.trim());
}

/** The rule name inside a path cell (the canonical path in a code span); `undefined` for any other cell. */
function ruleNameOfCell(cell: string): string | undefined {
  if (!cell.startsWith(RULE_PATH_PREFIX) || !cell.endsWith(RULE_PATH_SUFFIX)) {
    return undefined;
  }
  const name = cell.slice(RULE_PATH_PREFIX.length, -RULE_PATH_SUFFIX.length);
  return name.length > 0 && !name.includes('/') && !name.includes('`') ? name : undefined;
}

/** A generated index wraps the trigger token in a code span; a hand-kept one did not. */
function stripCodeSpan(cell: string): string {
  return cell.length >= 2 && cell.startsWith('`') && cell.endsWith('`') ? cell.slice(1, -1) : cell;
}

/** Check the classification against the closed set and the trigger against it. */
function readRow(
  rulePath: string,
  classification: string,
  triggerText: string,
): Result<RulesIndexRow, string> {
  if (!isRuleClassification(classification)) {
    const allowed = RULE_CLASSIFICATIONS.join(' or ');
    return err(`${rulePath}: classification must be ${allowed}, got "${classification}"`);
  }
  const hasTrigger = triggerText !== NO_TRIGGER && triggerText.length > 0;
  if (classification === 'core') {
    return hasTrigger
      ? err(`${rulePath}: a core rule carries no trigger; the row carries "${triggerText}"`)
      : ok({ classification });
  }
  return hasTrigger
    ? ok({ classification, trigger: triggerText })
    : err(`${rulePath}: a situational rule needs a trigger; the row carries "${triggerText}"`);
}
