import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { err, ok } from '@oaknational/result';

import {
  evaluateReviewerRegistrationParityFromInputs,
  reviewerAdapterParityOf,
} from './health-probe-parity.js';

const nowhere = { cursor: [], claude: [], codex: [], gemini: [] } as const;

describe('reviewer adapter parity over the declarations as read', () => {
  it('fails outright, naming the refusal, when the declarations could not be read', () => {
    const refusal = '.agent/sub-agents/templates/linked.md: not a regular file';
    expect(reviewerAdapterParityOf(err(refusal), nowhere)).toStrictEqual({
      key: 'reviewer-adapter-parity',
      label: 'Reviewer adapter parity',
      status: 'fail',
      summary:
        'The sub-agent declarations could not be read, so adapter parity has no truth to compare against.',
      details: [refusal],
    });
  });

  it('compares the declared adapters with the surfaces when the declarations read', () => {
    const declared = ok([{ name: 'code-expert', platforms: ['claude'] as const }]);
    expect(
      reviewerAdapterParityOf(declared, { ...nowhere, claude: ['code-expert'] }),
    ).toMatchObject({ status: 'pass', details: [] });
    expect(reviewerAdapterParityOf(declared, nowhere)).toMatchObject({
      status: 'fail',
      details: ['Claude Code is missing reviewer adapter code-expert.'],
    });
  });
});

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
