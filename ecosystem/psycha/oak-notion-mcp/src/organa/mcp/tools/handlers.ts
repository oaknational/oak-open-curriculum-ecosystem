/**
 * Tool handlers using Dependency Inversion Principle
 * Assembles tools from clean abstractions
 */

import type { NotionDependencies } from '../../../chorai/stroma/notion-types/dependencies';
import type { McpTool } from '../types';
import {
  createToolFactory,
  createErrorHandler,
  createToolRegistry,
  type ToolRegistry,
} from './core/index';
import {
  searchToolDefinition,
  listDatabasesToolDefinition,
  queryDatabaseToolDefinition,
  getPageToolDefinition,
  listUsersToolDefinition,
} from './definitions/index';
import {
  createSearchExecutor,
  createListDatabasesExecutor,
  createQueryDatabaseExecutor,
  createGetPageExecutor,
  createListUsersExecutor,
} from './notion-operations/index';

/**
 * Tool handlers interface
 * Provides access to individual tools and collection
 */
interface ToolHandlers extends Record<string, McpTool | (() => McpTool[])> {
  'notion-search': McpTool;
  'notion-list-databases': McpTool;
  'notion-query-database': McpTool;
  'notion-get-page': McpTool;
  'notion-list-users': McpTool;
  getTools: () => McpTool[];
}

/**
 * Creates tool handlers using dependency injection
 * Assembles tools from definitions and executors
 */
export function createToolHandlers(deps: NotionDependencies): ToolHandlers {
  // Create shared infrastructure
  const toolFactory = createToolFactory();
  const errorHandler = createErrorHandler(deps.logger);
  const registry = createToolRegistry();

  // Create and register tools
  const tools = createAndRegisterTools(deps, toolFactory, errorHandler, registry);

  // Return handlers interface
  return {
    'notion-search': tools.search,
    'notion-list-databases': tools.listDatabases,
    'notion-query-database': tools.queryDatabase,
    'notion-get-page': tools.getPage,
    'notion-list-users': tools.listUsers,
    getTools: () => registry.getAll(),
  };
}

/**
 * Create all executors with dependencies
 */
function createExecutors(deps: NotionDependencies) {
  const executorDeps = {
    notionClient: deps.notionClient,
    logger: deps.logger,
    notionOperations: deps.notionOperations,
  };

  return {
    searchExecutor: createSearchExecutor(executorDeps),
    listDatabasesExecutor: createListDatabasesExecutor(executorDeps),
    queryDatabaseExecutor: createQueryDatabaseExecutor(executorDeps),
    getPageExecutor: createGetPageExecutor(executorDeps),
    listUsersExecutor: createListUsersExecutor(executorDeps),
  };
}

/**
 * Creates and registers all tools
 * Separates tool creation from handler interface
 */
function createAndRegisterTools(
  deps: NotionDependencies,
  toolFactory: ReturnType<typeof createToolFactory>,
  errorHandler: ReturnType<typeof createErrorHandler>,
  registry: ToolRegistry,
) {
  // Create executors
  const executors = createExecutors(deps);

  // Create tools from definitions and executors
  const search = toolFactory(searchToolDefinition, executors.searchExecutor, errorHandler);
  const listDatabases = toolFactory(
    listDatabasesToolDefinition,
    executors.listDatabasesExecutor,
    errorHandler,
  );
  const queryDatabase = toolFactory(
    queryDatabaseToolDefinition,
    executors.queryDatabaseExecutor,
    errorHandler,
  );
  const getPage = toolFactory(getPageToolDefinition, executors.getPageExecutor, errorHandler);
  const listUsers = toolFactory(listUsersToolDefinition, executors.listUsersExecutor, errorHandler);

  // Register all tools
  registry.register(search);
  registry.register(listDatabases);
  registry.register(queryDatabase);
  registry.register(getPage);
  registry.register(listUsers);

  return {
    search,
    listDatabases,
    queryDatabase,
    getPage,
    listUsers,
  };
}

// Export individual tool creators for backward compatibility with tests
export function createNotionSearchTool(deps: NotionDependencies): McpTool {
  const toolFactory = createToolFactory();
  const errorHandler = createErrorHandler(deps.logger);
  const executor = createSearchExecutor({
    notionClient: deps.notionClient,
    logger: deps.logger,
    notionOperations: deps.notionOperations,
  });

  return toolFactory(searchToolDefinition, executor, errorHandler);
}

export function createNotionListDatabasesTool(deps: NotionDependencies): McpTool {
  const toolFactory = createToolFactory();
  const errorHandler = createErrorHandler(deps.logger);
  const executor = createListDatabasesExecutor({
    notionClient: deps.notionClient,
    logger: deps.logger,
    notionOperations: deps.notionOperations,
  });

  return toolFactory(listDatabasesToolDefinition, executor, errorHandler);
}

export function createNotionQueryDatabaseTool(deps: NotionDependencies): McpTool {
  const toolFactory = createToolFactory();
  const errorHandler = createErrorHandler(deps.logger);
  const executor = createQueryDatabaseExecutor({
    notionClient: deps.notionClient,
    logger: deps.logger,
    notionOperations: deps.notionOperations,
  });

  return toolFactory(queryDatabaseToolDefinition, executor, errorHandler);
}

export function createNotionGetPageTool(deps: NotionDependencies): McpTool {
  const toolFactory = createToolFactory();
  const errorHandler = createErrorHandler(deps.logger);
  const executor = createGetPageExecutor({
    notionClient: deps.notionClient,
    logger: deps.logger,
    notionOperations: deps.notionOperations,
  });

  return toolFactory(getPageToolDefinition, executor, errorHandler);
}

export function createNotionListUsersTool(deps: NotionDependencies): McpTool {
  const toolFactory = createToolFactory();
  const errorHandler = createErrorHandler(deps.logger);
  const executor = createListUsersExecutor({
    notionClient: deps.notionClient,
    logger: deps.logger,
    notionOperations: deps.notionOperations,
  });

  return toolFactory(listUsersToolDefinition, executor, errorHandler);
}
