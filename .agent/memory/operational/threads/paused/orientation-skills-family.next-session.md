---
fitness_line_target: 700
fitness_line_limit: 1100
fitness_char_limit: 70000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else graduate, then archive to a dated file proven byte-identical — never before full processing, never split/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: index-narrative-tables
---
# Thread: orientation-skills-family

**Purpose**: Design and build the human-facing teaching-surface family — the
portable agentic-AI-literacy primer (lead-in) plus the existing repo-bound
orientation lenses (`explain-repo`, `onboard-me`) — across the portability seam
defined by PDR-112.

## Participating agent identities (PDR-027)

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| Bora lifts Downdraft | claude | claude-opus-4-8 | 5120ef | planner → implementer | 2026-06-22 | 2026-06-22 |
| Orbit rides Horizon | claude | claude-opus-4-8 | ef8284 | implementer | 2026-06-22 | 2026-06-22 |
| Skipper tracks Reef | claude-code | claude-opus-4-8[1m] | 87a7bb | planner — authored the orientation-lens unification plan (owner-directed); did not implement | 2026-06-23 | 2026-06-23 |
| Zenith lifts Firmament | claude-code | claude-opus-4-8[1m] | 5c2f1b | implementer — executed the orientation-lens unification (WS0–WS6); folded two mid-execution owner directions | 2026-06-23 | 2026-06-23 |
| Skipper tracks Kelp | claude | claude-opus-4-8[1m] | 20962d | implementer — WS-B MCP-surface continuation: cherry-picked D1+D2 to a fresh worktree off main, refactored the test surface to behaviour-only, scoped the audience-model work | 2026-06-26 | 2026-06-26 |
| Cedar lifts Canopy | claude | claude-opus-4-8[1m] | 435d30 | implementer — WS-B D0 audience-model reconciliation + compliance firewall (DONE, pushed `36cb27444`); authored the data-sources brief; created the cross-worktree work-state map | 2026-06-26 | 2026-06-27 |
| Peony calls Trunk | claude-code | claude-opus-4-8 | d8ff86 | implementer — WS-B D3 (explain tool) landed `2ef673f4b`; authored the oak-under-the-hood full-lens reframe spine + the session wind-up/correction; D4/D5 and the retire-the-bake decision deferred to a fresh session per owner direction | 2026-06-27 | 2026-06-27 |
| Swordfish rides Surf | claude-code | claude-opus-4-8[1m] | d7bc11 | implementer — re-assessed first-hand, REWROTE the plan to the simple system (one behaviour, two channels, no carried content; pointer-shape MCP; delete the bake), validated via two ultracode suites; **W1 (behaviour) DONE + onboarding-expert-reviewed, uncommitted**; W2/W3 not started; mid-cycle handoff (claim bb9073cd, record set) for an owner-named successor | 2026-06-27 | 2026-06-27 |
| Juniper holds Tendril | claude-code | claude-fable-5 | 3dfd3b | implementer — dev-facing guide arc: drafted the doc the owner rewrote, wired discoverability, re-trued the lens close bookend (PRs #603 + #604, both owner-merged) | 2026-07-28 | 2026-07-28 |

## Where the current state is

- Paused. Every arc the journal carried has landed; the sequencing authority for anything
  further is the owning plans, not this record:
  `.agent/plans-backlog-2026-07/developer-experience/current/orientation-lens-unification.plan.md`
  (the family unification) and
  `.agent/plans-backlog-2026-07/sdk-and-mcp-enhancements/active/oak-under-the-hood.plan.md` (the
  reframe; the journal marked it DONE on 2026-06-28).
- The surfaces as they stand today: the primer skill at
  `.agent/skills/orientation/working-with-agentic-ai/SKILL-CANONICAL.md`; the one
  intent-discerning lens at `.agent/skills/orientation/under-the-hood/SKILL-CANONICAL.md`
  (renamed from `explain` by `SHA:8c292165b`, "rename explain to Oak: Under the Hood across the
  estate"); the host decision in ADR-202 (`202-orientation-as-one-intent-discerning-lens.md`);
  the developer-facing guide at `docs/engineering/working-with-this-repo-for-devs.md`.
- The whole pre-curation record (290 lines, four dated pickup sections, the lane state, the WS3
  disposition ledger, the propagation note) is preserved at
  `.agent/memory/operational/archive/orientation-skills-family-thread-2026-09-20.md`, blob
  `1e434fbe6`, byte-identical to the record at `SHA:846c96094`. Read it newest-first: a
  section's next step resolves in the section above it.

## Landed arcs (by merge commit, verified 2026-09-20)

- Primer and seam (2026-06-22): the `working-with-agentic-ai` primer authored as an owned,
  host-free skill; AGENT.md §Orientation Requests, CONTRIBUTING and the lenses wired to it; the
  onboarding-expert persona walk passed for all three personas (new to agentic AI; experienced,
  new to this repo; experienced, hunting a detail). The journal's commit `5b3453d41` does not
  resolve in this fork's history; the surfaces themselves are in the tree.
- Lens unification (Zenith lifts Firmament, 2026-06-23): WS0–WS6 of the unification plan; one
  lens `/oak-explain` replaced `onboard-me` and `explain-repo` by clean break (owner: no
  compatibility layers; lens name chosen by the owner; unique repo facts moved to README
  §Architectural invariants); ADR-202 records the host decision; PDR-112 not amended. A live
  owner walkthrough drove three refinements the simulations missed: a "Delivery grain"
  discipline, a "Scope, accurately" guard (this repo puts Oak *into* third-party AI assistants;
  it is not "how Oak does AI"), and a generic positioning boundary in `VISION.md`.
- WS-B MCP surface and the oak-under-the-hood reframe (Skipper tracks Kelp, Cedar lifts
  Canopy, Peony calls Trunk, Swordfish rides Surf; 2026-06-26 to 06-28): D0 audience model and
  compliance firewall, the behaviour-only test surface, D3 explain tool, then the owner's reframe
  to one behaviour across two channels (in-repo lens + MCP projection) routing to canonical
  public sources with minimum custom content. Merged via PR #243, `SHA:a0a85f60c`.
- Developer-facing guide (Juniper holds Tendril, 2026-07-28): PR #603, `SHA:5404a4aa2`
  (owner-rewritten; the owner's version is canonical and changes need the owner's sign-off);
  the session-close ruling ("`oak-wrap` closes EVERY session") landed as ADR-150/PDR-011
  amendments via PR #604, `SHA:238fc26c1`.

## Open items the journal named, with no other home

- Adapter H1 title-casing ("Working With Agentic Ai"): generator-owned cosmetic; fix in the
  generator repo-wide if desired (never hand-edit adapters).
- The onboarding-expert template's register pointer was recorded stale on MCP-297
  (`.agent/plans/...` where the register lives under `.agent/plans-backlog-2026-07/...`).
- WS0 of `mcp-tool-taxonomy-and-orientation.plan.md` (architectural review of the MCP stack) was
  gated on an owner go-ahead at the 2026-06-28 supersession; the plan, not this record, holds
  its state.
- The D0 audience-model questions left open at 2026-06-26: is "educator" distinct from the
  deferred "education expert"; where product and compliance experts sit.

## Lessons with no other home (the record's words, dates)

- 2026-06-26: a fresh worktree's ESLint flat-config imports the internal
  `@oaknational/eslint-plugin-standards`, which must be built or `eslint` exits 2 — run
  `pnpm install` AND `pnpm build` before any gate.
- 2026-06-26: hashing a source to detect change (the deleted fingerprint drift-guards) is a
  config-pin, the antithesis of a behaviour test; content greps are brittle. The compliance
  firewall (effort-domain; no curriculum; no volatile status) is a PR-review checklist item,
  not a test — the reviewer reads the served body for curriculum-domain leakage and
  point-in-time status.
- 2026-06-27: a session that took wrong turns (corrected mid-flight) hands on its conclusions,
  "validated facts" and reviewer verdicts as inputs to verify, not truth; the pickup re-fetches
  live state and applies verify-don't-trust most strictly where a claim is convenient.

## Deferred follow-ups (not blocking; out of this plan's scope)

- OVERTAKEN 2026-09-09 (carried in at the 1.185.0 sync, 2026-09-17): ADR-125
  §Owned-Skill Naming Convention and its 2026-09-09 amendment (MCP-706) settle
  this — the prefix applies to every canonical, `metadata.owned` (quoted) is
  declared metadata, and Practice-class membership is the class marker. The
  original wording stands below as the dated record.
  **`metadata.owned` doctrine-vs-implementation drift**: PDR-051 §Validation /
  ADR-125 item 5 say owned skills carry `metadata.owned: true`, but the live
  discriminator is `skills-lock.json` absence; existing owned skills
  (`napkin`, `working-with-graphs`) also lack the flag. Repo-wide reconciliation
  for docs-adr-expert — do not patch per-skill (inconsistent treatment of peers).
- **Adapter H1 title-casing** ("Working With Agentic Ai"): generator-owned
  cosmetic; fix in the generator repo-wide if desired (never hand-edit adapters).

## Propagation note

The primer is a propagation candidate: it travels to other Practice-bearing repos
by transplantation/seeding (PDR-005), gated on the host having wired a
continuation behind the edge (PDR-112 §Required). PDR-112 (the *pattern*)
graduates into `practice-lineage.md` only after it hydrates across more than one
repo (PDR-112 §Graduation intent) — single-instance now, so not graduated.
