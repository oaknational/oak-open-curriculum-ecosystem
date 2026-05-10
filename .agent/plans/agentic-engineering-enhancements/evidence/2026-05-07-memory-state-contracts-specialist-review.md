---
status: review-evidence
authored: 2026-05-07
thread: agentic-engineering-enhancements
reviewed_bundle: memory-state-substrate-contracts
---

# Memory/state contracts specialist review evidence

This evidence note replaces the spent review opener. The opener's purpose was
to trigger specialist review before committing the memory/state substrate
contract bundle. The review has now run, so the opener must not land as a live
`current/` instruction.

## Reviewers

- `docs-adr-expert` — approve with fixes.
- `assumptions-expert` — approve with fixes.
- `architecture-expert-fred` — approve with fixes.
- `test-expert` — hold until the doctor plan's test/validator contract is
  tightened.

## Consensus

The reviewers agree on the direction:

- PDR-050 belongs in Practice Core as portable doctrine.
- The host bridge and local adoption plan are the right place for Oak-specific
  discovery and routing.
- A repo-local doctor is the right enforcement shape for stale surfaces,
  generated read-model drift, schema/parser health, repair routing, and memory
  or state merge topology.

## Fixes applied before commit

- PDR-050 now names preservation-before-repair and treats the surface inventory
  as a first-class contract surface.
- The portable substrate plan now requires an inventory contract before the
  doctor proves the estate.
- The doctor plan now names its dependency on the portable template, keeps RED
  states uncommitted until paired GREEN implementation, separates pure
  fixture-tested contract logic from live validation, sharpens live/archive
  stale-path classification, and adds repair preservation guards.
- The doctor implementation boundary is `agent-tools` with root aliases, not
  root scripts as an unowned implementation surface.
- The state README now exposes the legacy `comms/events/` fragments as a
  historical no-new-writes surface pending doctor classification.

## Remaining open questions

- Whether the legacy `comms/events/` directory remains historical indefinitely
  or receives a terminal migration condition.
- Whether topology validation should block only branch merge commits, or also
  squash/cherry-pick workflows that claim memory/state merge completion.
