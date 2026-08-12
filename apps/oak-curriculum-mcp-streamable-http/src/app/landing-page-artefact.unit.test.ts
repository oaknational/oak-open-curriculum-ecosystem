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

// Host-absolute roots: the candidates are emitted by `path.resolve`, so the
// literals are resolved once here to the host form (drive-prefixed backslash
// paths on Windows, unchanged on POSIX) the assertions compare against.
const WORKSPACE = path.resolve('/srv/app/apps/oak-curriculum-mcp-streamable-http');
const REPO_ROOT = path.resolve('/srv/app');

/** Escape a host path for literal use inside a RegExp source. */
function escapeForRegExp(literal: string): string {
  return literal.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

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

    expect(() => resolveLandingPageArtefact(candidates, () => false, REPO_ROOT)).toThrow(
      new RegExp(
        String.raw`No baked landing page found[\s\S]*` +
          escapeForRegExp(path.join(REPO_ROOT, LANDING_PAGE_ARTEFACT_RELATIVE_PATH)) +
          String.raw`[\s\S]*cwd: ` +
          escapeForRegExp(REPO_ROOT),
      ),
    );
  });
});
