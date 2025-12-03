/**
 * Type definitions for tool usage guidance data.
 *
 * These types define the structure of server-level "how to use these tools"
 * documentation, separate from the curriculum ontology (domain model).
 *
 * @remarks Type hierarchy:
 * - ToolName: Generated from OpenAPI spec (type-gen output)
 * - AggregatedToolName: Hand-written tool names (runtime, will move to type-gen)
 * - AllToolName: Union of both
 */

import type { ToolName } from '../types/generated/api-schema/mcp-tools/index.js';

/**
 * Aggregated tool names (hand-written tools, not from OpenAPI spec).
 *
 * These tools combine multiple API calls into a single operation.
 * They're currently defined in runtime but will move to type-gen time.
 */
export type AggregatedToolName =
  | 'search'
  | 'fetch'
  | 'get-ontology'
  | 'get-help'
  | 'get-knowledge-graph';

/**
 * All available tool names combining generated and aggregated tools.
 */
export type AllToolName = ToolName | AggregatedToolName;

/**
 * Tool category describing a group of related tools.
 */
export interface ToolCategory {
  /** Tool names in this category */
  readonly tools: readonly AllToolName[];
  /** Brief description of what this category is for */
  readonly description: string;
  /** When to use tools in this category */
  readonly whenToUse: string;
  /** Whether this category is for agent context/support tools (not user-facing search) */
  readonly isAgentSupport?: boolean;
}

/**
 * Workflow step describing a single action in a multi-step workflow.
 */
export interface WorkflowStep {
  /** Step number (1-based) */
  readonly step: number;
  /** Description of what to do */
  readonly action: string;
  /** Tool to use for this step (typed to ensure valid tool names) */
  readonly tool?: AllToolName;
  /** Example parameters (as string for display) */
  readonly example?: string;
  /** What this step returns (helps agent understand data flow) */
  readonly returns?: string;
  /** Additional notes */
  readonly note?: string;
}

/**
 * Workflow describing a common multi-step task.
 */
export interface Workflow {
  /** Human-readable workflow title */
  readonly title: string;
  /** Brief description of what this workflow accomplishes */
  readonly description: string;
  /** Ordered steps to complete the workflow */
  readonly steps: readonly WorkflowStep[];
}

/**
 * ID format description for the fetch tool.
 */
export interface IdFormat {
  /** Prefix used to identify entity type (e.g., "lesson:") */
  readonly prefix: string;
  /** Example ID with prefix */
  readonly example: string;
  /** Description of what this format fetches */
  readonly description: string;
}
