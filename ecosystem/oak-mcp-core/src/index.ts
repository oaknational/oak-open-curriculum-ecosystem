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

// New error framework exports
export {
  ChainedError,
  Result,
  ErrorContextManager,
  getDefaultErrorContextManager,
  createContextStorage,
  getErrorContextStorage,
  registerContextStorageFactory,
} from './chora/aither/errors/index.js';
export type {
  ResultType,
  ValidationResult,
  ErrorContext as AitherErrorContext,
  ContextStorage,
} from './chora/aither/errors/index.js';

// Phaneron exports - manifest world layer (configuration)
export { createMcpServerInfo, env } from './chora/phaneron/index.js';
export { getString, getBoolean, getNumber, getLogLevel, getEnum } from './chora/phaneron/index.js';
// Environment loading
export {
  ensureEnvironmentLoaded,
  loadEnvironmentIfAvailable,
  loadDotenvIfNeeded,
} from './chora/phaneron/config/env-loader.js';
// Runtime detection
export {
  detectRuntimeFeatures,
  getRuntimeFeatures,
  canAccessFilesystem,
  canAccessEnvVars,
} from './chora/phaneron/runtime-detection/features.js';
export type {
  Environment,
  ServerConfig,
  McpServerInfo,
  BaseEnvironment,
} from './chora/phaneron/index.js';
export type { RuntimeFeatures } from './chora/phaneron/runtime-detection/features.js';

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

// Re-export selected utilities from Moria for convenience
// These are pure abstractions with zero dependencies
export {
  // Result utilities for functional error handling
  Ok as MoriaOk,
  Err as MoriaErr,
  isOk as isMoriaOk,
  isErr as isMoriaErr,
  // Validation utilities
  isString,
  isNumber,
  isBoolean,
  isArray,
  isObject,
  isDefined,
  isNonNullable,
  // Parsing utilities
  parseJSON,
  parseNumber,
  parseBoolean,
  parseDate,
  parseURL,
  parseEmail,
  // Transform utilities
  mapObject,
  filterObject,
  pickKeys,
  omitKeys,
  deepClone,
  deepMerge,
  pipe,
  compose,
  memoize,
  debounce,
  throttle,
} from '@oaknational/mcp-moria';

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
