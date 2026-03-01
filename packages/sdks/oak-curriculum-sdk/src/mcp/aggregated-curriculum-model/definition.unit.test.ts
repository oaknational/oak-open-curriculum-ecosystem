/**
 * Unit tests for get-curriculum-model tool definition.
 *
 * Tests the tool definition metadata, input schema, annotations,
 * and OpenAI Apps SDK _meta fields.
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

  it('has openai/outputTemplate for widget', () => {
    expect(GET_CURRICULUM_MODEL_TOOL_DEF._meta['openai/outputTemplate']).toBe(WIDGET_URI);
  });

  it('has openai/toolInvocation metadata', () => {
    expect(GET_CURRICULUM_MODEL_TOOL_DEF._meta['openai/toolInvocation/invoking']).toBeDefined();
    expect(GET_CURRICULUM_MODEL_TOOL_DEF._meta['openai/toolInvocation/invoked']).toBeDefined();
  });

  it('has openai/widgetAccessible set to true', () => {
    expect(GET_CURRICULUM_MODEL_TOOL_DEF._meta['openai/widgetAccessible']).toBe(true);
  });

  it('has openai/visibility set to public', () => {
    expect(GET_CURRICULUM_MODEL_TOOL_DEF._meta['openai/visibility']).toBe('public');
  });
});

describe('GET_CURRICULUM_MODEL_INPUT_SCHEMA', () => {
  it('accepts optional tool_name parameter', () => {
    expect(GET_CURRICULUM_MODEL_INPUT_SCHEMA.properties.tool_name).toBeDefined();
    expect(GET_CURRICULUM_MODEL_INPUT_SCHEMA.properties.tool_name.type).toBe('string');
  });

  it('has no required fields', () => {
    expect('required' in GET_CURRICULUM_MODEL_INPUT_SCHEMA).toBe(false);
  });

  it('does not allow additional properties', () => {
    expect(GET_CURRICULUM_MODEL_INPUT_SCHEMA.additionalProperties).toBe(false);
  });
});
