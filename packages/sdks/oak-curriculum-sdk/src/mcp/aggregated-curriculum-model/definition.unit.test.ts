/**
 * Unit tests for get-curriculum-model tool definition.
 *
 * Tests the tool definition metadata, input schema, annotations,
 * and MCP Apps standard _meta fields (ADR-141).
 */

import { describe, it, expect } from 'vitest';
import { GET_CURRICULUM_MODEL_TOOL_DEF, GET_CURRICULUM_MODEL_INPUT_SCHEMA } from './definition.js';
import { WIDGET_URI } from '@oaknational/sdk-codegen/widget-constants';

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

  it('has _meta.ui.resourceUri pointing to widget', () => {
    expect(GET_CURRICULUM_MODEL_TOOL_DEF._meta.ui.resourceUri).toBe(WIDGET_URI);
  });
});

describe('GET_CURRICULUM_MODEL_INPUT_SCHEMA', () => {
  it('accepts optional tool_name parameter', () => {
    expect(GET_CURRICULUM_MODEL_INPUT_SCHEMA.properties.tool_name).toBeDefined();
    expect(GET_CURRICULUM_MODEL_INPUT_SCHEMA.properties.tool_name.type).toBe('string');
  });

  it('does not allow additional properties', () => {
    expect(GET_CURRICULUM_MODEL_INPUT_SCHEMA.additionalProperties).toBe(false);
  });
});
