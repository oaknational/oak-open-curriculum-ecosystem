import type { Breadcrumb, NodeOptions } from '@sentry/node';
import { REDACTED_VALUE } from '@oaknational/observability';
import { describe, expect, it } from 'vitest';
import { createSentryConfig } from './config.js';
import { createSentryInitOptions, type SentryRedactionHooks } from './runtime-sdk.js';
import {
  redactSentryBreadcrumb,
  redactSentryEvent,
  redactSentryLog,
  redactSentrySpan,
  redactSentryTransaction,
} from './runtime-redaction.js';
import type {
  ParsedSentryConfig,
  SentryBreadcrumb,
  SentryErrorEvent,
  SentryLogPayload,
  SentryPostRedactionHooks,
  SentrySpanPayload,
  SentryTransactionEvent,
} from './types.js';

/**
 * ADR-160 conformance test file.
 *
 * @see ../../../../docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md
 * @see ../../../../docs/architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md — §6 is superseded in part by ADR-160 and this conformance test is its successor enforcement edge.
 *
 * Enforces the three-part closure property for the shared redaction barrier:
 *
 * 1. **Composition presence** — every fan-out hook named in `BARRIER_HOOKS`
 *    is wired on the `NodeOptions` produced by `createSentryInitOptions`.
 * 2. **Ordering invariant** — for each hook that has a
 *    `SentryPostRedactionHooks` slot, a consumer post-hook receives a
 *    payload that has ALREADY been redacted. The redactor runs first.
 *
 *    **Degenerate case**: hooks WITHOUT a `SentryPostRedactionHooks` slot
 *    (`beforeSendLog`, `beforeSendSpan`) have no consumer post-hook for
 *    ordering to be asserted against. For these the ordering invariant is
 *    vacuously satisfied — the bypass-validation describe block plus Part
 *    3 redacted-at-destination coverage is the sole enforcement edge.
 *
 * 3. **Redacted at destination** — every hook emits a redacted payload
 *    (PII replaced by `REDACTED_VALUE` from `@oaknational/observability`).
 *
 * A parallel automated bypass validation proves that omitting a redactor
 * call for any one hook causes the sentinel to DISAPPEAR from the output,
 * confirming the conformance tests would fail in the absence of the
 * barrier.
 *
 * When a new fan-out hook is added to `createSentryHooks` in
 * `runtime-sdk.ts`:
 *
 * - extend `BARRIER_HOOKS` with its literal name,
 * - add Part 3 redacted-at-destination coverage for the new hook,
 * - if it admits a `SentryPostRedactionHooks` slot, extend Part 2,
 * - extend the bypass describe block with the new hook.
 *
 * The compile-time gate at `BARRIER_HOOKS` — combined with the
 * set-equality test in Part 1 against `keyof SentryRedactionHooks` (the
 * return type of `createSentryHooks`) — detects a new hook wired in
 * `runtime-sdk.ts` without a matching `BARRIER_HOOKS` update at
 * `pnpm type-check` time. The explicit registry plus code review remain
 * the authoritative enforce-edge.
 */

// --- Barrier registry ----------------------------------------------------

/**
 * Enumerates every fan-out hook name wired by `createSentryHooks` in
 * `runtime-sdk.ts`. This registry IS the conformance gate: ADR-160's
 * closure property requires that adding a new fan-out path extend this
 * registry (plus coverage below) in the same change set. The
 * set-equality test in Part 1 fails at `pnpm type-check` if
 * `SentryRedactionHooks` and this registry diverge.
 *
 * See the file header for the full maintenance protocol.
 */
const BARRIER_HOOKS = [
  'beforeSend',
  'beforeSendTransaction',
  'beforeSendSpan',
  'beforeSendLog',
  'beforeBreadcrumb',
] as const satisfies readonly (keyof NodeOptions)[];

type BarrierHookName = (typeof BARRIER_HOOKS)[number];

/** Hooks that have a consumer post-redaction slot per `SentryPostRedactionHooks`. */
const HOOKS_WITH_POST_REDACTION_SLOT = [
  'beforeSend',
  'beforeSendTransaction',
  'beforeBreadcrumb',
] as const satisfies readonly BarrierHookName[];

/** Hooks that do NOT have a consumer post-redaction slot; bypass proof is direct-omission. */
const HOOKS_WITHOUT_POST_REDACTION_SLOT = [
  'beforeSendLog',
  'beforeSendSpan',
] as const satisfies readonly BarrierHookName[];

// --- Test config ---------------------------------------------------------

/** Redaction sentinel imported from `@oaknational/observability` — single source of truth. */
const URL_ENCODED_SENTINEL = encodeURIComponent(REDACTED_VALUE);

function createLiveConfig(): Extract<ParsedSentryConfig, { readonly mode: 'sentry' }> {
  const result = createSentryConfig({
    APP_VERSION: '1.0.0-test',
    APP_VERSION_SOURCE: 'APP_VERSION_OVERRIDE',
    SENTRY_MODE: 'sentry',
    SENTRY_DSN: 'https://key@example.ingest.sentry.io/123',
    SENTRY_TRACES_SAMPLE_RATE: '0.5',
    SENTRY_RELEASE_OVERRIDE: 'release-123',
  });

  if (!result.ok) {
    throw new Error(`Expected ok live config: ${JSON.stringify(result.error)}`);
  }

  if (result.value.mode !== 'sentry') {
    throw new Error('Expected live config');
  }

  return result.value;
}

function buildInitOptions(postRedactionHooks?: SentryPostRedactionHooks): NodeOptions {
  return createSentryInitOptions(createLiveConfig(), {
    serviceName: 'oak-http',
    ...(postRedactionHooks ? { postRedactionHooks } : {}),
  });
}

function requireDefined<T>(value: T | null | undefined, message: string): T {
  if (value === undefined || value === null) {
    throw new Error(message);
  }
  return value;
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return typeof value === 'object' && value !== null && 'then' in value;
}

async function resolveHookReturn<T>(value: T | PromiseLike<T | null> | null): Promise<T> {
  const resolved = isPromiseLike(value) ? await value : value;
  if (resolved === null) {
    throw new Error('Expected hook to keep the payload (got null)');
  }
  return resolved;
}

function assertRedactedErrorEvent(event: SentryErrorEvent): void {
  expect(event.request?.headers).toEqual({
    authorization: REDACTED_VALUE,
    cookie: REDACTED_VALUE,
  });
  expect(event.extra).toEqual({
    token: REDACTED_VALUE,
    refresh_token: REDACTED_VALUE,
  });
  const exceptionValue = event.exception?.values?.[0]?.value ?? '';
  expect(exceptionValue).toBe(`Bearer ${REDACTED_VALUE}`);
  const url = event.request?.url ?? '';
  expect(url).not.toContain('supersecret');
  expect(url).toContain(URL_ENCODED_SENTINEL);
  // Closure proof: no raw PII token survives in the serialised event.
  const serialised = JSON.stringify(event);
  expect(serialised).not.toContain('super-secret-abc123');
  expect(serialised).not.toContain(API_KEY_VALUE);
  expect(serialised).not.toContain(REFRESH_TOKEN_VALUE);
  expect(serialised).not.toContain('session-secret-xyz');
  expect(serialised).not.toContain('eyJzdWIiOiIxIn0.abc');
}

function assertRedactedTransactionEvent(event: SentryTransactionEvent): void {
  expect(event.request?.headers).toEqual({ authorization: REDACTED_VALUE });
  const url = event.request?.url ?? '';
  expect(url).not.toContain('supersecret');
  expect(url).toContain(URL_ENCODED_SENTINEL);
  const transactionName = event.transaction ?? '';
  expect(transactionName).not.toContain('supersecret');
}

function assertRedactedBreadcrumb(breadcrumb: SentryBreadcrumb): void {
  expect(breadcrumb.data).toEqual({
    authorization: REDACTED_VALUE,
    requestBody: { jsonrpc: '2.0', method: 'tools/call' },
  });
  const message = breadcrumb.message ?? '';
  expect(message).not.toContain('supersecret');
}

function assertBypassLeaksEveryErrorEventField(event: SentryErrorEvent): void {
  // Every field that `buildPiiErrorEvent` populates should leak when the
  // `beforeSend` redactor is omitted. A partial-regression that missed one
  // sub-field would slip past a narrow assertion; this helper widens the
  // net to every PII-bearing walk. Locals are extracted with `requireDefined`
  // so cyclomatic complexity stays low and failure messages are specific.
  const headers = requireDefined(event.request?.headers, 'Expected bypass headers');
  const url = requireDefined(event.request?.url, 'Expected bypass URL');
  const firstException = requireDefined(event.exception?.values?.[0], 'Expected exception[0]');
  expect(headers.authorization).toBe(BEARER_TOKEN_VALUE);
  expect(headers.cookie).toBe(SESSION_COOKIE_VALUE);
  expect(firstException.value).toBe(BEARER_TOKEN_VALUE);
  expect(event.extra).toEqual({
    token: API_KEY_VALUE,
    refresh_token: REFRESH_TOKEN_VALUE,
  });
  expect(url).toContain('supersecret');
  expect(event.message).toBe(JWT_BEARER_VALUE);
}

// --- PII payload builders ------------------------------------------------
//
// Multiple PII classes placed in each redacted sub-field per ADR-160 § Test
// Gate. Classes used:
//
// - `Bearer <token>` (OAuth-token-shaped) — confirmed redacted by
//   `@oaknational/observability`'s telemetry redaction policy for string
//   values that match bearer patterns.
// - `authorization` / `apiKey` / `token` attribute names — confirmed
//   redacted by key-aware header/attribute redaction.
// - OAuth `?code=`/`?state=` URL parameters — confirmed redacted by the
//   query-string redactor in `runtime-redaction.ts`.
//
// Each hook payload places PII across multiple sub-fields so a redactor
// regression that misses one walk would be caught.

// Additional PII classes per A.6 SR-4 (sentry-reviewer). Each value is a
// string the current redaction policy in `@oaknational/observability`
// actively recognises (either by key-name or pattern match), so every
// class is a genuine closure test — not a behaviour change proposal.

/** OAuth Bearer token — pattern-redacted in any string field (`Bearer <token>` → `Bearer [REDACTED]`). */
const BEARER_TOKEN_VALUE = 'Bearer super-secret-abc123';
/** OAuth callback URL — `?code=` and `?state=` params are full-redacted by `REDACTED_QUERY_KEYS`. */
const OAUTH_CALLBACK_URL = 'https://example.com/callback?code=supersecret&state=xyz789';
/** Placed under `token` / `apiKey` / `client_secret` keys — full-redacted by `FULLY_REDACTED_KEYS`. */
const API_KEY_VALUE = 'secret-api-key-zzz';
/** JWT under a `Bearer` prefix — policy preserves `Bearer ` and redacts the token body. */
const JWT_BEARER_VALUE = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIn0.abc';
/** Session-cookie string placed under a `cookie` header — full-redacted by key name. */
const SESSION_COOKIE_VALUE = 'sid=session-secret-xyz; path=/; HttpOnly';
/** Refresh-token placed under a `refresh_token` key — full-redacted by key name. */
const REFRESH_TOKEN_VALUE = 'oak-refresh-secret-value-123';
/** Span data value — Bearer-shaped so pattern redaction fires independent of span key conventions. */
const OAK_SPAN_BEARER_TOKEN = 'Bearer oak-span-secret-zzz';

function buildPiiErrorEvent(): SentryErrorEvent {
  return {
    type: undefined,
    message: JWT_BEARER_VALUE,
    extra: {
      token: API_KEY_VALUE,
      refresh_token: REFRESH_TOKEN_VALUE,
    },
    exception: {
      values: [
        {
          type: 'Error',
          value: BEARER_TOKEN_VALUE,
        },
      ],
    },
    request: {
      headers: {
        authorization: BEARER_TOKEN_VALUE,
        cookie: SESSION_COOKIE_VALUE,
      },
      url: OAUTH_CALLBACK_URL,
    },
  };
}

function buildPiiTransactionEvent(): SentryTransactionEvent {
  return {
    type: 'transaction',
    transaction: `POST ${OAUTH_CALLBACK_URL}`,
    request: {
      headers: {
        authorization: BEARER_TOKEN_VALUE,
      },
      url: OAUTH_CALLBACK_URL,
    },
  };
}

function buildPiiBreadcrumb(): Breadcrumb {
  return {
    category: 'http',
    message: `POST ${OAUTH_CALLBACK_URL}`,
    data: {
      authorization: BEARER_TOKEN_VALUE,
      requestBody: {
        jsonrpc: '2.0',
        method: 'tools/call',
      },
    },
  };
}

function buildPiiLog(): SentryLogPayload {
  return {
    level: 'error',
    message: BEARER_TOKEN_VALUE,
    attributes: {
      apiKey: API_KEY_VALUE,
    },
  };
}

function buildPiiSpan(): SentrySpanPayload {
  return {
    data: {
      'http.request.header.authorization': BEARER_TOKEN_VALUE,
      'oak.span.raw_header': OAK_SPAN_BEARER_TOKEN,
    },
    description: `POST ${OAUTH_CALLBACK_URL}`,
    op: 'http.client',
    origin: 'auto',
    span_id: '0123456789abcdef',
    start_timestamp: 0,
    timestamp: 1,
    trace_id: '0123456789abcdef0123456789abcdef',
  };
}

// --- Part 1: composition presence ---------------------------------------

describe('ADR-160 Part 1: composition presence', () => {
  it('wires every BARRIER_HOOKS name as a function on createSentryInitOptions output', () => {
    const options = buildInitOptions();

    for (const hookName of BARRIER_HOOKS) {
      const hook = options[hookName];
      expect(typeof hook, `${hookName} must be a function`).toBe('function');
    }
  });

  it('enforces BarrierHookName keys exist on NodeOptions at compile time', () => {
    // Compile-time proof: if a BARRIER_HOOKS entry is removed from NodeOptions,
    // this `satisfies` assertion fails at `pnpm type-check`. Asserted at value
    // level to keep the test suite evidence that the compiler accepted the
    // structural claim.
    const _hookNames: readonly (keyof NodeOptions)[] = BARRIER_HOOKS;
    expect(_hookNames).toHaveLength(BARRIER_HOOKS.length);
  });
});

// --- Part 2: ordering invariant -----------------------------------------

describe('ADR-160 Part 2: ordering invariant — post-hooks receive post-redaction data', () => {
  it('beforeSend: consumer post-hook receives a redacted event', async () => {
    let capturedEvent: SentryErrorEvent | undefined;
    const postRedactionHooks: SentryPostRedactionHooks = {
      beforeSend(event) {
        capturedEvent = event;
        return event;
      },
    };
    const options = buildInitOptions(postRedactionHooks);
    const beforeSend = requireDefined(options.beforeSend, 'Expected beforeSend');

    await resolveHookReturn(beforeSend(buildPiiErrorEvent(), {}));

    const captured = requireDefined(capturedEvent, 'Expected beforeSend post-hook capture');
    assertRedactedErrorEvent(captured);
  });

  it('beforeSendTransaction: consumer post-hook receives a redacted transaction event', async () => {
    let capturedEvent: SentryTransactionEvent | undefined;
    const postRedactionHooks: SentryPostRedactionHooks = {
      beforeSendTransaction(event) {
        capturedEvent = event;
        return event;
      },
    };
    const options = buildInitOptions(postRedactionHooks);
    const beforeSendTransaction = requireDefined(
      options.beforeSendTransaction,
      'Expected beforeSendTransaction',
    );

    await resolveHookReturn(beforeSendTransaction(buildPiiTransactionEvent(), {}));

    const captured = requireDefined(
      capturedEvent,
      'Expected beforeSendTransaction post-hook capture',
    );
    assertRedactedTransactionEvent(captured);
  });

  it('beforeBreadcrumb: consumer post-hook receives a redacted breadcrumb', () => {
    let capturedBreadcrumb: SentryBreadcrumb | undefined;
    const postRedactionHooks: SentryPostRedactionHooks = {
      beforeBreadcrumb(breadcrumb) {
        capturedBreadcrumb = breadcrumb;
        return breadcrumb;
      },
    };
    const options = buildInitOptions(postRedactionHooks);
    const beforeBreadcrumb = requireDefined(options.beforeBreadcrumb, 'Expected beforeBreadcrumb');

    const result = beforeBreadcrumb(buildPiiBreadcrumb());
    expect(result).not.toBeNull();

    const captured = requireDefined(
      capturedBreadcrumb,
      'Expected beforeBreadcrumb post-hook capture',
    );
    assertRedactedBreadcrumb(captured);
  });

  it('HOOKS_WITH_POST_REDACTION_SLOT enumerates exactly the SentryPostRedactionHooks keys', () => {
    // Protects against silently widening the consumer post-hook surface
    // without extending Part 2 coverage.
    const expected = new Set<keyof SentryPostRedactionHooks>([
      'beforeSend',
      'beforeSendTransaction',
      'beforeBreadcrumb',
    ]);
    expect(new Set(HOOKS_WITH_POST_REDACTION_SLOT)).toEqual(expected);
  });

  it('HOOKS_WITH_POST_REDACTION_SLOT and HOOKS_WITHOUT_POST_REDACTION_SLOT partition BARRIER_HOOKS', () => {
    // Every barrier hook is either in Part 2's post-hook coverage set or in the
    // direct-omission-only set. No overlap, no gap.
    const withSlot = new Set<BarrierHookName>(HOOKS_WITH_POST_REDACTION_SLOT);
    const withoutSlot = new Set<BarrierHookName>(HOOKS_WITHOUT_POST_REDACTION_SLOT);

    for (const hookName of BARRIER_HOOKS) {
      expect(
        withSlot.has(hookName) !== withoutSlot.has(hookName),
        `${hookName} must appear in exactly one of the two partition sets`,
      ).toBe(true);
    }
    expect(withSlot.size + withoutSlot.size).toBe(BARRIER_HOOKS.length);
  });
});

// --- Part 3: redacted-at-destination ------------------------------------

describe('ADR-160 Part 3: redacted-at-destination', () => {
  it('beforeSend: PII across multiple sub-fields emerges redacted', async () => {
    const options = buildInitOptions();
    const beforeSend = requireDefined(options.beforeSend, 'Expected beforeSend');

    // Pass a meaningful `hint` (per A.6 SR-7, sentry-reviewer) so the hint
    // pathway is exercised even if the current redactor doesn't branch on
    // hint content. Forward-compatible with any future hint-aware rule.
    const originalException = new Error('pii-bearing: super-secret-abc123');
    const result = await resolveHookReturn(beforeSend(buildPiiErrorEvent(), { originalException }));

    assertRedactedErrorEvent(result);
  });

  it('beforeSendTransaction: PII across headers, url, and transaction name emerges redacted', async () => {
    const options = buildInitOptions();
    const beforeSendTransaction = requireDefined(
      options.beforeSendTransaction,
      'Expected beforeSendTransaction',
    );

    const result = await resolveHookReturn(beforeSendTransaction(buildPiiTransactionEvent(), {}));

    expect(result.request?.headers).toEqual({ authorization: REDACTED_VALUE });
    expect(result.request?.url ?? '').not.toContain('supersecret');
    expect(result.transaction ?? '').not.toContain('supersecret');
    expect(JSON.stringify(result)).not.toContain('supersecret');
  });

  it('beforeBreadcrumb: PII in message and data emerges redacted', () => {
    const options = buildInitOptions();
    const beforeBreadcrumb = requireDefined(options.beforeBreadcrumb, 'Expected beforeBreadcrumb');

    const result = requireDefined(
      beforeBreadcrumb(buildPiiBreadcrumb()),
      'Expected beforeBreadcrumb to keep the breadcrumb',
    );

    expect(result.data).toEqual({
      authorization: REDACTED_VALUE,
      requestBody: { jsonrpc: '2.0', method: 'tools/call' },
    });
    expect(result.message ?? '').not.toContain('supersecret');
    expect(JSON.stringify(result)).not.toContain('supersecret');
  });

  it('beforeSendLog: PII in message and attributes emerges redacted and log is never dropped', () => {
    const options = buildInitOptions();
    const beforeSendLog = requireDefined(options.beforeSendLog, 'Expected beforeSendLog');

    const result = beforeSendLog(buildPiiLog());
    // Explicit never-null assertions for consistency with beforeSendSpan
    // (per A.6 TR-8, test-reviewer). Typed return admits `| null` but the
    // adapter never drops; this test pins that behaviour.
    expect(result).not.toBeNull();
    expect(result).not.toBeUndefined();
    const kept = requireDefined(result, 'Expected beforeSendLog to keep');

    expect(kept.message).toBe(`Bearer ${REDACTED_VALUE}`);
    expect(kept.attributes).toEqual({ apiKey: REDACTED_VALUE });
  });

  it('beforeSendSpan: PII in description and data emerges redacted and span is never dropped', () => {
    const options = buildInitOptions();
    const beforeSendSpan = requireDefined(options.beforeSendSpan, 'Expected beforeSendSpan');

    const result = beforeSendSpan(buildPiiSpan());

    // Contract: beforeSendSpan has no `| null` in its typed return.
    expect(result).not.toBeNull();
    expect(result).not.toBeUndefined();
    expect(result.description ?? '').not.toContain('supersecret');
    // Pattern-aware redaction: Bearer-prefixed string values have their token
    // replaced while the `Bearer` scheme is preserved as informational.
    expect(result.data['http.request.header.authorization']).toBe(`Bearer ${REDACTED_VALUE}`);
    expect(result.data['oak.span.raw_header']).toBe(`Bearer ${REDACTED_VALUE}`);
    // Closure proof: the raw token values do not appear anywhere in the span.
    const serialised = JSON.stringify(result);
    expect(serialised).not.toContain('super-secret-abc123');
    expect(serialised).not.toContain('oak-span-secret-zzz');
  });
});

// --- Automated bypass validation ----------------------------------------
//
// Proves the conformance tests above would fail if the redactor were
// removed for any one hook. Replaces the "manually comment out a hook"
// validation with a CI-runnable negative test. The helper constructs
// hooks without the redactor call for the named hook; the rest continue
// to use the shared redactor so the test narrows the failure to the
// specific hook being bypassed.

/**
 * Bypass-harness shape is pinned to the same `SentryRedactionHooks` type
 * the production adapter wires (per A.6 SR-5). A new hook added to
 * `createSentryHooks` in `runtime-sdk.ts` fails `pnpm type-check` here
 * until the harness adds a case — closing the drift the session plan's
 * first draft carried as a local `MinimalHooks` alias.
 */
function createSentryHooksWithBypass(excluded: BarrierHookName): SentryRedactionHooks {
  return {
    beforeSend: (event) => (excluded === 'beforeSend' ? event : redactSentryEvent(event)),
    beforeBreadcrumb: (breadcrumb) =>
      excluded === 'beforeBreadcrumb' ? breadcrumb : redactSentryBreadcrumb(breadcrumb),
    beforeSendLog: (log) => (excluded === 'beforeSendLog' ? log : redactSentryLog(log)),
    beforeSendSpan: (span) => (excluded === 'beforeSendSpan' ? span : redactSentrySpan(span)),
    beforeSendTransaction: (event) =>
      excluded === 'beforeSendTransaction' ? event : redactSentryTransaction(event),
  };
}

describe('ADR-160 bypass validation: omitting a redactor leaves PII visible', () => {
  it('beforeSend bypass leaks PII across every sub-field', async () => {
    const hooks = createSentryHooksWithBypass('beforeSend');
    const beforeSend = requireDefined(hooks.beforeSend, 'Expected bypass beforeSend');
    const result = await resolveHookReturn(beforeSend(buildPiiErrorEvent(), {}));

    assertBypassLeaksEveryErrorEventField(result);
  });

  it('beforeSendTransaction bypass leaks PII across headers, URL, and transaction name', async () => {
    const hooks = createSentryHooksWithBypass('beforeSendTransaction');
    const beforeSendTransaction = requireDefined(
      hooks.beforeSendTransaction,
      'Expected bypass beforeSendTransaction',
    );
    const result = await resolveHookReturn(beforeSendTransaction(buildPiiTransactionEvent(), {}));

    expect(result.request?.headers?.authorization).toBe(BEARER_TOKEN_VALUE);
    expect(result.request?.url ?? '').toContain('supersecret');
    expect(result.transaction ?? '').toContain('supersecret');
  });

  it('beforeBreadcrumb bypass leaks authorization header', () => {
    const hooks = createSentryHooksWithBypass('beforeBreadcrumb');
    const beforeBreadcrumb = requireDefined(
      hooks.beforeBreadcrumb,
      'Expected bypass beforeBreadcrumb',
    );
    const result = requireDefined(
      beforeBreadcrumb(buildPiiBreadcrumb()),
      'Expected bypass beforeBreadcrumb to keep the breadcrumb',
    );

    expect(result.data?.['authorization']).toBe(BEARER_TOKEN_VALUE);
  });

  it('beforeSendLog bypass leaks Bearer token and api key', () => {
    const hooks = createSentryHooksWithBypass('beforeSendLog');
    const beforeSendLog = requireDefined(hooks.beforeSendLog, 'Expected bypass beforeSendLog');
    const result = requireDefined(
      beforeSendLog(buildPiiLog()),
      'Expected bypass beforeSendLog to keep',
    );

    expect(result.message).toBe(BEARER_TOKEN_VALUE);
    expect(result.attributes).toEqual({ apiKey: API_KEY_VALUE });
  });

  it('beforeSendSpan bypass leaks span data secrets', () => {
    const hooks = createSentryHooksWithBypass('beforeSendSpan');
    const beforeSendSpan = requireDefined(hooks.beforeSendSpan, 'Expected bypass beforeSendSpan');
    const result = beforeSendSpan(buildPiiSpan());

    expect(result.data['http.request.header.authorization']).toBe(BEARER_TOKEN_VALUE);
    expect(result.data['oak.span.raw_header']).toBe('Bearer oak-span-secret-zzz');
  });

  it('SentryRedactionHooks keys and BARRIER_HOOKS are set-equal (structural closure gate)', () => {
    // Per A.6 SR-5. Exercises the compile-time coupling between the adapter
    // return type and this file's explicit registry. If `createSentryHooks`
    // in `runtime-sdk.ts` adds or removes a hook, the import of
    // `SentryRedactionHooks` forces a type-check break here unless
    // `BARRIER_HOOKS` is updated in the same change set.
    //
    // The `satisfies` helper declaration below is the compile-time enforce-
    // edge; the runtime assertion keeps the claim visible in the test
    // report.
    type KeysOfSentryRedactionHooks = keyof SentryRedactionHooks;
    const registryMatchesHookType = (hookName: BarrierHookName): KeysOfSentryRedactionHooks =>
      hookName;
    const byLocale = (a: string, b: string): number => a.localeCompare(b);
    expect(BARRIER_HOOKS.map(registryMatchesHookType).toSorted(byLocale)).toEqual(
      [...BARRIER_HOOKS].toSorted(byLocale),
    );
  });
});
