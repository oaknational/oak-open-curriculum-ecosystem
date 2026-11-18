/**
 * The real {@link FileSystemPort}, backed by `node:fs/promises`.
 *
 * @remarks
 * Imported only at composition roots; every other module receives the port
 * as a parameter (`principles.md` §Testing; ADR-078).
 *
 * @packageDocumentation
 */

import type { Dirent } from 'node:fs';
import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';

import type { DirectoryEntry, DirectoryEntryKind, FileSystemPort } from './file-system-port.js';

/** Maps a `Dirent` onto the port's three entry kinds. */
function kindOf(entry: Dirent): DirectoryEntryKind {
  if (entry.isFile()) {
    return 'file';
  }
  if (entry.isDirectory()) {
    return 'directory';
  }
  return 'other';
}

/** Lists a directory through `node:fs/promises`, projecting each entry onto the port shape. */
async function readDirectoryEntries(path: string): Promise<readonly DirectoryEntry[]> {
  const entries = await readdir(path, { withFileTypes: true });
  return entries.map((entry) => ({ name: entry.name, kind: kindOf(entry) }));
}

/** The process's real file system as a {@link FileSystemPort}. */
export const nodeFileSystem: FileSystemPort = {
  readFile: (path) => readFile(path, 'utf8'),
  writeFile: (path, content) => writeFile(path, content, 'utf8'),
  mkdir: async (path) => {
    await mkdir(path, { recursive: true });
  },
  readdir: readDirectoryEntries,
  copyFile: (from, to) => copyFile(from, to),
};
