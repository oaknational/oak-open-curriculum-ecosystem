/**
 * The graph half of the install-time closure: which workspace packages the
 * bootstrap's own package reaches, and the order the closure's members build
 * in. Pure, and importing nothing from the workspace, for the reason
 * `install-time-closure.ts` gives.
 *
 * @packageDocumentation
 */

/**
 * The outcome every step of the closure's derivation returns:
 * `@oaknational/result`'s shape (ADR-088), declared locally. A value import of
 * that package would resolve to a dist a cold install has not written, and the
 * dependency-cruiser rule `no-bootstrap-to-workspace-packages` keeps every
 * workspace package out of the bootstrap's reach, type-only imports included.
 */
export type ClosureResult<T> =
  { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: string };

/** A workspace package as the graph sees it. */
export interface GraphNode {
  readonly name: string;
  /** The workspace package names its manifest declares, in any dependency field. */
  readonly workspaceDeps: readonly string[];
}

/**
 * Every package reachable from `rootName` over workspace edges, the root
 * included.
 *
 * @param rootName - The package the walk starts from.
 * @param nodes - Every workspace package, by name.
 * @returns The reached names, or an error naming a declared workspace
 * dependency that no workspace package names.
 */
export function reachableFrom(
  rootName: string,
  nodes: ReadonlyMap<string, GraphNode>,
): ClosureResult<ReadonlySet<string>> {
  const reached = new Set<string>([rootName]);
  const pending = [rootName];
  for (let name = pending.pop(); name !== undefined; name = pending.pop()) {
    for (const dep of nodes.get(name)?.workspaceDeps ?? []) {
      if (!nodes.has(dep)) {
        return {
          ok: false,
          error: `${name} declares workspace dependency ${dep}, which no workspace package names`,
        };
      }
      if (!reached.has(dep)) {
        reached.add(dep);
        pending.push(dep);
      }
    }
  }
  return { ok: true, value: reached };
}

/**
 * The members in build order: each builds after every member it reaches,
 * through any workspace package, with ties broken by name so the order never
 * depends on how the workspace was read. A member that reaches itself, through
 * members or not, sits on a cycle and has no build order, so the derivation is
 * refused, naming every member left unordered: the cycle's members and those
 * that wait on them. A cycle among packages that are not members builds
 * nothing, and pnpm allows one, so it is not refused.
 *
 * @param members - The closure's member names.
 * @param nodes - Every workspace package, by name.
 * @returns The members in build order, or an error naming the members that
 * could not be ordered.
 */
export function orderMembers(
  members: readonly string[],
  nodes: ReadonlyMap<string, GraphNode>,
): ClosureResult<readonly string[]> {
  const memberSet = new Set(members);
  const waitingOn = new Map(
    members.map((name) => [name, membersReachedFrom(name, memberSet, nodes)] as const),
  );
  const ordered: string[] = [];
  while (waitingOn.size > 0) {
    const next = [...waitingOn]
      .filter(([, deps]) => deps.size === 0)
      .map(([name]) => name)
      .sort(byCodeUnit)[0];
    if (next === undefined) {
      const unordered = [...waitingOn.keys()].sort(byCodeUnit).join(', ');
      return {
        ok: false,
        error: `a workspace dependency cycle leaves these install-time members unordered: ${unordered}`,
      };
    }
    ordered.push(next);
    waitingOn.delete(next);
    for (const deps of waitingOn.values()) {
      deps.delete(next);
    }
  }
  return { ok: true, value: ordered };
}

/**
 * UTF-16 code-unit order: the same on every machine, whatever its locale.
 *
 * @param left - One string.
 * @param right - The other.
 * @returns Negative, zero or positive, as `Array.prototype.sort` expects.
 */
export function byCodeUnit(left: string, right: string): number {
  if (left < right) {
    return -1;
  }
  return left > right ? 1 : 0;
}

/**
 * The members `start` reaches through any workspace package. `start` itself is
 * among them only when a path leads back to it, which is how a cycle shows.
 */
function membersReachedFrom(
  start: string,
  memberSet: ReadonlySet<string>,
  nodes: ReadonlyMap<string, GraphNode>,
): Set<string> {
  const found = new Set<string>();
  const seen = new Set<string>();
  const pending = [...(nodes.get(start)?.workspaceDeps ?? [])];
  for (let name = pending.pop(); name !== undefined; name = pending.pop()) {
    if (!seen.has(name)) {
      seen.add(name);
      if (memberSet.has(name)) {
        found.add(name);
      }
      pending.push(...(nodes.get(name)?.workspaceDeps ?? []));
    }
  }
  return found;
}
