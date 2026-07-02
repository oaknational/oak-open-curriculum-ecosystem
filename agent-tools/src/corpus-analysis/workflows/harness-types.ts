/**
 * The harness Workflow sandbox contract — types for the injected globals.
 *
 * @remarks
 * The harness executes a workflow artefact inside a sandbox that provides four callable
 * globals (`agent`, `parallel`, `phase`, `log`) and forbids everything else: no module
 * system (no `import`/`require`), no filesystem or Node API, and no non-deterministic
 * sources (`Date.now`, argless `new Date`, `Math.random` all throw — they would break
 * harness resume). The artefact must begin with `export const meta = {...}` (parsed
 * statically) and yield its result via a top-level `return` (legal because the harness
 * wraps the body in an AsyncFunction). Per-run data does not arrive at runtime: it is
 * inlined at build time via the seeded run-data module (see `run-data.ts`).
 *
 * Stage entries reference the globals as free identifiers, typed by module-local
 * `declare const` lines against these shared types — the single place the sandbox
 * call-shapes are defined. The build's output contract (`build/output-contract.ts`)
 * machine-enforces the sandbox rules on every emitted artefact.
 *
 * @packageDocumentation
 */

import type { DerivedJsonSchema } from './agent-schemas.js';

/** Options for one sandbox `agent()` dispatch; `T` is the schema's output shape. */
export interface HarnessAgentOptions<T = unknown> {
  /** Display label for the harness progress tree. */
  readonly label: string;
  /** Progress group — must match a `phases[].title` in the workflow meta. */
  readonly phase: string;
  /** Model tier for this agent call. */
  readonly model: 'haiku' | 'sonnet' | 'opus' | 'fable';
  /** Reasoning effort for this agent call. */
  readonly effort: 'low' | 'medium' | 'high';
  /**
   * Custom subagent type from the agent registry (`.claude/agents/`). The type's
   * `tools` frontmatter is a harness-enforced allow-list — the deterministic way to
   * constrain a dispatched agent's tool surface. Composes with `schema` (the harness
   * appends the structured-output instruction to the custom agent's system prompt).
   */
  readonly agentType?: string;
  /** JSON Schema the agent's structured output is validated against by the harness. */
  readonly schema: DerivedJsonSchema<T>;
}

/**
 * Spawn one subagent. Returns the schema-validated structured output, or `null` when
 * the agent dies terminally (retry-cap, quota) — callers must treat `null` as a
 * first-class unadjudicated outcome, never filter it away positionally.
 */
export type HarnessAgent = <T>(prompt: string, opts: HarnessAgentOptions<T>) => Promise<T | null>;

/**
 * Run thunks concurrently. Returns results in input order, substituting `null` for any
 * thunk that throws — a transparent positional contract (`runCapped` preserves it).
 */
export type HarnessParallel = <T>(
  thunks: readonly (() => Promise<T>)[],
) => Promise<readonly (T | null)[]>;

/** Start a named progress phase; subsequent agent calls group under it. */
export type HarnessPhase = (title: string) => void;

/** Emit a progress line to the harness narrator. */
export type HarnessLog = (message: string) => void;
