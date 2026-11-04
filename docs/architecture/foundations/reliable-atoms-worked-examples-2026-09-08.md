---
boundary: B2-Architecture
doc_role: reference
authority: reliable-atoms-worked-examples
status: active
last_reviewed: 2026-09-09
---

# Reliable Atoms: worked examples and composition boundaries

8 September 2026 · revision 2 · worked expectations against design contracts

The [governing development policy](algorithms-and-data-structures-governance-2026-09-08.md) governs reference-informed authorship and independent qualification for these examples. These examples make the [Reliable Atoms and composition architecture](reliable-atoms-and-composition-architecture-2026-09-08.md) concrete. The [queue specification, revision 3](oce-queue-reliable-atom-2026-09-08.md) owns all queue facts. Sections 5 and 6 below own two explicitly illustrative composition profiles; their rules apply only to those examples, not to every atom or composition.

**Evidence status:** these are manually worked expected results and proposed discriminating observations. No example is an executed test, no seeded fault has been run, and no implementation is qualified. Later implementation must turn applicable cases into machine-verified examples and supply the broader contract, mutation, type, consumption and performance evidence. A small correct table is useful design evidence, not an assurance campaign.

In the tables, `Ok(—)` abbreviates canonical `{ ok: true, value: undefined }`; `Err(CODE)` abbreviates `{ ok: false, error: { code: CODE } }`; `Present(x)` is `{ kind: 'present', value: x }`; and `Empty` is `{ kind: 'empty' }`. These are reading notation, not additional API types. Bracketed lists show a specification model's next-removal order, never a public heap array.

## 1. Priority and arrival answer different questions

Take a fresh queue with capacity 4. Priorities are numbers; A, B, C and D are distinct payload occurrences.

| Operation               | Expected result                          | Next-removal order | Size |
| ----------------------- | ---------------------------------------- | ------------------ | ---: |
| `enqueue(2, A)`         | `Ok(—)`                                  | A                  |    1 |
| `enqueue(1, B)`         | `Ok(—)`                                  | B, A               |    2 |
| `enqueue(2, C)`         | `Ok(—)`                                  | B, A, C            |    3 |
| `peek()`                | `Present(B)`                             | B, A, C            |    3 |
| `take()`                | `Present(B)`                             | A, C               |    2 |
| `enqueue(2, D)`         | `Ok(—)`                                  | A, C, D            |    3 |
| Three calls to `take()` | `Present(A)`, `Present(C)`, `Present(D)` | Empty              |    0 |
| `take()`                | `Empty`                                  | Empty              |    0 |

A FIFO queue over the first three arrivals would return A, B, C. This queue returns B first because priority 1 precedes priority 2. Stability governs A before C before D within the equal-priority class; it does not override the earlier numerical priority. A graph breadth-first traversal that needs only FIFO should use a separately specified FIFO capability, or justify its use of this wider contract.

The queue owns numeric ordering, multiplicity and ties. A domain scorer owns the significance of numbers 1 and 2. A scheduler additionally owns whether a removed task starts, can be cancelled or has completed. Returning B from a queue proves none of those lifecycle facts.

A reversed comparison should make the second insertion's next item A and be detected. A reversed tie rule should make C or D precede A. A peek that removes B could pass a test inspecting only its returned value; the size and subsequent take observations above expose that fault. These are expected fault detections, not reported mutation results.

## 2. Captured priority, shared payload and explicit presence

Let `ticket` be an object whose fields initially include `{ label: 'draft', score: 5 }`. Let `p = ticket.score`. Use a fresh capacity-3 queue.

| Action                                                                     | Expected consequence                                                                          |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `enqueue(p, ticket)`                                                       | One occurrence captures priority 5.                                                           |
| Set `p = -100`; set `ticket.score = -100`; set `ticket.label = 'revised'`. | Ordering metadata stays 5. The caller's object now has the changed fields.                    |
| `enqueue(3, 'other')`                                                      | The string occurrence precedes `ticket`.                                                      |
| `take()`                                                                   | `Present('other')`, size 1.                                                                   |
| `take()`                                                                   | `Present(ticket)` by the original object identity; observing its label now gives `'revised'`. |

The result is neither a deep snapshot nor a recalculated priority. Capturing a numeric argument is sufficient for ordering isolation while retaining a payload reference. A `Readonly<T>` annotation would not justify a stronger object-immutability guarantee. A seeded fault that stores the payload and later reads `ticket.score` should return `ticket` first and fail this example.

In a fresh capacity-3 queue, enqueue `(0, undefined)`, `(0, null)` and `(0, false)`. The four takes must be `Present(undefined)`, `Present(null)`, `Present(false)`, then `Empty`. The first result has a `value` field containing `undefined`; the last is the empty variant. A truthiness check would conflate legitimate payloads with absence.

Enqueuing the same object twice produces two occurrences and two successful removals of that reference. Removing the first releases its entry's reference, while the second occurrence legitimately retains the same payload. Result wrappers must not expose mutable entry records. A proxy payload, including a revoked proxy, need only be stored and returned by identity: no queue operation needs to read its properties or coerce it. Inspection of a returned proxy is the caller's operation.

For sign-of-zero and extreme-value coverage, enqueue `(-0, Z1)`, `(+0, Z2)`, `(-Number.MAX_VALUE, L)` and `(Number.MAX_VALUE, H)` in a capacity-4 queue. Drain order is L, Z1, Z2, H. In a second fresh queue, enqueue `(+0, Z3)` before `(-0, Z4)`; drain order must be Z3, Z4. Both arrival directions distinguish FIFO ties from assigning either sign of zero a fixed precedence; the extreme values expose wrong numeric ordering. The no-subtraction design obligation additionally needs appropriate code/arithmetic evidence: an infinite subtraction can sometimes preserve a sign, so this table alone cannot prove that forbidden mechanism absent.

## 3. Capacity and failure precedence preserve future behaviour

A constructor input of 0 is valid. A valid-priority insertion into that queue yields `CAPACITY_EXCEEDED`; an insertion with `NaN` yields `INVALID_PRIORITY`. Construction with `-1`, `1.5`, infinity or `2^32` yields `INVALID_MAX_SIZE` and no queue. `2^32 − 1` is a legal limit; accepting that limit does not preallocate billions of entries or reserve enough memory to fill them.

For a capacity-2 queue:

| Operation             | Expected result            | Retained order |
| --------------------- | -------------------------- | -------------- |
| `enqueue(2, A)`       | `Ok(—)`                    | A              |
| `enqueue(1, B)`       | `Ok(—)`                    | B, A           |
| `enqueue(NaN, C)`     | `Err(INVALID_PRIORITY)`    | B, A           |
| `enqueue(0, C)`       | `Err(CAPACITY_EXCEEDED)`   | B, A           |
| `take()`              | `Present(B)`               | A              |
| `enqueue(2, C)`       | `Ok(—)`                    | A, C           |
| Two calls to `take()` | `Present(A)`, `Present(C)` | Empty          |

Capacity is admission, not top-k eviction. Rejecting C cannot discard A or B. A typed failure whose implementation first increments an ordinal is also wrong, even if this short table's size and order look correct: it changes when future insertion exhausts. The ordinal example below makes that otherwise distant effect inspectable in a small model.

No malformed priority is coerced. An object with a throwing `valueOf` is rejected as `INVALID_PRIORITY` without invoking the hook. The queue does not perform input conversion on the consumer's behalf. Type fixtures reject a string priority statically; runtime negative cases are still needed because TypeScript's `number` admits `NaN` and untyped callers exist.

## 4. Exact exhaustion and reset without a production bypass

The queue contract fixes M at `Number.MAX_SAFE_INTEGER`. The following is an **independent specification model** with a deliberately tiny ordinal universe: allocate 0, 1 and 2; next ordinal 3 means exhausted. Its capacity is 3. It is not a production constructor option, hidden environment switch or implementation test backdoor.

| Operation               | Result              | Model retained order | Model next ordinal |
| ----------------------- | ------------------- | -------------------- | -----------------: |
| Enqueue A at priority 0 | Success             | A                    |                  1 |
| Enqueue B at priority 0 | Success             | A, B                 |                  2 |
| Take                    | A                   | B                    |                  2 |
| Enqueue C at priority 0 | Success             | B, C                 |                  3 |
| Enqueue D at priority 0 | `ORDINAL_EXHAUSTED` | B, C                 |                  3 |
| Enqueue D with `NaN`    | `INVALID_PRIORITY`  | B, C                 |                  3 |
| Take                    | B                   | C                    |                  3 |
| Enqueue D at priority 0 | `ORDINAL_EXHAUSTED` | C                    |                  3 |
| Take                    | C                   | Empty                |                  0 |
| Enqueue D at priority 0 | Success             | D                    |                  1 |

Removing B did not reset ordinals because C remained. Resetting after every removal would admit D too early and could reverse equal-priority order. Resetting only on a later empty read would wrongly reject insertion immediately after the last successful take. Consuming an ordinal on rejection can be tested in a fresh model trace by rejecting an invalid priority between otherwise successful insertions.

For combined precedence, fill a fresh version of this model with A, B and C without removal. Its size and counter are both 3. Valid-priority D fails with `CAPACITY_EXCEEDED`; invalid-priority D fails with `INVALID_PRIORITY`. If capacity were 4, valid D would instead fail with `ORDINAL_EXHAUSTED`.

The production numerical boundary still needs separate evidence. For a valid nonempty internal state with next ordinal M − 1 and spare capacity, the last allowed enqueue must allocate M − 1 and leave next ordinal M; the following valid nonfull enqueue must fail before mutation. An implementation-specific proof or private arithmetic test must reach the actual guard and constant. A short public trace cannot stand in for that evidence, and proving the reduced model does not prove the production implementation.

## 5. A separate scoring composition owns callback failure

**Local illustrative contract P1.** A synchronous scoring composition privately owns a queue constructed under the queue contract. It exposes submission, peek, take and size through its own boundary; callers and the scorer receive no raw queue reference. Construction checks that the scorer is callable first (`INVALID_SCORER`), then applies the queue capacity constructor and preserves its rejection. Success returns the composition in canonical Result. The supported scorer takes a payload and returns canonical `Result<number, E>` or throws a value. It terminates, returns a well-formed data Result when it returns, and does not reenter this composition. The adopting composition must establish these callback premises; this example does not claim to prove arbitrary caller code trustworthy.

Submission evaluates the scorer before any queue mutation. A returned `Err(e)` becomes a composition error `{ code: 'SCORING_REJECTED', cause: e }`; a thrown value `x` becomes `{ code: 'SCORING_THROWN', cause: x }`, preserving the original cause by identity where applicable. A returned successful number is submitted to the queue exactly once. Queue rejection is passed through with its queue error code. A successful nonfinite score therefore yields `INVALID_PRIORITY`. Scoring failure performs no queue operation. Since scoring comes first, its failure also precedes a queue-capacity failure when full.

The unchanged-state promise concerns owned queue state. The composition does not undo arbitrary scorer effects on external objects, I/O or the shared payload. This profile admits no claim of transactionality over those effects. A nonterminating or reentrant scorer violates the profile's premises; catching exceptions does not repair those violations.

Start with A successfully admitted at priority 5, capacity 2:

| Submission's scorer outcome  | Public result                             | Queue after submission |
| ---------------------------- | ----------------------------------------- | ---------------------- |
| B returns failure `badInput` | `SCORING_REJECTED`, cause is `badInput`   | A only, size 1         |
| B throws object `boom`       | `SCORING_THROWN`, cause is exactly `boom` | A only, size 1         |
| B succeeds with `NaN`        | Queue `INVALID_PRIORITY`                  | A only, size 1         |
| B succeeds with 1            | Success                                   | B, A; size 2           |
| C succeeds with 0            | Queue `CAPACITY_EXCEEDED`                 | B, A; size 2           |

A callback invoked inside an in-place sift could leave a different recovery obligation. P1 eliminates that situation structurally: evaluation finishes before queue mutation. It does not add comparator injection to the numeric atom. A manually seeded fault that enqueues before scoring, invokes enqueue twice, drops the cause, or converts a scoring failure to priority 0 should be detected through result, identity, size and complete drain observations.

## 6. Generalisation: an exact count window

**Local illustrative contract N1.** A pure checked-add atom accepts primitive nonnegative safe integers `a`, `b` and `maxTotal`. Validate `maxTotal` first (`INVALID_LIMIT`), then `a` and `b` (`INVALID_OPERAND`); `-0` is canonical zero. If `a > maxTotal` or `b > maxTotal − a`, return `TOTAL_EXCEEDED`; otherwise return exact `a + b`. It performs no coercion, approximation or mutation. Results use canonical `Result`. The guard precedes addition, so an over-limit rounded sum cannot become a successful value.

**Local illustrative contract N2.** A count-window composition captures a positive safe-integer `maxCount` and a nonnegative safe-integer `maxTotal`; construction checks them in that order, returning `INVALID_COUNT` or `INVALID_LIMIT`, and starts empty with canonical positive zero total. Fallible operations use canonical Result; successful append returns `Ok(—)`, while count and total are exact live reads. It owns an occurrence sequence and exact total, exposes append plus current count and total, and keeps constituent mutators private. Append validates a primitive nonnegative safe integer (`INVALID_VALUE`) before other work. It proposes dropping the oldest occurrence if full, then adds the new value to the residual total using N1. Success publishes sequence membership and total together. `TOTAL_EXCEEDED` leaves both unchanged. Values are captured numbers with `-0` canonicalised to `+0`, and zeros occupy slots. These local profiles assume conforming language operations and available resources; they make no recovery promise after process or allocation failure. No clock, duration, expiry scheduler or statistical inference is involved.

For maxCount 3 and maxTotal 10:

| Append | Candidate calculation          | Outcome          | Retained sequence, oldest first | Total |
| -----: | ------------------------------ | ---------------- | ------------------------------- | ----: |
|      2 | 0 + 2                          | Success          | [2]                             |     2 |
|      3 | 2 + 3                          | Success          | [2, 3]                          |     5 |
|      4 | 5 + 4                          | Success          | [2, 3, 4]                       |     9 |
|      1 | (9 − 2) + 1                    | Success          | [3, 4, 1]                       |     8 |
|      5 | (8 − 3) + 5                    | Success          | [4, 1, 5]                       |    10 |
|     10 | (10 − 4) + 10 exceeds 10       | `TOTAL_EXCEEDED` | [4, 1, 5]                       |    10 |
|      0 | (10 − 4) + 0                   | Success          | [1, 5, 0]                       |     6 |
|     −1 | Invalid before membership work | `INVALID_VALUE`  | [1, 5, 0]                       |     6 |

This example deliberately distinguishes final-window admission from checking the old total plus the new value. Appending 5 to [3, 4, 1] is valid: the oldest 3 leaves and the total becomes 10. Treating 8 + 5 = 13 as the candidate would reject a valid transition. Conversely, removing 4 before discovering the failed append of 10 would corrupt the later append of zero. A further observation after that rejection is essential to expose partial mutation.

N1 owns exact arithmetic and its error contract. N2 owns oldest-occurrence membership, replacement order, conservation and publication of the two consistent state observations. A correct adder does not prove those sequence laws. A domain consumer still decides what a counted observation means; a correct sum does not establish measurement accuracy or evidence quality.

Use an independent list model that recomputes the candidate window's mathematical sum, without sharing the production incremental-total helper. Meaningful seeded faults include evicting newest, treating zero as absent, checking the pre-eviction total, forgetting subtraction, rounding/coercing invalid values, publishing membership before validation and updating total without membership. Check both the immediate failure and a later successful append. This gives the common architecture a non-graph, non-queue-policy test without inventing mandatory transactions for stateless arithmetic.

## 7. What these examples establish and what remains

The design consequences are inspectable: priority differs from arrival, capture differs from object immutability, absence differs from failure, capacity differs from lifetime ordinal exhaustion, and a composition owns new coordination and failure semantics. The window additionally exposes a plausible but incorrect admission calculation through one small trace.

Implementation evidence must now discriminate the named faults over actual production code, exact bounds and the public consumed form. Representative examples should be drawn into the canonical API documentation and executed there; this worked design explanation should point to that evidence once it exists, without becoming a competing source for queue facts. The qualification requirements remain in the general architecture and the queue-specific acceptance section.
