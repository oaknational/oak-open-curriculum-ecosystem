import { createHash } from 'node:crypto';
import type { CurrentItemEvidenceTarget, TokenAnchor } from './current-source-model.js';

const TOKEN_PATTERN = /[\p{L}\p{N}_]+|[^\s\p{L}\p{N}_]/gu;
const WORD_TOKEN_PATTERN = /[\p{L}\p{N}_]/u;

/** A token paired with its half-open span in the normalised content. */
interface OffsetToken {
  readonly token: string;
  readonly start: number;
  readonly end: number;
}

/**
 * Normalises content so neither Unicode form nor source escaping becomes part
 * of item identity. Offsets returned by {@link tokenizeItemEvidenceWithOffsets}
 * index into this normalised string, not the raw file.
 */
function normaliseItemEvidence(content: string): string {
  return content.normalize('NFC').replaceAll(/\\(?=[`'"])/g, '');
}

/** Tokenises normalised content, keeping each token's span. */
function tokenizeItemEvidenceWithOffsets(normalised: string): readonly OffsetToken[] {
  return [...normalised.matchAll(TOKEN_PATTERN)].map((match) => ({
    token: match[0],
    start: match.index,
    end: match.index + match[0].length,
  }));
}

/** Tokenises content without making source formatting part of item identity. */
function tokenizeItemEvidence(content: string): readonly string[] {
  return tokenizeItemEvidenceWithOffsets(normaliseItemEvidence(content)).map(
    (offsetToken) => offsetToken.token,
  );
}

function tokenHash(tokens: readonly string[]): string {
  return createHash('sha256').update(tokens.join('\u0000')).digest('hex');
}

function chooseIndexToken(
  anchorTokens: readonly string[],
  targetTokens: readonly string[],
): { readonly indexToken: string; readonly indexOffset: number } {
  const frequency = new Map<string, number>();
  for (const token of targetTokens) {
    frequency.set(token, (frequency.get(token) ?? 0) + 1);
  }
  const candidates = anchorTokens
    .map((token, indexOffset) => ({
      indexToken: token,
      indexOffset,
      frequency: frequency.get(token) ?? 0,
      isWord: WORD_TOKEN_PATTERN.test(token),
    }))
    .filter((candidate) => candidate.frequency > 0)
    .sort(
      (left, right) =>
        Number(right.isWord) - Number(left.isWord) ||
        left.frequency - right.frequency ||
        right.indexToken.length - left.indexToken.length ||
        left.indexOffset - right.indexOffset,
    );
  const selected = candidates[0];
  if (selected === undefined) {
    throw new Error('Item anchor has no token present in its target source');
  }
  return { indexToken: selected.indexToken, indexOffset: selected.indexOffset };
}

/** Builds a compact, movable item anchor from reviewed source text. */
export function buildTokenAnchor(anchorContent: string, targetContent: string): TokenAnchor {
  const anchorTokens = tokenizeItemEvidence(anchorContent);
  if (anchorTokens.length === 0) {
    throw new Error('Item anchor content must contain at least one token');
  }
  const targetTokens = tokenizeItemEvidence(targetContent);
  const index = chooseIndexToken(anchorTokens, targetTokens);
  const anchor: TokenAnchor = {
    tokenCount: anchorTokens.length,
    tokenSha256: tokenHash(anchorTokens),
    ...index,
  };
  if (!tokenAnchorIsPresent(anchor, targetTokens)) {
    throw new Error('Item anchor content is not present in its target source');
  }
  return anchor;
}

function tokenAnchorIsPresent(anchor: TokenAnchor, targetTokens: readonly string[]): boolean {
  return tokenAnchorMatchStarts(anchor, targetTokens).length > 0;
}

function tokenAnchorMatchStarts(
  anchor: TokenAnchor,
  targetTokens: readonly string[],
): readonly number[] {
  const starts: number[] = [];
  for (let index = 0; index < targetTokens.length; index += 1) {
    if (targetTokens[index] !== anchor.indexToken) {
      continue;
    }
    const start = index - anchor.indexOffset;
    if (start < 0 || start + anchor.tokenCount > targetTokens.length) {
      continue;
    }
    const candidate = targetTokens.slice(start, start + anchor.tokenCount);
    if (tokenHash(candidate) === anchor.tokenSha256) {
      starts.push(start);
    }
  }
  return starts;
}

/**
 * Locate the current source text one reviewed anchor covers.
 *
 * @remarks
 * The content workspace renders what an item says *today* rather than its
 * 2026-07-09 baseline snippet, and this is how it gets there: the anchor
 * already proves which token run is the item, so the same match yields the
 * text. It lives beside the tokeniser deliberately — a second, drifting copy
 * of the tokenisation would silently mis-quote reviewed content.
 *
 * The returned text is a slice of the *normalised* content (NFC, source
 * escaping before a backtick or quote removed), so it is the item's words
 * rather than its exact file bytes.
 *
 * @returns The covered text, or `null` when the anchor no longer matches.
 */
export function locateAnchoredText(anchor: TokenAnchor, content: string): string | null {
  const normalised = normaliseItemEvidence(content);
  const offsetTokens = tokenizeItemEvidenceWithOffsets(normalised);
  const starts = tokenAnchorMatchStarts(
    anchor,
    offsetTokens.map((offsetToken) => offsetToken.token),
  );
  const start = starts[0];
  if (start === undefined) {
    return null;
  }
  const firstToken = offsetTokens[start];
  const lastToken = offsetTokens[start + anchor.tokenCount - 1];
  if (firstToken === undefined || lastToken === undefined) {
    return null;
  }
  return normalised.slice(firstToken.start, lastToken.end);
}

function anchorsHaveDistinctMatches(
  anchors: readonly TokenAnchor[],
  targetTokens: readonly string[],
): boolean {
  const candidatesByAnchor = anchors.map((anchor) => tokenAnchorMatchStarts(anchor, targetTokens));
  const anchorByMatchedStart = new Map<number, number>();

  const assignDistinctStart = (anchorIndex: number, visitedStarts: Set<number>): boolean => {
    const candidates = candidatesByAnchor[anchorIndex] ?? [];
    for (const start of candidates) {
      if (visitedStarts.has(start)) {
        continue;
      }
      visitedStarts.add(start);
      const displacedAnchor = anchorByMatchedStart.get(start);
      if (displacedAnchor === undefined || assignDistinctStart(displacedAnchor, visitedStarts)) {
        anchorByMatchedStart.set(start, anchorIndex);
        return true;
      }
    }
    return false;
  };

  return anchors.every((_, anchorIndex) => assignDistinctStart(anchorIndex, new Set()));
}

/** Requires reviewed anchors to retain distinct occurrences in one payload. */
export function requireTokenAnchorsPresent(
  label: string,
  anchors: readonly TokenAnchor[],
  content: string,
  location?: string,
): void {
  if (anchors.length === 0 || !anchorsHaveDistinctMatches(anchors, tokenizeItemEvidence(content))) {
    const locationSuffix = location === undefined ? '' : ` in ${location}`;
    throw new Error(`${label} anchors lack distinct occurrences${locationSuffix}`);
  }
}

/** Requires every reviewed anchor for one audit item to remain present. */
export function requireItemEvidenceTargets(
  auditId: string,
  targets: readonly CurrentItemEvidenceTarget[],
  contentByFile: ReadonlyMap<string, string>,
): void {
  if (targets.length === 0) {
    throw new Error(`Current audit item ${auditId} has no evidence targets`);
  }
  for (const target of targets) {
    const content = contentByFile.get(target.file);
    if (content === undefined) {
      throw new Error(`Current audit item ${auditId} evidence file is absent: ${target.file}`);
    }
    if (target.anchors.length === 0) {
      throw new Error(`Current audit item ${auditId} has no anchors for ${target.file}`);
    }
    requireTokenAnchorsPresent(
      `Current audit item ${auditId}`,
      target.anchors,
      content,
      target.file,
    );
  }
}
