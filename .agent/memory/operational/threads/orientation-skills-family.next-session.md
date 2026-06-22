# Thread: orientation-skills-family

**Purpose**: Design and build the human-facing teaching-surface family — the
portable agentic-AI-literacy primer (lead-in) plus the existing repo-bound
orientation lenses (`explain-repo`, `onboard-me`) — across the portability seam
defined by PDR-112.

## Participating agent identities (PDR-027)

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| Bora lifts Downdraft | claude | claude-opus-4-8 | 5120ef | planner → implementer | 2026-06-22 | 2026-06-22 |

## Lane state

- **Owning plan**: [`orientation-and-agentic-ai-literacy.plan.md`](../../../plans/developer-experience/current/orientation-and-agentic-ai-literacy.plan.md) (`current/`, executable).
- **Current objective**: WS0 complete; WS1 next (author the portable primer).
- **Current state** (landed `17572013d`, full pre-commit gate green):
  - **PDR-112** Accepted (owner-ratified 2026-06-22) — the teaching-surface
    family pattern: a portable lead-in (content-bearing, host-free, ends at one
    named hand-off edge) plus repo-bound lenses routing without duplication
    across a portability seam. The *primer's subject matter* is host phenotype,
    not doctrine; the *seam-plus-edge pattern* is the portable substance.
  - **ADR-125** clause 10 — portable vs repo-bound skill bodies (current-state).
  - **ADR-165** — host adoption of PDR-112 (current-state bullet).
  - Doctrine reviewed by a 4-lens panel (assumptions, docs, onboarding,
    architecture-barney); all conditions folded; transport corrected (skills
    travel by transplantation/seeding per PDR-005, NOT plasmid exchange).
- **Blockers / low-confidence areas**: none blocking. WS1 must verify whether the
  existing `portability:check`/`skills:check` already detect repo-specific body
  content before building the bespoke host-concept validator (confirmed gap this
  session, but re-verify at build time).
- **Next safe step**: **WS1** — author `working-with-agentic-ai` as an owned,
  content-bearing, host-free skill body ending at the named hand-off edge;
  regenerate adapters; land the host-concept guard (test + validator) only if the
  coverage gap holds. Then WS2 (wire AGENT.md routing + Branch F hand-off, primer
  outbound edge stays abstract) and WS3 (persona-coverage scope-gate).
- **Promotion watchlist**: the value-conveyance, knowledge-surfaces-are-curated,
  and decision-records-record-current-state lessons (this session's owner
  corrections) are candidate Practice doctrine — held in per-user memory; a
  future consolidation may graduate them.
