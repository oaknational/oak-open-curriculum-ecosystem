/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Tool descriptor contract used by all generated MCP tools.
 *
 * This contract intentionally avoids importing generated data.
 * All concrete tool descriptors are emitted under generated/data/tools
 * and must depend on this contract rather than the other way around.
 *
 * @remarks See .agent/directives-and-memory/schema-first-execution.md
 * for the schema-first execution directive that governs this file.
 */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { ZodSchema, ZodType, ZodTypeDef } from 'zod';

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
 * authentication requirements. Use the `type` field to narrow.
 */
export type SecurityScheme = NoAuthScheme | OAuth2Scheme;

export type StatusDiscriminant<T extends string> = T extends `${infer N extends number}` ? N : T;

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
  readonly toolZodSchema: ZodType<TArgs, ZodTypeDef, unknown>;
  readonly toolInputJsonSchema: {
    readonly type: 'object';
    readonly properties?: Record<string, unknown>;
    readonly required?: string[];
    readonly additionalProperties?: boolean;
  };
  readonly toolOutputJsonSchema: unknown;
  readonly zodOutputSchema: ZodSchema<TResult>;
  readonly describeToolArgs: () => string;
  readonly inputSchema: {
    readonly type: 'object';
    readonly properties?: Record<string, unknown>;
    readonly required?: string[];
    readonly additionalProperties?: boolean;
  };
  readonly toolMcpFlatInputSchema: ZodType<TFlatArgs, ZodTypeDef, unknown>;
  readonly transformFlatToNestedArgs: (flatArgs: TFlatArgs) => TArgs;
  readonly documentedStatuses: readonly TDocumentedStatus[];
  readonly securitySchemes?: readonly SecurityScheme[];
  readonly validateOutput: (value: unknown) =>
    | { readonly ok: true; readonly data: TResult; readonly status: TStatus }
    | {
        readonly ok: false;
        readonly message: string;
        readonly issues: readonly unknown[];
        readonly attemptedStatuses: readonly {
          readonly status: TStatus;
          readonly issues: readonly unknown[];
        }[];
      };
  readonly invoke: (client: TClient, args: TArgs) => TResult | Promise<TResult>;
}
