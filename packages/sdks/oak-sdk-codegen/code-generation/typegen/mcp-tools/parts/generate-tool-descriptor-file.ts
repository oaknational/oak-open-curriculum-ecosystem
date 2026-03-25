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
 * @remarks See .agent/directives/schema-first-execution.md
 * for the schema-first execution directive that governs this file.
 */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { ZodType, core } from 'zod';

/**
 * MCP security scheme types.
 *
 * These types define the security metadata emitted in tool descriptors
 * and consumed by runtime authorization logic.
 *
 * @remarks
 * Security schemes determine whether a tool requires OAuth authentication:
 * - NoAuthScheme: Tool is publicly accessible
 * - OAuth2Scheme: Tool requires OAuth 2.1 authentication
 */

/**
 * Union of supported security scheme type literals.
 */
export type SecuritySchemeType = 'noauth' | 'oauth2';

/**
 * No authentication required.
 *
 * Tools with this scheme can be called without a Bearer token.
 * Typically used for public metadata or discovery endpoints.
 */
export interface NoAuthScheme {
  readonly type: 'noauth';
}

/**
 * OAuth 2.1 authentication required.
 *
 * Tools with this scheme require a valid OAuth 2.1 Bearer token.
 * Scopes define the required permissions.
 */
export interface OAuth2Scheme {
  readonly type: 'oauth2';
  readonly scopes?: readonly string[];
}

/**
 * Union of all supported security schemes.
 *
 * This discriminated union allows type-safe handling of different
 * authentication requirements. Use the \`type\` field to narrow.
 */
export type SecurityScheme = NoAuthScheme | OAuth2Scheme;

export type StatusDiscriminant<T extends string> = T extends \`\${infer N extends number}\` ? N : T;

/**
 * Return shape of the generated invoke method.
 *
 * Preserves the HTTP status alongside the response payload so that
 * consumers can distinguish error statuses (400/401/404) even when
 * the response body validates against multiple documented schemas.
 */
export interface InvokeResult {
  readonly httpStatus: number;
  readonly payload: unknown;
}

/**
 * Shared prefix for the TypeError thrown by generated executors when the
 * upstream API returns a documented error HTTP status (>= 400).
 *
 * Both the generated \`invokeToolByName\` (producer) and the authored
 * \`mapErrorToResult\` (consumer) reference this constant to maintain
 * a single source of truth for the cross-layer contract.
 */
export const DOCUMENTED_ERROR_PREFIX = 'Documented error response: ';

export interface ToolDescriptor<
  TName extends string,
  TClient,
  TArgs,
  TFlatArgs,
  TResult,
  TDocumentedStatus extends string,
  TStatus extends number | string = StatusDiscriminant<TDocumentedStatus>,
> extends Tool {
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
  /**
   * MCP tool annotations providing hints about tool behavior.
   *
   * All Oak curriculum tools are read-only GET operations, so:
   * - readOnlyHint: true (no state modification)
   * - destructiveHint: false (no destructive operations)
   * - idempotentHint: true (GET is idempotent)
   * - openWorldHint: false (fixed curriculum data only)
   * - title: human-readable tool name
   */
  readonly annotations?: {
    readonly readOnlyHint?: boolean;
    readonly destructiveHint?: boolean;
    readonly idempotentHint?: boolean;
    readonly openWorldHint?: boolean;
    readonly title?: string;
  };
  /**
   * OpenAI Apps SDK metadata for tool descriptors.
   *
   * These fields are used by ChatGPT to display status during tool invocation
   * and to render output using a custom widget.
   *
   * @see https://developers.openai.com/apps-sdk/reference
   */
  readonly _meta?: {
    /** URI of widget resource to render tool output */
    readonly 'openai/outputTemplate'?: string;
    /** Status text shown while tool is running (max 64 characters) */
    readonly 'openai/toolInvocation/invoking'?: string;
    /** Status text shown after tool completes (max 64 characters) */
    readonly 'openai/toolInvocation/invoked'?: string;
    /** Allow widget to call this tool via window.openai.callTool() */
    readonly 'openai/widgetAccessible'?: boolean;
    /** Tool visibility: 'public' (default) or 'private' (hidden from model) */
    readonly 'openai/visibility'?: 'public' | 'private';
    /** Mirror securitySchemes for clients that only read _meta */
    readonly securitySchemes?: readonly SecurityScheme[];
  };
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
