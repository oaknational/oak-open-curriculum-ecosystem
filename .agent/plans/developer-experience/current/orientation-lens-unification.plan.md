---
title: 'Orientation lens unification — one intent-discerning surface'
type: plan
collection: developer-experience
lane: current
status: 'DECISION-COMPLETE — pending WS0 readiness-reviewer pass, then READY FOR EXECUTION'
owning_thread: orientation-skills-family
design_confirmed_by: owner (2026-06-22 / 2026-06-23 conversation)
supersedes_reference: ../../../plans-old-archive/developer-experience/archive/completed/orientation-and-agentic-ai-literacy.plan.md
todos:
  - id: ws0-readiness-and-reground
    content: "Re-ground first-hand (the three current skills, PDR-112, AGENT.md §Orientation Requests, this plan); confirm the unify decision still holds via scope-from-goal; record the four open sub-decisions with the recommended defaults; dispatch readiness reviewers (assumptions-expert, onboarding-expert, docs-adr-expert) and fold actionable findings."
    status: pending
  - id: ws1-author-unified-lens
    content: "Author the single repo-bound orientation lens SKILL-CANONICAL: the conversational discernment contract (<=3 adaptive questions, never a menu), the three delivery modes (specific answer / area overview / guided tour), setup as a distinct go-ahead-gated sub-branch, the PDR-112 primer hand-off edge, the merged live-doc router table, the Headline Invariants, setup-only state detection, re-entry/personal-state, and completion. Fold explain-repo's briefing doctrine in as overview mode (scopable to an area)."
    status: pending
    depends_on: [ws0-readiness-and-reground]
  - id: ws2-retire-redirect-old-skills
    content: "Retire explain-repo (and onboard-me if renamed) into the unified lens; keep their trigger phrasings routing in (no dangling slash commands); regenerate adapters; green pnpm skills:check + pnpm portability:check; reconcile .claude/settings.json skill-permission entries."
    status: pending
    depends_on: [ws1-author-unified-lens]
  - id: ws3-agent-md-routing
    content: "Rewrite AGENT.md §Orientation Requests: route every orientation intent into the one lens (lens discerns mode internally); keep the primer leading in via the PDR-112 edge; remove the explain-vs-onboard split language."
    status: pending
    depends_on: [ws1-author-unified-lens]
  - id: ws4-host-adr
    content: "Author a host ADR recording the host-phenotype decision (one unified intent-discerning orientation lens; modes tour/overview/specific; setup distinct and go-ahead-gated; primer unchanged). Cite PDR-112 as the instantiated pattern and state explicitly that PDR-112 is NOT amended."
    status: pending
    depends_on: [ws1-author-unified-lens]
  - id: ws5-validation-simulations
    content: "Run onboarding-expert persona walks across the behavioural acceptance scenarios; update the onboarding-simulations register; run markdownlint, skills:check, portability:check, format. Behavioural proof, not file-edit proof."
    status: pending
    depends_on: [ws2-retire-redirect-old-skills, ws3-agent-md-routing, ws4-host-adr]
  - id: ws6-thread-continuity
    content: "Reopen the orientation-skills-family thread (new lane state + identity row), update repo-continuity, cross-reference the superseded archived plan, and run the consolidation/handoff learning loop at close."
    status: pending
    depends_on: [ws5-validation-simulations]
---

# Orientation lens unification — one intent-discerning surface

## End goal

When a contributor asks to be told about this repository, about agentic
engineering, about working with AI, or anything orientation-shaped, the agent
**discerns their interest, experience, focus, and the lens that fits** through
two or three carefully crafted, friendly, conversational questions — never a
menu — and then delivers in the mode they actually want. Today that behaviour is
unreliable: it depends on which of two skills the phrasing happens to route to,
and the "just tell me about the repo" path (`explain-repo`) is deliberately
non-interactive and briefs immediately without discerning anything.

## Mechanism (why this produces the outcome)

The current split treats **delivery mode** — direct answer vs guided walk — as a
*skill boundary* (`explain-repo` vs `onboard-me`), so the agent must *guess the
mode from phrasing* and routes to one fixed behaviour. Make delivery mode a
**discerned variable** inside one orientation lens and the guess disappears: the
lens asks (or infers), then delivers. One lens also removes the drift-and-
duplication risk of two surfaces re-teaching the same material, and gives the
homeless middle ("I want to understand *one area*") and narrow end ("I just need
*one fact*") a home.

## The design (confirmed with the owner)

**One unified repo-bound orientation lens.** Delivery mode is a discerned
variable with **three categories** (two felt gulfy; three fills the scoped middle
and the pinpoint end):

1. **Specific answer** — a pinpoint, live-doc-grounded answer at the right level,
   then offers to widen.
2. **Area overview** — a synthesised briefing (the current `explain-repo`
   behaviour), now **scopable to an area** (the whole repo, or one area such as
   search, the Practice, or the graph stack), then offers depth or the tour.
3. **Guided tour** — the current `onboard-me` paced, one-at-a-time interactive
   walk, which can lead into setup.

These form an **escalation ladder** (specific → overview → tour): the person
picks an entry point and widens only if they want.

**The discernment front door.** On any orientation request the lens opens
conversationally (warm greeting; **no tool calls or probes before the person
answers** — inherited from `onboard-me`) and gathers, in **≤3 conversational
questions, adaptively** (infer from phrasing and skip what is already clear;
**never a forced-choice menu** — offer flavours inside a sentence and let them
answer in their own words):

- **What** they want to understand (topic / area, or the specific question);
- **Who / angle** — their background and lens (engineer, strategy, educator,
  AI-builder, leader) and rough experience, to pitch language and depth;
- **Mode** — tour / overview / specific — usually inferable from *What*.

**Setup stays distinct.** Machine-state detection, install, env, and verify steps
are a separate, **go-ahead-gated** capability that the tour (or an overview) leads
into once the person has said they want hands-on help. Setup is an *action with
side effects*, not an information mode — it must not be folded into "a piece of
information delivered."

**The primer is unchanged.** The portable `working-with-agentic-ai` primer
remains the PDR-112 lead-in; it still hands off to the repo-bound surface — now
one lens instead of two — via the single named edge.

## Governance (read before WS4)

This is a **host-phenotype** change, not a portable-doctrine change.

- **PDR-112 is NOT amended.** It governs the portable-primer ↔ repo-lens *seam*
  and explicitly scopes the host's instantiation — *which lenses exist, the
  routing, the lead-in's placement* — to **host ADRs and the operational entry
  point** (`PDR-112 §Consequences/Required`). Unifying two repo-bound lenses into
  one is exactly that host instantiation. The primer body and the seam-plus-edge
  contract are untouched.
- **PDR-009** (canonical-first, no duplication) still holds: one lens, content
  read live from the corpus, no teaching content duplicated.
- **ADR-125** governs the adapter topology: canonical body in `.agent/skills/`,
  generated thin adapters in `.claude/` and `.agents/`; never hand-edit adapters.
- The decision is recorded in a **new host ADR** (WS4) plus the AGENT.md routing
  block (WS3).

## Open sub-decisions (recorded with recommended defaults; owner may override at WS0)

1. **Skill name for the unified lens.** Default: rename to a mode-neutral
   `orient` (`/oak-orient`), retaining the `onboard`/`explain`/`tell me about`
   phrasings as routing triggers. Owner taste call; if undecided, keep
   `onboard-me` as the canonical name and let it own all three modes.
2. **Mode question shape.** Default: **adaptive** (infer from phrasing, confirm
   only when ambiguous), not a fixed always-asked question.
3. **Old skills disposition.** Default: fold `explain-repo` content into overview
   mode and **retire the separate skill body**, but keep its trigger phrasings
   routing into the lens so no slash-command muscle-memory dangles.
4. **Host ADR.** Default: **yes**, lightweight — PDR-112 §Required points host
   instantiation at a host ADR plus the entry point.

## Means (workstreams)

Landing unit note: this is a docs-and-skills change, so the unit of landing is a
coherent skill/routing/ADR edit validated by **behavioural persona simulation and
the skills/markdown gates**, not unit tests. Proof levels are `non-code` and
`value-proxy` (persona walks); there is no product code under test here.

### WS0 — Readiness and re-ground (blocking)

Re-read first-hand the three current skills, `PDR-112`, `AGENT.md §Orientation
Requests`, and this plan (they may have changed). Run the
[plan-body first-principles check](../../../rules/plan-body-first-principles-check.md):
confirm the three skills still match this plan's description and the unify
decision still holds; emit a `Goal · In · Out` scope artefact. Record the four
sub-decisions. Dispatch readiness reviewers (`assumptions-expert`,
`onboarding-expert`, `docs-adr-expert`) and fold actionable findings.
**Acceptance:** scope artefact emitted; sub-decisions recorded; reviewer findings
dispositioned.

### WS1 — Author the unified lens (depends: WS0)

Author the canonical SKILL-CANONICAL for the one lens, preserving the inherited
invariants below and folding `explain-repo`'s briefing doctrine in as overview
mode. **Acceptance:** one skill body covers all three modes + the setup
sub-branch + the primer edge; no teaching content duplicated; a leakage/phenotype
read confirms the lens reads the live corpus rather than baking content.

Inherited invariants that MUST survive (from `onboard-me` / `explain-repo`):
the greeting-first, no-probe-before-answer contract; questions as free prose, never
menus; the private routing model (never displayed); plain language until depth is
opted into; the **live-doc router table** (docs win over the skill body); the six
Headline Invariants; state detection only inside setup; re-entry/personal-state
(untracked, **no PII**); honest completion attribution; the PDR-112 hand-off edge.

### WS2 — Retire/redirect the old skills (depends: WS1)

Per sub-decision 3. Regenerate adapters via the skills adapter generator; reconcile
`.claude/settings.json`. **Acceptance:** `pnpm skills:check` and
`pnpm portability:check` green; no orphaned adapters; old trigger phrasings still
route to the lens.

### WS3 — AGENT.md routing rewrite (depends: WS1)

Rewrite `AGENT.md §Orientation Requests` to route every orientation intent into the
one lens (mode discerned internally), with the primer still leading in via the
edge. **Acceptance:** the block names one lens plus the primer; no guess-which-skill
language; a fresh read routes "tell me about this repo", "explain X", "how does Y
work", "onboard me", "where do I start", and "new to AI" all into the lens (the
last via the primer edge).

### WS4 — Host ADR (depends: WS1)

Author the host ADR per the Governance section. **Acceptance:** ADR accepted and
cross-referenced from AGENT.md and the lens; it states PDR-112 is not amended;
PDR-112 file unchanged.

### WS5 — Validation by simulation (depends: WS2, WS3, WS4)

Run `onboarding-expert` persona walks across the behavioural acceptance scenarios
below; update
[`onboarding-simulations-public-alpha-readiness.md`](../active/onboarding-simulations-public-alpha-readiness.md);
run `markdownlint`, `skills:check`, `portability:check`, `format:root`.
**Acceptance:** every scenario passes its expected behaviour; gates green.

### WS6 — Thread, continuity, learning loop (depends: WS5)

Reopen the `orientation-skills-family` thread with new lane state and an identity
row; update `repo-continuity.md`; cross-reference the superseded archived plan; run
`oak-consolidate-docs` / `oak-session-handoff` at close. **Acceptance:** thread
reopened and continuity reflects the unified lens; archived plan cross-referenced.

## Behavioural acceptance scenarios (the real proof — simulate each)

- *"Tell me about this repo"* → opens with conversational discernment (NOT an
  immediate briefing, NOT a menu); infers/asks angle and mode; delivers a
  whole-repo overview pitched to their lens; offers tour or a specific dive.
- *"How does the SDK codegen work?"* → recognised as specific; answered directly
  from live docs at the right level; offers to widen.
- *"I want to understand the search architecture"* → area overview scoped to
  search; offers depth or the tour.
- *"Onboard me" / "where do I start"* → guided tour; leads into go-ahead-gated
  setup if they want hands-on.
- *"I'm new to working with AI agents"* → the primer leads in (PDR-112 edge), then
  forwards into the lens.
- Across all: no duplicated teaching content; the PDR-112 seam intact; gates green.

## Prerequisites

- **Blocking:** none — the design is owner-confirmed and all inputs are in-repo.
- **Beneficial:** the `onboarding-expert` persona-simulation register
  (`developer-experience/active/`) as the established validation mechanism.
  Minimum shippable shape without it: WS5 still runs manual persona walks and
  records the verdicts inline in the thread record.

## Non-goals (YAGNI)

- Not changing the `working-with-agentic-ai` primer.
- Not amending PDR-112.
- Not changing what any doc *says* — only how orientation is discerned and
  delivered. No new teaching content is authored; the live corpus is reused.
- Not folding setup (machine actions) into an information mode.
- Not adding a forced-choice menu UI for the mode question.

## Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Over-merge — setup folded into "information" | Forbidden by design; setup is a distinct go-ahead-gated sub-branch. WS1 acceptance checks the boundary. |
| Under-merge — the explain-vs-onboard binary survives | The whole point is to dissolve it; WS3 removes the split language; WS5 scenario "tell me about this repo" must discern, not briefing-dump. |
| Breaking the PDR-112 seam | Do not touch the primer body or the edge contract; WS4 acceptance asserts PDR-112 unchanged. |
| Lost discoverability of `/oak-explain-repo` | Keep trigger phrasings routing into the lens (sub-decision 3). |
| Not-a-menu regression | The mode offer stays conversational flavours; WS5 simulations check for menu shape. |
| Live-doc drift | The lens keeps the router-principle (docs win); no content baked into the body. |

## Foundation alignment

- [PDR-112](../../../practice-core/decision-records/PDR-112-teaching-surface-family-across-a-portability-seam.md)
  — the pattern instantiated (host instantiation is phenotype; not amended).
- [PDR-009](../../../practice-core/decision-records/PDR-009-canonical-first-cross-platform-architecture.md)
  — canonical-first, no duplication, routing.
- [ADR-125](../../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md)
  — adapter topology (regenerate, never hand-edit).
- [ADR-117](../../../../docs/architecture/architectural-decisions/117-plan-templates-and-components.md)
  and [PDR-018](../../../practice-core/decision-records/PDR-018-planning-discipline.md)
  — plan architecture and discipline.
- [`present-verdicts-not-menus`](../../../rules/present-verdicts-not-menus.md) and
  `onboard-me`'s not-a-menu greeting contract — the conversational discernment.
- `principles.md` first question — *could it be simpler?* One lens is simpler than
  two-plus-a-guess.

## Plan-body first-principles check

Fires at **WS0**: re-read the three current skills + PDR-112 + the AGENT.md
routing block first-hand and confirm they match this plan before authoring (they
may have been edited since 2026-06-23). The landing path is the unified skill body

- adapters + AGENT.md + a host ADR — confirm those are the live surfaces. No
vendor-literal call shapes are involved.

## Lifecycle triggers

Reference [`lifecycle-triggers`](../../templates/components/lifecycle-triggers.md).
Execution touches skills, an entry point, and an ADR — significant Practice/doc
change → WS0 readiness reviewers + WS5 onboarding/docs validation are the required
touch points; WS6 runs the consolidation learning loop at completion.

## Readiness reviewers

Before this plan is marked `READY FOR EXECUTION`, WS0 dispatches
`assumptions-expert` (proportionality/readiness), `onboarding-expert` (the surface
being changed is the onboarding front door), and `docs-adr-expert` (a new host ADR
plus skill-doctrine edits). They have **not** been dispatched at authoring time;
WS0 owns that gate.
