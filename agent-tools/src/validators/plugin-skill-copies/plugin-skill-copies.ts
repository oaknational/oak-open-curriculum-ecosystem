/**
 * Byte-level drift detection between a plugin's source skills and a checked-in
 * copy of them in a sibling package.
 *
 * @remarks
 * The ChatGPT/Codex package of the Oak plugin carries the shared skills as
 * plain copies, because ChatGPT reads only a plugin's own `skills/` directory
 * and the Claude plugin is not to be restructured. A copy is honest only while
 * it is checked: this module recomputes the comparison from the trees it is
 * given every run and reports every difference by path, so a drift is a named
 * finding rather than a silent divergence.
 *
 * Membership is recomputed too, never listed: a shared skill is any skill
 * directory (one holding a `SKILL.md` file) present under both roots. A new
 * shared skill is covered the moment it exists on both sides, and a skill
 * present on one side only is reported for visibility, not compared
 * (`validators-must-recompute-not-just-record`).
 *
 * Symlinks are never followed. The repository forbids them (principles.md
 * §No symlinks), and a link that happened to resolve to matching bytes would
 * still ship as a link, not as content. A symlink anywhere in a compared tree,
 * or a symlinked entry under a root, is a finding of its own.
 *
 * Pure: the filesystem is injected as a {@link SkillTreeReader} (ADR-078), so
 * the comparison is testable against in-memory trees and the CLI wrapper owns
 * both the real reader and the process exit. The exit decision lives in
 * `plugin-skill-copies-verdict.ts`.
 *
 * @packageDocumentation
 */

/** One entry of a skill directory: a regular file's bytes, or a symlink (never followed). */
export type SkillEntry =
  { readonly kind: 'file'; readonly bytes: Uint8Array } | { readonly kind: 'symlink' };

/** The entries of one skill directory, keyed by path relative to that directory. */
export type SkillTree = ReadonlyMap<string, SkillEntry>;

/** What a root directory holds: skill directories, and any symlinked entries (reported, never followed). */
export interface SkillRootListing {
  /** Names of directories directly under the root that hold a `SKILL.md` file. */
  readonly skills: readonly string[];
  /** Names of entries directly under the root that are symlinks. */
  readonly symlinks: readonly string[];
}

/** Reads skill directories; every method answers `undefined` for a path that does not exist. */
export interface SkillTreeReader {
  readonly listRoot: (root: string) => SkillRootListing | undefined;
  readonly read: (skillDir: string) => SkillTree | undefined;
}

/** What to compare: the two skill roots. Which skills are shared is discovered from them. */
export interface SkillCopyCheck {
  /** Root holding the authoritative skills. */
  readonly sourceRoot: string;
  /** Root holding the copies. */
  readonly copyRoot: string;
}

/** One difference between source and copy, addressed by skill and skill-relative path. */
export interface SkillCopyFinding {
  readonly skill: string;
  readonly relativePath: string;
  readonly kind: 'missing-in-copy' | 'missing-in-source' | 'content-differs' | 'symlink';
}

/** The outcome: what was discovered, what differed, and how much was compared. */
export interface SkillCopyReport {
  /** Skills present under both roots, in stable order; these are the ones compared. */
  readonly sharedSkills: readonly string[];
  /** Skills present under the source root only; reported, not compared. */
  readonly sourceOnly: readonly string[];
  /** Skills present under the copy root only; reported, not compared. */
  readonly copyOnly: readonly string[];
  readonly findings: readonly SkillCopyFinding[];
  /** File pairs compared, so an empty scan cannot pass as clean. */
  readonly filesCompared: number;
}

/** Alphabetical order under a fixed locale, so output is identical on every machine. */
const byText = (a: string, b: string): number => a.localeCompare(b, 'en');

/** Join a root and a skill name with `/`, the separator both readers understand. */
function skillPath(root: string, skill: string): string {
  return `${root}/${skill}`;
}

interface SkillComparison {
  readonly findings: readonly SkillCopyFinding[];
  readonly filesCompared: number;
}

const EMPTY_ROOT: SkillRootListing = { skills: [], symlinks: [] };

/**
 * Discover the shared skills between the two roots and report each difference.
 *
 * @param check - the two roots.
 * @param reader - how roots and skill directories are read; the CLI passes the real filesystem.
 * @returns the discovered membership, every finding in deterministic (skill, path) order,
 *   and the number of file pairs compared.
 */
export function findSkillCopyDrift(
  check: SkillCopyCheck,
  reader: SkillTreeReader,
): SkillCopyReport {
  const source = reader.listRoot(check.sourceRoot) ?? EMPTY_ROOT;
  const copy = reader.listRoot(check.copyRoot) ?? EMPTY_ROOT;
  const sourceSet = new Set(source.skills);
  const copySet = new Set(copy.skills);
  const sharedSkills = source.skills.filter((skill) => copySet.has(skill)).sort(byText);
  const sourceOnly = source.skills.filter((skill) => !copySet.has(skill)).sort(byText);
  const copyOnly = copy.skills.filter((skill) => !sourceSet.has(skill)).sort(byText);

  const findings: SkillCopyFinding[] = [...new Set([...source.symlinks, ...copy.symlinks])]
    .sort(byText)
    .map((name) => ({ skill: name, relativePath: '.', kind: 'symlink' as const }));
  let filesCompared = 0;
  for (const skill of sharedSkills) {
    const one = compareSkill(
      skill,
      reader.read(skillPath(check.sourceRoot, skill)),
      reader.read(skillPath(check.copyRoot, skill)),
    );
    findings.push(...one.findings);
    filesCompared += one.filesCompared;
  }
  return { sharedSkills, sourceOnly, copyOnly, findings, filesCompared };
}

/** Compare one shared skill's two trees; a tree that cannot be read is a finding on the skill itself. */
function compareSkill(
  skill: string,
  source: SkillTree | undefined,
  copy: SkillTree | undefined,
): SkillComparison {
  if (source === undefined || copy === undefined) {
    const kind = source === undefined ? 'missing-in-source' : 'missing-in-copy';
    return { findings: [{ skill, relativePath: '.', kind }], filesCompared: 0 };
  }
  const findings: SkillCopyFinding[] = [];
  let filesCompared = 0;
  const paths = new Set([...source.keys(), ...copy.keys()]);
  for (const relativePath of [...paths].sort(byText)) {
    const outcome = compareEntry(source.get(relativePath), copy.get(relativePath));
    if (outcome === 'identical' || outcome === 'content-differs') {
      filesCompared += 1;
    }
    if (outcome !== 'identical') {
      findings.push({ skill, relativePath, kind: outcome });
    }
  }
  return { findings, filesCompared };
}

type EntryOutcome = SkillCopyFinding['kind'] | 'identical';

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
