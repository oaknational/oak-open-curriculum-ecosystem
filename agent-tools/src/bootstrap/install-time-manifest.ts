/**
 * Read what the install-time closure needs from workspace text: the
 * `packages` patterns of `pnpm-workspace.yaml`, each manifest paired with its
 * directory, the files under `dist/` a manifest's entry points name, and the
 * workspace packages it declares. Pure, and importing nothing from the
 * workspace, for the reason `install-time-closure.ts` gives; the text arrives
 * unknown and is validated with zod at the boundary (ADR-032).
 *
 * @packageDocumentation
 */

import path from 'node:path';

import { parse as parseYaml } from 'yaml';
import { z } from 'zod';

import { type ClosureResult } from './install-time-closure-graph.js';

/** One workspace package: its repo-relative directory and its parsed `package.json`. */
export interface WorkspaceManifestInput {
  readonly dir: string;
  readonly manifest: unknown;
}

const WorkspaceFileSchema = z.object({ packages: z.array(z.string()).min(1) });

/**
 * The `packages` patterns a `pnpm-workspace.yaml` declares.
 *
 * @param file - The file's path, named in a refusal.
 * @param text - The file's contents.
 * @returns The patterns, or an error naming the file when it is not YAML or
 * declares no workspace packages.
 */
export function parseWorkspacePatterns(
  file: string,
  text: string,
): ClosureResult<readonly string[]> {
  let document: unknown;
  try {
    document = parseYaml(text);
  } catch (error) {
    return { ok: false, error: `${file} is not YAML: ${describeError(error)}` };
  }
  const parsed = WorkspaceFileSchema.safeParse(document);
  if (!parsed.success) {
    return { ok: false, error: `${file} declares no workspace packages: ${parsed.error.message}` };
  }
  return { ok: true, value: parsed.data.packages };
}

/**
 * One workspace package's manifest, paired with its directory.
 *
 * @param manifestPath - The manifest's path relative to the repository root,
 * with `/` separators; its directory is the package's.
 * @param text - The manifest's contents.
 * @returns The input, or an error naming the path when the text is not JSON.
 */
export function parseManifestText(
  manifestPath: string,
  text: string,
): ClosureResult<WorkspaceManifestInput> {
  try {
    const manifest: unknown = JSON.parse(text);
    return { ok: true, value: { dir: path.posix.dirname(manifestPath), manifest } };
  } catch (error) {
    return { ok: false, error: `${manifestPath} is not JSON: ${describeError(error)}` };
  }
}

/**
 * The message of a caught value, whatever was thrown.
 *
 * @param error - The caught value.
 * @returns Its message, or its string form when it is not an `Error`.
 */
export function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** An `exports` value: a target, `null` (a hidden subpath), or a nested condition map or array. */
type ExportValue = string | null | readonly ExportValue[] | { readonly [key: string]: ExportValue };

const ExportValueSchema: z.ZodType<ExportValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.null(),
    z.array(ExportValueSchema),
    z.record(z.string(), ExportValueSchema),
  ]),
);

const DependencyRecordSchema = z.record(z.string(), z.string()).optional();

/** The `package.json` fields the derivation reads; everything else is ignored. */
export const ManifestSchema = z.object({
  name: z.string().min(1),
  main: z.string().optional(),
  types: z.string().optional(),
  exports: ExportValueSchema.optional(),
  scripts: z.object({ build: z.string().optional() }).optional(),
  dependencies: DependencyRecordSchema,
  devDependencies: DependencyRecordSchema,
  peerDependencies: DependencyRecordSchema,
});

/** A manifest as the derivation reads it. */
export type Manifest = z.infer<typeof ManifestSchema>;

const DIST_DIR = 'dist/';

/**
 * The files under `dist/` the manifest's entry points name, in declaration
 * order without repeats. A leading `./` is optional (`dist/x` and `./dist/x`
 * are the same file); targets outside `dist/`, such as a `./package.json`
 * self-export, and `null` targets are not build output.
 *
 * @param manifest - A validated manifest.
 * @returns The witness paths under `dist/`; empty when no entry point names one.
 */
export function distArtifacts(manifest: Manifest): readonly string[] {
  const targets = [
    ...(manifest.exports === undefined ? [] : exportTargets(manifest.exports)),
    ...(manifest.main === undefined ? [] : [manifest.main]),
    ...(manifest.types === undefined ? [] : [manifest.types]),
  ];
  const inDist = targets
    .map((target) => (target.startsWith('./') ? target.slice(2) : target))
    .filter((target) => target.startsWith(DIST_DIR))
    .map((target) => target.slice(DIST_DIR.length));
  return [...new Set(inDist)];
}

/**
 * The workspace package names a manifest declares, in any dependency field,
 * without repeats.
 *
 * @param manifest - A validated manifest.
 * @returns The names whose range starts `workspace:`.
 */
export function workspaceDependencies(manifest: Manifest): readonly string[] {
  const declared = [
    ...recordEntries(manifest.dependencies ?? {}),
    ...recordEntries(manifest.devDependencies ?? {}),
    ...recordEntries(manifest.peerDependencies ?? {}),
  ];
  return [
    ...new Set(
      declared.filter(([, range]) => range.startsWith('workspace:')).map(([name]) => name),
    ),
  ];
}

/** Every target string of an `exports` value, whatever its nesting. */
function exportTargets(value: ExportValue): readonly string[] {
  if (value === null) {
    return [];
  }
  if (typeof value === 'string') {
    return [value];
  }
  if (isExportArray(value)) {
    return value.flatMap((item) => exportTargets(item));
  }
  return recordEntries(value).flatMap(([, nested]) => exportTargets(nested));
}

function isExportArray(value: ExportValue): value is readonly ExportValue[] {
  return Array.isArray(value);
}

/**
 * Typed own-entry iteration over a zod-validated record, dropping `undefined`
 * values. A local counterpart of `typeSafeEntries` from
 * `@oaknational/type-helpers`, not consolidated with it: that package is a
 * member of the closure this module feeds, so it cannot be imported before it
 * is built.
 */
function recordEntries<T>(record: Readonly<Record<string, T>>): readonly (readonly [string, T])[] {
  const entries: (readonly [string, T])[] = [];
  for (const key in record) {
    const value = Object.hasOwn(record, key) ? record[key] : undefined;
    if (value !== undefined) {
      entries.push([key, value]);
    }
  }
  return entries;
}
