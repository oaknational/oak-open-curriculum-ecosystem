import { err, type Result } from '@oaknational/result';

import { validateCollaborationJsonFileText } from './collaboration-json-validation.js';
import { checkCollaborationSurfaceContract, type ContractSchemaId } from './surface-contract.js';

/**
 * The composed write gates for the three contract-bearing collaboration
 * surfaces: the surface-contract check first (on the raw serialized text),
 * then Ajv schema validation of the same raw text. Owned here so state-io
 * stays a thin orchestration surface and every state-io write path for a
 * surface is provably the same composition (active-claims twice,
 * closed-claims and comms-event once each). The active-claims registry has
 * one OTHER writer with its own differently-composed gate:
 * commit-queue/registry.ts.
 *
 * On a contract failure the Err arm carries the parser's ORIGINAL error
 * (`causeError`), never the check's path-prefixed wrapper; on malformed
 * JSON it carries the path-labelled JSON error. Either way the transaction
 * layer's unwrap rethrows the Err's error by identity, and the smoke-pinned
 * loud messages depend on it (anchored in
 * state-io-write-validators.integration.test.ts).
 */

type WriteValidator = (text: string) => Promise<Result<void, Error>>;

export function activeClaimsWriteValidator(path: string): WriteValidator {
  return (text) => contractThenSchema('active-claims.schema.json', path, text);
}

export function closedClaimsWriteValidator(path: string): WriteValidator {
  return (text) => contractThenSchema('closed-claims.schema.json', path, text);
}

export function commsEventWriteValidator(path: string): WriteValidator {
  return (text) => contractThenSchema('comms-event.schema.json', path, text);
}

export function commitQueueIntentWriteValidator(path: string): WriteValidator {
  return (text) => contractThenSchema('commit-queue-intent.schema.json', path, text);
}

async function contractThenSchema(
  schemaId: ContractSchemaId,
  path: string,
  text: string,
): Promise<Result<void, Error>> {
  const checked = checkCollaborationSurfaceContract({ schemaId, path, text });
  if (!checked.ok) {
    return err(checked.error.causeError);
  }
  return validateCollaborationJsonFileText(path, text);
}
