/**
 * The comma-joined list form the declarations and the hand-kept adapters carry (`"a,b"`),
 * and the two scalar readings the frontmatter reader shares with it: the wrapping quotes a
 * hand-written value may carry, and the top-level comma a block-sequence item must not.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';

/**
 * Split a quoted, comma-joined list value (`"a,b"` or `'a,b'`) into its members. A comma
 * inside a brace group (`**\/*.{ts,tsx}`) belongs to the glob, not to the list, so a value
 * whose braces do not balance is refused rather than split on a guess.
 *
 * @param value - The raw scalar after the key.
 * @returns The trimmed, non-empty members in order, or the reason the value cannot be split.
 */
export function splitCommaList(value: string): Result<readonly string[], string> {
  const text = stripMatchingQuotes(value);
  const balance = checkBraceBalance(text);
  if (!balance.ok) {
    return balance;
  }
  const members: string[] = [];
  let current = '';
  let depth = 0;
  for (const character of text) {
    if (character === '{') {
      depth += 1;
    } else if (character === '}') {
      depth -= 1;
    }
    if (character === ',' && depth === 0) {
      members.push(current);
      current = '';
    } else {
      current += character;
    }
  }
  members.push(current);
  return ok(members.map((member) => member.trim()).filter((member) => member.length > 0));
}

/** Refuse a value whose braces do not pair up, naming the value so its source line is findable. */
function checkBraceBalance(text: string): Result<undefined, string> {
  let depth = 0;
  for (const character of text) {
    if (character === '{') {
      depth += 1;
    } else if (character === '}') {
      if (depth === 0) {
        return err(`unbalanced braces in "${text}": a "}" has no "{"`);
      }
      depth -= 1;
    }
  }
  return depth === 0 ? ok(undefined) : err(`unbalanced braces in "${text}": a "{" is never closed`);
}

/** Drop one pair of wrapping quotes, as YAML does for a quoted scalar; a bare value is returned as is. */
export function stripMatchingQuotes(value: string): string {
  const first = value.at(0);
  const last = value.at(-1);
  if (value.length >= 2 && (first === '"' || first === "'") && last === first) {
    return value.slice(1, -1);
  }
  return value;
}

/** Whether `text` carries a comma outside every brace group (a glob's `{ts,tsx}` is not a list). */
export function hasTopLevelComma(text: string): boolean {
  let depth = 0;
  for (const character of text) {
    if (character === '{') {
      depth += 1;
    } else if (character === '}') {
      depth -= 1;
    } else if (character === ',' && depth === 0) {
      return true;
    }
  }
  return false;
}
