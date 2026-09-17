# Design Packages

Design-tier doctrine lives in `docs/governance/` — see
[design-token-practice.md](../../docs/governance/design-token-practice.md) and
[one-html-many-css-compositions.md](../../docs/governance/one-html-many-css-compositions.md).

- [oak-design-system/README.md](oak-design-system/README.md) — the Oak design
  system: the estate's design source of truth (ADR-213), integrated first-class
  with the Claude Design studio as its second working surface
- [design-tokens-core/README.md](design-tokens-core/README.md) — build-time
  helpers for flattening, validating, and emitting Oak token CSS variables
- [oak-design-tokens/README.md](oak-design-tokens/README.md) — DTCG source
  files plus generated CSS and terminal theme outputs consumed by apps and
  terminal tools
- [oak-design-ink/README.md](oak-design-ink/README.md) — reusable React
  primitives for Ink-based terminal interfaces
- [identities/README.md](identities/README.md) — the identity-pack tier:
  data-only workspaces, one per identity, with machine-checked tier
  invariants (no hand-declared inventory by design)
