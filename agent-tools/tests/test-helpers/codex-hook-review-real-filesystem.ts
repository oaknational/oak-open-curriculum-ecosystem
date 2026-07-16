import {
  chmod,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  stat,
  symlink,
  utimes,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/** Explicit real-filesystem adapter for codex-hook-review integration tests. */
export class CodexHookReviewRealFileSystem {
  readonly #temporaryRoots: string[] = [];

  async temporaryRoot(prefix: string): Promise<string> {
    const root = await mkdtemp(join(tmpdir(), prefix));
    this.#temporaryRoots.push(root);
    return root;
  }

  async cleanup(): Promise<void> {
    await Promise.all(this.#temporaryRoots.splice(0).map((root) => rm(root, { recursive: true })));
  }

  async createDirectory(
    path: string,
    options: { readonly recursive?: boolean; readonly mode?: number } = {},
  ): Promise<void> {
    await mkdir(path, options);
  }

  async writeText(path: string, content: string, mode?: number): Promise<void> {
    await writeFile(path, content, mode === undefined ? undefined : { mode });
  }

  async createSymbolicLink(target: string, path: string): Promise<void> {
    await symlink(target, path);
  }

  async remove(path: string): Promise<void> {
    await rm(path, { recursive: true, force: true });
  }

  async readText(path: string): Promise<string> {
    return readFile(path, 'utf8');
  }

  async entries(path: string): Promise<readonly string[]> {
    return readdir(path);
  }

  async setTimes(path: string, seconds: number): Promise<void> {
    await utimes(path, seconds, seconds);
  }

  async setMode(path: string, mode: number): Promise<void> {
    await chmod(path, mode);
  }

  async mode(path: string): Promise<number> {
    return (await stat(path)).mode & 0o777;
  }

  async size(path: string): Promise<number> {
    return (await stat(path)).size;
  }
}
