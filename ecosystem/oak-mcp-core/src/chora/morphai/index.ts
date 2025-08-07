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
 *
 * NOTE: Core patterns have been moved to @oaknational/mcp-moria for cross-repo alignment.
 * This module now re-exports from moria and adds any oak-mcp-core specific patterns.
 */

// Tool morphai - re-exported from moria
export type {
  ToolExecutor,
  ToolDefinition,
  Tool,
  ToolFactory,
  ToolRegistry,
  ToolValidator,
} from '@oaknational/mcp-moria';

// Handler morphai - local patterns specific to oak-mcp-core
// These extend beyond the basic Handler patterns in moria
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

// Registry morphai - local patterns specific to oak-mcp-core
// These patterns are more specialized than the base Registry in moria
export type {
  Registry,
  FactoryRegistry,
  HierarchicalRegistry,
  ObservableRegistry,
  RegistryObserver,
  FilteredRegistry,
  MetadataRegistry,
} from './registries/types.js';

// Also re-export base Registry and PluginRegistry from moria as aliases
export type { Registry as MoriaRegistry, PluginRegistry } from '@oaknational/mcp-moria';
