import { describe, it, expect } from 'vitest';

// Import from public API root
import { schema, toolGeneration, KEY_STAGES, SUBJECTS } from '.';

describe('Programmatic tool generation exports', () => {
  it('exposes the raw OpenAPI schema with expected version', () => {
    expect(schema).toBeDefined();
    // OpenAPI should be 3.0.3 according to the API
    expect(schema).toHaveProperty('openapi', '3.0.3');
  });

  it('provides PATH_OPERATIONS including GET /lessons/{lesson}/transcript with lesson path param', () => {
    const found = toolGeneration.PATH_OPERATIONS.find(
      (op) => op.path === '/lessons/{lesson}/transcript' && op.method.toLowerCase() === 'get',
    );
    expect(found).toBeDefined();
    expect(found?.operationId).toBeTypeOf('string');
    expect(found?.operationId).toContain('getLessonTranscript');

    const lessonParam = found?.parameters.find((p) => p.in === 'path' && p.name === 'lesson');
    expect(lessonParam).toBeDefined();
  });

  it('maps known parameter types with curated enums for keyStage and subject', () => {
    const { PARAM_TYPE_MAP } = toolGeneration;
    expect(PARAM_TYPE_MAP.keyStage).toBeDefined();
    expect(PARAM_TYPE_MAP.keyStage.type).toBe('string');
    expect(PARAM_TYPE_MAP.keyStage.enum).toEqual(KEY_STAGES);

    expect(PARAM_TYPE_MAP.subject).toBeDefined();
    expect(PARAM_TYPE_MAP.subject.type).toBe('string');
    expect(PARAM_TYPE_MAP.subject.enum).toEqual(SUBJECTS);
  });

  it('parses path templates and generates deterministic MCP tool names', () => {
    const parsed = toolGeneration.parsePathTemplate('/lessons/{lesson}/transcript', 'get');
    expect(parsed.pathParams).toEqual(['lesson']);
    expect(parsed.toMcpToolName()).toBe('oak-get-lessons-transcript');
  });
});
