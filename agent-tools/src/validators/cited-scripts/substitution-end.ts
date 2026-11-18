/**
 * Where a `$( )` command substitution ends: the scan the cited-scripts shell
 * lexer uses to find the `)` that closes one.
 *
 * @packageDocumentation
 */

/** The characters that open a quoted run, backticks among them, inside `$( )`. */
const QUOTES: ReadonlySet<string> = new Set(["'", '"', '`']);

/** The quote state after `character`: an unquoted quote opens, the same quote closes. */
function nextQuote(quote: string | undefined, character: string): string | undefined {
  if (quote === undefined) {
    return QUOTES.has(character) ? character : undefined;
  }
  return character === quote ? undefined : quote;
}

/** How an unquoted character inside `$( )` moves the nesting depth. */
const PAREN_DEPTH: ReadonlyMap<string, number> = new Map([
  ['(', 1],
  [')', -1],
]);

/** Where a scan inside `$( )` stands: its parenthesis depth, open `${` braces and quote. */
interface SubstitutionScan {
  depth: number;
  braces: number;
  quote: string | undefined;
}

/** Move the scan's depths for one unquoted character: a brace closes first, a parenthesis counts outside braces. */
function moveDepths(scan: SubstitutionScan, character: string): void {
  if (scan.braces > 0) {
    scan.braces -= character === '}' ? 1 : 0;
    return;
  }
  scan.depth += PAREN_DEPTH.get(character) ?? 0;
}

/** Scan one step inside `$( )`; returns where the next starts. */
function scanStep(text: string, index: number, scan: SubstitutionScan): number {
  const character = text.charAt(index);
  if (character === '\\' && scan.quote !== "'") {
    return index + 2;
  }
  if (scan.quote === undefined && text.startsWith('${', index)) {
    scan.braces += 1;
    return index + 2;
  }
  scan.quote = nextQuote(scan.quote, character);
  if (scan.quote === undefined) {
    moveDepths(scan, character);
  }
  return index + 1;
}

/**
 * The index of the `)` that closes a `$(` whose body starts at `start`. A
 * backslash outside single quotes takes the next character with it, and a
 * parenthesis counts only outside quotes, backticks and `${ }` expansions.
 */
export function substitutionEnd(text: string, start: number): number {
  const scan: SubstitutionScan = { depth: 1, braces: 0, quote: undefined };
  let index = start;
  while (index < text.length) {
    const next = scanStep(text, index, scan);
    if (scan.depth === 0) {
      return index;
    }
    index = next;
  }
  return text.length;
}
