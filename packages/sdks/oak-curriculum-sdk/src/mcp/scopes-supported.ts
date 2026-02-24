/**
 * OAuth scopes supported by this MCP server.
 *
 * Re-exports SCOPES_SUPPORTED from the generated constants file,
 * providing a stable import path for hand-written aggregated tool
 * definitions. If the generated file layout changes, only this
 * re-export needs updating.
 *
 * Source of truth: `type-gen/mcp-security-policy.ts`
 */

export { SCOPES_SUPPORTED } from '@oaknational/curriculum-sdk-generation/mcp-tools';
