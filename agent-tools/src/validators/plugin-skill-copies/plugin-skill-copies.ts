/**
 * Byte-level drift detection between a plugin's source skills and a checked-in
 * copy of them in a sibling package.
 *
 * @remarks
 * The ChatGPT/Codex package of the Oak plugin carries the three shared skills
 * as plain copies, because ChatGPT reads only a plugin's own `skills/`
 * directory and the Claude plugin is not to be restructured. A copy is honest
 * only while it is checked: this module recomputes the comparison from the
 * trees it is given every run and reports every difference by path, so a
 * drift is a named finding rather than a silent divergence.
 *
 * Pure: the filesystem is injected as a {@link SkillTreeReader} (ADR-078), so
 * the comparison is testable against in-memory trees and the CLI wrapper owns
 * both the real reader and the verdict.
 *
 * @packageDocumentation
 */

/** The files of one skill directory, keyed by path relative to that directory. */
export type SkillTree = ReadonlyMap<string, Uint8Array>;

/** Reads a skill directory into a {@link SkillTree}; `undefined` when the directory does not exist. */
export interface SkillTreeReader {
  readonly read: (skillDir: string) => SkillTree | undefined;
}

/** What to compare: two skill roots and the skill names shared between them. */
export interface SkillCopyCheck {
  /** Root holding the authoritative skills (`<plugin>/skills`). */
  readonly sourceRoot: string;
  /** Root holding the copies (`<sibling-plugin>/skills`). */
  readonly copyRoot: string;
  /** Skill directory names that must be byte-identical between the two roots. */
  readonly skills: readonly string[];
}

/**
 * One difference between source and copy, addressed by skill and skill-relative
 * path. A whole skill directory absent on one side is reported once, with
 * `relativePath` `'.'`, so a configured skill can never vanish silently.
 */
export interface SkillCopyFinding {
  readonly skill: string;
  readonly relativePath: string;
  readonly kind: 'missing-in-copy' | 'missing-in-source' | 'content-differs';
}

/** The outcome: findings plus how much was actually compared, so an empty scan cannot pass as clean. */
export interface SkillCopyReport {
  readonly findings: readonly SkillCopyFinding[];
  readonly filesCompared: number;
}

const byText = (a: string, b: string): number => a.localeCompare(b);

/** Join a root and a skill name with `/`, the separator both readers understand. */
function skillPath(root: string, skill: string): string {
  return `${root}/${skill}`;
}

function sameBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.byteLength !== b.byteLength) {
    return false;
  }
  for (let i = 0; i < a.byteLength; i += 1) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

/**
 * Compare every shared skill between the two roots and report each difference.
 *
 * @param check - the roots and the shared skill names.
 * @param reader - how a skill directory is read; the CLI passes the real filesystem.
 * @returns every finding in deterministic (skill, path) order, plus the number of file pairs compared.
 */
export function findSkillCopyDrift(
  check: SkillCopyCheck,
  reader: SkillTreeReader,
): SkillCopyReport {
  const findings: SkillCopyFinding[] = [];
  let filesCompared = 0;
  for (const skill of [...check.skills].sort(byText)) {
    const source = reader.read(skillPath(check.sourceRoot, skill));
    const copy = reader.read(skillPath(check.copyRoot, skill));
    // A configured skill absent on either side is a finding in its own right,
    // never an empty tree that compares clean against the other side.
    if (source === undefined) {
      findings.push({ skill, relativePath: '.', kind: 'missing-in-source' });
    }
    if (copy === undefined) {
      findings.push({ skill, relativePath: '.', kind: 'missing-in-copy' });
    }
    if (source === undefined || copy === undefined) {
      continue;
    }
    const one = compareSkill(skill, source, copy);
    findings.push(...one.findings);
    filesCompared += one.filesCompared;
  }
  return { findings, filesCompared };
}

/** Compare one skill's two trees; every path in either tree yields at most one finding. */
function compareSkill(skill: string, source: SkillTree, copy: SkillTree): SkillCopyReport {
  const findings: SkillCopyFinding[] = [];
  let filesCompared = 0;
  const paths = new Set([...source.keys(), ...copy.keys()]);
  for (const relativePath of [...paths].sort(byText)) {
    const original = source.get(relativePath);
    const copied = copy.get(relativePath);
    if (original === undefined) {
      findings.push({ skill, relativePath, kind: 'missing-in-source' });
    } else if (copied === undefined) {
      findings.push({ skill, relativePath, kind: 'missing-in-copy' });
    } else {
      filesCompared += 1;
      if (!sameBytes(original, copied)) {
        findings.push({ skill, relativePath, kind: 'content-differs' });
      }
    }
  }
  return { findings, filesCompared };
}
