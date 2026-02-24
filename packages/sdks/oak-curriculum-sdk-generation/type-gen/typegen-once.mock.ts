import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { OpenAPIObject } from 'openapi3-ts/oas31';

import { validateOpenApiDocument } from './schema-validator.js';
import { createOpenCurriculumSchema } from './schema-separation-core.js';
import { readSchemaCacheOrNull } from './schema-cache.js';

vi.mock('./schema-validator.js');
vi.mock('./schema-separation-core.js');
vi.mock('./schema-cache.js');

describe('typegen schema validation', () => {
  const validated: OpenAPIObject = {
    openapi: '3.0.3',
    info: { title: 'Test', version: '1.0.0' },
    paths: {},
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(validateOpenApiDocument).mockReturnValue(validated);
  });

  it('validates the schema only once during loadSchema()', async () => {
    vi.mocked(readSchemaCacheOrNull).mockResolvedValue(validated);
    vi.mocked(createOpenCurriculumSchema).mockReturnValue({
      original: validated,
      validated,
      sdk: validated,
    });

    await import('./typegen.js');

    expect(validateOpenApiDocument).toHaveBeenCalledTimes(1);
  });
});
