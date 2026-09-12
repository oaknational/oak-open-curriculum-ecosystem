/**
 * Per-skill comparison for the skill-copy validator: the byte comparison of a
 * shared skill's two trees, and the walk of a derived copy-only skill for
 * content that must not ship.
 *
 * @remarks
 * Pure; operates on the trees the reader produced. Membership decisions
 * (which skills are shared, source-only, copy-only, derived) live in
 * `plugin-skill-copies.ts`; the exit decision lives in
 * `plugin-skill-copies-verdict.ts`.
 *
 * @packageDocumentation
 */

/** One entry of a skill directory: a regular file's bytes, or a symlink (never followed). */
export type SkillEntry =
  { readonly kind: 'file'; readonly bytes: Uint8Array } | { readonly kind: 'symlink' };

/** The entries of one skill directory, keyed by path relative to that directory. */
export type SkillTree = ReadonlyMap<string, SkillEntry>;

/** The file a directory must hold, as a regular file, to count as a skill (Agent Skills specification). */
export const SKILL_MANIFEST = 'SKILL.md';

/**
 * One difference between source and copy, addressed by skill and skill-relative
 * path. `not-shipped` is content in the copy that must not ship: authoring-only
 * content, or a directory under the copy root that is not a skill.
 * `missing-derivation` is a copy-only skill with no same-named workflow to
 * derive from.
 */
export interface SkillCopyFinding {
  readonly skill: string;
  readonly relativePath: string;
  readonly kind:
    | 'missing-in-copy'
    | 'missing-in-source'
    | 'content-differs'
    | 'symlink'
    | 'not-shipped'
    | 'missing-derivation';
}

/** Alphabetical order under a fixed locale, so output is identical on every machine. */
export const byText = (a: string, b: string): number => a.localeCompare(b, 'en');

export interface SkillComparison {
  readonly findings: readonly SkillCopyFinding[];
  readonly filesCompared: number;
}

type EntryOutcome = SkillCopyFinding['kind'] | 'identical';

/** Whether a skill-relative path sits under a top-level directory that must not ship. */
function isNotShipped(relativePath: string, notShipped: readonly string[]): boolean {
  const top = relativePath.split('/')[0] ?? '';
  return relativePath.includes('/') && notShipped.includes(top);
}

/** The outcome for one relative path present in at least one tree. */
function compareEntry(
  original: SkillEntry | undefined,
  copied: SkillEntry | undefined,
): EntryOutcome {
  if (original?.kind === 'symlink' || copied?.kind === 'symlink') {
    return 'symlink';
  }
  if (original === undefined) {
    return 'missing-in-source';
  }
  if (copied === undefined) {
    return 'missing-in-copy';
  }
  return Buffer.compare(original.bytes, copied.bytes) === 0 ? 'identical' : 'content-differs';
}

/** The outcome for one path of a shared skill: authoring content in the copy is not shipped, whatever the source holds. */
function sharedEntryOutcome(
  relativePath: string,
  source: SkillTree,
  copy: SkillTree,
  notShipped: readonly string[],
): EntryOutcome {
  const copied = copy.get(relativePath);
  if (copied !== undefined && isNotShipped(relativePath, notShipped)) {
    return 'not-shipped';
  }
  return compareEntry(source.get(relativePath), copied);
}

/**
 * The manifest findings for a shared skill, for the one state the path
 * comparison cannot see: it walks the union of the two trees, so a `SKILL.md`
 * absent from both (vanished after the root listing) leaves matching reference
 * files comparing as identical, and a directory that is no longer a skill
 * passes. A manifest present but not a regular file is already a walk finding.
 */
function vanishedManifestFindings(
  skill: string,
  source: SkillTree,
  copy: SkillTree,
): SkillCopyFinding[] {
  if (source.has(SKILL_MANIFEST) || copy.has(SKILL_MANIFEST)) {
    return [];
  }
  return [
    { skill, relativePath: SKILL_MANIFEST, kind: 'missing-in-source' },
    { skill, relativePath: SKILL_MANIFEST, kind: 'missing-in-copy' },
  ];
}

/** Compare one shared skill's two trees; a tree that cannot be read is a finding on the skill itself. */
export function compareSkill(
  skill: string,
  source: SkillTree | undefined,
  copy: SkillTree | undefined,
  notShipped: readonly string[],
): SkillComparison {
  if (source === undefined || copy === undefined) {
    const kind = source === undefined ? 'missing-in-source' : 'missing-in-copy';
    return { findings: [{ skill, relativePath: '.', kind }], filesCompared: 0 };
  }
  const findings: SkillCopyFinding[] = vanishedManifestFindings(skill, source, copy);
  let filesCompared = 0;
  const paths = new Set([...source.keys(), ...copy.keys()]);
  for (const relativePath of [...paths].sort(byText)) {
    const outcome = sharedEntryOutcome(relativePath, source, copy, notShipped);
    if (outcome === 'identical' || outcome === 'content-differs') {
      filesCompared += 1;
    }
    if (outcome !== 'identical') {
      findings.push({ skill, relativePath, kind: outcome });
    }
  }
  return { findings, filesCompared };
}

/**
 * Findings for a derived copy-only skill: symlinks anywhere, and authoring-only
 * content. A tree that cannot be read (the skill vanished between the root
 * listing and the walk) is a finding on the skill itself, never an empty tree;
 * a tree whose manifest vanished in that window is no longer a skill, and is
 * reported as the directory that is not shipped rather than walked as one.
 */
export function copyOnlyFindings(
  skill: string,
  tree: SkillTree | undefined,
  notShipped: readonly string[],
): SkillCopyFinding[] {
  if (tree === undefined) {
    return [{ skill, relativePath: '.', kind: 'missing-in-copy' }];
  }
  if (tree.get(SKILL_MANIFEST)?.kind !== 'file') {
    return [{ skill, relativePath: '.', kind: 'not-shipped' }];
  }
  const findings: SkillCopyFinding[] = [];
  const entries = [...tree.entries()].sort(([a], [b]) => byText(a, b));
  for (const [relativePath, entry] of entries) {
    if (entry.kind === 'symlink') {
      findings.push({ skill, relativePath, kind: 'symlink' });
    } else if (isNotShipped(relativePath, notShipped)) {
      findings.push({ skill, relativePath, kind: 'not-shipped' });
    }
  }
  return findings;
}
