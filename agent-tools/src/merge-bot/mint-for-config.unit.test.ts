import { generateKeyPairSync } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import { mintForConfig, type MintConfig } from './mint-for-config.js';
import type { GithubApiFetch } from './mint-installation-token.js';

/**
 * The mint pipeline's REQUEST-level failures. Status and body failures were
 * already translated; a REJECTED fetch (DNS failure, connection reset) is a
 * third shape, and it escaped `mintForConfig` as a throw — reaching the
 * usage-error exit path of both the merge and push actions, which reads as
 * "the operator typed something wrong". It must land as a Result naming
 * which call failed.
 */

const { privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

const CONFIG: MintConfig = {
  appId: '4352989',
  keyPath: '/keys/app.pem',
  owner: 'acme',
  repoName: 'widgets',
  scope: 'pull-request-merge',
};

function seams(fetchImpl: GithubApiFetch): Parameters<typeof mintForConfig>[1] {
  return {
    fetchImpl,
    readFileImpl: () => Promise.resolve(privateKey),
    nowEpochSeconds: () => 1_800_000_000,
  };
}

describe('mintForConfig — request-level rejections', () => {
  it('resolves to an error naming the installation lookup when THAT request is rejected', async () => {
    const result = await mintForConfig(
      CONFIG,
      seams((url) =>
        url.endsWith('/installation')
          ? Promise.reject(new Error('getaddrinfo ENOTFOUND api.github.com'))
          : Promise.resolve({ status: 201, json: () => Promise.resolve({}) }),
      ),
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('/installation');
      expect(result.error.message).toContain('ENOTFOUND');
    }
  });

  it('resolves to an error naming the token mint when THAT request is rejected', async () => {
    const result = await mintForConfig(
      CONFIG,
      seams((url) =>
        url.endsWith('/access_tokens')
          ? Promise.reject(new Error('socket hang up'))
          : Promise.resolve({ status: 200, json: () => Promise.resolve({ id: 55 }) }),
      ),
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('access_tokens');
      expect(result.error.message).toContain('socket hang up');
    }
  });
});
