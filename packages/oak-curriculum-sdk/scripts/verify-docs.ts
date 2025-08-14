/*
 * Verify generated documentation artifacts exist and are non-empty.
 * - HTML docs index
 * - TypeDoc JSON (parseable, has children)
 * - AI reference markdown
 * - Markdown API docs (index + selected kind files)
 */

import { promises as fs } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

async function fileSize(path: string): Promise<number> {
  const st = await fs.stat(path);
  if (!st.isFile()) throw new Error('Not a file: ' + path);
  return st.size;
}

async function mustExistNonEmpty(path: string): Promise<void> {
  try {
    const size = await fileSize(path);
    if (size <= 0) throw new Error('Empty file: ' + path);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Missing or empty: ${path} — ${msg}`);
  }
}

function hasChildren(obj: unknown): obj is { children?: unknown[] } {
  return typeof obj === 'object' && obj !== null && 'children' in obj;
}

function hasProp<K extends string>(o: unknown, key: K): o is Record<K, unknown> {
  return typeof o === 'object' && o !== null && key in o;
}

const KIND_TO_MD: Record<number, string> = {
  64: 'functions.md',
  128: 'classes.md',
  256: 'interfaces.md',
  2097152: 'types.md',
  8: 'enums.md',
  32: 'variables.md',
  4: 'namespaces.md',
  4194304: 'references.md',
};

async function computeExpectedMd(
  mdIndex: string,
  mdFiles: string[],
  tdJson: string,
  guard: (label: string, f: () => Promise<void>) => Promise<void>,
): Promise<Set<string>> {
  const mdExpected = new Set<string>(mdFiles);
  let kindSet: Set<number> = new Set<number>();
  await guard('Kind scan', async () => {
    kindSet = await readKindSet(tdJson);
  });
  for (const k of kindSet) {
    const fname = KIND_TO_MD[k];
    if (fname) mdExpected.add(join(dirname(mdIndex), fname));
  }
  return mdExpected;
}

async function verifyMdFiles(
  mdExpected: Set<string>,
  guard: (label: string, f: () => Promise<void>) => Promise<void>,
): Promise<void> {
  for (const f of mdExpected) {
    const fileName = basename(f);
    await guard(`MD file ${fileName}`, async () => mustExistNonEmpty(f));
  }
}

async function verifyTypedocJson(path: string): Promise<void> {
  let raw: string;
  try {
    raw = await fs.readFile(path, 'utf8');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Cannot read typedoc.json at ${path} — ${msg}`);
  }
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`typedoc.json is not valid JSON — ${msg}`);
  }
  if (!hasChildren(json) || !Array.isArray(json.children) || json.children.length === 0) {
    throw new Error('typedoc.json has no top-level children');
  }
}

async function readKindSet(path: string): Promise<Set<number>> {
  const raw = await fs.readFile(path, 'utf8');
  const json: unknown = JSON.parse(raw);
  if (!hasChildren(json) || !Array.isArray(json.children)) return new Set<number>();
  const kinds = new Set<number>();
  for (const c of json.children) {
    if (hasProp(c, 'kind') && typeof c.kind === 'number') kinds.add(c.kind);
  }
  return kinds;
}

function resolvePaths(): {
  htmlIndex: string;
  tdJson: string;
  aiRef: string;
  mdIndex: string;
  mdFiles: string[];
} {
  const thisDir = dirname(fileURLToPath(import.meta.url));
  const pkgRoot = resolve(thisDir, '..');
  const htmlIndex = join(pkgRoot, 'docs', 'api', 'index.html');
  const tdJson = join(pkgRoot, 'docs', 'api', 'typedoc.json');
  const aiRef = join(pkgRoot, 'docs', 'api', 'AI-REFERENCE.md');
  const mdIndex = join(pkgRoot, 'docs', 'api-md', 'index.md');
  const mdFiles = [
    join(pkgRoot, 'docs', 'api-md', 'functions.md'),
    join(pkgRoot, 'docs', 'api-md', 'types.md'),
    join(pkgRoot, 'docs', 'api-md', 'variables.md'),
  ];
  return { htmlIndex, tdJson, aiRef, mdIndex, mdFiles };
}

async function main(): Promise<void> {
  const { htmlIndex, tdJson, aiRef, mdIndex, mdFiles } = resolvePaths();
  const failures: string[] = [];
  async function guard(label: string, f: () => Promise<void>): Promise<void> {
    try {
      await f();
      console.log('OK  ', label);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      failures.push(label + ': ' + msg);
      console.error('FAIL', label, '-', msg);
    }
  }

  await guard('HTML index', async () => mustExistNonEmpty(htmlIndex));
  await guard('TypeDoc JSON', async () => verifyTypedocJson(tdJson));
  await guard('AI reference', async () => mustExistNonEmpty(aiRef));
  await guard('MD index', async () => mustExistNonEmpty(mdIndex));
  const mdExpected = await computeExpectedMd(mdIndex, mdFiles, tdJson, guard);
  await verifyMdFiles(mdExpected, guard);

  if (failures.length > 0) {
    const failureMessages = failures.map((s) => `- ${s}`).join('\n');
    const errorMessage = `Documentation verification failed:\n${failureMessages}`;
    throw new Error(errorMessage);
  }
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
});
