/**
 * Candidate resolution for the baked landing-page artefact.
 *
 * @remarks
 * Pure branches with literal paths and an injected `exists` — the same
 * shape as `resolveStaticRoot`'s suite. The fail-fast throw is the branch
 * the deployment's "never a blank front door" guarantee rests on, so its
 * message contract (every candidate named, cwd included) is asserted, not
 * assumed.
 */

import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  landingPageArtefactCandidates,
  LANDING_PAGE_ARTEFACT_RELATIVE_PATH,
  resolveLandingPageArtefact,
} from './landing-page-artefact.js';

// Host-absolute roots anchored at this module's own filesystem root: joining
// onto `path.parse(import.meta.dirname).root` yields host-form absolute
// fixtures ('/srv/app' on POSIX, '<drive>:\srv\app' on Windows) without the
// ambient-drive read a bare `path.resolve('/srv/app')` performs.
const ROOT = path.parse(import.meta.dirname).root;
const REPO_ROOT = path.join(ROOT, 'srv', 'app');
const WORKSPACE = path.join(REPO_ROOT, 'apps', 'oak-curriculum-mcp-streamable-http');

describe('landingPageArtefactCandidates', () => {
  it('probes the working directory first, then the workspace under a repo-root cwd', () => {
    expect(landingPageArtefactCandidates(REPO_ROOT)).toStrictEqual([
      path.join(REPO_ROOT, LANDING_PAGE_ARTEFACT_RELATIVE_PATH),
      path.join(
        REPO_ROOT,
        'apps',
        'oak-curriculum-mcp-streamable-http',
        LANDING_PAGE_ARTEFACT_RELATIVE_PATH,
      ),
    ]);
  });
});

describe('resolveLandingPageArtefact', () => {
  it('resolves the first existing candidate', () => {
    const candidates = landingPageArtefactCandidates(WORKSPACE);

    const chosen = resolveLandingPageArtefact(
      candidates,
      (candidate) => candidate === candidates[0],
      WORKSPACE,
    );

    expect(chosen).toBe(candidates[0]);
  });

  it('falls through to the workspace-nested candidate (the Vercel repo-root cwd)', () => {
    const candidates = landingPageArtefactCandidates(REPO_ROOT);

    const chosen = resolveLandingPageArtefact(
      candidates,
      (candidate) => candidate === candidates[1],
      REPO_ROOT,
    );

    expect(chosen).toBe(candidates[1]);
  });

  it('fails fast with every candidate and the cwd in the message when none exists', () => {
    const candidates = landingPageArtefactCandidates(REPO_ROOT);
    const attempt = (): string => resolveLandingPageArtefact(candidates, () => false, REPO_ROOT);

    // Substring assertions, one per contracted fragment: `toThrow` with a
    // string checks message containment, so no regex escaping of host paths
    // is needed.
    expect(attempt).toThrow('No baked landing page found');
    for (const candidate of candidates) {
      expect(attempt).toThrow(candidate);
    }
    expect(attempt).toThrow(`cwd: ${REPO_ROOT}`);
  });
});
