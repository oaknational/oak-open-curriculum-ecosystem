import { err, ok, type Result } from '@oaknational/result';
import { typeSafeEntries, typeSafeKeys } from '@oaknational/type-helpers';
import { parse as parseYaml } from 'yaml';

import { isJsonObject } from '../../core/json.js';

import {
  checkAggregates,
  checkSkeleton,
  compareScripts,
  drift,
  type Drift,
  type SkeletonReading,
} from './family-conformance-helpers.js';
import {
  FAMILY_HOOKS_REL_DIR,
  LIVE_HOOKS_REL_DIR,
  type FamilyManifest,
  type HostValues,
} from './family-conformance-manifest.js';

/**
 * Pure comparison helpers over the tree's files: hook bytes, the CI fan-in,
 * the compiler base flags, the formatter files and the package manager, and
 * the one composition that runs every comparison over a tree snapshot.
 *
 * @packageDocumentation
 */

/** The hook bodies read from both sides, by file name; absent files are absent keys. */
export interface HookBodies {
  readonly live: ReadonlyMap<string, Uint8Array>;
  readonly family: ReadonlyMap<string, Uint8Array>;
}

/** The root `package.json` fields the comparisons read. */
export interface RootPackage {
  readonly scripts: Readonly<Record<string, string>>;
  readonly packageManager: unknown;
}

/** Everything the validator reads from the live tree, as pure data. */
export interface TreeSnapshot {
  readonly rootPackage: RootPackage;
  readonly tsconfig: unknown;
  readonly workflowText: string | undefined;
  readonly hooks: HookBodies;
  readonly presentRootFiles: ReadonlySet<string>;
}

/** The whole reading: every drift, plus the slot contents for the OK line. */
export interface ConformanceReading {
  readonly drifts: readonly Drift[];
  readonly skeleton: SkeletonReading;
}

function bytesEqual(left: Uint8Array, right: Uint8Array): boolean {
  return left.byteLength === right.byteLength && left.every((byte, index) => byte === right[index]);
}

/** Every named hook must exist on both sides and be byte-identical. */
export function checkHooks(names: readonly string[], bodies: HookBodies): readonly Drift[] {
  const drifts: Drift[] = [];
  for (const name of names) {
    const family = bodies.family.get(name);
    const live = bodies.live.get(name);
    if (family === undefined) {
      drifts.push(drift('hook', `the family copy ${FAMILY_HOOKS_REL_DIR}/${name} is missing`));
    } else if (live === undefined) {
      drifts.push(drift('hook', `${LIVE_HOOKS_REL_DIR}/${name} is missing`));
    } else if (!bytesEqual(family, live)) {
      drifts.push(
        drift('hook', `${LIVE_HOOKS_REL_DIR}/${name} differs from ${FAMILY_HOOKS_REL_DIR}/${name}`),
      );
    }
  }
  return drifts;
}

function needsOf(value: unknown): readonly string[] {
  if (typeof value === 'string') {
    return [value];
  }
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === 'string');
  }
  return [];
}

/**
 * The PR-gating workflow must hold the fan-in job, and that job's `needs`
 * must list every other job: a job outside the fan-in is a gate that cannot
 * block a merge.
 */
export function checkCiFanIn(
  ci: FamilyManifest['ci'],
  workflowText: string | undefined,
): readonly Drift[] {
  if (workflowText === undefined) {
    return [drift('ci', `${ci.workflow} is missing`)];
  }
  const workflow: unknown = parseYaml(workflowText);
  if (!isJsonObject(workflow) || !isJsonObject(workflow.jobs)) {
    return [drift('ci', `${ci.workflow} has no jobs map`)];
  }
  const jobs = workflow.jobs;
  const fanIn = jobs[ci.fan_in_job];
  if (!isJsonObject(fanIn)) {
    return [drift('ci', `${ci.workflow} has no job \`${ci.fan_in_job}\``)];
  }
  const needs = new Set(needsOf(fanIn.needs));
  const drifts = typeSafeKeys(jobs)
    .filter((job) => job !== ci.fan_in_job && !needs.has(job))
    .map((job) => drift('ci', `${ci.workflow} job \`${ci.fan_in_job}\` does not need \`${job}\``));
  // Fail-closed: without `if: always()` GitHub skips the fan-in whenever a
  // prerequisite fails, so the required context never reports the failure.
  if (fanIn.if !== 'always()') {
    const found = fanIn.if === undefined ? 'no condition' : `\`if: ${String(fanIn.if)}\``;
    drifts.push(
      drift(
        'ci',
        `${ci.workflow} job \`${ci.fan_in_job}\` must run under \`if: always()\` so a failed prerequisite still reports; found ${found}`,
      ),
    );
  }
  return drifts;
}

/** Every declared compiler flag must be present in `compilerOptions` with its value. */
export function checkCompilerFlags(
  flags: FamilyManifest['compiler_base_flags'],
  tsconfig: unknown,
): readonly Drift[] {
  if (!isJsonObject(tsconfig) || !isJsonObject(tsconfig.compilerOptions)) {
    return [drift('compiler', 'tsconfig.base.json has no compilerOptions')];
  }
  const options = tsconfig.compilerOptions;
  return typeSafeEntries(flags).flatMap(([flag, expected]) => {
    const actual = options[flag];
    return actual === expected
      ? []
      : [
          drift(
            'compiler',
            `tsconfig.base.json compilerOptions.${flag} is ${JSON.stringify(actual)}; the family requires ${JSON.stringify(expected)}`,
          ),
        ];
  });
}

/** The one formatter configuration is present at the root and no forbidden file is. */
export function checkFormatter(
  formatter: FamilyManifest['formatter'],
  presentRootFiles: ReadonlySet<string>,
): readonly Drift[] {
  const drifts: Drift[] = [];
  if (!presentRootFiles.has(formatter.config_file)) {
    drifts.push(drift('formatter', `${formatter.config_file} is missing at the root`));
  }
  for (const forbidden of formatter.forbidden) {
    if (presentRootFiles.has(forbidden)) {
      drifts.push(
        drift(
          'formatter',
          `${forbidden} is present at the root; the family's one formatter configuration is ${formatter.config_file}`,
        ),
      );
    }
  }
  return drifts;
}

/**
 * The root `package.json` fields the comparisons read: the scripts map (string
 * bodies only) and the `packageManager` field as written.
 *
 * @param document - The parsed root `package.json`.
 * @returns The fields, or an error when the document carries no scripts map.
 */
export function readRootPackage(document: unknown): Result<RootPackage, Error> {
  if (!isJsonObject(document) || !isJsonObject(document.scripts)) {
    return err(new Error('package.json has no scripts map'));
  }
  const scripts: Record<string, string> = {};
  for (const [name, body] of typeSafeEntries(document.scripts)) {
    if (typeof body === 'string') {
      scripts[name] = body;
    }
  }
  return ok({ scripts, packageManager: document.packageManager });
}

const PACKAGE_MANAGER_PATTERN = /^([a-z][a-z0-9-]*)@(\d+)\./;

/** The `packageManager` field names the family's manager at the family's major. */
export function checkPackageManager(
  declared: FamilyManifest['package_manager'],
  packageManagerField: unknown,
): readonly Drift[] {
  if (typeof packageManagerField !== 'string') {
    return [drift('package-manager', 'root package.json has no packageManager string')];
  }
  const match = PACKAGE_MANAGER_PATTERN.exec(packageManagerField);
  const name = match?.[1];
  const major = match?.[2];
  if (name === undefined || major === undefined) {
    return [
      drift(
        'package-manager',
        `root package.json packageManager \`${packageManagerField}\` is not <name>@<major>.<minor>.<patch>`,
      ),
    ];
  }
  if (name !== declared.name || Number(major) !== declared.major) {
    return [
      drift(
        'package-manager',
        `root package.json packageManager is \`${packageManagerField}\`; the family requires ${declared.name}@${String(declared.major)}.x`,
      ),
    ];
  }
  return [];
}

/** Run every comparison over one tree snapshot. */
export function computeDrifts(
  manifest: FamilyManifest,
  host: HostValues,
  tree: TreeSnapshot,
): ConformanceReading {
  const scripts = tree.rootPackage.scripts;
  const skeleton = checkSkeleton(manifest.check, host, scripts['check']);
  const drifts = [
    ...compareScripts(manifest.scripts, host, scripts),
    ...skeleton.drifts,
    ...checkAggregates(manifest.aggregates, host, scripts),
    ...checkHooks(manifest.hooks, tree.hooks),
    ...checkCiFanIn(manifest.ci, tree.workflowText),
    ...checkCompilerFlags(manifest.compiler_base_flags, tree.tsconfig),
    ...checkFormatter(manifest.formatter, tree.presentRootFiles),
    ...checkPackageManager(manifest.package_manager, tree.rootPackage.packageManager),
  ];
  return { drifts, skeleton };
}
