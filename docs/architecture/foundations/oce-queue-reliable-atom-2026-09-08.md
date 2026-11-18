---
boundary: B2-Architecture
doc_role: reference
authority: oce-queue-reliable-atom-specification
status: active
last_reviewed: 2026-09-25
---

# OCE stable priority queue Component

25 September 2026 · revision 4 · working design and acceptance specification

**Purpose:** specify one small, self-contained stable priority queue with a complete behavioural contract and a clear qualification boundary. Its implementation will be authored in the estate, informed by openly licensed references under the [governing development policy](algorithms-and-data-structures-governance-2026-09-08.md).

**Status:** the shared quality requirements are mandatory. The concrete key, API and bound decisions below are **working design choices**, closed for this design baseline and revisable on stated evidence; they are not additional owner mandates. The implementation-origin policy is owner-established; mechanism design and qualification have their own evidence requirements. No queue implementation, executable examples, tests, mutation campaign, benchmark or repository gate is reported as completed here.

The [Capability Foundations and composition architecture](reliable-atoms-and-composition-architecture-2026-09-08.md) is the normative home for R01–R10, C01–C08, common assurance, documentation and complexity requirements. This document owns queue-specific semantics, acceptance evidence and provenance. [Worked examples](reliable-atoms-worked-examples-2026-09-08.md) illustrate this contract and separately defined compositions; they do not add hidden queue requirements.

This is a **Component/Facility**: it composes heap behaviour, captured numeric
priority and stable-tie policy, and imports canonical Result. The
[adoption profile](capability-foundations-adoption.md) owns the preceding
geometry-to-heap contract; this queue is a later scope. Its concrete behavioural
laws below remain the candidate contract, not a claim of Primitive independence.

## 1. Responsibility and design rationale

**Retain every successfully enqueued occurrence and expose or remove the next occurrence in ascending numeric priority, preserving insertion order among equal priorities.**

A successfully enqueued occurrence consists conceptually of a captured priority, a payload and a private arrival ordinal. Equal priorities and repeated references to the same payload remain distinct occurrences. This is a stable priority queue; a plain FIFO queue orders all occurrences by arrival and is a distinct responsibility. Assigning one priority to every occurrence produces FIFO behaviour within this queue's bounds, but does not establish the priority capability is needed by every FIFO consumer.

The selected responsibility uses **finite primitive JavaScript numbers**, captured by value, with minimum priority first. This working choice makes priority meaning and ordering cost explicit. Domain scoring belongs to a separately specified composition; the capability owns captured scalar ordering and occurrence preservation.

Domain code establishes what a priority means and whether its numerical precision is appropriate. The queue orders the actual supplied binary64 values; it cannot recover distinctions already lost while calculating a score. It admits finite fractions, negative values, subnormal values and magnitudes outside the safe-integer range as priorities. Safe-integer restrictions apply separately to capacity and ordinals.

A demonstrated need for lexicographic keys, exact integers beyond number precision, a different equality/order domain, or priorities not faithfully representable as finite numbers reopens the key-domain decision. Such a need earns a separately specified responsibility or a deliberate replacement contract with the same assurance bar. There is no comparator option, generic fallback or compatibility branch in this capability.

The queue is synchronous and private to one instance. It owns ordering metadata and storage; it performs no I/O, scheduling, scoring, persistence, retries, cancellation, logging or deduplication. A binary min-heap is the candidate mechanism, with private representation.

## 2. Exact public surface

The following is a declarative TypeScript contract, not an implemented module or a claimed compiled example. Public export names and outcome discriminants are fixed for this working baseline. The eventual package/import specifier remains a delivery decision.

```typescript
import type { Result } from '@oaknational/result';

export type QueueConstructionError = {
  readonly code: 'INVALID_MAX_SIZE';
};

export type QueueEnqueueError =
  | { readonly code: 'INVALID_PRIORITY' }
  | { readonly code: 'CAPACITY_EXCEEDED' }
  | { readonly code: 'ORDINAL_EXHAUSTED' };

export type QueueRead<T> =
  { readonly kind: 'empty' } | { readonly kind: 'present'; readonly value: T };

export interface StablePriorityQueue<T> {
  readonly enqueue: (priority: number, value: T) => Result<void, QueueEnqueueError>;
  readonly peek: () => QueueRead<T>;
  readonly take: () => QueueRead<T>;
  readonly size: number;
}

export declare function createStablePriorityQueue<T>(
  maxSize: number,
): Result<StablePriorityQueue<T>, QueueConstructionError>;
```

`Result` is the estate's [canonical type](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/270b8ec6fb82dc6881c10ca101cb8d3c7a242d6e/packages/core/result/src/result-type.ts), publicly exported by [its index](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/270b8ec6fb82dc6881c10ca101cb8d3c7a242d6e/packages/core/result/src/index.ts). Success uses `ok: true` and `value`; failure uses `ok: false` and `error`. A successful enqueue returns `{ ok: true, value: undefined }`. It does not return a newly invented Result union. `QueueRead<T>` describes normal presence/absence, so `peek` and `take` do not add an impossible error arm or treat an empty queue as a failure.

The working dependency budget is **zero runtime package imports** and a declared type-only dependency on `@oaknational/result`. Structural outcome objects are checked against that imported type; no copied Result definition or duplicate helper library is introduced. Declaration consumption must resolve the canonical type through the eventual package's declared dependency arrangement. An erased import alone is not proof of a correctly consumable package.

| Operation                  | Exact state and outcome contract                                                                                                                                            |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Construction               | Validate `maxSize`; success creates an empty independent instance with captured capacity, size 0 and next ordinal 0. Invalid input returns `INVALID_MAX_SIZE` and no queue. |
| `enqueue(priority, value)` | Apply §3 validation in order. Success retains exactly one new occurrence and increases size by one. Every declared rejection preserves all queue state.                     |
| `peek()`                   | Return `present` with the next payload, or `empty`; preserve every occurrence, size and ordinal state.                                                                      |
| `take()`                   | Return and remove exactly the occurrence `peek()` would identify, or return `empty` without change. Last removal resets the next ordinal to zero.                           |
| `size`                     | Read the current exact number of retained occurrences; reading it changes no state.                                                                                         |

Callables are bound to their originating instance: taking a reference to `queue.take` and calling it without a receiver has the same effect as `queue.take()`. A supplied receiver cannot retarget it. Returned outcome records must not expose private entries or a reusable mutable object that could corrupt later observations. Payload references remain shared as specified in §4; readonly result fields do not freeze payload objects.

Payload type `T` admits `undefined`, `null` and all other values. At an untyped call boundary, an omitted payload is the JavaScript value `undefined`; the queue cannot validate a compile-time `T`. Argument evaluation happens before the operation begins and is outside its state guarantee. Dynamic capacity and priority inputs are checked even when their runtime values defeat the declared number types.

No heap-array access, root replacement, iteration, arbitrary removal, batching, priority update, decrease-key, cancellation, top-k selection, `clear`, ordinal setter or comparator injection is public.

## 3. Ordering, rejection precedence and exact bounds

### Priority domain and comparison

A legal priority satisfies `typeof priority === 'number'` and `Number.isFinite(priority)`. Reject `NaN`, infinities, strings, boxed numbers, `bigint`, objects and all other non-number inputs without coercion. In particular, validation must not invoke caller `valueOf`, conversion hooks or property getters.

Capture `-0` as `+0`; the two input spellings belong to the same priority class. Compare captured priorities using relational comparisons. Do not subtract priorities to obtain their ordering: two admitted extreme finite values can have an infinite difference. If neither priority is smaller, compare the exact arrival ordinals. No priority comparison invokes caller code or reads the payload.

Ordering is lexicographic on `(captured numeric priority, arrival ordinal)`. Ordinals are unique among live occurrences. Ties remain FIFO through arbitrary supported interleaving of successful enqueue, peek, take and rejected enqueue operations. Stability does not apply across differently valued priorities.

### Capacity and ordinal transitions

`maxSize` is required and must be a primitive safe integer in **0 through 4,294,967,295 (`2^32 − 1`)**, inclusive. `-0` is accepted and canonicalised to zero. No default, coercion or silent clamp is permitted. Zero constructs a valid queue that rejects every valid-priority enqueue with `CAPACITY_EXCEEDED`. Construction captures a limit; it must not allocate `maxSize` entries or imply memory has been reserved for them.

Let **M = `Number.MAX_SAFE_INTEGER` = 9,007,199,254,740,991**. The next ordinal starts at zero. Successful insertion allocates the current ordinal only when it is less than M, then increments it exactly. Thus allocated ordinals are **0 through M − 1**. The state `nextOrdinal = M` is an exhaustion marker, never an allocated ordinal. Reject before modifying entries, size, backing storage or the counter. Do not round, wrap, silently renumber live occurrences or switch arithmetic representations.

A successful `take` that leaves size zero resets the counter to zero as part of that transition. Every other operation leaves it unchanged except the increment on successful insertion. Removing some entries from an exhausted nonempty queue frees capacity but does not free ordinals. After complete drain, insertion starts a fresh epoch. No public reset or production test-limit parameter bypasses this contract.

Enqueue checks are ordered, and the first applicable rejection is the result:

| Precedence | Check                                         | Failure and preserved state                                   |
| ---------- | --------------------------------------------- | ------------------------------------------------------------- |
| 1          | Priority is admitted.                         | `INVALID_PRIORITY`; no counter consumption or storage change. |
| 2          | `size < maxSize`.                             | `CAPACITY_EXCEEDED`; no eviction or ordinal consumption.      |
| 3          | `nextOrdinal < M`.                            | `ORDINAL_EXHAUSTED`; no occurrence or counter change.         |
| 4          | Capture and insert under the queue invariant. | Success adds one occurrence and increments the counter.       |

Consequently invalid priority wins even when full or exhausted; full capacity wins over ordinal exhaustion for a valid priority. Rejection preserves the future drain order and future admission behaviour, not merely the current size. These codes identify contract failures; no message wording or invented causal exception is required for these local checks.

### Storage, runtime and resource assumptions

The capacity ceiling matches ordinary JavaScript array length; the last occupied index at that length is `2^32 − 2`. The [ECMAScript array contract](https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-arraycreate) permits lengths through `2^32 − 1`; the [safe-integer constant](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.max_safe_integer) supplies the ordinal bound. The queue's guard/reset policy is this design's choice, not a language requirement.

For heap index `i > 0`, use ordinary exact arithmetic for `floor((i − 1) / 2)`; candidate child indexes are `2*i + 1` and `2*i + 2`, checked against current length before access. Their largest intermediate value under the declared index domain is below `2^33`, safely within exact integer arithmetic. Do not use signed or unsigned bitwise index tricks: their narrowing semantics do not discharge this domain. Prove any alternative arithmetic over the complete admitted domain.

The supported runtime assumes conforming, unmodified language intrinsics and ordinary owned arrays, with no hostile prototype mutation during use. Retained logical entries are bounded; available process memory is not. Allocation failure, process termination and runtime defects are not ordinary `QueueEnqueueError` cases, and this design promises no out-of-memory recovery or post-catastrophe state restoration. Supported rejections must still be decided before mutation; this platform boundary cannot justify partial changes on a declared rejection.

## 4. Ownership, occurrence laws and private mechanism

The priority is a captured primitive value. Changing a source variable, or a numeric field on a supplied payload, cannot change ordering. Payloads are opaque shared values: do not clone, inspect, traverse, serialise or freeze them. A proxy payload must not acquire extra queue-triggered property access. Reading a returned object may reflect its owner's mutations, but does not grant access to queue metadata.

The implementation must encapsulate backing storage, entries, ordinals and capacity. Results must not leak references to these internals. Independent instances share no mutable mechanism state. Removal releases the queue's reference for that occurrence, including stale slots and transient implementation storage retained after the call. Another queued occurrence or a caller may still retain the same payload; the queue does not promise garbage collection timing or immediate shrinking of engine backing capacity.

The public laws are conservation of successful occurrences; ascending priority; FIFO within a priority class; exact size; observationally pure peek; take/peek agreement; independent instances; and unchanged state after declared rejection. Complete-drain order is the ordered list of retained occurrences by the captured pair, with multiplicity preserved.

A candidate binary heap maintains each parent's pair no later than either child's, over a dense private array of non-undefined entry records. Insert appends then sifts upward; removal replaces a nonempty root with the last entry and sifts downward. The removal singleton case avoids retaining or re-inserting the same entry. This invariant explains the mechanism without exposing it as public API. Implementation routes may use another equally bounded mechanism only if they meet the same public and cost contracts or explicitly revise the cost design first.

## 5. Reference research and authored implementation

The queue is authored against §§1–4 under the [governing development policy](algorithms-and-data-structures-governance-2026-09-08.md). Reference research explains useful heap mechanisms, contract choices, numerical assumptions, empty-value handling and adversarial cases. The chosen representation must satisfy this queue's exact semantics and cost contract.

The prior bounded assessment inspected **heap-js 2.7.1**, commit `41206f64eea8c771fb58c93b3c151e6ba627619b`, including [Heap.ts](https://github.com/ignlg/heap-js/blob/41206f64eea8c771fb58c93b3c151e6ba627619b/src/Heap.ts) and its [BSD-3-Clause licence](https://github.com/ignlg/heap-js/blob/41206f64eea8c771fb58c93b3c151e6ba627619b/LICENSE). This is a dated reference inspection, not a newly executed qualification of that release.

The useful mechanism to understand comprises owned storage, comparison, append/sift-up/parent calculation, root inspection, last-element removal/root replacement/sift-down and size. Our implementation encapsulates that mechanism, uses exact guarded index arithmetic, distinguishes absence from payload `undefined`, and implements numeric validation, captured priority, FIFO ordinals and explicit outcomes. The minimal public surface remains the contract in §2.

The pinned [public-method tests](https://github.com/ignlg/heap-js/blob/41206f64eea8c771fb58c93b3c151e6ba627619b/tests/heap/heap-public-methods.test.ts) and [private-method tests](https://github.com/ignlg/heap-js/blob/41206f64eea8c771fb58c93b3c151e6ba627619b/tests/heap/heap-private-methods.test.ts) can suggest cases. Cases tied to a different API or semantic profile need an explicit applicability decision. The independent list model, queue laws and production-bound evidence below supply separate qualification obligations. Record actual inspected and used material accurately; shared-source tests remain correlated with the mechanism they explain.

Research is complete for a design decision when the chosen mechanism, relevant alternatives, limits and discriminating cases are understood well enough to author and qualify that responsibility. Further investigation follows a named unresolved question. Assess research, implementation, documentation, assurance, diagnosis and maintenance together; no effort saving is reported as measured here.

## 6. Queue-specific assurance

The [common assurance contract](reliable-atoms-and-composition-architecture-2026-09-08.md#6-comprehensive-assurance-including-mutation-testing) governs full runtime scope, meaningful survivors, exceptional dispositions, type-only evidence and shared instruments. The table below specifies the distinguishing queue evidence; all in-scope production code and private helpers remain inside its runtime scope.

| Obligation                | Required discriminating evidence                                                                                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Numeric ordering          | Negative/fractional/subnormal/extreme finite values; `+0`/`-0` ties; rejection of every invalid category without coercion; adversarial heap shapes.                                              |
| Occurrences and stability | Duplicate priorities and identical payload references; all-equal groups; interleaved arrivals/removals and complete drain against an independent list model.                                     |
| Empty and state           | Empty repetitions, singleton, refill, present `undefined`/`null`/falsy values; exact size after every step; peek purity and take agreement; detached callables.                                  |
| Ownership and isolation   | Mutated source variables/payload fields, proxy payload with no property access, result isolation, independent instances and removed-reference inspection without nondeterministic GC assertions. |
| Rejections                | Each error and pairwise/combined precedence; compare full subsequent observations, including admission and drain, after rejection.                                                               |
| Arithmetic boundaries     | Capacity 0 and boundary validation; exact ordinal acceptance/exhaustion/reset; root and child-index arithmetic near signed-32-bit and maximum array boundaries.                                  |
| Types and consumption     | Positive/negative API fixtures, discriminant narrowing, payload preservation and explicit Result handling; packed public exports/types and canonical type dependency resolution.                 |
| Documentation and cost    | Compiled/executed API examples for real misuse classes; operation counts and within-run growth evidence under the stated cost model.                                                             |

The independent semantic model stores occurrences in a straightforward list and selects the next from numerical order plus arrival position; it must not share production comparison/tie helpers or sift logic. Combine deterministic cases, bounded exhaustive traces over a declared finite priority/payload domain and trace length, and seeded generated sequences. Check every operation, including empty and rejected ones; retain counterexamples. Bounded exhaustive does not mean every possible execution.

The production ordinal limit is too large to reach by a routine end-to-end trace. Use a reduced ordinal universe only in an **independent specification model** to expose exhaustion/reset laws. It does not qualify the production guard. Qualification also needs evidence tied to the real constant and code: arithmetic proof/source inspection and focused private-function tests if the actual decomposition supports them, plus seeded wrong-bound/rounding faults. Do not export a setter, alternate factory, environment override or production test configuration. Likewise, prove extreme index arithmetic directly without pretending a small heap exercised billions of entries.

Named manual mutation targets include reversed priority comparison; wrong parent/child or missing sift; dropped/duplicated occurrence; reversed FIFO tie; size drift; mutation during peek; empty/payload conflation; reading priority from a mutable payload; invalid input coercion; changing state on rejection; swapped error precedence; accepting ordinal M; consuming an ordinal on failure; resetting before empty; failure to reset after drain; and stale removed references. Automatic operators may cover some; demonstrated additional fault detection must cover the meaningful remainder. A survivor's inability to affect an observation requires a contract-based argument; an unobservable private sign-of-zero change, for example, cannot be presented as a killed public-behaviour mutant without evidence.

## 7. Cost, composition and qualification

For the candidate heap under constant-cost numeric/ordinal comparisons and array indexing, the working bounds are O(1) peek and size, O(log n) sift work per enqueue/take, and O(n) logical retained entries. Dynamic-array allocation/growth can make insertion cost amortised; engine memory and allocation policies are explicit assumptions, not language-guaranteed worst-case latency. Construction need not scale with maxSize. Retained backing capacity may follow the high-water mark even after payload references are released. Count that separately from live entries; make no byte-accurate or immediate-shrink guarantee.

Qualification must support declared growth with analytical reasoning, operation counts and within-run benchmarks over useful sizes and distributions, including all-equal priorities. No measured latency superiority is claimed. Benchmark code stays outside the implementation read path.

A selection composition owns admission, eviction, output order and cutoff ties; earliest-tie retention may require different eviction reasoning from FIFO removal. A scheduler owns lifecycle, concurrency, clocks and cancellation. A scoring composition owns score production and callback failure before queue admission. Each proves its added obligations against its own contract; queue stability alone proves none of them. Use the common architecture's complexity comparison across internal state, seams, layers and consumer work before adding or splitting a layer.

| Stage                       | Current disposition                                                                                                                                                              |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Semantic contract           | Working choices closed in §§1–4: finite priorities, exact API, explicit outcomes, capacity, ordinals and failure precedence.                                                     |
| Implementation origin       | Selected: our own authored implementation, informed by openly licensed references under the governing policy.                                                                    |
| Implementation and delivery | Unexecuted: mechanism, package location/import, declared type dependency and supported runtime/consumption profiles.                                                             |
| Qualification               | Unexecuted: full contract/type/misuse evidence, complete mutation dispositions, executed documentation, API drift/consumption checks, dependencies, costs and complexity review. |

The candidate remains unqualified. A separately qualified composition does not waive a missing queue obligation, and queue qualification would not qualify its consumers. Reopen the boundary when a real use cannot preserve priority meaning, when the declared bounds fail that use, or when observed internal/ensemble costs defeat the simplicity argument. Replacement/removal follows the common evolution contract; no obsolete comparator surface is kept alive.

## 8. Evidence and method

The source-inspection basis includes the Reliable Atoms programme (the strategic plan node the owner ratified on 2026-09-08; its decision is recorded in [ADR-230](../architectural-decisions/230-own-built-algorithm-and-data-structure-foundations.md)), principles, metacognition, reason and proportionality at inspected engraph SHA `270b8ec6fb82dc6881c10ca101cb8d3c7a242d6e`. This is a read-only design basis, not repository-wide conformance or implementation authorisation.

Metacognition changed the inherited shape: generic comparison was an unestablished means, while captured scalar ordering serves the specified need. Reason made the warrant falsifiable through the key-domain reopening evidence. Proportionality kept common rules at their canonical document and limited this revision to the queue contract plus worked consequences, preserving the full assurance bar. A bounded peer challenge examined numerical/index limits, ordinal transitions, API outcomes and failure-state observations. Conceptual review increases scrutiny; it is not empirical qualification.
