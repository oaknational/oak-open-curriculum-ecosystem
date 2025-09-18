/*
 * Verify generated documentation artifacts exist and are non-empty.
 * - HTML docs index
 * - TypeDoc JSON (parseable, has children)
 * - AI reference markdown
 * - Markdown API docs (index + files linked from the index)
 *
 * Rationale: Expected Markdown files are derived from the generated index
 * rather than raw TypeDoc kinds. This mirrors the generator behaviour, which
 * only emits pages for exported, curated reflections. Depending on public API
 * curation, some kinds may be absent — that should not fail verification.
 */

import { promises as fs } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

async function fileSize(path: string): Promise<number> {
  const st = await fs.stat(path);
  if (!st.isFile()) {
    throw new Error('Not a file: ' + path);
  }
  return st.size;
}

async function mustExistNonEmpty(path: string): Promise<void> {
  try {
    const size = await fileSize(path);
    if (size <= 0) {
      throw new Error('Empty file: ' + path);
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Missing or empty: ${path} — ${msg}`);
  }
}

function hasChildren(obj: unknown): obj is { children?: unknown[] } {
  return typeof obj === 'object' && obj !== null && 'children' in obj;
}

// no-op

async function computeExpectedMdFromIndex(
  mdIndex: string,
  guard: (label: string, f: () => Promise<void>) => Promise<void>,
): Promise<Set<string>> {
  const expected = new Set<string>();
  await guard('Index links', async () => {
    const content = await fs.readFile(mdIndex, 'utf8');
    const linkRe = /\[[^\]]+\]\(\.\/([^)]+)\)/g; // matches (./filename)
    let match: RegExpExecArray | null;
    while ((match = linkRe.exec(content)) !== null) {
      const rel = match[1];
      expected.add(join(dirname(mdIndex), rel));
    }
  });
  return expected;
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

// removed: kind scanning not needed; we derive expected pages from index links

function resolvePaths(): {
  htmlIndex: string;
  tdJson: string;
  aiRef: string;
  mdIndex: string;
} {
  const thisDir = dirname(fileURLToPath(import.meta.url));
  const pkgRoot = resolve(thisDir, '..');
  const htmlIndex = join(pkgRoot, 'docs', 'api', 'index.html');
  const tdJson = join(pkgRoot, 'docs', 'api', 'typedoc.json');
  const aiRef = join(pkgRoot, 'docs', 'api', 'AI-REFERENCE.md');
  const mdIndex = join(pkgRoot, 'docs', 'api-md', 'index.md');
  return { htmlIndex, tdJson, aiRef, mdIndex };
}

async function main(): Promise<void> {
  const { htmlIndex, tdJson, aiRef, mdIndex } = resolvePaths();
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
  const mdExpected = await computeExpectedMdFromIndex(mdIndex, guard);
  if (mdExpected.size > 0) {
    await verifyMdFiles(mdExpected, guard);
  }

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
