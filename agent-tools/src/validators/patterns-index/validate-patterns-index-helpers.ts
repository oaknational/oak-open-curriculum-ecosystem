/**
 * Pure logic for the patterns-index validator/generator.
 *
 * @remarks
 * The `.agent/memory/active/patterns/README.md` "## Pattern Index" section is a
 * discovery surface that previously drifted from the pattern files it indexes
 * (files added without an index entry; stale section counts). Rather than fix the
 * copy once, this module makes the index **derivable from the pattern files' own
 * frontmatter** (`name`, `polarity`, `use_this_when`, `category`): the validator
 * regenerates the section and compares, so the index cannot silently drift again.
 *
 * @packageDocumentation
 */

import { extractFrontmatter, getFrontmatterValue } from '../portability/portability-fs.js';

/** The README whose Pattern Index section this module owns. */
export const PATTERNS_README = 'README.md';

/** Heading that opens the generated section; everything from here to EOF is owned. */
const PATTERN_INDEX_HEADING = '## Pattern Index';

/** A single indexable pattern, distilled from one file's frontmatter. */
export interface PatternEntry {
  readonly filename: string;
  readonly name: string;
  readonly category: string;
  /** The `use_this_when` hint, when the file declares one (optional in the corpus). */
  readonly useThisWhen?: string;
  readonly isAntiPattern: boolean;
}

/** A pattern file that could not be indexed (missing/invalid frontmatter). */
export interface PatternParseError {
  readonly filename: string;
  readonly reason: string;
}

/**
 * Category order and display labels. Categories not listed here are appended
 * after these, alphabetically, with a hyphen-to-space title-cased label — so a
 * new category surfaces in the index without a code change, just below the
 * established ones.
 */
const CATEGORY_ORDER: readonly string[] = [
  'code',
  'architecture',
  'process',
  'testing',
  'agent',
  'planning',
  'coordination',
  'coordination-architecture',
  'test-architecture',
  'build-system',
];

/** Title-case a hyphenated key for display (`test-architecture` → `Test Architecture`). */
export function categoryLabel(category: string): string {
  return category
    .split('-')
    .map((part) => (part.length === 0 ? part : part[0].toUpperCase() + part.slice(1)))
    .join(' ');
}

/** The document's first H1 heading text, or `null` when there is none. */
function firstH1(content: string): string | null {
  const match = /^# (.+)$/m.exec(content);
  return match ? match[1].trim() : null;
}

/**
 * Resolve a display name: the `name` frontmatter, else the document's first H1,
 * else a title-cased filename. The corpus is not uniform — a few files omit
 * `name` — so the index degrades gracefully rather than refusing to index them.
 */
function resolveName(frontmatter: string, content: string, filename: string): string {
  // `getFrontmatterValue` already strips surrounding quotes.
  const declared = getFrontmatterValue(frontmatter, 'name');
  if (declared !== '') {
    return declared;
  }
  return firstH1(content) ?? categoryLabel(filename.replace(/\.md$/, ''));
}

/** Parse one pattern file's frontmatter into an entry, or report why it cannot index. */
export function parsePatternEntry(
  filename: string,
  content: string,
): PatternEntry | PatternParseError {
  const frontmatter = extractFrontmatter(content);
  if (frontmatter === null) {
    return { filename, reason: 'no frontmatter block' };
  }
  const category = getFrontmatterValue(frontmatter, 'category');
  if (category === '') {
    // category is the section key — without it the entry cannot be placed.
    return { filename, reason: 'missing frontmatter key: category' };
  }
  const useThisWhen = getFrontmatterValue(frontmatter, 'use_this_when');
  const polarity = getFrontmatterValue(frontmatter, 'polarity');
  return {
    filename,
    name: resolveName(frontmatter, content, filename),
    category,
    useThisWhen: useThisWhen === '' ? undefined : useThisWhen,
    isAntiPattern: polarity === 'anti-pattern',
  };
}

/** Order categories: known ones first (fixed order), then any others alphabetically. */
function orderedCategories(present: ReadonlySet<string>): string[] {
  const known = CATEGORY_ORDER.filter((c) => present.has(c));
  const extra = [...present]
    .filter((c) => !CATEGORY_ORDER.includes(c))
    .sort((a, b) => a.localeCompare(b));
  return [...known, ...extra];
}

/** Render one entry line in the index's house format. */
function renderEntryLine(entry: PatternEntry): string {
  const anti = entry.isAntiPattern ? ' *(anti-pattern)*' : '';
  const link = `→ [${entry.filename}](${entry.filename})`;
  if (entry.useThisWhen === undefined) {
    return `- **${entry.name}**${anti} ${link}`;
  }
  const useWhen = entry.useThisWhen.endsWith('.') ? entry.useThisWhen : `${entry.useThisWhen}.`;
  return `- **${entry.name}**${anti} -- Use this when: ${useWhen} ${link}`;
}

/**
 * Render the full "## Pattern Index" section body (heading included) from entries,
 * grouped by category in {@link CATEGORY_ORDER}, each group sorted by name, with a
 * live `(count)` per section.
 */
export function renderPatternIndex(entries: readonly PatternEntry[]): string {
  const byCategory = new Map<string, PatternEntry[]>();
  for (const entry of entries) {
    const bucket = byCategory.get(entry.category) ?? [];
    bucket.push(entry);
    byCategory.set(entry.category, bucket);
  }
  const sections = orderedCategories(new Set(byCategory.keys())).map((category) => {
    const group = [...(byCategory.get(category) ?? [])].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    const lines = group.map(renderEntryLine).join('\n');
    return `### ${categoryLabel(category)} (${String(group.length)})\n\n${lines}`;
  });
  return `${PATTERN_INDEX_HEADING}\n\n${sections.join('\n\n')}\n`;
}

/**
 * Replace the README's Pattern Index section (from {@link PATTERN_INDEX_HEADING} to
 * end of file) with a freshly generated one, preserving everything above it.
 */
export function spliceIndexSection(readme: string, generatedSection: string): string {
  // Anchor at line start so the heading is found whether or not it is followed
  // by a newline (e.g. at EOF), and never matches a longer heading as a substring.
  const match = new RegExp(`^${PATTERN_INDEX_HEADING}$`, 'm').exec(readme);
  if (match === null) {
    // No section yet: append after a trailing newline.
    const base = readme.endsWith('\n') ? readme : `${readme}\n`;
    return `${base}\n${generatedSection}`;
  }
  return `${readme.slice(0, match.index)}${generatedSection}`;
}
