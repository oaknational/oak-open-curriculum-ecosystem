/**
 * Eidola (εἴδωλα) - Phantoms/simulacra used for testing
 *
 * Public API for test doubles and mocks
 */

// Factory functions for creating test doubles
export {
  createMockLogger,
  createMockServerConfig,
  createMockNotionOperations,
} from './factories.js';

// Notion object mocks
export {
  createMockPage,
  createMockDatabase,
  createMockPersonUser,
  createMockBotUser,
} from './notion-mocks.js';

// Notion API response mocks
export { createMockListUsersResponse, createMockSearchResponse } from './notion-api-mocks.js';
