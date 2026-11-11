# ADR-232: Host-side adoption of Practice Core decisions

- **Status:** Accepted (2026-10-03; the parity node `practice-parity-for-extraction`, mechanism 2,
  the amendment-entries carry, landed here as the same shape as the sibling estate's record under
  the owner's word of 2026-10-02 that both estates hold equally capable Practices).
- **Date:** 2026-10-03
- **Related:**
  [PDR-008](../../../.agent/practice-core/decision-records/PDR-008-canonical-quality-gate-naming.md)
  — canonical quality-gate naming, whose application in this repository is recorded below;
  [PDR-132](../../../.agent/practice-core/decision-records/PDR-132-changeset-health-round-budgets-bind-at-authoring-time.md)
  — changeset health and round budgets, whose application here is recorded below;
  [PDR-079](../../../.agent/practice-core/decision-records/PDR-079-pdr-vs-adr-portability-distinction.md)
  — the PDR-versus-ADR distinction this record is the host side of;
  [the practice index](../../../.agent/practice-index.md) — the bridge that pairs each PDR with
  this record.

## Context

The Practice Core is portable by construction: a decision record under `.agent/practice-core/`
travels to every Practice-bearing repository, and the decision-records README §Portability
Constraint forbids host-repository names in Core text. A host's adoption of a Core decision (the
script names it chose, the register it keeps, the reading it took of a clause) is a host fact,
and its home is a host record paired to the PDR in the bridge index, never an entry under the
PDR's own headings. From 2026-10-03 a Core gate, `validate-no-host-names-in-core-headings`,
refuses a Core heading that names any repository the provenance chain, the Core changelog's
entry tags or the tree's origin declares; this record is where such facts live for this
repository.

## Decision

This repository's applications of Practice Core decisions are recorded here, one section per
PDR, and paired to the PDR in the practice index's Decision Record ↔ Substrate ADR Bridge. The
Core keeps the decision; this record keeps the adoption.

### PDR-008 — canonical quality-gate naming

- The canonical gate set is exposed at the package-manager script level as `pnpm check` (the
  secrets scan, a clean build, and the Turbo pipeline's `sdk-codegen`, `build`, `type-check`,
  `lint`, `test` and workspace-local tasks), with `repo-validators:check` (the repository
  validators, CI parity among them) and `docs-validators:check` (the documentation validators
  the script runs: reference direction, machine-local paths, Core ADR citations, host names in
  Core headings, Markdown links, the patterns index, the ratified lists) as its named validator
  groups. The pre-commit hook runs the validator groups and the pipeline; the pre-push
  gate runs the whole of `check`.
- `check` applies no fixes; the `portability:fix` and `format` scripts are the only writers, run
  by a seat before its commit, never by a gate.

### PDR-132 — changeset health, round budgets bind at authoring time

- The round budget is kept in `.agent/memory/operational/review-cost-ledger.md`, one row per
  pull request with its rounds, its settlement cost against the budget, the verdict, the
  seat's stop round and the gate's reading; the survey that prices a pull request is the
  `agent-tools review-cost` command, read before a settlement push.
- The merge tooling's review-cost gate refuses a settlement push whose budget is exhausted,
  and a records commit on a coordination branch whose draft is ready-marked counts as a
  settlement push of that pull request (read 2026-10-02).

## Consequences

- A Core heading never names this repository; the gate refuses the shape, and the cure is an
  entry here paired in the bridge.
- A reader of a PDR who needs this repository's application follows the bridge to this record;
  a reader of this record who needs the decision follows the Related links to the PDR.
- The sibling estate keeps its own record of the same shape; neither names the other's
  applications.
