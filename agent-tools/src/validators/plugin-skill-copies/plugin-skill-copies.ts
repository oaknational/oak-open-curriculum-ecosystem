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
 * shared skill is covered the moment it exists on both sides. A skill present
 * under the source only is a `missing-in-copy` finding, because the copy is
 * meant to carry every source skill and a deleted copy must not pass. A skill
 * present under the copy only is legitimate only when it derives from a
 * same-named skill directory under the derived root (the Claude plugin's
 * workflows, which the merged skills are built from); otherwise it is a stale
 * copy of a deleted source skill and a `missing-derivation` finding. Nothing is
 * listed: every membership question is answered from the three trees
 * (`validators-must-recompute-not-just-record`).
 *
 * Symlinks are never followed. The repository forbids them (principles.md
 * §No symlinks), and a link that happened to resolve to matching bytes would
 * still ship as a link, not as content. A symlink anywhere in a packaged
 * skill, shared or copy-only, or a symlinked entry under a root, is a finding
 * of its own. Authoring-only content (`notShipped`, the `evals/` directories)
 * is likewise a finding wherever it appears in the copy: shared skills are
 * compared without it, and derived copy-only skills are walked for it. A
 * directory under the copy root that is not a skill (no regular `SKILL.md`) is
 * `missing-in-copy` on its manifest when a same-named source skill exists, so
 * it is re-copied, and `not-shipped` otherwise, so it is removed: only one of
 * those remediations can clear each state.
 *
 * Pure: the filesystem is injected as a {@link SkillTreeReader} (ADR-078), so
 * the comparison is testable against in-memory trees and the CLI wrapper owns
 * both the real reader and the process exit. The exit decision lives in
 * `plugin-skill-copies-verdict.ts`.
 *
 * @packageDocumentation
 */

import {
  byText,
  compareSkill,
  copyOnlyFindings,
  SKILL_MANIFEST,
  type SkillCopyFinding,
  type SkillTree,
} from './plugin-skill-copies-compare.js';

export type { SkillCopyFinding, SkillEntry, SkillTree } from './plugin-skill-copies-compare.js';

/** What a root directory holds: skill directories, directories that are not valid skills, and symlinked entries. */
export interface SkillRootListing {
  /** Names of directories directly under the root that hold a regular `SKILL.md` file. */
  readonly skills: readonly string[];
  /** Names of directories directly under the root that lack a regular `SKILL.md`; each is a finding. */
  readonly invalid: readonly string[];
  /** Names of entries directly under the root that are symlinks (reported, never followed). */
  readonly symlinks: readonly string[];
}

/** Reads skill directories; every method answers `undefined` for a path that does not exist. */
export interface SkillTreeReader {
  readonly listRoot: (root: string) => SkillRootListing | undefined;
  readonly read: (skillDir: string) => SkillTree | undefined;
}

/** What to compare: the two skill roots, and the root that legitimises copy-only skills. */
export interface SkillCopyCheck {
  /** Root holding the authoritative skills. */
  readonly sourceRoot: string;
  /** Root holding the copies. */
  readonly copyRoot: string;
  /**
   * Root whose skill directories a copy-only skill must be derived from (the
   * Claude plugin's workflows). A copy-only skill with no same-named directory
   * here is a stale copy of a deleted source skill, and a finding.
   */
  readonly derivedRoot: string;
  /**
   * Top-level directory names that are authoring tooling and must not ship in
   * the copy (`evals`). Their presence in any packaged skill is a finding.
   */
  readonly notShipped: readonly string[];
}

/** The outcome: what was discovered, what differed, and how much was compared. */
export interface SkillCopyReport {
  /** Skills present under both roots, in stable order; these are the ones compared. */
  readonly sharedSkills: readonly string[];
  /** Skills present under the source root only; each is also a `missing-in-copy` finding. */
  readonly sourceOnly: readonly string[];
  /** Skills present under the copy root only; not compared, and a finding unless derived from the derived root. */
  readonly copyOnly: readonly string[];
  readonly findings: readonly SkillCopyFinding[];
  /** File pairs compared, so an empty scan cannot pass as clean. */
  readonly filesCompared: number;
}

/** Join a root and a skill name with `/`, the separator both readers understand. */
function skillPath(root: string, skill: string): string {
  return `${root}/${skill}`;
}

const EMPTY_ROOT: SkillRootListing = { skills: [], invalid: [], symlinks: [] };

/**
 * Discover the shared skills between the source and copy roots and report each difference.
 *
 * @param check - the source and copy roots to compare, the derived root whose
 *   skill directories legitimise copy-only skills, and the top-level directory
 *   names that must not ship in the copy.
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
  const sourceInvalidSet = new Set(source.invalid);
  const sharedSkills = source.skills.filter((skill) => copySet.has(skill)).sort(byText);
  const sourceOnly = source.skills.filter((skill) => !copySet.has(skill)).sort(byText);
  const copyOnly = copy.skills.filter((skill) => !sourceSet.has(skill)).sort(byText);
  // Whether a workflow derives a copy-only skill is read where it is used, not
  // taken from a listing of the derived root: a workflow that vanished, or lost
  // its manifest, after such a listing must not go on legitimising the copy.
  const derivedCopies = new Set(
    copyOnly.filter(
      (skill) =>
        reader.read(skillPath(check.derivedRoot, skill))?.get(SKILL_MANIFEST)?.kind === 'file',
    ),
  );
  // A copy-only skill with no derivation source is a stale copy of a deleted
  // source skill. One already reported as an invalid source directory is not
  // reported twice.
  const staleCopies = copyOnly.filter(
    (skill) => !derivedCopies.has(skill) && !sourceInvalidSet.has(skill),
  );

  const findings: SkillCopyFinding[] = membershipFindings(source, copy, sourceOnly, staleCopies);
  let filesCompared = 0;
  for (const skill of sharedSkills) {
    const one = compareSkill(
      skill,
      reader.read(skillPath(check.sourceRoot, skill)),
      reader.read(skillPath(check.copyRoot, skill)),
      check.notShipped,
    );
    findings.push(...one.findings);
    filesCompared += one.filesCompared;
  }
  // Derived copy-only skills have no source to compare against, but they ship,
  // so they are walked for symlinks and authoring-only content all the same.
  for (const skill of copyOnly.filter((name) => derivedCopies.has(name))) {
    findings.push(
      ...copyOnlyFindings(skill, reader.read(skillPath(check.copyRoot, skill)), check.notShipped),
    );
  }
  return { sharedSkills, sourceOnly, copyOnly, findings, filesCompared };
}

/**
 * The findings that membership alone decides, before any file is compared:
 * symlinked entries under either root; a source directory that is not a valid
 * skill (no regular SKILL.md), reported on its manifest so a source skill whose
 * manifest vanished cannot let its stale copy pass as copy-only; a copy
 * directory that is not a valid skill, reported on its manifest when a
 * same-named source skill exists (re-copy it) and as not shipped otherwise
 * (remove it); source skills with no copy; and copy-only skills with no
 * derivation source.
 */
function membershipFindings(
  source: SkillRootListing,
  copy: SkillRootListing,
  sourceOnly: readonly string[],
  staleCopies: readonly string[],
): SkillCopyFinding[] {
  const at = (relativePath: string, kind: SkillCopyFinding['kind']) => (skill: string) => ({
    skill,
    relativePath,
    kind,
  });
  const sourceSkills = new Set(source.skills);
  const copyInvalid = [...copy.invalid].sort(byText);
  return [
    ...[...new Set([...source.symlinks, ...copy.symlinks])].sort(byText).map(at('.', 'symlink')),
    ...[...source.invalid].sort(byText).map(at(SKILL_MANIFEST, 'missing-in-source')),
    ...copyInvalid.filter((s) => sourceSkills.has(s)).map(at(SKILL_MANIFEST, 'missing-in-copy')),
    ...copyInvalid.filter((s) => !sourceSkills.has(s)).map(at('.', 'not-shipped')),
    ...sourceOnly.map(at('.', 'missing-in-copy')),
    ...staleCopies.map(at('.', 'missing-derivation')),
  ];
}
