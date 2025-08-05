/**
 * @fileoverview Morphai (μορφαί) - The hidden forms
 * @module morphai
 *
 * Morphai are the Platonic ideals, the abstract patterns that organs instantiate.
 * They exist in the genotype as perfect forms, while organs are their shadows
 * cast in the phenomenal world.
 *
 * Like the forms in Plato's cave allegory, morphai are the true reality
 * that organs imperfectly reflect. They define not what organs are,
 * but what organs aspire to be.
 */

// Tool morphai - the forms of tool creation
export type {
  ToolExecutor,
  ToolDefinition,
  Tool,
  ToolFactory,
  ToolRegistry,
  ToolValidator,
} from './tools/types.js';

// Handler morphai - the forms of request handling
export type {
  RequestHandler,
  ResourceHandler,
  HandlerChain,
  Middleware,
  HandlerFactory,
  HandlerLifecycle,
} from './handlers/types.js';

// Error morphai - the forms of error handling
export type {
  ErrorHandler,
  ErrorContext,
  ErrorTransformer,
  ErrorRecovery,
  RetryStrategy,
  CircuitBreaker,
  ErrorAggregator,
} from './errors/types.js';

// Registry morphai - the forms of collection management
export type {
  Registry,
  FactoryRegistry,
  HierarchicalRegistry,
  ObservableRegistry,
  RegistryObserver,
  FilteredRegistry,
  MetadataRegistry,
} from './registries/types.js';
