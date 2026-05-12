import { existsSync } from 'node:fs';
import { dirname, join, parse } from 'node:path';

import { render } from 'ink';

import { optional, type Options } from '../cli-options.js';
import {
  readActiveClaimsFile,
  readClosedClaimsFile,
  readDirectedCommsMessages,
  readLifecycleCommsEvents,
  readNarrativeCommsEvents,
} from '../state-io.js';

import { CollaborationTuiApp } from './app.js';
import { buildCollaborationTuiSnapshot, type CollaborationTuiSnapshot } from './snapshot.js';
import { formatCollaborationTuiText } from './text.js';

const DEFAULT_ACTIVE = '.agent/state/collaboration/active-claims.json';
const DEFAULT_CLOSED = '.agent/state/collaboration/closed-claims.archive.json';
const DEFAULT_EVENTS_DIR = '.agent/state/collaboration/comms-events';
const DEFAULT_LIFECYCLE_DIR = '.agent/state/collaboration/comms-lifecycle';
const DEFAULT_MESSAGES_DIR = '.agent/state/collaboration/comms-messages';

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

export async function loadCollaborationTuiSnapshot(
  options: Options,
): Promise<CollaborationTuiSnapshot> {
  const nowIso = optional(options, 'now') ?? new Date().toISOString();
  const defaults = collaborationTuiDefaults(options);
  const registry = await readActiveClaimsFile(value(options, defaults, 'active'));
  const closedArchive = await readClosedClaimsFile(value(options, defaults, 'closed'));
  const narrative = await readNarrativeCommsEvents(value(options, defaults, 'events-dir'));
  const lifecycle = await readLifecycleCommsEvents(value(options, defaults, 'lifecycle-dir'));
  const directed = await readDirectedCommsMessages(value(options, defaults, 'messages-dir'));

  return buildCollaborationTuiSnapshot({
    registry,
    closedArchive,
    narrative,
    lifecycle,
    directed,
    nowIso,
  });
}

export function collaborationTuiDefaults(options: Options): Readonly<Record<string, string>> {
  const repoRoot = optional(options, 'repo-root') ?? findCollaborationRepoRoot(process.cwd());
  return {
    active: join(repoRoot, DEFAULT_ACTIVE),
    closed: join(repoRoot, DEFAULT_CLOSED),
    'events-dir': join(repoRoot, DEFAULT_EVENTS_DIR),
    'lifecycle-dir': join(repoRoot, DEFAULT_LIFECYCLE_DIR),
    'messages-dir': join(repoRoot, DEFAULT_MESSAGES_DIR),
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
