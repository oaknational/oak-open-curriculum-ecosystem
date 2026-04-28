/**
 * Operations module public API
 * Provides extraction and generation for path operations
 */

export {
  extractPathOperations,
  extractUniqueMethods,
  type ExtractedOperation,
  type ExtractedParameter,
} from './operation-extraction.js';

export {
  generatePathOperationsConstant,
  generateOperationsByIdConstant,
  generateOperationConstants,
} from './operation-generators.js';
