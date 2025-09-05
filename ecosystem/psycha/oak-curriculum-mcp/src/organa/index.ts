/**
 * Organa layer membrane - public interface
 * Exports all organ factories
 */

// Updated re-exports after mechanical renaming: tools module lives under src/tools
export { createMcpOrgan } from '../tools/index.js';
export type { McpOrgan } from '../tools/index.js';
