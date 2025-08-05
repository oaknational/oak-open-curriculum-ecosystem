/**
 * @oaknational/mcp-core - The MCP genotype
 *
 * This is the genetic blueprint that all MCP organisms inherit.
 * It provides the fundamental chorai (pervasive infrastructure layers)
 * that define the potential for all MCP phenotypes.
 */

// Aither exports - atmosphere layer (utilities)
export { scrubEmail, scrubSensitiveData } from './chora/aither/index.js';
export { createConsoleLogger, getLogLevelValue } from './chora/aither/logging/index.js';
export type { Logger, LogLevel } from './chora/aither/logging/index.js';

// Phaneron exports - manifest world layer (configuration)
export { createMcpServerInfo, env } from './chora/phaneron/index.js';
export { getString, getBoolean, getNumber, getLogLevel, getEnum } from './chora/phaneron/index.js';
export type {
  Environment,
  ServerConfig,
  McpServerInfo,
  BaseEnvironment,
} from './chora/phaneron/index.js';

// Stroma exports - types and contracts
export type {
  CoreDependencies,
  ServerDependencies,
  GenericDataClient,
  GenericOperations,
} from './chora/stroma/types/index.js';

// Stroma contracts exports
export type { EventBus } from './chora/stroma/contracts/index.js';

// Note: Eidola (test utilities) are intentionally not exported from the main package
// They should only be imported directly in test files when needed

// Morphai exports - abstract patterns (the hidden forms)
export type {
  // Tool morphai
  ToolExecutor,
  ToolDefinition,
  Tool,
  ToolFactory,
  ToolRegistry,
  ToolValidator,
  // Handler morphai
  RequestHandler,
  ResourceHandler,
  HandlerChain,
  Middleware,
  HandlerFactory,
  HandlerLifecycle,
  // Error morphai
  ErrorHandler,
  ErrorContext,
  ErrorTransformer,
  ErrorRecovery,
  RetryStrategy,
  CircuitBreaker,
  ErrorAggregator,
  // Registry morphai
  Registry,
  FactoryRegistry,
  HierarchicalRegistry,
  ObservableRegistry,
  RegistryObserver,
  FilteredRegistry,
  MetadataRegistry,
} from './chora/morphai/index.js';
