/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Admin stream fixtures derived from SDK-owned schema definitions.
 */

import { z } from 'zod';

export const ADMIN_STREAM_ACTIONS = ['elastic-setup', 'index-oak', 'rebuild-rollup'] as const;
export const AdminStreamActionSchema = z.enum(ADMIN_STREAM_ACTIONS);
export type AdminStreamAction = z.infer<typeof AdminStreamActionSchema>;

const statusSchema = z.number().int().min(100).max(599);
const lineSchema = z.string().min(1);

export const AdminStreamSuccessSchema = z
  .object({
    status: statusSchema,
    lines: z.array(lineSchema).nonempty().readonly(),
  })
  .strict();
export type AdminStreamSuccessFixture = z.infer<typeof AdminStreamSuccessSchema>;

export const AdminStreamErrorSchema = z
  .object({
    status: statusSchema,
    errorText: lineSchema,
  })
  .strict();
export type AdminStreamErrorFixture = z.infer<typeof AdminStreamErrorSchema>;

export const AdminStreamFixtureSchema = z.union([
  AdminStreamSuccessSchema,
  AdminStreamErrorSchema,
]);
export type AdminStreamFixture = z.infer<typeof AdminStreamFixtureSchema>;

export type AdminStreamFixtureMap = Readonly<Record<AdminStreamAction, AdminStreamSuccessFixture>>;

const BASE_ADMIN_STREAM_FIXTURES = {
  'elastic-setup': {
    status: 200,
    lines: [
      '[info] Validating Elasticsearch configuration…',
      '[info] Connection established with fixture cluster',
      '[info] Applying ingest pipelines',
      '[done] exit code 0',
    ],
  },
  'index-oak': {
    status: 200,
    lines: [
      '[info] Starting deterministic fixture indexing run',
      '[info] Indexed 12 sequences, 38 units, 240 lessons',
      '[info] Committed rollup checkpoints',
      '[done] exit code 0',
    ],
  },
  'rebuild-rollup': {
    status: 200,
    lines: [
      '[info] Generating fixture rollup view',
      '[info] Consolidated 7 subject aggregates',
      '[done] exit code 0',
    ],
  },
} as const satisfies AdminStreamFixtureMap;

const EMPTY_STREAM_FIXTURE: AdminStreamSuccessFixture = {
  status: 200,
  lines: ['[info] No operations executed (fixture mode)', '[done] exit code 0'],
};

const ERROR_STREAM_FIXTURE: AdminStreamErrorFixture = {
  status: 503,
  errorText: '[error] Fixture requested simulated failure',
};

/** Retrieve the base success fixture for an admin action with optional overrides. */
export function createAdminStreamFixture(
  action: AdminStreamAction,
  overrides: Partial<AdminStreamSuccessFixture> = {},
): AdminStreamSuccessFixture {
  const base = BASE_ADMIN_STREAM_FIXTURES[action];
  const candidate = {
    ...base,
    ...overrides,
    lines: overrides.lines ?? base.lines,
  } satisfies AdminStreamSuccessFixture;
  return AdminStreamSuccessSchema.parse(candidate);
}

/** Create a deterministic empty-stream fixture for admin actions. */
export function createAdminStreamEmptyFixture(
  overrides: Partial<AdminStreamSuccessFixture> = {},
): AdminStreamSuccessFixture {
  const candidate = {
    ...EMPTY_STREAM_FIXTURE,
    ...overrides,
    lines: overrides.lines ?? EMPTY_STREAM_FIXTURE.lines,
  } satisfies AdminStreamSuccessFixture;
  return AdminStreamSuccessSchema.parse(candidate);
}

/** Create a deterministic error fixture for admin actions. */
export function createAdminStreamErrorFixture(
  overrides: Partial<AdminStreamErrorFixture> = {},
): AdminStreamErrorFixture {
  const candidate = {
    ...ERROR_STREAM_FIXTURE,
    ...overrides,
  } satisfies AdminStreamErrorFixture;
  return AdminStreamErrorSchema.parse(candidate);
}

/** Return the canonical success fixtures indexed by action. */
export function createAdminStreamFixtureMap(): AdminStreamFixtureMap {
  return {
    'elastic-setup': createAdminStreamFixture('elastic-setup'),
    'index-oak': createAdminStreamFixture('index-oak'),
    'rebuild-rollup': createAdminStreamFixture('rebuild-rollup'),
  };
}
