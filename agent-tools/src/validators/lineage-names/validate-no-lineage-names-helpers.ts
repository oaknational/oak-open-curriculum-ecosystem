/**
 * Pure helpers for the lineage-name leak validator.
 *
 * @remarks
 * The Practice was transplanted from another lineage (the provenance chain in
 * `.agent/practice-core/provenance.yml` tells that story). Its names belong in
 * the records that tell it, never on a live surface: a fixture URL, a package
 * manifest, a reference link or a comment carrying the lineage's organisation
 * or repository reads as this estate's fact and leaks the transplant into
 * product and tooling.
 *
 * The needle set is DECLARED once, in the `lineage-name` scoped block of
 * `.agent/hooks/policy.json`, the block the PreToolUse write-hook also reads,
 * so the commit and CI gate and the write-time guard match the same names and
 * exempt exactly the same files (the records: provenance, changelog, memory,
 * reports, plans, the transplant exploration; the site's content directory
 * and the LinkedIn workspace, where the lineage's organisation is a fact about
 * the owner's work). It is declared rather than derived because the chain
 * cannot select the lineage: it names the owner's own earlier repositories
 * beside it, and the organisation login appears in no provenance field.
 *
 * Matching is case-insensitive and literal: a lineage name is a name, not a
 * pattern, and a name in any letter case is the same leak. The block is
 * therefore refused when it is not a literal block, when it declares a name
 * the hook would read differently (padded, empty or duplicate), or when the
 * policy carries more than one such block (the hook evaluates every scoped
 * group; the gate must not read only the first).
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';

import { type ScanFile } from '../../core/tracked-file-scan.js';
import { isPathInScope } from '../../hook-policy/path-scope.js';
import { type ScopedContentBlockGroup } from '../../hook-policy/types.js';

export type { ScanFile };

/** A single lineage-name occurrence. */
export interface LineageNameHit {
  readonly file: string;
  readonly line: number;
  readonly column: number;
  readonly text: string;
}

/** The policy concept name for the lineage-name block. */
const LINEAGE_NAME_CONCEPT = 'lineage-name';

/**
 * Select the one lineage-name block from the policy's scoped content blocks.
 *
 * @returns the block; `undefined` when the policy defines none (an estate
 *   not transplanted from another declares no lineage names, so there is
 *   nothing to check); an error naming the refusal when it defines more than
 *   one (the hook evaluates every group, so a second block would guard writes
 *   the gate never scans)
 */
export function selectLineageNameBlock(
  blocks: readonly ScopedContentBlockGroup[],
): Result<ScopedContentBlockGroup | undefined, string> {
  const matching = blocks.filter((block) => block.concept === LINEAGE_NAME_CONCEPT);
  const [block] = matching;
  if (block === undefined) {
    return ok(undefined);
  }
  if (matching.length > 1) {
    return err(
      `${String(matching.length)} \`lineage-name\` blocks in .agent/hooks/policy.json; exactly one is required`,
    );
  }
  return ok(block);
}

/**
 * The ways the block's declaration and the hook's reading of it would part:
 * a non-literal kind (the gate matches names, never patterns), a padded or
 * empty name (the hook matches it raw, the gate would have to trim), or a
 * duplicate. A block carrying one is refused so the two never diverge.
 */
export function needleDefects(block: ScopedContentBlockGroup): string[] {
  const defects: string[] = [];
  if (block.kind !== undefined && block.kind !== 'literal') {
    defects.push(`kind ${JSON.stringify(block.kind)} (the gate matches literal names only)`);
  }
  const seen = new Set<string>();
  for (const pattern of block.patterns) {
    if (pattern !== pattern.trim() || pattern === '') {
      defects.push(`padded or empty name ${JSON.stringify(pattern)}`);
    }
    const lower = pattern.trim().toLowerCase();
    if (seen.has(lower)) {
      defects.push(`duplicate name ${JSON.stringify(pattern)}`);
    }
    seen.add(lower);
  }
  return defects;
}

/** The needle set: the block's declared names as written (a block with defects is refused first). */
export function lineageNeedles(block: ScopedContentBlockGroup): string[] {
  return [...block.patterns];
}

/**
 * Scan one file's content for lineage names, case-insensitively and literally.
 *
 * @remarks
 * Every line is inspected (fences included). At most one hit is recorded per
 * line, enough to flag it; the text recorded is the needle as it appears.
 */
export function findLineageNameHits(
  file: string,
  content: string,
  needles: readonly string[],
): LineageNameHit[] {
  const lowered = needles.map((needle) => needle.toLowerCase());
  const hits: LineageNameHit[] = [];
  content.split('\n').forEach((rawLine, index) => {
    const line = rawLine.toLowerCase();
    for (const needle of lowered) {
      const at = line.indexOf(needle);
      if (at !== -1) {
        hits.push({
          file,
          line: index + 1,
          column: at + 1,
          text: rawLine.slice(at, at + needle.length),
        });
        break;
      }
    }
  });
  return hits;
}

/**
 * Scan many files for lineage names, honouring the block's include / exclude
 * path scoping (via {@link isPathInScope}).
 */
export function scanForLineageNames(
  files: readonly ScanFile[],
  block: ScopedContentBlockGroup,
  needles: readonly string[],
): LineageNameHit[] {
  const hits: LineageNameHit[] = [];
  for (const file of files) {
    if (!isPathInScope(file.path, block.include_paths, block.exclude_paths)) {
      continue;
    }
    hits.push(...findLineageNameHits(file.path, file.content, needles));
  }
  return hits;
}
