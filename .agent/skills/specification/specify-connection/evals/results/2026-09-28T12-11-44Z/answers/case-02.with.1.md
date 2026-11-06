**Short answer: No, not as stated.** The two contracts only guarantee that the retries of a single call can't turn into two charges. "A customer is never charged twice" is a much bigger claim, and several ways of double charging never involve a retry at all. The reliance holds only under conditions that neither contract currently states.

## What each contract actually covers

| | Guarantee | What it doesn't say |
|---|---|---|
| **P** | At most one charge per idempotency key | How long it remembers a key; what the key is scoped to; what happens if the same key arrives with a different request; what happens if a second request arrives while the first is still running |
| **S** | Every retry of a call reuses the same key | How the key is created; whether it's tied to the purchase; whether it's saved anywhere; whether it survives a crash or restart |

Put together, what they prove is: **retries of one call, while P still remembers the key, produce at most one charge.** The intended reliance is about one charge per purchase, per customer, over all time. The gap between those two statements is where things break.

## Cases where both contracts hold and the customer is still charged twice

1. **The key is lost in a crash.** S sends the charge, P charges the card, S crashes before recording the result. On restart, S makes a new key and charges again. The retry rule is never broken, because this isn't a retry.
2. **A second request for the same purchase.** The customer double-clicks, a queue delivers a message twice, or a job re-runs. S treats each as a new call with a new key, and P correctly charges both.
3. **P has forgotten the key.** A delayed retry or a manual replay arrives after P's retention window. To P it's a new key, so it charges again.
4. **Wrong key scope.** S sends to a different merchant account, region, or fallback provider. Keys are separate there, so the at-most-once guarantee doesn't carry across.
5. **Same key, different request.** A retry is rebuilt with a changed amount or currency. P's behaviour here isn't specified, so we can't tell whether it would charge.
6. **"Processed" isn't the same as "charged."** If P's promise is about its API handling the request, not about what reaches the card network, a failure on P's side could still leave two authorizations or captures. The contract doesn't say which it means.

Cases 1–2 break the reliance without anyone violating a contract. Cases 3–6 depend on things the contracts leave out.

## When the reliance does hold

It holds only if all of these are true:
- **(a)** The key is tied to the purchase itself (for example, based on the order ID) and saved before the first send, so crashes and restarts reuse it.
- **(b)** S never creates a second charge attempt for the same purchase.
- **(c)** Every retry happens within P's key retention window.
- **(d)** Retries send an identical request.
- **(e)** All requests go to the same key scope at P.
- **(f)** P's "processed at most once" means at most one charge on the card.

## What each side needs to add

**S needs to state:**
- how the key is derived from the purchase and when it's saved (the saving must happen before the first send);
- that there is exactly one charge attempt per purchase, including when messages are delivered twice or users click twice;
- the maximum time from first attempt to last retry, which must fit inside P's retention window;
- that retries send exactly the same request.

**P needs to state:**
- how long it remembers keys;
- what a key is scoped to (account, region);
- what it does with the same key and a different request (reject it or return the original result);
- what it does if a second request arrives while the first is still running;
- whether "processed" means one charge on the card.

**Missing evidence:** P's documentation on retention and scope; S's crash-recovery path showing the key is saved before sending; a test where the same message is delivered twice; and ideally a regular check comparing S's orders against P's charges, which would catch any case the reasoning above missed.

The retry path is covered. The claim "never charged twice" isn't, until S ties the key to the purchase and saves it, and P publishes its retention window and key scope.
