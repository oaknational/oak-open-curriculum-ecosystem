import { existsSync } from 'node:fs';
import { dirname, join, parse } from 'node:path';

import { optional, optionalPositiveInteger, type Options } from '../cli-options.js';

const DEFAULT_ACTIVE = '.agent/state/collaboration/active-claims.json';
const DEFAULT_CLOSED = '.agent/state/collaboration/closed-claims.archive.json';
const DEFAULT_COMMS_DIR = '.agent/state/collaboration/comms';
const DEFAULT_POLL_MS = 500;

export interface CollaborationTuiConfig {
  readonly activePath: string;
  readonly closedPath: string;
  readonly commsDir: string;
  readonly nowIso?: string;
  readonly pollMs: number;
}

export interface CollaborationTuiConfigRuntime {
  readonly cwd: string;
}

export function collaborationTuiConfig(
  options: Options,
  runtime?: CollaborationTuiConfigRuntime,
): CollaborationTuiConfig {
  const resolvedRuntime = runtime ?? { cwd: process.cwd() };
  const repoRoot = optional(options, 'repo-root') ?? findCollaborationRepoRoot(resolvedRuntime.cwd);
  const nowIso = optional(options, 'now');

  return {
    activePath: optional(options, 'active') ?? join(repoRoot, DEFAULT_ACTIVE),
    closedPath: optional(options, 'closed') ?? join(repoRoot, DEFAULT_CLOSED),
    commsDir: optional(options, 'comms-dir') ?? join(repoRoot, DEFAULT_COMMS_DIR),
    pollMs: optionalPositiveInteger(options, 'poll-ms') ?? DEFAULT_POLL_MS,
    ...(nowIso === undefined ? {} : { nowIso }),
  };
}

function findCollaborationRepoRoot(start: string): string {
  let current = start;
  const root = parse(start).root;
  while (true) {
    if (existsSync(join(current, '.agent', 'state', 'collaboration'))) {
      return current;
    }
    if (current === root) {
      return start;
    }
    current = dirname(current);
  }
}
