/**
 * Determines if an MCP method is a discovery method.
 *
 * Discovery methods provide metadata about the server and its tools.
 * Per OpenAI ChatGPT requirements, these must work without authentication
 * to allow tool discovery before OAuth flow initiates.
 *
 * Discovery methods:
 * - `initialize`: Server capability negotiation
 * - `tools/list`: Tool catalog discovery
 *
 * All other methods (including `tools/call`) are considered execution
 * methods and require authentication checks.
 *
 * **Architectural Note**: This function classifies MCP protocol methods,
 * which are defined by the MCP specification, NOT our OpenAPI schema.
 * This is a runtime constant, not generated code. Tool security metadata
 * (which IS schema-derived) flows from generated descriptors.
 *
 * @param method - MCP method name (e.g., 'tools/list', 'tools/call')
 * @returns true if method is discovery (no auth), false otherwise
 *
 * @example
 * ```typescript
 * isDiscoveryMethod('initialize')   // => true
 * isDiscoveryMethod('tools/list')   // => true
 * isDiscoveryMethod('tools/call')   // => false
 * isDiscoveryMethod('unknown')      // => false (safe default)
 * ```
 *
 * @see {@link https://platform.openai.com/docs/guides/apps-authentication|OpenAI Apps Authentication}
 * @see Sub-Phase 2.4 for middleware integration
 * @public
 */
export function isDiscoveryMethod(method: string): boolean {
  return method === 'initialize' || method === 'tools/list';
}
