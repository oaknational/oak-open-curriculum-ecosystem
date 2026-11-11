/**
 * The synchronous file-system reads agent-tools' CLIs are made of, as one
 * port whose default is the process's real file system. A module that probes
 * paths takes the subset it needs (`Pick<SyncFileSystem, …>`) with this
 * default, so it is proved from an in-memory tree
 * (`test-helpers/in-memory-sync-file-system.ts`) rather than a disk, and the
 * bins keep wiring nothing.
 */
import { existsSync, lstatSync, readdirSync, readFileSync, realpathSync, statSync } from 'node:fs';

export interface SyncFileSystem {
  /** Whether a path exists, following symbolic links as `existsSync` does. */
  readonly exists: (path: string) => boolean;
  /** Whether a path is a directory; false for anything absent or unreadable. */
  readonly isDirectory: (path: string) => boolean;
  /** Whether the path itself is a symbolic link, dangling or not; never follows it. */
  readonly isSymbolicLink: (path: string) => boolean;
  /** A file's UTF-8 text; throws as `node:fs` does when it cannot be read. */
  readonly readText: (path: string) => string;
  /** A directory's entry names; throws as `node:fs` does when it cannot be listed. */
  readonly list: (path: string) => readonly string[];
  /** The canonical, symlink-resolved path; throws when the path does not exist. */
  readonly realpath: (path: string) => string;
}

/** The process's real file system. */
export const nodeSyncFileSystem: SyncFileSystem = {
  exists: (path) => existsSync(path),
  isDirectory: (path) => {
    try {
      return statSync(path).isDirectory();
    } catch {
      return false;
    }
  },
  isSymbolicLink: (path) => lstatSync(path, { throwIfNoEntry: false })?.isSymbolicLink() === true,
  readText: (path) => readFileSync(path, 'utf8'),
  list: (path) => readdirSync(path),
  realpath: (path) => realpathSync(path),
};
