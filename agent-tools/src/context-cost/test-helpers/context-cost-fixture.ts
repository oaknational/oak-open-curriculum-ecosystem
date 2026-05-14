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

export async function createContextCostSymlink(cwd: string): Promise<void> {
  await symlink(path.join(cwd, 'a.md'), path.join(cwd, 'linked.md'));
}

export async function removeContextCostFixtures(tmpDirs: string[]): Promise<void> {
  await Promise.all(tmpDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
}
