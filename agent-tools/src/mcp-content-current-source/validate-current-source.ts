#!/usr/bin/env node

/** Recomputes the MCP agent-facing current-source truth set; `--write` refreshes it. */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { resolveRepoRoot } from '../core/repo-root.js';
import { writeErrorLine, writeLine } from '../core/terminal-output.js';
import {
  AUDIT_REPORT,
  CURRENT_SOURCE_ANCHORS,
  CURRENT_SOURCE_ARTIFACT,
} from './current-source-config.js';
import { normaliseLineEndings } from './normalise-line-endings.js';
import { publishCurrentSourceArtifacts } from './publish-artifacts.js';
import {
  recomputeCurrentSource,
  type RecomputedCurrentSource,
} from './recompute-current-source.js';

const repoRoot = resolveRepoRoot(import.meta.url);

async function readNormalisedArtifact(repoRelativePath: string): Promise<string | null> {
  return readFile(path.join(repoRoot, repoRelativePath), 'utf8')
    .then(normaliseLineEndings)
    .catch(() => null);
}

async function staleGeneratedArtifacts(
  expected: readonly { readonly path: string; readonly content: string }[],
): Promise<readonly string[]> {
  const comparisons = await Promise.all(
    expected.map(async (artifact) => ({
      path: artifact.path,
      isStale: (await readNormalisedArtifact(artifact.path)) !== artifact.content,
    })),
  );
  return comparisons
    .filter((comparison) => comparison.isStale)
    .map((comparison) => comparison.path);
}

function supportingArtifacts(
  expected: RecomputedCurrentSource,
): readonly { readonly path: string; readonly content: string }[] {
  return [{ path: AUDIT_REPORT, content: expected.reportSerialised }];
}

async function publishRefresh(expected: RecomputedCurrentSource): Promise<void> {
  if (expected.anchorSerialised === null) {
    throw new Error('Anchor refresh produced no serialised anchor manifest');
  }
  await publishCurrentSourceArtifacts([
    { path: path.join(repoRoot, CURRENT_SOURCE_ANCHORS), content: expected.anchorSerialised },
    { path: path.join(repoRoot, CURRENT_SOURCE_ARTIFACT), content: expected.serialised },
    { path: path.join(repoRoot, AUDIT_REPORT), content: expected.reportSerialised },
  ]);
  writeLine(`validate-current-source: wrote ${CURRENT_SOURCE_ANCHORS}`);
  writeLine(`validate-current-source: wrote ${CURRENT_SOURCE_ARTIFACT}`);
}

async function publishTruthSet(expected: RecomputedCurrentSource): Promise<number> {
  const staleSupport = await staleGeneratedArtifacts(supportingArtifacts(expected));
  if (staleSupport.length > 0) {
    writeErrorLine(
      `validate-current-source: governed support is stale (${staleSupport.join(', ')}); ` +
        'run refresh-mcp-content-current-source-anchors and review the complete diff',
    );
    return 1;
  }
  await publishCurrentSourceArtifacts([
    { path: path.join(repoRoot, CURRENT_SOURCE_ARTIFACT), content: expected.serialised },
  ]);
  writeLine(`validate-current-source: wrote ${CURRENT_SOURCE_ARTIFACT}`);
  return 0;
}

async function validateGeneratedArtifacts(expected: RecomputedCurrentSource): Promise<number> {
  const stale = await staleGeneratedArtifacts([
    { path: CURRENT_SOURCE_ARTIFACT, content: expected.serialised },
    ...supportingArtifacts(expected),
  ]);
  if (stale.length > 0) {
    writeErrorLine(
      `validate-current-source: generated artifacts are missing or stale (${stale.join(', ')}); ` +
        'refresh anchors for governed-source changes, or use --write only to restore the truth set',
    );
    return 1;
  }
  writeLine(
    `validate-current-source: OK (${String(expected.itemCount)} current items accounted; HTTP registration root walked).`,
  );
  return 0;
}

async function main(): Promise<number> {
  const refreshAnchors = process.argv.includes('--refresh-anchors');
  const writeMode = process.argv.includes('--write') || refreshAnchors;
  const expected = await recomputeCurrentSource(repoRoot, refreshAnchors);
  if (refreshAnchors) {
    await publishRefresh(expected);
    return 0;
  }
  return writeMode ? publishTruthSet(expected) : validateGeneratedArtifacts(expected);
}

process.exitCode = await main().catch((error: unknown) => {
  writeErrorLine(
    `validate-current-source: ${error instanceof Error ? error.message : String(error)}`,
  );
  return 1;
});
