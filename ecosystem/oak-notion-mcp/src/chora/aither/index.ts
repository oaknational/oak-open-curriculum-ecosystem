/**
 * Aither layer exports for oak-notion-mcp phenotype
 *
 * This contains runtime-specific implementations
 * that extend the genotype's abstract patterns.
 */

// Node.js-specific context storage
export {
  AsyncLocalStorageAdapter,
  createNodeContextStorage,
  initializeNodeContextStorage,
} from './context-storage-node.js';
