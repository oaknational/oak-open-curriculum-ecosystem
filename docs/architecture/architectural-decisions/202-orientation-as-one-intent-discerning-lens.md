# ADR-202: Orientation as one intent-discerning lens

- **Status:** Accepted (2026-06-23). Owner-confirmed design (2026-06-22 / 2026-06-23 conversation).
- **Thread:** `orientation-skills-family`.
- **Builds on:**
  [PDR-112](../../../.agent/practice-core/decision-records/PDR-112-teaching-surface-family-across-a-portability-seam.md)
  (the teaching-surface family across a portability seam — **not amended** by this ADR; see Decision);
  [PDR-009](../../../.agent/practice-core/decision-records/PDR-009-canonical-first-cross-platform-architecture.md)
  (canonical-first, no duplication, routing);
  [ADR-125](125-agent-artefact-portability.md) (the canonical-body / generated-adapter topology).
- **Supersedes:** no prior orientation ADR exists — the orientation surface was previously governed only by
  PDR-112 and the AGENT.md routing block. This is the first host ADR for it.

## Context

A newcomer who wants to understand this repository arrives with one of several intents: a pinpoint question
("how does the SDK codegen work?"), a request to be told about the whole thing ("explain this repo", "give me
an overview"), a wish to understand one area ("I want to understand the search architecture"), or a request
to be walked through and set up ("onboard me", "where do I start"). PDR-112 establishes that the repo's
human-facing teaching surface is a family of intent-routed lenses across a portability seam: a portable
agentic-AI-literacy primer (the lead-in) plus repo-bound lenses that read the live corpus.

The host's first instantiation of the repo-bound side was **two** lenses: `explain-repo` (a non-interactive
executive briefing) and `onboard-me` (an interactive, paced walker). That split made **delivery mode** — a
direct answer versus a guided walk — a _skill boundary_. The consequence: the agent had to **guess the mode
from the caller's phrasing** and routed to one fixed behaviour. The guess was unreliable, the "just tell me
about the repo" path briefed immediately without discerning anything, and the scoped middle ("I want to
understand _one area_") and the pinpoint end ("I just need _one fact_") had no home. Two surfaces re-teaching
the same material also carried a standing drift-and-duplication risk.

PDR-112 §Consequences/Required scopes **which lenses exist, the routing, and the lead-in's placement** to host
phenotype surfaces — host ADRs and the operational entry point — not to the portable pattern. Deciding how
many repo-bound lenses this host has, and what each owns, is therefore a host-ADR decision. This ADR records
it.

## Decision

**The repo's repo-bound orientation surface is one intent-discerning lens, not a family of mode-specific
skills.**

1. **Delivery mode is a discerned variable, not a skill boundary.** The single lens delivers in one of three
   modes — a pinpoint **specific answer**, a synthesised **area overview** (scopable to the whole repo or one
   area), or a paced **guided tour** — and _discerns which mode fits_ from the caller's intent rather than
   forcing the caller to pick a skill. The modes form an escalation ladder (specific → overview → tour); the
   caller enters at the rung that fits and widens only if they want.

2. **Setup is a distinct, side-effecting capability — never an information mode.** Machine-state detection,
   install, environment, and verification are actions with side effects, reached only after the person has
   asked for hands-on help and gated on explicit go-ahead. They are not one of the information delivery modes
   and must never be folded into one.

3. **The PDR-112 seam and the portable primer are unchanged.** The `working-with-agentic-ai` primer remains
   the portable lead-in; it still ends at a single named hand-off edge, and **this one lens is the
   continuation behind that edge** (PDR-112 §Required's no-dangle precondition stays satisfied — exactly one
   continuation sits behind the edge). The primer body and the seam-plus-edge contract are untouched.

4. **PDR-112 is not amended.** Unifying two repo-bound lenses into one is precisely the host instantiation
   PDR-112 scopes to host phenotype surfaces. The portable pattern (a portable lead-in joined to repo-bound
   lenses by a named edge) is unchanged; only this host's count and shape of repo-bound lenses changes.

5. **No duplicated teaching content, and minimal unique content in the skill (PDR-009 holds).** The lens
   reads its content live from the canonical corpus and routes between docs without duplication; it carries
   discernment, delivery shapes, and manners — not repo facts. The architectural invariants the orientation
   surface surfaces live in a docs surface (`README.md` §Architectural invariants), authored **once** there;
   the lens points to that single source rather than restating it. Where the skill would otherwise bake a
   repo fact, the fact is moved to the appropriate doc and the skill links to it.

6. **Clean break — no compatibility shim** (`principles.md` §Architectural Excellence Over Expediency, the
   always-applied `replace-dont-bridge` rule). The retired lens names (`onboard-me`, `explain-repo`) and
   their slash commands are **removed, not aliased**; every live reference is migrated to the one lens in the
   same change. One concept, one name, everywhere. Old invocation paths are retired by design, not bridged —
   git history carries the evolution.

The **mode names, the discernment question contract, the live-doc router table, and the setup mechanics live
in the skill body**, not in this ADR. This ADR records the architectural shape (one lens; mode as a variable;
setup distinct; seam unchanged); the skill is the source of truth for how that shape behaves.

## Consequences

- The mode guess disappears: the lens discerns intent, then delivers, so phrasing no longer routes to a fixed
  behaviour. The scoped-middle and pinpoint intents gain a home.
- The drift-and-duplication risk of two re-teaching surfaces is removed by construction — there is one
  surface, and it routes rather than restates.
- The host now carries one repo-bound orientation lens behind the PDR-112 edge instead of two. The portable
  pattern's three-context generality is unaffected; this is a host-count change, recorded as phenotype.
- The decision is operationalised in the skill canonical (`.agent/skills/explain/`), its generated adapters
  (ADR-125), and the AGENT.md §Orientation Requests routing block. Validation is behavioural: simulated
  orientation conversations plus a live owner walkthrough, recorded on the onboarding-simulations register.
