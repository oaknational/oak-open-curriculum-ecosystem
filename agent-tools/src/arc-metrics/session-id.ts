/**
 * A session's id, read from its transcript's path.
 *
 * @remarks
 * The vendor names each transcript `<session id>.jsonl`. The filesystem
 * adapter builds the path with `node:path`, whose separator is the host's, so
 * both `/` and `\` end a directory here: reading only `/` would report a
 * Windows path whole as the id.
 *
 * @packageDocumentation
 */

const TRANSCRIPT_EXTENSION = '.jsonl';

/**
 * Read a session's id from its transcript's path.
 *
 * @param path - A transcript's path, POSIX- or Windows-shaped.
 * @returns The file name without its `.jsonl` extension.
 */
export function sessionIdOf(path: string): string {
  const name = path.slice(Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\')) + 1);
  return name.endsWith(TRANSCRIPT_EXTENSION) ? name.slice(0, -TRANSCRIPT_EXTENSION.length) : name;
}
