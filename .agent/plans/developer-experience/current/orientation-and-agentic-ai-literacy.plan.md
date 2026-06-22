---
name: "Orientation and Agentic-AI Literacy — the teaching-surface family"
overview: "Name the human-facing teaching surface as one family across a portability seam; author a portable agentic-AI primer as the lead-in; enhance existing repo orientation surfaces; doctrine (PDR + ADR) lands first."
todos:
  - id: ws0-doctrine
    content: "WS0: Author PDR-112 (portable teaching-surface pattern, Proposed) + amend ADR-125 (skills placement) + thin ADR-165 host-adoption touch + AGENT.md routing. No new standalone ADR. Owner-ratified; docs-adr-expert + assumptions-expert sign-off. Non-code proof."
    status: pending
    depends_on: []
  - id: ws1-primer
    content: "WS1: Author the portable agentic-AI primer as skill `working-with-agentic-ai` (owned, content-bearing body) + generated adapters. Repo-agnostic body ending at the named hand-off edge. skills:check + portability:check green; body-portability validator proves no repo specifics (verified gap: real work)."
    status: pending
    depends_on: [ws0-doctrine]
  - id: ws2-surface-enhancements
    content: "WS2: Wire the family into existing surfaces — AGENT.md §Orientation Requests (name primer + family), onboard-me Branch F (redirect hand-off to/from primer), explain-repo (family depth-path), CONTRIBUTING §Working with AI Coding Agents (point at primer). No duplicated teaching content (router principle)."
    status: pending
    depends_on: [ws0-doctrine]   # routing text parallel-safe post-WS0; discovery-probe acceptance gates on ws1-primer
  - id: ws3-persona-coverage
    content: "WS3: Three-persona coverage check (new-to-agentic-AI / new-to-repo / hunting-specifics) via the onboarding register's persona-sim methodology. Disposition ledger: every persona gets a recorded coverage verdict. Any unserved reader → owner-gated new repo-side surface."
    status: pending
    depends_on: [ws1-primer, ws2-surface-enhancements]
  - id: ws4-quality-gates
    content: "WS4: Full quality-gate chain plus skills:check, portability:check, markdownlint on the integrated delivery."
    status: pending
    depends_on: [ws3-persona-coverage]
  - id: ws5-adversarial-review
    content: "WS5: Adversarial close review — docs-adr-expert, onboarding-expert, assumptions-expert, an architecture reviewer for the portability-seam boundary. Document findings."
    status: pending
    depends_on: [ws4-quality-gates]
  - id: ws6-propagation-consolidation
    content: "WS6: Propagate to the onboarding register + completed-plans on archive; run /oak-consolidate-docs."
    status: pending
    depends_on: [ws5-adversarial-review]
isProject: false
---

# Orientation and Agentic-AI Literacy — the teaching-surface family

**Last Updated**: 2026-06-22
**Status**: 🟡 PLANNING (queued; WS0 doctrine is owner-ratification-gated before WS1+)
**Scope**: Establish the repo's human-facing teaching surface as one coherent family across a portability seam, add the missing portable agentic-AI primer as the lead-in, and enhance existing surfaces — without duplicating content or inventing unneeded new surfaces.

---

## Context

A newcomer to this repository meets it through orientation skills. Two exist
today and were designed as routers — they hold the journey shape and the
manners and read all content from the live canonical docs at walk time, so they
never go stale:

- `explain-repo` — non-interactive executive briefing ("what is this, briefly").
- `onboard-me` — interactive, state-detecting, go-ahead-gated walker ("get me
  in and operating"); its Branch F already tries to teach "working with agents
  here".

These were grown by accretion, never named as a system. Discovery is routed by
`.agent/directives/AGENT.md` §Orientation Requests plus the skill descriptions.

### Problem Statement

1. **A missing member.** There is no artefact that teaches *how to work with
   agentic AI in general* — repo-independent literacy for a contributor new to
   agentic AI. A repo-wide search finds only repo-specific or tangential
   material. The three contributor personas the owner named are: new to agentic
   AI; experienced but new to this repo and the Practice; experienced and
   hunting a specific detail of the Practice or of agentic frameworks. Only the
   second and third are served today.
2. **An un-named system.** The surfaces are aspects of one thing — the
   human-facing teaching surface of an agent-first repo — but nothing names the
   family, its intent/depth division, or its hand-off contracts, so the three
   surfaces drift toward re-teaching each other's material.
3. **A portability seam ignored.** "How to work with agentic AI in general" is
   portable Practice substance (PDR-035: agent-work capabilities are Practice
   substance by default; PDR-051: a skill's canonical body carries the workflow
   doctrine, not the host). It is the one member reusable across every
   Practice-bearing repo — it travels by wholesale transplantation or seeding
   (PDR-005), **not** the Core plasmid (skills are not in the plasmid package; the
   pattern PDR is). Folding it into a repo-bound skill would strand the
   highest-leverage asset behind this repo's phenotype.

### Existing Capabilities

Build on these; do not duplicate:

- `.agent/skills/explain-repo/SKILL-CANONICAL.md`,
  `.agent/skills/onboard-me/SKILL-CANONICAL.md` and their generated adapters.
- `.agent/directives/AGENT.md` §Orientation Requests (intent → skill routing).
- `docs/foundation/agentic-engineering-system.md` (repo Practice explainer),
  `CONTRIBUTING.md` §Working with AI Coding Agents, the README Engineering
  Practice section, and the Headline Invariants (owned by onboard-me).
- `.agent/plans/developer-experience/active/onboarding-simulations-public-alpha-readiness.md`
  — the canonical onboarding document and its persona-simulation methodology.
- The skills generator and `pnpm skills:check` / `pnpm portability:check` gates
  (PDR-009, PDR-051).
- Practice propagation via the Practice Box (ADR-124).

---

## User Stories

These are internal skills that support **the agent** in helping **contributors**
— a two-level value chain. Stories are therefore dual-actor: contributor stories
fix the outcome; agent stories fix the skill's interface and manners (Agent
Experience is first-class, PDR-111). Stories anchor the end goal and the
acceptance criteria for the reader-facing workstreams (WS1–WS3). They do **not**
apply to the doctrine layer (WS0 is decision-record-shaped), and none presupposes
a new repo-side surface — that stays behind the WS3 scope-gate.

### Contributor stories (the outcome — one per named persona)

- **C1 (new to agentic AI):** As a contributor new to working with agentic AI, I
  want a plain-language primer that assumes no knowledge of this repo, so that I
  gain footing before meeting the repo's Practice.
- **C2 (experienced, new to this repo):** As a contributor fluent with agentic
  AI but new to this repo, I want to skip the general primer and go straight to
  how the Practice works here, so that I am productive without re-learning
  basics.
- **C3 (hunting a specific detail):** As an experienced contributor, I want to
  jump to the precise doctrine on one aspect of the Practice or of agentic
  frameworks, so that I get the answer without a guided walk.

### Agent stories (the skill's interface and manners)

- **A1:** As the agent guiding a newcomer, I want the primer's hand-off edge to
  name exactly where to route them next, so that I lead them into the repo
  Practice without improvising or dumping internals prematurely.
- **A2:** As the agent, I want each family member to declare which reader-intent
  it owns and which it routes onward, so that I send a contributor to the right
  surface instead of re-teaching another surface's material.
- **A3:** As the agent on any platform, I want the primer to be portable (no repo
  specifics in its body), so that the same primer serves contributors in every
  Practice-bearing repo it propagates to.

Each story's "so that" is the acceptance signal for the workstream that serves
it: C1/A1/A3 → WS1; A2 → WS2; C1–C3 coverage → WS3.

---

## Design Principles

1. **The portability seam is a hard boundary.** Portable Practice substance (the
   primer) is never embedded in a repo-bound artefact. "Leads in" is a *named
   hand-off edge*, not embedded repo content: the primer ends at a declared
   continuation point and each host repo wires its own continuation behind it.
   Memotype/phenotype split per PDR-035 and PDR-051.
2. **Reuse and enhance first; create only where a reader is unserved.** New
   repo-side surfaces are scope-gated behind the WS3 persona-coverage check and
   owner confirmation — never assumed.
3. **Router principle holds across the family.** Skills carry shape and manners
   and read content from live docs at runtime; content is authoritative in one
   place and referenced elsewhere (ADR-117 one-way content flow; the router
   principle is also grounded in `onboard-me` §Router Principle and ADR-125's
   canonical-content authority). No teaching content is duplicated across family
   members.
4. **Doctrine before implementation.** The portable PDR and the host ADR are
   authored and owner-ratified first; every downstream artefact cites them.

**Non-Goals** (YAGNI):

- No new repo-side "mastery / reference" lens skill unless WS3 shows the primer
  plus existing surfaces leave the new-to-repo or hunting-specifics reader
  unserved.
- Not teaching Oak's educator end-users to work with agentic AI — that is the
  separate user-facing capability estate, not this developer surface.
- Not rewriting `explain-repo` or `onboard-me` behaviour; only family wiring and
  the Branch F hand-off change.
- The primer body carries no repo-specific content; repo specifics live behind
  the hand-off edge.

---

## Lifecycle Triggers

> See [Lifecycle Triggers component](../../templates/components/lifecycle-triggers.md)

- **Start-right**: each execution session opens with a start-right skill naming
  its WS landing target.
- **Active claim**: register the touched areas before edits — the doctrine homes
  (`.agent/practice-core/decision-records/`, `docs/architecture/architectural-decisions/`),
  the skills surfaces (`.agent/skills/**`, generated adapters), `docs/`, and
  `.agent/directives/AGENT.md`. Disjoint from the live strategy and substrate
  lanes at plan-authoring time; re-check at each session open.
- **Decision thread**: WS0 doctrine ratification is an owner gate; record the
  ratification and any carried assumptions on the touched thread record.
- **Session handoff / consolidation**: WS6 runs `/oak-consolidate-docs`.

---

## Cycle Dependencies and Parallelisation

This plan is doctrine-and-documentation shaped: most landing units are documents
proven by non-code acceptance (reviewer sign-off, discovery probes, persona
walk-throughs) per the proof contract. Code TDD cycles apply where code lands —
specifically the WS1 portability validator that proves the primer body carries
no repo specifics (a test + the validator product code in `agent-tools`, landed
together in one commit).

Dependency shape:

- **WS0 → everything.** The doctrine fixes the portability seam, the family
  members, and the primer's content home; nothing downstream is finalised
  before it is ratified. WS0 is blocked on owner ratification.
- **WS1 and WS2 both consume WS0.** WS2's routing *text* is parallel-safe with
  WS1 — it references the WS0-decided primer path/id, which does not require the
  primer body to be authored first. Only WS2's discovery-probe acceptance (a
  fresh agent actually routing *to* the primer) gates on WS1 landing.
- **WS3 consumes WS1 + WS2** (it walks the integrated family).

---

## Reviewer Scheduling (phase-aligned)

### Plan-phase (challenges solution-class)

- `assumptions-expert` — is the family doctrine warranted and proportionate; is
  WS3's scope-gate the right guard against inventing an unneeded surface; is the
  portability classification of the primer sound.

### Mid-execution (challenges solution-execution)

- `docs-adr-expert` — PDR/ADR quality, cross-citation correctness, intent vs
  implementation drift (WS0, WS2).
- `onboarding-expert` — first-contact quality of the primer and the wired family
  (WS1, WS2, WS3).
- `test-expert`, `type-expert` — the WS1 portability validator cycle.
- `architecture-expert-fred` or `architecture-expert-barney` — the portability
  seam boundary (WS5).

### Close (verifies coherence)

- `docs-adr-expert`, `onboarding-expert`, `assumptions-expert` — WS5.

---

## WS0 — Doctrine: PDR-112 + ADR-125 amendment + ADR-165 touch

Author the foundational decision records. This is the ratification that turns
three accreted surfaces into a governed family.

**PDR-112 (portable, `.agent/practice-core/decision-records/`)** — the
teaching-surface doctrine: a Practice-bearing repo's human-facing teaching
surface is a family of intent-routed lenses across a portability seam; a
portable agentic-AI primer is the portable member and the lead-in, handing off
via a named edge into repo-specific Practice surfaces; family members route, and
never duplicate, the shared corpus. Carries `metadata.owned: true` and
graduation intent.

**Host instantiation (no new standalone ADR — resolved 2026-06-22 via
exploration + first-hand verification):**

- **Amend ADR-125** (agent-artefact portability) to specialise the three-layer
  canonical/adapter model for the teaching-surface skills. The primer's
  placement is squarely ADR-125's scope (verified first-hand), so a net-new ADR
  would fragment it.
- **Extend `AGENT.md` §Orientation Requests** — the discoverable operational
  home — with the family members (`explain-repo`, `onboard-me`, the
  `working-with-agentic-ai` primer), the owned intents, and the hand-off routing.
- **Thin touch to ADR-165** recording this repo's adoption of PDR-112 as host
  phenotype, consistent with the PDR-035 → ADR-165 precedent.

All cite PDR-112. The primer's content home is a **portable owned skill** (WS1),
resolved against ADR-124/125 and PDR-051 (precedent: a content-bearing skill
body, as in `working-with-graphs`).

**Consumes**: the design settled with the owner across this thread; PDR-035,
PDR-051, PDR-009, ADR-117, ADR-124, ADR-125.

**Acceptance** (non-code proof):

1. PDR-112 authored (Proposed); ADR-125 amended and ADR-165 touched, both
   citing PDR-112; the portability seam, the discovery intents, and the
   hand-off-edge mechanism are stated. No new standalone ADR minted.
2. The primer's content home is recorded as a portable owned skill, with cited
   rationale (ADR-125 placement; precedent `working-with-graphs`).
3. Owner ratification recorded on the thread record.
4. `docs-adr-expert` and `assumptions-expert` sign-off folded.
5. `pnpm markdownlint:root` green; ADR/PDR indexes updated; zero broken links.

**Deterministic validation**:

```bash
pnpm markdownlint:root
pnpm repo-validators:check
```

---

## WS1 — The portable agentic-AI primer

Author the genuinely new artefact: the repo-agnostic primer that teaches how to
work with agentic AI, ending at the named hand-off edge.

**Consumes**: WS0 (content home + edge contract).

**Work**:

- Author the portable primer content at the home WS0 decided (repo-agnostic
  throughout; ends at the declared continuation edge).
- Author the canonical skill body per PDR-051; regenerate adapters via the
  skills generator; `pnpm skills:check` clean.
- First establish whether the existing `pnpm portability:check` / `pnpm
  skills:check` already detect repo-specific content in a canonical body. Build
  the guard below only if there is a genuine coverage gap — do not pre-emptively
  author a validator the existing gates already cover.
- Land a portability guard proving the primer body carries no repo-specific
  references — *only if the step above confirms the gap* (the one code TDD cycle:
  failing test naming a banned repo-specific token-class in the primer source,
  then the validator product code in `agent-tools`, one commit, tree green).

**Acceptance** (non-code + value-proxy + the code cycle):

1. The primer is invocable on a loader platform and readable on a non-loader
   platform via its canonical body.
2. `pnpm skills:check` and `pnpm portability:check` green; exactly two adapter
   surfaces (PDR-051).
3. The portability validator passes and fails correctly (test proves both).
4. A "new to agentic AI" persona walk-through (onboarding-expert) reaches the
   hand-off edge with no repo knowledge assumed, AND screens the primer body for
   host-*concept* leakage (e.g. "Practice", "claims", "threads", "plasmid"), not
   only repo-name tokens — a token-clean body can still smuggle ecosystem
   concepts, so the three-context test plus this screen are the real seam guard
   (a structural token validator cannot catch conceptual leak).

**Deterministic validation**:

```bash
pnpm skills:check
pnpm portability:check
pnpm test --filter @oaknational/agent-tools
```

---

## WS2 — Enhance existing surfaces (family wiring)

Wire the family into the surfaces that already exist; add no duplicated content.

**Consumes**: WS0 (the family + topology), WS1 (the primer to route to).

**Work**:

- `AGENT.md` §Orientation Requests: name the primer and the family; route "teach
  me to work with agentic AI" / "I'm new to agentic AI" → the primer; state the
  loader / non-loader invocation as the existing block does.
- `onboard-me` Branch F: may point a reader new to agentic AI at the primer as a
  suggested prelude — the agent conducting the walk curates what serves the
  newcomer (these are suggestions to a judging agent, not control-flow; there is
  no loop to engineer against). Keep the primer's OUTBOUND edge abstract
  ("continue into your repo's entry walk"), never naming `onboard-me`, so the
  portable body stays host-free; the host-bound `onboard-me` may name the primer
  freely. A hand-off *target* change, not a rewrite.
- `explain-repo`: keep its existing `onboard-me` hand-off primary and its
  executive-briefing crispness unchanged; mention the primer only as a one-line
  conditional ("if you're also new to working with AI agents in general, there's
  a primer"), not a co-equal depth path.
- `AGENT.md` discovery: a fresh "I'm new to agentic AI" enters the primer FIRST,
  then forward into `onboard-me`; "onboard me" / "explain this repo" land on the
  existing surfaces by default with no primer detour.
- `CONTRIBUTING.md` §Working with AI Coding Agents: point newcomers new to
  agentic AI at the primer.
- Skip path for the experienced: the primer is opt-in. The C2/C3 reader meets it
  only as a one-step-declinable, clearly-beginner-aimed prelude — never a forced
  choice.

**Acceptance** (non-code proof + discovery probe):

1. A fresh agent given "explain this repo" / "onboard me" / "teach me to work
   with agentic AI" routes to the correct family member via AGENT.md and the
   skill descriptions.
2. No teaching content is duplicated across members (router principle): each
   fact is authoritative in one doc and referenced elsewhere.
3. The primer's outbound edge does not name `onboard-me` (portability: the
   portable body stays host-free).
4. `pnpm skills:check`, `pnpm portability:check`, `pnpm markdownlint:root` green.

**Deterministic validation**:

```bash
pnpm skills:check
pnpm portability:check
pnpm markdownlint:root
```

---

## WS3 — Persona coverage check and scope-gated new-surface decision

Decide honestly whether the new-to-repo and hunting-specifics readers are served
by the primer plus existing surfaces, or whether a new repo-side surface is
genuinely needed. The WS1 primer is **not** subject to this gate — it is the
owner-ratified missing member (WS0); the gate covers any *additional* repo-side
surface beyond it.

**Consumes**: WS1 + WS2 (the integrated family).

**Work**:

- Run the three-persona walk-through using the onboarding register's
  persona-simulation methodology (via the `onboarding-expert` sub-agent): new to
  agentic AI; experienced, new to this repo and the Practice; experienced,
  hunting a specific detail.
- Record a disposition ledger — every persona gets a coverage verdict
  (`served-by-primer`, `served-by-existing-surface`, or `unserved → proposed
  surface`), with the evidence.
- If a reader is unserved, propose the minimal new repo-side surface and **stop
  for owner confirmation before building it** (feature-shaping is the owner's).

**Acceptance** (non-code proof):

1. Each of the three personas has a recorded coverage verdict with evidence.
2. Any proposed new surface is owner-gated, not built unilaterally.

---

## WS4 — Quality Gates

> See [Quality Gates component](../../templates/components/quality-gates.md)

```bash
pnpm build && pnpm type-check && pnpm lint:fix && pnpm format:root && \
pnpm markdownlint:root && pnpm skills:check && pnpm portability:check && \
pnpm repo-validators:check && pnpm test
```

---

## WS5 — Adversarial Review

> See [Adversarial Review component](../../templates/components/adversarial-review.md)

Invoke `docs-adr-expert`, `onboarding-expert`, `assumptions-expert`, and an
architecture reviewer for the portability-seam boundary. Document findings;
create a follow-up plan if BLOCKERs are found.

---

## WS6 — Documentation Propagation and Consolidation

> See [Documentation Propagation component](../../templates/components/documentation-propagation.md)

- Cross-reference the family from the onboarding register
  (`onboarding-simulations-public-alpha-readiness.md`).
- On archive, add the completed-plans index entry and clean cross-references.
- Run `/oak-consolidate-docs` to graduate settled content and update the
  practice exchange (the primer is a propagation candidate).
- **Preserve the value-rationale (User Stories).** At completion *and* at session
  handoff, analyse each user story's disposition (`served` / `deferred` /
  `obsoleted`) and conserve the *why-it-matters* of the served stories into their
  permanent home — the skill `description` and body, the ADR Context section, and
  the relevant README purpose lines — not only the *what* (acceptance met) and
  *how* (mechanism). A story's value narrative is the most easily lost and most
  valuable part of a plan; mining it forward is required, not optional. Deferred
  stories carry forward as forward intent; obsoleted stories are recorded as a
  learning, never harvested as if true.

---

## Risk Assessment

> See [Risk Assessment component](../../templates/components/risk-assessment.md)

| Risk | Mitigation |
|------|------------|
| Primer accretes repo specifics and stops being portable | WS1 portability validator gates the primer body; the hand-off edge is the only repo touch point |
| The family wiring duplicates teaching content | Router principle is a WS2 acceptance criterion; docs-adr-expert checks one-way content flow |
| Over-building a new repo-side surface no reader needs | WS3 scope-gate plus owner confirmation; default is reuse/enhance |
| Doctrine churn after artefacts are built | WS0 ratified before WS1+; downstream artefacts cite the ratified records |
| onboard-me Branch F change degrades the existing walk | onboarding-expert persona walk-through in WS3; explain-repo and onboard-me behaviour otherwise unchanged |

---

## Foundation Alignment

> See [Foundation Alignment component](../../templates/components/foundation-alignment.md)

- **principles.md** — the First Question (could it be simpler?) drives the
  reuse-first, scope-gated-new posture; long-term architectural excellence over
  expediency.
- **testing-strategy.md** — non-code deliverables use non-code proof per the
  proof contract; the WS1 portability validator is a real test+product-code
  cycle landed in one commit.
- **schema-first-execution.md** — not directly engaged (no SDK or schema work);
  the skills generator (PDR-051) is the generated-surface authority for adapters.
- **Plan-body first-principles check** — the *shape* clause fires at WS0 (the
  portability seam and router principle are the load-bearing structural claims,
  re-checked at authoring against PDR-035/051/009 and ADR-117/124/125); the
  *landing-path* clause fires per workstream (doc landings with non-code proof
  plus the WS1 code cycle); the *vendor-literal* clause is not engaged (no
  third-party vendor integration).

---

## Dependencies

**Blocking**: WS0 doctrine ratification (owner) blocks WS1+. WS1 blocks WS2's
routing entries. WS1 + WS2 block WS3.

**Beneficial**: none outstanding. Minimum shippable shape if the persona-sim
sub-agent is unavailable: run the three walk-throughs first-hand and record the
ledger directly.

**Related Plans**:

- `onboarding-simulations-public-alpha-readiness.md` — the canonical onboarding
  document; this plan cross-references it and reuses its persona methodology.
