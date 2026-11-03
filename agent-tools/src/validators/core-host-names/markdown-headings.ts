/**
 * The ATX headings of a Markdown document, read outside fenced code.
 *
 * @remarks
 * Its own home because it is a Markdown concern, not a host-name one: the
 * host-name heading validator consumes {@link atxHeadings} and knows nothing of
 * fences. Fences are read as CommonMark reads them, the lines the plan corpus's
 * YAML fence scanner also draws: an opener is three or more backticks or tildes
 * after up to three spaces, a backtick opener's info string may not contain a
 * backtick (which keeps inline code from opening a block), and a closer is the
 * same character, no shorter, with nothing after the run. A heading quoted
 * inside a fence is therefore never read as one, and a line such as a closing
 * run followed by text leaves the fence open, as the specification says.
 *
 * Top-level fences only, which is the whole contract: a heading inside a
 * blockquote or a list item is not an ATX heading of the document, and the
 * Core's records do not nest fences in containers.
 *
 * @packageDocumentation
 */

/** A fence line: up to three spaces, a run of three or more backticks or tildes, then its info string. */
const FENCE_LINE = /^ {0,3}(?<delimiter>`{3,}|~{3,})[ \t]*(?<info>.*)$/u;

/** An ATX heading: one to six hashes, a space or tab, then the text. */
const ATX_HEADING = /^ {0,3}(#{1,6})[ \t]+(.*)$/u;

/** One heading, with its 1-based line number and the line as written. */
export interface AtxHeading {
  readonly line: number;
  readonly text: string;
}

/** The delimiter run of a fence opener, or undefined when the line opens no fence. */
function fenceOpenerOf(line: string): string | undefined {
  const groups = FENCE_LINE.exec(line)?.groups;
  if (groups === undefined) {
    return undefined;
  }
  const { delimiter = '', info = '' } = groups;
  return delimiter.startsWith('`') && info.includes('`') ? undefined : delimiter;
}

/** True when `line` closes the fence `openFence` opened: same character, no shorter, nothing after the run. */
function closesFence(openFence: string, line: string): boolean {
  const groups = FENCE_LINE.exec(line)?.groups;
  if (groups === undefined || groups.info !== '') {
    return false;
  }
  const delimiter = groups.delimiter ?? '';
  return delimiter.charAt(0) === openFence.charAt(0) && delimiter.length >= openFence.length;
}

/** The ATX headings of a Markdown document outside fenced code, in document order. */
export function atxHeadings(content: string): AtxHeading[] {
  const headings: AtxHeading[] = [];
  let openFence: string | undefined;
  content.split('\n').forEach((rawLine, index) => {
    // CRLF Markdown: the carriage return is a line ending, never fence info or heading text.
    const line = rawLine.endsWith('\r') ? rawLine.slice(0, -1) : rawLine;
    if (openFence !== undefined) {
      if (closesFence(openFence, line)) {
        openFence = undefined;
      }
      return;
    }
    const opener = fenceOpenerOf(line);
    if (opener !== undefined) {
      openFence = opener;
      return;
    }
    if (ATX_HEADING.test(line)) {
      headings.push({ line: index + 1, text: line });
    }
  });
  return headings;
}
