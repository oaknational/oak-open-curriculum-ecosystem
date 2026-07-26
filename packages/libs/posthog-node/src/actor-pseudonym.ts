import { err, ok, type Result } from '@oaknational/result';
import { createHmac } from 'node:crypto';

import type {
  ActivePostHogActorProjector,
  PostHogActorPseudonym,
  PostHogDeletionProjector,
  PostHogIdentityProjectionError,
  PostHogPseudonymCapabilities,
  PostHogPseudonymConfig,
  PostHogPseudonymConfigurationError,
  PostHogPseudonymEnvironment,
  PostHogPseudonymKey,
} from './actor-pseudonym-contract.js';

const PSEUDONYM_DOMAIN = 'oak-mcp-analytics';
const PSEUDONYM_DESTINATION = 'posthog';
const PSEUDONYM_PURPOSE = 'actor-pseudonym';
const PSEUDONYM_VERSION = 'v1';
const PSEUDONYM_PREFIX = `oakph:${PSEUDONYM_VERSION}`;
const KEY_ID_PATTERN = /^[a-z0-9][a-z0-9_-]{0,31}$/u;
const KEY_LENGTH_BYTES = 32;
const MAX_PRINCIPAL_LENGTH_BYTES = 512;
const VALID_ENVIRONMENTS: readonly PostHogPseudonymEnvironment[] = [
  'production',
  'preview',
  'development',
  'test',
];

function configurationError(): Result<never, PostHogPseudonymConfigurationError> {
  return err({ kind: 'invalid_posthog_pseudonym_configuration' });
}

function projectionError(): Result<never, PostHogIdentityProjectionError> {
  return err({ kind: 'posthog_identity_projection_failed' });
}

function isValidEnvironment(
  environment: PostHogPseudonymEnvironment,
): environment is PostHogPseudonymEnvironment {
  return VALID_ENVIRONMENTS.includes(environment);
}

function keyMaterialMatches(left: Uint8Array, right: Uint8Array): boolean {
  return left.every((byte, index) => byte === right[index]);
}

function isWellFormedUnicode(value: string): boolean {
  for (const character of value) {
    const codePoint = character.codePointAt(0);
    if (codePoint === undefined || (codePoint >= 0xd800 && codePoint <= 0xdfff)) {
      return false;
    }
  }

  return true;
}

function isValidPrincipal(principal: string): boolean {
  if (!isWellFormedUnicode(principal)) {
    return false;
  }

  const length = Buffer.byteLength(principal, 'utf8');
  return length > 0 && length <= MAX_PRINCIPAL_LENGTH_BYTES;
}

function updateFrame(hmac: ReturnType<typeof createHmac>, value: string): void {
  const bytes = Buffer.from(value, 'utf8');
  const length = Buffer.allocUnsafe(4);
  length.writeUInt32BE(bytes.length);
  hmac.update(length);
  hmac.update(bytes);
}

function projectWithKey(
  environment: PostHogPseudonymEnvironment,
  key: PostHogPseudonymKey,
  principal: string,
): Result<PostHogActorPseudonym, PostHogIdentityProjectionError> {
  if (!isValidPrincipal(principal)) {
    return projectionError();
  }

  try {
    const hmac = createHmac('sha256', key.key);
    for (const frame of [
      PSEUDONYM_DOMAIN,
      PSEUDONYM_DESTINATION,
      PSEUDONYM_PURPOSE,
      PSEUDONYM_VERSION,
      environment,
      key.id,
      principal,
    ]) {
      updateFrame(hmac, frame);
    }

    const digest = hmac.digest('base64url');
    return ok({
      environment,
      keyId: key.id,
      distinctId: `${PSEUDONYM_PREFIX}:${key.id}:${digest}`,
    });
  } catch {
    return projectionError();
  }
}

function compareKeyIds(left: PostHogPseudonymKey, right: PostHogPseudonymKey): number {
  if (left.id < right.id) {
    return -1;
  }
  if (left.id > right.id) {
    return 1;
  }
  return 0;
}

function isValidBootstrapConfig(config: PostHogPseudonymConfig): boolean {
  return (
    isValidEnvironment(config.environment) &&
    KEY_ID_PATTERN.test(config.activeKeyId) &&
    config.keyring.length > 0
  );
}

function isValidKeyCandidate(
  candidate: PostHogPseudonymKey,
  copiedKeys: readonly PostHogPseudonymKey[],
): boolean {
  if (!KEY_ID_PATTERN.test(candidate.id)) {
    return false;
  }
  if (!(candidate.key instanceof Uint8Array)) {
    return false;
  }
  if (candidate.key.byteLength !== KEY_LENGTH_BYTES) {
    return false;
  }
  if (copiedKeys.some(({ id }) => id === candidate.id)) {
    return false;
  }
  return !copiedKeys.some(({ key }) => keyMaterialMatches(key, candidate.key));
}

function validateAndCopyKeyring(
  config: PostHogPseudonymConfig,
): Result<readonly PostHogPseudonymKey[], PostHogPseudonymConfigurationError> {
  if (!isValidBootstrapConfig(config)) {
    return configurationError();
  }

  const copiedKeys: PostHogPseudonymKey[] = [];
  for (const candidate of config.keyring) {
    if (!isValidKeyCandidate(candidate, copiedKeys)) {
      return configurationError();
    }

    copiedKeys.push({
      id: candidate.id,
      key: new Uint8Array(candidate.key),
    });
  }

  if (!copiedKeys.some(({ id }) => id === config.activeKeyId)) {
    return configurationError();
  }

  return ok(copiedKeys);
}

/**
 * Constructs the closed active and deletion actor-projection capabilities.
 *
 * @remarks Validates and copies every key before exposing a capability.
 * Projection uses synchronous HMAC and consumes the verified principal only
 * while deriving its destination-, environment-, purpose-, version-, and
 * key-scoped value. Results retain neither principals nor key material.
 *
 * @param config - Already-decoded environment, active-key selection, and
 * retained keyring supplied by the application composition root.
 * @returns `Ok` with immutable projection capabilities, or the fixed
 * configuration error when an environment or keyring invariant is invalid.
 */
export function createPostHogPseudonymCapabilities(
  config: PostHogPseudonymConfig,
): Result<PostHogPseudonymCapabilities, PostHogPseudonymConfigurationError> {
  const keyringResult = validateAndCopyKeyring(config);
  if (!keyringResult.ok) {
    return keyringResult;
  }

  const environment = config.environment;
  const keyring = keyringResult.value;
  const activeKey = keyring.find(({ id }) => id === config.activeKeyId);
  if (activeKey === undefined) {
    return configurationError();
  }

  const deletionKeys = [...keyring].sort(compareKeyIds);
  const active: ActivePostHogActorProjector = {
    project(principal) {
      return projectWithKey(environment, activeKey, principal);
    },
  };
  const deletion: PostHogDeletionProjector = {
    project(principal) {
      if (!isValidPrincipal(principal)) {
        return projectionError();
      }

      const projections: PostHogActorPseudonym[] = [];
      for (const key of deletionKeys) {
        const result = projectWithKey(environment, key, principal);
        if (!result.ok) {
          return result;
        }
        projections.push(result.value);
      }
      return ok(projections);
    },
  };

  return ok({ active, deletion });
}
