import { describe, it, expect, vi } from 'vitest';
import { defineProviderContract } from '@oaknational/mcp-core/testing/provider-contract';
import { createConsoleLogger, createInMemoryStorage, createNodeClock } from './index';

describe('providers-node contract', () => {
  it('satisfies the core provider contract', async () => {
    const spyDebug = vi.spyOn(console, 'debug').mockImplementation(() => undefined);
    const spyInfo = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    const spyWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const spyError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const contract = defineProviderContract({
      createLogger: () => createConsoleLogger('test'),
      createClock: () => createNodeClock(),
      createStorage: () => createInMemoryStorage(),
    });

    // Behaviour checks (no IO/network)
    contract.clockBehavesMonotonically();
    contract.loggerAcceptsMessages();
    await contract.storageRoundtrip();

    expect(spyDebug).toHaveBeenCalled();
    expect(spyInfo).toHaveBeenCalled();
    expect(spyWarn).toHaveBeenCalled();
    expect(spyError).toHaveBeenCalled();

    spyDebug.mockRestore();
    spyInfo.mockRestore();
    spyWarn.mockRestore();
    spyError.mockRestore();
  });
});
