---
name: "Coordination Watcher Canonicalisation"
overview: "Move the canonical watcher definition out of `.agent/reference/` and into code-adjacent docs; introduce an executable `coord how-to-start` CLI that emits the canonical invocation parameterised by identity, so the SKILL stops carrying a fragile example; extend the watcher from comms-events-only to multi-surface coverage (comms, active-claims, conversations, escalations, handoffs); rehome the substantive Practice-doctrine content (identity discipline, anti-patterns) to its right surfaces."
status: future
type: developer-experience
specialist_reviewer: "assumptions-expert, architecture-expert-betty, architecture-expert-fred, docs-adr-expert"
sibling_plans:
  - "comms-watch-liveness-floor.plan.md"
  - "agent-coordination-cli-ergonomics-and-request-correlation.plan.md"
related_rules:
  - ".agent/rules/practice-core-portability.md"
last_updated: 2026-05-22
isProject: false
todos:
  - id: phase-0-grounding
    content: "Phase 0: re-read active-claims, shared comms, and the existing `agent-tools/src/collaboration-state/cli-comms-watch.ts` + `cli-runtime.ts` source before any mutation. Re-verify the worked-instance defect surface (today's `.json`-vs-plain-text seen-file confusion) is still the canonical motivating evidence."
    status: pending
  - id: phase-1-canonical-home-decision
    content: "Phase 1: decide and record the canonical home topology. Default proposal: tool definition under `agent-tools/src/collaboration-state/README.md` (code-adjacent); Practice-doctrine substance (identity-tuple as load-bearing; self-echo as non-negotiable anti-pattern) promoted to a rule under `.agent/rules/` or absorbed into existing PDR-027. Decision recorded in a short ADR amendment (or new ADR) before any file move."
    status: pending
    depends_on: [phase-0-grounding]
  - id: phase-2-how-to-start-cli
    content: "Phase 2: implement `coord how-to-start --platform <p> --model <m>` (or under the existing `collaboration-state` namespace) — TDD-first. The command performs identity preflight, primes the seen-file if missing, and emits the exact canonical watch invocation to stdout for the agent to execute. Atomic-landing pair: command + tests covering seen-file priming behaviour, identity-tuple resolution, and idempotent re-runs."
    status: pending
    depends_on: [phase-1-canonical-home-decision]
  - id: phase-3-multi-surface-watch-design
    content: "Phase 3: design the multi-surface watcher scope. Enumerate watchable surfaces (comms/, active-claims.json, conversations/*.json, escalations/*.json, handoffs/* once PDR-063/ADR-182 lands). Decide between (a) extending the existing `comms watch` CLI with `--surfaces` flag (single process, internal composition), or (b) per-surface CLIs that compose at the host level. Default proposal: option (a). Record decision before implementation."
    status: pending
    depends_on: [phase-1-canonical-home-decision]
  - id: phase-4-multi-surface-watch-implementation
    content: "Phase 4: implement the multi-surface watch per Phase 3's decision. Per-surface event shape preserved via `[CHANNEL][SURFACE]` discriminators on the first line so the agent can triage. Default-all-on; opt out with `--surfaces`. Atomic-landing pair: implementation + per-surface contract tests (events emitted, self-exclusion, seen-tracking). Update `coord how-to-start` to emit the multi-surface invocation."
    status: pending
    depends_on: [phase-3-multi-surface-watch-design, phase-2-how-to-start-cli]
  - id: phase-5-content-migration
    content: "Phase 5: migrate substantive content from `.agent/reference/comms-watch-mechanism.md` to its right homes per Phase 1. Tool spec content → `agent-tools/src/collaboration-state/README.md`. Identity discipline → Practice rule or PDR-027 amendment. Anti-patterns → tool README §Common mistakes. Liveness pattern → tool README §Liveness. Delete the now-empty reference file. Update every doc that cited the reference path."
    status: pending
    depends_on: [phase-4-multi-surface-watch-implementation]
  - id: phase-6-skill-amendment
    content: "Phase 6: amend `.agent/skills/start-right-team/SKILL-CANONICAL.md` §0 to point at `pnpm agent-tools:collaboration-state -- coord how-to-start ...` rather than carry an invocation example. The SKILL retains the WHY (all-channels canonical, identity-tuple self-exclusion, doctrinal stance) but ceases to carry the HOW. Mirror the amendment in the Cursor/Codex/Gemini SKILL adapters per the three-layer model. Add a comment in the SKILL pointing readers at the rehomed canonical content."
    status: pending
    depends_on: [phase-5-content-migration]
  - id: phase-7-reference-folder-clarification
    content: "Phase 7: add or update `.agent/reference/README.md` (or equivalent) to state the folder's purpose explicitly: external materials we consult (W3C specs, vendor docs, RFCs), not a home for internal canonical definitions. Falsifiability: a grep over `.agent/reference/` after this phase should find no Oak-internal canonical tool definitions; if it does, they have not yet been rehomed."
    status: pending
    depends_on: [phase-5-content-migration]
  - id: phase-8-quality-gates
    content: "Phase 8: full quality gate chain on the integrated change (type-check, lint, test, markdownlint, format, portability:check, repo-validators:check, sub-agents:check). All gates green at single HEAD; one or two cohesive commits at most."
    status: pending
    depends_on: [phase-6-skill-amendment, phase-7-reference-folder-clarification]
  - id: phase-9-reviewer-dispatch
    content: "Phase 9: dispatch specialist reviewers — assumptions-expert (does the canonical-home migration close the SKILL-invocation-example fragility shape?), architecture-expert-betty (multi-surface watcher cohesion vs per-surface fragmentation trade-off), architecture-expert-fred (dependency direction: code-adjacent docs cite Practice rules, never the reverse), docs-adr-expert (content-migration completeness; no broken cross-references to the deleted reference file). Absorb verdicts before merge."
    status: pending
    depends_on: [phase-8-quality-gates]
---

# Coordination Watcher Canonicalisation

**Last Updated**: 2026-05-22 (Shaded Whispering Dusk session — plan authored from a metacognition pass after a worked-instance defect).
**Status**: 🔵 FUTURE — captured for sequencing; not promoted to `current/`.
**Activation trigger**: third-instance seen-file/watcher misconfiguration in a team session OR owner-direct promotion OR substrate growth that adds a fourth coordination surface (e.g. ADR-182 handoffs/ lands and the watcher remains comms-only).

## Context

Today's two-peer session opener exposed two compounding defects in the canonical-watcher contract.

### Worked instance 1 — the canonical home is misplaced

`.agent/reference/comms-watch-mechanism.md` is the de-facto canonical authority for the watcher contract. The SKILL points at it; readers treat it as source of truth. But `.agent/reference/` is for **external materials we consult** (W3C specs, vendor docs, RFCs), not for our own internal canonical definitions. The mis-placement is invisible from inside the doc itself — each surface (SKILL example, README, reference doc, CLI source) looks plausibly canonical from its own context — and the inconsistency between them only surfaces when an agent hits a specific defect.

### Worked instance 2 — the SKILL invocation example is fragile authority

`.agent/skills/start-right-team/SKILL-CANONICAL.md:139` carries a fully-specified watch invocation with `<agent-codename>.json` as the seen-file extension. The implementation at `agent-tools/src/collaboration-state/cli-runtime.ts:130-142` reads and writes the seen-file as **plain text, one event-id per line, `\n`-separated, append-only** — extension-agnostic. The `.json` extension in the SKILL is misleading: a fresh agent treats it as a format signal and writes JSON, which the CLI's `split(/\r?\n/u).filter(Boolean)` then treats as one invalid line. Every event becomes "unseen"; the watcher emits the full historical backfill (~1300 events today). The repo-internal `agent-tools/README.md:348` uses `.txt` instead — a third source of truth that contradicts the SKILL.

This is the second instance of seen-file/watcher misconfiguration cost in a single working day (the first was the missing-seen-file backfill flood captured in `.agent/memory/active/napkin.md` § Blustery Lifting Plume / 2026-05-22). Both share the same root cause shape: **the SKILL invocation example is the only authoritative documentation surface, and it can drift from the CLI it claims to specify**. The two-peer rotating-cast operational model amplifies the cost: every fresh peer pays the tax.

### Worked instance 3 — watcher scope is narrower than the substrate

The reference doc's §"Minimum viable substrate" enumerates only the comms event log. The watcher was scoped to comms-events. But the substrate has grown: `active-claims.json` now carries claims, `commit_queue`, and the `git_commit_window`; `conversations/` carries structured sidebars; `escalations/` carries owner-routed decision items; the handoff substrate (PDR-063 + ADR-182, currently in working-tree-only) is about to add `handoffs/`. The ad-hoc `/loop` self-prompt has become the de-facto polyfill for everything-other-than-comms. The right move is to align watcher scope with substrate scope, not to keep growing the polyfill.

## Non-Goals

- Schema canonicalisation of the comms event log (owned by [`2026-05-12-collaboration-protocol-hardening-r1b-opener.md`](../../agentic-engineering-enhancements/current/2026-05-12-collaboration-protocol-hardening-r1b-opener.md) if active).
- Standalone watcher-liveness substrate primitive + `/loop` validation experiment (owned by sibling plan [`comms-watch-liveness-floor.plan.md`](./comms-watch-liveness-floor.plan.md); this plan extends watcher scope and canonical-home, the liveness-floor plan extends substrate primitives — they are peer plans, not overlapping).
- Identity-filter widening to the full PDR-027 tuple (absorbed into [`start-right-team-singleton-lane-remediation.plan.md`](../current/start-right-team-singleton-lane-remediation.plan.md) WS3 per the 2026-05-19 scope reduction recorded on the sibling plan).
- The Claude-host `/loop` itself (this plan is platform-neutral; `/loop` remains the Claude-host agent-reasoning tick, distinct from any CLI heartbeat).

## Design Principles

1. **Canonical definitions belong code-adjacent.** Tool docs sit alongside the code that implements them; doctrine sits in `.agent/rules/` or PDRs. `.agent/reference/` is for external materials only.
2. **Executable beats authoritative-by-convention.** A CLI that emits the canonical invocation cannot drift from the implementation; a markdown example can. Where the choice exists, prefer the CLI.
3. **One canonical contract; cadence-specialised realisations.** Event-driven and time-driven watchers are two fire conditions over the same surface set. Document the surface set once; let CLIs realise it.
4. **Watcher scope matches substrate scope.** As the substrate grows, the watcher grows. The /loop polyfill is a smell, not a permanent design.
5. **The SKILL carries the WHY, not the HOW.** SKILL §0 retains "all-channels canonical, identity-tuple self-exclusion, doctrinal stance"; the invocation moves to the CLI that cannot drift.

## Acceptance Criteria

1. `pnpm agent-tools:collaboration-state -- coord how-to-start --platform claude --model claude-opus-4-7` (and equivalent for Codex/Cursor) emits a valid, executable watch invocation; running its output starts the watcher cleanly with no backfill flood and no agent-side filter.
2. `pnpm agent-tools:collaboration-state -- coord watch` (or the existing `comms watch` extended) covers comms, active-claims, conversations, and escalations by default. Each emitted line carries a `[CHANNEL][SURFACE]` discriminator.
3. `.agent/reference/comms-watch-mechanism.md` no longer exists; its substantive content lives at `agent-tools/src/collaboration-state/README.md` (tool spec) and a Practice rule or PDR-027 amendment (identity discipline + anti-patterns).
4. `.agent/skills/start-right-team/SKILL-CANONICAL.md` §0 points at `coord how-to-start`; no invocation example is carried inline.
5. `.agent/reference/README.md` (or equivalent) explicitly names the folder's purpose as external materials we consult, not internal canonical definitions.
6. A grep for `comms-watch-mechanism` across the repo returns only the expected updated cross-references — no broken pointers.

## Risks

- **Sub-agent CLI cohesion drift.** Adding multi-surface to the existing `comms watch` may pressure unrelated code paths. Cure: per-surface watchers as internal composition; single CLI entry as user surface.
- **Migration breakage on docs that cite the reference path.** Cure: grep-and-update during Phase 5; assumptions-expert verifies completeness in Phase 9.
- **Promotion of the seen-file priming into the CLI may collide with `intent-to-commit-and-session-counter.plan.md`'s session-counter primitive.** Cure: scope is limited to seen-file lifecycle; session-counter remains its own primitive.

## Related Plans And Sibling Records

- [`comms-watch-liveness-floor.plan.md`](./comms-watch-liveness-floor.plan.md) — peer plan; substrate-primitive layer (liveness record, check companion, `/loop` validation, watch-vs-poll honesty). This plan covers the developer-surface layer (canonical home, executable bootstrap, multi-surface scope, SKILL amendment).
- [`agent-coordination-cli-ergonomics-and-request-correlation.plan.md`](./agent-coordination-cli-ergonomics-and-request-correlation.plan.md) — peer plan on first-touch CLI friction; this plan complements it by cutting the SKILL-as-authority pattern that today's friction surfaces from.
- Worked instance defect captured at `.agent/memory/active/napkin.md` § Shaded Whispering Dusk / 2026-05-22 (this session, today).
- Pending-graduation candidate at `.agent/memory/operational/pending-graduations.md` § Canonical tool definitions belong code-adjacent (2026-05-22, second-instance trigger fired).
