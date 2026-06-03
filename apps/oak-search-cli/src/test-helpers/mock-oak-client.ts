/**
 * Shared mock factory for {@link OakClient}.
 *
 * Provides a structurally-valid `OakClient` with sensible defaults
 * (all API methods return `{ ok: true, value: [] | null }`).
 * Individual methods can be overridden via `Partial<OakClient>`.
 *
 * @example
 * ```ts
 * // Default — all methods return empty success results
 * const client = createMockClient();
 *
 * // Override a single method
 * const client = createMockClient({
 *   getSubjectDetail: vi.fn().mockResolvedValue({
 *     ok: true,
 *     value: createSubjectDetail({
 *       sequenceSlugs: [createSequenceEntry('maths-primary')],
 *     }),
 *   }),
 * });
 * ```
 */
import { vi } from 'vitest';

import type { OakClient, SubjectSequenceEntry } from '../adapters/oak-adapter.js';
import type { SubjectDetail } from '../types/oak.js';

/**
 * Create a structurally-valid {@link SubjectDetail} for tests.
 *
 * Defaults to a maths subject with no sequences; override any field.
 */
export function createSubjectDetail(overrides: Partial<SubjectDetail> = {}): SubjectDetail {
  return {
    subjectTitle: 'Maths',
    subjectSlug: 'maths',
    sequenceSlugs: [],
    years: [],
    keyStages: [],
    ks4ProgrammeFactors: {},
    ...overrides,
  };
}

/**
 * Create a structurally-valid {@link SubjectSequenceEntry} for tests.
 *
 * Defaults to a secondary-phase entry; override any field.
 */
export function createSequenceEntry(
  sequenceSlug: string,
  overrides: Partial<SubjectSequenceEntry> = {},
): SubjectSequenceEntry {
  return {
    sequenceSlug,
    years: [],
    keyStages: [],
    phaseSlug: 'secondary',
    phaseTitle: 'Secondary',
    ...overrides,
  };
}

/**
 * Create a mock {@link OakClient} with all methods stubbed.
 *
 * Every API method returns a resolved `{ ok: true, value: [] | null }`
 * by default. The `rateLimitTracker`, `getCacheStats`, and `disconnect`
 * fields are pre-configured with safe no-op implementations.
 *
 * @param overrides - Optional partial OakClient to override specific methods.
 * @returns A fully-populated mock OakClient.
 */
export function createMockClient(overrides: Partial<OakClient> = {}): OakClient {
  return {
    getSubjectDetail: vi.fn().mockResolvedValue({ ok: true, value: createSubjectDetail() }),
    getSequenceUnits: vi.fn().mockResolvedValue({ ok: true, value: [] }),
    getUnitsByKeyStageAndSubject: vi.fn().mockResolvedValue({ ok: true, value: [] }),
    getLessonTranscript: vi.fn().mockResolvedValue({ ok: true, value: null }),
    getLessonsByKeyStageAndSubject: vi.fn().mockResolvedValue({ ok: true, value: [] }),
    getLessonSummary: vi.fn().mockResolvedValue({ ok: true, value: null }),
    getUnitSummary: vi.fn().mockResolvedValue({ ok: true, value: null }),
    getAllThreads: vi.fn().mockResolvedValue({ ok: true, value: [] }),
    getThreadUnits: vi.fn().mockResolvedValue({ ok: true, value: [] }),
    getSubjectAssets: vi.fn().mockResolvedValue({ ok: true, value: [] }),
    rateLimitTracker: {
      getStatus: () => ({
        limit: 1000,
        remaining: 1000,
        reset: Date.now(),
        resetDate: new Date(),
        lastChecked: new Date(),
      }),
      getRequestCount: () => 0,
      getRequestRate: () => 0,
      reset: vi.fn(),
    },
    getCacheStats: vi.fn().mockReturnValue({
      hits: 0,
      misses: 0,
      connected: false,
    }),
    disconnect: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}
