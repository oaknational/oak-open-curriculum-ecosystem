/**
 * Zod schemas for Elasticsearch API responses.
 *
 * @packageDocumentation
 */
import { z } from 'zod';

/** Schema for parsing create index error responses. */
export const CreateIndexErrorSchema = z.object({
  error: z
    .object({
      type: z.string().optional(),
    })
    .optional(),
});

/** Schema for parsing Elasticsearch cluster info response. */
export const ClusterInfoSchema = z.object({
  cluster_name: z.string().optional(),
  version: z
    .object({
      number: z.string().optional(),
    })
    .optional(),
});

/** Schema for parsing _cat/indices API response. */
export const CatIndicesSchema = z.array(
  z.object({
    index: z.string(),
    health: z.string(),
    'docs.count': z.string(),
  }),
);
