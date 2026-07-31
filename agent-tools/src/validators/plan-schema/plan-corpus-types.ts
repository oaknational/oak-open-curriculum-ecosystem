/**
 * Shared corpus vocabulary for the plan-schema instruments: the parsed
 * plan file and the conformance-finding shape every rule module and
 * composition root speaks.
 *
 * @remarks
 * Homed here at the second consumer: the finding-mechanism modules
 * (`plan-execution-anchors.ts`, `plan-gate-drift.ts`) and the corpus
 * helpers all need these shapes, and leaving them in the helpers put a
 * cycle in the module graph. `plan-node-schema.ts` stays the public
 * contract transcription and deliberately knows nothing about file
 * paths.
 *
 * @packageDocumentation
 */

import { type PlanNode } from './plan-node-schema.js';

/** One plan file's conformance failure, path-anchored for the report. */
export interface PlanConformanceFailure {
  readonly path: string;
  readonly messages: readonly string[];
}

/** A parsed, file-level-valid plan awaiting corpus-level resolution. */
export interface ParsedPlanFile {
  readonly path: string;
  readonly node: PlanNode;
}

/**
 * The status partition every status-sensitive corpus rule shares:
 * `live` plans still demand and prove; `terminal` plans do neither.
 * Expressed as an exhaustive `Record` so adding a status to the schema
 * enum breaks the build here instead of silently classifying the new
 * status.
 */
export const PLAN_STATUS_PARTITION: Record<PlanNode['status'], 'live' | 'terminal'> = {
  sketch: 'live',
  ratified: 'live',
  archived: 'terminal',
  superseded: 'terminal',
};
