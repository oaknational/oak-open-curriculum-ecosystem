import { z } from 'zod';
import { err, ok, type Result } from '@oaknational/result';
import { POSTHOG_EU_INGESTION_HOST } from './env-product-analytics.js';
import type { ConfigError } from './runtime-config-support.js';

/** One decoded, app-owned key version parsed from the deployment keyring. */
interface ProductAnalyticsKeyringEntry {
  /** Non-secret rotation label; part of derived distinct IDs. */
  readonly id: string;
  /** Exactly 32 bytes of decoded key material, freshly copied per resolution. */
  readonly key: Uint8Array;
}

/**
 * Adapter-owned bootstrap value produced by the composition root.
 *
 * @remarks
 * The selected shape carries the project key and decoded key material for
 * exactly one consumer: the application bootstrap that constructs the
 * PostHog runtime. It is never placed on the handler-facing
 * `RuntimeConfig`, logged, serialised, or attached to an error.
 */
export type ProductAnalyticsBootstrap =
  | { readonly selected: false }
  | {
      readonly selected: true;
      readonly projectApiKey: string;
      readonly host: typeof POSTHOG_EU_INGESTION_HOST;
      readonly activeKeyId: string;
      readonly keyring: readonly ProductAnalyticsKeyringEntry[];
    };

/**
 * The subset of validated environment fields this module reads.
 *
 * @remarks
 * A structural type rather than the app `Env` so this module never
 * imports `env.ts` (both read the host constant from
 * `env-product-analytics.ts`) and never sees unrelated secrets.
 */
export interface ProductAnalyticsEnvInput {
  readonly OBSERVABILITY_SINKS: readonly string[];
  readonly POSTHOG_PROJECT_API_KEY?: string;
  readonly POSTHOG_HOST?: string;
  readonly POSTHOG_PSEUDONYM_ACTIVE_KEY_ID?: string;
  readonly POSTHOG_PSEUDONYM_KEYRING?: string;
}

const CANONICAL_BASE64URL_32_BYTES = /^[A-Za-z0-9_-]{43}$/;

/**
 * The adapter's binding key-id contract, mirrored from
 * `@oaknational/posthog-node`'s `actor-pseudonym.ts` `KEY_ID_PATTERN`
 * (not exported there). Enforcing it here makes an id the adapter would
 * reject a boot failure at this resolver rather than a later
 * content-free composition failure; if the two ever diverge, the
 * adapter's own validation still refuses at composition.
 */
const KEY_ID_PATTERN = /^[a-z0-9][a-z0-9_-]{0,31}$/u;

/**
 * Strict wire shape of one keyring record: exactly `id` and `key`, an
 * id satisfying the adapter's key-id contract, and a key whose length
 * and alphabet match a 43-char unpadded base64url encoding of 32 bytes.
 * Canonicality (re-encoding byte-for-byte) still needs the decode step
 * below — the pattern alone cannot see the final character's padding
 * bits.
 */
const KeyringEntryWireSchema = z.strictObject({
  id: z.string().regex(KEY_ID_PATTERN),
  key: z.string().regex(CANONICAL_BASE64URL_32_BYTES),
});

const KeyringWireSchema = z.array(KeyringEntryWireSchema).min(1);

/**
 * Fixed, content-free failures. Supplied values never appear in a message:
 * the keyring carries key material and the other inputs are deployment
 * configuration, so a diagnostic that echoed them would move secrets into
 * logs and error transports.
 */
/**
 * The variables the product-analytics configuration reads — the value-free
 * diagnostic surface a refusal names (the reason strings above stay
 * content-free; the names say where to look).
 */
export const PRODUCT_ANALYTICS_ENV_KEYS: readonly string[] = [
  'OBSERVABILITY_SINKS',
  'POSTHOG_PROJECT_API_KEY',
  'POSTHOG_HOST',
  'POSTHOG_CAPTURE_MODE',
  'POSTHOG_PSEUDONYM_ACTIVE_KEY_ID',
  'POSTHOG_PSEUDONYM_KEYRING',
];

function configurationError(reason: string): Result<never, ConfigError> {
  return err({
    message: `invalid PostHog product-analytics configuration: ${reason}`,
    diagnostics: [],
    failingKeys: PRODUCT_ANALYTICS_ENV_KEYS,
  });
}

function decodeCanonicalKey(key: string): Uint8Array | undefined {
  const decoded = Buffer.from(key, 'base64url');
  // A 43-char base64url string always decodes to 32 bytes, so the length
  // guard is belt-and-braces behind the wire regex; the re-encode check is
  // the live rule (it rejects non-canonical padding bits).
  if (decoded.length !== 32 || decoded.toString('base64url') !== key) {
    return undefined;
  }
  return Uint8Array.from(decoded);
}

function decodeUniqueKeyring(
  wire: readonly z.output<typeof KeyringEntryWireSchema>[],
): readonly ProductAnalyticsKeyringEntry[] | undefined {
  const entries: ProductAnalyticsKeyringEntry[] = [];
  const seenIds = new Set<string>();
  const seenKeyMaterial = new Set<string>();

  for (const { id, key } of wire) {
    const decoded = decodeCanonicalKey(key);
    if (decoded === undefined) {
      return undefined;
    }

    const material = Buffer.from(decoded).toString('hex');
    if (seenIds.has(id) || seenKeyMaterial.has(material)) {
      return undefined;
    }

    seenIds.add(id);
    seenKeyMaterial.add(material);
    entries.push({ id, key: decoded });
  }

  return entries;
}

function parseKeyring(raw: string): readonly ProductAnalyticsKeyringEntry[] | undefined {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return undefined;
  }

  const wire = KeyringWireSchema.safeParse(parsed);
  if (!wire.success) {
    return undefined;
  }

  return decodeUniqueKeyring(wire.data);
}

/**
 * Resolves the product-analytics bootstrap value from validated environment
 * fields.
 *
 * @remarks
 * When `posthog` is absent from the observability selection this reads no
 * PostHog variable at all and returns the unselected bootstrap. When
 * selected, the complete closed configuration is required: a non-empty
 * project key, the exact EU ingestion host, and a strict keyring whose
 * active id resolves exactly one entry. Failures are fixed and
 * content-free — no supplied value survives into the returned error.
 *
 * @param env - Validated environment fields (post-schema).
 * @returns `Ok` with the closed bootstrap value, or a content-free
 * configuration error.
 */
export function resolveProductAnalyticsConfig(
  env: ProductAnalyticsEnvInput,
): Result<ProductAnalyticsBootstrap, ConfigError> {
  if (!env.OBSERVABILITY_SINKS.includes('posthog')) {
    return ok({ selected: false });
  }

  if (!env.POSTHOG_PROJECT_API_KEY) {
    return configurationError('project API key is required when posthog is selected');
  }

  if (env.POSTHOG_HOST !== POSTHOG_EU_INGESTION_HOST) {
    return configurationError('host must be the exact EU ingestion host');
  }

  if (!env.POSTHOG_PSEUDONYM_ACTIVE_KEY_ID) {
    return configurationError('active pseudonym key id is required when posthog is selected');
  }

  if (!env.POSTHOG_PSEUDONYM_KEYRING) {
    return configurationError('pseudonym keyring is required when posthog is selected');
  }

  const keyring = parseKeyring(env.POSTHOG_PSEUDONYM_KEYRING);
  if (keyring === undefined) {
    return configurationError('pseudonym keyring failed strict validation');
  }

  const active = keyring.find(({ id }) => id === env.POSTHOG_PSEUDONYM_ACTIVE_KEY_ID);
  if (active === undefined) {
    return configurationError('active pseudonym key id resolves no keyring entry');
  }

  return ok({
    selected: true,
    projectApiKey: env.POSTHOG_PROJECT_API_KEY,
    host: POSTHOG_EU_INGESTION_HOST,
    activeKeyId: active.id,
    keyring,
  });
}
