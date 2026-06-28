/**
 * The existence-probe seam shared by the agent-tooling trusted-binary resolvers.
 *
 * @remarks
 * Injecting the filesystem probe keeps each resolver (`resolveTrustedGit`,
 * `resolveTrustedGh`, and the pnpm resolver) unit-testable without touching a real
 * filesystem. Hoisted to `core/` once a third independent consumer appeared
 * (git + pnpm + gh resolvers), per the consolidate-at-third-consumer discipline —
 * replacing three identical `(candidate: string) => boolean` declarations with
 * one shared type. A fourth same-shape declaration (`PathExistsCheck` in the
 * `pr-watch` lane) is the next consolidation target, deferred here as cross-lane
 * scope.
 *
 * @packageDocumentation
 */

/** Existence probe: whether `candidate` exists on disk. Injectable for testability. */
export type PathExists = (candidate: string) => boolean;
