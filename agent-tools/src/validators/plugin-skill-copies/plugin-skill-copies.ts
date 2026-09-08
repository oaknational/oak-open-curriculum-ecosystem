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
 * directory (one holding a `SKILL.md`) present under both roots. A fourth
 * shared skill is covered the moment it exists on both sides, and a skill
 * present on one side only is reported for visibility, not compared
 * (`validators-must-recompute-not-just-record`).
 *
 * Pure: the filesystem is injected as a {@link SkillTreeReader} (ADR-078), so
 * the comparison is testable against in-memory trees and the CLI wrapper owns
 * both the real reader and the process exit.
 *
 * @packageDocumentation
 */

/** The files of one skill directory, keyed by path relative to that directory. */
export type SkillTree = ReadonlyMap<string, Uint8Array>;

/** Reads skill directories; every method answers `undefined` for a path that does not exist. */
export interface SkillTreeReader {
  /** Names of the skill directories (those holding a `SKILL.md`) directly under `root`. */
  readonly listSkills: (root: string) => readonly string[] | undefined;
  /** The files of one skill directory. */
  readonly read: (skillDir: string) => SkillTree | undefined;
}

/** What to compare: the two skill roots. Which skills are shared is discovered from them. */
export interface SkillCopyCheck {
  /** Root holding the authoritative skills (`<plugin>/skills`). */
  readonly sourceRoot: string;
  /** Root holding the copies (`<sibling-plugin>/skills`). */
  readonly copyRoot: string;
}

/** One difference between source and copy, addressed by skill and skill-relative path. */
export interface SkillCopyFinding {
  readonly skill: string;
  readonly relativePath: string;
  readonly kind: 'missing-in-copy' | 'missing-in-source' | 'content-differs';
}

/** The outcome: what was discovered, what differed, and how much was compared. */
export interface SkillCopyReport {
  /** Skills present under both roots, in stable order; these are the ones compared. */
  readonly sharedSkills: readonly string[];
  /** Skills present under the source root only; reported, not compared. */
  readonly sourceOnly: readonly string[];
  /** Skills present under the copy root only (for the Oak package: the merged skills). */
  readonly copyOnly: readonly string[];
  readonly findings: readonly SkillCopyFinding[];
  /** File pairs compared, so an empty scan cannot pass as clean. */
  readonly filesCompared: number;
}

/** The exit code and the lines to print for a report; pure so exit codes are assertable. */
export interface SkillCopyVerdict {
  /** 0 identical; 1 drift found; 2 refusal (nothing shared, or nothing compared). */
  readonly code: 0 | 1 | 2;
  readonly lines: readonly string[];
}

/** Labels the verdict prints for the two roots (repo-relative, for humans). */
export interface SkillCopyRootLabels {
  readonly sourceRoot: string;
  readonly copyRoot: string;
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
 * Discover the shared skills between the two roots and report each difference.
 *
 * @param check - the two roots.
 * @param reader - how skill directories are listed and read; the CLI passes the real filesystem.
 * @returns the discovered membership, every finding in deterministic (skill, path) order,
 *   and the number of file pairs compared.
 */
export function findSkillCopyDrift(
  check: SkillCopyCheck,
  reader: SkillTreeReader,
): SkillCopyReport {
  const sourceSkills = reader.listSkills(check.sourceRoot) ?? [];
  const copySkills = reader.listSkills(check.copyRoot) ?? [];
  const sourceSet = new Set(sourceSkills);
  const copySet = new Set(copySkills);
  const sharedSkills = sourceSkills.filter((skill) => copySet.has(skill)).sort(byText);
  const sourceOnly = sourceSkills.filter((skill) => !copySet.has(skill)).sort(byText);
  const copyOnly = copySkills.filter((skill) => !sourceSet.has(skill)).sort(byText);

  const findings: SkillCopyFinding[] = [];
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
): { readonly findings: readonly SkillCopyFinding[]; readonly filesCompared: number } {
  if (source === undefined || copy === undefined) {
    const kind = source === undefined ? 'missing-in-source' : 'missing-in-copy';
    return { findings: [{ skill, relativePath: '.', kind }], filesCompared: 0 };
  }
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

/** The remediation line for each finding kind present, so every printed fix is actionable. */
function remediationLines(
  findings: readonly SkillCopyFinding[],
  labels: SkillCopyRootLabels,
): readonly string[] {
  const kinds = new Set(findings.map((finding) => finding.kind));
  const lines: string[] = [];
  if (kinds.has('missing-in-source')) {
    lines.push(
      `Fix (missing-in-source): the Claude plugin is the source and it lacks the listed path(s) — restore them under ${labels.sourceRoot} before re-copying.`,
    );
  }
  if (kinds.has('missing-in-copy') || kinds.has('content-differs')) {
    lines.push(
      `Fix (missing-in-copy / content-differs): re-copy each listed skill from ${labels.sourceRoot} to ${labels.copyRoot} (omit evals/).`,
    );
  }
  return lines;
}

function membershipLines(report: SkillCopyReport): readonly string[] {
  const lines: string[] = [];
  if (report.sourceOnly.length > 0) {
    lines.push(`  source-only (not compared): ${report.sourceOnly.join(', ')}`);
  }
  if (report.copyOnly.length > 0) {
    lines.push(`  copy-only (not compared): ${report.copyOnly.join(', ')}`);
  }
  return lines;
}

/**
 * Decide the exit code and output for a report.
 *
 * @remarks
 * An empty intersection or an empty comparison is a refusal (2), never a pass:
 * a validator that compared nothing has proved nothing.
 */
export function decideSkillCopyVerdict(
  report: SkillCopyReport,
  labels: SkillCopyRootLabels,
): SkillCopyVerdict {
  const prefix = 'validate-plugin-skill-copies:';
  if (report.sharedSkills.length === 0) {
    return {
      code: 2,
      lines: [
        `${prefix} no skill directory is present under both ${labels.sourceRoot} and ${labels.copyRoot} — refusing to report clean.`,
        ...membershipLines(report),
      ],
    };
  }
  if (report.filesCompared === 0 && report.findings.length === 0) {
    return { code: 2, lines: [`${prefix} compared no files — refusing to report clean.`] };
  }
  if (report.findings.length > 0) {
    return {
      code: 1,
      lines: [
        `${prefix} ${report.findings.length} difference(s) between ${labels.sourceRoot} and ${labels.copyRoot}:`,
        ...report.findings.map(
          (finding) => `  ${finding.kind}  ${finding.skill}/${finding.relativePath}`,
        ),
        ...remediationLines(report.findings, labels),
      ],
    };
  }
  return {
    code: 0,
    lines: [
      `${prefix} ${report.sharedSkills.length} shared skill(s) identical (${report.filesCompared} files compared): ${report.sharedSkills.join(', ')}`,
      ...membershipLines(report),
    ],
  };
}
