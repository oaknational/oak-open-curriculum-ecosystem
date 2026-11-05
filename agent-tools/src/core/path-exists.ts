/**
 * The existence-probe seam for the agent-tooling git resolver.
 *
 * @remarks
 * Injecting the filesystem probe keeps `resolveTrustedGit`, and the callers that
 * pass a probe through to it, unit-testable without touching a real filesystem.
 *
 * @packageDocumentation
 */

/** Existence probe: whether `candidate` exists on disk. Injectable for testability. */
export type PathExists = (candidate: string) => boolean;
