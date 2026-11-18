**Yes, the customer can be charged twice**, unless some conditions hold that nothing you've described guarantees. I had no contracts or code to check (the working directory is empty), so this is based only on the two promises you stated.

## Why the two promises don't combine the way you'd hope

"At-most-once processing" is a promise about **one request**. The provider won't run a request it has already seen a second time. But the provider has to decide what counts as "the same request," and it can only go by what the client sends.

A client retry usually happens after a timeout or a dropped connection. In that case the client doesn't know whether the first attempt went through. If the retry doesn't look like the same request to the provider, the provider treats it as a new one and processes it once too. Each request was processed at most once, both promises were kept, and the customer paid twice.

## When double charging is prevented

All of these must hold:

1. **The provider removes duplicates by a key the client supplies** (an idempotency key), not by its own delivery ID or connection. This is a question for the provider's contract. If it's silent on this, treat that as a gap.
2. **The client makes the key once per purchase and reuses it on every retry.** The key must be created before the first attempt and saved so it survives crashes, restarts and a move to another server. A key made fresh on each attempt gives no protection.
3. **The provider remembers keys at least as long as the client keeps retrying.** This includes retries that are queued, replayed after an outage, or triggered by the user.
4. **A retry that arrives while the first attempt is still running gets the first attempt's result.** It must not be processed as a new charge.
5. **The provider's key covers the right scope.** The key is tied to the account or merchant, and a request that reuses a key with different contents (amount, card) is rejected, not quietly accepted.

If any one of these fails, a double charge is possible.

## Failure cases to test

| Case | Both sides behave as promised? | Result |
|---|---|---|
| Timeout, then a retry with a **new** key or no key | Yes | Two charges |
| Client crashes after sending; on restart it can't find the key and makes a new one | Yes | Two charges |
| Retry happens after the provider has forgotten the key (e.g. a replay the next day) | Yes | Two charges |
| Two retries sent at the same moment, and the provider checks the key before saving it | Yes, if the contract doesn't cover this | Two charges |
| User clicks "Pay" twice (two purchases as far as the system knows) | Yes | Two charges; retries can't fix this, it needs a separate rule |
| First attempt never reached the provider, and the client stops retrying | Yes | **Zero** charges |

The last row matters too. At-most-once plus limited retries can end with the customer never being charged, and the client may not know which outcome happened. Something has to settle that uncertainty, such as looking up the charge by its key or matching records afterwards.

## What to check

- **Provider:** does it promise duplicate removal by client key? How long does it keep keys, what scope do they cover, and what happens with a concurrent retry or a reused key with different contents? If the contract doesn't say, ask the provider to write it down.
- **Client:** is the key made once per purchase and saved before the first send? Do retries stop before the provider forgets keys? When an outcome is unknown, does the client look it up before sending again?
- **Evidence:** a test that injects a timeout, a test that restarts the client mid-retry, a test with concurrent retries, and production monitoring that flags two successful charges for one order.

If you share the provider's API documentation and your retry code, I can check each of these conditions against them.
