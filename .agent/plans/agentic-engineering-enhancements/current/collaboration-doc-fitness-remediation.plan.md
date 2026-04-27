---
name: "Collaboration Doc Fitness Remediation"
overview: >
  Reduce hard practice-fitness pressure in the collaboration directive and
  collaboration-state conventions after the coordination architecture and
  deterministic identity passes expanded both surfaces.
todos:
  - id: inventory-overlap
    content: "Inventory overlap between agent-collaboration.md and collaboration-state-conventions.md, especially lifecycle and channel-detail prose."
    status: completed
  - id: extract-companion-detail
    content: "Extract per-channel or per-surface operational detail to companion docs following each file's split_strategy."
    status: completed
  - id: preserve-authority
    content: "Keep agent-collaboration.md as the doctrinal working model and collaboration-state-conventions.md as the operational state index."
    status: completed
  - id: verify-fitness
    content: "Run practice fitness strict-hard and targeted markdown/format checks after the split/refinement."
    status: completed
---

# Collaboration Doc Fitness Remediation

**Status**: Complete — implemented 2026-04-27 by splitting detailed lifecycle
recipes into `collaboration-state-lifecycle.md`.
**Opened by**: 2026-04-26
`jc-session-handoff` + `jc-consolidate-docs` pass.
**Owner**: Jim
**Thread**: `agentic-engineering-enhancements`

## Trigger

`pnpm practice:fitness:informational` reports hard pressure in two
collaboration surfaces:

- `.agent/directives/agent-collaboration.md`: 264 lines over the 260 hard
  line limit.
- `.agent/memory/operational/collaboration-state-conventions.md`: 255 lines
  over the 220 hard line limit and 14,304 characters over the 12,000 hard
  character limit.

This pressure is expected after sidebars, escalations, joint decisions, and
deterministic identity made collaboration state more explicit. The correct
response is structural extraction/refinement, not deleting signal.

## Scope

In scope:

- Identify duplicated lifecycle/channel prose across the directive and
  operational conventions.
- Extract detailed lifecycle mechanics into one or more companion docs if the
  detail is still needed.
- Keep the directive readable as the agent-to-agent working model.
- Keep the conventions file readable as the operational state guide.

Out of scope:

- Changing the collaboration protocol semantics.
- Weakening the "knowledge and communication, not mechanical refusals"
  doctrine.
- Changing schema contracts except to update references if prose moves.

## Acceptance

- `pnpm practice:fitness:strict-hard` no longer reports these two hard
  findings.
- Targeted markdownlint passes for changed collaboration docs.
- Targeted Prettier check passes for changed files.
- Links from rules, commands, and docs to moved sections still resolve.

## Completion Note

Implemented as a structural split:

- `agent-collaboration.md` remains the agent-to-agent doctrine and
  channel-selection trigger surface.
- `collaboration-state-conventions.md` remains the compact operational
  state index.
- `collaboration-state-lifecycle.md` now carries detailed recipes for
  claims, decision threads, sidebars, joint decisions, escalations, and
  protocol-observability evidence bundles.

Validation passed for `pnpm practice:fitness:strict-hard`, targeted
markdownlint, targeted Prettier check, and link discoverability search.
`pnpm practice:vocabulary` still reports one out-of-scope retired phrase
in `shared-comms-log.md`, which is under a peer agent's active claim and
was not changed by this remediation.
