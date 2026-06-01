import { randomUUID } from 'node:crypto';
import { link, open, rename, rm } from 'node:fs/promises';
import { dirname } from 'node:path';

export interface AtomicFileSystem {
  readonly writeSyncedFile: (filePath: string, text: string) => Promise<void>;
  readonly link: (existingPath: string, newPath: string) => Promise<void>;
  readonly rename: (oldPath: string, newPath: string) => Promise<void>;
  readonly remove: (path: string) => Promise<void>;
  readonly syncDirectory: (directory: string) => Promise<void>;
}

const nodeFileSystem: AtomicFileSystem = {
  writeSyncedFile,
  link,
  rename,
  remove: (path) => rm(path, { force: true }),
  syncDirectory,
};

type AtomicTextWriter = (
  filePath: string,
  text: string,
  options?: { readonly exclusiveCreate?: boolean },
) => Promise<void>;

export const writeTextAtomically: AtomicTextWriter = atomicTextWriter(nodeFileSystem);

export function atomicTextWriter(fileSystem: AtomicFileSystem): AtomicTextWriter {
  return async (
    filePath: string,
    text: string,
    options: { readonly exclusiveCreate?: boolean } = {},
  ): Promise<void> => {
    const tmpPath = `${filePath}.tmp-${randomUUID()}`;
    try {
      await fileSystem.writeSyncedFile(tmpPath, text);
      if (options.exclusiveCreate === true) {
        await fileSystem.link(tmpPath, filePath);
        await fileSystem.remove(tmpPath).catch(() => undefined);
      } else {
        await fileSystem.rename(tmpPath, filePath);
      }
      await fileSystem.syncDirectory(dirname(filePath));
    } catch (error) {
      await fileSystem.remove(tmpPath).catch(() => undefined);
      throw error;
    }
  };
}

async function writeSyncedFile(filePath: string, text: string): Promise<void> {
  const file = await open(filePath, 'wx');
  try {
    await file.writeFile(text);
    await file.sync();
  } finally {
    await file.close();
  }
}

async function syncDirectory(directory: string): Promise<void> {
  const dir = await open(directory, 'r');
  try {
    await dir.sync();
  } finally {
    await dir.close();
  }
}
