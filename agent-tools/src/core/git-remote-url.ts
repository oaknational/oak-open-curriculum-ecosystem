/**
 * A git remote URL, read as the host and the `owner/repo` path it names. Pure.
 *
 * The one parser for three of the forms git accepts: `https://host/owner/repo`
 * (and the same over plain `http://`), scp-style `user@host:owner/repo` and
 * `ssh://user@host/owner/repo`, each with or without `.git`; any other form
 * reads as no repository. A slash after the host needs a scheme, since git reads
 * `host/owner/repo` as a local path. Callers decide what the parts mean, and
 * whether to trust the transport: the operator profile keys a repository by
 * owner and name on any host, and `merge-bot push` trusts an origin only when
 * the host is github.com and the URL is not plain http.
 */

/** The repository a remote URL names, and the host it is on. */
export interface GitRemoteRepository {
  readonly host: string;
  readonly owner: string;
  readonly repoName: string;
}

/** `https://`, `http://` or `ssh://`, an optional user, the host, then the path after a slash. */
const SCHEME_URL = /^(?:https?|ssh):\/\/(?:[A-Za-z0-9._-]+@)?([^/:@]+)\/(.*)$/u;

/** scp-style: an optional user, the host, then the path after a colon. */
const SCP_URL = /^(?:[A-Za-z0-9._-]+@)?([^/:@]+):(?!\/\/)(.*)$/u;

/** The `owner/repo` a path names, without a trailing slash or `.git`. */
function repositoryPath(path: string): Omit<GitRemoteRepository, 'host'> | undefined {
  const parts = path
    .replace(/\/$/u, '')
    .replace(/\.git$/u, '')
    .split('/');
  const [owner = '', repoName = ''] = parts;
  return parts.length === 2 && owner !== '' && repoName !== '' ? { owner, repoName } : undefined;
}

/**
 * Read a remote URL as its host, owner and repository.
 *
 * @param url - the remote URL as `git remote get-url` prints it
 * @returns the parts, or undefined when the URL does not name exactly one
 * `owner/repo` path on a host
 */
export function parseGitRemoteUrl(url: string): GitRemoteRepository | undefined {
  const trimmed = url.trim();
  const match = SCHEME_URL.exec(trimmed) ?? SCP_URL.exec(trimmed);
  const host = match?.[1];
  const repository = match?.[2] === undefined ? undefined : repositoryPath(match[2]);
  return host === undefined || repository === undefined ? undefined : { host, ...repository };
}
