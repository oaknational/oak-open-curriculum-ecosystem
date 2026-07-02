#!/usr/bin/env node
/**
 * Claude Code statusline adapter.
 *
 * @remarks
 * Reads the JSON object Claude Code passes on stdin and prints the statusline.
 * By default it renders a logo-column block with the Oak acorn mark on the left
 * and the segments to its right: the agent identity (with coordination glyphs),
 * the model, context % and working branch, the working location, and — in a team
 * checkout with linked worktrees — the shared coordination branch on its own row.
 *
 * The logo style is read from `OAK_STATUSLINE_LOGO` (`braille-sharp` default;
 * `braille`/`quad`/`sextant` alternatives; `none` for the two-line layout). The
 * agent-identity name (PDR-027) comes from the built `agent-identity` CLI. Git
 * facts come from {@link gatherGitFacts} against the working directory in the
 * payload; the session-shape glyphs from two cheap reads of the primary
 * checkout's coordination state.
 *
 * Failure handling is split by segment. The **location facts** (working branch,
 * coordination branch) fail LOUD — an unexpected git error renders a visible
 * token, never a silent fallback (see `statusline-git-io.ts`). **Cosmetic**
 * details (dirty mark, worktree name, coordination glyphs) degrade to absent. A
 * top-level guard renders a loud token rather than crashing the adapter to a
 * blank line. (Loud surfacing of git *failures* is distinct from making a
 * session's working location correct when its cwd is not the agent's worktree —
 * that binding is a separate, unsolved concern, captured as friction F-98.)
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
import { BOLD, RED, RESET } from './statusline-ansi.js';
import { createFsFrameStore, LOGO_FRAME_STATE_DIR } from './statusline-frame-store.js';
import { gatherGitFacts } from './statusline-git-io.js';
import { planStatuslineExecution, type StatuslinePlan } from './statusline-identity-input.js';
import { isMotionDisabled, readAndAdvanceFrame } from './statusline-logo-cycle.js';
import { renderStatusline } from './statusline-render.js';
import {
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
  try {
    process.stdout.write(renderFromInputs(plan.inputs));
  } catch (cause) {
    // Fail loud, never blank: an unexpected fault renders a visible token so the
    // issue is seen, rather than crashing the adapter to an empty statusline.
    process.stdout.write(`${RED}${BOLD}⚠ statusline: ${String(cause)}${RESET}`);
  }
}

function renderFromInputs(inputs: Extract<StatuslinePlan, { kind: 'render' }>['inputs']): string {
  const cwd = inputs.cwd ?? process.cwd();
  const identity = deriveIdentity(inputs.seed);
  const git = gatherGitFacts(cwd);
  const logo = resolveLogoStyle(process.env.OAK_STATUSLINE_LOGO);
  return renderStatusline(
    {
      identity,
      dir: basename(cwd),
      branch: git.branch,
      dirty: git.dirty,
      worktree: git.worktree,
      coordinationBranch: git.coordinationBranch,
      coordinationPlace: git.coordinationPlace,
      error: git.error,
      usedPercentage: inputs.usedPercentage,
      fiveHourPercentage: inputs.fiveHourPercentage,
      fiveHourResetSeconds: secondsUntil(inputs.fiveHourResetsAt),
      sevenDayPercentage: inputs.sevenDayPercentage,
      sevenDayResetSeconds: secondsUntil(inputs.sevenDayResetsAt),
      model: inputs.model,
      sessionShape: gatherSessionShape(git.primaryRoot, identity),
    },
    { logo, logoFrame: resolveLogoFrame(logo, inputs.seed) },
  );
}

/**
 * Seconds from now until a Unix-epoch-seconds reset instant, or `undefined` when
 * the instant is absent. The clock read lives here, in the impure adapter, so the
 * downstream countdown formatting stays pure; a past instant yields a negative
 * value that the formatter clamps to zero.
 */
function secondsUntil(resetsAtEpochSeconds: number | undefined): number | undefined {
  return resetsAtEpochSeconds === undefined
    ? undefined
    : resetsAtEpochSeconds - Math.floor(Date.now() / 1000);
}

/**
 * Resolve the per-session render counter for the logo cycle. Only `braille-sharp`
 * cycles, and only when motion is not disabled and a session id is present; every
 * other case pins frame 0 and writes no state.
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

function resolveBuiltIdentityCliPath(): string {
  const moduleDir = dirname(fileURLToPath(import.meta.url));
  return resolve(moduleDir, '..', 'bin', 'agent-identity.js');
}

/**
 * Gather the session-shape inputs and resolve the coordination indicators for
 * this tick, against the PRIMARY checkout root (resolved by {@link gatherGitFacts}
 * — a worktree seat must read the live registry, not its own checked-out copy).
 * These reads soft-fail to undefined: the coordination GLYPHS are best-effort
 * glances, distinct from the load-bearing location facts.
 */
function gatherSessionShape(
  primaryRoot: string | undefined,
  ownAgentName: string | undefined,
): SessionShape {
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
  // ArcAngel channels live in the canonical rapid-comms home.
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
