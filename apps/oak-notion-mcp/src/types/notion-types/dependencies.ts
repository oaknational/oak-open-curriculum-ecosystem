/**
 * Notion-specific dependencies for the phenotype
 */

import type { Logger } from '@oaknational/mcp-logger';

interface CoreRuntime {
  logger: {
    debug: (message: string, context?: unknown) => void;
    info: (message: string, context?: unknown) => void;
    warn: (message: string, context?: unknown) => void;
    error: (message: string, context?: unknown) => void;
  };
  clock: { now: () => number };
  storage: {
    get: (key: string) => Promise<string | null>;
    set: (key: string, value: string) => Promise<void>;
  };
}
import type { MinimalNotionClient } from './notion-client';
import type { NotionOperations } from '../notion-contracts/notion-operations';

/**
 * Core dependencies required by Notion MCP handlers
 */
export interface NotionDependencies {
  notionClient: MinimalNotionClient;
  logger: Logger;
  notionOperations: NotionOperations;
  runtime: CoreRuntime;
}

/**
 * Server dependencies including MCP server config
 */
export interface NotionServerDependencies extends NotionDependencies {
  config: {
    name: string;
    version: string;
  };
}
