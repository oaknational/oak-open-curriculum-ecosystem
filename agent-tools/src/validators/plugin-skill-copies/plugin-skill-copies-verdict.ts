/**
 * The exit decision for a skill-copy report: exit code and printed lines.
 *
 * @remarks
 * Kept pure and apart from the CLI so every exit code is asserted in unit
 * tests rather than only observable by running the binary. An empty
 * intersection or an empty comparison is a refusal (2), never a pass: a
 * validator that compared nothing has proved nothing.
 *
 * @packageDocumentation
 */

import type { SkillCopyFinding, SkillCopyReport } from './plugin-skill-copies.js';

/** The exit code and the lines to print for a report. */
export interface SkillCopyVerdict {
  /** 0 identical; 1 drift found; 2 refusal (nothing shared, or nothing compared). */
  readonly code: 0 | 1 | 2;
  readonly lines: readonly string[];
}

/** What the verdict prints about the check: repo-relative root labels and the ignored directories. */
export interface SkillCopyCheckLabels {
  readonly sourceRoot: string;
  readonly copyRoot: string;
  /** Top-level directories the comparison skips, named in the re-copy remediation. */
  readonly ignoredDirs: readonly string[];
}

const PREFIX = 'validate-plugin-skill-copies:';

/** The remediation line for each finding kind present, so every printed fix is actionable. */
function remediationLines(
  findings: readonly SkillCopyFinding[],
  labels: SkillCopyCheckLabels,
): readonly string[] {
  const kinds = new Set(findings.map((finding) => finding.kind));
  const lines: string[] = [];
  if (kinds.has('symlink')) {
    lines.push(
      'Fix (symlink): replace each listed symlink with a real file or directory; symlinks are not permitted in the repository (principles.md §No symlinks).',
    );
  }
  if (kinds.has('missing-in-source')) {
    lines.push(
      `Fix (missing-in-source): ${labels.sourceRoot} is the source and it lacks the listed path(s) — restore them there before re-copying.`,
    );
  }
  if (kinds.has('missing-in-copy') || kinds.has('content-differs')) {
    const ignored = labels.ignoredDirs.map((dir) => `${dir}/`).join(', ');
    const omit = ignored === '' ? '' : ` (omit ${ignored})`;
    lines.push(
      `Fix (missing-in-copy / content-differs): re-copy each listed skill from ${labels.sourceRoot} to ${labels.copyRoot}${omit}.`,
    );
  }
  return lines;
}

function membershipLines(report: SkillCopyReport): readonly string[] {
  const lines: string[] = [];
  // Source-only skills are findings (missing-in-copy), listed with the findings, not here.
  if (report.copyOnly.length > 0) {
    lines.push(`  copy-only (not compared): ${report.copyOnly.join(', ')}`);
  }
  return lines;
}

/** Decide the exit code and output for a report. */
export function decideSkillCopyVerdict(
  report: SkillCopyReport,
  labels: SkillCopyCheckLabels,
): SkillCopyVerdict {
  if (report.sharedSkills.length === 0) {
    return {
      code: 2,
      lines: [
        `${PREFIX} no skill directory is present under both ${labels.sourceRoot} and ${labels.copyRoot} — refusing to report clean.`,
        ...membershipLines(report),
        ...report.findings.map(describeFinding),
      ],
    };
  }
  if (report.filesCompared === 0 && report.findings.length === 0) {
    return { code: 2, lines: [`${PREFIX} compared no files — refusing to report clean.`] };
  }
  if (report.findings.length > 0) {
    return {
      code: 1,
      lines: [
        `${PREFIX} ${report.findings.length} difference(s) between ${labels.sourceRoot} and ${labels.copyRoot}:`,
        ...report.findings.map(describeFinding),
        ...remediationLines(report.findings, labels),
      ],
    };
  }
  return {
    code: 0,
    lines: [
      `${PREFIX} ${report.sharedSkills.length} shared skill(s) identical (${report.filesCompared} files compared): ${report.sharedSkills.join(', ')}`,
      ...membershipLines(report),
    ],
  };
}

function describeFinding(finding: SkillCopyFinding): string {
  return `  ${finding.kind}  ${finding.skill}/${finding.relativePath}`;
}
