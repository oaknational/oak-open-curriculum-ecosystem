import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { typeSafeKeys } from '@oaknational/type-helpers';
import {
  CURRENT_SOURCE_DELTA_REVIEWS,
  type CurrentSourceDeltaReview,
} from './current-source-delta-reviews.js';
import type {
  CurrentAuditDisposition,
  CurrentSourceAdditionDisposition,
} from './current-source-model.js';
import { requireSameStringMembers } from './require-same-string-members.js';
import { semanticSourceSha256 } from './semantic-source-sha256.js';

export { semanticSourceSha256 } from './semantic-source-sha256.js';

const DELTA_SCOPE_PATHS = [
  'apps/oak-curriculum-mcp-streamable-http/src',
  'apps/oak-curriculum-mcp-streamable-http/widget/src',
  'packages/sdks/oak-curriculum-sdk/src/mcp',
  'packages/sdks/oak-sdk-codegen/code-generation',
  'packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools',
  'packages/sdks/graph-corpus-sdk/src/eef-strands',
  'packages/sdks/oak-search-sdk/src/retrieval',
] as const;

export interface CurrentSourceDeltaInventory {
  readonly schemaVersion: 2;
  readonly baselineCommit: string;
  readonly files: readonly {
    readonly file: string;
    readonly semanticSha256: string;
    readonly itemIds: readonly string[];
    readonly exclusionReason?: string;
  }[];
}

interface DeltaSourceDependencies {
  readonly git?: (args: readonly string[]) => string;
  readonly readFile?: (file: string) => string;
}

function gitOutput(repoRoot: string, args: readonly string[]): string {
  return execFileSync('git', [...args], { cwd: repoRoot, encoding: 'utf8' });
}

function baselineSource(
  baselineCommit: string,
  file: string,
  git: (args: readonly string[]) => string,
): string | null {
  try {
    return git(['show', `${baselineCommit}:${file}`]);
  } catch {
    return null;
  }
}

interface ChangedSource {
  readonly status: string;
  readonly file: string;
}

function parseChangedSources(output: string): readonly ChangedSource[] {
  return output
    .split('\n')
    .filter((line) => line.length > 0)
    .map((line) => {
      const [status = '', firstPath = '', secondPath] = line.split('\t');
      return { status, file: secondPath ?? firstPath };
    })
    .filter(({ file }) => /\.(?:ts|tsx)$/.test(file))
    .filter(({ file }) => !/\.(?:test|spec)\.(?:ts|tsx)$/.test(file));
}

function parseUntrackedSources(output: string): readonly ChangedSource[] {
  return output
    .split('\n')
    .filter((file) => file.length > 0)
    .map((file) => ({ status: 'A', file }))
    .filter(({ file }) => /\.(?:ts|tsx)$/.test(file))
    .filter(({ file }) => !/\.(?:test|spec)\.(?:ts|tsx)$/.test(file));
}

/** Derives semantic source deltas, including governed files not yet tracked by Git. */
export function deriveCurrentDeltaFiles(
  repoRoot: string,
  baselineCommit: string,
  dependencies: DeltaSourceDependencies = {},
): readonly string[] {
  const git = dependencies.git ?? ((args) => gitOutput(repoRoot, args));
  const readFile = dependencies.readFile ?? ((file) => readFileSync(file, 'utf8'));
  const trackedChanges = parseChangedSources(
    git([
      '-c',
      'core.fsmonitor=false',
      'diff',
      '--diff-filter=ACMRD',
      '--name-status',
      '--find-renames',
      baselineCommit,
      '--',
      ...DELTA_SCOPE_PATHS,
    ]),
  );
  const untrackedChanges = parseUntrackedSources(
    git(['ls-files', '--others', '--exclude-standard', '--', ...DELTA_SCOPE_PATHS]),
  );
  const changedByFile = new Map(
    [...trackedChanges, ...untrackedChanges].map((change) => [change.file, change]),
  );
  return [...changedByFile.values()]
    .filter(({ status, file }) => {
      if (!status.startsWith('M')) {
        return true;
      }
      const baseline = baselineSource(baselineCommit, file, git);
      const current = readFile(path.join(repoRoot, file));
      return (
        baseline === null ||
        semanticSourceSha256(baseline, file) !== semanticSourceSha256(current, file)
      );
    })
    .map(({ file }) => file)
    .sort((left, right) => left.localeCompare(right));
}

/** Reads each delta file's current content; a deleted file reads its baseline tombstone content. */
export function readDeltaContent(
  repoRoot: string,
  baselineCommit: string,
  files: readonly string[],
  dependencies: DeltaSourceDependencies = {},
): ReadonlyMap<string, string> {
  const git = dependencies.git ?? ((args) => gitOutput(repoRoot, args));
  const readFile = dependencies.readFile ?? ((file) => readFileSync(file, 'utf8'));
  return new Map(
    files.map((file) => {
      if (existsSync(path.join(repoRoot, file))) {
        return [file, readFile(path.join(repoRoot, file))] as const;
      }
      const baseline = baselineSource(baselineCommit, file, git);
      if (baseline === null) {
        throw new Error(`Deleted delta source has no baseline content: ${file}`);
      }
      return [file, baseline] as const;
    }),
  );
}

function filesByItemId(
  current: readonly CurrentAuditDisposition[],
  additions: readonly CurrentSourceAdditionDisposition[],
): ReadonlyMap<string, readonly string[]> {
  const pairs = [
    ...current.flatMap((item) => item.files.map((file) => [item.auditId, file] as const)),
    ...additions.map((item) => [item.id, item.file] as const),
  ];
  const ids = new Set(pairs.map(([id]) => id));
  return new Map(
    [...ids].map((id) => [
      id,
      pairs
        .filter(([candidate]) => candidate === id)
        .map(([, file]) => file)
        .sort((left, right) => left.localeCompare(right)),
    ]),
  );
}

function validateReview(
  file: string,
  content: string,
  review: CurrentSourceDeltaReview,
  filesById: ReadonlyMap<string, readonly string[]>,
): void {
  const actualHash = semanticSourceSha256(content, file);
  if (review.semanticSha256 !== actualHash) {
    throw new Error(
      `Reviewed semantic delta is stale for ${file}: expected ${review.semanticSha256}, received ${actualHash}`,
    );
  }
  const hasItems = review.itemIds.length > 0;
  // A blank reason is not a disposition — only non-blank text explains why a
  // changed governed source carries no item ids.
  const hasExclusion =
    review.exclusionReason !== undefined && review.exclusionReason.trim().length > 0;
  if (hasItems === hasExclusion) {
    throw new Error(
      `Reviewed semantic delta ${file} must have item ids or one exclusion reason, not both`,
    );
  }
  requireSameStringMembers(`Unique reviewed semantic-delta item ids for ${file}`, review.itemIds, [
    ...new Set(review.itemIds),
  ]);
  for (const itemId of review.itemIds) {
    const files = filesById.get(itemId);
    if (files === undefined) {
      throw new Error(`Reviewed semantic delta ${file} cites unknown item id ${itemId}`);
    }
    if (!files.includes(file)) {
      throw new Error(`Reviewed semantic delta ${file} cites unrelated item id ${itemId}`);
    }
  }
}

/** Recomputes the governed semantic-delta file and item inventory. */
export function buildCurrentSourceDeltaInventory(input: {
  readonly baselineCommit: string;
  readonly changedFiles: readonly string[];
  readonly contentByFile: ReadonlyMap<string, string>;
  readonly current: readonly CurrentAuditDisposition[];
  readonly additions: readonly CurrentSourceAdditionDisposition[];
  readonly reviews?: Readonly<Record<string, CurrentSourceDeltaReview>>;
}): CurrentSourceDeltaInventory {
  const reviews = input.reviews ?? CURRENT_SOURCE_DELTA_REVIEWS;
  requireSameStringMembers(
    'Reviewed semantic-delta files',
    typeSafeKeys(reviews),
    input.changedFiles,
  );
  const itemFiles = filesByItemId(input.current, input.additions);
  return {
    schemaVersion: 2,
    baselineCommit: input.baselineCommit,
    files: input.changedFiles.map((file) => {
      const content = input.contentByFile.get(file);
      if (content === undefined) {
        throw new Error(`Current semantic-delta source is absent: ${file}`);
      }
      const review = reviews[file];
      if (review === undefined) {
        throw new Error(`Current semantic-delta review is absent: ${file}`);
      }
      validateReview(file, content, review, itemFiles);
      return {
        file,
        semanticSha256: review.semanticSha256,
        itemIds: review.itemIds,
        ...(review.exclusionReason === undefined
          ? {}
          : { exclusionReason: review.exclusionReason }),
      };
    }),
  };
}
