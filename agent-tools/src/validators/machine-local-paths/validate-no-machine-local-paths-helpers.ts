/**
 * Pure helpers for the machine-local-path validator.
 *
 * @remarks
 * The validator enforces the `no-machine-local-paths` invariant over every
 * tracked file: a version-controlled file MUST NOT contain a user-home or
 * machine-temp absolute path (`/Users/<seg>`, `/home/<seg>`, `C:\Users\<seg>`,
 * `/private/tmp`, `/var/folders`). Such a path resolves only on one machine and
 * often leaks a username (PII).
 *
 * The pattern set is single-sourced from the `machine-local-path`
 * `preToolUseContent` scoped block in `.agent/hooks/policy.json` (the same block
 * the PreToolUse write-hook uses), so the commit/CI gate and the write-time
 * guard never drift. Path scoping reuses {@link isPathInScope} — the same
 * include/exclude semantics as the hook — so the two enforcement points exempt
 * exactly the same files (the pattern-defining doctrine surfaces).
 *
 * Unlike the hook's line matcher, this scan is **strict**: it inspects every
 * line, including fenced code blocks, because a machine-local path in a fenced
 * command example is still a machine-local path in a committed file.
 *
 * @packageDocumentation
 */

import { isPathInScope } from '../../hook-policy/matchers.js';
import { type ScopedContentBlockGroup } from '../../hook-policy/types.js';

/** A single machine-local path occurrence. */
export interface MachineLocalPathHit {
  readonly file: string;
  readonly line: number;
  readonly column: number;
  readonly text: string;
}

/** A file to scan: its repo-relative path and full text content. */
export interface ScanFile {
  readonly path: string;
  readonly content: string;
}

/** The policy concept name for the machine-local-path block. */
const MACHINE_LOCAL_PATH_CONCEPT = 'machine-local-path';

/**
 * Select the machine-local-path block from the policy's scoped content blocks.
 *
 * @returns the block, or `undefined` when the policy does not define it.
 */
export function selectMachineLocalBlock(
  blocks: readonly ScopedContentBlockGroup[],
): ScopedContentBlockGroup | undefined {
  return blocks.find((block) => block.concept === MACHINE_LOCAL_PATH_CONCEPT);
}

/**
 * Scan one file's content for machine-local path patterns.
 *
 * @remarks
 * Every line is inspected (fences included). At most one hit is recorded per
 * line — enough to flag the line — to keep output readable. Patterns are applied
 * case-sensitively, matching the canonical path forms.
 */
export function findMachineLocalPathHits(
  file: string,
  content: string,
  patterns: readonly string[],
): MachineLocalPathHit[] {
  const regexes = patterns.map((pattern) => new RegExp(pattern));
  const hits: MachineLocalPathHit[] = [];

  content.split('\n').forEach((rawLine, index) => {
    for (const regex of regexes) {
      const match = regex.exec(rawLine);
      if (match !== null) {
        hits.push({ file, line: index + 1, column: match.index + 1, text: match[0] });
        break;
      }
    }
  });

  return hits;
}

/**
 * Scan many files for machine-local paths, honouring the block's include /
 * exclude path scoping (via {@link isPathInScope}).
 */
export function scanForMachineLocalPaths(
  files: readonly ScanFile[],
  block: ScopedContentBlockGroup,
): MachineLocalPathHit[] {
  const hits: MachineLocalPathHit[] = [];

  for (const file of files) {
    if (!isPathInScope(file.path, block.include_paths, block.exclude_paths)) {
      continue;
    }
    hits.push(...findMachineLocalPathHits(file.path, file.content, block.patterns));
  }

  return hits;
}
