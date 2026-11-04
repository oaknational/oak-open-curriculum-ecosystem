import type { Breadcrumb, Exception, NodeOptions, RequestEventData } from '@sentry/node';
import {
  redactJsonObject,
  redactStringRecord,
  redactText,
  redactUnknownValue,
} from '@oaknational/observability';
import { typeSafeEntries } from '@oaknational/type-helpers';

type SentryErrorEvent = Parameters<NonNullable<NodeOptions['beforeSend']>>[0];
type SentryLogPayload = Parameters<NonNullable<NodeOptions['beforeSendLog']>>[0];
type SentryTransactionEvent = Parameters<NonNullable<NodeOptions['beforeSendTransaction']>>[0];

/*
 * The event fields the barrier redacts, named without the `undefined` their
 * optionality adds, so an optional property of these types is written once
 * (`?:`) rather than twice (`?: T | undefined`).
 */
type SentryEventContexts = NonNullable<SentryErrorEvent['contexts']>;
type SentryEventException = NonNullable<SentryErrorEvent['exception']>;
type SentryEventExtra = NonNullable<SentryErrorEvent['extra']>;
type SentryEventLogEntry = NonNullable<SentryErrorEvent['logentry']>;

/**
 * The fields the error and transaction event shapes share and the barrier
 * redacts; either event is assignable to it.
 */
interface RedactableEventFields {
  readonly breadcrumbs?: readonly Breadcrumb[];
  readonly contexts?: SentryEventContexts;
  readonly exception?: SentryEventException;
  readonly extra?: SentryEventExtra;
  readonly logentry?: SentryEventLogEntry;
  readonly message?: string;
  readonly request?: RequestEventData;
  readonly transaction?: string;
}

/** The redacted counterpart of {@link RedactableEventFields}, spread back over the event. */
interface RedactedEventFields {
  readonly breadcrumbs?: Breadcrumb[];
  readonly contexts?: SentryEventContexts;
  readonly exception?: SentryEventException;
  readonly extra?: SentryEventExtra;
  readonly logentry?: SentryEventLogEntry;
  readonly message?: string;
  readonly request?: RequestEventData;
  readonly transaction?: string;
}

function redactQueryString(
  queryString: RequestEventData['query_string'] | undefined,
): RequestEventData['query_string'] | undefined {
  if (queryString === undefined) {
    return undefined;
  }

  if (typeof queryString === 'string') {
    return redactText(queryString);
  }

  return redactText(new URLSearchParams(queryString).toString());
}

function redactRequestEventData(
  request: RequestEventData | undefined,
): RequestEventData | undefined {
  if (!request) {
    return undefined;
  }

  const queryString = redactQueryString(request.query_string);
  const cookies = redactStringRecord(request.cookies);
  const env = redactStringRecord(request.env);
  const headers = redactStringRecord(request.headers);

  return {
    ...request,
    ...(request.url ? { url: redactText(request.url) } : {}),
    ...(request.data !== undefined ? { data: redactUnknownValue(request.data, 'data') } : {}),
    ...(queryString !== undefined ? { query_string: queryString } : {}),
    ...(cookies ? { cookies } : {}),
    ...(env ? { env } : {}),
    ...(headers ? { headers } : {}),
  };
}

function redactBreadcrumb(breadcrumb: Breadcrumb): Breadcrumb {
  const data = redactJsonObject(breadcrumb.data);

  return {
    ...breadcrumb,
    ...(breadcrumb.message ? { message: redactText(breadcrumb.message) } : {}),
    ...(data ? { data } : {}),
  };
}

function redactBreadcrumbs(
  breadcrumbs: readonly Breadcrumb[] | undefined,
): Breadcrumb[] | undefined {
  return breadcrumbs?.map((breadcrumb) => redactBreadcrumb(breadcrumb));
}

function redactException(exception: Exception): Exception {
  return {
    ...exception,
    ...(exception.type ? { type: redactText(exception.type) } : {}),
    ...(exception.value ? { value: redactText(exception.value) } : {}),
    ...(exception.module ? { module: redactText(exception.module) } : {}),
  };
}

function redactLogEntry(
  logEntry: SentryEventLogEntry | undefined,
): SentryEventLogEntry | undefined {
  if (!logEntry) {
    return undefined;
  }

  return {
    ...logEntry,
    ...(logEntry.message ? { message: redactText(logEntry.message) } : {}),
    ...(logEntry.params
      ? {
          params: logEntry.params.map((parameter) => redactUnknownValue(parameter)),
        }
      : {}),
  };
}

function redactCommonEventFields(event: RedactableEventFields): RedactedEventFields {
  const contexts = redactContexts(event.contexts);
  const breadcrumbs = redactBreadcrumbs(event.breadcrumbs);
  const extra = redactJsonObject(event.extra);
  const exceptionValues = event.exception?.values?.map((value) => redactException(value));
  const logentry = redactLogEntry(event.logentry);
  const request = redactRequestEventData(event.request);
  const exception = event.exception
    ? {
        ...event.exception,
        ...(exceptionValues ? { values: exceptionValues } : {}),
      }
    : undefined;

  return {
    breadcrumbs,
    contexts,
    exception,
    extra,
    logentry,
    message: event.message ? redactText(event.message) : undefined,
    request,
    transaction: event.transaction ? redactText(event.transaction) : undefined,
  };
}

function redactContexts(
  contexts: SentryEventContexts | undefined,
): SentryEventContexts | undefined {
  if (!contexts) {
    return undefined;
  }

  const redacted: SentryEventContexts = {};

  for (const [key, context] of typeSafeEntries(contexts)) {
    const redactedContext = redactJsonObject(context);

    if (redactedContext) {
      redacted[key] = redactedContext;
    }
  }

  return redacted;
}

/**
 * Redact the fields the error and transaction events share, keeping the
 * event's own shape: the one implementation behind both public entry points.
 */
function redactEvent<TEvent extends RedactableEventFields>(event: TEvent): TEvent {
  return {
    ...event,
    ...redactCommonEventFields(event),
  };
}

/** Redact an error event before it leaves the process (ADR-160's barrier). */
export function redactSentryEvent(event: SentryErrorEvent): SentryErrorEvent {
  return redactEvent(event);
}

export function redactSentryBreadcrumb(breadcrumb: Breadcrumb): Breadcrumb {
  return redactBreadcrumb(breadcrumb);
}

/** Redact a transaction event before it leaves the process (ADR-160's barrier). */
export function redactSentryTransaction(event: SentryTransactionEvent): SentryTransactionEvent {
  return redactEvent(event);
}

export function redactSentryLog(log: SentryLogPayload): SentryLogPayload {
  const attributes = redactJsonObject(log.attributes);

  return {
    ...log,
    message: redactText(log.message),
    ...(attributes ? { attributes } : {}),
  };
}
