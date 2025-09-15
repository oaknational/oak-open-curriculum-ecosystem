/**
 * Test Setup for Oak Open Curriculum Semantic Search
 *
 * Configures the test environment for unit and integration tests.
 * No network calls or external dependencies should be used in tests.
 */

import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock environment variables for tests
process.env.ELASTICSEARCH_URL = 'https://test.elasticsearch.com';
process.env.ELASTICSEARCH_API_KEY = 'test-api-key';
process.env.OAK_API_KEY = 'test-oak-key';
process.env.SEARCH_API_KEY = 'test-search-key';
process.env.AI_PROVIDER = 'none';
