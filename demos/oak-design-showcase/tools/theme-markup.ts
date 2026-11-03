/**
 * Theme markup the theming grader reads from an artefact: the rules a
 * `[data-theme="…"]` selector scopes, and the theme-like values interactive
 * elements carry in their attributes. Both are found in linear time: rules by
 * a walk over braces, attribute values by a pattern that starts only at the
 * first character of an attribute name.
 *
 * @packageDocumentation
 */

/** One rule whose selector names a data-theme value. */
export interface DataThemeRule {
  /** Offset of the prelude: just past the brace before it, or 0. */
  readonly index: number;
  /** The text between the previous brace and the rule's opening brace. */
  readonly prelude: string;
  /** The last quoted `data-theme` value in the prelude, as written. */
  readonly theme: string;
  /** The text between the rule's braces. */
  readonly body: string;
}

const DATA_THEME_OPENER = '[data-theme=';
const QUOTES = new Set(['"', "'"]);

function isBrace(character: string): boolean {
  return character === '{' || character === '}';
}

/**
 * An ASCII letter or a hyphen: the class `[a-z-]` matches under the `i` flag
 * without the `u` flag, where case folding never reaches outside ASCII.
 */
function isThemeNameCharacter(character: string): boolean {
  return character === '-' || /^[A-Za-z]$/.test(character);
}

/**
 * `text` with ASCII capitals lowered and nothing else changed, so every
 * offset in the result is the same offset in `text` (a full `toLowerCase`
 * can lengthen a string, as `İ` becomes two code units).
 */
function asciiLowerCase(text: string): string {
  return text.replaceAll(/[A-Z]/g, (capital) => capital.toLowerCase());
}

/**
 * The value of the `[data-theme="…"]` attribute selector whose opener starts
 * at `opener`, or `undefined` when the selector there is not one: a quote, a
 * non-empty run of letters and hyphens, a quote, a closing bracket.
 */
function themeValueAt(prelude: string, opener: number): string | undefined {
  const quote = opener + DATA_THEME_OPENER.length;
  if (!QUOTES.has(prelude.charAt(quote))) {
    return undefined;
  }
  let end = quote + 1;
  while (end < prelude.length && isThemeNameCharacter(prelude.charAt(end))) {
    end += 1;
  }
  const valid =
    end > quote + 1 && QUOTES.has(prelude.charAt(end)) && prelude.charAt(end + 1) === ']';
  return valid ? prelude.slice(quote + 1, end) : undefined;
}

/** The last valid quoted data-theme value in `prelude`, ASCII case-insensitively. */
function lastThemeValue(prelude: string): string | undefined {
  const lower = asciiLowerCase(prelude);
  let opener = lower.lastIndexOf(DATA_THEME_OPENER);
  while (opener !== -1) {
    const value = themeValueAt(prelude, opener);
    if (value !== undefined) {
      return value;
    }
    opener = opener === 0 ? -1 : lower.lastIndexOf(DATA_THEME_OPENER, opener - 1);
  }
  return undefined;
}

/**
 * Every rule in `code` whose prelude names a quoted data-theme value and whose
 * body holds no nested block, in order. A prelude runs from the previous brace
 * (or the start of the text) to the rule's opening brace, so in an HTML
 * artefact it carries the markup before a `<style>` block.
 */
export function dataThemeRules(code: string): readonly DataThemeRule[] {
  const rules: DataThemeRule[] = [];
  let preludeStart = 0;
  for (let open = 0; open < code.length; open += 1) {
    const character = code.charAt(open);
    if (!isBrace(character)) {
      continue;
    }
    if (character === '}') {
      preludeStart = open + 1;
      continue;
    }
    let close = open + 1;
    while (close < code.length && !isBrace(code.charAt(close))) {
      close += 1;
    }
    const prelude = code.slice(preludeStart, open);
    const theme = code.charAt(close) === '}' ? lastThemeValue(prelude) : undefined;
    if (theme !== undefined) {
      rules.push({ index: preludeStart, prelude, theme, body: code.slice(open + 1, close) });
    }
    preludeStart = open + 1;
  }
  return rules;
}

/**
 * A quoted attribute value of letters and hyphens, its match started at the
 * first character of the attribute's name.
 */
const QUOTED_ATTRIBUTE_VALUE = /(?<![\w-])[\w-]+\s*=\s*["']([a-z-]+)["']/gi;

/** Each quoted letters-and-hyphens value in a tag's `attributes`, as written. */
export function quotedAttributeValues(attributes: string): readonly string[] {
  return [...attributes.matchAll(QUOTED_ATTRIBUTE_VALUE)].flatMap((match) =>
    match[1] === undefined ? [] : [match[1]],
  );
}
