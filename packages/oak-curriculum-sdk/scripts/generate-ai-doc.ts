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
// no helper imports required here; this script uses built-in reflection safely
import { ZodError, type ZodIssue } from 'zod';

function formatZodIssues(issues: ZodIssue[]): string {
  return issues.map((i) => `- ${i.path.join('.') || '<root>'}: ${i.message}`).join('\n');
}

// Safe access helpers
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}
function getBool(o: unknown, k: string): boolean {
  if (!isRecord(o)) return false;
  const d = Object.getOwnPropertyDescriptor(o, k);
  if (d && typeof d.value === 'boolean') return d.value;
  return false;
}
function getEnumLen(o: unknown, k: string): number | undefined {
  if (!isRecord(o)) return undefined;
  const d = Object.getOwnPropertyDescriptor(o, k);
  if (d && Array.isArray(d.value)) return d.value.length;
  return undefined;
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

interface ParamSchemaMeta {
  type?: string;
  enum?: readonly unknown[];
}
interface ParamMeta {
  in?: string;
  name?: string;
  required?: boolean;
  schema?: ParamSchemaMeta;
}
/* eslint-disable-next-line complexity */
function isParam(x: unknown): x is ParamMeta {
  if (!isRecord(x)) return false;
  const nameDesc = Object.getOwnPropertyDescriptor(x, 'name');
  const inDesc = Object.getOwnPropertyDescriptor(x, 'in');
  const reqDesc = Object.getOwnPropertyDescriptor(x, 'required');
  const schemaDesc = Object.getOwnPropertyDescriptor(x, 'schema');
  const nameOk = !nameDesc || typeof nameDesc.value === 'string';
  const inOk = !inDesc || typeof inDesc.value === 'string';
  const reqOk = !reqDesc || typeof reqDesc.value === 'boolean';
  let schemaOk = true;
  if (schemaDesc && isRecord(schemaDesc.value)) {
    const tDesc = Object.getOwnPropertyDescriptor(schemaDesc.value, 'type');
    const eDesc = Object.getOwnPropertyDescriptor(schemaDesc.value, 'enum');
    schemaOk =
      (!tDesc || typeof tDesc.value === 'string') && (!eDesc || Array.isArray(eDesc.value));
  }
  return nameOk && inOk && reqOk && schemaOk;
}
/* eslint-disable-next-line complexity */
function renderParamSummary(params: unknown): string {
  if (!Array.isArray(params) || params.length === 0) return '_No parameters_';
  const items: string[] = [];
  for (const p of params) {
    if (!isParam(p)) continue;
    const loc = typeof p.in === 'string' ? p.in : 'query';
    const name = typeof p.name === 'string' ? p.name : '?';
    const req = Boolean(p.required);
    let typeName = 'string';
    let enumText = '';
    if (p.schema && isRecord(p.schema)) {
      if (typeof p.schema.type === 'string') typeName = p.schema.type;
      if (Array.isArray(p.schema.enum)) enumText = ` enum:${String(p.schema.enum.length)}`;
    }
    items.push(`- ${loc} ${name} (${typeName}${enumText})${req ? ' — required' : ''}`);
  }
  return items.join('\n');
}

/* eslint-disable-next-line complexity */
function renderEndpointCatalog(ops: unknown): string {
  const lines: string[] = [];
  lines.push('## Endpoint Catalog');
  const list: unknown[] = Array.isArray(ops) ? ops : [];
  const sorted = list
    .map((o) => (isRecord(o) ? o : undefined))
    .filter((o): o is Record<string, unknown> => Boolean(o))
    .sort((a, b) => {
      const aPath = typeof a.path === 'string' ? a.path : '';
      const aMethod = typeof a.method === 'string' ? a.method : '';
      const bPath = typeof b.path === 'string' ? b.path : '';
      const bMethod = typeof b.method === 'string' ? b.method : '';
      return (aPath + aMethod).localeCompare(bPath + bMethod);
    });
  for (const op of sorted) {
    const method = typeof op.method === 'string' ? op.method : '';
    const path = typeof op.path === 'string' ? op.path : '';
    lines.push(`### ${method.toUpperCase()} ${path}`);
    const opIdDesc = Object.getOwnPropertyDescriptor(op, 'operationId');
    if (typeof opIdDesc?.value === 'string') lines.push(`- operationId: ${opIdDesc.value}`);
    const sumDesc = Object.getOwnPropertyDescriptor(op, 'summary');
    if (typeof sumDesc?.value === 'string') lines.push(`- summary: ${sumDesc.value}`);
    const descDesc = Object.getOwnPropertyDescriptor(op, 'description');
    if (typeof descDesc?.value === 'string') lines.push(`- description: ${descDesc.value}`);
    lines.push('Parameters:');
    const paramsDesc = Object.getOwnPropertyDescriptor(op, 'parameters');
    lines.push(renderParamSummary(paramsDesc?.value));
    lines.push('');
  }
  return lines.join('\n');
}

/* eslint-disable-next-line complexity, max-statements */
function renderToolCatalog(): string {
  const lines: string[] = [];
  lines.push('## MCP Tool Catalog');
  const names: string[] = [];
  for (const k in MCP_TOOLS) {
    if (Object.prototype.hasOwnProperty.call(MCP_TOOLS, k)) names.push(k);
  }
  names.sort((a, b) => a.localeCompare(b));
  for (const name of names) {
    const toolDesc = Object.getOwnPropertyDescriptor(MCP_TOOLS, name);
    const base = toolDesc && isRecord(toolDesc.value) ? toolDesc.value : undefined;
    const opIdDesc = base ? Object.getOwnPropertyDescriptor(base, 'operationId') : undefined;
    const pathDesc = base ? Object.getOwnPropertyDescriptor(base, 'path') : undefined;
    const methodDesc = base ? Object.getOwnPropertyDescriptor(base, 'method') : undefined;
    const opId = typeof opIdDesc?.value === 'string' ? opIdDesc.value : '';
    const path = typeof pathDesc?.value === 'string' ? pathDesc.value : '';
    const method = typeof methodDesc?.value === 'string' ? methodDesc.value : '';
    lines.push(`### ${name}`);
    lines.push(`- path: ${path}`);
    lines.push(`- method: ${method}`);
    if (opId) lines.push(`- operationId: ${opId}`);
    /* eslint-disable-next-line complexity */
    function renderParamObject(obj: unknown): string {
      if (!isRecord(obj)) return '_None_';
      const desc = Object.getOwnPropertyDescriptors(obj);
      const out: string[] = [];
      for (const k in desc) {
        if (!Object.prototype.hasOwnProperty.call(desc, k)) continue;
        const metaDesc = Object.getOwnPropertyDescriptor(obj, k);
        const required = getBool(metaDesc?.value, 'required');
        const enumCount = getEnumLen(metaDesc?.value, 'allowedValues');
        const allowed = typeof enumCount === 'number' ? ` enum:${String(enumCount)}` : '';
        out.push(`${k} (${required ? 'required' : 'optional'}${allowed})`);
      }
      return out.length === 0 ? '_None_' : out.join(', ');
    }
    lines.push(
      `- path params: ${renderParamObject(
        base ? Object.getOwnPropertyDescriptor(base, 'pathParams')?.value : undefined,
      )}`,
    );
    lines.push(
      `- query params: ${renderParamObject(
        base ? Object.getOwnPropertyDescriptor(base, 'queryParams')?.value : undefined,
      )}`,
    );
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
