import { mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

export async function createContextCostFixture(tmpDirs: string[]): Promise<string> {
  const dir = await mkdtemp(path.join(tmpdir(), 'context-cost-'));
  tmpDirs.push(dir);
  await writeFile(path.join(dir, 'a.md'), '1234');
  await writeFile(path.join(dir, 'b.md'), '12345678');
  await writeFile(path.join(dir, 'c.md'), '123456789012');
  return dir;
}

export async function createContextCostSymlink(tmpDirs: string[], cwd: string): Promise<void> {
  // Markdown reachable ONLY through a symlink: the target directory lives
  // outside the globbed fixture, so any 'linked.md' row in the output proves
  // the glob followed the link. The link is a directory symlink ('junction' —
  // ignored on POSIX; unprivileged on Windows, where a file symlink needs
  // administrator rights; lstat still sees a symlink) so the fixture builds
  // on every platform.
  const target = await mkdtemp(path.join(tmpdir(), 'context-cost-linked-'));
  tmpDirs.push(target);
  await writeFile(path.join(target, 'd.md'), '1234');
  await symlink(target, path.join(cwd, 'linked.md'), 'junction');
}

export async function removeContextCostFixtures(tmpDirs: string[]): Promise<void> {
  await Promise.all(tmpDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
}
