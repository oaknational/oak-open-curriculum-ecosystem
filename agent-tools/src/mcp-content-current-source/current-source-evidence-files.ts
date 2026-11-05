import { execFileSync } from 'node:child_process';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';
import { CURRENT_ITEM_ANCHOR_OVERRIDES } from './current-item-anchor-overrides.js';
import { CURRENT_ITEM_REVISION_OVERRIDES } from './current-item-revision-overrides.js';
import { CURRENT_ITEM_REGISTRATION_SURFACE_OVERRIDES } from './current-item-registration-surface-overrides.js';
import {
  buildCurrentSourceAnchorManifest,
  type BaselineAnchorRow,
} from './current-source-anchor-manifest.js';
import type { BaselineAuditRow, CurrentSourceAnchorManifest } from './current-source-model.js';

export type BaselineEvidenceRow = BaselineAuditRow & BaselineAnchorRow;

const baselineRegistrySchema = z
  .object({
    items: z.array(
      z
        .object({
          id: z.string().min(1),
          file: z.string().min(1),
          lines: z.string().min(1),
          workspace_scope: z.enum(['in', 'out-upstream-api']),
          source_locus: z.enum([
            'this-repo',
            'upstream-in-house-api',
            'upstream-in-house-skills',
            'external-third-party',
          ]),
        })
        .transform((item) => ({
          id: item.id,
          file: item.file,
          lines: item.lines,
          workspaceScope: item.workspace_scope,
          sourceLocus: item.source_locus,
        })),
    ),
  })
  .transform((registry) => registry.items);

const tokenAnchorSchema = z
  .object({
    tokenCount: z.number().int().positive(),
    tokenSha256: z.string().regex(/^[a-f0-9]{64}$/),
    indexToken: z.string().min(1),
    indexOffset: z.number().int().nonnegative(),
    registrationSurface: z
      .discriminatedUnion('locus', [
        z
          .object({
            locus: z.literal('resource-metadata'),
            field: z.enum(['title', 'description']),
          })
          .strict(),
        z
          .object({
            locus: z.literal('resource-contents'),
            field: z.literal('text'),
          })
          .strict(),
      ])
      .optional(),
  })
  .strict();

const currentSourceAnchorManifestSchema = z
  .object({
    schemaVersion: z.literal(2),
    baselineCommit: z.string().min(1),
    baselineSha256: z.string().regex(/^[a-f0-9]{64}$/),
    items: z.array(
      z
        .object({
          auditId: z.string().min(1),
          evidence: z
            .object({
              revision: z.enum(['unchanged', 'expanded', 'modified', 'relocated', 'added']),
              targets: z
                .array(
                  z
                    .object({
                      file: z.string().min(1),
                      anchors: z.array(tokenAnchorSchema).min(1),
                    })
                    .strict(),
                )
                .min(1),
            })
            .strict(),
        })
        .strict(),
    ),
  })
  .strict();

export function parseBaselineRows(json: string): readonly BaselineEvidenceRow[] {
  return baselineRegistrySchema.parse(JSON.parse(json));
}

export function parseCurrentSourceAnchorManifest(json: string): CurrentSourceAnchorManifest {
  return currentSourceAnchorManifestSchema.parse(JSON.parse(json));
}

async function pathExists(repoRoot: string, repoRelativePath: string): Promise<boolean> {
  try {
    await access(path.join(repoRoot, repoRelativePath));
    return true;
  } catch {
    return false;
  }
}

interface CurrentTargetDependencies {
  readonly pathExists?: (repoRoot: string, repoRelativePath: string) => Promise<boolean>;
}

export async function currentTargetsByAuditId(
  repoRoot: string,
  baseline: readonly BaselineEvidenceRow[],
  promptEraLineage: ReadonlyMap<string, readonly string[]>,
  dependencies: CurrentTargetDependencies = {},
): Promise<ReadonlyMap<string, readonly string[]>> {
  const targetExists = dependencies.pathExists ?? pathExists;
  const targets = new Map<string, readonly string[]>();
  for (const row of baseline) {
    const lineageTargets = promptEraLineage.get(row.id);
    if (lineageTargets !== undefined) {
      targets.set(row.id, lineageTargets);
      continue;
    }
    if (await targetExists(repoRoot, row.file)) {
      targets.set(row.id, [row.file]);
      continue;
    }
    throw new Error(`Missing current source and explicit lineage for ${row.id}: ${row.file}`);
  }
  return targets;
}

export async function readCurrentContent(
  repoRoot: string,
  files: readonly string[],
): Promise<ReadonlyMap<string, string>> {
  const entries = await Promise.all(
    [...new Set(files)].map(
      async (file) => [file, await readFile(path.join(repoRoot, file), 'utf8')] as const,
    ),
  );
  return new Map(entries);
}

function readBaselineContent(
  repoRoot: string,
  baselineCommit: string,
  files: readonly string[],
): ReadonlyMap<string, string> {
  return new Map(
    [...new Set(files)].map((file) => [
      file,
      execFileSync('git', ['show', `${baselineCommit}:${file}`], {
        cwd: repoRoot,
        encoding: 'utf8',
      }),
    ]),
  );
}

/** Refuses a persisted manifest the source-owned overrides no longer produce. */
export function requirePersistedManifestAgreement(
  persisted: CurrentSourceAnchorManifest,
  recomputed: CurrentSourceAnchorManifest,
  anchorArtifact: string,
): void {
  if (JSON.stringify(persisted) !== JSON.stringify(recomputed)) {
    throw new Error(
      `${anchorArtifact} disagrees with the manifest recomputed from source-owned overrides; ` +
        'run refresh-mcp-content-current-source-anchors and review the complete diff',
    );
  }
}

interface LoadAnchorManifestInput {
  readonly repoRoot: string;
  readonly anchorArtifact: string;
  readonly baselineCommit: string;
  readonly baselineSha256: string;
  readonly baseline: readonly BaselineEvidenceRow[];
  readonly targetsByAuditId: ReadonlyMap<string, readonly string[]>;
  readonly refresh: boolean;
}

export async function resolveAnchorManifest(
  input: LoadAnchorManifestInput,
): Promise<CurrentSourceAnchorManifest> {
  const artifactPath = path.join(input.repoRoot, input.anchorArtifact);
  const manifest = buildCurrentSourceAnchorManifest({
    baselineCommit: input.baselineCommit,
    baselineSha256: input.baselineSha256,
    rows: input.baseline,
    targetsByAuditId: input.targetsByAuditId,
    baselineContentByFile: readBaselineContent(
      input.repoRoot,
      input.baselineCommit,
      input.baseline.map((row) => row.file),
    ),
    currentContentByFile: await readCurrentContent(
      input.repoRoot,
      [...input.targetsByAuditId.values()].flat(),
    ),
    overrides: CURRENT_ITEM_ANCHOR_OVERRIDES,
    registrationSurfaceOverrides: CURRENT_ITEM_REGISTRATION_SURFACE_OVERRIDES,
    revisionOverrides: CURRENT_ITEM_REVISION_OVERRIDES,
  });
  if (!input.refresh) {
    const persisted = parseCurrentSourceAnchorManifest(await readFile(artifactPath, 'utf8'));
    requirePersistedManifestAgreement(persisted, manifest, input.anchorArtifact);
  }
  return manifest;
}
