import { describe, expect, it } from 'vitest';

import { ensureDevServer, judgeServerIdentity } from './dev-server';

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
