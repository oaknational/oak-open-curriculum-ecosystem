#!/usr/bin/env node
/**
 * Claude Code statusline adapter.
 *
 * @remarks
 * Reads the JSON object Claude Code passes on stdin and prints the statusline.
 * By default it renders a four-row block with the Oak acorn mark as a left
 * logo-column and the segments flowing to its right:
 *
 * ```text
 * <mark> <agent-identity>[ director-demark][ · team-icon wing]
 * <mark> <model>
 * <mark> ctx:N% · <branch>[*]
 * <mark> <dir or wt:worktree>
 * ```
 *
 * The logo style is read from `OAK_STATUSLINE_LOGO` (`braille-sharp` default;
 * `braille` for the unmodified conversion; `quad` for universal-font block
 * elements; `sextant` for the sharpest mark where the font has the Legacy
 * Computing block; or `none` for the two-line layout). The default
 * `braille-sharp` cycles through four frames, one per render, kept per session
 * (keyed on `session_id`) in an ephemeral temp file; `OAK_STATUSLINE_MOTION`
 * (`off`/`static`/`none`/`reduce`) pins it to frame 0. The agent-identity
 * name (PDR-027) is produced by the built `agent-identity` CLI at
 * `agent-tools/dist/src/bin/agent-identity.js`. Git branch, dirty state, and
 * linked-worktree name are gathered from the working directory in the payload.
 * The session-shape indicators are resolved from two cheap repo-file reads
 * (active-claims registry + experiments listing). Formatting is delegated to
 * the pure {@link renderStatusline}.
 *
 * The statusline is a soft surface: missing input, missing build artefact, or
 * any spawn failure degrades the affected segment to empty rather than
 * disrupting the session.
 *
 * @packageDocumentation
 */

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseCollaborationRegistry } from '../collaboration-state/state-parsers.js';
import { type CollaborationRegistry } from '../collaboration-state/types.js';
import { resolveLogoStyle } from './oak-logo.js';
import { createFsFrameStore, LOGO_FRAME_STATE_DIR } from './statusline-frame-store.js';
import { planStatuslineExecution, type StatuslinePlan } from './statusline-identity-input.js';
import { isMotionDisabled, readAndAdvanceFrame } from './statusline-logo-cycle.js';
import { renderStatusline } from './statusline-render.js';
import {
  parsePrimaryWorktreeRoot,
  resolveSessionShape,
  type ExperimentsEntry,
  type SessionShape,
} from './statusline-session-shape.js';

const builtIdentityCliPath = resolveBuiltIdentityCliPath();

let stdinBuffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  stdinBuffer += chunk;
});
process.stdin.on('end', () => {
  emitStatusline(stdinBuffer);
});

function emitStatusline(rawJson: string): void {
  const plan: StatuslinePlan = planStatuslineExecution(rawJson);
  if (plan.kind === 'noop') {
    return;
  }

  const cwd = plan.inputs.cwd ?? process.cwd();
  const git = gatherGitState(cwd);
  const identity = deriveIdentity(plan.inputs.seed);

  const logo = resolveLogoStyle(process.env.OAK_STATUSLINE_LOGO);

  const line = renderStatusline(
    {
      identity,
      dir: basename(cwd),
      branch: git.branch,
      dirty: git.dirty,
      worktree: git.worktree,
      usedPercentage: plan.inputs.usedPercentage,
      model: plan.inputs.model,
      sessionShape: gatherSessionShape(cwd, identity),
    },
    { logo, logoFrame: resolveLogoFrame(logo, plan.inputs.seed) },
  );

  process.stdout.write(line);
}

/**
 * Resolve the per-session render counter for the logo cycle. Only `braille-sharp`
 * cycles, and only when motion is not disabled and a session id is present; every
 * other case pins frame 0 and writes no state (no counter file is created when the
 * logo is suppressed, a non-cycling style is chosen, or reduce-motion is set).
 *
 * @param logo - The resolved logo style.
 * @param sessionId - The Claude Code `session_id` (the `seed` input).
 * @returns The render counter to pass to the renderer.
 */
function resolveLogoFrame(
  logo: ReturnType<typeof resolveLogoStyle>,
  sessionId: string | undefined,
): number {
  if (logo !== 'braille-sharp' || sessionId === undefined) {
    return 0;
  }
  if (isMotionDisabled(process.env.OAK_STATUSLINE_MOTION)) {
    return 0;
  }
  return readAndAdvanceFrame(createFsFrameStore(LOGO_FRAME_STATE_DIR), sessionId);
}

function deriveIdentity(seed: string | undefined): string | undefined {
  if (seed === undefined || !existsSync(builtIdentityCliPath)) {
    return undefined;
  }
  const result = spawnSync(
    process.execPath,
    [builtIdentityCliPath, '--seed', seed, '--format', 'display'],
    { encoding: 'utf8' },
  );
  if (result.status !== 0) {
    return undefined;
  }
  const name = result.stdout.trim();
  return name.length === 0 ? undefined : name;
}

interface GitState {
  readonly branch: string | undefined;
  readonly dirty: boolean;
  readonly worktree: string | undefined;
}

function gatherGitState(cwd: string): GitState {
  const branch =
    runGit(cwd, ['symbolic-ref', '--short', 'HEAD']) ??
    runGit(cwd, ['rev-parse', '--short', 'HEAD']);
  if (branch === undefined) {
    return { branch: undefined, dirty: false, worktree: undefined };
  }

  const dirty = (runGit(cwd, ['status', '--porcelain']) ?? '').length > 0;

  // In the main tree --git-dir and --git-common-dir are equal; in a linked
  // worktree they differ (.../.git/worktrees/<name> vs .../.git).
  const gitDir = runGit(cwd, ['rev-parse', '--git-dir']);
  const commonDir = runGit(cwd, ['rev-parse', '--git-common-dir']);
  const topLevel = runGit(cwd, ['rev-parse', '--show-toplevel']);
  const worktree =
    gitDir !== undefined && gitDir !== commonDir && topLevel !== undefined
      ? basename(topLevel)
      : undefined;

  return { branch, dirty, worktree };
}

function runGit(cwd: string, args: readonly string[]): string | undefined {
  const result = spawnSync('git', ['-C', cwd, ...args], { encoding: 'utf8' });
  if (result.status !== 0) {
    return undefined;
  }
  const out = result.stdout.trim();
  return out.length === 0 ? undefined : out;
}

function resolveBuiltIdentityCliPath(): string {
  const moduleDir = dirname(fileURLToPath(import.meta.url));
  return resolve(moduleDir, '..', 'bin', 'agent-identity.js');
}

/**
 * Gather the session-shape inputs and resolve the coordination indicators for
 * this tick.
 *
 * Exactly two coordination reads, both against the PRIMARY checkout root (first
 * `git worktree list --porcelain` entry — a worktree seat must read the live
 * registry, not its own checked-out copy): the active-claims registry and the
 * experiments-directory listing. The comms corpus is never read from this path
 * — the statusline ticks constantly and that directory is a large flat scan.
 * Every read soft-fails to undefined so an unreadable coordination surface
 * degrades the indicators rather than the statusline.
 */
function gatherSessionShape(cwd: string, ownAgentName: string | undefined): SessionShape {
  const porcelain = runGit(cwd, ['worktree', 'list', '--porcelain']);
  const primaryRoot = porcelain === undefined ? undefined : parsePrimaryWorktreeRoot(porcelain);

  return resolveSessionShape({
    ownAgentName,
    registry: primaryRoot === undefined ? undefined : readActiveClaimsRegistry(primaryRoot),
    experimentsListing: primaryRoot === undefined ? undefined : listExperiments(primaryRoot),
    nowIso: new Date().toISOString(),
  });
}

function readActiveClaimsRegistry(primaryRoot: string): CollaborationRegistry | undefined {
  try {
    return parseCollaborationRegistry(
      readFileSync(join(primaryRoot, '.agent/state/collaboration/active-claims.json'), 'utf8'),
    );
  } catch {
    return undefined;
  }
}

function listExperiments(primaryRoot: string): readonly ExperimentsEntry[] | undefined {
  // ArcAngel channels live in the canonical rapid-comms home. WS7 / Bugbot
  // ccc37502 + de9f2522: the wing previously scanned the stale experiments/
  // path and so never lit for relocated channels. The single shared
  // ArcAngel-home constant is the #7 consolidation; this is the de-bundled
  // wing-fix repoint.
  const experimentsDir = join(primaryRoot, '.agent/collaboration/rapid-comms');
  try {
    return readdirSync(experimentsDir, { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => statExperimentsEntry(experimentsDir, join(entry.parentPath, entry.name)))
      .filter((entry) => entry !== undefined);
  } catch {
    return undefined;
  }
}

/**
 * Stat one experiments file, isolating per-entry failures: a file deleted
 * between the directory listing and its stat drops only that entry, not the
 * whole ARC listing for the tick.
 */
function statExperimentsEntry(
  experimentsDir: string,
  filePath: string,
): ExperimentsEntry | undefined {
  try {
    return {
      name: relative(experimentsDir, filePath),
      mtimeIso: statSync(filePath).mtime.toISOString(),
    };
  } catch {
    return undefined;
  }
}
