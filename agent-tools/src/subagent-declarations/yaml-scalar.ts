/**
 * The YAML scalar forms every Markdown adapter surface writes, measured against the
 * estate's formatter on 2026-09-14 (prettier, single quotes preferred, on `.claude/agents`;
 * `.cursor/` is outside its reach and `.gemini/` inside it): a quoted scalar for a
 * description, and a field value written plain only where the yaml library itself would
 * emit the bare text as that string, else quoted by the same rule, so a value carrying a
 * comment marker, a mapping separator, a leading indicator, a wildcard or a YAML keyword is
 * never written as text the platform would read otherwise (#81 round two; slice B).
 *
 * @packageDocumentation
 */

import { stringify } from 'yaml';

// A backslash literal without an escaped string, which the lint forbids.
const BACKSLASH = String.fromCodePoint(92);

/**
 * A YAML quoted scalar in the style the estate's formatter keeps: a text holding a double
 * quote is single-quoted with each apostrophe doubled; else a text holding an apostrophe is
 * double-quoted, the one escape that form then needs being the doubled backslash; else
 * single-quoted.
 */
export function yamlQuoted(text: string): string {
  if (!text.includes('"') && text.includes("'")) {
    return `"${text.replaceAll(BACKSLASH, BACKSLASH + BACKSLASH)}"`;
  }
  return `'${text.replaceAll("'", "''")}'`;
}

/**
 * A field value as an adapter carries it: plain where the yaml library would emit the bare
 * text as that string (its plain-scalar judgement, at no line width so length never folds
 * a value), else quoted by the measured rule.
 */
export function yamlScalar(value: string): string {
  return stringify(value, { lineWidth: 0 }) === `${value}\n` ? value : yamlQuoted(value);
}
