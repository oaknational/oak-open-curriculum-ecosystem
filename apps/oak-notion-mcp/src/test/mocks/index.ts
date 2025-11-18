/**
 * @fileoverview Test mocks - Simple test forms
 * @module test/mocks
 *
 * Keep it simple. Only export the basic Notion object mocks.
 * Tests should create their own mocks inline for clarity.
 */

// Export Notion object mocks - simple test forms
export {
  createMockPage,
  createMockDatabase,
  createMockPersonUser,
  createMockBotUser,
} from './notion-mocks';

// Export API response mocks - simulated external responses
export { createMockListUsersResponse, createMockSearchResponse } from './notion-api-mocks';

// Export mock Notion client for E2E testing
export { createMockNotionClientForE2E } from './mock-notion-client';

// Export runtime mocks
export { createMockRuntime } from './runtime-mocks';
