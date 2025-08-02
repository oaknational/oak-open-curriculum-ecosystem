import { describe, it, expect } from 'vitest';
import {
  transformNotionPageToMcpResource,
  transformNotionDatabaseToMcpResource,
  transformNotionUserToMcpResource,
  extractTextFromNotionBlocks,
  formatNotionRichText,
} from './transformers.js';

// Re-export tests from individual test files
describe('transformers module exports', () => {
  it('should export all transformer functions', () => {
    expect(transformNotionPageToMcpResource).toBeDefined();
    expect(transformNotionDatabaseToMcpResource).toBeDefined();
    expect(transformNotionUserToMcpResource).toBeDefined();
    expect(extractTextFromNotionBlocks).toBeDefined();
    expect(formatNotionRichText).toBeDefined();
  });
});
