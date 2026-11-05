/**
 * Unit tests for the instance-tier classifier and the findings a surface's
 * presence earns, over literal paths and literal probe results (tests never
 * use or create IO: `testing-strategy.md` §Philosophy).
 */
import { err, ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  classifySurfacePresence,
  presenceFindings,
  type InstanceTierProbe,
} from './instance-tier.js';

const SURFACE = 'collaboration-active-claims';
const REGISTRY = '.agent/state/collaboration/active-claims.json';
const GIT_STDERR = 'fatal: not a git repository (or any of the parent directories): .git\n';
const GIT_FAILURE = { kind: 'git-failed', status: 128, stderr: GIT_STDERR } as const;

/** git lists the registry: its rules ignore it, and it tracks none of it. */
const IGNORED_UNTRACKED: InstanceTierProbe = ok(new Set([REGISTRY]));
/** git lists nothing: no rule matches, or git tracks what one does. */
const NOT_IGNORED: InstanceTierProbe = ok(new Set());

describe('classifySurfacePresence', () => {
  const probes: readonly (readonly [string, InstanceTierProbe])[] = [
    ['says it is ignored', IGNORED_UNTRACKED],
    ['says it is not ignored', NOT_IGNORED],
    ['failed', err(GIT_FAILURE)],
  ];

  it.each(probes)('reads a file the read found as present when the probe %s', (_, probe) => {
    expect(classifySurfacePresence({ path: REGISTRY, found: true, probe })).toStrictEqual(
      ok('present'),
    );
  });

  it('reads an absent file the rules ignore and git does not track as absent by design', () => {
    expect(
      classifySurfacePresence({ path: REGISTRY, found: false, probe: IGNORED_UNTRACKED }),
    ).toStrictEqual(ok('absent-by-design'));
  });

  it('reads an absent file the repository would track as absent', () => {
    expect(
      classifySurfacePresence({ path: REGISTRY, found: false, probe: NOT_IGNORED }),
    ).toStrictEqual(ok('absent'));
  });

  it('cannot classify an absent file when the probe failed, and says why in git’s own terms', () => {
    expect(
      classifySurfacePresence({ path: REGISTRY, found: false, probe: err(GIT_FAILURE) }),
    ).toStrictEqual(err(GIT_FAILURE));
  });
});

describe('presenceFindings', () => {
  it('earns no finding for a present surface: its content is validated instead', () => {
    expect(presenceFindings(SURFACE, REGISTRY, ok('present'))).toStrictEqual([]);
  });

  it('reports a surface absent by design as one informational finding whose evidence is the path given', () => {
    expect(presenceFindings(SURFACE, REGISTRY, ok('absent-by-design'))).toStrictEqual([
      expect.objectContaining({
        id: 'instance-tier-surface-absent',
        surface: SURFACE,
        severity: 'informational',
        evidence: [REGISTRY],
      }),
    ]);
  });

  it('reports an absent surface the repository would track as one blocking missing surface with its path', () => {
    expect(presenceFindings(SURFACE, REGISTRY, ok('absent'))).toStrictEqual([
      expect.objectContaining({
        id: 'missing-surface',
        surface: SURFACE,
        severity: 'blocking',
        evidence: [REGISTRY],
      }),
    ]);
  });

  it('reports a probe failure as one blocking finding on that surface, carrying git’s own words', () => {
    const findings = presenceFindings(SURFACE, REGISTRY, err(GIT_FAILURE));
    expect(findings).toStrictEqual([
      expect.objectContaining({
        id: 'live-reader-failure',
        surface: SURFACE,
        severity: 'blocking',
        evidence: [REGISTRY],
      }),
    ]);
    expect(findings[0]?.message).toContain(GIT_STDERR.trim());
  });
});
