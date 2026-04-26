import type { ReleaseInput, ReleaseSource } from '@oaknational/build-metadata';
import type { CaptureContext, Log, NodeOptions } from '@sentry/node';
import type { LogContext, LogSink, NormalizedError } from '@oaknational/logger';
import type { Result } from '@oaknational/result';
import type { FixtureSentryStore } from './types-fixture.js';
import type { SentryContextPayload, SentryUser } from './types-scope.js';

export type {
  FixtureSentryCapture,
  FixtureSentryContextCapture,
  FixtureSentryExceptionCapture,
  FixtureSentryLogCapture,
  FixtureSentryStore,
  FixtureSentryTagCapture,
  FixtureSentryUserCapture,
} from './types-fixture.js';
export type { SentryContextPayload, SentryPrimitiveValue, SentryUser } from './types-scope.js';

export type SentryMode = 'off' | 'fixture' | 'sentry';
export type SentryBooleanFlagName =
  | 'SENTRY_ENABLE_LOGS'
  | 'SENTRY_SEND_DEFAULT_PII'
  | 'SENTRY_DEBUG';

export type SentryEnvironmentSource = 'SENTRY_ENVIRONMENT_OVERRIDE' | 'VERCEL_ENV' | 'development';

/**
 * Provenance of the `APP_VERSION` value fed into the resolver.
 *
 * @remarks Tracked separately from {@link SentryReleaseSource} because
 * `APP_VERSION` is an observability signal that the build-time
 * composition root computes from either `APP_VERSION_OVERRIDE` or the
 * root `package.json`. The release identifier itself may be derived
 * from that version (on production) OR from a branch URL / short SHA
 * (on preview/development).
 */
export type ApplicationVersionSource = 'APP_VERSION_OVERRIDE' | 'root_package_json';

/**
 * Source the resolved Sentry release name was derived from.
 *
 * @remarks Aliased to {@link ReleaseSource} from
 * `@oaknational/build-metadata` to reflect the collapse to a single
 * canonical resolver — the adapter no longer re-classifies release
 * provenance on the runtime path.
 */
export type SentryReleaseSource = ReleaseSource;

export type GitShaSource = 'GIT_SHA_OVERRIDE' | 'VERCEL_GIT_COMMIT_SHA';

/**
 * Environment input shape consumed by `@oaknational/sentry-node`.
 *
 * @remarks Extends {@link ReleaseInput} so that release-resolution
 * divergence between build-time and runtime is impossible by
 * construction: any caller assembling a `SentryConfigEnvironment`
 * automatically satisfies the upstream `resolveRelease` contract.
 * The sentry-node-specific fields below layer on top for SDK
 * configuration (DSN, flags, mode) and observability signalling
 * (APP_VERSION provenance, GIT_SHA provenance).
 */
export interface SentryConfigEnvironment extends ReleaseInput {
  readonly SENTRY_MODE?: string;
  readonly SENTRY_DSN?: string;
  readonly SENTRY_ENVIRONMENT_OVERRIDE?: string;
  readonly SENTRY_RELEASE_REGISTRATION_OVERRIDE?: string;
  readonly SENTRY_TRACES_SAMPLE_RATE?: string;
  readonly SENTRY_ENABLE_LOGS?: string;
  readonly SENTRY_SEND_DEFAULT_PII?: string;
  readonly SENTRY_DEBUG?: string;
  readonly APP_VERSION_SOURCE?: ApplicationVersionSource;
  readonly GIT_SHA?: string;
  readonly GIT_SHA_SOURCE?: GitShaSource;
}

/**
 * Warning codes emitted by {@link resolveSentryRegistrationPolicy}
 * when the raw VERCEL_ENV + VERCEL_GIT_COMMIT_REF pairing diverges
 * from the expected production shape (per ADR-163 §3).
 */
export type SentryEnvironmentWarning =
  | 'production_env_with_non_main_branch'
  | 'production_env_with_missing_branch';

/**
 * Result of deciding whether a given build should register a Sentry release
 * (per ADR-163 §3 truth table + §4 local-override handling).
 */
export interface ResolvedSentryRegistrationPolicy {
  readonly registerRelease: boolean;
  readonly warning?: SentryEnvironmentWarning;
}

export interface ResolvedSentryEnvironment {
  readonly value: string;
  readonly source: SentryEnvironmentSource;
}

export interface ResolvedSentryRelease {
  readonly value: string;
  readonly source: SentryReleaseSource;
}

export interface SentryOffConfig {
  readonly mode: 'off';
  readonly environment: string;
  readonly environmentSource: SentryEnvironmentSource;
  readonly enableLogs: false;
  readonly sendDefaultPii: false;
  readonly debug: false;
}

export interface SentryFixtureConfig {
  readonly mode: 'fixture';
  readonly environment: string;
  readonly environmentSource: SentryEnvironmentSource;
  readonly release: string;
  readonly releaseSource: SentryReleaseSource;
  readonly gitSha?: string;
  readonly gitShaSource?: GitShaSource;
  readonly enableLogs: boolean;
  readonly sendDefaultPii: false;
  readonly debug: boolean;
}

export interface SentryLiveConfig {
  readonly mode: 'sentry';
  readonly dsn: string;
  readonly environment: string;
  readonly environmentSource: SentryEnvironmentSource;
  readonly release: string;
  readonly releaseSource: SentryReleaseSource;
  readonly gitSha?: string;
  readonly gitShaSource?: GitShaSource;
  readonly tracesSampleRate: number;
  readonly enableLogs: boolean;
  readonly sendDefaultPii: false;
  readonly debug: boolean;
  /**
   * SDK-side error-message allow-list. Matching events are dropped by
   * the Sentry SDK before `beforeSend` (i.e. before the redaction
   * barrier). Empty / unset in alpha; see the sentry-node README's
   * Allow-list policy section for the addition pattern.
   */
  readonly ignoreErrors?: readonly (string | RegExp)[];
  /**
   * SDK-side URL allow-list. Matching frame-source URLs are dropped
   * by the Sentry SDK before `beforeSend`. Empty / unset in alpha;
   * see the sentry-node README's Allow-list policy section.
   */
  readonly denyUrls?: readonly (string | RegExp)[];
}

export type ParsedSentryConfig = SentryOffConfig | SentryFixtureConfig | SentryLiveConfig;

export type ObservabilityConfigError =
  | { readonly kind: 'invalid_sentry_mode'; readonly value: string }
  | {
      readonly kind: 'invalid_boolean_flag';
      readonly name: SentryBooleanFlagName;
      readonly value: string;
    }
  | { readonly kind: 'missing_app_version' }
  | { readonly kind: 'invalid_app_version'; readonly value: string }
  | { readonly kind: 'missing_sentry_dsn' }
  | { readonly kind: 'invalid_sentry_dsn'; readonly value: string }
  | { readonly kind: 'invalid_traces_sample_rate'; readonly value: string }
  | { readonly kind: 'send_default_pii_forbidden' }
  | { readonly kind: 'invalid_git_sha'; readonly value: string }
  | { readonly kind: 'missing_git_sha' }
  | { readonly kind: 'invalid_release_override'; readonly value: string }
  | { readonly kind: 'invalid_build_identity'; readonly value: string }
  | { readonly kind: 'missing_branch_url_in_preview' }
  | { readonly kind: 'invalid_release_registration_override' };

export interface InitialiseSentryError {
  readonly kind: 'sentry_sdk_init_failed';
  readonly message: string;
}

export type SentryFlushError =
  | { readonly kind: 'sentry_flush_timeout'; readonly timeoutMs: number }
  | { readonly kind: 'sentry_flush_failed'; readonly message: string };

/** Error from {@link SentryNodeRuntime.close} failing to drain the event queue. */
export type SentryCloseError =
  | { readonly kind: 'sentry_close_timeout'; readonly timeoutMs: number }
  | { readonly kind: 'sentry_close_failed'; readonly message: string };

export interface SentryLoggerSdk {
  trace(message: string, attributes?: Log['attributes']): void;
  debug(message: string, attributes?: Log['attributes']): void;
  info(message: string, attributes?: Log['attributes']): void;
  warn(message: string, attributes?: Log['attributes']): void;
  error(message: string, attributes?: Log['attributes']): void;
  fatal(message: string, attributes?: Log['attributes']): void;
}

export interface SentryNodeSdk {
  init(options: NodeOptions): void;
  captureException(error: Error, context?: CaptureContext): void;
  captureMessage(message: string, context?: CaptureContext): void;
  flush(timeoutMs?: number): Promise<boolean>;
  close(timeoutMs?: number): Promise<boolean>;
  setUser(user: SentryUser | null): void;
  setTag(key: string, value: string): void;
  setContext(name: string, context: SentryContextPayload | null): void;
  readonly logger: SentryLoggerSdk;
}

export type SentryErrorEvent = Parameters<NonNullable<NodeOptions['beforeSend']>>[0];
export type SentryTransactionEvent = Parameters<
  NonNullable<NodeOptions['beforeSendTransaction']>
>[0];
export type SentryBreadcrumb = Parameters<NonNullable<NodeOptions['beforeBreadcrumb']>>[0];
export type SentryLogPayload = Parameters<NonNullable<NodeOptions['beforeSendLog']>>[0];
export type SentrySpanPayload = Parameters<NonNullable<NodeOptions['beforeSendSpan']>>[0];

export interface SentryPostRedactionHooks {
  readonly beforeSend?: NodeOptions['beforeSend'];
  readonly beforeSendTransaction?: NodeOptions['beforeSendTransaction'];
  readonly beforeBreadcrumb?: NodeOptions['beforeBreadcrumb'];
}

export interface InitialiseSentryOptions {
  readonly serviceName: string;
  readonly sdk?: SentryNodeSdk;
  readonly fixtureStore?: FixtureSentryStore;
  readonly postRedactionHooks?: SentryPostRedactionHooks;
}

export interface SentryNodeRuntime {
  readonly config: ParsedSentryConfig;
  readonly tracePropagationTargets: readonly string[];
  readonly sink: LogSink | null;
  readonly fixtureStore?: FixtureSentryStore;
  captureHandledError(error: NormalizedError, context?: LogContext): void;
  flush(timeoutMs?: number): Promise<Result<void, SentryFlushError>>;
  close(timeoutMs?: number): Promise<Result<void, SentryCloseError>>;
  setUser(user: SentryUser | null): void;
  setTag(key: string, value: string): void;
  setContext(name: string, context: SentryContextPayload | null): void;
}
