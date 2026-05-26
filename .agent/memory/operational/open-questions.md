---
fitness_line_target: 180
fitness_line_limit: 240
fitness_char_limit: 14000
fitness_line_length: 100
split_strategy: >-
  Surface owner-decision items during consolidate-docs; move answered or
  withdrawn entries to an archive when the register needs rotation.
merge_class: mostly-append-register
fitness_content_role: drainable-buffer
---

# Open Questions - Substrate

**Purpose**: Persistent log of questions surfaced during work that cannot be
answered within current context or a reasonable amount of time or effort.
Consolidation drains this register by answering, surfacing to the owner,
withdrawing, or leaving an entry open with a falsifiable constraint.

**Owner**: shared - any agent appends; the consolidator drains.

**Archive pointer**: the pre-rotation source window is preserved at
`archive/open-questions-archive-2026-05-26-thermal-critical-curation.md`.

## Protocol

### Entry Shape

Each active entry should stay compact:

```text
### Q-<NNN>: <one-line question>
- Raised by: <agent_name> (<session_id_prefix>) @ <UTC timestamp>
- Context: <short framing>
- Why still open: <named constraint and falsifiability check>
- Suggested resolution path: <plan / ADR / PDR / consolidation / owner direction>
- Status: open | answered-in-place | surfaced-to-owner | withdrawn
- Linked: <evidence references>
```

### Lifecycle

1. Open at append time.
2. Mid-life updates append under the entry with agent and UTC timestamp.
3. Consolidation applies one of four dispositions:
   answered-in-place, surfaced-to-owner, withdrawn, or open with constraint.
4. Accumulation above roughly ten open entries signals consolidation cadence
   drift and should be surfaced to the owner.

## Open

### Q-003: Does start-right-team need a closeout-only reduced-bootstrap mode?

- Raised by: Stormy Surfing Dock (`2a7b65`) @ 2026-05-25T13:15Z.
- Context: full `start-right-team` bootstrap is mandatory for participating
  agents, but late closeout-only participation may need a smaller contract.
- Why still open: the second observed late-join instance, Quiet Whispering
  Veil, was substantive curation work rather than closeout-only work. The
  falsifiability check is a second closeout-only late-join case.
- Suggested resolution path: if that second closeout-only instance appears,
  amend `start-right-team` with a named exemption or minimum-coordination mode.
- Status: open.
- Linked: archived source Q-003, `start-right-team` sections 0, 0.5, and 1,
  PDR-082, and the n=2 coordination-efficiency program plan.

## Surfaced To Owner

### Q-004: Should the B2 body-length gate apply to resolved body-file content?

- Raised by: Torrid Firing Spark (`5054f8`) @ 2026-05-26T06:38Z.
- Context: B2 landed the plan-directed gate for `--body` argv over 1500 chars;
  `--body-file` remains an escape hatch for shell quoting hazards.
- Owner decision needed: whether substrate scannability should limit the
  resolved body regardless of source, or whether the gate intentionally applies
  only to inline argv.
- Suggested resolution path: if owner chooses both paths, gate the resolved
  `resolveCommsBody` value; if argv-only, document that scope explicitly.
- Status: surfaced-to-owner during the 2026-05-26 consolidation pass.
- Linked: commit `66e77d73`; n=2 plan section B2; `resolveCommsBody` in
  `agent-tools/src/collaboration-state/cli-comms-commands.ts`; archived
  source Q-004 for the full assumptions-expert rationale.

## Answered In Place

### Q-001: What is the long-term home for comms-substrate failure-mode cures?

- Raised by: Wooded Flowering Leaf (`f03dbd`) @ 2026-05-25T06:18Z.
- Answer: the home is the n=2 coordination-efficiency program plus the PDRs and
  rules it amends, not a separate R4 graft. PDR-078 absorbed the heartbeat
  substrate-category cure; the remaining work is tracked by WS0, WS1, and WS4
  in the scoped-down program plan.
- Status: answered-in-place by the 2026-05-26 plan rewrite and continuity
  refresh.
- Linked: archived source Q-001; commits `3ca71a40`, `29ebda41`, `66e77d73`,
  `fd951164`, and `467074c7`; current n=2 coordination-efficiency plan.

### Q-002: Should consolidate-docs explicitly reference this file?

- Raised by: Wooded Flowering Leaf (`f03dbd`) @ 2026-05-25T06:25Z.
- Answer: yes; `consolidate-docs` now names `open-questions.md` in step 7b.1.
- Status: answered-in-place before this rotation; preserved in the archive.
- Linked: archived source Q-002 and `.agent/skills/consolidate-docs/`.
