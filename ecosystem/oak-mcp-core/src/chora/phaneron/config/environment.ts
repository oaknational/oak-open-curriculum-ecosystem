/**
 * @fileoverview Generic MCP server configuration
 * @module @oaknational/mcp-core
 */

export interface ServerConfig {
  name: string;
  version: string;
}

export interface McpServerInfo {
  name: string;
  version: string;
}

export function createMcpServerInfo(config: ServerConfig): McpServerInfo {
  return {
    name: config.name,
    version: config.version,
  };
}
