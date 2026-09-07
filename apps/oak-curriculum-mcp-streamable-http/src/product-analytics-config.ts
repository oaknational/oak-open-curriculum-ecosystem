import { err, ok, type Result } from '@oaknational/result';
import { POSTHOG_EU_INGESTION_HOST } from './env-product-analytics.js';
import { describeKeyringFailure } from './product-analytics-keyring-diagnostics.js';
import { parseKeyring, type ProductAnalyticsKeyringEntry } from './product-analytics-keyring.js';
import type { ConfigError } from './runtime-config-support.js';

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

/**
 * Fixed, content-free failures. Supplied values never appear in a message:
 * the keyring carries key material and the other inputs are deployment
 * configuration, so a diagnostic that echoed them would move secrets into
 * logs and error transports. The keyring's own guards produce their
 * diagnostic through `describeKeyringFailure`, which names the guard that
 * refused and safe shape facts — still never a value.
 */
function configurationError(reason: string): Result<never, ConfigError> {
  return err({
    message: `invalid PostHog product-analytics configuration: ${reason}`,
    diagnostics: [],
  });
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
 * active id resolves exactly one entry. Failures name the guard that
 * refused and the safe shape facts around it — no supplied value
 * survives into the returned error.
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
  if (!keyring.ok) {
    return configurationError(describeKeyringFailure(keyring.error));
  }

  const active = keyring.value.find(({ id }) => id === env.POSTHOG_PSEUDONYM_ACTIVE_KEY_ID);
  if (active === undefined) {
    return configurationError('active pseudonym key id resolves no keyring entry');
  }

  return ok({
    selected: true,
    projectApiKey: env.POSTHOG_PROJECT_API_KEY,
    host: POSTHOG_EU_INGESTION_HOST,
    activeKeyId: active.id,
    keyring: keyring.value,
  });
}
