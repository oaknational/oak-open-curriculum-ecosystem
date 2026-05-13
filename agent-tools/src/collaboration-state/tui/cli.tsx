import { existsSync } from 'node:fs';
import { dirname, join, parse } from 'node:path';

import { render } from 'ink';

import { optional, type Options } from '../cli-options.js';
import { readActiveClaimsFile, readClosedClaimsFile, readCommsEvents } from '../state-io.js';

import { CollaborationTuiApp } from './app.js';
import { buildCollaborationTuiSnapshot, type CollaborationTuiSnapshot } from './snapshot.js';
import { formatCollaborationTuiText } from './text.js';

const DEFAULT_ACTIVE = '.agent/state/collaboration/active-claims.json';
const DEFAULT_CLOSED = '.agent/state/collaboration/closed-claims.archive.json';
const DEFAULT_COMMS_DIR = '.agent/state/collaboration/comms';

export async function collaborationTui(options: Options): Promise<string> {
  const snapshot = await loadCollaborationTuiSnapshot(options);
  const format = optional(options, 'format') ?? 'tui';

  if (format === 'text') {
    return formatCollaborationTuiText(snapshot);
  }
  if (format !== 'tui') {
    throw new Error(`unsupported TUI format '${format}'. Use 'tui' or 'text'.`);
  }

  const app = render(
    <CollaborationTuiApp
      initialSnapshot={snapshot}
      onRefresh={() => loadCollaborationTuiSnapshot(options)}
    />,
  );
  await app.waitUntilExit();

  return '';
}

async function loadCollaborationTuiSnapshot(options: Options): Promise<CollaborationTuiSnapshot> {
  const nowIso = optional(options, 'now') ?? new Date().toISOString();
  const defaults = collaborationTuiDefaults(options);
  const registry = await readActiveClaimsFile(value(options, defaults, 'active'));
  const closedArchive = await readClosedClaimsFile(value(options, defaults, 'closed'));
  const events = await readCommsEvents(value(options, defaults, 'comms-dir'));

  return buildCollaborationTuiSnapshot({
    registry,
    closedArchive,
    events,
    nowIso,
  });
}

function collaborationTuiDefaults(options: Options): Readonly<Record<string, string>> {
  const repoRoot = optional(options, 'repo-root') ?? findCollaborationRepoRoot(process.cwd());
  return {
    active: join(repoRoot, DEFAULT_ACTIVE),
    closed: join(repoRoot, DEFAULT_CLOSED),
    'comms-dir': join(repoRoot, DEFAULT_COMMS_DIR),
  };
}

function value(options: Options, defaults: Readonly<Record<string, string>>, key: string): string {
  const defaultValue = defaults[key];
  if (defaultValue === undefined) {
    throw new Error(`missing default option --${key}`);
  }

  return optional(options, key) ?? defaultValue;
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
