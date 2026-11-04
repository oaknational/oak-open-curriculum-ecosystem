# Architectural Review Team

Architecture review is one shared brief, `.agent/sub-agents/templates/architecture-expert.md`,
read through four named lenses, each a leaf component under
`.agent/sub-agents/components/personas/`:

- **Barney** - Simplification and dependency/boundary cartography
- **Fred** - Rigorous ADR/boundary enforcement and standards discipline
- **Betty** - System coherence, coupling management, and change-cost trade-offs
- **Wilma** - Failure-mode resilience and adversarial edge-case pressure testing

A host binds the lenses to its own surfaces; the roster below is this host's. In OCE each lens
is a variant of the brief's declaration (`architecture-expert-barney`, `-betty`, `-fred`,
`-wilma`) and reviews the whole monorepo; no lane binds a lens.

When a finding falls in a colleague's lens or lane, explicitly recommend a follow-up review from
that reviewer by name.
