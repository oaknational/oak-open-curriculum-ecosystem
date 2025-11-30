/*
 * Markdown API Docs Generator (plugin-free)
 *
 * Generates multi-file Markdown docs from TypeDoc JSON.
 * Input: docs/api/typedoc.json (produced via typedoc.ai.json)
 * Output dir: docs/api-md/
 */

import { promises as fs } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ZodError } from 'zod';

/** Type for Zod validation issues (derived from ZodError to avoid deprecated ZodIssue import) */
type ZodIssueType = ZodError['issues'][number];

import { parseTDProject, collectExports } from './lib/ai-doc-types';
import type { TDProject, TDReflection } from './lib/ai-doc-types';
import { ensureDir, groupByKind, renderReflection, nowIso } from './lib/ai-doc-render';

function formatZodIssues(issues: ZodIssueType[]): string {
  return issues.map((i) => `- ${i.path.join('.') || '<root>'}: ${i.message}`).join('\n');
}

function resolvePaths(): { jsonPath: string; outDir: string } {
  const thisDir = dirname(fileURLToPath(import.meta.url));
  const pkgRoot = resolve(thisDir, '..');
  const jsonPath = join(pkgRoot, 'docs', 'api', 'typedoc.json');
  const outDir = join(pkgRoot, 'docs', 'api-md');
  return { jsonPath, outDir };
}

async function readProject(jsonPath: string): Promise<TDProject> {
  let raw: string;
  try {
    raw = await fs.readFile(jsonPath, 'utf8');
  } catch {
    throw new Error(
      'TypeDoc JSON not found at ' +
        jsonPath +
        '. Run: pnpm -F @oaknational/oak-curriculum-sdk docs:api:json:ai',
    );
  }
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new Error('Failed to parse TypeDoc JSON');
  }
  try {
    return parseTDProject(json);
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      throw new Error('TypeDoc JSON validation failed:\n' + formatZodIssues(err.issues));
    }
    throw err instanceof Error ? err : new Error(String(err));
  }
}

function fileMap(): { kind: string; filename: string; title: string }[] {
  return [
    { kind: 'Function', filename: 'functions.md', title: 'Functions' },
    { kind: 'Class', filename: 'classes.md', title: 'Classes' },
    { kind: 'Interface', filename: 'interfaces.md', title: 'Interfaces' },
    { kind: 'Type alias', filename: 'types.md', title: 'Type Aliases' },
    { kind: 'Enum', filename: 'enums.md', title: 'Enums' },
    { kind: 'Variable', filename: 'variables.md', title: 'Variables' },
    { kind: 'Namespace', filename: 'namespaces.md', title: 'Namespaces' },
    { kind: 'Reference', filename: 'references.md', title: 'References' },
  ];
}

function quickstart(): string {
  return (
    '## Quickstart\n\n' +
    '```ts\n' +
    "import { createOakClient } from '@oaknational/oak-curriculum-sdk';\n" +
    "const client = createOakClient('YOUR_API_KEY');\n" +
    "const res = await client.GET('/lessons/{lesson}/transcript', { params: { path: { lesson: 'lesson-slug' } } });\n" +
    'if (res.error) throw res.error;\n' +
    'console.log(res.data);\n' +
    '```'
  );
}

async function writeIndex(
  outDir: string,
  kinds: { filename: string; title: string }[],
): Promise<void> {
  const lines: string[] = [];
  lines.push('# Oak Curriculum SDK — API (Markdown)');
  lines.push('');
  lines.push(`Generated: ${nowIso()}`);
  lines.push('');
  lines.push('## Contents');
  for (const k of kinds) {
    lines.push(`- [${k.title}](./${k.filename})`);
  }
  lines.push('');
  lines.push(quickstart());
  await fs.writeFile(join(outDir, 'index.md'), lines.join('\n'), 'utf8');
}

async function writeKindFile(
  outDir: string,
  title: string,
  filename: string,
  items: TDReflection[],
): Promise<void> {
  const lines: string[] = [];
  lines.push(`# ${title}`);
  lines.push('');
  for (const r of items) {
    lines.push(renderReflection(r));
    lines.push('');
  }
  await fs.writeFile(join(outDir, filename), lines.join('\n'), 'utf8');
}

async function main(): Promise<void> {
  const { jsonPath, outDir } = resolvePaths();
  const project = await readProject(jsonPath);
  const exported = collectExports(project);
  const grouped = groupByKind(exported);

  await ensureDir(outDir);
  const fm = fileMap();
  const presentKinds: { filename: string; title: string }[] = [];
  for (const { kind, filename, title } of fm) {
    const items = grouped.get(kind) ?? [];
    if (items.length > 0) {
      await writeKindFile(outDir, title, filename, items);
      presentKinds.push({ filename, title });
    }
  }
  await writeIndex(outDir, presentKinds);
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
});
