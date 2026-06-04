import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const schoolSourceSchema = z.enum([
  'england-gias',
  'wales-address-list',
  'scotland-contact-details',
  'northern-ireland-de-publications',
]);

export const schoolPhaseSchema = z.enum([
  'nursery',
  'primary',
  'middle',
  'secondary',
  'sixth_form',
  'all_through',
  'special',
  'unknown',
]);

export const schoolNameVariantSchema = z
  .object({
    value: z.string().min(1),
    kind: z.enum(['official', 'previous', 'alternative']),
  })
  .strict();

export const schoolSchema = z
  .object({
    id: z.string().min(1),
    source: schoolSourceSchema,
    sourceId: z.string().min(1),
    name: z.string().min(1),
    nameVariants: z.array(schoolNameVariantSchema),
    phase: schoolPhaseSchema,
    sourceStatus: z.string().min(1),
    sourceType: z.string().min(1),
    postcode: z.string().min(1),
    locality: z.string().min(1),
    country: z.enum(['England', 'Wales', 'Scotland', 'Northern Ireland']),
  })
  .strict();

export type School = z.infer<typeof schoolSchema>;
