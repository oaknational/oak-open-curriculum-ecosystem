import { describe, expect, it } from 'vitest';

import { ensureDevServer, resolveDevCommand, judgeServerIdentity } from './dev-server';

const NODE_BIN = '/versions/node/v24.15.0/bin/node';

describe('resolveDevCommand', () => {
  it('runs a corepack pnpm.mjs entry under the current node binary', () => {
    const result = resolveDevCommand('/cache/node/corepack/v1/pnpm/11.10.0/bin/pnpm.mjs', NODE_BIN);
    expect(result.ok && result.value).toEqual({
      bin: NODE_BIN,
      args: ['/cache/node/corepack/v1/pnpm/11.10.0/bin/pnpm.mjs', 'dev'],
    });
  });

  it('runs a pnpm.cjs entry under the current node binary', () => {
    const result = resolveDevCommand('/lib/node_modules/pnpm/bin/pnpm.cjs', NODE_BIN);
    expect(result.ok && result.value).toEqual({
      bin: NODE_BIN,
      args: ['/lib/node_modules/pnpm/bin/pnpm.cjs', 'dev'],
    });
  });

  it('runs a legacy pnpm.js entry under the current node binary', () => {
    const result = resolveDevCommand('/usr/local/lib/node_modules/pnpm/bin/pnpm.js', NODE_BIN);
    expect(result.ok && result.value).toEqual({
      bin: NODE_BIN,
      args: ['/usr/local/lib/node_modules/pnpm/bin/pnpm.js', 'dev'],
    });
  });

  it('runs a native pnpm binary directly by its absolute path', () => {
    const result = resolveDevCommand('/opt/homebrew/bin/pnpm', NODE_BIN);
    expect(result.ok && result.value).toEqual({
      bin: '/opt/homebrew/bin/pnpm',
      args: ['dev'],
    });
  });
});

describe('resolveDevCommand refusals', () => {
  it('fails loud when npm_execpath is absent (tool run outside a pnpm script)', () => {
    const result = resolveDevCommand(undefined, NODE_BIN);
    expect(!result.ok && result.error).toContain('npm_execpath is not set');
  });

  it('fails loud when npm_execpath is empty', () => {
    const result = resolveDevCommand('', NODE_BIN);
    expect(!result.ok && result.error).toContain('npm_execpath is not set');
  });

  it('rejects a relative npm_execpath — a PATH lookup is never spawned', () => {
    const result = resolveDevCommand('pnpm', NODE_BIN);
    expect(!result.ok && result.error).toContain('not an absolute path');
  });

  it('rejects a non-pnpm package manager — this repo is pnpm-only', () => {
    const result = resolveDevCommand('/usr/lib/node_modules/npm/bin/npm-cli.js', NODE_BIN);
    expect(!result.ok && result.error).toContain('pnpm-only');
  });
});

describe('ensureDevServer demoDir contract', () => {
  it('refuses a relative demoDir before touching the network or spawning', async () => {
    const result = await ensureDevServer('http://localhost:3999', 'demos/oak-curriculum-hub', {
      path: '/',
      marker: 'oak-curriculum-hub',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('must be an absolute path');
    }
  });
});

describe('judgeServerIdentity', () => {
  const sentinel = { path: '/', marker: 'oak-design-showcase' };

  it('accepts a 2xx body carrying the oak-app meta and the app marker', () => {
    const outcome = judgeServerIdentity(
      { status: 200, body: '<meta name="oak-app" content="oak-design-showcase"/>' },
      sentinel,
    );

    expect(outcome.ok).toBe(true);
  });

  it('refuses a responding FOREIGN server — answering is not identity', () => {
    const outcome = judgeServerIdentity(
      { status: 200, body: '<html><title>Some other app</title></html>' },
      sentinel,
    );

    expect(outcome.ok).toBe(false);
    expect(outcome.ok ? undefined : outcome.error).toContain('NOT this app');
  });

  it('refuses the WRONG oak app — the marker discriminates between our own demos', () => {
    const outcome = judgeServerIdentity(
      { status: 200, body: '<meta name="oak-app" content="oak-curriculum-hub"/>' },
      sentinel,
    );

    expect(outcome.ok).toBe(false);
  });

  it('refuses a non-2xx status by name', () => {
    const outcome = judgeServerIdentity(
      { status: 500, body: 'oak-app oak-design-showcase' },
      sentinel,
    );

    expect(outcome.ok).toBe(false);
    expect(outcome.ok ? undefined : outcome.error).toContain('500');
  });
});
