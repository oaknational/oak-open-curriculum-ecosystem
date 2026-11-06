/**
 * A template's System prompt block: the one blockquote under its `## System prompt` heading,
 * before the next heading of the same or a higher level, unquoted line by line (a bare `>`
 * line is a paragraph break). A heading or a quote line inside a code fence is example
 * text: never the section's start or end, and never its quote. The block is carried whole or
 * not at all: a quote that a non-blank line runs on from (a lazy continuation, which Markdown
 * reads as part of the quote), a second quote in the section, or a quote with no text in it,
 * reads as none, which the reader refuses. A Claude adapter whose declaration names the block
 * carries it verbatim as its body (`claude-fields.ts`), so the template is its one home.
 *
 * @packageDocumentation
 */

const HEADING = '## System prompt';
const SECTION_END = /^#{1,2}\s/u;
const ANY_HEADING = /^#{1,6}\s/u;
const FENCE = /^ {0,3}(`{3,}|~{3,})/u;
const CLOSING_FENCE = /^ {0,3}(`{3,}|~{3,})[ \t]*$/u;

function isQuoted(line: string): boolean {
  return line.startsWith('>');
}

/**
 * Whether each line sits outside every code fence; a fence's own lines sit inside it. A fence
 * closes only on a line of its own character, at least as long, with nothing but whitespace
 * after it; any other fence-like line inside it is content.
 */
function unfenced(lines: readonly string[]): readonly boolean[] {
  let open: string | undefined;
  return lines.map((line) => {
    if (open !== undefined) {
      const closing = CLOSING_FENCE.exec(line)?.[1];
      if (closing?.startsWith(open) === true) {
        open = undefined;
      }
      return false;
    }
    open = FENCE.exec(line)?.[1];
    return open === undefined;
  });
}

/** A section's lines, and for each whether it sits outside every code fence. */
interface Section {
  readonly lines: readonly string[];
  readonly outside: readonly boolean[];
}

/** The System prompt section, after its heading; undefined when there is none. */
function promptSection(lines: readonly string[]): Section | undefined {
  const outside = unfenced(lines);
  const start = lines.findIndex((line, index) => outside[index] === true && line === HEADING);
  if (start === -1) {
    return undefined;
  }
  const end = lines.findIndex(
    (line, index) => index > start && outside[index] === true && SECTION_END.test(line),
  );
  const stop = end === -1 ? undefined : end;
  return { lines: lines.slice(start + 1, stop), outside: outside.slice(start + 1, stop) };
}

/** Whether a section line is a quote line outside every fence. */
function quotedAt(section: Section, index: number): boolean {
  return section.outside[index] === true && isQuoted(section.lines[index] ?? '');
}

/** Whether a line ends the quote before it rather than running on into it: blank, or a heading. */
function closesQuote(line: string): boolean {
  return line.trim() === '' || ANY_HEADING.test(line);
}

/**
 * The quoted run that starts the section's first quote, when it is the section's one quote
 * and nothing runs on from it; undefined otherwise.
 */
function wholeQuote(section: Section, first: number): readonly string[] | undefined {
  const { lines } = section;
  const stop = lines.findIndex((_line, index) => index > first && !quotedAt(section, index));
  if (stop === -1) {
    return lines.slice(first);
  }
  const another = lines.some((_line, index) => index >= stop && quotedAt(section, index));
  return closesQuote(lines[stop] ?? '') && !another ? lines.slice(first, stop) : undefined;
}

/**
 * The System prompt block of a template's Markdown body.
 *
 * @param markdown - The template's text after its frontmatter block.
 * @returns The block's text, unquoted, or undefined when the template carries none it can
 * carry whole.
 */
export function systemPromptBlock(markdown: string): string | undefined {
  const section = promptSection(markdown.split('\n')) ?? { lines: [], outside: [] };
  const first = section.lines.findIndex((_line, index) => quotedAt(section, index));
  const quote = first === -1 ? undefined : wholeQuote(section, first);
  const text = quote?.map((line) => line.replace(/^> ?/u, '')).join('\n');
  return text?.trim() === '' ? undefined : text;
}
