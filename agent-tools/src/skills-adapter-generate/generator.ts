/**
 * Skills adapter generator.
 *
 * Reads canonical skills from `.agent/skills/<id>/SKILL-CANONICAL.md` (or
 * legacy `SKILL.md` during migration) and emits two adapter surfaces per
 * skill:
 *
 *   - `.claude/skills/<prefix><id>/SKILL.md`  — Claude Code adapter
 *   - `.agents/skills/<prefix><id>/SKILL.md`  — cross-tool stub (Codex, Cursor, Gemini)
 *
 * Adapters are stub pointers: their body links back to the canonical, which
 * remains the single source of truth for workflow content.
 */
import { mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';

const CANONICAL_FILENAME = 'SKILL-CANONICAL.md';
const ADAPTER_FILENAME = 'SKILL.md';

export interface GeneratorOptions {
  readonly repoRoot: string;
  readonly prefix: string;
}

export interface GenerateOutcome {
  readonly written: readonly string[];
  readonly skipped: readonly string[];
}

interface CanonicalFrontmatter {
  name: string;
  description: string;
}

interface AdapterFrontmatter {
  readonly name: string;
  readonly description: string;
}

interface ParsedCanonical {
  readonly id: string;
  readonly frontmatter: CanonicalFrontmatter;
  readonly canonicalPath: string;
  readonly canonicalFilename: string;
}

/**
 * Discover, parse, and emit adapters for every canonical skill under
 * `.agent/skills/`. Idempotent — re-running yields byte-identical adapter
 * files when the canonicals are unchanged.
 */
export async function generateAdapters(options: GeneratorOptions): Promise<GenerateOutcome> {
  const written: string[] = [];
  const skipped: string[] = [];
  const canonicalsRoot = join(options.repoRoot, '.agent', 'skills');
  const canonicalDirs = await readdir(canonicalsRoot, { withFileTypes: true });

  for (const dirent of canonicalDirs) {
    if (!dirent.isDirectory()) {
      continue;
    }
    const parsed = await readCanonical(canonicalsRoot, dirent.name);
    if (parsed === undefined) {
      skipped.push(dirent.name);
      continue;
    }
    const claudeWritten = await emitAdapter(options, parsed, 'claude');
    const agentsWritten = await emitAdapter(options, parsed, 'agents');
    written.push(claudeWritten, agentsWritten);
  }

  return { written, skipped };
}

async function readCanonical(
  canonicalsRoot: string,
  id: string,
): Promise<ParsedCanonical | undefined> {
  const resolved = await resolveCanonicalPath(canonicalsRoot, id);
  if (resolved === undefined) {
    return undefined;
  }
  const text = await readFile(resolved.path, 'utf8');
  const frontmatter = parseFrontmatter(text);
  if (frontmatter === undefined) {
    return undefined;
  }
  return {
    id,
    frontmatter,
    canonicalPath: resolved.path,
    canonicalFilename: resolved.filename,
  };
}

async function resolveCanonicalPath(
  canonicalsRoot: string,
  id: string,
): Promise<{ readonly path: string; readonly filename: string } | undefined> {
  const path = join(canonicalsRoot, id, CANONICAL_FILENAME);
  if (await fileExists(path)) {
    return { path, filename: CANONICAL_FILENAME };
  }
  return undefined;
}

async function fileExists(path: string): Promise<boolean> {
  try {
    const info = await stat(path);
    return info.isFile();
  } catch {
    return false;
  }
}

/**
 * Parse the leading YAML frontmatter block from a markdown file body.
 * Returns undefined if the file lacks a valid frontmatter fence or omits
 * the required `name`/`description` fields. Extra YAML keys (e.g.
 * `classification`) are silently discarded so the returned value matches
 * the declared {@link CanonicalFrontmatter} shape exactly.
 */
export function parseFrontmatter(text: string): CanonicalFrontmatter | undefined {
  const fenceMatch = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (fenceMatch === null) {
    return undefined;
  }
  const yamlBody = fenceMatch[1] ?? '';
  const parsed: unknown = parseYaml(yamlBody);
  if (!hasNameAndDescription(parsed)) {
    return undefined;
  }
  return { name: parsed.name, description: parsed.description };
}

function hasNameAndDescription(
  value: unknown,
): value is { readonly name: string; readonly description: string } {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  if (!('name' in value) || !('description' in value)) {
    return false;
  }
  return typeof value.name === 'string' && typeof value.description === 'string';
}

export type AdapterSurface = 'claude' | 'agents';
export type ParsedCanonicalSkill = ParsedCanonical;

async function emitAdapter(
  options: GeneratorOptions,
  parsed: ParsedCanonical,
  surface: AdapterSurface,
): Promise<string> {
  const target = adapterTargetPath(options.repoRoot, options.prefix, parsed.id, surface);
  const fileContent = renderAdapter(parsed, options.prefix, surface);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, fileContent, 'utf8');
  return target;
}

export function renderAdapter(
  parsed: ParsedCanonicalSkill,
  prefix: string,
  surface: AdapterSurface,
): string {
  const frontmatter = buildAdapterFrontmatter(parsed.frontmatter, prefix, parsed.id);
  const surfaceLabel = surface === 'claude' ? 'Claude Code' : 'Cross-tool';
  const body = renderAdapterBody(parsed.id, surfaceLabel, parsed.canonicalFilename);
  const yamlBlock = stringifyYaml(frontmatter, { lineWidth: 0 }).trimEnd();
  return `---\n${yamlBlock}\n---\n\n${body.trimStart()}`;
}

export function adapterTargetPath(
  repoRoot: string,
  prefix: string,
  canonicalId: string,
  surface: AdapterSurface,
): string {
  const surfaceRoot = surface === 'claude' ? '.claude' : '.agents';
  return join(repoRoot, surfaceRoot, 'skills', `${prefix}${canonicalId}`, ADAPTER_FILENAME);
}

/**
 * Construct the adapter frontmatter from the canonical's frontmatter.
 * Always renames the skill: `<prefix><id>`. Description is preserved.
 */
export function buildAdapterFrontmatter(
  canonical: CanonicalFrontmatter,
  prefix: string,
  id: string,
): AdapterFrontmatter {
  return {
    name: `${prefix}${id}`,
    description: canonical.description,
  };
}

function renderAdapterBody(
  canonicalId: string,
  surfaceLabel: string,
  canonicalFilename: string,
): string {
  const title = toTitleCase(canonicalId);
  return [
    `# ${title} (${surfaceLabel})`,
    '',
    `Read and follow \`.agent/skills/${canonicalId}/${canonicalFilename}\`.`,
    '',
  ].join('\n');
}

function toTitleCase(id: string): string {
  return id
    .split('-')
    .map((part) => (part.length === 0 ? part : `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`))
    .join(' ');
}

/**
 * Remove every adapter directory under `.claude/skills/` and `.agents/skills/`
 * before a fresh generation pass, so stale adapters don't outlive their
 * canonicals. Idempotent.
 */
export async function clearGeneratedAdapters(repoRoot: string): Promise<void> {
  for (const surface of ['.claude/skills', '.agents/skills']) {
    const root = join(repoRoot, surface);
    const dirents = await readdir(root, { withFileTypes: true }).catch(() => []);
    for (const dirent of dirents) {
      if (dirent.isDirectory()) {
        await rm(join(root, dirent.name), { recursive: true, force: true });
      }
    }
  }
}
