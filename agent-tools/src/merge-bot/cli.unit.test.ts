import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { runMergeBotCli, type MergeBotCliInput } from './cli.js';
import type { GithubApiFetch } from './mint-installation-token.js';
import { TOKEN_SCOPE_NAMES, TOKEN_SCOPES } from './token-scopes.js';

import { generateKeyPairSync } from 'node:crypto';

const { privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

function capture(): { text: () => string; sink: Pick<NodeJS.WriteStream, 'write'> } {
  let buffer = '';
  return {
    text: () => buffer,
    sink: {
      write(chunk: string): boolean {
        buffer += chunk;
        return true;
      },
    },
  };
}

function happyFetch(): GithubApiFetch {
  return (url) => {
    if (url.endsWith('/installation')) {
      return Promise.resolve({ status: 200, json: () => Promise.resolve({ id: 55 }) });
    }
    return Promise.resolve({
      status: 201,
      json: () => Promise.resolve({ token: 'ghs_tok', expires_at: '2026-07-21T08:00:00Z' }),
    });
  };
}

function runWith(overrides: Partial<MergeBotCliInput> & { args: readonly string[] }): {
  exit: Promise<number>;
  out: () => string;
  errText: () => string;
} {
  const out = capture();
  const errSink = capture();
  const exit = runMergeBotCli({
    env: {},
    stdout: out.sink,
    stderr: errSink.sink,
    fetchImpl: happyFetch(),
    readFileImpl: () => Promise.resolve(privateKey),
    readConfigFileImpl: () => {
      throw new Error('ENOENT (no repo config in this test)');
    },
    repoRoot: '/repo',
    // The clone's primary checkout, as git would report it from '/repo'.
    runGitImpl: () =>
      'worktree /repo\nHEAD 0000000000000000000000000000000000000000\nbranch refs/heads/main\n\n',
    nowEpochSeconds: () => 1_800_000_000,
    ...overrides,
  });
  return { exit, out: out.text, errText: errSink.text };
}

describe('runMergeBotCli mint-token --scope', () => {
  /** The mint body the CLI actually put on the wire for a given scope. */
  async function mintedPermissionsFor(scope: string): Promise<unknown> {
    const calls: { url: string; body?: string }[] = [];
    const run = runWith({
      args: [
        'mint-token',
        '--scope',
        scope,
        '--app-id',
        '1',
        '--private-key-path',
        '/k.pem',
        '--repo',
        'o/r',
      ],
      fetchImpl: (url, init) => {
        calls.push({ url, body: init.body });
        return Promise.resolve({
          status: url.endsWith('/installation') ? 200 : 201,
          json: () =>
            Promise.resolve(
              url.endsWith('/installation')
                ? { id: 987 }
                : { token: 'ghs_abc', expires_at: '2026-07-21T07:30:00Z' },
            ),
        });
      },
    });
    expect(await run.exit).toBe(0);
    const mint = calls.find((call) => call.url.endsWith('/access_tokens'));
    return JSON.parse(mint?.body ?? '{}').permissions;
  }

  // The ENGINE: whatever the flag names is what reaches the wire. Generic over
  // the table, so a scope added later arrives with coverage rather than
  // silently without it — and it transcribes nothing, so it is not the table
  // asserted twice.
  it.each(TOKEN_SCOPE_NAMES)('mints exactly the permissions %s names', async (scope) => {
    expect(await mintedPermissionsFor(scope)).toEqual(TOKEN_SCOPES[scope]);
  });

  it('still puts all three write permissions on the wire for pull-request work', async () => {
    // Kept as a LITERAL deliberately, unlike the generic test above. This set
    // is not our arbitrary choice: `workflows: write` is fixed externally by
    // GitHub's refusal on `update-branch`, observed 2026-07-26 against PR
    // #565. Without this row only a live workflow-touching merge would notice
    // that permission going missing.
    expect(await mintedPermissionsFor('pull-request-work')).toEqual({
      pull_requests: 'write',
      contents: 'write',
      workflows: 'write',
    });
  });

  it('still puts actions write, and nothing more, on the wire for a workflow dispatch', async () => {
    // A LITERAL for the same reason as the row above. `actions: write` is fixed
    // externally by GitHub: it is what the workflow-dispatch endpoint requires,
    // and a 403 reading exactly `Resource not accessible by integration` on
    // `POST .../dispatches` was the observed symptom of its absence
    // (2026-09-11). The exact set matters as much as the member: this scope
    // dispatches the carrier and re-runs failed jobs, neither of which writes,
    // so a contents permission creeping in here would hand every such act a
    // push-capable token it never uses. The generic test compares the minted
    // payload against the table, so a typo or a downgrade to `read` in the
    // TABLE would satisfy it — the two would agree on the wrong thing, and
    // only a live dispatch would find out.
    expect(await mintedPermissionsFor('workflow-dispatch')).toEqual({ actions: 'write' });
  });

  it('still puts actions and contents write on the wire for the mirror dispatch', async () => {
    // A LITERAL for the same reason. Each member has a named fixer outside
    // this table: `actions: write` is what GitHub's dispatch endpoint
    // requires; `contents: write` is what the dispatched mirror job's own
    // `permissions:` block declares (its node's decision 7) combined with
    // GitHub's cap on a dispatched run — its `GITHUB_TOKEN` cannot exceed the
    // dispatching token's permissions. Measured: the mirror's fast-forward
    // answered 403 under `workflow-dispatch` (run 35240876819, 2026-09-17)
    // while every scheduled run of the same step succeeded, and succeeded
    // under this permission set (run 35241924531). A change to that job's
    // permissions is this value's re-adjudication point; a downgrade of either
    // member in the TABLE would pass the generic test and fail only at the
    // next live mirror dispatch.
    expect(await mintedPermissionsFor('upstream-mirror-dispatch')).toEqual({
      actions: 'write',
      contents: 'write',
    });
  });

  it('lists every scope with each permission at its level in the usage text', async () => {
    // USAGE is the discovery surface for a newly-required flag, and its list
    // is derived — this proves the derivation renders, not that a literal
    // matches. The level is on the scope's own line: two scopes share
    // `contents` at read and at write, so a name alone would not say which
    // one writes.
    const run = runWith({ args: ['--help'] });

    expect(await run.exit).toBe(0);
    const lines = run.out().split('\n');
    for (const scope of TOKEN_SCOPE_NAMES) {
      const line = lines.find((text) => text.startsWith(`    ${scope}: `)) ?? '';
      for (const [permission, level] of Object.entries(TOKEN_SCOPES[scope])) {
        expect(line).toContain(`${permission}: ${level}`);
      }
    }
  });

  it('refuses a bare mint-token for the SCOPE, before it ever consults identity', async () => {
    // No identity flags at all, and runWith's config reader throws. The scope
    // failure must still be what the operator is told: a stale flagless paste
    // reported as "identity unreadable" sends them chasing the wrong thing.
    const run = runWith({ args: ['mint-token'] });

    expect(await run.exit).toBe(2);
    expect(run.out()).toBe('');
    expect(run.errText()).toContain('--scope is required');
    expect(run.errText()).not.toContain('single authority');
  });

  it('refuses an unknown scope as a usage error, not a mint failure', async () => {
    const run = runWith({
      args: [
        'mint-token',
        '--scope',
        'admin-everything',
        '--app-id',
        '1',
        '--private-key-path',
        '/k.pem',
        '--repo',
        'o/r',
      ],
    });

    expect(await run.exit).toBe(2);
    expect(run.out()).toBe('');
    expect(run.errText()).toContain('admin-everything');
    expect(run.errText()).toContain('code-scanning-alerts');
  });
});

describe('runMergeBotCli mint-token', () => {
  it('prints ONLY the token on stdout (expiry goes to stderr)', async () => {
    const run = runWith({
      args: [
        'mint-token',
        '--scope',
        'pull-request-work',
        '--app-id',
        '4242',
        '--private-key-path',
        '/k.pem',
        '--repo',
        'o/r',
      ],
    });
    expect(await run.exit).toBe(0);
    expect(run.out()).toBe('ghs_tok\n');
    expect(run.errText()).toContain('expires 2026-07-21T08:00:00Z');
  });

  it('emits a JSON object with token, expiry, and installation id under --json', async () => {
    const run = runWith({
      args: [
        'mint-token',
        '--scope',
        'pull-request-work',
        '--app-id',
        '4242',
        '--private-key-path',
        '/k.pem',
        '--repo',
        'o/r',
        '--json',
      ],
    });
    expect(await run.exit).toBe(0);
    expect(JSON.parse(run.out())).toEqual({
      token: 'ghs_tok',
      expiresAt: '2026-07-21T08:00:00Z',
      installationId: 55,
    });
  });

  it('fails loudly, naming the authority and the template, when the repo config is unreadable and no override given', async () => {
    const run = runWith({ args: ['mint-token', '--scope', 'pull-request-work'] });
    expect(await run.exit).toBe(2);
    expect(run.errText()).toContain('.github/merge-bot.json is the single authority');
    expect(run.errText()).toContain(join('.github', 'merge-bot.json.example'));
    expect(run.out()).toBe('');
  });

  it("resolves the config at the clone's primary checkout, starting from the invoking root, so every linked worktree reads the one copy", async () => {
    const configReads: string[] = [];
    const gitCwds: string[] = [];
    const run = runWith({
      args: ['mint-token', '--scope', 'pull-request-work'],
      env: { HOME: '/test-home' },
      repoRoot: '/primary-worktrees/lane',
      runGitImpl: (_args, cwd) => {
        gitCwds.push(cwd);
        return [
          'worktree /primary',
          'HEAD 0000000000000000000000000000000000000000',
          'branch refs/heads/main',
          '',
          'worktree /primary-worktrees/lane',
          'HEAD 1111111111111111111111111111111111111111',
          'branch refs/heads/lane',
          '',
        ].join('\n');
      },
      readConfigFileImpl: (filePath) => {
        configReads.push(filePath);
        return JSON.stringify({ appSlug: 'jimbot-oakington-iii', appId: '4352989', repo: 'o/r' });
      },
    });
    expect(await run.exit).toBe(0);
    expect(gitCwds).toEqual(['/primary-worktrees/lane']);
    expect(configReads).toEqual([join('/primary', '.github', 'merge-bot.json')]);
  });

  it('fails with exit 2 naming the primary checkout, with guidance every action can follow, when git cannot locate it', async () => {
    const run = runWith({
      args: ['mint-token', '--scope', 'pull-request-work'],
      runGitImpl: () => {
        throw new Error('fatal: not a git repository');
      },
    });
    expect(await run.exit).toBe(2);
    expect(run.errText()).toContain('primary checkout');
    expect(run.errText()).toContain('not a git repository');
    expect(run.errText()).toContain('run from inside the clone');
    expect(run.out()).toBe('');
  });

  it('resolves identity and key path from the repo config — the canonical source', async () => {
    const keyReads: string[] = [];
    const run = runWith({
      args: ['mint-token', '--scope', 'pull-request-work'],
      env: { HOME: '/test-home' },
      readConfigFileImpl: () =>
        JSON.stringify({
          appSlug: 'jimbot-oakington-iii',
          appId: '4352989',
          repo: 'acme/widgets',
        }),
      readFileImpl: (path: string) => {
        keyReads.push(path);
        return Promise.resolve(privateKey);
      },
    });
    expect(await run.exit).toBe(0);
    expect(run.out()).toBe('ghs_tok\n');
    // The product derives a host-joined key path; the expectation derives the
    // same host form so the assertion holds on every platform.
    expect(keyReads).toEqual([
      join('/test-home', '.config', 'jimbot-oakington-iii', 'private-key.pem'),
    ]);
  });

  it('honours explicit flag overrides above the repo config', async () => {
    const keyReads: string[] = [];
    const run = runWith({
      args: [
        'mint-token',
        '--scope',
        'pull-request-work',
        '--app-id',
        '999',
        '--private-key-path',
        '/explicit.pem',
      ],
      readConfigFileImpl: () =>
        JSON.stringify({ appSlug: 'jimbot-oakington-iii', appId: '4352989', repo: 'o/r' }),
      readFileImpl: (path: string) => {
        keyReads.push(path);
        return Promise.resolve(privateKey);
      },
    });
    expect(await run.exit).toBe(0);
    expect(keyReads).toEqual(['/explicit.pem']);
  });

  it('fails with exit 1 and a named cause when the PEM is not a valid key', async () => {
    const run = runWith({
      args: [
        'mint-token',
        '--scope',
        'pull-request-work',
        '--app-id',
        '1',
        '--private-key-path',
        '/k.pem',
        '--repo',
        'o/r',
      ],
      readFileImpl: () => Promise.resolve('this is not a PEM'),
    });
    expect(await run.exit).toBe(1);
    expect(run.errText()).toContain('cannot sign the app JWT');
    expect(run.out()).toBe('');
  });

  it('fails with exit 1 and a hint when the key file is unreadable', async () => {
    const run = runWith({
      args: [
        'mint-token',
        '--scope',
        'pull-request-work',
        '--app-id',
        '1',
        '--private-key-path',
        '/missing.pem',
        '--repo',
        'o/r',
      ],
      readFileImpl: () => Promise.reject(new Error('ENOENT')),
    });
    expect(await run.exit).toBe(1);
    expect(run.errText()).toContain('cannot read private key at /missing.pem');
  });

  it('rejects malformed --repo values', async () => {
    const run = runWith({
      args: [
        'mint-token',
        '--scope',
        'pull-request-work',
        '--app-id',
        '1',
        '--private-key-path',
        '/k.pem',
        '--repo',
        'nope',
      ],
    });
    expect(await run.exit).toBe(2);
    expect(run.errText()).toContain('owner/name');
  });

  it('rejects unknown actions and flags with usage', async () => {
    const bad = runWith({ args: ['do-magic'] });
    expect(await bad.exit).toBe(2);
    expect(bad.errText()).toContain('unknown action');

    const badFlag = runWith({
      args: [
        'mint-token',
        '--scope',
        'pull-request-work',
        '--app-id',
        '1',
        '--private-key-path',
        '/k.pem',
        '--repo',
        'o/r',
        '--wat',
        'x',
      ],
    });
    expect(await badFlag.exit).toBe(2);
    expect(badFlag.errText()).toContain('unknown flag');
  });
});
