/**
 * A host path read the POSIX way: `/` separators and no drive letter. On
 * Windows, `node:path` places a rooted path on the current drive with `\`
 * separators, so a fake keyed by POSIX literals reads its argument through
 * this to answer the same on every host.
 *
 * @param hostPath - A path as the code under test built it on this host.
 * @returns The path with `/` separators and no leading drive.
 */
export function posixPath(hostPath: string): string {
  return hostPath.replaceAll('\\', '/').replace(/^[A-Za-z]:(?=\/)/u, '');
}
