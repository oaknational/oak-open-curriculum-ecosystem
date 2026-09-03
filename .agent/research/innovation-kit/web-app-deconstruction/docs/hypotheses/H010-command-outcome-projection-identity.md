---
id: H010
status: testing
confidence: low
evidence_snapshot: Database-Tools 3d1eff31; oak-openapi 2fb1383; OCE bd878a3
last_updated: 2026-07-20
---

# H010: Command, outcome and projection identity

## Claim

**Hypothesis:** Explicit command, synchronous outcome, optional asynchronous
operation and projection-release identities can replace entity-as-workflow state,
caller-dependent trigger behaviour, ambiguous retries and refresh acceptance
presented as publication completion.

This does not require an operation resource for every request or select event
sourcing, CQRS, queues or a workflow engine in advance.

## Why it is plausible

**Observed:** The mutation API can return business failure from inside a resolved
transaction callback after earlier writes, has no command or expected-version
identity, and changes database trigger behaviour through session actor state
([mutation analysis](../current-state/database-tools/mutation-workflow-and-control.md)).

**Observed:** Materialized-view refresh acknowledges work before its outcome, and
public visibility can lag a committed authoring change without a shared release or
watermark ([end-to-end journeys](../current-state/database-tools/end-to-end-journeys.md)).

**Inferred:** Separating requested work, committed effect, long-running operation,
projection build and consumer-visible release could make retry and publication
claims truthful without preserving the current mechanism split.

## Predictions

If the hypothesis is useful:

1. Duplicate and reordered commands have deterministic, inspectable outcomes.
2. Competing edits reject a stale expected version rather than silently winning.
3. A synchronous response distinguishes acceptance from committed effect.
4. Long-running work has durable operation identity only when completion crosses
   the response or remains ambiguous.
5. Projection and publication outcomes name source release, status and watermark.
6. Audit and remedy can correlate a user intent with every resulting effect.

## Invalidators and weakening evidence

Reject or materially narrow this hypothesis if:

- current transaction, trigger and refresh mechanisms already prove these
  distinctions across retry, conflict and partial failure;
- explicit identities add ceremony without changing any caller decision,
  recovery path or evidence claim;
- entity lifecycle state is genuinely the single competent workflow authority
  and cannot be separated from authored content identity;
- required cross-boundary work is always synchronously completed and observable;
- a simpler transactional or publication design removes the ambiguous boundary;
  or
- the model cannot represent correction and compensation without duplicating
  state across command, operation and entity records.

## Most direct discriminating work

1. Execute [V018](../investigations/validation-register.md) for one authoring
   command through commit, publication, projection and consumer visibility.
2. Predeclare duplicate, lost-response, stale-version, concurrent-edit, refresh-
   failure and retry cases.
3. Compare direct transactional completion, durable-operation and current designs.
4. Assert exact outcomes, effects, audit correlation and recovery after each fault.
5. Remove every identity which does not change a caller or operator decision.

## Decision affected

The command, concurrency, asynchronous-operation, publication and projection
contracts made available by the Oak Innovation Kit.

## Evidence history

- **2026-07-20:** Graduated from the database/API/OCE multi-lens synthesis. The
  pinned source establishes ambiguous acknowledgement and identity gaps, but not
  their production frequency or that the proposed identity set is minimal.
