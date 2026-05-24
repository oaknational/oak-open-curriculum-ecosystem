import { describe, it, expect } from 'vitest';
import { BulkDataEnvSchema } from '../../src/schemas/bulk-data';

describe('BulkDataEnvSchema', () => {
  it('accepts a valid bulk download directory', () => {
    const result = BulkDataEnvSchema.safeParse({
      BULK_DOWNLOAD_DIR: './bulk-downloads',
    });
    expect(result.success).toBe(true);
  });

  it('accepts omitted bulk download directory', () => {
    const result = BulkDataEnvSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('treats an empty bulk download directory value as not configured', () => {
    const result = BulkDataEnvSchema.safeParse({
      BULK_DOWNLOAD_DIR: '',
    });
    expect(result.success).toBe(true);
  });

  it('treats a whitespace-only bulk download directory value as not configured', () => {
    const result = BulkDataEnvSchema.safeParse({
      BULK_DOWNLOAD_DIR: '   ',
    });
    expect(result.success).toBe(true);
  });
});
