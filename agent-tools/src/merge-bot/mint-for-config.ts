import { readFile } from 'node:fs/promises';

import { err, ok, type Result } from '@oaknational/result';

import {
  mintInstallationToken,
  resolveInstallationId,
  signAppJwt,
  type GithubApiFetch,
} from './mint-installation-token.js';
import type { BotIdentity } from './resolve-identity.js';
import { TOKEN_SCOPES, type TokenScopeName } from './token-scopes.js';

/**
 * The whole mint pipeline for a resolved identity + scope: read the key,
 * sign the app JWT, resolve the installation, mint the installation token.
 * Split from `cli.ts` when the `merge` action became the second consumer
 * (`consolidate-at-second-consumer`) — one mint implementation, every
 * action a caller.
 */

/** The identity plus the requested scope NAME; permissions are looked up once, at the mint. */
export interface MintConfig extends BotIdentity {
  readonly scope: TokenScopeName;
}

/** Injection seams shared by every minting caller. */
export interface MintSeams {
  readonly fetchImpl?: GithubApiFetch;
  readonly readFileImpl?: (path: string) => Promise<string>;
  readonly nowEpochSeconds?: () => number;
}

/** A successfully minted installation token and its expiry. */
export interface MintedToken {
  readonly token: string;
  readonly expiresAt: string;
  readonly installationId: number;
}

function realFetch(): GithubApiFetch {
  return async (url, init) => {
    const response = await fetch(url, init);
    return { status: response.status, json: () => response.json() };
  };
}

function signJwtResult(
  appId: string,
  privateKeyPem: string,
  nowEpochSeconds: number,
): Result<string, Error> {
  try {
    return ok(signAppJwt({ appId, privateKeyPem, nowEpochSeconds }));
  } catch (cause) {
    return err(
      new Error(
        `cannot sign the app JWT (is the PEM a valid private key?): ${cause instanceof Error ? cause.message : String(cause)}`,
      ),
    );
  }
}

async function readKeyResult(
  keyPath: string,
  readFileImpl: MintSeams['readFileImpl'],
): Promise<Result<string, Error>> {
  const readKey = readFileImpl ?? ((path: string) => readFile(path, 'utf8'));
  try {
    return ok(await readKey(keyPath));
  } catch (cause) {
    return err(
      new Error(
        `cannot read private key at ${keyPath}: ${cause instanceof Error ? cause.message : String(cause)}`,
      ),
    );
  }
}

/** Mint an installation token for the resolved identity at the named scope. */
export async function mintForConfig(
  config: MintConfig,
  seams: MintSeams,
): Promise<Result<MintedToken, Error>> {
  const privateKeyPem = await readKeyResult(config.keyPath, seams.readFileImpl);
  if (!privateKeyPem.ok) {
    return privateKeyPem;
  }

  const now = seams.nowEpochSeconds ?? ((): number => Math.floor(Date.now() / 1000));
  const fetchImpl = seams.fetchImpl ?? realFetch();
  const appJwt = signJwtResult(config.appId, privateKeyPem.value, now());
  if (!appJwt.ok) {
    return appJwt;
  }

  const installation = await resolveInstallationId({
    appJwt: appJwt.value,
    owner: config.owner,
    repo: config.repoName,
    fetchImpl,
  });
  if (!installation.ok) {
    return installation;
  }

  const minted = await mintInstallationToken({
    appJwt: appJwt.value,
    installationId: installation.value,
    repoName: config.repoName,
    permissions: TOKEN_SCOPES[config.scope],
    fetchImpl,
  });
  if (!minted.ok) {
    return minted;
  }
  return ok({ ...minted.value, installationId: installation.value });
}
