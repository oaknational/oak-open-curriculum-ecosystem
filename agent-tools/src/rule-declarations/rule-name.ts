/**
 * The rule-name boundary of the sweep, in both directions. A rule is addressed by its basename
 * without `.md`, and every path the sweep builds (`.agent/rules/<name>.md`,
 * `.cursor/rules/<name>.mdc`, `.claude/rules/<name>.md`) interpolates that name, so any other
 * shape (a separator anywhere, leading or not; a dot segment; an empty name; a `.md` suffix)
 * would address a file outside the rules directories or the wrong file inside them, and the
 * projection leg interpolates it into code spans, table cells and paths besides, so the shape
 * is closed: lowercase letters and digits in single-hyphen groups, nothing a code span, a
 * table cell or a path cannot carry (the #74 round-three finding, 2026-09-14). The check
 * runs before any path is built, so a refused name is never read and never written; the reason
 * quotes the name so an empty or whitespace name stays visible in a report. In the other
 * direction, the rules index is the canonical enumeration, so a row naming no swept rule is a
 * stale or extra row the sweep would never visit, and it refuses the sweep too, before any
 * rule path is built (the index itself has been read by then).
 *
 * @packageDocumentation
 */

import type { RulesIndexRow } from './parse-rules-index.js';

const NOT_A_RULE_BASENAME =
  'not a rule basename (lowercase letters and digits in single-hyphen groups: one path segment, no dot segment, no .md suffix)';

const RULE_BASENAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;

/**
 * Code-unit order over rule names: total, and independent of the host locale, so the rendered
 * index and the listings compare byte for byte on every machine (a locale-aware compare orders
 * `ch` after `h` under `cs` and `sk`).
 *
 * @param left - One rule name or projection path.
 * @param right - The other.
 * @returns A negative number, zero or a positive number as `Array.prototype.sort` expects.
 */
export function compareRuleNames(left: string, right: string): number {
  if (left < right) {
    return -1;
  }
  return left > right ? 1 : 0;
}

/** The refusal reason when a name is not a rule basename; `undefined` when it may be interpolated. */
export function ruleNameRefusal(name: string): string | undefined {
  return RULE_BASENAME.test(name) ? undefined : `${JSON.stringify(name)}: ${NOT_A_RULE_BASENAME}`;
}

/**
 * The refusal reason for every name that is not a rule basename, in input order; empty when
 * every name may be interpolated into a rule path.
 */
export function refuseNonBasenames(ruleNames: readonly string[]): readonly string[] {
  return ruleNames.flatMap((name) => {
    const refusal = ruleNameRefusal(name);
    return refusal === undefined ? [] : [refusal];
  });
}

/**
 * The refusal reason for every index row that names no rule in the swept set, in index
 * order; empty when every row has its rule. (The inverse, a swept rule with no row, is refused
 * per rule by the sweep.)
 */
export function refuseOrphanRows(
  index: ReadonlyMap<string, RulesIndexRow>,
  ruleNames: readonly string[],
  indexName: string,
): readonly string[] {
  const swept = new Set(ruleNames);
  return [...index.keys()]
    .filter((name) => !swept.has(name))
    .map((name) => `${indexName}: the row for ${name} names no tracked rule`);
}
