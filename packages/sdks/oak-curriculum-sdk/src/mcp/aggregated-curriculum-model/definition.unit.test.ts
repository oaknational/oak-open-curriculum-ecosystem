/**
 * Unit tests for get-curriculum-model tool definition.
 *
 * Tests the tool definition metadata, input schema, annotations,
 * and MCP Apps standard _meta fields (ADR-141).
 */

import { describe, it, expect } from 'vitest';
import { typeSafeKeys } from '@oaknational/type-helpers';
import {
  GET_CURRICULUM_MODEL_TOOL_DEF,
  GET_CURRICULUM_MODEL_FLAT_ZOD_SCHEMA,
} from './definition.js';

describe('GET_CURRICULUM_MODEL_TOOL_DEF', () => {
  it('has description explaining its purpose', () => {
    expect(GET_CURRICULUM_MODEL_TOOL_DEF.description).toContain('curriculum');
  });

  it('has readOnlyHint annotation set to true', () => {
    expect(GET_CURRICULUM_MODEL_TOOL_DEF.annotations.readOnlyHint).toBe(true);
  });

  it('has destructiveHint annotation set to false', () => {
    expect(GET_CURRICULUM_MODEL_TOOL_DEF.annotations.destructiveHint).toBe(false);
  });

  it('has idempotentHint annotation set to true', () => {
    expect(GET_CURRICULUM_MODEL_TOOL_DEF.annotations.idempotentHint).toBe(true);
  });

  it('has openWorldHint annotation set to false', () => {
    expect(GET_CURRICULUM_MODEL_TOOL_DEF.annotations.openWorldHint).toBe(false);
  });

  it('has title annotation', () => {
    expect(GET_CURRICULUM_MODEL_TOOL_DEF.annotations.title).toBeDefined();
    expect(typeof GET_CURRICULUM_MODEL_TOOL_DEF.annotations.title).toBe('string');
  });
});

describe('GET_CURRICULUM_MODEL_FLAT_ZOD_SCHEMA', () => {
  it('takes no parameters (empty schema)', () => {
    expect(typeSafeKeys(GET_CURRICULUM_MODEL_FLAT_ZOD_SCHEMA)).toHaveLength(0);
  });
});
