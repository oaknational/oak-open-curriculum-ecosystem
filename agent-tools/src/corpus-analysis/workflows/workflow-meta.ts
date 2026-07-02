/**
 * The harness Workflow `meta` contract.
 *
 * @remarks
 * Every harness workflow artefact must begin with `export const meta = {...}` where the
 * value is a pure literal the harness parses statically (no imports, no computed values).
 * Each stage declares its meta in a dedicated `<stage>.meta.ts` module whose ONLY import
 * is this type (type-only, erased at compile time), so the build's harness emitter can
 * serialise the literal verbatim without the stage bundle ever containing a `meta`
 * binding to collide with.
 *
 * @packageDocumentation
 */

/** One phase entry shown in the harness progress display. */
interface WorkflowMetaPhase {
  /** Phase title — must match the `phase(...)` calls in the stage orchestration. */
  readonly title: string;
  /** One-line description of what the phase does. */
  readonly detail: string;
}

/** The static workflow descriptor the harness reads before executing the script body. */
export interface WorkflowMeta {
  /** Workflow name (kebab-case, stable across runs). */
  readonly name: string;
  /** One-line description shown in the harness permission dialog. */
  readonly description: string;
  /** Ordered phase descriptors; one per `phase(...)` call. */
  readonly phases: readonly WorkflowMetaPhase[];
}
