/**
 * Under-the-hood MCP content generator.
 *
 * Reads the canonical orientation skill
 * (`.agent/skills/under-the-hood/SKILL-CANONICAL.md`), classifies every
 * section against the total allow/exclude lists in `sections.ts`, and emits
 * the served digest as a committed generated module in the MCP app
 * (`apps/oak-curriculum-mcp-streamable-http/src/generated/oak-under-the-hood-content.ts`).
 *
 * Generation is out-of-band-and-committed (the `build:widget` embed
 * precedent): the app build never reads `.agent/` — a cross-workspace
 * build-time read would be invisible to the app's turbo input set and go
 * silently stale. Drift is caught by `--check` (wired into
 * `repo-validators:check`), which regenerates in memory and compares
 * bytewise against the committed module — a recompute, never a recorded
 * assertion. All fallible steps return `Result` (ADR-088); the CLI is the
 * single boundary that translates errors to exit codes.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { err, isErr, ok, type Result } from '@oaknational/result';

import { toLfText } from '../core/lf-text.js';

import {
  CANONICAL_SKILL_PATH,
  parseCanonicalSections,
  type CanonicalSection,
} from './canonical-parser.js';
import { EXCLUDED_SECTION_HEADINGS, SERVED_SECTION_HEADINGS } from './sections.js';
import { servedSectionDefect } from './served-section-guards.js';

/** Repo-relative path of the emitted generated module. */
export const GENERATED_MODULE_PATH =
  'apps/oak-curriculum-mcp-streamable-http/src/generated/oak-under-the-hood-content.ts';

/** A classification: the served allowlist and the excluded map (with reasons). */
interface SectionClassification {
  readonly served: readonly string[];
  readonly excluded: ReadonlyMap<string, string>;
}

const CANONICAL_CLASSIFICATION: SectionClassification = {
  served: SERVED_SECTION_HEADINGS,
  excluded: EXCLUDED_SECTION_HEADINGS,
};

/**
 * Classifies every section and derives the served digest. Classification is
 * total: an unclassified heading, a heading classified in both lists, a
 * classified heading absent from the canonical (served or excluded), a
 * deeper-than-H3 heading inside a served section, or a raw-GitHub fetch-URL
 * form inside a served section all fail loudly, so canonical restructuring
 * forces a deliberate decision in `sections.ts` rather than silently changing
 * the served payload. The classification is an explicit input; production
 * callers pass `CANONICAL_CLASSIFICATION` (see `renderFromRepo`).
 */
export function buildDigest(
  canonical: string,
  classification: SectionClassification,
): Result<string, string> {
  const parsed = parseCanonicalSections(canonical);
  if (isErr(parsed)) {
    return parsed;
  }
  const defect = classificationDefect(parsed.value, classification);
  if (defect !== undefined) {
    return err(defect);
  }
  const served = parsed.value.filter((s) => classification.served.includes(s.heading));
  const digest = served
    .map((s) => [s.heading, ...s.lines].join('\n').trimEnd())
    .join('\n\n')
    .trim();
  return ok(`${digest}\n`);
}

/** The first total-classification defect, or undefined when the digest is safe to build. */
function classificationDefect(
  sections: readonly CanonicalSection[],
  { served, excluded }: SectionClassification,
): string | undefined {
  const dual = served.filter((h) => excluded.has(h));
  if (dual.length > 0) {
    return (
      `Heading(s) classified as BOTH served and excluded — exactly one classification ` +
      `is required; fix sections.ts:\n${dual.join('\n')}`
    );
  }
  const headings = sections.map((s) => s.heading);
  const duplicates = [...new Set(headings.filter((h, i) => headings.indexOf(h) !== i))];
  if (duplicates.length > 0) {
    return (
      `Duplicate section heading(s) in ${CANONICAL_SKILL_PATH} — headings must be unique or ` +
      `a repeated section ships with no fresh classification decision:\n${duplicates.join('\n')}`
    );
  }
  const unclassified = headings.filter((h) => !served.includes(h) && !excluded.has(h));
  if (unclassified.length > 0) {
    return (
      `Unclassified section heading(s) in ${CANONICAL_SKILL_PATH} — classify each in ` +
      `sections.ts (served or excluded, with reason):\n${unclassified.join('\n')}`
    );
  }
  const present = new Set(headings);
  const missingServed = served.filter((h) => !present.has(h));
  if (missingServed.length > 0) {
    return (
      `Served section heading(s) missing from ${CANONICAL_SKILL_PATH} — the canonical was ` +
      `restructured; re-decide the digest in sections.ts:\n${missingServed.join('\n')}`
    );
  }
  const missingExcluded = [...excluded.keys()].filter((h) => !present.has(h));
  if (missingExcluded.length > 0) {
    return (
      `Excluded section heading(s) missing from ${CANONICAL_SKILL_PATH} — stale exclusion ` +
      `entries; remove or update them in sections.ts:\n${missingExcluded.join('\n')}`
    );
  }
  return servedSectionDefect(sections, served);
}

/** Renders the generated TypeScript module for a digest. */
export function renderGeneratedModule(digest: string): string {
  return `/**
 * GENERATED FILE — DO NOT EDIT
 *
 * The under-the-hood orientation digest served by the oak-under-the-hood MCP
 * tool: the audience-independent sections of the canonical skill
 * (\`${CANONICAL_SKILL_PATH}\`), selected by the total section classification
 * in \`agent-tools/src/under-the-hood-content-generate/sections.ts\`.
 *
 * Re-generate: \`pnpm under-the-hood-content:generate\` (repo root).
 * Drift gate: \`pnpm --filter @oaknational/agent-tools validate-under-the-hood-content\`.
 */
export const OAK_UNDER_THE_HOOD_ORIENTATION = ${JSON.stringify(digest)} as const;
`;
}

/**
 * The generator's filesystem seam. Required (no default): the CLI passes
 * `NODE_FILE_IO`; tests inject simple fakes as arguments (testing-strategy
 * §Integration — the classifier is the boundary, not the tool).
 */
export interface GeneratorFileIo {
  /** Resolves undefined when the file cannot be read. */
  readonly readTextFile: (path: string) => Promise<string | undefined>;
  /** May reject; the generator translates the failure to Err at this boundary. */
  readonly writeTextFile: (path: string, content: string) => Promise<void>;
}

/** The production seam over node:fs. */
export const NODE_FILE_IO: GeneratorFileIo = {
  readTextFile: async (path: string): Promise<string | undefined> => {
    try {
      // LF-normalised at the read edge (see toLfText) so generation and
      // staleness checks judge CONTENT — the generated module is composed
      // and written LF regardless.
      return toLfText(await readFile(path, 'utf8'));
    } catch {
      return undefined;
    }
  },
  writeTextFile: async (path: string, content: string): Promise<void> => {
    await writeFile(path, content, 'utf8');
  },
};

/** Generates the module from the repo's canonical and writes it. */
export async function generateContentModule(
  repoRoot: string,
  io: GeneratorFileIo,
): Promise<Result<string, string>> {
  const module = await renderFromRepo(repoRoot, io);
  if (isErr(module)) {
    return module;
  }
  const outputPath = join(repoRoot, GENERATED_MODULE_PATH);
  try {
    await io.writeTextFile(outputPath, module.value);
  } catch (error: unknown) {
    return err(
      `Cannot write ${GENERATED_MODULE_PATH}: ` +
        `${error instanceof Error ? error.message : String(error)}`,
    );
  }
  return ok(outputPath);
}

/** Regenerates in memory and reports drift against the committed module. */
export async function checkContentModule(
  repoRoot: string,
  io: GeneratorFileIo,
): Promise<{ readonly ok: boolean; readonly detail: string }> {
  const expected = await renderFromRepo(repoRoot, io);
  if (isErr(expected)) {
    return { ok: false, detail: expected.error };
  }
  const outputPath = join(repoRoot, GENERATED_MODULE_PATH);
  const actual = await io.readTextFile(outputPath);
  if (actual === undefined) {
    return { ok: false, detail: `Missing generated module: ${GENERATED_MODULE_PATH}` };
  }
  if (actual !== expected.value) {
    return { ok: false, detail: `Generated module is stale: ${GENERATED_MODULE_PATH}` };
  }
  return { ok: true, detail: 'Under-the-hood content module is up to date.' };
}

async function renderFromRepo(
  repoRoot: string,
  io: GeneratorFileIo,
): Promise<Result<string, string>> {
  const canonical = await io.readTextFile(join(repoRoot, CANONICAL_SKILL_PATH));
  if (canonical === undefined) {
    return err(`Cannot read canonical skill: ${CANONICAL_SKILL_PATH}`);
  }
  const digest = buildDigest(canonical, CANONICAL_CLASSIFICATION);
  if (isErr(digest)) {
    return digest;
  }
  return ok(renderGeneratedModule(digest.value));
}
