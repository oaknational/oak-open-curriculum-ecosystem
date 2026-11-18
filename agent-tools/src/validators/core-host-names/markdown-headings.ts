/**
 * The ATX headings of a Markdown document, read outside fenced code.
 *
 * @remarks
 * Its own home because it is a Markdown concern, not a host-name one: the
 * host-name heading validator consumes {@link atxHeadings} and knows nothing of
 * fences. Fences are read as CommonMark reads them, through the shared
 * fence-line model (`core/markdown/fence-line.ts`) the plan corpus's YAML fence
 * scanner also draws on: an opener is three or more backticks or tildes after
 * up to three spaces, a backtick opener's info string may not contain a
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

import { closesFence, fenceOpenerOf } from '../../core/markdown/fence-line.js';

/** An ATX heading: one to six hashes, a space or tab, then the text (optional, starting on a non-blank). */
const ATX_HEADING = /^ {0,3}(#{1,6})[ \t]+([^ \t].*)?$/u;

/** One heading, with its 1-based line number and the line as written. */
export interface AtxHeading {
  readonly line: number;
  readonly text: string;
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
      openFence = opener.delimiter;
      return;
    }
    if (ATX_HEADING.test(line)) {
      headings.push({ line: index + 1, text: line });
    }
  });
  return headings;
}
