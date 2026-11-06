#!/usr/bin/env node
import { err, ok, type Result } from '@oaknational/result';
import { typeSafeKeys } from '@oaknational/type-helpers';

import { resolveRepoRoot } from '../../core/repo-root.js';
import { writeErrorLine, writeLine } from '../../core/terminal-output.js';

import {
  compileFamilySchemas,
  FAMILY_CONFORMANCE_SCHEMA_REL_PATH,
  FAMILY_MANIFEST_REL_PATH,
  FAMILY_NAME,
  HOST_VALUES_REL_PATH,
  validateWithSchema,
  type FamilyManifest,
  type HostValues,
} from './family-conformance-manifest.js';
import { computeDrifts, type ConformanceReading } from './family-conformance-tree-helpers.js';
import { readJsonFile, readTree } from './family-conformance-tree-reader.js';

/**
 * Standalone validator asserting this repository conforms to its tooling
 * family's declared Practice operations: the family conformance check, the
 * instrument of the Practice's family layer (PDR-143). The manifest at
 * `.agent/family/<family>/practice-operations.json` declares the root
 * scripts, the `check` skeleton and its two host slots, the family prefix
 * of each aggregate, the hook bodies, the CI fan-in, the compiler base
 * flags, the formatter and the package manager; every item is recomputed
 * from the live tree at every run (validators must recompute, never just
 * record) with the host's placeholder values read from
 * `.agent/family/host.json`. Exit 1 names every drift; exit 2 means an
 * input could not be read or a declaration failed its schema.
 *
 * @packageDocumentation
 */

const repoRoot = resolveRepoRoot(import.meta.url);

interface Declarations {
  readonly manifest: FamilyManifest;
  readonly host: HostValues;
}

async function loadDeclarations(): Promise<Result<Declarations, Error>> {
  const [schemaDocument, manifestDocument, hostDocument] = await Promise.all([
    readJsonFile(repoRoot, FAMILY_CONFORMANCE_SCHEMA_REL_PATH),
    readJsonFile(repoRoot, FAMILY_MANIFEST_REL_PATH),
    readJsonFile(repoRoot, HOST_VALUES_REL_PATH),
  ]);
  if (!schemaDocument.ok) {
    return schemaDocument;
  }
  if (!manifestDocument.ok) {
    return manifestDocument;
  }
  if (!hostDocument.ok) {
    return hostDocument;
  }
  const validators = compileFamilySchemas(schemaDocument.value);
  if (!validators.ok) {
    return validators;
  }
  const manifest = validateWithSchema(
    validators.value.manifest,
    manifestDocument.value,
    FAMILY_MANIFEST_REL_PATH,
  );
  if (!manifest.ok) {
    return manifest;
  }
  const host = validateWithSchema(validators.value.host, hostDocument.value, HOST_VALUES_REL_PATH);
  if (!host.ok) {
    return host;
  }
  if (manifest.value.family !== FAMILY_NAME) {
    return err(
      new Error(
        `${FAMILY_MANIFEST_REL_PATH} declares family \`${manifest.value.family}\`; this validator belongs to \`${FAMILY_NAME}\``,
      ),
    );
  }
  return ok({ manifest: manifest.value, host: host.value });
}

function formatSlot(legs: readonly string[]): string {
  return legs.length === 0 ? 'empty' : legs.join(' && ');
}

function reportOk(manifest: FamilyManifest, reading: ConformanceReading): void {
  const counts =
    `${String(typeSafeKeys(manifest.scripts).length)} scripts, ` +
    `${String(typeSafeKeys(manifest.aggregates).length)} aggregates, ` +
    `${String(manifest.hooks.length)} hooks, the CI fan-in, ` +
    `${String(typeSafeKeys(manifest.compiler_base_flags).length)} compiler flags, ` +
    `the formatter and ${manifest.package_manager.name}@${String(manifest.package_manager.major)}`;
  writeLine(
    `validate-family-conformance: OK (${FAMILY_NAME} family: ${counts}; ` +
      `check slot before build: ${formatSlot(reading.skeleton.slotBeforeBuild)}; ` +
      `slot after tests: ${formatSlot(reading.skeleton.slotAfterTests)})`,
  );
}

async function main(): Promise<void> {
  const declarations = await loadDeclarations();
  if (!declarations.ok) {
    writeErrorLine(`validate-family-conformance: ${declarations.error.message}`);
    process.exit(2);
  }
  const tree = await readTree(repoRoot, declarations.value.manifest);
  if (!tree.ok) {
    writeErrorLine(`validate-family-conformance: ${tree.error.message}`);
    process.exit(2);
  }
  const reading = computeDrifts(declarations.value.manifest, declarations.value.host, tree.value);
  if (reading.drifts.length === 0) {
    reportOk(declarations.value.manifest, reading);
    return;
  }
  const formatted = reading.drifts.map((entry) => `  [${entry.area}] ${entry.message}`).join('\n');
  writeErrorLine(
    `validate-family-conformance: ${String(reading.drifts.length)} drift(s) from the ` +
      `${FAMILY_NAME} family manifest (${FAMILY_MANIFEST_REL_PATH}).\n\n${formatted}\n\n` +
      `Every repository of the family carries the same Practice operations. Align the tree with ` +
      `the manifest, or change the manifest in every repository of the family together.`,
  );
  process.exit(1);
}

await main();
