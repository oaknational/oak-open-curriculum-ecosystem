/**
 * Reads the governed artefacts the workspace renders.
 *
 * @remarks
 * The three JSON artefacts are generated and already guarded by
 * `validate-mcp-content-current-source`, so they are read with the same
 * parse-and-type approach their producing modules use rather than re-validated
 * here. The source files are read only to quote them.
 *
 * @packageDocumentation
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';

import {
  BASELINE_ARTIFACT,
  CURRENT_SOURCE_ANCHORS,
  CURRENT_SOURCE_ARTIFACT,
} from '../mcp-content-current-source/current-source-config.js';
import { CURRENT_SOURCE_ADDITION_DEFINITIONS } from '../mcp-content-current-source/current-source-addition-definitions.js';
import { parseCurrentSourceAnchorManifest } from '../mcp-content-current-source/current-source-evidence-files.js';
import type { CurrentSourceAnchorManifest } from '../mcp-content-current-source/current-source-model.js';
import type { AnchorTargets, WorkspaceInputs } from './content-workspace-model.js';
import { parseBaselineRegistry, parseCurrentSourceProjection } from './workspace-input-schemas.js';

async function readText(repoRoot: string, relativePath: string): Promise<string> {
  return readFile(path.join(repoRoot, relativePath), 'utf8');
}

/** Every source file the anchors point at, read once. */
async function readSourceText(
  repoRoot: string,
  anchors: CurrentSourceAnchorManifest,
): Promise<ReadonlyMap<string, string>> {
  const files = new Set(
    anchors.items.flatMap((item) => item.evidence.targets.map((target) => target.file)),
  );
  const entries = await Promise.all(
    [...files].map(async (file): Promise<readonly [string, string] | null> => {
      const content = await readFile(path.join(repoRoot, file), 'utf8').catch(() => null);
      return content === null ? null : ([file, content] as const);
    }),
  );
  return new Map(entries.filter((entry) => entry !== null));
}

/** Load everything the renderer needs. */
export async function loadWorkspaceInputs(repoRoot: string): Promise<WorkspaceInputs> {
  const [registryJson, currentJson, anchorJson] = await Promise.all([
    readText(repoRoot, BASELINE_ARTIFACT),
    readText(repoRoot, CURRENT_SOURCE_ARTIFACT),
    readText(repoRoot, CURRENT_SOURCE_ANCHORS),
  ]);
  const registry = parseBaselineRegistry(registryJson);
  const current = parseCurrentSourceProjection(currentJson);
  const anchors = parseCurrentSourceAnchorManifest(anchorJson);
  const anchorsById = new Map<string, AnchorTargets>(
    anchors.items.map((item) => [item.auditId, item.evidence]),
  );
  return {
    registry,
    current,
    sourceText: await readSourceText(repoRoot, anchors),
    anchorsById,
    additionTextById: additionText(),
  };
}

/**
 * The reviewed content of each post-baseline addition.
 *
 * @remarks
 * Read from the addition definitions rather than the anchor manifest, which
 * covers immutable baseline ids only. Each anchor's `content` is verified
 * present in current source when the projection is built, so quoting it is
 * quoting today's wording.
 */
function additionText(): ReadonlyMap<string, string> {
  return new Map(
    CURRENT_SOURCE_ADDITION_DEFINITIONS.map((definition) => [
      definition.id,
      definition.reviewedAnchors.map((anchor) => anchor.content).join('\n\n'),
    ]),
  );
}
