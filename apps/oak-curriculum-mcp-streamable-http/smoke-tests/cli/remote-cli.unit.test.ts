import { describe, expect, it } from 'vitest';
import { buildRemoteCommand } from './remote-cli.js';

interface ParsedOptions {
  readonly remoteBaseUrl?: string;
  readonly remoteDevToken?: string;
}

async function parseOptions(argv: string[]): Promise<ParsedOptions> {
  let resolved: ParsedOptions | undefined;

  const command = buildRemoteCommand((options) => {
    resolved = options;
  });
  command.exitOverride();
  command.configureOutput({
    writeErr: () => undefined,
    writeOut: () => undefined,
    outputError: () => undefined,
  });

  await command.parseAsync(argv, { from: 'node' });

  if (!resolved) {
    throw new Error('Expected CLI to resolve options');
  }

  return resolved;
}

describe('smoke-remote CLI parsing', () => {
  it('uses positional argument when no flag is provided', async () => {
    const options = await parseOptions(['node', 'smoke-remote', 'https://example.com/mcp']);

    expect(options.remoteBaseUrl).toBe('https://example.com/mcp');
    expect(options.remoteDevToken).toBeUndefined();
  });

  it('prefers flag over positional argument', async () => {
    const options = await parseOptions([
      'node',
      'smoke-remote',
      'https://positional.invalid',
      '--remote-base-url',
      'https://flag.example.com/mcp',
    ]);

    expect(options.remoteBaseUrl).toBe('https://flag.example.com/mcp');
  });

  it('captures remote dev token flag', async () => {
    const options = await parseOptions(['node', 'smoke-remote', '--remote-dev-token', 'cli-token']);

    expect(options.remoteDevToken).toBe('cli-token');
  });
});
