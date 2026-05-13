import { existsSync } from 'node:fs';
import { dirname, join, parse } from 'node:path';

import { render } from 'ink';

import { optional, optionalPositiveInteger, type Options } from '../cli-options.js';
import { cliIo, type CliRuntime, waitForCollaborationStateChange } from '../cli-runtime.js';

import { CollaborationTuiApp } from './app.js';
import { type CollaborationTuiUpdateSource } from './controller.js';
import { buildCollaborationTuiSnapshot, type CollaborationTuiSnapshot } from './snapshot.js';
import { formatCollaborationTuiText } from './text.js';

const DEFAULT_ACTIVE = '.agent/state/collaboration/active-claims.json';
const DEFAULT_CLOSED = '.agent/state/collaboration/closed-claims.archive.json';
const DEFAULT_COMMS_DIR = '.agent/state/collaboration/comms';
const DEFAULT_POLL_MS = 500;

export async function collaborationTui(options: Options, runtime: CliRuntime): Promise<string> {
  const config = collaborationTuiConfig(options);
  const snapshot = await loadCollaborationTuiSnapshot(config, runtime);
  const format = optional(options, 'format') ?? 'tui';

  if (format === 'text') {
    return formatCollaborationTuiText(snapshot);
  }
  if (format !== 'tui') {
    throw new Error(`unsupported TUI format '${format}'. Use 'tui' or 'text'.`);
  }

  assertLiveUpdateRuntime(runtime);
  const app = render(
    <CollaborationTuiApp
      initialSnapshot={snapshot}
      onRefresh={() => loadCollaborationTuiSnapshot(config, runtime)}
      updateSource={collaborationTuiUpdateSource(config, runtime)}
    />,
  );
  await app.waitUntilExit();

  return '';
}

function assertLiveUpdateRuntime(runtime: CliRuntime): void {
  if (runtime.waitForCollaborationStateChange === undefined) {
    throw new Error(
      'collaboration-state TUI update source must be provided by the composition layer',
    );
  }
}

interface CollaborationTuiConfig {
  readonly activePath: string;
  readonly closedPath: string;
  readonly commsDir: string;
  readonly nowIso?: string;
  readonly pollMs: number;
}

async function loadCollaborationTuiSnapshot(
  config: CollaborationTuiConfig,
  runtime: CliRuntime,
): Promise<CollaborationTuiSnapshot> {
  const io = cliIo(runtime);
  const nowIso = config.nowIso ?? new Date().toISOString();
  const registry = await io.readActiveClaimsFile(config.activePath);
  const closedArchive = await io.readClosedClaimsFile(config.closedPath);
  const events = await io.readCommsEvents(config.commsDir);

  return buildCollaborationTuiSnapshot({
    registry,
    closedArchive,
    events,
    nowIso,
  });
}

function collaborationTuiConfig(options: Options): CollaborationTuiConfig {
  const defaults = collaborationTuiDefaults(options);
  const nowIso = optional(options, 'now');
  return {
    activePath: value(options, defaults, 'active'),
    closedPath: value(options, defaults, 'closed'),
    commsDir: value(options, defaults, 'comms-dir'),
    pollMs: optionalPositiveInteger(options, 'poll-ms') ?? DEFAULT_POLL_MS,
    ...(nowIso === undefined ? {} : { nowIso }),
  };
}

function collaborationTuiDefaults(options: Options): Readonly<Record<string, string>> {
  const repoRoot = optional(options, 'repo-root') ?? findCollaborationRepoRoot(process.cwd());
  return {
    active: join(repoRoot, DEFAULT_ACTIVE),
    closed: join(repoRoot, DEFAULT_CLOSED),
    'comms-dir': join(repoRoot, DEFAULT_COMMS_DIR),
  };
}

function collaborationTuiUpdateSource(
  config: CollaborationTuiConfig,
  runtime: CliRuntime,
): CollaborationTuiUpdateSource {
  return {
    subscribe(onChange) {
      let disposed = false;

      void watchLoop();

      async function watchLoop(): Promise<void> {
        while (!disposed) {
          await waitForCollaborationStateChange(runtime, {
            activePath: config.activePath,
            closedPath: config.closedPath,
            commsDir: config.commsDir,
            pollMs: config.pollMs,
          });
          if (!disposed) {
            onChange();
          }
        }
      }

      return () => {
        disposed = true;
      };
    },
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
