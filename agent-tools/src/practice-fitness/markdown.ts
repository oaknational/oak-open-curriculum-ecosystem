type FitnessLineKind =
  'frontmatter' | 'code-fence' | 'code-block' | 'table' | 'link-reference' | 'prose';

export interface ClassifiedLine {
  readonly text: string;
  readonly kind: FitnessLineKind;
  readonly lineNumber: number;
}

export function extractFrontmatter(content: string): string | null {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(content);
  return match?.[1] ?? null;
}

export function getFrontmatterNumber(frontmatter: string | null, key: string): number | null {
  const escapedKey = key.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
  const regex = new RegExp(String.raw`^${escapedKey}:\s*(.+)$`, 'm');
  const match = frontmatter?.match(regex);
  if (!match) {
    return null;
  }
  const num = Number(match[1].trim());
  return Number.isNaN(num) ? null : num;
}

export function getFrontmatterString(frontmatter: string | null, key: string): string | null {
  const escapedKey = key.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
  const regex = new RegExp(String.raw`^${escapedKey}:\s*(.+)$`, 'm');
  const match = frontmatter?.match(regex);
  return match?.[1]?.trim() ?? null;
}

function classifyContentLine(
  text: string,
  lineNumber: number,
  inCodeBlock: boolean,
): ClassifiedLine {
  if (/^(`{3,}|~{3,})/.test(text)) {
    return { text, kind: 'code-fence', lineNumber };
  }

  if (inCodeBlock) {
    return { text, kind: 'code-block', lineNumber };
  }

  if (text.trim().startsWith('|')) {
    return { text, kind: 'table', lineNumber };
  }

  if (/^\[[\w.-]+\]:\s/.test(text.trim())) {
    return { text, kind: 'link-reference', lineNumber };
  }

  return { text, kind: 'prose', lineNumber };
}

export function classifyLines(content: string): ClassifiedLine[] {
  const lines = content.split('\n');
  let inCodeBlock = false;
  let inFrontmatter = false;
  let frontmatterFenceCount = 0;

  return lines.map((text, index) => {
    const lineNumber = index + 1;
    if (/^---\s*$/.test(text) && frontmatterFenceCount < 2) {
      frontmatterFenceCount += 1;
      inFrontmatter = frontmatterFenceCount === 1;
      return { text, kind: 'frontmatter', lineNumber };
    }

    if (inFrontmatter) {
      return { text, kind: 'frontmatter', lineNumber };
    }

    const line = classifyContentLine(text, lineNumber, inCodeBlock);
    if (line.kind === 'code-fence') {
      inCodeBlock = !inCodeBlock;
    }
    return line;
  });
}

export function extractFitnessContentText(content: string): string {
  return classifyLines(content)
    .filter((line) => line.kind !== 'frontmatter')
    .map((line) => line.text)
    .join('\n');
}

/**
 * Measure the *wrappable* width of a prose line.
 *
 * The line-length check exists to flag prose a human could and should wrap.
 * Inline markdown link targets and bare/auto-linked URLs are not wrappable —
 * a URL cannot be broken across lines — so they must not count toward the
 * width. Inline links keep their visible text (which is wrappable prose); the
 * `(target)`, autolinks, and bare URLs are removed before measuring. A line
 * that is long only because of a link or URL therefore measures short, while a
 * genuinely long prose sentence is unaffected and still flagged.
 */
export function measurableProseWidth(text: string): number {
  // Inline links and images — `[text](target)` / `![alt](target)`. Keep the
  // visible text/alt (wrappable); drop the unwrappable target. The target may
  // contain one level of balanced parentheses (e.g. a Wikipedia URL such as
  // `.../Foo_(bar)`) and an optional `"title"`; the optional leading `!`
  // (image marker) is consumed so it leaves no stray character.
  const withoutInlineLinkTargets = text.replaceAll(
    /!?\[([^\]]*)\]\((?:[^()]|\([^()]*\))*\)/g,
    '$1',
  );
  // Autolinked URLs — `<https://…>`.
  const withoutAutolinks = withoutInlineLinkTargets.replaceAll(/<https?:\/\/[^>]*>/g, '');
  // Bare URLs in prose. Stop at whitespace or a closing bracket/paren so a URL
  // wrapped in author punctuation does not consume that punctuation.
  const withoutBareUrls = withoutAutolinks.replaceAll(/https?:\/\/[^\s)\]]+/g, '');
  return withoutBareUrls.length;
}
