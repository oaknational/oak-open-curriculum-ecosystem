import { describe, expect, it } from 'vitest';

import { namesGithubRepository, trustedOriginRepository } from './origin-repository.js';

describe('trustedOriginRepository', () => {
  it('names the repository of one https origin', () => {
    expect(trustedOriginRepository(['https://github.com/acme/widgets.git'])).toStrictEqual({
      host: 'github.com',
      owner: 'acme',
      repoName: 'widgets',
    });
  });

  it('names the repository of one scp-style origin, whose user is the transport login', () => {
    expect(trustedOriginRepository(['git@github.com:acme/widgets.git'])?.repoName).toBe('widgets');
  });

  it('names nothing for an https origin carrying userinfo, since a credential in the URL is not trusted', () => {
    expect(
      trustedOriginRepository(['https://x-access-token:s3cret@github.com/acme/widgets.git']),
    ).toBeUndefined();
    expect(trustedOriginRepository(['https://s3cret@github.com/acme/widgets.git'])).toBeUndefined();
  });

  it('names nothing over plain http', () => {
    expect(trustedOriginRepository(['http://github.com/acme/widgets.git'])).toBeUndefined();
  });

  it('names nothing when origin has no URL or several', () => {
    expect(trustedOriginRepository([])).toBeUndefined();
    expect(
      trustedOriginRepository([
        'https://github.com/acme/widgets.git',
        'git@github.com:acme/mirror.git',
      ]),
    ).toBeUndefined();
  });
});

describe('namesGithubRepository', () => {
  it('compares host, owner and name without case', () => {
    const remote = trustedOriginRepository(['https://GitHub.com/Acme/Widgets.git']);
    expect(namesGithubRepository(remote, { owner: 'acme', repoName: 'widgets' })).toBe(true);
    expect(namesGithubRepository(remote, { owner: 'acme', repoName: 'gadgets' })).toBe(false);
    expect(namesGithubRepository(undefined, { owner: 'acme', repoName: 'widgets' })).toBe(false);
  });
});
