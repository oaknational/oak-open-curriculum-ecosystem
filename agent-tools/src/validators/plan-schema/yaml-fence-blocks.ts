/**
 * Markdown fenced-code-block scanning, narrowed to the YAML blocks a plan node
 * pins.
 *
 * @remarks
 * Read as FENCES rather than as one literal spelling. A regex looking only for
 * a three-backtick block tagged `yaml` finds nothing in a node that writes
 * `yml`, opens with tildes, indents the fence, or uses a longer backtick run —
 * all ordinary Markdown an author reaches for without thinking, and the last of
 * them is what someone pinning a file that itself contains a fence must use.
 * Each of those would restore the false green the parse check exists to remove,
 * so this scanner tracks the opening delimiter, closes on a matching run, and
 * strips the opener's own indentation from the content as CommonMark does.
 *
 * TOP-LEVEL fences, and that is the whole contract rather than a shortfall
 * against a larger one. A plan node PINS a file by putting its text in a
 * top-level fenced block, which is what a seat then copies verbatim; a YAML
 * block nested inside a blockquote or a list item is illustrative prose, not a
 * pinned file, and was never what this check exists to protect.
 *
 * That sentence is the correction of a wrong turn worth recording, because the
 * cost was five review rounds. The original doc claimed "every fenced YAML
 * block"; a reviewer rightly observed that nested blocks were missed; and the
 * response was to grow a detector that refused what it could not read — first
 * blockquotes, then list markers, then nesting, then any letter-free prefix,
 * each correction sampled again by the next round. Two answers had been
 * available at that first finding and only one was tried. The other is this
 * one: the claim was wrong, not the coverage. Fixing the sentence costs
 * nothing the purpose needed, and the detector it retires had become a larger
 * source of defects — two false positives on valid documents — than the case
 * it was added for, which the live corpus has never contained.
 *
 * The distinction CommonMark draws here cannot be drawn without container
 * state: a four-space-indented fence line is a real fence inside a list item
 * and literal text in a top-level indented code block. A regex cannot tell
 * those apart, and neither reading is safe to guess. A parser could, and is
 * not worth a dependency for a case the convention does not produce.
 *
 * Its own home because it is a Markdown concern, not a plan-schema one; the
 * plan validator consumes {@link yamlFencedBlocks} and knows nothing of fences.
 *
 * @packageDocumentation
 */

/** An open code fence: what will close it, and whether its content is YAML. */
interface OpenFence {
  /** The run of backticks or tildes that opened it; the closer matches or exceeds it. */
  readonly delimiter: string;
  /** Leading spaces on the opening line; the same count is stripped from content. */
  readonly indent: number;
  /** Whether the info string names YAML, under either of its two spellings. */
  readonly isYaml: boolean;
}

const FENCE_LINE = /^(?<indent> {0,3})(?<delimiter>`{3,}|~{3,})[ \t]*(?<info>.*)$/u;

/** The two info strings that name YAML; both are ordinary and both must be read. */
const YAML_INFO_STRINGS = new Set(['yaml', 'yml']);

/**
 * The language an info string names: its first token, lowercased, with any
 * trailing attributes (a title, a highlight range) discarded.
 */
function languageOf(info: string): string {
  return (
    info
      .trim()
      .split(/[\s,{]/u)[0]
      ?.toLowerCase() ?? ''
  );
}

/** A fence opener, or `undefined` when the line is not one. */
function openFenceAt(line: string): OpenFence | undefined {
  const groups = FENCE_LINE.exec(line)?.groups;
  if (groups === undefined) {
    return undefined;
  }
  const { indent = '', delimiter = '', info = '' } = groups;
  // CommonMark: a backtick fence's info string may not itself contain a
  // backtick, which is what keeps inline code from opening a block.
  if (delimiter.startsWith('`') && info.includes('`')) {
    return undefined;
  }
  return {
    delimiter,
    indent: indent.length,
    isYaml: YAML_INFO_STRINGS.has(languageOf(info)),
  };
}

/** Whether `line` closes `open`: same character, no shorter, nothing but the run. */
function closesFence(line: string, open: OpenFence): boolean {
  const groups = FENCE_LINE.exec(line)?.groups;
  if (groups === undefined || groups.info !== '') {
    return false;
  }
  const delimiter = groups.delimiter ?? '';
  return delimiter[0] === open.delimiter[0] && delimiter.length >= open.delimiter.length;
}

/** How many of the first `limit` characters of `line` are spaces. */
function countLeadingSpaces(line: string, limit: number): number {
  let count = 0;
  while (count < limit && line[count] === ' ') {
    count += 1;
  }
  return count;
}

/** Every top-level fenced YAML block in `content`, in document order. */
export function yamlFencedBlocks(content: string): string[] {
  const blocks: string[] = [];
  let open: OpenFence | undefined;
  let current: string[] = [];
  for (const rawLine of content.split('\n')) {
    const line = rawLine.replace(/\r$/u, '');
    if (open === undefined) {
      open = openFenceAt(line);
      current = [];
    } else if (closesFence(line, open)) {
      if (open.isYaml) {
        blocks.push(`${current.join('\n')}\n`);
      }
      open = undefined;
    } else {
      current.push(line.slice(countLeadingSpaces(line, open.indent)));
    }
  }
  // CommonMark closes an unterminated block at the end of the document.
  if (open?.isYaml === true) {
    blocks.push(`${current.join('\n')}\n`);
  }
  return blocks;
}
