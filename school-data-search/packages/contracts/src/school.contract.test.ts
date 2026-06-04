import { describe, expect, it } from 'vitest';
import { createSchoolDataSearchOpenApiDocument, schoolSchema } from './index.js';

const minimumSchool = {
  id: 'england-gias:123456',
  source: 'england-gias',
  sourceId: '123456',
  name: 'Oak Example School',
  nameVariants: [{ value: 'Oak Former Name', kind: 'previous' }],
  phase: 'middle',
  sourceStatus: 'Open',
  sourceType: 'Academy converter',
  postcode: 'SW1A 1AA',
  locality: 'Westminster',
  country: 'England',
} as const;

describe('schoolSchema', () => {
  it('accepts the canonical minimum school shape while preserving source fields', () => {
    const parsed = schoolSchema.parse(minimumSchool);

    expect(parsed.sourceStatus).toBe('Open');
    expect(parsed.sourceType).toBe('Academy converter');
    expect(parsed.phase).toBe('middle');
    expect(parsed.nameVariants).toHaveLength(1);
  });

  it('rejects fields that are outside the privacy-safe contract', () => {
    expect(() => schoolSchema.parse({ ...minimumSchool, headteacher: 'A Person' })).toThrow();
  });
});

describe('createSchoolDataSearchOpenApiDocument', () => {
  it('generates an OpenAPI 3.x document from the Zod contract source', () => {
    const document = createSchoolDataSearchOpenApiDocument();

    expect(document.openapi).toMatch(/^3\./);
    expect(document.paths['/schools/{schoolId}']).toBeDefined();
    expect(document.components?.schemas?.School).toBeDefined();
  });
});
