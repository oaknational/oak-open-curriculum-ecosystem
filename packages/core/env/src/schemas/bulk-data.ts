import { z } from 'zod';

/**
 * Contract schema for local bulk download directory defaults.
 *
 * Import and merge this schema for CLIs or scripts that read
 * curriculum data from local bulk download JSON files.
 *
 * `BULK_DOWNLOAD_DIR` is fully optional at the schema layer: an absent
 * key, an empty value, and a whitespace-only value all parse cleanly
 * and yield a value the consumer treats as "not configured". The
 * consumer (e.g. `apps/oak-search-cli`'s `resolveBulkDirFromInputs`)
 * applies the workspace-relative default when the key is unset; the
 * schema does not encode a default because the path is consumer-specific
 * and the schema is shared across multiple consumers.
 */
export const BulkDataEnvSchema = z.object({
  BULK_DOWNLOAD_DIR: z.string().optional(),
});

export type BulkDataEnv = z.infer<typeof BulkDataEnvSchema>;
