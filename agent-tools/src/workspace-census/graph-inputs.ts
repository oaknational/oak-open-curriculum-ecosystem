/**
 * Dependency-graph detector facts: the estate's depcruise instrument
 * (source-level import edges) and the turbo task graph, both recomputed
 * live per the census plan's detector-facts mechanism — never inherited
 * from manifests alone. Pure parsing and aggregation are exported for
 * tests; the exec wrappers translate failures to Results at this
 * boundary.
 */
import { execFile } from 'node:child_process';
import { isBuiltin } from 'node:module';
import { promisify } from 'node:util';

import { err, ok, type Result } from '@oaknational/result';

import { getJsonValue, isJsonObject, parseJsonTextResult, type JsonObject } from '../core/json.js';
import { compareStrings } from './compare.js';
import type { CensusSubject } from './subjects.js';

const execFileAsync = promisify(execFile);

const GRAPH_BUFFER_BYTES = 256 * 1024 * 1024;

/** The depcruise roots the estate's own boundary gate cruises. */
const DEPCRUISE_ROOTS = ['apps', 'packages', 'agent-tools', 'demos'];

const TURBO_TASKS = ['build', 'lint', 'test', 'type-check'];

export interface DepcruiseModuleEdge {
  readonly source: string;
  readonly resolvedDependencies: readonly string[];
}

function resolvedDependenciesOf(module: JsonObject): string[] {
  const dependencies = getJsonValue(module, 'dependencies');
  const resolved: string[] = [];
  for (const dependency of Array.isArray(dependencies) ? Array.from(dependencies) : []) {
    if (!isJsonObject(dependency) || typeof getJsonValue(dependency, 'resolved') !== 'string') {
      continue;
    }
    // An unresolvable specifier arrives as its raw text (`vite/client`, a
    // fixture's dangling relative path) — unattributable to any subject,
    // so recording it would fabricate an edge via the root catch-all.
    if (getJsonValue(dependency, 'couldNotResolve') === true) {
      continue;
    }
    resolved.push(String(getJsonValue(dependency, 'resolved')));
  }
  return resolved;
}

/** Parse depcruise --output-type json into per-module resolved edges. */
export function parseDepcruiseModules(json: string): Result<DepcruiseModuleEdge[], string> {
  const parsed = parseJsonTextResult(json, 'depcruise output');
  if (!parsed.ok) {
    return err(parsed.error.message);
  }
  if (!isJsonObject(parsed.value)) {
    return err('depcruise output: not an object');
  }
  const modules = getJsonValue(parsed.value, 'modules');
  if (!Array.isArray(modules)) {
    return err('depcruise output: no modules[] array');
  }
  const edges: DepcruiseModuleEdge[] = [];
  for (const module of Array.from(modules)) {
    if (!isJsonObject(module) || typeof getJsonValue(module, 'source') !== 'string') {
      return err('depcruise output: module without a source path');
    }
    edges.push({
      source: String(getJsonValue(module, 'source')),
      resolvedDependencies: resolvedDependenciesOf(module),
    });
  }
  return ok(edges);
}

function subjectOf(filePath: string, byLengthDesc: readonly CensusSubject[]): string | null {
  const owner = byLengthDesc.find(
    (subject) =>
      subject.dirPath === '.' ||
      filePath === subject.dirPath ||
      filePath.startsWith(`${subject.dirPath}/`),
  );
  return owner?.dirPath ?? null;
}

/**
 * A resolved dependency that lives outside the repository's own tree:
 * an installed package, or a Node builtin (`fs`, `node:fs`) — which
 * reaches the aggregator unresolved and would otherwise be claimed by
 * the root subject's `.` catch-all in subjectOf.
 */
function isExternalDependency(resolved: string): boolean {
  return resolved.startsWith('node_modules/') || isBuiltin(resolved);
}

/**
 * Aggregate module edges to subject grain: for each subject, the sorted
 * set of OTHER subjects its modules import (node_modules edges carry no
 * subject and drop out naturally).
 */
export function aggregateSourceDependencies(
  subjects: readonly CensusSubject[],
  modules: readonly DepcruiseModuleEdge[],
): Map<string, string[]> {
  const byLengthDesc = [...subjects].sort((a, b) => b.dirPath.length - a.dirPath.length);
  const edges = new Map<string, Set<string>>(subjects.map((s) => [s.dirPath, new Set()]));
  for (const module of modules) {
    const from = subjectOf(module.source, byLengthDesc);
    if (from === null) {
      continue;
    }
    for (const resolved of module.resolvedDependencies) {
      if (isExternalDependency(resolved)) {
        continue;
      }
      const to = subjectOf(resolved, byLengthDesc);
      if (to !== null && to !== from) {
        edges.get(from)?.add(to);
      }
    }
  }
  return new Map(
    [...edges.entries()].map(([dirPath, set]) => [dirPath, [...set].sort(compareStrings)]),
  );
}

function collectTaskEntry(byPackage: Map<string, string[]>, task: unknown): string | null {
  if (!isJsonObject(task)) {
    return 'turbo dry-run output: task entry is not an object';
  }
  const packageName = getJsonValue(task, 'package');
  const taskName = getJsonValue(task, 'task');
  if (typeof packageName !== 'string' || typeof taskName !== 'string') {
    return 'turbo dry-run output: task without package/task fields';
  }
  if (packageName === '//') {
    return null;
  }
  const existing = byPackage.get(packageName) ?? [];
  existing.push(taskName);
  byPackage.set(packageName, existing);
  return null;
}

/** Parse turbo --dry=json into package-name → sorted task-name list. */
export function parseTurboTasks(json: string): Result<Map<string, string[]>, string> {
  const parsed = parseJsonTextResult(json, 'turbo dry-run output');
  if (!parsed.ok) {
    return err(parsed.error.message);
  }
  if (!isJsonObject(parsed.value)) {
    return err('turbo dry-run output: not an object');
  }
  const tasks = getJsonValue(parsed.value, 'tasks');
  if (!Array.isArray(tasks)) {
    return err('turbo dry-run output: no tasks[] array');
  }
  const byPackage = new Map<string, string[]>();
  for (const task of Array.from(tasks)) {
    const problem = collectTaskEntry(byPackage, task);
    if (problem !== null) {
      return err(problem);
    }
  }
  return ok(
    new Map(
      [...byPackage.entries()].map(([name, names]) => [name, [...names].sort(compareStrings)]),
    ),
  );
}

/** Run the estate's depcruise over the boundary-gate roots, JSON output. */
export async function runDepcruiseJson(repoRoot: string): Promise<Result<string, string>> {
  try {
    const { stdout } = await execFileAsync(
      'pnpm',
      ['exec', 'depcruise', ...DEPCRUISE_ROOTS, '--output-type', 'json'],
      { cwd: repoRoot, maxBuffer: GRAPH_BUFFER_BYTES },
    );
    return ok(stdout);
  } catch (error) {
    return err(`depcruise failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/** Run turbo dry over the canonical four tasks, JSON output. */
export async function runTurboDryJson(repoRoot: string): Promise<Result<string, string>> {
  try {
    const { stdout } = await execFileAsync(
      'pnpm',
      ['exec', 'turbo', 'run', ...TURBO_TASKS, '--dry=json'],
      { cwd: repoRoot, maxBuffer: GRAPH_BUFFER_BYTES },
    );
    return ok(stdout);
  } catch (error) {
    return err(
      `turbo --dry=json failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
