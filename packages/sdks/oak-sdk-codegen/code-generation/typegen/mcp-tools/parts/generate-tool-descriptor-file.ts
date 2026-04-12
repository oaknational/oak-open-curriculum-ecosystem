export function generateToolDescriptorFile(): string {
  return `/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Tool descriptor contract used by all generated MCP tools.
 *
 * This contract intentionally avoids importing generated data.
 * All concrete tool descriptors are emitted under mcp-tools/tools
 * and must depend on this contract rather than the other way around.
 *
 * Non-API-derived types (SecurityScheme, SourceAttribution, ToolAnnotations,
 * ToolMeta, StatusDiscriminant, InvokeResult, DOCUMENTED_ERROR_PREFIX) are
 * imported from the hand-authored mcp-protocol-types module rather than
 * duplicated here. See src/types/mcp-protocol-types.ts for definitions.
 *
 * @remarks See .agent/directives/schema-first-execution.md
 * for the schema-first execution directive that governs this file.
 */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { ZodType, core } from 'zod';
import type {
  SecurityScheme,
  SourceAttribution,
  ToolAnnotations,
  ToolMeta,
  StatusDiscriminant,
  InvokeResult,
} from '../../../../mcp-protocol-types.js';
import { DOCUMENTED_ERROR_PREFIX } from '../../../../mcp-protocol-types.js';

export { DOCUMENTED_ERROR_PREFIX };
export type { SecurityScheme, SourceAttribution, ToolAnnotations, ToolMeta, StatusDiscriminant, InvokeResult };

export interface ToolDescriptor<
  TName extends string,
  TClient,
  TArgs,
  TFlatArgs,
  TResult,
  TDocumentedStatus extends string,
  TStatus extends number | string = StatusDiscriminant<TDocumentedStatus>,
> extends Omit<Tool, '_meta'> {
  readonly name: TName;
  readonly description?: string;
  readonly operationId: string;
  readonly path: string;
  readonly method: string;
  readonly toolZodSchema: ZodType<TArgs>;
  readonly toolInputJsonSchema: {
    readonly type: 'object';
    readonly properties?: { readonly [key: string]: object };
    readonly required?: string[];
    readonly additionalProperties?: boolean;
  };
  /** JSON Schema object describing the tool's output shape; varies by tool so typed broadly. */
  readonly toolOutputJsonSchema: unknown;
  readonly zodOutputSchema: ZodType<TResult>;
  readonly describeToolArgs: () => string;
  readonly inputSchema: {
    readonly type: 'object';
    readonly properties?: { readonly [key: string]: object };
    readonly required?: string[];
    readonly additionalProperties?: boolean;
  };
  readonly toolMcpFlatInputSchema: ZodType<TFlatArgs>;
  readonly transformFlatToNestedArgs: (flatArgs: TFlatArgs) => TArgs;
  readonly documentedStatuses: readonly TDocumentedStatus[];
  readonly securitySchemes?: readonly SecurityScheme[];
  /**
   * Indicates whether the tool benefits from domain context grounding.
   *
   * When true, the model should ideally call get-curriculum-model
   * before using this tool to understand the Oak curriculum structure.
   *
   * Curriculum content tools (require auth) have this set to true.
   * Utility tools (noauth) like get-rate-limit have this set to false.
   */
  readonly requiresDomainContext: boolean;
  readonly annotations?: ToolAnnotations;
  readonly _meta: ToolMeta;
  readonly validateOutput: (value: unknown) =>
    | { readonly ok: true; readonly data: TResult; readonly status: TStatus }
    | {
        readonly ok: false;
        readonly message: string;
        readonly issues: readonly core.$ZodIssue[];
        readonly attemptedStatuses: readonly {
          readonly status: TStatus;
          readonly issues: readonly core.$ZodIssue[];
        }[];
      };
  readonly invoke: (client: TClient, args: TArgs) => InvokeResult | Promise<InvokeResult>;
}
`;
}
