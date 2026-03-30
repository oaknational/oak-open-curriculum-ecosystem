/**
 * Per-request MCP server + transport contract.
 *
 * Defines the minimal interfaces consumed by `createMcpHandler` for the
 * per-request lifecycle: connect, handle, close. Product code depends on
 * these narrow interfaces (not the full SDK classes) so that test fakes
 * satisfy the types structurally without assertions (ADR-078).
 *
 * The real `McpServer` and `StreamableHTTPServerTransport` both satisfy
 * these interfaces structurally — the factory in `application.ts` creates
 * real SDK objects and returns them through this contract.
 *
 * @see ADR-112 Per-Request MCP Transport
 * @see ADR-078 Dependency Injection for Testability
 */

/**
 * Minimal transport contract for per-request lifecycle.
 *
 * Uses broad parameter types so that both the real SDK transport (which
 * expects `IncomingMessage` + `ServerResponse`) and test fakes (which pass
 * plain objects) satisfy the interface via contravariance.
 */
export interface McpRequestTransport {
  handleRequest(req: unknown, res: unknown, parsedBody?: unknown): Promise<void>;
  close(): Promise<void>;
}

/**
 * Minimal server contract for per-request lifecycle.
 * Covers `connect` and `close` — the only methods `createMcpHandler` calls.
 */
export interface McpRequestServer {
  connect(transport: { close(): Promise<void> }): Promise<void>;
  close(): Promise<void>;
}

/** Per-request MCP server + transport pair. @see ADR-112 */
export interface McpRequestContext {
  readonly server: McpRequestServer;
  readonly transport: McpRequestTransport;
}

/** Factory creating a fresh McpServer + transport per request (stateless mode). */
export type McpServerFactory = () => McpRequestContext;
