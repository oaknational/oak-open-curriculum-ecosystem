import { describe, expect, it } from 'vitest';

import { listChangedPaths } from './merge-changed-files.js';
import type { GithubApiFetch } from './mint-installation-token.js';

/**
 * Integration over an injected fetch port (a constant table, no network): the
 * changed-files read pages until a short page and carries a rename's both
 * names. Where the read happens — only at the door, once the required
 * contexts are green by name — is proven at the execution level in
 * `merge-records-class.integration.test.ts`.
 */

const target = {
  identity: { appId: '1', keyPath: '/dev/null', owner: 'acme', repoName: 'widgets' },
  prNumber: 42,
};

function pageOf(count: number, prefix: string): { filename: string }[] {
  return Array.from({ length: count }, (_, index) => ({ filename: `${prefix}${index}.md` }));
}

/** A fetch port serving pages by their `page=` query, recording every URL asked for. */
function filesPort(pages: readonly unknown[]): { fetchImpl: GithubApiFetch; urls: string[] } {
  const urls: string[] = [];
  const fetchImpl: GithubApiFetch = (url) => {
    urls.push(url);
    const page = Number(/[&?]page=(\d+)/u.exec(url)?.[1] ?? '1');
    return Promise.resolve({ status: 200, json: () => Promise.resolve(pages[page - 1] ?? []) });
  };
  return { fetchImpl, urls };
}

describe('listChangedPaths', () => {
  it('reads one short page and stops', async () => {
    const { fetchImpl, urls } = filesPort([[{ filename: 'README.md' }, { filename: 'docs/a.md' }]]);

    const paths = await listChangedPaths(fetchImpl, 'token', target);

    expect(paths).toStrictEqual({ ok: true, value: ['README.md', 'docs/a.md'] });
    expect(urls).toHaveLength(1);
    expect(urls[0]).toContain('/repos/acme/widgets/pulls/42/files?per_page=100&page=1');
  });

  it('follows a full page to the next and carries a rename under both names', async () => {
    const { fetchImpl, urls } = filesPort([
      pageOf(100, 'docs/page-'),
      [{ filename: 'docs/new.md', previous_filename: 'docs/old.md' }],
    ]);

    const paths = await listChangedPaths(fetchImpl, 'token', target);

    expect(paths.ok).toBe(true);
    if (paths.ok) {
      expect(paths.value).toHaveLength(102);
      expect(paths.value.slice(-2)).toStrictEqual(['docs/new.md', 'docs/old.md']);
    }
    expect(urls).toHaveLength(2);
  });

  it('reports a non-200 answer as an error naming the page', async () => {
    const fetchImpl: GithubApiFetch = () =>
      Promise.resolve({ status: 404, json: () => Promise.resolve({ message: 'Not Found' }) });

    const paths = await listChangedPaths(fetchImpl, 'token', target);

    expect(paths.ok).toBe(false);
    if (!paths.ok) {
      expect(paths.error.message).toContain('404');
      expect(paths.error.message).toContain('page 1');
    }
  });

  it('refuses a body that is not a files page', async () => {
    const fetchImpl: GithubApiFetch = () =>
      Promise.resolve({ status: 200, json: () => Promise.resolve({ unexpected: true }) });

    const paths = await listChangedPaths(fetchImpl, 'token', target);

    expect(paths.ok).toBe(false);
  });
});
