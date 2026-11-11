**Short answer: yes, it can happen.** The two promises don't combine the way it seems. Whether it happens depends on one thing neither promise covers: whether a retry is recognised as the same charge.

I found no payment or retry code in this repo, so this is based only on the two promises as you described them. The specific client and provider contracts weren't available.

## Why the two promises don't prevent it

- **What "at-most-once" covers:** the provider won't run *one request* more than once. For example, it won't replay a message it already received.
- **What a retry is:** a *new request*. To the provider it is a second charge unless something ties it to the first one. Each request can be processed at most once, and the customer is still charged twice.
- **Why the client retries at all:** after a timeout, the client can't tell "the charge never ran" apart from "the charge ran but the reply was lost." At-most-once allows both outcomes. Retrying fixes the first case and causes a double charge in the second.

## The case that breaks it

1. The client sends a charge for $50.
2. The provider charges the card and sends a reply.
3. The reply is lost or the client times out.
4. The client retries with the same details.
5. The provider sees a new request and charges $50 again.

Neither side broke its own promise, and the customer paid $100.

## What makes it safe

You're protected only if all of these are true. Each one needs checking against the actual provider documentation and client code:

1. **Stable idempotency key.** The client creates one key per payment, before the first attempt, and every retry reuses it. It must be stored durably so a client restart doesn't produce a new key.
2. **Provider deduplicates on that key.** The provider has to explicitly promise that a repeated key returns the original result instead of charging again. At-most-once delivery does not imply this.
3. **Retries stay inside the dedup window.** Keys often expire after something like 24 hours, and a retry after that charges again. Retry queues, manual "resubmit" actions and batch replays are the usual ways to hit this.
4. **Overlapping attempts are handled.** If a retry arrives while the first attempt is still running, the provider must block or wait, not process both.
5. **Only one route creates charges.** A second way of creating the same charge (a fallback provider, a webhook-triggered charge, or a separate checkout flow) needs to share the same key or a lock.
6. **Key reuse is safe.** If the same key comes back with a different amount, the provider should reject it rather than silently accept it.

## Who needs to fix what

- **Provider:** get a written guarantee on deduplication by key: how long keys last, how concurrent requests are handled, and what happens when a key is reused with different details. If they only offer at-most-once delivery, the next item has to carry the whole guarantee.
- **Client:** create and store the key per payment, reuse it on every retry, and stop retrying before the dedup window closes. After an unclear failure, it's safer to look up the charge's status than to send the charge again blindly.
- **Operations:** as a backstop, reconcile charges against orders (for example, flag two charges for the same order and amount) so any duplicate that gets through is found and refunded.

## What's still unknown

- Whether the provider's API has idempotency keys at all, and what it promises about them.
- Whether the client sends one, and whether it stays the same across retries and restarts.
- The retry schedule compared with the key lifetime.

If you can point me to the client's payment code or the provider's API docs, I can tell you which of these cases actually apply.
