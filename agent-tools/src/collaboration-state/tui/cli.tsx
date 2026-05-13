import { render } from 'ink';

import { optional, type Options } from '../cli-options.js';
import { cliIo, type CliRuntime, waitForCollaborationStateChange } from '../cli-runtime.js';

import { CollaborationTuiApp } from './app.js';
import { collaborationTuiConfig, type CollaborationTuiConfig } from './config.js';
import { type CollaborationTuiUpdateSource } from './controller.js';
import { buildCollaborationTuiSnapshot, type CollaborationTuiSnapshot } from './snapshot.js';
import { formatCollaborationTuiText } from './text.js';

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
