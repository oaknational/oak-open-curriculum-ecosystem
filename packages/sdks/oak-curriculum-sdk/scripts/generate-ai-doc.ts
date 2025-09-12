/* eslint-disable max-lines -- disabling because this is a long, doc generating script, not prod code  */

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
// Import generated artifacts directly for endpoint/tool catalogs
import { PATH_OPERATIONS } from '../src/types/generated/api-schema/path-parameters.js';
import { MCP_TOOLS } from '../src/types/generated/api-schema/mcp-tools/index.js';
// typed helpers for safe object inspection
import {
  typeSafeKeys,
  typeSafeEntries,
  getOwnString,
  getOwnBoolean,
  getOwnArrayLength,
  isPlainObject,
  getOwnValue,
} from '../src/types/helpers';
import { ZodError, type ZodIssue } from 'zod';

function formatZodIssues(issues: ZodIssue[]): string {
  return issues.map((i) => `- ${i.path.join('.') || '<root>'}: ${i.message}`).join('\n');
}

// Pure helpers
function isArrayOfObjects(value: unknown): value is object[] {
  return Array.isArray(value) && value.every((v) => isPlainObject(v));
}

function makeQuickstartSection(): string {
  return (
    '## Quickstart\n\n' +
    '### Create clients\n\n' +
    '```ts\n' +
    "import { createOakClient, createOakPathBasedClient } from '@oaknational/oak-curriculum-sdk';\n\n" +
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
    if (items.length === 0) continue;
    sections.push(`## ${plural(kind)}`);
    for (const r of items) sections.push(renderReflection(r));
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

// Tool map helpers derived at use sites via typeSafeEntries

interface RenderableParamInfo {
  loc: string;
  name: string;
  typeName: string;
  required: boolean;
  enumCount?: number;
}

function extractParamInfo(p: unknown): RenderableParamInfo {
  const loc = getOwnString(p, 'in') ?? 'query';
  const name = getOwnString(p, 'name') ?? '?';
  const required = getOwnBoolean(p, 'required') === true;
  const schema = getOwnValue(p, 'schema');
  const typeName = schema ? (getOwnString(schema, 'type') ?? 'string') : 'string';
  const enumCount = schema ? getOwnArrayLength(schema, 'enum') : undefined;
  return { loc, name, typeName, required, enumCount };
}

function renderParamLine(info: RenderableParamInfo): string {
  const enumText = typeof info.enumCount === 'number' ? ` enum:${String(info.enumCount)}` : '';
  return `- ${info.loc} ${info.name} (${info.typeName}${enumText})${info.required ? ' — required' : ''}`;
}

function renderParamSummary(params: unknown): string {
  if (!isArrayOfObjects(params) || params.length === 0) return '_No parameters_';
  const items = params.map(extractParamInfo).map(renderParamLine);
  return items.join('\n');
}

function sortPathOps(ops: unknown[]): unknown[] {
  return [...ops].sort((a, b) => {
    const aPath = getOwnString(a, 'path') ?? '';
    const aMethod = getOwnString(a, 'method') ?? '';
    const bPath = getOwnString(b, 'path') ?? '';
    const bMethod = getOwnString(b, 'method') ?? '';
    return (aPath + aMethod).localeCompare(bPath + bMethod);
  });
}

function renderEndpointCatalog(ops: unknown): string {
  const lines: string[] = [];
  lines.push('## Endpoint Catalog');
  const list: unknown[] = Array.isArray(ops) ? ops : [];
  const sorted = sortPathOps(list);
  for (const op of sorted) {
    const method = getOwnString(op, 'method') ?? '';
    const path = getOwnString(op, 'path') ?? '';
    lines.push(`### ${method.toUpperCase()} ${path}`);
    const opId = getOwnString(op, 'operationId');
    const summary = getOwnString(op, 'summary');
    const description = getOwnString(op, 'description');
    if (opId) lines.push(`- operationId: ${opId}`);
    if (summary) lines.push(`- summary: ${summary}`);
    if (description) lines.push(`- description: ${description}`);
    lines.push('Parameters:');
    const params = getOwnValue(op, 'parameters');
    lines.push(renderParamSummary(params));
    lines.push('');
  }
  return lines.join('\n');
}

function listParamObjectKeys(obj: unknown): string {
  if (!isPlainObject(obj)) return '_None_';
  const keys = typeSafeKeys(obj);
  return keys.length === 0 ? '_None_' : keys.join(', ');
}

function renderToolCatalog(): string {
  const lines: string[] = [];
  lines.push('## MCP Tool Catalog');
  const entries = typeSafeEntries(MCP_TOOLS);
  entries.sort(([a], [b]) => a.localeCompare(b));
  for (const [name, base] of entries) {
    const opId = getOwnString(base, 'operationId') ?? '';
    const path = getOwnString(base, 'path') ?? '';
    const method = getOwnString(base, 'method') ?? '';
    lines.push(`### ${name}`);
    lines.push(`- path: ${path}`);
    lines.push(`- method: ${method}`);
    if (opId) lines.push(`- operationId: ${opId}`);
    const pathParams = getOwnValue(base, 'pathParams');
    const queryParams = getOwnValue(base, 'queryParams');
    lines.push(`- path params: ${listParamObjectKeys(pathParams)}`);
    lines.push(`- query params: ${listParamObjectKeys(queryParams)}`);
    lines.push('');
  }
  return lines.join('\n');
}

async function main(): Promise<void> {
  const { docsDir, typedocJsonPath, outPath } = resolvePaths();
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
    if (ignoreNames.has(name)) return false;
    const src = r.sources?.[0]?.fileName ?? '';
    if (src.includes('types/helpers.ts')) return false;
    return true;
  });
  const grouped = groupByKind(exported);
  const quickstart = makeQuickstartSection();
  const conventions = buildConventionsSection();
  const endpointCatalog = renderEndpointCatalog(PATH_OPERATIONS);
  const toolCatalog = renderToolCatalog();
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
  console.error(err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
});
