import { describe, expect, it } from 'vitest';

import { toolMcpFlatInputSchema } from './types/generated/api-schema/mcp-tools/tools/get-keywords.js';

/**
 * MCP-487 — the flat MCP input schema normalises the REPRESENTATION of a
 * numeric parameter (a host whose bridge sends numbers as JSON strings) while
 * the CONSTRAINT stays exactly where the API puts it. Asserted against the
 * real generated schema, never the emitted string.
 */
describe('string-encoded numbers at the MCP boundary (MCP-487)', () => {
  it('accepts a plain decimal string as the number it names', () => {
    const parsed = toolMcpFlatInputSchema.parse({ limit: '25' });
    expect(parsed.limit).toBe(25);
  });

  it('accepts a JSON number unchanged', () => {
    const parsed = toolMcpFlatInputSchema.parse({ limit: 25 });
    expect(parsed.limit).toBe(25);
  });

  it('keeps the bound for a string over it', () => {
    expect(toolMcpFlatInputSchema.safeParse({ limit: '5000' }).success).toBe(false);
  });

  it('keeps the bound for a number over it', () => {
    expect(toolMcpFlatInputSchema.safeParse({ limit: 5000 }).success).toBe(false);
  });

  it.each([['abc'], [''], [' '], ['0x10'], ['Infinity']])(
    'refuses the non-decimal string %j',
    (value) => {
      expect(toolMcpFlatInputSchema.safeParse({ limit: value }).success).toBe(false);
    },
  );

  it.each([[null], [true], [[]]])('refuses the non-string non-number %j', (value) => {
    expect(toolMcpFlatInputSchema.safeParse({ limit: value }).success).toBe(false);
  });

  it('normalises offset the same way', () => {
    expect(toolMcpFlatInputSchema.parse({ offset: '40' }).offset).toBe(40);
  });

  it('leaves a digit string that overflows to a non-finite number as the string it was', () => {
    const result = toolMcpFlatInputSchema.safeParse({ limit: '9'.repeat(400) });
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error?.issues)).toContain('received string');
  });
});
