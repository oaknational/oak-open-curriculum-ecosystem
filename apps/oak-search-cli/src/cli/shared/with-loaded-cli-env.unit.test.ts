import { afterEach, describe, expect, it, vi } from 'vitest';
import { ok, err } from '@oaknational/result';
import type { SearchCliEnv } from '../../env.js';
import type { SearchCliEnvLoader } from '../../runtime-config.js';
import type { CliObservability } from '../../observability/index.js';
import { parseEnv } from '../../lib/env.js';
import { withLoadedCliEnv } from './with-loaded-cli-env.js';

function createFakeEnvLoader(
  envResult: ReturnType<SearchCliEnvLoader['load']>,
): SearchCliEnvLoader {
  return { load: () => envResult };
}

function createFakeEnv(): SearchCliEnv {
  const result = parseEnv({
    ELASTICSEARCH_URL: 'https://example.test',
    ELASTICSEARCH_API_KEY: 'test-key-12345',
    OAK_API_KEY: 'oak-key-12345',
    SEARCH_API_KEY: 'search-key-12345',
    SEARCH_INDEX_VERSION: 'v2026-01-01',
  });
  if (!result.ok) {
    throw new Error(`Test fixture env parse failed: ${result.error.message}`);
  }
  return result.value;
}

const fakeEnv = createFakeEnv();

afterEach(() => {
  process.exitCode = undefined;
});

describe('withLoadedCliEnv span wrapping', () => {
  it('wraps action in span when observability is provided', async () => {
    const spanNames: string[] = [];
    const fakeObservability: CliObservability = {
      service: 'test',
      environment: 'test',
      release: 'test',
      sentrySink: null,
      async withSpan(options) {
        spanNames.push(options.name);
        return await options.run();
      },
      captureHandledError: vi.fn(),
      setTag: vi.fn(),
      setContext: vi.fn(),
      flush: vi.fn().mockResolvedValue(ok(undefined)),
      close: vi.fn().mockResolvedValue(ok(undefined)),
    };

    const action = vi.fn<(env: SearchCliEnv) => Promise<void>>().mockResolvedValue(undefined);
    const loader = createFakeEnvLoader(ok(fakeEnv));

    const wrappedAction = withLoadedCliEnv(loader, action, {
      observability: fakeObservability,
      commandName: 'test.command',
    });
    await wrappedAction();

    expect(action).toHaveBeenCalledWith(fakeEnv);
    expect(spanNames).toHaveLength(1);
    expect(spanNames[0]).toBe('test.command');
    expect(fakeObservability.setTag).toHaveBeenCalledWith('cli.command', 'test.command');
  });

  it('runs action directly when observability is undefined', async () => {
    const action = vi.fn<(env: SearchCliEnv) => Promise<void>>().mockResolvedValue(undefined);
    const loader = createFakeEnvLoader(ok(fakeEnv));

    const wrappedAction = withLoadedCliEnv(loader, action);
    await wrappedAction();

    expect(action).toHaveBeenCalledWith(fakeEnv);
  });

  it('action errors propagate through span', async () => {
    const fakeObservability: CliObservability = {
      service: 'test',
      environment: 'test',
      release: 'test',
      sentrySink: null,
      async withSpan(options) {
        return await options.run();
      },
      captureHandledError: vi.fn(),
      setTag: vi.fn(),
      setContext: vi.fn(),
      flush: vi.fn().mockResolvedValue(ok(undefined)),
      close: vi.fn().mockResolvedValue(ok(undefined)),
    };

    const action = vi.fn().mockRejectedValue(new Error('boom'));
    const loader = createFakeEnvLoader(ok(fakeEnv));

    const wrappedAction = withLoadedCliEnv(loader, action, {
      observability: fakeObservability,
    });
    await expect(wrappedAction()).rejects.toThrow('boom');
    expect(fakeObservability.setTag).toHaveBeenCalledWith('cli.command', 'oak.cli.command');
  });

  it('still sets exit code on env load failure without observability', async () => {
    const action = vi.fn();
    const loader = createFakeEnvLoader(err({ message: 'bad env', diagnostics: [] }));

    const wrappedAction = withLoadedCliEnv(loader, action);
    await wrappedAction();

    expect(action).not.toHaveBeenCalled();
    expect(process.exitCode).toBe(1);
  });
});
