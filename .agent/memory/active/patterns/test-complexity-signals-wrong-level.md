---
name: "Test Complexity Signals Wrong Level"
use_this_when: "A test requires elaborate scaffolding (type predicate hacks, mock capture arrays, wrapper functions, eslint-disable) to reach the code under test"
category: testing
proven_in: "apps/oak-curriculum-mcp-streamable-http — handlers-observability setTag test required CapturedTool interface, isToolHandler type predicate, mockImplementation bridge, all to prove a single setTag call. Deleted."
proven_date: 2026-04-14
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Engineers build elaborate test infrastructure instead of questioning whether the test is at the right level or testing the right thing"
  stable: true
---

# Test Complexity Signals Wrong Level

## Problem

A test requires disproportionate scaffolding to reach the code
under test: type hacks, capture arrays, wrapper functions,
eslint-disable comments, or mock frameworks. The engineer treats
this as a tooling problem ("how do I make the test work?")
instead of a design signal ("why is this so hard to test?").

## The Signal

Complexity in test infrastructure means one of:

1. **The test is at the wrong level.** The behaviour is already
   proven by a lower-level unit test or a higher-level E2E test.
   The mid-level test adds scaffolding cost without coverage value.
2. **The test is testing the wrong thing.** Testing trivial
   delegation (one function calls another) or testing the absence
   of things (removed tool name is rejected) doesn't prove product
   behaviour.
3. **The DI seam is missing.** The code under test has no clean
   injection point, which is an architectural problem — not a
   testing problem.

## Pattern

When test scaffolding exceeds 3x the assertions it supports:

1. **Ask "what product behaviour does this prove?"** If the answer
   is "that function A calls function B", the test is testing
   wiring, not behaviour. Delete it.
2. **Ask "is this proven elsewhere?"** If the adapter layer has
   unit tests and E2E covers the full path, the mid-level
   integration test is redundant.
3. **Ask "why is this hard?"** If the answer involves unexported
   generics, sealed types, or framework internals, the test is
   fighting the architecture. The correct fix is either a DI seam
   in the product code or acceptance that this level isn't testable.

## Anti-Pattern

"I need a type predicate, a capture array, and a mockImplementation
bridge to test this `setTag` call, but the test is valuable because
it proves the enrichment wiring." The `setTag` call is one line of
trivial delegation. The scaffolding costs more to maintain than the
line it tests.

## The Resolution

Delete the test. If the behaviour matters, test it at a level
where the DI seam is clean. If no clean level exists, the
behaviour is either trivial (trust the adapter tests) or the
architecture needs a boundary change.
