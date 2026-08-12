import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { evaluateReviewerRegistrationParityFromInputs } from './health-probe-parity.js';

describe('reviewer registration parity health', () => {
  it('resolves a relative config_file from the Codex config directory', () => {
    // The product resolves registration paths into host absolute form; the
    // expectation derives the same host form so it holds on every platform.
    const adapterPath = resolve('/repo', '.codex/agents/code-expert.toml');
    const observedPaths: string[] = [];
    const registrationCheck = evaluateReviewerRegistrationParityFromInputs({
      repoRoot: '/repo',
      codexAdapterNames: ['code-expert'],
      registrations: [{ name: 'code-expert', configFile: 'agents/code-expert.toml' }],
      pathExists: (path) => {
        observedPaths.push(path);
        return path === adapterPath;
      },
    });

    expect(registrationCheck).toMatchObject({ status: 'pass', details: [] });
    expect(observedPaths).toEqual([adapterPath]);
  });

  it('preserves an absolute config_file path', () => {
    // An absolute config_file is never re-rooted under the repo; the host
    // canonical form of that same absolute path is what the probe must see.
    const adapterPath = resolve('/opt/agents/code-expert.toml');
    const observedPaths: string[] = [];
    const registrationCheck = evaluateReviewerRegistrationParityFromInputs({
      repoRoot: '/repo',
      codexAdapterNames: ['code-expert'],
      registrations: [{ name: 'code-expert', configFile: '/opt/agents/code-expert.toml' }],
      pathExists: (path) => {
        observedPaths.push(path);
        return path === adapterPath;
      },
    });

    expect(registrationCheck).toMatchObject({ status: 'pass', details: [] });
    expect(observedPaths).toEqual([adapterPath]);
  });
});
