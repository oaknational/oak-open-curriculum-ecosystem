/**
 * Adapter-stub rendering: the byte-exact content and target path of a
 * Practice projection. Split from `generator.ts` (orchestration) so the
 * one place that WRITES the class-recognisable stub shape sits beside
 * nothing else — the shape itself is single-sourced in `adapter-stub.ts`
 * and pinned by `adapter-stub.unit.test.ts`.
 */
import { join } from 'node:path';

import { stringify as stringifyYaml } from 'yaml';

import { adapterStubPointerLine } from './adapter-stub.js';
import type { CanonicalFrontmatter, ParsedCanonical } from './discovery.js';

const ADAPTER_FILENAME = 'SKILL.md';

export type AdapterSurface = 'claude' | 'agents';

interface AdapterFrontmatter {
  readonly name: string;
  readonly description: string;
}

export function renderAdapter(
  parsed: ParsedCanonical,
  prefix: string,
  surface: AdapterSurface,
): string {
  const frontmatter = buildAdapterFrontmatter(parsed.frontmatter, prefix, parsed.id);
  const surfaceLabel = surface === 'claude' ? 'Claude Code' : 'Cross-tool';
  const body = renderAdapterBody(
    parsed.id,
    parsed.relativeDir,
    surfaceLabel,
    parsed.canonicalFilename,
  );
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

/**
 * The stub body's pointer line is the Practice-projection CLASS MARKER:
 * the sweep, the clear pass, the emission-target guard, and the
 * permission census recognise our projections by parsing it back — built
 * via the one shared definition in `adapter-stub.ts`.
 */
function renderAdapterBody(
  canonicalId: string,
  relativeDir: string,
  surfaceLabel: string,
  canonicalFilename: string,
): string {
  const title = toTitleCase(canonicalId);
  return [
    `# ${title} (${surfaceLabel})`,
    '',
    adapterStubPointerLine(`${relativeDir}/${canonicalFilename}`),
    '',
  ].join('\n');
}

function toTitleCase(id: string): string {
  return id
    .split('-')
    .map((part) => (part.length === 0 ? part : `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`))
    .join(' ');
}
