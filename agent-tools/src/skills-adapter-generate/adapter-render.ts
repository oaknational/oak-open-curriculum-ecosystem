/**
 * Adapter-stub rendering: the byte-exact content and target path of a
 * Practice projection. Split from `generator.ts` (orchestration) so the
 * one place that WRITES the class-recognisable stub shape sits beside
 * nothing else — the shape itself is single-sourced in `adapter-stub.ts`
 * and pinned by `adapter-stub.unit.test.ts`.
 */
import { join } from 'node:path';

import { Document, isMap, isScalar, Scalar } from 'yaml';

import { adapterStubPointerLine } from './adapter-stub.js';
import {
  specPortableFrontmatter,
  type CanonicalFrontmatter,
  type SpecPortableFrontmatter,
} from './canonical-frontmatter.js';
import type { ParsedCanonical } from './discovery.js';

const ADAPTER_FILENAME = 'SKILL.md';

export type AdapterSurface = 'claude' | 'agents';

interface AdapterFrontmatter extends SpecPortableFrontmatter {
  readonly name: string;
  readonly description: string;
}

/**
 * The two keys left to the serialiser's own quoting judgement. Everything
 * else in the emitted frontmatter — the whole spec-portable set — is
 * force-quoted by {@link quoteEmittedStrings}.
 *
 * `name` is the prefixed lowercase-hyphen id and `description` is required
 * non-empty prose whose inner quotes would be escaped for no gain. Neither
 * can be a bare scalar of another type without already violating the
 * specification's own field rules — a canonical-contract check (`name`
 * regex, description limits) that does not exist yet, not an emission
 * concern. Stating the rule as an EXEMPTION rather than a key list is
 * deliberate: a spec-portable field added to the schema later is quoted
 * automatically instead of silently missing from a second list.
 */
const SERIALISER_QUOTED_KEYS: readonly string[] = ['name', 'description'];

const YAML_EMIT_OPTIONS = { lineWidth: 0 } as const;

/**
 * Force double-quoted emission for every string value the schema has
 * already proven is a string.
 *
 * No choice of YAML version delivers this, because the two resolutions
 * disagree about which bare scalars are strings and each leaves the
 * other's ambiguous forms unquoted. Measured against this workspace's
 * `yaml` on 2026-09-09: emitting under 1.2 leaves `yes`, `no`, `on`,
 * `off`, `y`, `2026-09-09` and `1:30` bare, which a 1.1 consumer (PyYAML,
 * Ruby Psych, `yaml.v2`) reads as booleans, a date and the number 90;
 * emitting under 1.1 leaves `0o17` bare, which a 1.2 consumer reads as
 * the number 15. Picking a version trades one direction of the hazard for
 * the other, and the surfaces exist for foreign vendors whose resolution
 * is not ours to know.
 *
 * Quoting closes both directions at once, depends on no version, and
 * makes these fields byte-faithful to the canonical's own quoted
 * authoring form — so `version: "0.1.0"` projects as it was written. The
 * one nested level is the specification's `metadata` map, whose VALUES
 * are the string→string payload.
 */
function quoteEmittedStrings(doc: Document): void {
  const contents: unknown = doc.contents;
  if (!isMap(contents)) {
    return;
  }
  for (const pair of contents.items) {
    const key: unknown = isScalar(pair.key) ? pair.key.value : undefined;
    if (typeof key !== 'string' || SERIALISER_QUOTED_KEYS.includes(key)) {
      continue;
    }
    const value: unknown = pair.value;
    if (isMap(value)) {
      value.items.forEach((entry) => quoteStringScalar(entry.value));
      continue;
    }
    quoteStringScalar(value);
  }
}

function quoteStringScalar(node: unknown): void {
  if (isScalar(node) && typeof node.value === 'string') {
    node.type = Scalar.QUOTE_DOUBLE;
  }
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
  const doc = new Document(frontmatter);
  quoteEmittedStrings(doc);
  const yamlBlock = doc.toString(YAML_EMIT_OPTIONS).trimEnd();
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
 *
 * The `name` is the ONLY field the adapter rewrites — the projection name
 * carries the owned-skill prefix while canonical identity stays unprefixed.
 * Every spec-portable optional field (`license`, `compatibility`,
 * `metadata`, `allowed-tools`) passes through per ADR-125's adapter table,
 * in the specification's own field order, so a canonical's environment
 * requirements and metadata reach the surfaces vendors actually read.
 * Non-spec canonical keys (`classification`, `concern`, `domain`) are
 * canonical-only and never projected.
 *
 * The frontmatter is re-serialised rather than copied, so what is
 * guaranteed is that the projection RE-PARSES to the canonical's values.
 * For the spec-portable fields that guarantee holds under any YAML
 * resolution, because their values are emitted explicitly quoted — see
 * {@link quoteEmittedStrings} for why no choice of version delivers it.
 */
export function buildAdapterFrontmatter(
  canonical: CanonicalFrontmatter,
  prefix: string,
  id: string,
): AdapterFrontmatter {
  return {
    name: `${prefix}${id}`,
    description: canonical.description,
    ...specPortableFrontmatter(canonical),
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
