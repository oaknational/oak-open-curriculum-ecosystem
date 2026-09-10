/**
 * Unit tests for generateRootIndexFile — the public mcp-tools barrel.
 *
 * The barrel is the only import home consumers have, so every type that
 * appears in a public result shape must be exported here. PaginationEcho
 * is part of ToolResultForName (PR 949 review finding: it was reachable
 * only from an internal module).
 */

import { describe, it, expect } from 'vitest';
import { generateRootIndexFile } from './generate-index-file.js';

describe('generateRootIndexFile', () => {
  it('exports every contract type that appears in public result shapes', () => {
    const generated = generateRootIndexFile();
    expect(generated).toContain(
      'export { type ToolDescriptor, type InvokeResult, type PaginationEcho, DOCUMENTED_ERROR_PREFIX } from "./contract/tool-descriptor.contract.js";',
    );
  });
});
