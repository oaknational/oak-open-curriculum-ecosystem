---
id: exemption-removal
node_type: delivery
name: "Exemption removal: carveouts, exemptions, and special cases — reviewed, registered, removed"
overview: "Review the estate's enforcement and configuration surfaces for carveouts, exemptions, and special cases; register every one with grounds; remove them by default, ratify the survivors with a recorded warrant and falsifier; and land the validator that makes an unregistered exemption fail CI."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-08-11
ratified_where: "Two in-session owner words at the lane seat (Wren calls Downdraft 6b29b5), 2026-08-11: the census substance (registers, classification, dispositions, seeding, CI enforcement) was ratified inside the workspace-config-isolation completion-arc approval; its extraction to this standalone node and the broadened frame are the owner's same-day words verbatim — 'let's move the exemption hunting to a separate plan' and 'the repo review for carveouts, exemptions, \"special cases\" and planning to remove them in a separate plan'. The assembled body operationalises those words; the owner re-trues any assembly overreach."
serves: outcome-informed-practice-learning
impact_areas:
  - practice-and-estate
tickets: []
depends_on:
  - plan: workspace-config-isolation
    kind: beneficial
owner_gates: []
last_updated: 2026-08-11
---

# Exemption removal

## Goal

Every carveout, exemption, and special case in the estate's enforcement
and configuration surfaces is either REMOVED or carries a registered,
owner-visible warrant with a falsifier — and an unregistered one fails
CI. The governing owner rulings (2026-08-11, both in durable record):
"warranted exemption is a huge alarm bell, either we need to change
policy, or fix the problem. Strict, everywhere, all the time, is not
for fun, it is for survival of a complex system in the face of entropy
and time"; and the commissioning word for this node — review the repo
for carveouts, exemptions, and special cases, and plan their removal.

Removal is the DEFAULT disposition. A surviving exemption is the
recorded exception: it carries its policy warrant, its owning decision
record, and the condition under which it dies or re-opens. Nothing
sits unregistered, and no register row is inventory — every row is
sequenced, rejected, reshaped, folded, or closed.

## Mechanism

- **Per-surface registers** (one file per surface, so parallel slices
  co-edit without contention): ESLint (`'off'` entries,
  `eslint-disable` pragmas, `ignores` globs), `.prettierignore`, knip
  ignores, depcruise (exclusion entries AND named lawful-edge rules),
  Sonar exclusions, and skipped tests. Grounded in PDR-136 (quality
  gates are a registered corpus).
- **Classification, two classes**: **scoping** (the check correctly
  excludes generated/ephemeral output — grounds recorded, legitimate,
  no clock) vs **suppression** (the check would fire on real source
  and is being silenced — every row carries exactly one of
  `fix-routed(ticket)` / `policy-ratified(pointer)` / `pending(owner
  card raised at the sweep)`). No open-ended warranted state exists —
  the exemption-alarm ruling, encoded structurally.
- **Seeding is mechanical and PROGRAMMATIC** — it evaluates ESLint
  flat configs rather than grepping, so the reflective JS-override
  pattern (four workspaces, grep-invisible) is captured. The seed
  count re-derives at seeding time (326 measured 2026-08-11 is a
  sizing input only; the isolation lane's de-hatch deletes rows
  first, and re-seeding after it lands is free).
- **The sweep CURES first and registers second**, so the register
  never becomes a warrant-shelf at scale. Sweep dispositions already
  decided at ratification: depcruise `no-deprecated-node` moves
  warn→error (or gains a registered disposition if findings resist
  same-PR cure); `.prettierignore` entries naming non-existent
  workspace paths are deleted as dead.
- **The special-case ledger** extends the review beyond mechanical
  seeds to the NAMED carveout shapes the estate has already minted,
  each getting a register row with its warrant and falsifier:
  the search-contracts → sdk-codegen named lawful edge (ADR-138/041;
  landed by the isolation lane's S2), the two standards-package
  self-bootstrap exemptions (`oak-eslint`,
  `@oaknational/workspace-config`), the sanctioned
  `import.meta.dirname` idiom (policy pointer: the
  workspace-config-enforcement-hardening node's H1), the dynamic-
  import exemption set (empty at landing — the row asserts emptiness),
  and the inline owner-initials approval marker in
  `@oaknational/no-eslint-disable` (one live site,
  `packages/core/result/src/unwrapping.ts`, `policy-ratified`).
- **Enforcement**: the census validator runs in `repo-validators:check`
  (pre-commit + CI) — an unregistered disable fails the check; the
  sweep is "periodic" structurally, not on a calendar. Fixture
  red-proof lands with the validator.

## Todos (each slice a single-story PR; tickets minted at pickup)

1. **Mechanism** — register schema, per-surface register files, the
   census validator with fixture red-proof, mechanical programmatic
   seeding (source location as initial grounds), wiring into
   `repo-validators:check`.
2. **Per-surface sweeps** — cure-first, register-second; hand-authored
   grounds per surviving row; contested rows surfaced as owner cards;
   cures routed to their owning lanes. Parallelisable per surface by
   the register partition.
3. **The special-case ledger** — every named carveout above gets its
   row, warrant, and falsifier; any found without a defensible warrant
   routes to removal or an owner card.
4. **Closing re-derivation** — acceptance criteria re-proven against
   the live tree; the plan archives with dispositions.

## Acceptance criteria (each with a proof)

- Every check-disabling surface in the estate is enumerated in the
  register with grounds, every row classified scoping/suppression,
  every suppression row carrying exactly one disposition
  (`fix-routed` / `policy-ratified` / `pending` with its owner card),
  and an unregistered disable fails CI — `repo-safe` for the mechanism
  (validator + fixture); `owner-held` for `pending` rows, recorded in
  the register files themselves (each carries the comms event id of
  its owner card and the answer). `pending` is a sweep-time state
  only: plan CLOSURE requires zero pending rows — every one resolved
  to `fix-routed` or `policy-ratified` before the node archives.
- Every named special case in the ledger carries a recorded warrant, a
  pointer to its owning decision record, and a falsifier or removal
  condition — `repo-safe`: the ledger rows present and cross-linked.
- The sweep's cure-first discipline is evidenced in the landed record:
  each sweep lands its register updates and their cures in the same
  reviewed change, so the register rows and commit history are the
  proof — `repo-safe`: the landed register + commits (PR bodies are
  not durable records, per `permanent-doc-is-the-consolidation-record`).

## Out of scope

- Re-adjudicating the Sonar disposition policy — its own owner-ruled
  surface; this plan REGISTERS its exclusions, never re-opens them.
- Product-code conditional logic (branches, feature flags) — this plan
  polices enforcement and configuration surfaces, where a carveout
  silently weakens a gate; product behaviour is the product lanes'
  scope.
- Executing the isolation lane's in-flight slices (MCP-543's named
  lawful edge, the de-hatch arc) — they land there; their landed
  shapes get register rows here.
- Estate-wide mutation-testing roll-out (owner-committed, later,
  staged — carried at the isolation plan's Out of scope).

## Notes

- Extraction record: the census substance previously lived as the
  `workspace-config-isolation` plan's todos 4–5 and §Census
  enrichment; extracted 2026-08-11 at the owner's word so the
  isolation lane stays one finishing cure arc and the exemption
  programme gets the standalone scope its estate-wide blast radius
  warrants. The isolation plan's amendment of the same date records
  the hand-off.
- `depends_on` is `beneficial`: the minimum shippable shape without
  the isolation lane's remaining todos is the mechanism plus seeding
  against today's tree — counts re-derive after the de-hatch lands,
  and re-seeding is mechanical.
