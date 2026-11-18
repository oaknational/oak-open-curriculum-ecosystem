/**
 * The substrate audit's instance tier: whether a surface the audit reads is
 * absent by design, asked of the repository and never of a hand-kept list.
 *
 * @remarks
 * A surface is instance tier exactly when the repository's ignore rules ignore
 * it and git does not track it, which is what `listIgnoredPaths` in
 * `core/repository-paths.ts` asks git; a fresh checkout, a worktree and CI
 * carry none of it. The disk is asked first: a surface the read found is
 * present and validated in full whatever the rules say, so the tier never
 * excuses content. Only an absent surface consults the probe. A probe git
 * could not answer fails closed: every absent surface then earns a blocking
 * finding of its own, and no other reader's findings are hidden.
 *
 * @packageDocumentation
 */

import { map, ok, type Result } from '@oaknational/result';

import { describeGitReadFailure, type GitReadFailure } from '../core/repository-paths.js';
import { finding } from './finding.js';
import { type SubstrateFinding } from './types.js';

/**
 * The classified surfaces git keeps out of every checkout (ignored and
 * untracked), or why git gave no answer.
 */
export type InstanceTierProbe = Result<ReadonlySet<string>, GitReadFailure>;

/**
 * Where one surface stands: on disk (`present`); absent, and the repository
 * keeps it out of every checkout (`absent-by-design`); or absent where the
 * repository would track it (`absent`).
 */
export type SurfacePresence = 'present' | 'absent-by-design' | 'absent';

/**
 * Classify one surface from whether its read found it and from the report's
 * probe; the probe's failure only when the surface is absent.
 */
export function classifySurfacePresence(input: {
  readonly path: string;
  readonly found: boolean;
  readonly probe: InstanceTierProbe;
}): Result<SurfacePresence, GitReadFailure> {
  if (input.found) {
    return ok('present');
  }
  return map(input.probe, (instanceTier) =>
    instanceTier.has(input.path) ? 'absent-by-design' : 'absent',
  );
}

/**
 * The findings a surface's presence earns on its own: none when present (its
 * content is validated instead); one informational finding when absent by
 * design; one blocking finding when absent where the repository would track
 * it, or when the probe failed.
 */
export function presenceFindings(
  surface: string,
  path: string,
  presence: Result<SurfacePresence, GitReadFailure>,
): readonly SubstrateFinding[] {
  if (!presence.ok) {
    return [probeFailureFinding(surface, path, presence.error)];
  }
  if (presence.value === 'absent-by-design') {
    return [instanceTierSurfaceAbsentFinding(surface, path)];
  }
  return presence.value === 'absent' ? [missingSurfaceFinding(surface, path)] : [];
}

function instanceTierSurfaceAbsentFinding(surface: string, path: string): SubstrateFinding {
  return finding({
    id: 'instance-tier-surface-absent',
    surface,
    severity: 'informational',
    repair: 'deterministic',
    message:
      `Instance-tier surface ${path} is absent by design: the ignore rules keep it out of ` +
      'every checkout and git tracks none of it, so a fresh checkout or a linked worktree ' +
      'carries none. Nothing to repair in this checkout: the live state belongs to the ' +
      'coordination home (the registry contract), where the collaboration-state CLI seeds the ' +
      'claim registries once the path is verified, and the first comms write creates the render.',
    evidence: [path],
  });
}

function missingSurfaceFinding(surface: string, path: string): SubstrateFinding {
  return finding({
    id: 'missing-surface',
    surface,
    severity: 'blocking',
    repair: 'manual-with-provenance',
    message:
      `Surface ${path} is absent, but the repository would track it. Restore it from ` +
      'history or from the writer that owns it.',
    evidence: [path],
  });
}

function probeFailureFinding(
  surface: string,
  path: string,
  failure: GitReadFailure,
): SubstrateFinding {
  return finding({
    id: 'live-reader-failure',
    surface,
    severity: 'blocking',
    repair: 'manual-with-provenance',
    message:
      `Live substrate reader failed: ${path} is absent, and git could not say whether by ` +
      `design: ${describeGitReadFailure(failure)}.`,
    evidence: [path],
  });
}
