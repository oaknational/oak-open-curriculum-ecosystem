/**
 * The existence-probe seam for the agent-tooling binary resolvers.
 *
 * @remarks
 * Injecting the filesystem probe keeps `resolveTrustedBinary`, the resolvers
 * built on it and the callers that pass a probe through to them unit-testable
 * without touching a real filesystem.
 *
 * @packageDocumentation
 */

/** Existence probe: whether `candidate` exists on disk. Injectable for testability. */
export type PathExists = (candidate: string) => boolean;
