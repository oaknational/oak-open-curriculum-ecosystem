/**
 * Subpath barrel: `@oaknational/curriculum-sdk-generation/admin`
 *
 * Admin stream action schemas, fixtures, and types.
 */

export {
  ADMIN_STREAM_ACTIONS,
  AdminStreamActionSchema,
  AdminStreamSuccessSchema,
  AdminStreamErrorSchema,
  AdminStreamFixtureSchema,
  createAdminStreamFixture,
  createAdminStreamEmptyFixture,
  createAdminStreamErrorFixture,
  createAdminStreamFixtureMap,
} from './types/generated/admin/index.js';
export type {
  AdminStreamAction,
  AdminStreamSuccessFixture,
  AdminStreamErrorFixture,
  AdminStreamFixture,
  AdminStreamFixtureMap,
} from './types/generated/admin/index.js';
