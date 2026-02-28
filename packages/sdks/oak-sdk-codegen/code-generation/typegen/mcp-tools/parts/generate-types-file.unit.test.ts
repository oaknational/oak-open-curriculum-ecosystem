/**
 * Unit tests for generateTypesFile.
 *
 * Tests the generator's string output (behaviour) and includes a compile-time
 * anchor that verifies the generated type resolves correctly via `satisfies`.
 */

import { describe, it, expect } from 'vitest';
import { generateTypesFile } from './generate-types-file.js';
import type { ToolArgsForName } from '../../../../src/types/generated/api-schema/mcp-tools/aliases/types.js';

/**
 * Compile-time anchor: fails `pnpm type-check` if `ToolArgsForName` derives
 * from the nested SDK type instead of the flat MCP input schema.
 *
 * Nested requires `{ params: { path: { sequence: string } } }`.
 * Flat requires `{ sequence: string }`.
 *
 * If this line compiles, the type derivation is correct.
 */
const FLAT_ARGS_ANCHOR = { sequence: 'test' } satisfies ToolArgsForName<'get-sequences-assets'>;

describe('generateTypesFile', () => {
  it('derives ToolArgsMap from the flat input schema', () => {
    const generated = generateTypesFile();
    expect(generated).toContain(
      "Parameters<ToolDescriptorMap[TName]['transformFlatToNestedArgs']>[0]",
    );
  });

  it('does not derive ToolArgsMap from nested invoke parameters', () => {
    const generated = generateTypesFile();
    expect(generated).not.toContain('ToolInvokeParametersMap[TName][1]');
  });

  it('compile-time anchor is consumed', () => {
    expect(FLAT_ARGS_ANCHOR.sequence).toBe('test');
  });
});
