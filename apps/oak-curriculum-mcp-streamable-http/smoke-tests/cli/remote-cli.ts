import { Command } from 'commander';
import type { SmokeSuiteOptions } from '../types.js';

export interface RemoteCliOptions {
  readonly remoteBaseUrl?: string;
  readonly remoteDevToken?: string;
}

type RemoteAction = (options: RemoteCliOptions) => Promise<void> | void;

export function buildRemoteCommand(run: RemoteAction): Command {
  const program = new Command()
    .name('smoke-remote')
    .description('Run the Streamable HTTP remote smoke suite against a deployed MCP endpoint')
    .argument('[remoteBaseUrl]', 'Remote base URL (including the /mcp suffix)')
    .option('--remote-base-url <url>', 'Remote base URL (overrides positional argument)')
    .option('--remote-dev-token <token>', 'Remote dev token for authorised runs')
    .action(
      async (
        positional: string | undefined,
        options: { remoteBaseUrl?: string; remoteDevToken?: string },
      ) => {
        const remoteBaseUrl = options.remoteBaseUrl ?? positional;
        await run({
          remoteBaseUrl,
          remoteDevToken: options.remoteDevToken,
        });
      },
    );

  return program;
}

export function optionsToSmokeSuite(options: RemoteCliOptions): SmokeSuiteOptions {
  return {
    mode: 'remote',
    remoteBaseUrl: options.remoteBaseUrl,
    remoteDevToken: options.remoteDevToken,
  };
}
