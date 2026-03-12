import { z } from 'zod';

/**
 * Contract schema for local bulk download directory defaults.
 *
 * Import and merge this schema for CLIs or scripts that read
 * curriculum data from local bulk download JSON files.
 */
export const BulkDataEnvSchema = z.object({
  BULK_DOWNLOAD_DIR: z.string().min(1, 'BULK_DOWNLOAD_DIR cannot be empty').optional(),
});

export type BulkDataEnv = z.infer<typeof BulkDataEnvSchema>;
