/**
 * Integration tests for the `withVerifiedBulkData` ingest gate.
 *
 * Ingest commands must never open an ES connection or run a lease against
 * a bundle they cannot vouch for. The gate resolves the bulk directory,
 * verifies the bundle's vintage, and checks the ingest environment BEFORE
 * the handler runs — so every refusal here is proved by the handler never
 * being called, not merely by a returned error.
 *
 * All dependencies are injected as simple fakes (ADR-078); the clock is a
 * value read once at command entry.
 */
import { join, resolve } from 'node:path';
import { describe, it, expect, vi } from 'vitest';
import { createFakeCliDeps } from '../../../test-helpers/fake-cli-deps.js';
import {
  withVerifiedBulkData,
  type BulkDataGateFs,
  type WithVerifiedBulkDataInput,
} from './with-verified-bulk-data.js';

// Anchored via resolve so the root is genuinely absolute on every host —
// a POSIX literal like '/app' is drive-relative on Windows, and the gate
// hands the handler a host-form resolved path derived from this anchor.
const appRoot = resolve('/app');
const resolvedBulkDir = join(appRoot, 'bulk-downloads');
const now = new Date('2026-08-03T12:00:00.000Z');

/** A manifest exactly as `scripts/download-bulk.ts` writes it. */
const manifestDownloadedAt = (downloadedAt: string): string =>
  JSON.stringify({
    downloadedAt,
    source: 'https://open-api.thenational.academy/api/bulk',
    files: [{ file: 'maths-primary.json', sizeBytes: 123 }],
  });

const bundleListing = ['maths-primary.json', 'manifest.json', 'schema.json'];

/**
 * A bundle filesystem whose manifest read and existence are controllable.
 *
 * An absent directory cannot be listed either, so `readdirSync` throws
 * whenever `exists` is false — the fixture stays internally consistent
 * rather than describing a directory that is missing and listable at once.
 */
function createFakeGateFs(input: {
  readonly readManifest: () => string;
  readonly exists?: boolean;
}): BulkDataGateFs {
  const exists = input.exists ?? true;
  return {
    existsSync: () => exists,
    readdirSync: () => {
      if (!exists) {
        throw new Error('ENOENT: no such file or directory');
      }
      return [...bundleListing];
    },
    readFileSync: () => input.readManifest(),
  };
}

function createInput(overrides: Partial<WithVerifiedBulkDataInput>): WithVerifiedBulkDataInput {
  return {
    bulkDirFlag: undefined,
    bulkDirFromEnv: undefined,
    oakApiKey: 'test-key',
    appRoot,
    now,
    fs: createFakeGateFs({ readManifest: () => manifestDownloadedAt('2026-08-01T08:00:00.000Z') }),
    ...overrides,
  };
}

describe('withVerifiedBulkData', () => {
  it('refuses and never runs the ingest body when the bundle is stale', async () => {
    const deps = createFakeCliDeps();
    const handler = vi.fn();

    await withVerifiedBulkData(
      createInput({
        // 60 days before `now` — well past the accepted maximum.
        fs: createFakeGateFs({
          readManifest: () => manifestDownloadedAt('2026-06-04T12:00:00.000Z'),
        }),
      }),
      handler,
      deps,
    );

    expect(handler).not.toHaveBeenCalled();
    // Names the stale diagnosis, its age, and the threshold — never the
    // absent-manifest cure, which carries the same download instruction.
    const message = deps.printError.mock.calls[0]?.[0];
    expect(message).toContain('Bulk data is stale');
    expect(message).toContain('60');
    expect(message).toContain('14');
    expect(message).toContain('bulk:download');
    expect(deps.setExitCode).toHaveBeenCalledWith(1);
    expect(deps.logger.error).toHaveBeenCalled();
  });

  it('refuses and never runs the ingest body when the manifest is absent', async () => {
    const deps = createFakeCliDeps();
    const handler = vi.fn();

    await withVerifiedBulkData(
      createInput({
        fs: createFakeGateFs({
          readManifest: () => {
            throw new Error('ENOENT: no such file or directory');
          },
        }),
      }),
      handler,
      deps,
    );

    expect(handler).not.toHaveBeenCalled();
    // Names the unreadable manifest specifically — not the stale diagnosis.
    const message = deps.printError.mock.calls[0]?.[0];
    expect(message).toContain('Bulk data manifest not readable');
    expect(message).toContain('bulk:download');
    expect(deps.setExitCode).toHaveBeenCalledWith(1);
    expect(deps.logger.error).toHaveBeenCalled();
  });

  it('runs the ingest body with the resolved bulk dir and reports the vintage when fresh', async () => {
    const deps = createFakeCliDeps();
    const handler = vi.fn(() => Promise.resolve());

    await withVerifiedBulkData(createInput({}), handler, deps);

    expect(handler).toHaveBeenCalledExactlyOnceWith(resolvedBulkDir);
    expect(deps.printInfo.mock.calls[0]?.[0]).toContain('2026-08-01T08:00:00.000Z');
    expect(deps.printInfo.mock.calls[0]?.[0]).toContain('2 day(s) old');
    expect(deps.setExitCode).not.toHaveBeenCalled();
  });

  it('refuses before the freshness check when the bulk directory is missing', async () => {
    const deps = createFakeCliDeps();
    const handler = vi.fn();

    await withVerifiedBulkData(
      createInput({
        fs: createFakeGateFs({
          exists: false,
          readManifest: () => {
            throw new Error('the freshness check must never be reached');
          },
        }),
      }),
      handler,
      deps,
    );

    expect(handler).not.toHaveBeenCalled();
    // The resolution failure's own wording. "not found" (existence) is
    // distinct from "is not readable" (listing threw), so this row cannot
    // pass on a fixture that got as far as listing the directory.
    const message = deps.printError.mock.calls[0]?.[0];
    expect(message).toContain('Bulk download directory not found');
    expect(message).toContain(resolvedBulkDir);
    expect(deps.setExitCode).toHaveBeenCalledWith(1);
  });

  it('refuses when OAK_API_KEY is absent', async () => {
    const deps = createFakeCliDeps();
    const handler = vi.fn();

    await withVerifiedBulkData(createInput({ oakApiKey: undefined }), handler, deps);

    expect(handler).not.toHaveBeenCalled();
    expect(deps.printError.mock.calls[0]?.[0]).toContain('OAK_API_KEY');
    expect(deps.setExitCode).toHaveBeenCalledWith(1);
  });
});
