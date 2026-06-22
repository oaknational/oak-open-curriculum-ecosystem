# Test-Estate Quality Audit — config-asserting tests

**Status**: SCHEDULED, NOT NOW. Decision-complete on scope; awaiting an owner scheduling trigger.
**Domain**: Agentic Engineering Enhancements
**Captured**: 2026-06-22 (Petrel herds Altitude); homed here at the 2026-06-22 dedicated consolidation.
**Owner direction**: schedule the sweep; do not run it inline.

## The Gap

The existing test estate has never been swept for the **"asserts configuration, not
behaviour"** shape — tests that read the `.agent/` substrate or assert a constant / config
value / type-level invariant instead of exercising runtime product behaviour. This violates
`testing-strategy.md` ("Assert effects, not constants"; the type system, not vitest, is the
tool for type invariants).

The deleted search-cli gap-ledger test (a `readFileSync` over a relocated `.agent/` plan JSON,
commit `2cc78d0f0`) was **one instance** of this class, surfaced because it blocked an
unrelated commit. The broader estate is unswept.

## Already Closed (new instances cannot be added)

- depcruise `no-import-from-agent-substrate` — forbids module imports of the `.agent/`
  substrate (absolute, no exemption).
- ESLint `no-agent-substrate-access` — forbids runtime filesystem reads of the substrate,
  exempting the `agent-tools` operator (landed `a3ca73f1a`).

These block NEW config/substrate-asserting tests; the audit addresses the EXISTING estate.

## Scope

A `test-expert`-led audit across `apps/` and `packages/` test suites:

1. Identify tests whose assertions mirror a config value, a schema/type-level invariant, or
   read the `.agent/` substrate, rather than asserting an observable runtime effect.
2. Triage each: **delete** (illegitimate — no product code under test) vs **refactor**
   (rewrite to assert the effect).
3. Remediate per the triage.

## Trigger

Owner schedules. Promote to `current/` with a bounded executable slice at that point.
