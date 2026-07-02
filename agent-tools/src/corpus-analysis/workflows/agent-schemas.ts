/**
 * Agent-call contracts for the corpus-analysis workflow stages.
 *
 * @remarks
 * Each stage's `agent()` call constrains the model's output with a JSON Schema. Those
 * schemas are DERIVED here from the zod SSOT (`judgment-schemas.ts` /
 * `recall-schemas.ts`) and inlined into the sandbox artefacts at build time by the
 * workflow build — zod never enters the bundle, and the shape an agent is asked to emit
 * cannot drift from the shape the Node-side boundary re-parses with.
 *
 * The derived schemas must be fully inlined (`$ref`/`$defs` hoisting would not survive
 * the harness `agent()` schema parameter) — {@link deriveAgentJsonSchemas} enforces that
 * invariant at derivation time, and the unit tests pin the exact required/enum shapes.
 *
 * @packageDocumentation
 */

import { z } from 'zod';
import type { JSONSchema } from 'zod/v4/core';

import { adversaryVerdictSchema, candidateSchema, leafSignalSchema } from '../judgment-schemas.js';
import { metaOutputSchema, type MetaOutput } from '../recall-schemas.js';

/**
 * MAP stage agent contract: the window's extracted leaves.
 */
const leafStageOutputSchema = z.strictObject({
  leaves: z.array(leafSignalSchema),
});
export type LeafStageOutput = z.infer<typeof leafStageOutputSchema>;

/**
 * REDUCE stage agent contract: the clustered candidates.
 */
const candidateStageOutputSchema = z.strictObject({
  candidates: z.array(candidateSchema),
});
export type CandidateStageOutput = z.infer<typeof candidateStageOutputSchema>;

/**
 * VALIDATE stage agent contract: one adversary voter's judgment. The `lens` is the
 * orchestrator's dispatch bookkeeping — the voter never emits it, so it is omitted from
 * the agent-facing contract and attached by the workflow after the call.
 */
const voterJudgmentSchema = adversaryVerdictSchema.omit({ lens: true });
export type VoterJudgment = z.infer<typeof voterJudgmentSchema>;

/**
 * A derived, fully-inlined JSON Schema ready for the harness `agent()` schema param,
 * phantom-typed with the output shape it validates: `agent()` infers its return type
 * FROM the schema, so a schema/type mismatch at a call site is uncompilable rather
 * than an unproven claim. The `_output` property never exists at runtime.
 */
export interface DerivedJsonSchema<T = unknown> extends JSONSchema.BaseSchema {
  readonly _output?: T;
}

/** The four stage agent schemas, keyed by stage contract. */
export interface AgentJsonSchemas {
  readonly leafStage: DerivedJsonSchema<LeafStageOutput>;
  readonly candidateStage: DerivedJsonSchema<CandidateStageOutput>;
  readonly voterJudgment: DerivedJsonSchema<VoterJudgment>;
  readonly metaStage: DerivedJsonSchema<MetaOutput>;
}

/**
 * Derive one schema with everything inlined (`reused: 'inline'` — no `$defs`/`$ref`,
 * which the harness cannot resolve) and the `$schema` dialect marker stripped. The
 * fully-inlined and strict-everywhere invariants are pinned by the unit tests. The
 * phantom output type carries the zod schema's output shape into the harness call.
 */
function deriveInlined<T>(schema: z.ZodType<T>): DerivedJsonSchema<T> {
  const derived = { ...z.toJSONSchema(schema, { reused: 'inline' }) };
  delete derived.$schema;
  return derived;
}

/**
 * Derive the four stage agent schemas from the zod SSOT: `$schema` stripped, everything
 * inlined, strict objects preserved. Runs at build time (and in tests) — never in the
 * sandbox.
 */
export function deriveAgentJsonSchemas(): AgentJsonSchemas {
  return {
    leafStage: deriveInlined(leafStageOutputSchema),
    candidateStage: deriveInlined(candidateStageOutputSchema),
    voterJudgment: deriveInlined(voterJudgmentSchema),
    metaStage: deriveInlined(metaOutputSchema),
  };
}

/**
 * The derived stage agent schemas, as stage entries import them. Under Node this is the
 * live derivation; in a sandbox bundle the build's schema-inline plugin substitutes this
 * module with a precomputed literal of the same export — same SSOT, zod-free artefact.
 */
export const AGENT_JSON_SCHEMAS: AgentJsonSchemas = deriveAgentJsonSchemas();
