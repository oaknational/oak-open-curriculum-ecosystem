/**
 * The mechanical subject predicate — the census's source of truth for
 * WHAT gets a row. The union of:
 * (i)   every pnpm workspace member;
 * (ii)  the parent directory of every tracked `package.json` that is
 *       neither a member directory nor nested under one (surfaces the
 *       member list cannot see);
 * (ii-b) the parent directory of every tracked `.claude-plugin/plugin.json`
 *       manifest (owner-approved amendment, 2026-08-14 — plugin surfaces
 *       carry no package.json and no code-extension files);
 * (iii) every top-level path segment holding tracked code files (the
 *       declared code-extension set) that are not themselves inside a
 *       directory covered by (i), (ii), or (ii-b) — a segment with a
 *       nested subject AND code outside it still gets its code root
 *       (partially covered subtrees are preserved, never skipped).
 */
import { compareStrings } from './compare.js';
import { CODE_EXTENSIONS } from './vocabulary.js';

type SubjectSource = 'pnpm-member' | 'package-json-parent' | 'plugin-manifest-parent' | 'code-root';

export interface CensusSubject {
  readonly dirPath: string;
  readonly publishedName: string | null;
  readonly sources: readonly SubjectSource[];
}

export interface DeriveSubjectsInput {
  readonly members: readonly { readonly name: string; readonly path: string }[];
  readonly trackedFiles: readonly string[];
  readonly codeExtensions?: readonly string[];
}

interface SubjectDraft {
  publishedName: string | null;
  readonly sources: Set<SubjectSource>;
}

type DraftMap = Map<string, SubjectDraft>;

function parentDir(filePath: string): string {
  const lastSlash = filePath.lastIndexOf('/');
  return lastSlash === -1 ? '.' : filePath.slice(0, lastSlash);
}

function topSegment(filePath: string): string {
  const firstSlash = filePath.indexOf('/');
  return firstSlash === -1 ? '.' : filePath.slice(0, firstSlash);
}

function isUnder(candidate: string, root: string): boolean {
  return candidate === root || candidate.startsWith(`${root}/`);
}

function record(
  drafts: DraftMap,
  dirPath: string,
  source: SubjectSource,
  publishedName: string | null,
): void {
  const existing = drafts.get(dirPath);
  if (existing === undefined) {
    drafts.set(dirPath, { publishedName, sources: new Set([source]) });
    return;
  }
  existing.sources.add(source);
  if (existing.publishedName === null && publishedName !== null) {
    existing.publishedName = publishedName;
  }
}

function collectPackageJsonParents(drafts: DraftMap, input: DeriveSubjectsInput): void {
  const memberPaths = input.members.map((member) => member.path);
  for (const filePath of input.trackedFiles) {
    if (filePath !== 'package.json' && !filePath.endsWith('/package.json')) {
      continue;
    }
    const dir = parentDir(filePath);
    if (memberPaths.some((memberPath) => isUnder(dir, memberPath))) {
      continue;
    }
    record(drafts, dir, 'package-json-parent', null);
  }
}

const PLUGIN_MANIFEST_SUFFIX = '/.claude-plugin/plugin.json';

function collectPluginManifestParents(drafts: DraftMap, input: DeriveSubjectsInput): void {
  const memberPaths = input.members.map((member) => member.path);
  for (const filePath of input.trackedFiles) {
    if (!filePath.endsWith(PLUGIN_MANIFEST_SUFFIX)) {
      continue;
    }
    const dir = filePath.slice(0, filePath.length - PLUGIN_MANIFEST_SUFFIX.length);
    if (dir === '' || memberPaths.some((memberPath) => isUnder(dir, memberPath))) {
      continue;
    }
    record(drafts, dir, 'plugin-manifest-parent', null);
  }
}

function collectCodeRoots(drafts: DraftMap, input: DeriveSubjectsInput): void {
  const extensions = input.codeExtensions ?? CODE_EXTENSIONS;
  const coveredRoots = [...drafts.keys()];
  for (const filePath of input.trackedFiles) {
    if (!extensions.some((extension) => filePath.endsWith(extension))) {
      continue;
    }
    // Coverage is judged per FILE, never per segment: a top segment with
    // a nested subject and code outside it keeps its code root.
    const dir = parentDir(filePath);
    const fileCovered = coveredRoots.some((root) => root !== '.' && isUnder(dir, root));
    if (fileCovered) {
      continue;
    }
    record(drafts, topSegment(filePath), 'code-root', null);
  }
}

/** Derive the census subject set from the mechanical predicate above. */
export function deriveSubjects(input: DeriveSubjectsInput): CensusSubject[] {
  const drafts: DraftMap = new Map();
  for (const member of input.members) {
    record(drafts, member.path, 'pnpm-member', member.name);
  }
  collectPackageJsonParents(drafts, input);
  collectPluginManifestParents(drafts, input);
  collectCodeRoots(drafts, input);

  return [...drafts.entries()]
    .map(([dirPath, draft]) => ({
      dirPath,
      publishedName: draft.publishedName,
      sources: [...draft.sources].sort(compareStrings),
    }))
    .sort((a, b) => compareStrings(a.dirPath, b.dirPath));
}
