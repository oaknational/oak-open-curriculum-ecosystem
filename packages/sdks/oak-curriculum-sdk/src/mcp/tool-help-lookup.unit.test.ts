/**
 * Unit tests for tool-specific help lookup.
 *
 * These tests verify that removed tools (get-ontology, get-help) are
 * rejected by the help lookup, and that all current aggregated tools
 * have valid help entries.
 *
 * @remarks Module relocated from aggregated-help/help-content.ts in WS3.2.
 * Tool names are now derived from AGGREGATED_TOOL_DEFS (no manual list).
 */

import { describe, it, expect } from 'vitest';
import { getToolSpecificHelp } from './tool-help-lookup.js';
import { AGGREGATED_TOOL_DEFS } from './universal-tools/definitions.js';
import { typeSafeKeys } from '../types/helpers/type-helpers.js';

describe('getToolSpecificHelp rejects replaced tools', () => {
  it('returns error for get-ontology (replaced by get-curriculum-model)', () => {
    const result = getToolSpecificHelp('get-ontology');
    expect(result.isError).toBe(true);
  });

  it('returns error for get-help (replaced by get-curriculum-model)', () => {
    const result = getToolSpecificHelp('get-help');
    expect(result.isError).toBe(true);
  });
});

describe('getToolSpecificHelp for current aggregated tools (drift detection)', () => {
  const toolNames = typeSafeKeys(AGGREGATED_TOOL_DEFS);

  it.each(toolNames)('%s returns valid help (no error)', (name) => {
    const result = getToolSpecificHelp(name);
    expect(result.isError).toBeUndefined();
  });
});
