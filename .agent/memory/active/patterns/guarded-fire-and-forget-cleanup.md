---
name: "Guarded Fire-and-Forget Cleanup"
polarity: pattern
use_this_when: "You have async cleanup (close, flush, disconnect) that runs after the response is sent and cannot be awaited by the caller"
category: code
proven_in: "apps/oak-curriculum-mcp-streamable-http/src/mcp-handler.ts"
proven_date: 2026-03-30
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Silent error swallowing in fire-and-forget cleanup; indefinite cleanup hangs from stalled close operations; timeout timers leaking after cleanup wins; logger failures masking the original resource-leak error"
  stable: true
---

> **POLARITY: PATTERN.** This entry names a *shape to repeat*, not a failure mode to avoid.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern) for the polarity discipline.

# Guarded Fire-and-Forget Cleanup

## Pattern

When async cleanup runs in a fire-and-forget context (e.g.
`res.on('close', ...)`), apply four guards:

1. **Timeout** — prevent indefinite hangs from stalled close operations
2. **Safe error logging** — isolate logger and observability calls in
   try-catch so a broken logger never masks the original error
3. **Catch on the outer promise** — ensure timeout rejections are visible
4. **Timer disposal** — clear the timeout in `finally` so fast successful
   cleanup does not leave the timer alive until it fires

## Anti-Pattern

```typescript
// ❌ Unguarded — six failure modes
res.on('close', () => {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('cleanup timeout')), 5000);
  });

  void Promise.race([Promise.allSettled([transport.close(), server.close()]), timeout])
    .then((results) => {
      if (!Array.isArray(results)) return;
      for (const result of results) {
        if (result.status === 'rejected') {
          log?.error('cleanup failed', result.reason);  // Can throw
          observability.capture(result.reason);          // Can throw
        }
      }
    });
    // No .catch(); no .finally() to clear the timeout.
});
```

## Correct Pattern

```typescript
// ✅ Guarded — timeout, timer cleanup, safe logging, outer catch
function safeLogError(error: unknown, log: Logger | undefined): void {
  try { log?.error('cleanup failed', normalizeError(error)); } catch { /* */ }
  try { observability.captureHandledError(error, { boundary: 'cleanup' }); } catch { /* */ }
}

res.on('close', () => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('cleanup timeout')), 5000);
  });

  void Promise.race([
    Promise.allSettled([transport.close(), server.close()]),
    timeout,
  ])
    .then((results) => {
      if (!Array.isArray(results)) return;
      for (const result of results) {
        if (result.status === 'rejected') {
          safeLogError(result.reason, log);
        }
      }
    })
    .catch((err) => safeLogError(err, log))
    .finally(() => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    });
});
```

## Why

- `void` discards the promise — any unhandled rejection in `.then()` is
  invisible
- `Promise.race([work, timeout])` does not cancel the losing promise; if
  `work` wins and the timer is not cleared, the timeout remains live until it
  fires
- Logger and observability calls can throw (sink failure, circular
  reference in error object, Sentry client failure)
- Without a timeout, a stalled `close()` hangs the cleanup forever,
  leading to file descriptor exhaustion under load
- On serverless (Vercel, Lambda), the process can freeze before
  fire-and-forget cleanup runs — the timeout bounds the worst case
