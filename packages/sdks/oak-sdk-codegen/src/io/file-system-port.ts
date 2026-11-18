/**
 * The file-system port for every module in this workspace that reads or
 * writes files.
 *
 * @remarks
 * Product code takes a `FileSystemPort` as a parameter and never imports
 * `node:fs` itself, so an in-process test can run the same code against the
 * in-memory fake in `./test-helpers/in-memory-file-system.ts` with no IO
 * (`principles.md` §Testing; ADR-078). The one real implementation is
 * `nodeFileSystem` in `./node-file-system.ts`, wired at each
 * composition root (`codegen.ts`, `copy-json-assets.ts`, `vocab-gen.ts`).
 *
 * The port carries only the operations its consumers use; a new operation is
 * added when a second consumer needs it, not before.
 *
 * @packageDocumentation
 */

/** What a directory listing says about one of its entries. */
export type DirectoryEntryKind = 'file' | 'directory' | 'other';

/** One entry of a directory listing. */
export interface DirectoryEntry {
  /** The entry's base name within its directory. */
  readonly name: string;
  /** Whether the entry is a regular file, a directory, or anything else. */
  readonly kind: DirectoryEntryKind;
}

/** Asynchronous file-system operations over UTF-8 text files. */
export interface FileSystemPort {
  /** Reads a whole file as UTF-8 text; rejects when the file is absent. */
  readFile(path: string): Promise<string>;
  /** Writes UTF-8 text, replacing any existing file; the parent directory must exist. */
  writeFile(path: string, content: string): Promise<void>;
  /** Creates a directory and every missing ancestor; an existing directory is not an error. */
  mkdir(path: string): Promise<void>;
  /** Lists a directory's direct entries, in no guaranteed order. */
  readdir(path: string): Promise<readonly DirectoryEntry[]>;
  /** Copies one file's bytes to a new path, replacing any existing file there. */
  copyFile(from: string, to: string): Promise<void>;
}
