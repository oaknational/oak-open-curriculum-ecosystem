import {
  assertAcceptHeaderEnforcement,
  assertAuthRequired,
  assertHealthEndpoints,
  assertInitialiseHandshake,
} from './health.js';
import { assertSuccessfulToolCall, assertToolsAndAliases } from './tools.js';
import { assertValidationFailures } from './validation.js';
import { assertSynonymCanonicalisation } from './synonyms.js';
import type { SmokeContext } from './types.js';

export { type SmokeContext } from './types.js';

export async function runSmokeAssertions(context: SmokeContext): Promise<void> {
  await assertHealthEndpoints(context);
  await assertAcceptHeaderEnforcement(context);
  await assertAuthRequired(context);
  await assertInitialiseHandshake(context);
  await assertToolsAndAliases(context);
  await assertValidationFailures(context);
  await assertSuccessfulToolCall(context);
  await assertSynonymCanonicalisation(context);
}
