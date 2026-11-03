import { describe, expect, it } from 'vitest';

import { parseGitRemoteUrl } from './git-remote-url.js';

describe('parseGitRemoteUrl', () => {
  it.each([
    { url: 'https://github.com/acme/widgets.git', host: 'github.com' },
    { url: 'https://github.com/acme/widgets', host: 'github.com' },
    { url: 'https://github.com/acme/widgets/', host: 'github.com' },
    { url: 'git@github.com:acme/widgets.git', host: 'github.com' },
    { url: 'ssh://git@github.com/acme/widgets.git', host: 'github.com' },
    { url: 'git@github-work:acme/widgets.git', host: 'github-work' },
    { url: 'github.com:acme/widgets', host: 'github.com' },
    { url: 'https://jim@github.com/acme/widgets.git', host: 'github.com' },
    { url: 'https://github.com@evil.example/acme/widgets.git', host: 'evil.example' },
    { url: 'https://gitlab.example/acme/widgets.git', host: 'gitlab.example' },
    { url: 'http://github.com/acme/widgets.git', host: 'github.com' },
  ])('reads $url as acme/widgets on $host', ({ url, host }) => {
    expect(parseGitRemoteUrl(url)).toEqual({ host, owner: 'acme', repoName: 'widgets' });
  });

  it.each([
    { url: 'https://github.com/only-owner' },
    { url: 'https://gitlab.example/group/sub/repo.git' },
    { url: '/local/mirror/widgets.git' },
    { url: 'github.com/acme/widgets' },
    { url: 'https://x-access-token:secret@github.com/acme/widgets.git' },
    { url: 'ssh://git@github.com:22/acme/widgets.git' },
    { url: 'file:///srv/acme/widgets.git' },
    { url: 'https://github.com//widgets.git' },
    { url: '' },
  ])('reads no repository from $url', ({ url }) => {
    expect(parseGitRemoteUrl(url)).toBeUndefined();
  });
});
