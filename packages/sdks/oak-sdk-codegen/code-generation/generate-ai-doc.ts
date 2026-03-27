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
import { normalizeError } from '@oaknational/logger';

import { parseTDProject, collectExports } from './lib/ai-doc-types';
import type { TDProject, TDReflection } from './lib/ai-doc-types';
import { renderEndpointCatalog, renderToolCatalog } from './generate-ai-doc-catalog.js';
import { ensureDir, groupByKind, renderReflection, nowIso } from './lib/ai-doc-render';
import { ZodError } from 'zod';
import { createCodegenLogger } from './create-codegen-logger.js';

const logger = createCodegenLogger('ai-doc');

/** Type for Zod validation issues (derived from ZodError to avoid deprecated ZodIssue import) */
type ZodIssueType = ZodError['issues'][number];

function formatZodIssues(issues: ZodIssueType[]): string {
  return issues.map((i) => `- ${i.path.join('.') || '<root>'}: ${i.message}`).join('\n');
}

function makeQuickstartSection(): string {
  return (
    '## Quickstart\n\n' +
    '### Create clients\n\n' +
    '```ts\n' +
    "import { createOakClient, createOakPathBasedClient } from '@oaknational/curriculum-sdk';\n\n" +
    "const apiKey = 'REDACTED';\n" +
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
    "import { toolGeneration, schema } from '@oaknational/curriculum-sdk';\n\n" +
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
        '. Run: pnpm -F @oaknational/curriculum-sdk docs:api:json:ai',
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
      throw new Error('TypeDoc JSON validation failed:\n' + details, { cause: err });
    }
    throw err instanceof Error ? err : new Error(String(err));
  }
}

function renderSections(grouped: Map<string, TDReflection[]>): string[] {
  const sections: string[] = [];
  const plural = (k: string): string => {
    const map: Record<string, string> = {
      Class: 'Classes',
      'Type alias': 'Type Aliases',
      Variable: 'Variables',
      Function: 'Functions',
      Interface: 'Interfaces',
      Enum: 'Enums',
      Namespace: 'Namespaces',
      Reference: 'References',
    };
    return map[k] ?? (k.endsWith('s') ? k : `${k}s`);
  };
  for (const [kind, items] of grouped) {
    if (items.length === 0) {
      continue;
    }
    sections.push(`## ${plural(kind)}`);
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

function buildConventionsSection(): string {
  return [
    '## Conventions',
    '- Authorization: pass API key to `createOakClient(apiKey)`; the SDK never reads env vars.',
    '- Base URL: defaults to the production API; override via `OAK_API_URL` if needed.',
    '- Responses: every call returns `{ data, error, response }` from openapi-fetch.',
    '- Rate limits: see `/rate-limit` endpoint; headers expose remaining/limit.',
  ].join('\n');
}

async function main(): Promise<void> {
  const { docsDir, typedocJsonPath, outPath } = resolvePaths();

  const [pathParamsModule, mcpToolsModule] = await Promise.all([
    import('../src/types/generated/api-schema/path-parameters.js'),
    import('../src/types/generated/api-schema/mcp-tools/index.js'),
  ]);

  const project = await readTypedocProject(typedocJsonPath);
  // Filter out internal helper functions that aren’t useful for AI agents
  const exported = collectExports(project).filter((r) => {
    const name = r.name;
    const ignoreNames = new Set([
      'typeSafeKeys',
      'typeSafeValues',
      'typeSafeEntries',
      'typeSafeFromEntries',
      'typeSafeGet',
      'typeSafeSet',
      'typeSafeHas',
      'typeSafeHasOwn',
      'typeSafeOwnKeys',
    ]);
    if (ignoreNames.has(name)) {
      return false;
    }
    const src = r.sources?.[0]?.fileName ?? '';
    if (src.includes('types/helpers.ts')) {
      return false;
    }
    return true;
  });
  const grouped = groupByKind(exported);
  const quickstart = makeQuickstartSection();
  const conventions = buildConventionsSection();
  const endpointCatalog = renderEndpointCatalog(pathParamsModule.PATH_OPERATIONS);
  const toolCatalog = renderToolCatalog(
    mcpToolsModule.toolNames,
    mcpToolsModule.getToolFromToolName,
  );
  const content = [
    buildHeader(),
    quickstart,
    conventions,
    endpointCatalog,
    toolCatalog,
    ...renderSections(grouped),
  ].join('\n\n');
  await ensureDir(docsDir);
  await fs.writeFile(outPath, content, 'utf8');
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  logger.error(message, normalizeError(err));
  process.exitCode = 1;
});
