import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { schoolSchema } from './school.js';

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();
const registeredSchoolSchema = registry.register('School', schoolSchema);

registry.registerPath({
  method: 'get',
  path: '/schools/{schoolId}',
  operationId: 'getSchool',
  summary: 'Get a school by canonical school id',
  request: {
    params: z
      .object({
        schoolId: z.string().min(1),
      })
      .strict(),
  },
  responses: {
    200: {
      description: 'School found',
      content: {
        'application/json': {
          schema: registeredSchoolSchema,
        },
      },
    },
  },
});

export function createSchoolDataSearchOpenApiDocument(): ReturnType<
  OpenApiGeneratorV3['generateDocument']
> {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.3',
    info: {
      title: 'Oak School Data Search API',
      version: '0.0.0',
    },
  });
}
