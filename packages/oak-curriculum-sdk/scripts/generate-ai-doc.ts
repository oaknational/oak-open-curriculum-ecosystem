/*
 * AI Doc Generator for Oak Curriculum SDK
 *
 * Generates a single-file markdown reference from TypeDoc JSON output.
 * Input: docs/api/typedoc.json
 * Output: docs/api/AI-REFERENCE.md
 */

import { promises as fs } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseTDProject, collectExports } from './lib/ai-doc-types';
import type { TDProject, TDReflection } from './lib/ai-doc-types';
import { ensureDir, groupByKind, renderReflection, nowIso } from './lib/ai-doc-render';
import { ZodError, type ZodIssue } from 'zod';

function formatZodIssues(issues: ZodIssue[]): string {
  return issues.map((i) => `- ${i.path.join('.') || '<root>'}: ${i.message}`).join('\n');
}

function makeQuickstartSection(): string {
  return (
    '## Quickstart\n\n' +
    '### Create clients\n\n' +
    '```ts\n' +
    "import { createOakClient, createOakPathBasedClient } from '@oaknational/oak-curriculum-sdk';\n\n" +
    "const apiKey = 'YOUR_API_KEY';\n" +
    'const client = createOakClient(apiKey);\n' +
    'const pathClient = createOakPathBasedClient(apiKey);\n' +
    '```\n\n' +
    '### Call an endpoint (method-based)\n\n' +
    '```ts\n' +
    "const res = await client.GET('/lessons/{lesson}/transcript', {\n" +
    "  params: { path: { lesson: 'lesson-slug' } },\n" +
    '});\n' +
    'if (res.error) throw res.error;\n' +
    'console.log(res.data);\n' +
    '```\n\n' +
    '### Call an endpoint (path-based)\n\n' +
    '```ts\n' +
    "const res2 = await pathClient['/lessons/{lesson}/transcript'].GET({\n" +
    "  params: { path: { lesson: 'lesson-slug' } },\n" +
    '});\n' +
    'console.log(res2.data);\n' +
    '```\n\n' +
    '### Programmatic tool generation\n\n' +
    '```ts\n' +
    "import { toolGeneration, schema } from '@oaknational/oak-curriculum-sdk';\n\n" +
    'for (const op of toolGeneration.PATH_OPERATIONS) {\n' +
    '  const { pathParams, toMcpToolName } = toolGeneration.parsePathTemplate(op.path, op.method);\n' +
    '  console.log(op.operationId, toMcpToolName(), pathParams);\n' +
    '}\n' +
    '```\n'
  );
}

function resolvePaths(): { docsDir: string; typedocJsonPath: string; outPath: string } {
  const thisDir = dirname(fileURLToPath(import.meta.url));
  const pkgRoot = resolve(thisDir, '..');
  const docsDir = join(pkgRoot, 'docs', 'api');
  return {
    docsDir,
    typedocJsonPath: join(docsDir, 'typedoc.json'),
    outPath: join(docsDir, 'AI-REFERENCE.md'),
  };
}

async function readTypedocProject(typedocJsonPath: string): Promise<TDProject> {
  let raw: string;
  try {
    raw = await fs.readFile(typedocJsonPath, 'utf8');
  } catch {
    throw new Error(
      'TypeDoc JSON not found at ' +
        typedocJsonPath +
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
      const details = formatZodIssues(err.issues);
      throw new Error('TypeDoc JSON validation failed:\n' + details);
    }
    throw err instanceof Error ? err : new Error(String(err));
  }
}

function renderSections(grouped: Map<string, TDReflection[]>): string[] {
  const sections: string[] = [];
  for (const [kind, items] of grouped) {
    if (items.length === 0) {
      continue;
    }
    sections.push(`## ${kind}s`);
    for (const r of items) {
      sections.push(renderReflection(r));
    }
  }
  return sections;
}

function buildHeader(): string {
  return (
    '# Oak Curriculum SDK — AI Reference\n\n' +
    `Generated: ${nowIso()}\n\n` +
    'This single-file document is intended for AI agents. It contains the public API surface of the SDK,' +
    ' usage examples, and programmatic exports. For detailed human-oriented docs, see files under `docs/api/`.'
  );
}

async function main(): Promise<void> {
  const { docsDir, typedocJsonPath, outPath } = resolvePaths();
  const project = await readTypedocProject(typedocJsonPath);
  const exported = collectExports(project);
  const grouped = groupByKind(exported);
  const quickstart = makeQuickstartSection();
  const content = [buildHeader(), quickstart, ...renderSections(grouped)].join('\n\n');
  await ensureDir(docsDir);
  await fs.writeFile(outPath, content, 'utf8');
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
});
