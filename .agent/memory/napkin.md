## Napkin rotation — 2026-04-17

Rotated at 679 lines after ~16 sessions spanning 2026-04-16 through
2026-04-17 and covering the Sentry + OTel observability closure
(handoff refresh, OAuth supported-scope split, Vercel production-release
gating, workspace-owned build scripts, shared Vercel build policy,
collection-level observability drift sweep, turbo-sensitive MCP
rate-limit proof, report normalisation contract hardening, Codex
follow-up lane separation, validation closure pass) and the Sentry CLI
hygiene follow-up lane (CLI-as-first-class-agent-tool theme,
per-workspace ownership over root-hoisting, `practice:fitness` is
advisory, infrastructure config belongs in the repo, two-CLI split by
purpose, CLI enumeration before owner questions, ADR-promotion at
closure, reviewer-by-abstraction-layer routing, enforce-edge tightening
of the Practice loop, `.sentryclirc` composition clean).

Archived to `archive/napkin-2026-04-17.md`.

Merged 6 new high-signal entries into `distilled.md`:

- CLI-first enumeration before owner questions (Process)
- Validation closures: produce locally-producible evidence first (Process)
- Split client-compatibility out of deployment-validation lanes (Process)
- ADR-worthiness scopes by reusability, not diff size (Process)
- Route reviewers by abstraction layer, not file scope (Process)
- Source line updated: distillation now covers through napkin-2026-04-17.md

Pruned duplication in `distilled.md` against permanent homes:

- Fitness four-zone scale collapsed to a one-liner pointer to
  [ADR-144](../../docs/architecture/architectural-decisions/144-two-threshold-fitness-model.md)
- User Preferences section tightened (British-spelling entry removed
  — already in AGENT.md)
- Process section entries compressed to one-sentence pointers where
  a pattern file already exists
- Net: distilled.md 278 → 271 lines (back under hard limit 275)

Extracted 2 new patterns:

- `patterns/adr-by-reusability-not-diff-size.md` (process)
- `patterns/route-reviewers-by-abstraction-layer.md` (agent)

ADR-shaped doctrine graduated this rotation:

- [ADR-159: Per-Workspace Vendor CLI Ownership with Repo-Tracked
  Configuration](../../docs/architecture/architectural-decisions/159-per-workspace-vendor-cli-ownership.md)
  — captures "infrastructure config belongs in the repo",
  per-workspace CLI ownership, the two-CLI split by purpose, the
  shared-library "no default project" rule, `require_command`
  preflight discipline, and the Debug-ID post-condition check.

Previous rotation: 2026-04-16 at 525 lines.

---
