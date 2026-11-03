import fs from 'node:fs/promises';
import path from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { failureAsError } from '../../core/failure-as-error.js';
import { parseJsonTextResult } from '../../core/json.js';

import {
  FAMILY_HOOKS_REL_DIR,
  LIVE_HOOKS_REL_DIR,
  type FamilyManifest,
} from './family-conformance-manifest.js';
import {
  classifyOptionalReadFailure,
  collectPresentRootFiles,
  type RootFilePresence,
} from './family-conformance-optional-reads.js';
import { readRootPackage, type TreeSnapshot } from './family-conformance-tree-helpers.js';

/**
 * The validator's reads of the live tree, as one snapshot of pure data for
 * the comparisons. Every optional read (the CI workflow, a hook body on
 * either side, a root formatter file) treats `ENOENT` alone as absence; any
 * other failure is an input the validator could not read and ends the
 * snapshot as its input error, so a permission refusal never reads as a
 * missing file or an ordinary drift.
 *
 * @packageDocumentation
 */

const ROOT_PACKAGE_REL_PATH = 'package.json';
const TSCONFIG_BASE_REL_PATH = 'tsconfig.base.json';

/** A required JSON document at a repository-relative path, parsed. */
export async function readJsonFile(
  repoRoot: string,
  relPath: string,
): Promise<Result<unknown, Error>> {
  let text: string;
  try {
    text = await fs.readFile(path.join(repoRoot, relPath), 'utf8');
  } catch (failure) {
    const reason = failureAsError(failure, `reading ${relPath}`).message;
    return err(new Error(`${relPath} is unreadable: ${reason}`));
  }
  return parseJsonTextResult(text, relPath);
}

async function readOptionalBytes(
  repoRoot: string,
  relPath: string,
): Promise<Result<Uint8Array | undefined, Error>> {
  try {
    return ok(new Uint8Array(await fs.readFile(path.join(repoRoot, relPath))));
  } catch (failure) {
    const absence = classifyOptionalReadFailure(relPath, failure);
    return absence.ok ? ok(undefined) : absence;
  }
}

async function readOptionalText(
  repoRoot: string,
  relPath: string,
): Promise<Result<string | undefined, Error>> {
  const bytes = await readOptionalBytes(repoRoot, relPath);
  if (!bytes.ok) {
    return bytes;
  }
  return ok(bytes.value === undefined ? undefined : new TextDecoder().decode(bytes.value));
}

async function readHookBodies(
  repoRoot: string,
  relDir: string,
  names: readonly string[],
): Promise<Result<ReadonlyMap<string, Uint8Array>, Error>> {
  const bodies = new Map<string, Uint8Array>();
  const readings = await Promise.all(
    names.map(
      async (name) => [name, await readOptionalBytes(repoRoot, `${relDir}/${name}`)] as const,
    ),
  );
  for (const [name, reading] of readings) {
    if (!reading.ok) {
      return reading;
    }
    if (reading.value !== undefined) {
      bodies.set(name, reading.value);
    }
  }
  return ok(bodies);
}

async function presentRootFiles(
  repoRoot: string,
  names: readonly string[],
): Promise<Result<ReadonlySet<string>, Error>> {
  const readings = await Promise.all(
    names.map(async (name): Promise<RootFilePresence> => {
      try {
        await fs.access(path.join(repoRoot, name));
        return ok('present');
      } catch (failure) {
        return classifyOptionalReadFailure(name, failure);
      }
    }),
  );
  return collectPresentRootFiles(names, readings);
}

/** The whole tree snapshot the manifest's comparisons need, or the first input that could not be read. */
export async function readTree(
  repoRoot: string,
  manifest: FamilyManifest,
): Promise<Result<TreeSnapshot, Error>> {
  const rootFileNames = [manifest.formatter.config_file, ...manifest.formatter.forbidden];
  const [packageDocument, tsconfig, workflowText, liveHooks, familyHooks, present] =
    await Promise.all([
      readJsonFile(repoRoot, ROOT_PACKAGE_REL_PATH),
      readJsonFile(repoRoot, TSCONFIG_BASE_REL_PATH),
      readOptionalText(repoRoot, manifest.ci.workflow),
      readHookBodies(repoRoot, LIVE_HOOKS_REL_DIR, manifest.hooks),
      readHookBodies(repoRoot, FAMILY_HOOKS_REL_DIR, manifest.hooks),
      presentRootFiles(repoRoot, rootFileNames),
    ]);
  if (!packageDocument.ok) {
    return packageDocument;
  }
  if (!tsconfig.ok) {
    return tsconfig;
  }
  if (!workflowText.ok) {
    return workflowText;
  }
  if (!liveHooks.ok) {
    return liveHooks;
  }
  if (!familyHooks.ok) {
    return familyHooks;
  }
  if (!present.ok) {
    return present;
  }
  const rootPackage = readRootPackage(packageDocument.value);
  if (!rootPackage.ok) {
    return rootPackage;
  }
  return ok({
    rootPackage: rootPackage.value,
    tsconfig: tsconfig.value,
    workflowText: workflowText.value,
    hooks: { live: liveHooks.value, family: familyHooks.value },
    presentRootFiles: present.value,
  });
}
