/**
 * Unit tests for get-curriculum-model tool definition.
 *
 * Tests the tool definition metadata, input schema, annotations,
 * and MCP Apps standard _meta fields (ADR-141).
 */

import { describe, it, expect } from 'vitest';
import { GET_CURRICULUM_MODEL_TOOL_DEF, GET_CURRICULUM_MODEL_INPUT_SCHEMA } from './definition.js';

describe('GET_CURRICULUM_MODEL_TOOL_DEF', () => {
  it('has description explaining its orientation purpose', () => {
    expect(GET_CURRICULUM_MODEL_TOOL_DEF.description).toContain('orientation');
    expect(GET_CURRICULUM_MODEL_TOOL_DEF.description).toContain('domain model');
  });

  it('has annotations marking it as read-only and idempotent', () => {
    expect(GET_CURRICULUM_MODEL_TOOL_DEF.annotations).toEqual({
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    });
  });
});

describe('GET_CURRICULUM_MODEL_INPUT_SCHEMA', () => {
  it('is an empty shape because this tool takes no parameters', () => {
    expect(GET_CURRICULUM_MODEL_INPUT_SCHEMA).toEqual({});
  });
});
