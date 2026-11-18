/**
 * Derive the install-time build closure from the workspace manifests.
 *
 * The closure is every workspace package the bootstrap's own package reaches
 * over workspace edges (dependencies, devDependencies and peerDependencies,
 * followed transitively) whose entry points name built output under `dist/`:
 * nothing can import such a package on a cold checkout until it is built. The
 * members are ordered so each builds after the members it reaches, since a
 * package's own build (its `tsup.config.ts`) may import a sibling. The
 * bootstrap's own package is never a member; its compiler runs after the
 * closure.
 *
 * Rooted, not workspace-wide: a workspace-wide closure would build every
 * package with built entry points at install time, including product
 * libraries whose builds need generated code or a recipe the bootstrap does
 * not run. A member whose build script is not the one recipe the bootstrap
 * runs is refused by name rather than built wrongly.
 *
 * The list is computed, never kept: the hand-kept list it replaces missed the
 * ESLint plugin every lint config imports, so a worktree could not load its
 * lint config after `pnpm install` alone. Two cold-install failures came from
 * the same class in oaknational/oak-open-curriculum-ecosystem (PR #393,
 * 2026-07-16, and PR #836, 2026-08-09), and a third in the second estate's own
 * repository (2026-09-13), where this derivation was first written.
 *
 * This module runs before any workspace package is built, so it imports none
 * of them: the result shape is local (`ClosureResult`, ADR-088's shape), and
 * so is record iteration. Manifests arrive as `unknown` and are validated with
 * zod at the boundary (ADR-032), against the schema in
 * `install-time-manifest.ts`; the reader that walks the workspace is
 * `install-time-closure-io.ts`, and its output is passed in as data (ADR-078).
 *
 * @packageDocumentation
 */

import {
  type ClosureResult,
  type GraphNode,
  orderMembers,
  reachableFrom,
} from './install-time-closure-graph.js';
import {
  distArtifacts,
  type Manifest,
  ManifestSchema,
  type WorkspaceManifestInput,
  workspaceDependencies,
} from './install-time-manifest.js';

/** One closure member, with the files under `dist/` that witness a completed build. */
export interface InstallTimeDep {
  readonly dir: string;
  readonly name: string;
  /** Paths under `dist/` that the package's entry points name. */
  readonly distArtifacts: readonly string[];
}

/** The derivation's outcome: the members in build order, or the refusal. */
export type InstallTimeClosureVerdict = ClosureResult<readonly InstallTimeDep[]>;

/** Where the closure starts, and the one build recipe the bootstrap runs. */
export interface InstallTimeClosureOptions {
  /** Repo-relative directory of the package running the bootstrap. */
  readonly rootDir: string;
  /** The exact `scripts.build` every member must declare. */
  readonly buildRecipe: string;
}

interface IndexedPackage extends GraphNode {
  readonly dir: string;
  readonly manifest: Manifest;
}

/**
 * Compute the closure.
 *
 * @param inputs - Every workspace package's directory and parsed manifest.
 * @param options - The root package's directory and the build recipe.
 * @returns The members in build order, or an error naming the manifest,
 * dependency, member or cycle that stops the derivation.
 *
 * @example
 * ```ts
 * installTimeClosure(
 *   [
 *     { dir: 'agent-tools', manifest: { name: '@x/tools', dependencies: { '@x/result': 'workspace:*' } } },
 *     { dir: 'core/result', manifest: { name: '@x/result', exports: { '.': './dist/index.js' }, scripts: { build: recipe } } },
 *   ],
 *   { rootDir: 'agent-tools', buildRecipe: recipe },
 * );
 * // { ok: true, value: [{ dir: 'core/result', name: '@x/result', distArtifacts: ['index.js'] }] }
 * ```
 */
export function installTimeClosure(
  inputs: readonly WorkspaceManifestInput[],
  options: InstallTimeClosureOptions,
): InstallTimeClosureVerdict {
  const indexed = indexPackages(inputs);
  if (!indexed.ok) {
    return indexed;
  }
  const rootPackage = [...indexed.value.values()].find((entry) => entry.dir === options.rootDir);
  if (rootPackage === undefined) {
    return {
      ok: false,
      error: `no workspace package at ${options.rootDir}, the package running the bootstrap`,
    };
  }
  const reached = reachableFrom(rootPackage.name, indexed.value);
  if (!reached.ok) {
    return reached;
  }
  const members = classifyMembers(reached.value, rootPackage.name, indexed.value, options);
  if (!members.ok) {
    return members;
  }
  const order = orderMembers([...members.value.keys()], indexed.value);
  if (!order.ok) {
    return order;
  }
  return {
    ok: true,
    value: order.value.flatMap((name) => {
      const member = members.value.get(name);
      return member === undefined ? [] : [member];
    }),
  };
}

/** Validate every manifest and index the packages by name, refusing an unreadable or duplicate one. */
function indexPackages(
  inputs: readonly WorkspaceManifestInput[],
): ClosureResult<ReadonlyMap<string, IndexedPackage>> {
  const byName = new Map<string, IndexedPackage>();
  for (const input of inputs) {
    const result = ManifestSchema.safeParse(input.manifest);
    if (!result.success) {
      return {
        ok: false,
        error: `${input.dir}/package.json is not a readable manifest: ${result.error.message}`,
      };
    }
    const manifest = result.data;
    const clash = byName.get(manifest.name);
    if (clash !== undefined) {
      return {
        ok: false,
        error: `two workspace packages are named ${manifest.name}: ${clash.dir} and ${input.dir}`,
      };
    }
    byName.set(manifest.name, {
      name: manifest.name,
      dir: input.dir,
      workspaceDeps: workspaceDependencies(manifest),
      manifest,
    });
  }
  return { ok: true, value: byName };
}

/** The reached packages, other than the root, that the closure builds. */
function classifyMembers(
  reached: ReadonlySet<string>,
  rootName: string,
  byName: ReadonlyMap<string, IndexedPackage>,
  options: InstallTimeClosureOptions,
): ClosureResult<ReadonlyMap<string, InstallTimeDep>> {
  const members = new Map<string, InstallTimeDep>();
  for (const name of reached) {
    const entry = byName.get(name);
    if (entry !== undefined && name !== rootName) {
      const member = memberFor(entry, options.buildRecipe);
      if (!member.ok) {
        return member;
      }
      if (member.value !== undefined) {
        members.set(name, member.value);
      }
    }
  }
  return { ok: true, value: members };
}

/**
 * The package as a member when its entry points name a `dist/` file,
 * `undefined` when they name none, or a refusal when it is a member the
 * bootstrap's recipe cannot build.
 */
function memberFor(
  entry: IndexedPackage,
  buildRecipe: string,
): ClosureResult<InstallTimeDep | undefined> {
  const artifacts = distArtifacts(entry.manifest);
  if (artifacts.length === 0) {
    return { ok: true, value: undefined };
  }
  const build = entry.manifest.scripts?.build;
  if (build !== buildRecipe) {
    const declared = build === undefined ? 'missing' : `"${build}"`;
    return {
      ok: false,
      error:
        `${entry.name} (${entry.dir}) is an install-time member, but its build script is ` +
        `${declared}, not "${buildRecipe}"; the bootstrap can only run that recipe`,
    };
  }
  return { ok: true, value: { dir: entry.dir, name: entry.name, distArtifacts: artifacts } };
}
