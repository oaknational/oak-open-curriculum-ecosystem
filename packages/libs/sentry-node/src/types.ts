import type { CaptureContext, NodeOptions } from '@sentry/node';
import type { LogContext, LogEvent, LogSink, NormalizedError } from '@oaknational/logger';
import type { Result } from '@oaknational/result';

export type SentryMode = 'off' | 'fixture' | 'sentry';
export type SentryBooleanFlagName =
  | 'SENTRY_ENABLE_LOGS'
  | 'SENTRY_SEND_DEFAULT_PII'
  | 'SENTRY_DEBUG';

export type SentryEnvironmentSource =
  | 'SENTRY_ENVIRONMENT'
  | 'VERCEL_ENV'
  | 'NODE_ENV'
  | 'development';

export type SentryReleaseSource =
  | 'SENTRY_RELEASE'
  | 'VERCEL_GIT_COMMIT_SHA'
  | 'GITHUB_SHA'
  | 'COMMIT_SHA'
  | 'SOURCE_VERSION'
  | 'npm_package_version'
  | 'local-dev';

export interface SentryConfigEnvironment {
  readonly SENTRY_MODE?: string;
  readonly SENTRY_DSN?: string;
  readonly SENTRY_ENVIRONMENT?: string;
  readonly SENTRY_RELEASE?: string;
  readonly SENTRY_TRACES_SAMPLE_RATE?: string;
  readonly SENTRY_ENABLE_LOGS?: string;
  readonly SENTRY_SEND_DEFAULT_PII?: string;
  readonly SENTRY_DEBUG?: string;
  readonly VERCEL_ENV?: string;
  readonly NODE_ENV?: string;
  readonly VERCEL_GIT_COMMIT_SHA?: string;
  readonly GITHUB_SHA?: string;
  readonly COMMIT_SHA?: string;
  readonly SOURCE_VERSION?: string;
  readonly npm_package_version?: string;
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
  | { readonly kind: 'missing_sentry_dsn' }
  | { readonly kind: 'invalid_sentry_dsn'; readonly value: string }
  | { readonly kind: 'invalid_traces_sample_rate'; readonly value: string }
  | { readonly kind: 'send_default_pii_forbidden' }
  | { readonly kind: 'missing_release_for_live_mode' };

export interface InitialiseSentryError {
  readonly kind: 'sentry_sdk_init_failed';
  readonly message: string;
}

export type SentryFlushError =
  | { readonly kind: 'sentry_flush_timeout'; readonly timeoutMs: number }
  | { readonly kind: 'sentry_flush_failed'; readonly message: string };

export interface FixtureSentryLogCapture {
  readonly kind: 'log';
  readonly level: LogEvent['level'];
  readonly message: string;
  readonly line: string;
  readonly traceId?: string;
  readonly spanId?: string;
  readonly environment: string;
  readonly release: string;
}

export interface FixtureSentryExceptionCapture {
  readonly kind: 'exception';
  readonly error: NormalizedError;
  readonly context?: LogContext;
  readonly traceId?: string;
  readonly spanId?: string;
  readonly environment: string;
  readonly release: string;
}

export type FixtureSentryCapture = FixtureSentryLogCapture | FixtureSentryExceptionCapture;

export interface FixtureSentryStore {
  readonly captures: readonly FixtureSentryCapture[];
  push(capture: FixtureSentryCapture): void;
}

export interface SentryNodeSdk {
  init(options: NodeOptions): void;
  captureException(error: Error, context?: CaptureContext): void;
  captureMessage(message: string, context?: CaptureContext): void;
  flush(timeoutMs?: number): Promise<boolean>;
}

export interface InitialiseSentryOptions {
  readonly serviceName: string;
  readonly sdk?: SentryNodeSdk;
  readonly fixtureStore?: FixtureSentryStore;
}

export interface SentryNodeRuntime {
  readonly config: ParsedSentryConfig;
  readonly tracePropagationTargets: readonly string[];
  readonly sink: LogSink | null;
  readonly fixtureStore?: FixtureSentryStore;
  captureHandledError(error: NormalizedError, context?: LogContext): void;
  flush(timeoutMs?: number): Promise<Result<void, SentryFlushError>>;
}
