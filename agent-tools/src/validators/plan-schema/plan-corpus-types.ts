/**
 * Shared corpus vocabulary for the plan-schema instruments: the parsed
 * plan file and the conformance-finding shape every rule module and
 * composition root speaks.
 *
 * @remarks
 * Homed apart from the corpus helpers so the rule modules and the
 * composition root share these shapes without a cycle in the module
 * graph. `plan-node-schema.ts` stays the public
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
