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

export type ApplicationVersionSource = 'APP_VERSION_OVERRIDE' | 'root_package_json';

export type SentryReleaseSource = 'SENTRY_RELEASE_OVERRIDE' | ApplicationVersionSource;

export type GitShaSource = 'GIT_SHA_OVERRIDE' | 'VERCEL_GIT_COMMIT_SHA';

export interface SentryConfigEnvironment {
  readonly SENTRY_MODE?: string;
  readonly SENTRY_DSN?: string;
  readonly SENTRY_ENVIRONMENT_OVERRIDE?: string;
  readonly SENTRY_RELEASE_OVERRIDE?: string;
  readonly SENTRY_RELEASE_REGISTRATION_OVERRIDE?: string;
  readonly SENTRY_TRACES_SAMPLE_RATE?: string;
  readonly SENTRY_ENABLE_LOGS?: string;
  readonly SENTRY_SEND_DEFAULT_PII?: string;
  readonly SENTRY_DEBUG?: string;
  readonly VERCEL_ENV?: string;
  readonly VERCEL_GIT_COMMIT_REF?: string;
  readonly APP_VERSION?: string;
  readonly APP_VERSION_SOURCE?: ApplicationVersionSource;
  readonly GIT_SHA?: string;
  readonly GIT_SHA_SOURCE?: GitShaSource;
  readonly VERCEL_GIT_COMMIT_SHA?: string;
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
  readonly release: string;
  readonly releaseSource: SentryReleaseSource;
  readonly gitSha?: string;
  readonly gitShaSource?: GitShaSource;
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
